// Shared shell for campaign minigames: intro card -> play -> result card, with retry (R) and skip (X).
// Nothing touches the campaign state until onCommit: abandoning (pause -> menu, reload) changes nothing,
// and skipping commits an empty bonus. main.js only calls update(dt) in 'minigame' mode, so pause freezes it.
import { panel, icon, keycap, buttons, resultStats } from '../ui/ui.js';

/** mg: { id, eyebrow, title, intro, howto: [[keysHTML, text]], movement?, stage(), reset(), hud(), mount(root), update(dt), key(e), result(), dispose(), debug?() } */
export function runMinigame(game, mg, onCommit) {
  const player = game.player, home = { pos: player.body.position.clone(), rot: player.character.root.rotation.y };
  let phase = 'intro', last = null;
  const ctl = {
    id: mg.id,
    get phase() { return phase; },
    movement: () => phase === 'play' && !!mg.movement,
    update(dt) { if (phase !== 'play') { mg.idle?.(dt); return; } mg.update(dt); if (mg.done) finish(); },
    key(e) {
      const code = e.code;
      if (phase === 'intro' && (code === 'Space' || code === 'Enter')) { e.preventDefault(); start(); return; }
      if (phase === 'result' && (code === 'Space' || code === 'Enter')) { e.preventDefault(); commit(last); return; }
      if ((phase === 'play' || phase === 'result') && code === 'KeyR') { e.preventDefault(); start(); return; }
      if ((phase === 'intro' || phase === 'play') && code === 'KeyX') { e.preventDefault(); skip(); return; }
      if (phase === 'play') mg.key(e);
    },
    abort() { if (phase !== 'done') { phase = 'done'; cleanup(); } },
    debug: () => ({ id: mg.id, phase, ...(mg.debug?.() || {}) }),
  };
  game.minigame = ctl; game.setMode('minigame'); if (game.world.marker) game.world.marker.isVisible = false; mg.stage();
  intro();

  function intro() {
    phase = 'intro';
    const howto = `<ul class="mg-howto">${mg.howto.map(([keys, text]) => `<li><span>${keys}</span><b>${text}</b></li>`).join('')}</ul>`;
    game.ui.show(panel(mg.eyebrow, mg.title, `<p>${mg.intro}</p>${howto}<p class="fine">Sin penalización: puedes repetir con ${keycap('R')} o saltarlo con ${keycap('X')} (sin bonus). Solo cuenta el resultado que aceptes.</p>` + buttons([{ id: 'mg-start', kind: 'primary', icon: 'play', label: `Empezar ${keycap('Espacio')}` }, { id: 'mg-skip', icon: 'arrow', label: `Saltar ${keycap('X')}` }]), '', { icon: 'sparkle', className: 'mg-card' }), 'minigame-overlay centered');
    game.ui.on('mg-start', start); game.ui.on('mg-skip', skip);
  }
  function start() {
    phase = 'play'; game.playerGesture = null; mg.reset();
    game.ui.show(`<div class="mg-hud mg-${mg.id}">${mg.hud()}</div>`, 'minigame-overlay');
    const root = game.ui.overlay.querySelector('.mg-hud');
    root.querySelectorAll('button').forEach(b => b.setAttribute('tabindex', '-1'));
    queueMicrotask(() => document.activeElement?.blur?.()); // Space/arrows must reach the game, not a focused button
    mg.mount(root); game.ui.on('mg-skip-play', skip);
    player.setEnabled(!!mg.movement);
  }
  function finish() {
    phase = 'result'; player.setEnabled(false); game.playerGesture = null;
    last = mg.result();
    game.ui.show(panel(mg.eyebrow, last.title, `<p>${last.text}</p>${Object.keys(last.bonus).length ? resultStats(last.bonus) : `<p class="note">${icon('chat')}<span>Esta vez no suma nada. Tampoco resta: puedes repetir.</span></p>`}<p class="fine"><span class="score-badge">${icon('star')} ${last.badge}</span> El bonus se aplica una sola vez, al aceptar.</p>` + buttons([{ id: 'mg-accept', kind: 'primary', icon: 'check', label: `Aceptar ${keycap('Espacio')}` }, { id: 'mg-retry', icon: 'retry', label: `Repetir ${keycap('R')}` }]), '', { icon: 'star', className: 'mg-card' }), 'minigame-overlay centered');
    game.ui.on('mg-accept', () => commit(last)); game.ui.on('mg-retry', start);
    if (last.great) game.ui.confetti(40);
  }
  function skip() { commit({ skipped: true, score: 0, bonus: {} }); }
  function commit(result) {
    if (phase === 'done') return;
    phase = 'done'; cleanup(); game.ui.hide(); onCommit(result);
  }
  function cleanup() {
    mg.dispose(); if (game.minigame === ctl) game.minigame = null;
    game.playerGesture = null; player.setEnabled(false);
    if (!game.world.scene?.isDisposed) { player.body.position.copyFrom(home.pos); player.character.root.rotation.y = home.rot; }
    game.ui.subtitle(null);
  }
  return ctl;
}
