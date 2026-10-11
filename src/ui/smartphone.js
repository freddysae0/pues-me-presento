// Móvil del jugador, disponible en exploración (modo 'play') a partir de la primera misión: tecla M o botón
// del HUD (#phone-button). Al abrirlo el juego pasa a modo 'phone': la simulación se detiene como en un menú
// (main.js no simula fuera de LIVE), y se cierra con M, Esc, el botón × o clic fuera.
// Apps (pestañas, teclas 1–3 o ←/→): Notificaciones, Encuesta («¿Quién va ganando?») y Programas.
// Lógica pura en src/state/phone.js; textos en src/data/phoneNews.js. Capa DOM propia (#smartphone, z 30),
// independiente de #overlay. Sin temporizadores: toda animación es CSS (y respeta prefers-reduced-motion).
import { phoneAvailable, unlockedNotifications, unreadNotifications, isRead, markRead, pollWithTrend, programsFor } from '../state/phone.js';
import { APPS, pollText, fmt } from '../data/phoneNews.js';
import { missions } from '../data/campaign.js';
import { escapeHTML as esc, icon, keycap, speakerColor } from './ui.js';
import { t, jobLabel, speakerLabel } from '../i18n/index.js';
import './smartphone.css';

const TABS = [
  { id: 'news', label: t('phone.tabNews'), title: t('phone.titleNews'), icon: 'chat' },
  { id: 'poll', label: t('phone.tabPoll'), title: t('phone.titlePoll'), icon: 'ballot' },
  { id: 'programs', label: t('phone.tabPrograms'), title: t('phone.titlePrograms'), icon: 'note' },
];
const PHONE_SVG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6.4" y="2.4" width="11.2" height="19.2" rx="2.8"/><rect class="hole" x="8.2" y="5" width="7.6" height="12.4" rx="1"/><path class="o hole" d="M10.8 19.4h2.4"/></svg>';
const ARROW = { up: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5l7 9H5z"/></svg>', down: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19l7-9H5z"/></svg>' };
const PLACES = { flat: t('phone.places.flat'), plaza: t('phone.places.plaza'), hq: t('phone.places.hq'), hall: t('phone.places.hall') };
const missionIndex = id => (id == null ? -1 : missions.findIndex(m => m.id === id));
// «Partido Paciente» → P, «Partido Sobrevivo…» → S: skips generic words so the marks differ.
const initial = (name = '?') => ((name.split(/\s+/).find(w => !/^(partido|movimiento|de|del|la|el|los|las)$/i.test(w)) || name).replace(/[^\p{L}\p{N}]/gu, '').charAt(0) || '?').toUpperCase();
const clip = (text, n) => (text.length > n ? `${text.slice(0, n - 1).trimEnd()}…` : text);

export class Smartphone {
  constructor(game) {
    this.game = game; this.tab = 'news'; this.known = null; this.stateRef = null; this.fresh = new Set(); this.dirty = false;
    this.button = document.createElement('button');
    Object.assign(this.button, { id: 'phone-button', type: 'button', tabIndex: -1, hidden: true });
    this.button.innerHTML = `${PHONE_SVG}<b class="phone-badge" hidden>0</b><kbd>M</kbd>`;
    this.button.addEventListener('click', () => { this.button.blur(); this.open(); });
    this.button.addEventListener('animationend', e => { if (e.animationName === 'phone-buzz') this.button.classList.remove('buzz'); });
    this.layer = document.createElement('div');
    Object.assign(this.layer, { id: 'smartphone', hidden: true });
    this.touch();
    this.layer.addEventListener('click', e => {
      if (e.target === this.layer || e.target.closest('#phone-close')) { this.close(); return; }
      const tab = e.target.closest('[data-tab]'); if (tab) this.setTab(tab.dataset.tab, true);
    });
    document.body.append(this.button, this.layer);
  }

  get isOpen() { return this.game.mode === 'phone'; }

  /** The mouse behaves like a finger: press and drag scrolls the screen (with a flick of inertia), a horizontal
   *  swipe changes app, and a drag never counts as a click. Wheel and keys keep working. */
  touch() {
    let drag = null, glide = 0, suppressClick = false;
    const stopGlide = () => { cancelAnimationFrame(glide); glide = 0; };
    this.stopGlide = stopGlide;
    this.layer.addEventListener('pointerdown', e => {
      const panel = e.target.closest('#sp-panel'); stopGlide();
      if (!panel || e.button !== 0) return;
      drag = { id: e.pointerId, panel, x: e.clientX, y: e.clientY, top: panel.scrollTop, moved: false, v: 0, lastY: e.clientY, lastT: e.timeStamp };
    });
    this.layer.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 6) { drag.moved = true; drag.horizontal = Math.abs(dx) > Math.abs(dy) * 1.4; drag.panel.setPointerCapture(e.pointerId); drag.panel.classList.add('dragging'); }
      if (!drag.moved) return;
      if (drag.horizontal) { drag.panel.style.transform = `translateX(${Math.max(-60, Math.min(60, dx * 0.35))}px)`; return; }
      drag.panel.scrollTop = drag.top - dy;
      const dt = Math.max(1, e.timeStamp - drag.lastT); drag.v = 0.8 * ((drag.lastY - e.clientY) / dt) + 0.2 * drag.v; drag.lastY = e.clientY; drag.lastT = e.timeStamp;
    });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null;
      if (!d.moved) return;
      suppressClick = true; d.panel.classList.remove('dragging'); d.panel.style.transform = '';
      if (d.horizontal) {
        const dx = e.clientX - d.x, i = TABS.findIndex(t => t.id === this.tab);
        if (Math.abs(dx) > 70) { this.setTab(TABS[(i + (dx < 0 ? 1 : TABS.length - 1)) % TABS.length].id); this.game.audio.ui('click'); }
        return;
      }
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(d.v) < 0.05) return;
      let v = d.v * 16, last = performance.now(); // px per frame at 60 fps
      const step = now => { const k = (now - last) / 16.7; last = now; d.panel.scrollTop += v * k; v *= Math.pow(0.94, k); glide = Math.abs(v) > 0.4 && this.isOpen ? requestAnimationFrame(step) : 0; };
      glide = requestAnimationFrame(step);
    };
    this.layer.addEventListener('pointerup', end); this.layer.addEventListener('pointercancel', end);
    // A drag that ends over a button must not press it.
    this.layer.addEventListener('click', e => { if (suppressClick) { suppressClick = false; e.stopPropagation(); e.preventDefault(); } }, true);
    this.layer.addEventListener('pointerdown', () => { suppressClick = false; }, true);
    this.layer.addEventListener('dragstart', e => e.preventDefault());
  }

  /** Badge, toast y vibración. Se llama en cada refreshHUD; solo anuncia novedades en modo 'play' (punto seguro). */
  sync() {
    const state = this.game.state, available = phoneAvailable(state);
    this.button.hidden = !available;
    const unlocked = available ? unlockedNotifications(state) : [];
    if (this.stateRef !== state) { this.stateRef = state; this.known = new Set(available ? unlocked.map(n => n.id) : []); }
    else if (this.game.mode === 'play') {
      const fresh = unlocked.filter(n => !this.known.has(n.id) && !isRead(state, n.id));
      fresh.forEach(n => this.known.add(n.id));
      if (fresh.length) this.announce(fresh);
    }
    this.badge(unlocked.filter(n => !isRead(state, n.id)).length);
  }
  badge(count) {
    const b = this.button.querySelector('.phone-badge');
    b.hidden = count === 0; b.textContent = count > 9 ? '9+' : String(count);
    this.button.setAttribute('aria-label', count ? t(count === 1 ? 'phone.unreadOne' : 'phone.unreadMany', { button: t('phone.button'), n: count }) : t('phone.button'));
    this.button.title = this.button.getAttribute('aria-label');
  }
  announce(list) {
    const last = list.at(-1);
    const text = list.length === 1 ? t('phone.toastOne', { from: last.from, text: clip(last.title || last.text, 72) }) : t('phone.toastMany', { n: list.length, from: last.from, text: clip(last.title || last.text, 48) });
    this.game.ui.toast(text, { icon: 'phone' });
    this.button.classList.remove('buzz'); void this.button.offsetWidth; this.button.classList.add('buzz');
  }

  // ------------------------------------------------------------ abrir / cerrar
  open() {
    if (this.game.mode !== 'play' || !phoneAvailable(this.game.state)) return false;
    this.fresh = new Set(unreadNotifications(this.game.state).map(n => n.id));
    this.game.setMode('phone'); this.game.audio.music.duck(true); this.game.audio.ui('click');
    this.layer.hidden = false; this.layer.innerHTML = this.shell();
    this.setTab(this.fresh.size ? 'news' : this.tab, true);
    return true;
  }
  close() {
    if (!this.isOpen) return false;
    this.stopGlide?.();
    this.layer.hidden = true; this.layer.innerHTML = '';
    if (document.activeElement && this.layer.contains(document.activeElement)) document.activeElement.blur();
    this.game.audio.ui('back'); this.game.setMode('play');
    // Reading notifications is the only thing the phone changes. Play mode is a safe point (no open transaction).
    if (this.dirty && !this.game.transaction) this.game.safeSave();
    this.dirty = false; this.sync();
    return true;
  }
  toggle() { return this.isOpen ? this.close() : this.open(); }

  setTab(id, focus = false) {
    if (!TABS.some(t => t.id === id) || !this.isOpen) return;
    this.tab = id; const t = TABS.find(t => t.id === id), root = this.layer;
    root.querySelector('#sp-title').textContent = t.title;
    root.querySelectorAll('[role=tab]').forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    const panel = root.querySelector('#sp-panel');
    panel.setAttribute('aria-labelledby', `sp-tab-${id}`); panel.dataset.tab = id;
    panel.innerHTML = id === 'news' ? this.newsHTML() : id === 'poll' ? this.pollHTML() : this.programsHTML();
    this.stopGlide?.(); panel.scrollTop = 0;
    if (id === 'news') { const n = markRead(this.game.state, unlockedNotifications(this.game.state).map(n => n.id)); if (n) this.dirty = true; this.badge(0); this.updateTabBadge(); }
    if (focus) root.querySelector(`#sp-tab-${id}`)?.focus({ preventScroll: true });
  }
  updateTabBadge() { const b = this.layer.querySelector('#sp-tab-news .sp-tab-badge'); if (b) b.hidden = true; }

  /** Teclado. Devuelve true si la tecla es del móvil (main.js deja de procesarla). */
  key(e) {
    if (this.game.mode === 'play' && e.code === 'KeyM') { e.preventDefault(); this.open(); return true; }
    if (!this.isOpen) return false;
    const i = TABS.findIndex(t => t.id === this.tab), panel = this.layer.querySelector('#sp-panel');
    if (e.code === 'Escape' || e.code === 'KeyM') { e.preventDefault(); this.close(); }
    else if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') { e.preventDefault(); this.setTab(TABS[(i + (e.code === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length].id, true); }
    else if (/^Digit[1-3]$/.test(e.code)) { e.preventDefault(); this.setTab(TABS[Number(e.code.at(-1)) - 1].id, true); }
    else if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.code)) { e.preventDefault(); const page = e.code.startsWith('Page') ? panel.clientHeight * 0.85 : 70; panel.scrollBy({ top: e.code.endsWith('Up') ? -page : page, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
    else if (e.code === 'Tab') { // focus stays inside the phone
      const items = [...this.layer.querySelectorAll('button:not([tabindex="-1"]), [tabindex="0"]')];
      const at = items.indexOf(document.activeElement);
      if (at === -1 || (e.shiftKey && at === 0) || (!e.shiftKey && at === items.length - 1)) { e.preventDefault(); items[e.shiftKey ? items.length - 1 : 0]?.focus(); }
    }
    return true; // every other key (E, WASD, Espacio…) is swallowed while the phone is out; Enter/Espacio still click the focused button natively
  }

  // ------------------------------------------------------------ marcado
  shell() {
    const s = this.game.state, step = s.completed.length, battery = Math.max(9, 94 - step * 6), unread = this.fresh.size;
    const tabs = TABS.map((t, i) => `<button role="tab" id="sp-tab-${t.id}" data-tab="${t.id}" aria-controls="sp-panel" aria-selected="false" tabindex="-1"><span class="sp-tab-icon">${icon(t.icon)}${t.id === 'news' && unread ? `<b class="sp-tab-badge">${unread > 9 ? '9+' : unread}</b>` : ''}</span><span>${t.label}</span><kbd>${i + 1}</kbd></button>`).join('');
    return `<section class="phone-shell smartphone" role="dialog" aria-modal="true" aria-labelledby="sp-title" style="--party:${esc(s.party?.color || '#ff6b4f')}">
  <div class="sp-status" aria-hidden="true"><span>${t('phone.status', { n: step + 1, place: esc(PLACES[s.scene] || '') })}</span><i class="sp-notch"></i><span class="sp-battery"><i style="--b:${battery}%"></i>${battery}%</span></div>
  <header class="sp-head"><h2 id="sp-title">${t('phone.titleNews')}</h2><button id="phone-close" class="sp-close" type="button" aria-label="${esc(t('phone.close'))}" title="${esc(t('phone.close'))}">${icon('close')}</button></header>
  <div class="sp-screen" id="sp-panel" role="tabpanel" tabindex="0"></div>
  <nav class="sp-tabs" role="tablist" aria-label="${esc(t('phone.apps'))}">${tabs}</nav>
  <p class="sp-keys" aria-hidden="true">${t('phone.keys', { tabs: `${keycap('1')}–${keycap('3')}`, arrows: keycap('←') + keycap('→'), updown: keycap('↑') + keycap('↓'), close: `${keycap('M')}/${keycap('Esc')}` })}</p>
</section>`;
  }

  newsHTML() {
    const list = unlockedNotifications(this.game.state).reverse();
    if (!list.length) return `<p class="sp-empty">${t('phone.empty')}</p>`;
    let day = null;
    return `<ol class="sp-notes">${list.map((n, i) => {
      const app = APPS[n.app] || APPS.press, d = missionIndex(n.after) + 2;
      const sep = d !== day ? `<li class="sp-day" aria-hidden="true"><span>${t('phone.day', { n: d })}</span></li>` : ''; day = d;
      const accent = n.app === 'group' || n.app === 'neighbors' ? speakerColor(n.from.split(' (')[0]) : n.color || app.color;
      return `${sep}<li class="sp-note app-${n.app}${this.fresh.has(n.id) ? ' is-new' : ''}" style="--c:${app.color};--who:${accent};--i:${Math.min(i, 8)}">
        <span class="sp-app">${icon(app.icon)}</span>
        <div class="sp-note-body"><p class="sp-note-meta"><b>${esc(app.label)}</b>${n.from !== app.label ? `<span>${esc(n.from)}</span>` : ''}</p>${this.fresh.has(n.id) ? `<em class="sp-new">${t('phone.fresh')}</em>` : ''}
        ${n.title ? `<strong>${esc(n.title)}</strong>` : ''}<p class="sp-note-text">${esc(n.text)}</p></div></li>`;
    }).join('')}</ol>`;
  }

  pollHTML() {
    const s = this.game.state, poll = pollWithTrend(s);
    const rows = [...poll.rows].sort((a, b) => (a.id === 'undecided') - (b.id === 'undecided') || b.share - a.share);
    const scale = Math.max(40, Math.ceil((Math.max(...rows.map(r => r.share)) + 4) / 5) * 5);
    const pct = v => `${(v / scale * 100).toFixed(2)}%`;
    const trend = r => r.delta === null ? (r.player ? `<small class="sp-trend new">${t('phone.trendNew')}</small>` : '') : r.delta > 0 ? `<small class="sp-trend up">${ARROW.up}+${fmt(r.delta)}</small>` : r.delta < 0 ? `<small class="sp-trend down">${ARROW.down}−${fmt(-r.delta)}</small>` : '<small class="sp-trend flat">=</small>';
    const gap = Math.max(0, 48 - poll.score);
    const verdict = !poll.hasParty ? `<p class="sp-verdict">${esc(pollText.noParty)}</p>`
      : poll.winning ? `<p class="sp-verdict good">${icon('trophy')}<span>${t('phone.winning', { score: poll.score })}</span></p>`
        : `<p class="sp-verdict bad">${icon('flag')}<span>${t('phone.losing', { leader: esc(poll.leader.party), score: poll.score, gap })}</span></p>`;
    return `<div class="sp-poll"><p class="sp-poll-head"><b>${t('phone.pollHead')}</b><small>${t('phone.pollSub', { pollster: esc(pollText.pollster) })}</small></p>${verdict}
      <ol class="sp-bars" style="--t:${pct(poll.threshold)}">${rows.map((r, i) => `<li class="sp-bar${r.player ? ' is-player' : ''}${r.id === 'undecided' ? ' is-undecided' : ''}" style="--c:${esc(r.color)};--v:${pct(r.share)};--i:${i}">
        <span class="sp-bar-name"><i class="sp-dot"></i><span><b>${esc(r.party)}</b>${r.player ? `<small>${t('phone.yourParty')}</small>` : r.id !== 'undecided' && r.name !== r.party ? `<small>${esc(r.name)}</small>` : ''}</span></span>
        <span class="sp-bar-num"><b>${t('format.percent', { value: fmt(r.share) })}</b>${trend(r)}</span>
        <span class="sp-track"><i></i></span></li>`).join('')}</ol>
      <p class="sp-legend"><i></i>${esc(pollText.threshold)}: ${t('format.percent', { value: fmt(poll.threshold) })}</p><p class="sp-fine">${esc(pollText.method)} ${t('phone.pollWeights')}</p></div>`;
  }

  programsHTML() {
    const { player, rivals } = programsFor(this.game.state);
    const mark = (name, color) => `<span class="sp-mark" style="--c:${esc(color)}">${esc(initial(name))}</span>`;
    const mine = player ? `<article class="sp-program is-player" style="--c:${esc(player.color)}"><header>${mark(player.name, player.color)}<span><b>${esc(player.name)}</b><small>${t('phone.quote', { text: esc(player.slogan) })}</small></span></header>
      ${player.proposal ? `<div class="sp-proposal"><small>${t('phone.proposal')}</small><b>${esc(player.proposal.title)}</b><p>${esc(player.proposal.compromise)}</p></div>` : `<p class="sp-empty">${t('phone.noProposal')}</p>`}
      ${player.team.length ? `<p class="sp-team">${player.team.map(m => `<span style="--c:${speakerColor(m.name)}">${esc(speakerLabel(m.name))} · ${esc(jobLabel(m.job))}</span>`).join('')}</p>` : ''}
      ${player.speech ? `<p class="sp-line"><small>${t('phone.firstSpeech')}</small>${player.speech.coherent ? t('phone.speechCoherent') : player.speech.everything ? t('phone.speechEverything') : t('phone.speechMixed')}</p>` : ''}
      ${player.decisions.map(d => `<p class="sp-line"><small>${esc(d.label.toUpperCase())}</small>${esc(d.title)}</p>`).join('')}</article>`
      : `<article class="sp-program is-player"><p class="sp-empty">${t('phone.noParty')}</p></article>`;
    const others = rivals.map(r => `<article class="sp-program" style="--c:${esc(r.color)}"><header>${mark(r.party, r.color)}<span><b>${esc(r.party)}</b><small>${esc(r.name)}</small></span></header>
      ${r.policies.length ? `<ul>${r.policies.map(p => `<li><small>${esc(p.topic.toUpperCase())}</small>${esc(p.text)}</li>`).join('')}</ul>` : `<p class="sp-empty">${t('phone.rivalsEmpty')}</p>`}</article>`).join('');
    return `<div class="sp-programs"><p class="sp-poll-head"><b>${t('phone.yourProgram')}</b></p>${mine}<p class="sp-poll-head"><b>${t('phone.others')}</b><small>${t('phone.othersSub')}</small></p>${others}</div>`;
  }
}
