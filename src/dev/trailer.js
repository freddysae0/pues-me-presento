// Modo tráiler (solo desarrollo: lo carga src/dev/debug.js, que main.js importa únicamente con import.meta.env.DEV).
// Ejecuta una lista declarativa de planos (formato completo en docs/trailer/PIPELINE.md): prepara estado, escena y UI,
// mueve la cámara, hace actuar a los personajes, superpone tarjetas y transiciones y registra los sonidos que el
// juego emite para mezclarlos después offline. Funciona en tiempo real (vista previa) y fotograma a fotograma con el
// reloj virtual de tools/trailer/vclock.js (grabación: tools/trailer/record.mjs).
//   gameDebug.trailer.play('/tools/trailer/sample.js')          vista previa en tiempo real
//   gameDebug.trailer.load(url, { variant: '1x1' }) → plan;  start();  status();  timeline();  renderAudio()
// Durante el tráiler el guardado local queda desactivado (no pisa la partida del desarrollador).
import { Vector3 } from '@babylonjs/core';
import { stageCamera, Actors, Effects } from '../cinema/director.js';
import { phone, call, registration, program, speech } from '../ui/experiences.js';
import { headquarters, video, crisis, debate, finalPrep, finalSpeech, results } from '../ui/campaignFlow.js';
import { runMinigame } from '../minigames/runner.js';
import { ViralGame, RallyGame } from '../minigames/rhythm.js';
import { DuelGame } from '../minigames/duel.js';
import { ChairsGame } from '../minigames/chairs.js';
import { cinematics } from '../data/cinematics.js';
import { missions } from '../data/campaign.js';
import { advance, makeCheckpoint } from '../state/campaign.js';
import { music as musicCatalog } from '../assets/catalog.js';
import { uiSounds, plosive, voiceFor, syllableShape, footstep } from '../audio/sfx.js';
import { FeedLoop, loops } from '../audio/feedLoops.js';
import { icon, escapeHTML as esc } from '../ui/ui.js';
import './trailer.css';

const v3 = a => new Vector3(a[0], a[1], a[2]);
const clamp01 = x => Math.max(0, Math.min(1, x));
const lerp = (a, b, k) => a + (b - a) * k;
const pair = (v, k) => Array.isArray(v) ? lerp(v[0], v[1], k) : v; // número fijo o [desde, hasta]
export const EASE = {
  linear: t => t,
  smooth: t => t * t * (3 - 2 * t), // el del director de cinemáticas
  in: t => t * t, out: t => 1 - (1 - t) * (1 - t),
  inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  back: t => { const c = 1.70158; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; },
};
const ease = name => (typeof name === 'function' ? name : EASE[name] || EASE.smooth);

// Pantallas del juego que un plano puede abrir con `setup.ui`, y la misión que necesitan.
const SCREENS = { feed: [phone, 'phone'], call: [call, 'call'], register: [registration, 'register'], program: [program, 'program'], speech: [speech, 'speech'], hq: [headquarters, 'hqBrief'], video: [video, 'video'], crisis: [crisis, 'crisis'], debate: [debate, 'debate'], finalPrep: [finalPrep, 'finalPrep'], finalSpeech: [finalSpeech, 'finalSpeech'], results: [results, 'election'] };
const MINIGAMES = { viral: [(g, c) => new ViralGame(g, c), 'video'], duel: [g => new DuelGame(g), 'debate'], chairs: [g => new ChairsGame(g), 'finalPrep'], rally: [g => new RallyGame(g), 'finalSpeech'] };
const TRANSITIONS = { cut: { kind: 'cut', dur: 0 }, fade: { kind: 'fade', dur: 0.4, color: '#120d1c' }, 'fade-white': { kind: 'fade', dur: 0.4, color: '#fff7e6' }, flash: { kind: 'flash', dur: 2 / 30, color: '#ffffff' }, wipe: { kind: 'wipe', dur: 0.45, color: '#ffc83d' }, whip: { kind: 'whip', dur: 0.3 } };
const transition = v => (!v ? TRANSITIONS.cut : typeof v === 'string' ? TRANSITIONS[v] || TRANSITIONS.cut : { ...(TRANSITIONS[v.kind] || TRANSITIONS.cut), ...v });

