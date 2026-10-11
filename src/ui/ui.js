// UI kit of "Pues me presento". Plain HTML strings + one UI class that owns the fixed DOM layers
// declared in index.html (#hud, #interaction, #dialogue, #overlay, #toast, #cinema).
// Visual language: cozy cartoon — cream paper, thick ink outline, chunky 3D buttons, round shapes.
// Every helper returns markup; ids are always passed in by the caller so tests keep stable selectors.
// See docs/UI.md for the component catalogue and the rules for cinematics/minigames.
import { debateCast } from '../data/parties.js';
import { script } from '../data/script/index.js';

export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const esc = escapeHTML;

// ---------------------------------------------------------------- icons
// 24×24 inline SVG, filled + stroked with currentColor. Paths marked `o` are outline-only.
const ICONS = {
  support: '<path d="M12 20.3s-7.6-4.6-7.6-10.3A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.6 10c0 5.7-7.6 10.3-7.6 10.3z"/>',
  credibility: '<path d="M12 3l7 2.8v5.4c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.8z"/><path class="o hole" d="M8.6 12.2l2.4 2.4 4.4-4.6"/>',
  organization: '<rect x="5" y="4.6" width="14" height="16.4" rx="2.6"/><rect class="hole" x="8.6" y="2.8" width="6.8" height="3.6" rx="1.2"/><path class="o hole" d="M8.6 11h6.8M8.6 14.4h6.8M8.6 17.8h3.8"/>',
  reach: '<path d="M4 10v4a1 1 0 0 0 1 1h2.6l7.4 4.4V4.6L7.6 9H5a1 1 0 0 0-1 1z"/><path d="M7.6 15l1.3 4.3h2.3L10 15.4"/><path class="o" d="M18 9.3a4 4 0 0 1 0 5.4M20.3 7a7.2 7.2 0 0 1 0 10"/>',
  pin: '<path d="M12 21.4s6.5-6 6.5-11.1a6.5 6.5 0 0 0-13 0c0 5.1 6.5 11.1 6.5 11.1z"/><circle class="hole" cx="12" cy="10.3" r="2.3"/>',
  play: '<path d="M8 5.2v13.6l10.6-6.8z"/>',
  sliders: '<path class="o" d="M4 7h9M19 7h1M4 17h3M13 17h7"/><circle cx="16" cy="7" r="2.6"/><circle cx="10" cy="17" r="2.6"/>',
  star: '<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
  check: '<path class="o" d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow: '<path class="o" d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>',
  back: '<path class="o" d="M19 12H6M11 6.5L5.5 12l5.5 5.5"/>',
  retry: '<path class="o" d="M19.4 12a7.4 7.4 0 1 1-2.2-5.3"/><path class="o" d="M19.7 3.9v4.5h-4.5"/>',
  home: '<path d="M12 4l8.4 7.4H18V20h-4.4v-5h-3.2v5H6v-8.6H3.6z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path class="o" d="M6 11.4a6 6 0 0 0 12 0M12 17.4V21M8.6 21h6.8"/>',
  phone: '<rect x="7" y="2.6" width="10" height="18.8" rx="2.6"/><path class="o hole" d="M10.6 18h2.8"/>',
  ballot: '<path d="M8.4 2.8h7.2v8.4H8.4z"/><path class="o hole" d="M10.2 7l1.4 1.4 2.4-2.6"/><rect x="3.6" y="10.4" width="16.8" height="10.6" rx="2.4"/><path class="o hole" d="M7.6 13.6h8.8"/>',
  book: '<path d="M4 5.4c2.6-1.5 5.4-1.5 8 .6 2.6-2.1 5.4-2.1 8-.6V19c-2.6-1.5-5.4-1.5-8 .6-2.6-2.1-5.4-2.1-8-.6z"/><path class="o hole" d="M12 6.2v13"/>',
  pause: '<rect x="6.4" y="5" width="4" height="14" rx="1.4"/><rect x="13.6" y="5" width="4" height="14" rx="1.4"/>',
  chair: '<path d="M7 3.4h10v8.2H7z"/><path d="M5.4 11.6h13.2v3H5.4z"/><path class="o" d="M7 14.6V21M17 14.6V21"/>',
  trophy: '<path d="M7 3.4h10v5.2a5 5 0 0 1-10 0z"/><path class="o" d="M7 5.6H4.4v1.4A3.6 3.6 0 0 0 8 10.6M17 5.6h2.6v1.4a3.6 3.6 0 0 1-3.6 3.6M12 13.6v4M8.4 20.6h7.2"/>',
  sparkle: '<path d="M12 2.6l1.9 6.5 6.5 1.9-6.5 1.9L12 19.4l-1.9-6.5-6.5-1.9 6.5-1.9z"/>',
  volume: '<path d="M4 9.4h3.6L12 5.6v12.8l-4.4-3.8H4z"/><path class="o" d="M15.6 9a4 4 0 0 1 0 6M18 6.6a7.4 7.4 0 0 1 0 10.8"/>',
  heart: '<path d="M12 20.3s-7.6-4.6-7.6-10.3A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.6 10c0 5.7-7.6 10.3-7.6 10.3z"/>',
  chat: '<path d="M4 6.6A3 3 0 0 1 7 3.6h10a3 3 0 0 1 3 3v6.8a3 3 0 0 1-3 3h-6.4L6 20.2v-3.8A3 3 0 0 1 4 13.4z"/>',
  note: '<path d="M5 3.6h10.4L19 7.2V20.4H5z"/><path class="o hole" d="M8.4 10h7.2M8.4 13.4h7.2M8.4 16.8h4.4"/>',
  flag: '<path class="o" d="M5.6 21V3.6"/><path d="M5.6 4.4h12l-2.6 4 2.6 4h-12z"/>',
  close: '<path class="o" d="M6 6l12 12M18 6L6 18"/>',
};
/** Inline SVG icon. `icon('reach')`, `icon('star', 'big')`. Unknown names fall back to a sparkle. */
export function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.sparkle}</svg>`;
}

// ---------------------------------------------------------------- stats
/** The four campaign stats, in HUD order. `threshold` is the electoral bar shown as a tick. */
export const STATS = [
  { key: 'support', label: 'Apoyo', icon: 'support', color: 'var(--c-support)' },
  { key: 'credibility', label: 'Credibilidad', icon: 'credibility', color: 'var(--c-cred)' },
  { key: 'organization', label: 'Organización', icon: 'organization', color: 'var(--c-org)' },
  { key: 'reach', label: 'Alcance', icon: 'reach', color: 'var(--c-reach)' },
];
const statByKey = Object.fromEntries(STATS.map(s => [s.key, s]));

/** Small coloured chips for an effect object: statChips({support: 8, credibility: -3}). */
export function statChips(effect = {}, className = '') {
  const items = STATS.filter(s => effect[s.key]).map(s => {
    const v = effect[s.key];
    return `<span class="chip ${v > 0 ? 'up' : 'down'}" style="--c:${s.color}" title="${s.label}">${icon(s.icon)}<b>${v > 0 ? '+' : '−'}${Math.abs(v)}</b><span class="sr">${s.label}</span></span>`;
  });
  return items.length ? `<span class="chips ${className}">${items.join('')}</span>` : '';
}

/** Big result tiles (speech result, election): resultStats({support: +4, ...}, {signed: true}). */
export function resultStats(values, { signed = true } = {}) {
  return `<div class="result-stats">${Object.entries(values).map(([k, v], i) => {
    const s = statByKey[k] || { label: k, icon: 'star', color: 'var(--sun)' };
    const text = signed ? `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v)}` : v;
    return `<div style="--c:${s.color};--i:${i}">${icon(s.icon)}<strong>${text}</strong><span>${s.label.toUpperCase()}</span></div>`;
  }).join('')}</div>`;
}

// ---------------------------------------------------------------- building blocks
/** Keyboard key cap: keycap('E'), keycap('Espacio', 'wide'). */
export const keycap = (key, className = '') => `<kbd class="${className}">${esc(key)}</kbd>`;

/** Generic card. Signature kept from the original UI: panel(eyebrow, title, body, footer?, options?).
 *  options.variant: 'paper' (default) | 'board' (corkboard) | 'form' | 'dark' | 'win' | 'loss'
 *  options.icon: icon name shown in the eyebrow ribbon. Body/title are trusted HTML. */
export function panel(eyebrow, title, body, footer = '', { variant = 'paper', icon: iconName = '', className = '' } = {}) {
  return `<section class="panel panel-${variant} ${className}">${eyebrow ? `<span class="eyebrow">${iconName ? icon(iconName) : ''}${eyebrow}</span>` : ''}<h1>${title}</h1>${body}${footer}</section>`;
}

/** Keyboard entry point for a freshly shown screen. Option lists start with nothing highlighted, so a stray
 *  Enter/Space never picks an option: the container takes focus and Tab/1–9 reach the options.
 *  Screens without options focus their first button or input as before. */
export function focusEntry(root) {
  if (root.querySelector('.choice-list button, [data-choice]')) { root.tabIndex = -1; root.focus({ preventScroll: true }); return; }
  root.querySelector('button:not([disabled]), input')?.focus();
}

/** Numbered game buttons. items: [{id, title, detail?, effect?, extra?}]. Keys 1–4 click them (main.js).
 *  Title/detail are escaped; `extra` is trusted HTML appended to the body. */
export function choiceList(items, { className = '' } = {}) {
  return `<div class="choice-list ${className}">${items.map((c, i) => `<button id="${c.id}" style="--i:${i}"><kbd>${i + 1}</kbd><span class="choice-body"><b>${esc(c.title)}</b>${c.detail ? `<small>${esc(c.detail)}</small>` : ''}${c.extra || ''}${c.effect ? statChips(c.effect) : ''}</span></button>`).join('')}</div>`;
}

/** Row of buttons. buttons: [{id, label, kind?: 'primary'|'secondary'|'danger', icon?, type?}] */
export function buttons(list, className = '') {
  return `<div class="buttons ${className}">${list.map(b => `<button id="${b.id}" class="${b.kind || 'secondary'}"${b.type ? ` type="${b.type}"` : ''}>${b.icon ? icon(b.icon) : ''}<span>${b.label}</span></button>`).join('')}</div>`;
}

/** Horizontal gauge for minigames: meterBar(0.6, {label:'Nervios', color:'var(--tomato)', id:'nerves'}).
 *  Update later with setMeter(element, value). */
export function meterBar(value, { label = '', color = 'var(--grass)', id = '' } = {}) {
  return `<div class="meter-bar" ${id ? `id="${id}"` : ''} style="--c:${color};--v:${Math.max(0, Math.min(1, value))}">${label ? `<span>${esc(label)}</span>` : ''}<i></i></div>`;
}
export const setMeter = (el, value) => el?.style.setProperty('--v', Math.max(0, Math.min(1, value)));

/** Timing minigame track. The game moves `.timing-cursor` with style.left = `${pos*99}%`.
 *  zone: [start, end] in 0..1 (perfect band is the middle third of the zone). */
export function timingTrack({ zone = [0.42, 0.58], id = '' } = {}) {
  const [a, b] = zone;
  return `<div class="timing-track" ${id ? `id="${id}"` : ''} style="--a:${a * 100}%;--b:${(b - a) * 100}%"><div class="timing-target"><i></i></div><div class="timing-cursor">${icon('mic')}</div></div>`;
}

/** Colour for a speaker's name ribbon (dialogue, call, subtitles). */
const SPEAKER_COLORS = { 'Tú': '#ff8a5b', Marisa: '#b07cd8', Paco: '#7fae5b', Lola: '#ef7a5a', Dani: '#5fb2e6', Nico: '#e8b23a' };
for (const c of debateCast(script.rivals)) SPEAKER_COLORS[c.name] ??= c.color; // debate rivals wear their party colour
export function speakerColor(name = '') {
  if (SPEAKER_COLORS[name]) return SPEAKER_COLORS[name];
  let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h} 62% 62%)`;
}

