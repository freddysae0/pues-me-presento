// Móvil del protagonista (misión 'phone'): feed vertical de «unratito» con scroll tipo TikTok.
// Contenido en src/data/feed.js, ilustraciones en ./feedArt.js, bucles de audio en ../audio/feedLoops.js.
// Controles: rueda, arrastre/swipe vertical (pointer events), ↓/S/Espacio/AvPág siguiente, ↑/W/RePág anterior,
// doble clic/toque = corazón. La noticia es el último vídeo: no se puede pasar de ella y solo entonces se
// habilita el botón #idea (el que completa la misión; lo conecta experiences.js).
// Pausa: el overlay sale del DOM (ui.stash) y game.mode deja de ser 'modal', así que ni la barra de progreso,
// ni el secuenciador, ni las teclas avanzan; las animaciones CSS quedan con animation-play-state: paused.
import { feed, feedHint } from '../data/feed.js';
import { feedArt } from './feedArt.js';
import { FeedLoop } from '../audio/feedLoops.js';
import { escapeHTML as esc, icon } from './ui.js';
import './phone.css';

const SHARE = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.4 4.2l7.4 7-7.4 7v-4.1C8.6 14 5.6 15.6 3.2 19.4 4 13.6 7.2 9.4 13.4 8.4z"/></svg>';
const NOTE = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 17.4V5.6l10-2.2v11.8"/><circle cx="6.6" cy="17.6" r="2.8"/><circle cx="16.6" cy="15.4" r="2.8"/></svg>';
const LOCK_MS = 420, QUIET_MS = 160, DRAG_PX = 56, WHEEL_PX = 28, DOUBLE_TAP_MS = 320;

const slideHTML = (item, i) => {
  const tags = item.tags.map(t => `<span class="hashtag">#${esc(t)}</span>`).join(' ');
  const newsTop = item.news ? `<div class="news-head"><span class="tag news-tag">${esc(item.tag)}</span><h1>${item.title.map(esc).join('<br>')}</h1><p>${esc(item.body)}</p></div>` : '';
  const cta = item.news ? `<div class="news-cta"><p>${esc(item.aside)}</p><button class="primary" id="idea" disabled>${icon('sparkle')}<span>${esc(item.cta)}</span></button></div>` : '';
  const hint = i === 0 ? `<div class="swipe-hint" aria-hidden="true"><span class="swipe-hand">${icon('arrow')}</span><b>${esc(feedHint.swipe)}</b><small>${esc(feedHint.keys)}</small></div>` : '';
  return `<article class="feed-slide${item.news ? ' is-news' : ''}" data-video="${item.id}" style="--i:${i}" role="group" aria-roledescription="vídeo" aria-label="Vídeo ${i + 1} de ${feed.length}: @${esc(item.user)}" inert aria-hidden="true">
    ${feedArt(item)}<div class="feed-shade" aria-hidden="true"></div>${newsTop}
    <div class="feed-rail" aria-hidden="true"><span class="rail-avatar" style="--c:${item.avatar}">${esc(item.user[0].toUpperCase())}<i>+</i></span><span class="rail-like">${icon('heart')}<b>${esc(item.likes)}</b></span><span>${icon('chat')}<b>${esc(item.comments)}</b></span><span>${SHARE}<b>${esc(item.shares)}</b></span><span class="rail-disc" style="--c:${item.avatar}"></span></div>
    <div class="feed-meta"><b class="feed-user">@${esc(item.user)}</b><p class="feed-caption">${esc(item.caption)} ${tags}</p><p class="feed-sound">${NOTE}<span><span class="marquee">${esc(item.sound)} · ${esc(item.sound)} · </span></span></p></div>
    ${cta}${hint}<div class="feed-progress" aria-hidden="true"><i></i></div></article>`;
};

export function feedMarkup() {
  return `<section class="phone-shell phone-feed" aria-label="Móvil: unratito"><div class="phone-top"><b>unratito</b><span class="phone-tabs"><small>Siguiendo</small><small class="on">Para ti</small></span></div>
    <div class="feed" tabindex="0" role="region" aria-roledescription="feed de vídeos" aria-label="Vídeos de unratito. Desliza, usa la rueda o la flecha abajo para ver el siguiente." data-index="0">
      <div class="feed-track">${feed.map(slideHTML).join('')}</div></div>
    <p class="sr feed-live" aria-live="polite"></p></section>`;
}