export function createTrailer(game, { stateAt }) {
  const T = {
    phase: 'idle', def: null, shots: [], i: -1, f: 0, t: 0, ticks: 0, rendered: null, error: null, cues: [], fixed: false,
    rig: null, actors: new Actors(game), fx: new Effects(game), events: [], fired: 0, walks: [], mg: null, mgCtl: null, loop: null,
  };
  const fps = () => T.def?.fps || 30;

  // ------------------------------------------------------------------ montaje / desmontaje
  function mount() {
    if (T.layer) return;
    // Todo lo del juego pasa a un escenario que se puede escalar/desplazar (zoom digital, barrido); la capa del tráiler queda encima.
    const stage = document.createElement('div'); stage.id = 'trailer-stage';
    stage.append(...[...document.body.childNodes].filter(n => n.nodeType === 1 && n.tagName !== 'SCRIPT'));
    const layer = document.createElement('div'); layer.id = 'trailer-layer';
    layer.innerHTML = '<div class="tr-veil"></div><div class="tr-safe"></div><div class="tr-fade"></div>';
    document.body.append(stage, layer); document.body.classList.add('tr-on');
    Object.assign(T, { stage, layer, veil: layer.querySelector('.tr-veil'), safe: layer.querySelector('.tr-safe'), fade: layer.querySelector('.tr-fade') });
    // Sin guardado durante el tráiler y registro de todo lo que suena.
    T.save = game.storage.save; game.storage.save = () => true;
    wrapAudio();
    T.frame = game.frame; game.frame = () => { try { tick(); } catch (e) { fail(e); } T.frame.call(game); };
  }
  function unmount() {
    if (!T.layer) return;
    teardownShot(); game.frame = T.frame; game.storage.save = T.save; unwrapAudio();
    document.body.prepend(...T.stage.childNodes); T.stage.remove(); T.layer.remove(); T.layer = null;
    document.body.classList.remove('tr-on', 'tr-hud-off', 'tr-prompt-off', 'tr-toast-off', 'tr-subs-off');
  }
  function fail(e) { console.error(e); T.error = String(e?.stack || e); T.phase = 'error'; }

  // ------------------------------------------------------------------ sonido: se registra lo que el juego toca
  const now = () => (T.phase === 'play' && T.shot ? T.shot.start + T.t : null);
  const sfxCue = s => (typeof s === 'string' ? (s in uiSounds ? { kind: 'ui', name: s } : { kind: s }) : s);
  const cue = c => { const at = now(); if (at !== null) T.cues.push({ at, ...c }); };
  function wrapAudio() {
    const a = game.audio, orig = T.audioOrig = { tone: a.tone, chatter: a.chatter, ui: a.ui, syllable: a.syllable, footstep: a.footstep, play: FeedLoop.prototype.play, stop: FeedLoop.prototype.stop };
    let last = -1;
    a.tone = function (frequency, duration = 0.06, gain = 0.08) { cue({ kind: 'tone', frequency, duration, gain }); return orig.tone.apply(this, arguments); };
    a.chatter = function (speaker, text) { cue({ kind: 'chatter', speaker, text }); return orig.chatter.apply(this, arguments); };
    a.ui = function (kind) { cue({ kind: 'ui', name: kind }); return orig.ui.apply(this, arguments); };
    a.footstep = function (surface, running) { cue({ kind: 'footstep', surface, running }); return orig.footstep.apply(this, arguments); };
    a.syllable = function (char, speaker, index, text = char) {
      const at = now();
      if (at !== null && game.settings.babble && /[aeiouáéíóú]/i.test(char) && at - last >= 0.09) { last = at; cue({ kind: 'syllable', speaker, shape: syllableShape(speaker, text, index) }); }
      return orig.syllable.apply(this, arguments);
    };
    // Bucles sintetizados del feed de «unratito»: se apunta cuándo empieza y acaba cada uno.
    FeedLoop.prototype.play = function (id) { const r = orig.play.call(this, id); if (loops[id]) T.loop = { id, from: now() ?? T.shot?.start ?? 0 }; return r; }; // play() llama a stop(): cierra el anterior
    FeedLoop.prototype.stop = function () { closeLoop(); return orig.stop.call(this); };
  }
  function closeLoop(end = now() ?? T.lastEnd ?? 0) {
    const l = T.loop; T.loop = null; if (!l) return;
    const from = Math.max(l.from, T.firstStart ?? 0); if (end > from + 0.05) T.cues.push({ at: from, kind: 'loop', id: l.id, dur: end - from });
  }
  function unwrapAudio() { const o = T.audioOrig; if (!o) return; delete game.audio.tone; delete game.audio.chatter; delete game.audio.ui; delete game.audio.syllable; delete game.audio.footstep; FeedLoop.prototype.play = o.play; FeedLoop.prototype.stop = o.stop; T.audioOrig = null; }

  // ------------------------------------------------------------------ preparación de un plano (no se graba)
  function teardownShot() {
    T.actors.clear(); T.fx.clear(); T.walks = []; T.events = []; T.fired = 0;
    game.dialogue.stop();
    if (T.mgCtl) { T.mgCtl.abort(); T.mgCtl = null; T.mg = null; } game.minigame?.abort(); game.minigame = null;
    game.director.stop(); game.ui.hide(); game.ui.subtitle(null); game.ui.letterbox(false);
    game.ui.cinema.querySelectorAll('.banner, .confetti, .skip-hint').forEach(n => n.remove());
    game.ui.toastElement.classList.remove('visible');
    T.rig?.restore(); T.rig = null; T.rigKey = null;
    if (T.safe) T.safe.innerHTML = '';
  }
  async function prepare(shot) {
    const s = shot.setup || {};
    if (!s.keep) teardownShot();
    const screen = typeof s.ui === 'string' ? SCREENS[s.ui] : null, mgDef = s.minigame ? MINIGAMES[s.minigame.id ?? s.minigame] : null;
    if (s.ui && typeof s.ui === 'string' && !screen) throw new Error(`setup.ui desconocido: ${s.ui}`);
    const mission = s.mission ?? screen?.[1] ?? mgDef?.[1] ?? null;
    const reload = s.reload || !T.loaded || (mission && mission !== game.state.mission) || (s.exit && !T.atExit) || (!s.exit && T.atExit && mission);
    if (reload) {
      const target = mission ?? game.state.mission, st = s.exit ? exitState(target) : stateAt(target);
      patchState(st, s); st.seen = Object.fromEntries(Object.keys(cinematics).map(k => [k, true]));
      await game.start(st); T.loaded = true; T.atExit = !!s.exit;
    } else { patchState(game.state, s); if (s.party) game.world.setIdentity(game.state.party); game.refreshHUD(); }
    // scene.isReady() no llega a true en estas escenas: se espera a que no queden texturas/archivos pendientes.
    await until(() => !(game.world.scene.getWaitingItemsCount?.() > 0), 10 * fps());
    await document.fonts?.ready;
    for (const [k, v] of Object.entries(s.labels || {})) game.world.drawLabel(k, v);
    place('Tú', s.player); for (const [name, p] of Object.entries(s.npcs || {})) place(name, p);
    // Pantalla del juego o minijuego; si no hay, el mundo simula en modo cinemático (jugador sin control).
    if (screen) screen[0](game);
    else if (typeof s.ui === 'function') await s.ui(game);
    else if (mgDef) {
      const m = typeof s.minigame === 'object' ? s.minigame : { id: s.minigame };
      T.mg = mgDef[0](game, m.choice ?? null); T.mgCtl = runMinigame(game, T.mg, () => { T.mgCtl = null; });
      if (m.phase !== 'intro') T.mgCtl.key({ code: 'Space', preventDefault() {} });
      T.autoplay = m.autoplay ?? true;
    } else game.setMode(s.mode || 'cinematic');
    if (s.run) await s.run(game, api.context());
    camera(shot, 0, true);
    // Calentamiento: fotogramas simulados sin grabar (poses de idle asentadas, minijuego avanzado…).
    const warm = Math.round((s.warmup ?? 0.25) * fps());
    if (warm > 0) await until(null, warm);
  }
  // Espera fotogramas de preparación (no grabados): hasta que cond() se cumpla o pasen max fotogramas.
  function until(cond, max) { return new Promise(resolve => { T.warm = { cond, left: max, resolve }; }); }
  function exitState(id) { // como gameDebug.jumpToExit: misión anterior hecha, salida pendiente en su escena
    const i = missions.findIndex(m => m.id === id), prev = missions[i - 1]; if (!prev) throw new Error(`Sin salida antes de ${id}`);
    const s = stateAt(prev.id); if (prev.id === 'crisis' && !s.checkpoint) makeCheckpoint(s); advance(s, prev.id); return s;
  }
  function patchState(st, s) {
    if (s.party) st.party = { ...st.party, ...s.party };
    if (s.memories) Object.assign(st.memories, s.memories);
    if (s.proposal) st.proposal = s.proposal;
    if (s.state) Object.assign(st, structuredClone(s.state));
  }
  function character(name) { return name === 'Tú' ? game.player?.character : T.actors.character(name); }
  function place(name, p) {
    if (!p) return;
    const [x, y, z, rot] = p.length >= 4 ? p : [p[0], name === 'Tú' ? 0.02 : 0, p[1], p[2]];
    if (name === 'Tú') { game.player.body.position.set(x, y, z); game.player.character.root.position.copyFrom(game.player.body.position); }
    else { const ch = character(name); if (!ch) { console.warn(`trailer: no hay personaje ${name}`); return; } ch.root.position.set(x, y, z); }
    if (rot !== undefined) { const ch = character(name); if (ch) ch.root.rotation.y = rot; }
  }

  // ------------------------------------------------------------------ fotograma
  function tick() {
    const n = performance.now(), dt = Math.min(0.05, Math.max(0, (n - (T.lastNow ?? n)) / 1000)); T.lastNow = n; T.ticks++; T.rendered = null;
    if (T.phase === 'prep') {
      autoplay(1 / fps()); hideMarker();
      if (T.warm && (--T.warm.left <= 0 || T.warm.cond?.())) { const r = T.warm.resolve; T.warm = null; r(); }
      return;
    }
    if (T.phase !== 'play') return;
    const shot = T.shot;
    if (T.fixed ? T.f >= shot.frames : T.t >= shot.dur) { endShot(); return; }
    if (T.fixed) T.t = T.f / fps(); else if (T.f > 0) T.t += dt;
    const t = T.t, step = T.fixed ? 1 / fps() : dt;
    while (T.fired < T.events.length && T.events[T.fired].at <= t + 1e-6) fire(T.events[T.fired++]);
    T.actors.update(step); T.fx.update(step);
    walk(t); camera(shot, t); overlays(shot, t); autoplay(step); hideMarker();
    T.rendered = { shot: T.i, id: shot.id, f: T.f, t, frame: shot.firstFrame + T.f };
    T.f++;
  }
  function hideMarker() { const s = T.shot; if (game.world.marker && !s?.marker) game.world.marker.isVisible = false; if (s && s.beacon === false) game.world.beacon?.root.setEnabled(false); }
  function fire(e) {
    if (e.sub !== undefined) { if (e.sub) { const [speaker, text] = e.sub; game.ui.subtitle(speaker, text); game.audio.chatter(speaker || 'Narrador', text); } else game.ui.subtitle(null); }
    if (e.act) for (const [name, state, dur] of e.act) T.actors.set(name, state, dur);
    if (e.banner) { game.ui.banner(...e.banner); cue({ kind: 'ui', name: 'confirm' }); }
    if (e.confetti) { game.ui.confetti(e.confetti); cue({ kind: 'applause', dur: 2.2 }); }
    if (e.fx?.kind === 'buzz') { T.fx.buzz(e.fx.at, e.fx.dur); }
    if (e.say !== undefined) say(e.say);
    if (e.walk) { const [name, to, dur, state = 'walk'] = e.walk, ch = character(name); if (ch) { const from = (name === 'Tú' ? game.player.body.position : ch.root.position).clone(); T.walks.push({ name, from, to: new Vector3(to[0], from.y, to[1]), at: e.at, dur }); T.actors.set(name, state, dur); } }
    if (e.face) { const [name, x, z] = e.face, ch = character(name); if (ch) ch.root.rotation.y = Math.atan2(x - ch.root.position.x, z - ch.root.position.z); }
    if (e.key) for (const code of [].concat(e.key)) { window.dispatchEvent(new KeyboardEvent('keydown', { code, key: code.replace(/^(Key|Digit)/, ''), bubbles: true })); window.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true })); }
    if (e.click) document.querySelector(e.click)?.click();
    if (e.sfx) for (const s of [].concat(e.sfx)) cue(sfxCue(s));
    if (e.label) game.world.drawLabel(...e.label);
    if (e.run) e.run(game, api.context());
  }
  // Globo de diálogo del juego sobre un personaje (balbuceo letra a letra incluido). say: [nombre, texto, {speed}] o null.
  function say(v) {
    if (!v) { game.dialogue.stop(); return; }
    const [name, text, opt = {}] = v, ch = name === 'Tú' ? null : character(name);
    const entity = ch ? { anchor: { position: ch.root.position }, character: null } : null;
    if (opt.speed) { T.speed ??= game.settings.speed; game.settings.speed = opt.speed; }
    game.dialogue.start([{ speaker: name, text }], entity, null);
    T.actors.set(name, 'talk', opt.talk ?? Math.max(1.2, text.length / (game.settings.speed || 38)));
  }
  function walk(t) {
    for (const w of T.walks) {
      const k = clamp01((t - w.at) / w.dur), p = Vector3.Lerp(w.from, w.to, k), ch = character(w.name);
      if (w.name === 'Tú') game.player.body.position.copyFrom(p); else ch.root.position.copyFrom(p);
      if (k < 1) ch.root.rotation.y = Math.atan2(w.to.x - w.from.x, w.to.z - w.from.z);
    }
    T.walks = T.walks.filter(w => t < w.at + w.dur + 0.5);
  }
  // Cámara: un tramo {from,to,…} o una lista de tramos con `dur`; {game: true} usa la de seguimiento; sin cámara, se deja la que haya.
  function camera(shot, t, initial = false) {
    const c = shot.camera; if (!c) return;
    if (c.game) {
      T.rig?.restore(); T.rig = null; game.world.scene.activeCamera = game.player.camera; game.player.cinematic = false;
      const k = ease(c.ease)(clamp01(t / shot.dur));
      if (c.yaw !== undefined) game.player.yaw = pair(c.yaw, k); if (c.pitch !== undefined) game.player.pitch = pair(c.pitch, k);
      if (c.fov !== undefined) game.player.camera.fov = pair(c.fov, k);
      return;
    }
    const segs = Array.isArray(c) ? c : [{ ...c, dur: c.dur ?? shot.dur }];
    let start = 0, seg = segs.at(-1), local = 1;
    for (const s of segs) { if (t < start + s.dur) { seg = s; local = (t - start) / s.dur; break; } start += s.dur; }
    const k = ease(seg.ease)(clamp01(local)), to = seg.to || seg.from;
    const pos = Vector3.Lerp(v3(seg.from[0]), v3(to[0]), k), look = Vector3.Lerp(v3(seg.from[1]), v3(to[1]), k);
    if (seg.sway !== false) { const a = seg.sway ?? 1, g = shot.start + t; pos.x += Math.sin(g * 0.9) * 0.015 * a; pos.y += Math.sin(g * 1.3 + 1) * 0.012 * a; }
    if (!T.rig || initial || game.world.scene.activeCamera !== T.rig.camera) { T.rig?.restore(); T.rig = stageCamera(game, pos.asArray(), look.asArray(), 0.82); }
    T.rig.set(pos, look); T.rig.camera.fov = pair(seg.fov ?? 0.82, k);
  }

  // ------------------------------------------------------------------ capa del tráiler: tarjetas, velo, zoom, transiciones
  function overlays(shot, t) {
    const body = document.body.classList;
    body.toggle('tr-hud-off', !shot.hud); body.toggle('tr-prompt-off', !shot.prompt); body.toggle('tr-toast-off', !shot.toast); body.toggle('tr-subs-off', shot.subtitles === false);
    game.ui.letterbox(!!shot.letterbox);
    // Zoom digital / encuadre del escenario completo (3D + UI del juego), no de las tarjetas.
    const k = clamp01(t / shot.dur), z = pair(shot.zoom ?? 1, ease(shot.zoomEase || 'linear')(k)), [ox, oy] = shot.zoomAt || [50, 50];
    let tx = 0, zx = 1, blur = shot.look?.blur ?? 0; // barrido: desplaza + escala (sin dejar hueco) + desenfoque
    const tin = transition(shot.in), tout = transition(shot.out), frame = 1 / fps();
    const pin = tin.dur > 0 ? clamp01(t / tin.dur) : 1, pout = tout.dur > 0 ? clamp01((t + frame - (shot.dur - tout.dur)) / tout.dur) : 0;
    if (tin.kind === 'whip' && pin < 1) { const e = 1 - EASE.out(pin); tx += e * 12; zx += e * 0.26; blur += e * 28; }
    if (tout.kind === 'whip' && pout > 0) { const e = EASE.in(pout); tx -= e * 12; zx += e * 0.26; blur += e * 28; }
    zx += blur * 0.004; // el desenfoque deja bordes translúcidos: se escala un poco para sacarlos del cuadro
    T.stage.style.transformOrigin = `${ox}% ${oy}%`;
    T.stage.style.transform = z * zx !== 1 || tx ? `translateX(${tx}vw) scale(${z * zx})` : '';
    T.stage.style.filter = blur ? `blur(${blur}px)` : '';
    // Velo / fondo: color sólido (tarjetas a pantalla completa) o capa translúcida sobre el juego.
    const veil = shot.backdrop || shot.look?.veil || null;
    T.veil.style.background = veil || 'transparent'; T.veil.style.opacity = veil ? (shot.look?.veilOpacity ?? 1) : 0;
    // Transiciones: entrada al principio del plano, salida al final (el último fotograma queda cubierto del todo).
    const f = T.fade.style; f.opacity = 0; f.clipPath = ''; f.background = '';
    const cover = (tr, p, entering) => {
      if (tr.kind === 'fade' || tr.kind === 'flash') { f.background = tr.color; f.opacity = tr.kind === 'flash' ? (entering ? (p < 1 ? 1 : 0) : (p > 0 ? 1 : 0)) : (entering ? 1 - EASE.smooth(p) : EASE.smooth(p)); }
      if (tr.kind === 'wipe') { f.background = tr.color; f.opacity = 1; const e = EASE.inOut(p); f.clipPath = entering ? `inset(0 0 0 ${e * 100}%)` : `inset(0 ${(1 - e) * 100}% 0 0)`; }
    };
    if (tin.dur > 0 && pin < 1) cover(tin, pin, true);
    if (tout.dur > 0 && pout > 0) cover(tout, pout, false);
    cards(shot, t);
  }
  function cards(shot, t) {
    for (const c of shot.cards || []) {
      const u = t - (c.at ?? 0), dur = c.dur ?? shot.dur - (c.at ?? 0), on = u >= 0 && u < dur;
      if (!c.el) { if (!on) continue; c.el = cardElement(c); T.safe.append(c.el); if (c.sfx !== false) cue(sfxCue(c.sfx || 'whoosh')); }
      c.el.hidden = !on; if (!on) continue;
      const enter = c.enter ?? 0.45, exit = c.exit ?? (c.hold ? 0 : 0.35);
      const pi = enter > 0 ? clamp01(u / enter) : 1, po = exit > 0 ? clamp01((u - (dur - exit)) / exit) : 0;
      const anim = c.anim || 'pop', rot = c.rotate ?? (c.style === 'sticker' ? -4 : c.style === 'verb' ? -1.5 : 0);
      let tr = '', op = 1;
      if (anim === 'pop') { tr = `scale(${0.55 + 0.45 * EASE.back(pi)})`; op = clamp01(pi * 3); }
      else if (anim === 'slide') { tr = `translateX(${(1 - EASE.out(pi)) * -8}vh)`; op = EASE.out(pi); }
      else if (anim === 'drop') { tr = `translateY(${(1 - EASE.back(pi)) * -10}vh)`; op = clamp01(pi * 2.5); }
      else op = EASE.smooth(pi);
      if (po > 0) { tr += ` scale(${1 - 0.08 * EASE.in(po)})`; op *= 1 - EASE.in(po); }
      c.el.style.transform = `${tr} rotate(${rot}deg)`; c.el.style.opacity = op;
      // Logo: letras que caen como en el menú (letter-drop), calculadas a mano para el reloj del tráiler.
      c.el.querySelectorAll('.tr-letter').forEach((l, i) => {
        const p = clamp01((u - 0.25 - i * 0.055) / 0.7), a = Math.min(p / 0.7, 1), b = p > 0.7 ? (p - 0.7) / 0.3 : 0;
        const y = p < 0.7 ? lerp(-60, 6, EASE.out(a)) : lerp(6, 0, b), r = p < 0.7 ? lerp(-12, 3, EASE.out(a)) : lerp(3, 0, b);
        l.style.transform = `translateY(${y / 10.8}vh) rotate(${r}deg)`; l.style.opacity = clamp01(p / 0.3);
      });
      c.el.querySelectorAll('.tr-line').forEach((l, i) => { const p = clamp01((u - (c.stagger ?? 0.5) * i) / 0.4); l.style.opacity = p; l.style.transform = `translateY(${(1 - EASE.out(p)) * 2}vh)`; });
    }
  }
  function cardElement(c) {
    const el = document.createElement('div'), style = c.style || 'verb';
    el.className = `tr-card tr-${style} tr-pos-${Array.isArray(c.pos) ? 'xy' : c.pos || (style === 'lower' ? 'lower' : 'center')}`;
    if (Array.isArray(c.pos)) { el.style.left = `${c.pos[0]}%`; el.style.top = `${c.pos[1]}%`; }
    if (c.color) el.style.setProperty('--tr-accent', c.color);
    if (c.size) el.style.setProperty('--tr-size', c.size);
    const eyebrow = c.eyebrow ? `<span class="tr-eyebrow">${c.icon ? icon(c.icon) : ''}${esc(c.eyebrow)}</span>` : '';
    if (style === 'logo') {
      const letters = [...(c.title || 'presento.')].map(ch => `<span class="tr-letter">${esc(ch)}</span>`).join('');
      el.innerHTML = `${eyebrow}<h1 class="tr-logo"><span class="tr-l1">${esc(c.pre ?? 'Pues me')}</span><span class="tr-l2">${letters}</span></h1>${c.text ? `<p>${esc(c.text)}</p>` : ''}`;
    } else if (style === 'lines') {
      el.innerHTML = `${eyebrow}${(c.lines || []).map(l => typeof l === 'string' ? `<p class="tr-line">${esc(l)}</p>` : l.chips ? `<p class="tr-line tr-chips">${l.chips.map(x => `<span>${esc(x)}</span>`).join('')}</p>` : `<p class="tr-line ${l.strong ? 'tr-strong' : ''}">${esc(l.text)}</p>`).join('')}`;
    } else if (style === 'lower') {
      el.innerHTML = `<strong>${esc(c.title || '')}</strong>${c.text ? `<span>${esc(c.text)}</span>` : ''}`;
    } else if (style === 'sticker') {
      el.innerHTML = `${c.icon ? icon(c.icon) : ''}<span>${esc(c.title || '')}</span>`;
    } else {
      el.innerHTML = `${c.icon && !c.eyebrow ? `<span class="tr-badge">${icon(c.icon)}</span>` : ''}${eyebrow}<strong>${esc(c.title || '')}</strong>${c.text ? `<p>${esc(c.text)}</p>` : ''}`;
    }
    return el;
  }
  // Minijuegos de ritmo: pulsa cada nota en su instante exacto (perfecto) para que el plano sea siempre igual.
  function autoplay(dt) {
    const mg = T.mg; if (!T.autoplay || !mg?.notes || T.mgCtl?.phase !== 'play') return;
    for (const n of mg.notes) if (!n.judged && mg.t >= n.t - dt * 0.5 && mg.t - n.t < 0.09) mg.key({ code: mg.lanes[n.lane].codes[0], preventDefault() {} });
  }

  // ------------------------------------------------------------------ secuencia
  async function run() {
    try {
      for (T.i = 0; T.i < T.shots.length; T.i++) {
        const shot = T.shots[T.i]; T.shot = shot; T.phase = 'prep';
        await prepare(shot);
        T.events = (shot.events || []).map(e => ({ ...e })).sort((a, b) => a.at - b.at); T.fired = 0;
        for (const c of shot.cards || []) c.el = null;
        if (T.loop && T.loop.from < shot.start) T.loop.from = shot.start; // un bucle que siguió sonando en la preparación
        T.firstStart ??= 0; T.f = 0; T.t = 0; T.lastNow = performance.now(); T.phase = 'play';
        await new Promise(resolve => { T.shotDone = resolve; });
      }
      closeLoop(T.lastEnd); if (T.speed) { game.settings.speed = T.speed; T.speed = null; }
      T.phase = 'done'; T.onDone?.();
    } catch (e) { fail(e); }
  }
  function endShot() { T.shot.cards.forEach(c => { c.el?.remove(); c.el = null; }); T.lastEnd = T.shot.start + T.shot.dur; T.phase = 'prep'; const r = T.shotDone; T.shotDone = null; r?.(); }

  function resolve(def, variant) {
    const rate = def.fps || 30; let start = 0, frame = 0;
    return def.shots.map((raw, i) => {
      const s = variant === '1x1' && raw.square ? { ...raw, ...raw.square } : { ...raw };
      s.id ??= `shot-${i + 1}`; s.frames = Math.round(s.dur * rate); s.dur = s.frames / rate; s.start = start; s.firstFrame = frame;
      s.cards = (s.cards || []).map(c => ({ ...c })); start += s.dur; frame += s.frames; return s;
    });
  }
  const api = {
    /** Carga un módulo de tráiler (export default { shots, … }) y devuelve el plan serializable. */
    async load(source, { variant = '16x9', record = false } = {}) {
      const def = typeof source === 'string' ? (await import(/* @vite-ignore */ source)).default : source;
      if (!def?.shots?.length) throw new Error('El tráiler no tiene planos');
      Object.assign(T, { def, variant, fixed: record, shots: resolve(def, variant), cues: [], error: null, phase: 'loaded', loaded: false, atExit: false, loop: null, firstStart: null, lastEnd: 0 });
      return api.timeline();
    },
    start() { if (!T.def) throw new Error('load() primero'); mount(); T.phase = 'prep'; run(); return true; },
    /** Vista previa en tiempo real: gameDebug.trailer.play('/tools/trailer/sample.js'). */
    async play(source, options = {}) { await api.load(source, options); return new Promise(res => { T.onDone = () => { res(api.timeline()); if (!options.keep) api.stop(); }; api.start(); }); },
    stop() { T.phase = 'idle'; T.shotDone?.(); unmount(); },
    status: () => ({ phase: T.phase, shot: T.i, id: T.shot?.id ?? null, rendered: T.rendered, ticks: T.ticks, error: T.error }),
    context: () => ({ game, minigame: T.mg, minigameControl: T.mgCtl, actors: T.actors, character, shot: T.shot, t: T.t }),
    timeline() {
      const def = T.def, rate = def.fps || 30, total = T.shots.reduce((a, s) => a + s.frames, 0), duration = total / rate;
      const music = [].concat(def.music || []).map(m => {
        const path = musicCatalog[m.track]?.path ?? m.track; if (!path) return null;
        return { file: `public/${path.replace(/^\.?\//, '')}`, at: m.at ?? 0, from: m.from ?? 0, dur: m.dur ?? duration - (m.at ?? 0), gain: m.gain ?? 0.8, fadeIn: m.fadeIn ?? 0, fadeOut: m.fadeOut ?? 1, trim: m.trim ?? true };
      }).filter(Boolean);
      return {
        title: def.title || 'trailer', fps: rate, width: 1920, height: 1080, frames: total, duration, variant: T.variant, square: def.shots.some(s => s.square),
        poster: def.poster ?? Math.min(duration, 1), music, audio: { sfx: def.audio?.sfx ?? 1, music: def.audio?.music ?? 1 },
        shots: T.shots.map(s => ({ id: s.id, start: s.start, dur: s.dur, frames: s.frames, firstFrame: s.firstFrame, crop1x1: s.crop1x1 ?? 0.5 })),
        cues: T.cues.length,
      };
    },
    /** Renderiza los sonidos registrados con OfflineAudioContext (48 kHz estéreo) y devuelve un WAV en base64. */
    async renderAudio() { return wavBase64(await renderCues(T.cues, api.timeline().duration, game.settings, T.def.audio || {})); },
    cues: () => structuredClone(T.cues),
  };
  return api;
}