const PLACES = { flat: 'EL PISO', plaza: 'EL BARRIO', hq: 'LA SEDE', hall: 'SALÓN MULTIUSOS' };

// ---------------------------------------------------------------- UI layer manager
export class UI {
  constructor() {
    this.overlay = document.querySelector('#overlay'); this.hud = document.querySelector('#hud'); this.prompt = document.querySelector('#interaction'); this.toastElement = document.querySelector('#toast');
    this.cinema = document.querySelector('#cinema'); this.disposers = [];
    this.toastElement.addEventListener('animationend', e => { if (e.animationName === 'toast-life') this.toastElement.classList.remove('visible'); });
  }
  /** Replace the overlay content. className styles the backdrop ('menu', 'speech-overlay', 'loading-screen', 'loss', 'win'). */
  show(html, className = '') {
    this.dispose(); this.overlay.className = className; this.overlay.innerHTML = html; this.overlay.hidden = false;
    queueMicrotask(() => focusEntry(this.overlay));
  }
  hide() { this.dispose(); this.overlay.hidden = true; this.overlay.innerHTML = ''; this.overlay.className = ''; }
  /** Register cleanup for things mounted inside the current overlay (3D portraits, timers…). Runs on next show()/hide(). */
  onDispose(fn) { this.disposers.push(fn); }
  dispose() { const list = this.disposers; this.disposers = []; list.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); }
  /** Pause support: take the overlay out (DOM nodes kept alive, inputs and callbacks intact) and put it back later. */
  stash() { const s = { nodes: [...this.overlay.childNodes], className: this.overlay.className, hidden: this.overlay.hidden, disposers: this.disposers }; this.disposers = []; return s; }
  restore(s) { this.dispose(); this.overlay.replaceChildren(...s.nodes); this.overlay.className = s.className; this.overlay.hidden = s.hidden; this.disposers = s.disposers; }
  on(id, fn) { this.overlay.querySelector(`#${id}`)?.addEventListener('click', fn); }

  /** Full-screen transition card with a bouncing ballot box. */
  transition(text) { this.show(`<div class="loader"><div class="loader-icon">${icon('ballot')}</div><p class="loading">${esc(text)}</p><div class="loader-dots"><i></i><i></i><i></i></div></div>`, 'loading-screen'); }

  /** Pill notification. Lifetime is a CSS animation, so it freezes while paused. kind: 'info' | 'good' | 'bad'. */
  toast(text, { icon: iconName = 'chat', kind = 'info' } = {}) {
    const t = this.toastElement; t.classList.remove('visible'); t.dataset.kind = kind;
    t.innerHTML = `<span class="toast-icon">${icon(iconName)}</span><span class="toast-text">${esc(text)}</span>`;
    void t.offsetWidth; t.classList.add('visible');
  }

  /** HUD: built once, then patched so that changes can animate (stat bump, new objective). */
  updateHUD(state, mission) {
    this.hud.hidden = false;
    if (!this.hud.querySelector('.hud-brand')) this.buildHUD();
    const h = this.hud, party = state.party;
    h.style.setProperty('--party', party?.color || 'var(--tomato)');
    h.querySelector('.hud-party').textContent = party?.name || 'Pues me presento';
    h.querySelector('.hud-mark').textContent = (party?.name || 'P').trim().charAt(0).toUpperCase();
    h.querySelector('.hud-place').textContent = PLACES[state.scene] || '';
    for (const s of STATS) {
      const el = h.querySelector(`[data-stat="${s.key}"]`), v = state[s.key], old = Number(el.dataset.value);
      el.style.setProperty('--v', `${Math.max(0, Math.min(100, v))}%`); el.querySelector('b').textContent = v;
      el.setAttribute('aria-label', `${s.label}: ${v} de 100`);
      if (el.dataset.value !== undefined && !Number.isNaN(old) && old !== v) this.bump(el, v - old);
      el.dataset.value = v;
    }
    const obj = h.querySelector('.objective');
    const step = String(Math.min(state.completed.length + 1, 15)).padStart(2, '0');
    if (obj.dataset.mission !== mission.id) {
      obj.dataset.mission = mission.id;
      obj.querySelector('.obj-step').textContent = `${step} / 15`;
      obj.querySelector('strong').textContent = mission.title; obj.querySelector('p').textContent = mission.objective;
      obj.classList.remove('fresh'); void obj.offsetWidth; obj.classList.add('fresh');
    }
  }
  buildHUD() {
    this.hud.innerHTML = `<div class="hud-brand"><span class="hud-mark" aria-hidden="true">P</span><span class="hud-name"><span class="hud-party"></span><small>${icon('pin')}<span class="hud-place"></span></small></span></div>
<div class="stats" role="group" aria-label="Estado de la campaña">${STATS.map(s => `<div class="stat" data-stat="${s.key}" style="--c:${s.color}" title="${s.label}"><span class="stat-icon">${icon(s.icon)}</span><span class="stat-body"><span class="stat-label">${s.label}</span><b>0</b><span class="stat-bar"><i></i><em title="Umbral 48"></em></span></span></div>`).join('')}</div>
<div class="objective"><span class="obj-tab">${icon('flag')}MISIÓN <span class="obj-step"></span></span><strong></strong><p></p></div>
<div class="controls" aria-label="Controles"><span>${keycap('W')}${keycap('A')}${keycap('S')}${keycap('D')} mover</span><span>${keycap('⇧')} correr</span><span>${keycap('Espacio')} saltar</span><span>${keycap('E')} hablar / usar</span><span>${keycap('M')} móvil</span><span>${keycap('Esc')} pausa</span></div>`;
  }
  bump(el, delta) {
    el.classList.remove('bump-up', 'bump-down'); void el.offsetWidth; el.classList.add(delta > 0 ? 'bump-up' : 'bump-down');
    const f = document.createElement('span'); f.className = `stat-float ${delta > 0 ? 'up' : 'down'}`; f.textContent = `${delta > 0 ? '+' : '−'}${Math.abs(delta)}`;
    f.addEventListener('animationend', () => f.remove()); el.append(f);
  }

  /** Interaction prompt over the world. Called every frame: only touches the DOM when the target changes. */
  interaction(entity, allowed) {
    const key = entity ? `${entity.id}|${entity.label}|${allowed}` : '';
    if (key === this.promptKey && this.prompt.hidden === !entity) return;
    this.promptKey = key; this.prompt.hidden = !entity;
    if (entity) {
      this.prompt.classList.toggle('locked', !allowed);
      this.prompt.innerHTML = `<kbd>E</kbd><span>${escapeHTML(entity.label)}${allowed ? '' : '<small>Primero termina el objetivo actual</small>'}</span>`;
    }
  }

  // ------------------------------------------------------------ cinematic layer (#cinema)
  /** Letterbox bars for cutscenes. letterbox(true) / letterbox(false). */
  letterbox(on) { this.cinema.classList.toggle('letterbox', !!on); }
  /** Bottom subtitle line; subtitle(null) clears. Use for cutscenes where no 3D balloon makes sense. */
  subtitle(speaker, text) {
    const el = this.cinema.querySelector('.subtitle');
    if (!text) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false; el.style.setProperty('--speaker', speakerColor(speaker || ''));
    el.innerHTML = `${speaker ? `<b>${esc(speaker)}</b>` : ''}<span>${esc(text)}</span>`;
  }
  /** Chapter / milestone title card. Removes itself when its CSS animation ends (frozen while paused). */
  banner(eyebrow, title, { icon: iconName = 'star', kind = '' } = {}) {
    const b = document.createElement('div'); b.className = `banner ${kind}`; b.setAttribute('role', 'status');
    b.innerHTML = `<span class="banner-icon">${icon(iconName)}</span><small>${esc(eyebrow)}</small><strong>${esc(title)}</strong>`;
    b.addEventListener('animationend', e => { if (e.animationName === 'banner-life') b.remove(); });
    this.cinema.append(b); return b;
  }
  /** Confetti burst (victory, big success). Pieces remove themselves. */
  confetti(count = 70) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['var(--sun)', 'var(--tomato)', 'var(--grass)', 'var(--sky)', 'var(--c-reach)', '#fff'];
    const box = document.createElement('div'); box.className = 'confetti';
    box.innerHTML = Array.from({ length: count }, (_, i) => `<i style="--x:${Math.random() * 100}vw;--d:${(Math.random() * 1.4).toFixed(2)}s;--r:${Math.round(Math.random() * 720 - 360)}deg;--c:${colors[i % colors.length]};--s:${(0.6 + Math.random() * 0.8).toFixed(2)}"></i>`).join('');
    let left = count; box.addEventListener('animationend', () => { if (--left <= 0) box.remove(); });
    this.cinema.append(box);
  }
}
