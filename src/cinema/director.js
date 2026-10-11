// In-engine cinematics: a camera rig of our own, letterbox + subtitles from the #cinema layer, character acting
// and local babble. Time only advances through update(dt), which main.js calls exclusively in 'cinematic' mode,
// so pausing freezes camera, events, subtitles and (with the suspended AudioContext) every sound.
import { UniversalCamera, Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { keycap } from '../ui/ui.js';

const smooth = t => t * t * (3 - 2 * t);
const v3 = a => new Vector3(a[0], a[1], a[2]);

/** A fixed or animated camera that temporarily replaces the follow camera. restore() gives control back. */
export function stageCamera(game, pos, look, fov = 0.82) {
  const scene = game.world.scene, previous = scene.activeCamera;
  const camera = new UniversalCamera(`stage-camera-${Math.round(performance.now())}`, v3(pos), scene);
  camera.minZ = 0.08; camera.fov = fov; camera.inputs.clear(); camera.setTarget(v3(look)); scene.activeCamera = camera;
  return {
    camera,
    set(p, l) { camera.position.copyFrom(p); camera.setTarget(l); },
    restore() { if (!scene.isDisposed && scene.activeCamera === camera) scene.activeCamera = game.player?.camera ?? previous; camera.dispose(); },
  };
}

/** Per-character acting overrides with optional durations. 'Tú' drives the protagonist. */
export class Actors {
  constructor(game) { this.game = game; this.timers = new Map(); }
  character(name) {
    const w = this.game.world, i = w.npcs?.findIndex(n => n.name === name) ?? -1;
    return i >= 0 ? w.characters[i] : null;
  }
  set(name, state, dur = 0) {
    if (name === 'Tú') this.game.playerGesture = state;
    else { const ch = this.character(name); if (!ch) return; (this.game.world.acting ??= new Map()).set(ch, state); }
    this.timers.set(name, dur > 0 ? dur : Infinity);
  }
  release(name) {
    this.timers.delete(name);
    if (name === 'Tú') this.game.playerGesture = null;
    else { const ch = this.character(name); if (ch) this.game.world.acting?.delete(ch); }
  }
  update(dt) { for (const [name, left] of [...this.timers]) { if (left - dt <= 0) this.release(name); else this.timers.set(name, left - dt); } }
  clear() { for (const name of [...this.timers.keys()]) this.release(name); this.game.world.acting?.clear(); this.game.playerGesture = null; }
}

/** Short-lived world effects driven by the same clock as the cinematic. */
export class Effects {
  constructor(game) { this.game = game; this.items = []; }
  buzz(at, dur) { this.items.push({ kind: 'buzz', at: v3(at), left: dur, next: 0, rings: [] }); }
  update(dt) {
    const scene = this.game.world.scene;
    for (const fx of this.items) {
      fx.left -= dt; fx.next -= dt;
      if (fx.kind === 'buzz' && fx.left > 0 && fx.next <= 0) {
        fx.next = 0.55;
        const ring = MeshBuilder.CreateTorus('fx-buzz', { diameter: 0.3, thickness: 0.025, tessellation: 24 }, scene);
        const m = new StandardMaterial('fx-buzz', scene); m.emissiveColor = Color3.FromHexString('#ffc83d'); m.diffuseColor = Color3.Black(); m.disableLighting = true;
        ring.material = m; ring.isPickable = false; ring.position.copyFrom(fx.at); ring.position.y += 0.05;
        fx.rings.push({ mesh: ring, age: 0 });
        this.game.audio.tone(92, 0.22, 0.11); this.game.audio.tone(140, 0.12, 0.05);
      }
      for (const r of fx.rings) { r.age += dt; const k = r.age / 0.9; r.mesh.scaling.setAll(1 + k * 2.6); r.mesh.material.alpha = Math.max(0, 1 - k); }
      fx.rings = fx.rings.filter(r => { if (r.age < 0.9) return true; r.mesh.material.dispose(); r.mesh.dispose(); return false; });
    }
    this.items = this.items.filter(fx => fx.left > 0 || fx.rings.length);
  }
  clear() { for (const fx of this.items) for (const r of fx.rings) { r.mesh.material?.dispose(); r.mesh.dispose(); } this.items = []; }
}

export class Director {
  constructor(game) { this.game = game; this.active = null; }
  get time() { return this.active?.t ?? null; }
  play(id, def, onEnd) {
    this.stop();
    const game = this.game, ui = game.ui;
    game.setMode('cinematic'); game.world.marker && (game.world.marker.isVisible = false);
    def.setup?.(game);
    const rig = stageCamera(game, def.shots[0].from[0], def.shots[0].from[1]);
    const total = def.shots.reduce((a, s) => a + s.dur, 0);
    this.active = { id, def, rig, onEnd, t: 0, total, fired: 0, events: [...def.events].sort((a, b) => a.at - b.at), actors: new Actors(game), fx: new Effects(game) };
    ui.letterbox(true); ui.subtitle(null);
    const hint = document.createElement('div'); hint.className = 'skip-hint'; hint.innerHTML = `${keycap('Espacio')} saltar`;
    ui.cinema.append(hint); this.active.hint = hint;
    this.update(0);
  }
  update(dt) {
    const a = this.active; if (!a) return;
    a.t += dt;
    while (a.fired < a.events.length && a.events[a.fired].at <= a.t) this.fire(a.events[a.fired++]);
    a.actors.update(dt); a.fx.update(dt);
    // Camera: find the current shot and ease inside it, plus a tiny handheld sway.
    let start = 0, shot = a.def.shots.at(-1), local = 1;
    for (const s of a.def.shots) { if (a.t < start + s.dur) { shot = s; local = (a.t - start) / s.dur; break; } start += s.dur; }
    const k = smooth(Math.max(0, Math.min(1, local)));
    const pos = Vector3.Lerp(v3(shot.from[0]), v3(shot.to[0]), k), look = Vector3.Lerp(v3(shot.from[1]), v3(shot.to[1]), k);
    pos.x += Math.sin(a.t * 0.9) * 0.015; pos.y += Math.sin(a.t * 1.3 + 1) * 0.012;
    a.rig.set(pos, look); if (shot.fov) a.rig.camera.fov = shot.fov;
    if (a.t >= a.total) this.finish();
  }
  fire(e) {
    const game = this.game, a = this.active;
    if (e.sub) { const [speaker, text] = e.sub; game.ui.subtitle(speaker, text); game.audio.chatter(speaker || 'Narrador', text); }
    if (e.act) for (const [name, state, dur] of e.act) a.actors.set(name, state, dur);
    if (e.banner) game.ui.banner(...e.banner);
    if (e.confetti) game.ui.confetti(e.confetti);
    if (e.fx?.kind === 'buzz') a.fx.buzz(e.fx.at, e.fx.dur);
    if (e.run) e.run(game);
  }
  /** Space/Enter: jump to the end. The callback still runs, so skipping never loses progress. */
  skip() { if (this.active) this.finish(); }
  finish() { const a = this.active; if (!a) return; this.cleanup(); a.def.done?.(this.game); a.onEnd?.(); }
  /** Abort without callback (leaving to the menu, loading another campaign). */
  stop() { if (this.active) this.cleanup(); }
  cleanup() {
    const a = this.active; this.active = null;
    a.actors.clear(); a.fx.clear(); a.rig.restore(); a.hint.remove();
    this.game.ui.letterbox(false); this.game.ui.subtitle(null); this.game.audio.stop();
  }
}