// ---------------------------------------------------------------------- audio offline
// Un solo OfflineAudioContext: se suspende en el instante de cada sonido y se programan ahí las mismas funciones de
// síntesis del juego (sfx.js, feedLoops.js), que usan c.currentTime como origen.
async function renderCues(cues, duration, settings, mix) {
  const rate = 48000, c = new OfflineAudioContext(2, Math.ceil((duration + 1.5) * rate), rate);
  const out = c.createGain(); out.gain.value = mix.sfx ?? 1; out.connect(c.destination);
  const v = Math.min(1, settings.volume ?? 0.8), groups = new Map();
  for (const q of cues) { const at = Math.max(0, Math.round(q.at * rate / 128) * 128 / rate); if (at < duration) (groups.get(at) || groups.set(at, []).get(at)).push(q); }
  const noise = (() => { const b = c.createBuffer(1, rate, rate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; })();
  const tone = (frequency, duration, gain) => {
    const t = c.currentTime, osc = c.createOscillator(), env = c.createGain(), f = c.createBiquadFilter();
    osc.type = 'triangle'; osc.frequency.setValueAtTime(frequency, t); osc.frequency.exponentialRampToValueAtTime(frequency * 0.85, t + duration);
    f.type = 'lowpass'; f.frequency.value = 1100; env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(gain * v, t + 0.008); env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(f).connect(env).connect(out); osc.start(t); osc.stop(t + duration);
  };
  const whoosh = (dur = 0.32, gain = 0.22) => {
    const t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = noise;
    f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(2600, t + dur * 0.55); f.frequency.exponentialRampToValueAtTime(900, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain * v, t + dur * 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(out); s.start(t, Math.random() * 0.5, dur + 0.02);
  };
  const applause = (dur = 2) => { // palmas: ráfagas cortas de ruido filtrado, densas al principio
    for (let i = 0; i < dur * 38; i++) {
      const at = c.currentTime + Math.random() * dur * (0.4 + 0.6 * Math.random()), s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = noise;
      f.type = 'bandpass'; f.frequency.value = 1100 + Math.random() * 1800; f.Q.value = 1.4; const k = 0.06 + Math.random() * 0.08;
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(k * v, at + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
      s.connect(f).connect(g).connect(out); s.start(at, Math.random() * 0.9, 0.06);
    }
  };
  const loop = (id, dur) => { // FeedLoop sobre el contexto offline: mismos patrones que en el feed
    const fl = new FeedLoop({ context: c, settings, paused: false }); fl.pattern = loops[id]; fl.bus = c.createGain(); fl.bus.gain.value = 0.55 * v; fl.bus.connect(out);
    const step = 60 / fl.pattern.bpm / 4, t0 = c.currentTime; for (let i = 0, t = t0 + 0.05; t < t0 + dur; i++, t += step) fl.schedule(i % 16, t);
  };
  const play = q => {
    if (q.kind === 'ui') uiSounds[q.name]?.(c, out, v);
    else if (q.kind === 'tone') tone(q.frequency, q.duration, q.gain);
    else if (q.kind === 'chatter') [...q.text.matchAll(/[aeiouáéíóú]/gi)].slice(0, 14).forEach((m, i) => plosive(c, out, v * 1.6, voiceFor(q.speaker), syllableShape(q.speaker, q.text, m.index + 1), i * 0.105));
    else if (q.kind === 'syllable') plosive(c, out, v * 1.6, voiceFor(q.speaker), q.shape);
    else if (q.kind === 'footstep') footstep(c, out, v * 0.8, q.surface, q.running);
    else if (q.kind === 'whoosh') whoosh(q.dur, q.gain);
    else if (q.kind === 'applause') applause(q.dur);
    else if (q.kind === 'buzz') { tone(92, 0.22, 0.11); tone(140, 0.12, 0.05); }
    else if (q.kind === 'loop' && loops[q.id]) loop(q.id, q.dur);
  };
  for (const [at, list] of [...groups].sort((a, b) => a[0] - b[0])) c.suspend(at).then(() => { for (const q of list) { try { play(q); } catch (e) { console.error(e); } } c.resume(); });
  return c.startRendering();
}
function wavBase64(buffer) {
  const ch = [buffer.getChannelData(0), buffer.getChannelData(1)], n = ch[0].length, bytes = new Uint8Array(44 + n * 4), dv = new DataView(bytes.buffer);
  const str = (o, s) => [...s].forEach((x, i) => dv.setUint8(o + i, x.charCodeAt(0)));
  str(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); str(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
  dv.setUint32(24, buffer.sampleRate, true); dv.setUint32(28, buffer.sampleRate * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); str(36, 'data'); dv.setUint32(40, n * 4, true);
  for (let i = 0, o = 44; i < n; i++) for (let k = 0; k < 2; k++, o += 2) dv.setInt16(o, Math.max(-1, Math.min(1, ch[k][i])) * 32767, true);
  let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