/** Monta el feed en el overlay ya mostrado. Devuelve un pequeño control (lo usan las pruebas vía DOM). */
export function mountFeed(game) {
  const root = game.ui.overlay, viewport = root.querySelector('.feed'), track = root.querySelector('.feed-track');
  const slides = [...root.querySelectorAll('.feed-slide')], live = root.querySelector('.feed-live'), idea = root.querySelector('#idea');
  const sound = new FeedLoop(game.audio);
  let index = -1, lockedUntil = 0, wheel = 0, time = 0, last = performance.now(), raf = 0, drag = null, lastTap = null;
  const active = () => game.mode === 'modal' && viewport.isConnected && !document.hidden;
  game.audio.music.duck(true);

  const go = next => {
    if (next < 0 || next >= feed.length) { bump(next < 0 ? 'top' : 'end'); return; }
    if (next === index) { snap(); return; }
    if (index >= 0) lockedUntil = performance.now() + (matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : LOCK_MS);
    index = next; time = 0; wheel = 0;
    snap();
    slides.forEach((s, i) => { const on = i === index; s.classList.toggle('active', on); s.inert = !on; s.setAttribute('aria-hidden', String(!on)); s.style.setProperty('--p', 0); });
    viewport.dataset.index = index; viewport.scrollTop = 0;
    if (index > 0) root.querySelector('.swipe-hint')?.classList.add('gone');
    const item = feed[index]; live.textContent = `Vídeo ${index + 1} de ${feed.length}. @${item.user}. ${item.alt}`;
    sound.play(item.loop);
    if (item.news) { idea.disabled = false; idea.focus({ preventScroll: true }); }
  };
  const snap = (offset = 0) => { track.style.transform = `translateY(calc(${-index * 100}% + ${offset}px))`; };
  const bump = where => {
    track.classList.remove('bump-top', 'bump-end'); void track.offsetWidth; track.classList.add(`bump-${where}`);
    if (where === 'end') live.textContent = feedHint.end;
  };
  track.addEventListener('animationend', () => track.classList.remove('bump-top', 'bump-end'));
  const step = dir => { if (!active() || performance.now() < lockedUntil) return; go(index + dir); };

  // Rueda / trackpad: acumula, avanza un vídeo y bloquea mientras sigan llegando eventos (inercia).
  const onWheel = e => {
    if (!active()) return; e.preventDefault();
    const now = performance.now();
    if (now < lockedUntil) { lockedUntil = Math.max(lockedUntil, now + QUIET_MS); return; }
    wheel += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    if (Math.abs(wheel) >= WHEEL_PX) step(Math.sign(wheel));
  };
  // Arrastre vertical con snap; captura el puntero solo cuando ya es un arrastre (los clics a botones siguen funcionando).
  const onDown = e => { if (!active() || (e.pointerType === 'mouse' && e.button !== 0)) return; drag = { id: e.pointerId, y: e.clientY, x: e.clientX, dy: 0, moving: false }; };
  const onMove = e => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dy = e.clientY - drag.y;
    if (!drag.moving && Math.abs(drag.dy) > 8) { drag.moving = true; viewport.setPointerCapture?.(e.pointerId); track.classList.add('dragging'); }
    if (drag.moving) { const edge = (index === 0 && drag.dy > 0) || (index === feed.length - 1 && drag.dy < 0); snap(edge ? drag.dy * .3 : drag.dy); }
  };
  const onUp = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; track.classList.remove('dragging');
    if (d.moving) { if (d.dy <= -DRAG_PX && active() && index < feed.length - 1) go(index + 1); else if (d.dy >= DRAG_PX && active() && index > 0) go(index - 1); else snap(); lastTap = null; return; }
    if (e.target.closest('button')) return;
    const now = performance.now();
    if (lastTap && now - lastTap.t < DOUBLE_TAP_MS && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30) { heart(e.clientX, e.clientY); lastTap = null; } else lastTap = { t: now, x: e.clientX, y: e.clientY };
  };
  const onCancel = () => { if (drag) { drag = null; track.classList.remove('dragging'); snap(); } };
  const heart = (x, y) => {
    if (!active()) return;
    const slide = slides[index], box = slide.getBoundingClientRect(), h = document.createElement('span');
    h.className = 'burst-heart'; h.innerHTML = icon('heart'); h.style.left = `${x - box.left}px`; h.style.top = `${y - box.top}px`; h.style.setProperty('--r', `${Math.round(Math.random() * 30 - 15)}deg`);
    h.addEventListener('animationend', () => h.remove()); slide.append(h);
    slide.querySelector('.rail-like')?.classList.add('liked');
    game.audio.ui('click');
  };
  const NEXT = ['ArrowDown', 'KeyS', 'Space', 'PageDown'], PREV = ['ArrowUp', 'KeyW', 'PageUp'];
  const onKey = e => {
    if (!active() || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
    const onButton = document.activeElement?.tagName === 'BUTTON' && root.contains(document.activeElement);
    if (onButton && (e.code === 'Space' || e.code === 'Enter')) return; // el botón de la noticia se pulsa con Espacio/Enter
    if (NEXT.includes(e.code)) { e.preventDefault(); step(1); } else if (PREV.includes(e.code)) { e.preventDefault(); step(-1); }
  };

  root.addEventListener('wheel', onWheel, { passive: false });
  viewport.addEventListener('pointerdown', onDown); viewport.addEventListener('pointermove', onMove);
  viewport.addEventListener('pointerup', onUp); viewport.addEventListener('pointercancel', onCancel);
  window.addEventListener('keydown', onKey);

  // Reloj propio del feed: solo avanza en modo 'modal' (en pausa, el overlay ni siquiera está en el DOM).
  const frame = now => {
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (active() && index >= 0) {
      time += dt; const item = feed[index];
      slides[index].style.setProperty('--p', ((time % item.duration) / item.duration).toFixed(4));
      sound.tick();
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  game.ui.onDispose(() => {
    cancelAnimationFrame(raf); sound.dispose(); window.removeEventListener('keydown', onKey); root.removeEventListener('wheel', onWheel);
    game.audio.music.duck(false);
  });
  go(0);
  // ui.show() enfoca el primer botón en un microtask; el botón de la noticia está deshabilitado, así que enfocamos el feed.
  queueMicrotask(() => queueMicrotask(() => { if (index < feed.length - 1) viewport.focus({ preventScroll: true }); }));
  return { go: i => go(i), index: () => index };
}
