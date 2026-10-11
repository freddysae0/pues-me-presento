// «Seis sillas»: real 3D movement with the protagonist. Six folding chairs are scattered around the plaza;
// walk over one to pick it up (one at a time, over your head) and carry it to the circle. No colliders are
// added, so routes stay open. Time advances only through update(dt).
import { MeshBuilder, StandardMaterial, Color3, TransformNode, SceneLoader, Vector3 } from '@babylonjs/core';
import { icon, keycap, meterBar, setMeter, escapeHTML as esc } from '../ui/ui.js';
import { Actors } from '../cinema/director.js';
import { CHAIRS } from '../data/minigames.js';
import { chairsBonus } from '../state/minigames.js';
import { script, say } from '../data/script/index.js';

const T = script.minigames.chairs;

const PICK = 1.1, DROP = 1.7;

export class ChairsGame {
  constructor(game) {
    this.game = game; this.id = 'chairs'; this.movement = true; this.actors = new Actors(game); this.meshes = [];
    this.eyebrow = say(T.eyebrow, game.state); this.title = say(T.title, game.state);
    this.intro = say(T.intro, game.state, { time: CHAIRS.time });
    this.howto = [[`${keycap('W')}${keycap('A')}${keycap('S')}${keycap('D')}`, 'moverte · ratón para mirar'], [keycap('⇧'), 'correr'], [icon('organization'), 'cada silla suma organización']];
    this.ready = SceneLoader.LoadAssetContainerAsync('./assets/', 'prop_folding_chair_01.glb', game.world.scene).then(c => { if (this.disposed) c.dispose(); else this.container = c; }).catch(() => { this.container = null; });
  }
  stage() {
    const s = this.game.world.scene, [zx, zz] = CHAIRS.zone;
    const ring = MeshBuilder.CreateTorus('chairs-zone', { diameter: DROP * 2, thickness: 0.09, tessellation: 48 }, s);
    const disc = MeshBuilder.CreateDisc('chairs-zone-fill', { radius: DROP, tessellation: 48 }, s); disc.rotation.x = Math.PI / 2;
    const m = new StandardMaterial('chairs-zone', s); m.diffuseColor = Color3.FromHexString('#ffc83d'); m.emissiveColor = Color3.FromHexString('#7a5a10'); m.specularColor = Color3.Black();
    const f = new StandardMaterial('chairs-zone-fill', s); f.diffuseColor = Color3.FromHexString('#ffc83d'); f.alpha = 0.22; f.specularColor = Color3.Black();
    ring.material = m; disc.material = f; ring.position.set(zx, 0.05, zz); disc.position.set(zx, 0.03, zz);
    for (const mesh of [ring, disc]) { mesh.isPickable = false; this.meshes.push(mesh); }
    this.zone = new Vector3(zx, 0, zz); this.zoneRing = ring;
    this.arrowMat = new StandardMaterial('chairs-arrow', s); this.arrowMat.diffuseColor = Color3.FromHexString('#ff6b4f'); this.arrowMat.emissiveColor = Color3.FromHexString('#5a1d10'); this.arrowMat.specularColor = Color3.Black();
    this.zoneArrow = this.arrow(); this.zoneArrow.position.set(zx, 2.6, zz);
  }
  arrow() {
    const a = MeshBuilder.CreateCylinder('chairs-arrow', { diameterTop: 0, diameterBottom: 0.36, height: 0.5, tessellation: 4 }, this.game.world.scene);
    a.rotation.z = Math.PI; a.material = this.arrowMat; a.isPickable = false; this.meshes.push(a); return a;
  }
  chairModel(i) {
    const s = this.game.world.scene, root = new TransformNode(`chair-${i}`, s);
    if (this.container) {
      const entries = this.container.instantiateModelsToScene(n => `chair-${i}-${n}`, false, { doNotInstantiate: true });
      entries.rootNodes.forEach(n => { n.parent = root; });
    } else {
      const mat = new StandardMaterial(`chair-${i}`, s); mat.diffuseColor = Color3.FromHexString('#d5754f'); mat.specularColor = Color3.Black();
      for (const [w, h, d, y, z] of [[0.45, 0.05, 0.42, 0.45, 0], [0.45, 0.45, 0.05, 0.7, -0.2], [0.05, 0.45, 0.05, 0.22, 0.18], [0.05, 0.45, 0.05, 0.22, -0.18]]) {
        const b = MeshBuilder.CreateBox(`chair-${i}-part`, { width: w, height: h, depth: d }, s); b.position.set(0, y, z); b.material = mat; b.parent = root;
      }
    }
    for (const m of root.getChildMeshes()) { m.isPickable = false; m.checkCollisions = false; this.game.world.scene.metadata?.shadows?.addShadowCaster(m, false); }
    return root;
  }
  reset() {
    this.clearChairs();
    Object.assign(this, { time: CHAIRS.time, delivered: 0, carrying: null, done: false, clock: 0 });
    this.chairs = CHAIRS.spots.map(([x, z, rot], i) => {
      const root = this.chairModel(i); root.position.set(x, 0, z); root.rotation.y = rot;
      const arrow = this.arrow(); arrow.position.set(x, 1.6, z);
      return { i, root, arrow, state: 'ground' };
    });
    const p = this.game.player, [sx, sz] = CHAIRS.start;
    p.body.position.set(sx, 0.02, sz); p.character.root.rotation.y = 0;
    this.actors.set('Paco', 'wave', 2.5);
  }
  clearChairs() { for (const c of this.chairs || []) { c.root.dispose(); c.arrow.dispose(); this.meshes = this.meshes.filter(m => m !== c.arrow); } this.chairs = []; }
  hud() {
    return `<div class="mg-top"><div class="panel chairs-card"><span class="eyebrow">${icon('chair')}SEIS SILLAS</span><div class="chairs-row">${CHAIRS.spots.map((_, i) => `<i data-chair="${i}">${icon('chair')}</i>`).join('')}</div>${meterBar(1, { label: 'TIEMPO', color: 'var(--sun)', id: 'chairs-time' })}<p class="fine chairs-hint">${esc(say(T.hints.start, this.game.state))}</p></div><button class="secondary small" id="mg-skip-play">Saltar ${keycap('X')}</button></div>
<div class="mg-keys">${keycap('W')}${keycap('A')}${keycap('S')}${keycap('D')} mover · ${keycap('⇧')} correr · ${keycap('R')} repetir · ${keycap('X')} saltar · ${keycap('Esc')} pausa</div>`;
  }
  mount(root) { this.root = root; this.timeEl = root.querySelector('#chairs-time'); this.hint = root.querySelector('.chairs-hint'); }
  update(dt) {
    this.time = Math.max(0, this.time - dt); this.clock += dt; this.actors.update(dt);
    setMeter(this.timeEl, this.time / CHAIRS.time);
    const bob = Math.sin(this.clock * 3) * 0.12, pos = this.game.player.body.position;
    for (const c of this.chairs) if (c.state === 'ground') c.arrow.position.y = 1.6 + bob;
    this.zoneArrow.isVisible = !!this.carrying; this.zoneArrow.position.y = 2.6 + bob;
    this.zoneRing.scaling.setAll(this.carrying ? 1 + Math.sin(this.clock * 6) * 0.04 : 1);
    if (!this.carrying) {
      const near = this.chairs.find(c => c.state === 'ground' && Math.hypot(c.root.position.x - pos.x, c.root.position.z - pos.z) < PICK);
      if (near) {
        near.state = 'carried'; this.carrying = near; near.arrow.isVisible = false;
        // Carried upright on the ground just in front of the player (backrest towards them), never through the body.
        near.root.parent = this.game.player.character.root; near.root.position.set(0, 0, 0.62); near.root.rotation.set(0, 0, 0);
        this.hint.textContent = say(T.hints.carry, this.game.state); this.game.audio.tone(520, 0.1, 0.07);
      }
    } else if (Math.hypot(this.zone.x - pos.x, this.zone.z - pos.z) < DROP) {
      const c = this.carrying, slot = this.delivered, a = -Math.PI / 2 + slot * (Math.PI * 2 / CHAIRS.spots.length);
      c.root.parent = null; c.state = 'placed'; this.carrying = null; this.delivered++;
      c.root.position.set(this.zone.x + Math.cos(a) * 1.1, 0, this.zone.z + Math.sin(a) * 1.1); c.root.rotation.set(0, Math.atan2(-Math.cos(a), -Math.sin(a)), 0);
      this.root.querySelector(`[data-chair="${slot}"]`)?.classList.add('filled');
      this.hint.textContent = this.delivered < CHAIRS.spots.length ? say(T.hints.progress, this.game.state, { delivered: this.delivered, total: CHAIRS.spots.length }) : say(T.hints.full, this.game.state);
      this.game.audio.tone(660, 0.12, 0.08); this.game.audio.tone(880, 0.12, 0.05);
      this.actors.set('Paco', 'clap', 1.5);
    }
    if (this.delivered >= CHAIRS.spots.length || this.time <= 0) this.done = true;
  }
  key() {}
  result() {
    const bonus = chairsBonus({ delivered: this.delivered, total: CHAIRS.spots.length, timeLeft: this.time }), all = this.delivered === CHAIRS.spots.length;
    return {
      score: this.delivered, bonus, great: all, badge: `${this.delivered}/${CHAIRS.spots.length} sillas · ${Math.ceil(this.time)} s de margen`,
      title: say(all ? T.titles.all : this.delivered >= 3 ? T.titles.mid : T.titles.low, this.game.state),
      text: say(all ? T.texts.all : T.texts.other, this.game.state),
    };
  }
  dispose() {
    this.actors.clear(); this.clearChairs();
    for (const m of this.meshes) m.dispose(); this.meshes = [];
    this.arrowMat?.dispose(); this.container?.dispose(); this.container = null; this.disposed = true;
  }
  debug() { return { delivered: this.delivered, time: this.time, carrying: !!this.carrying, chairs: (this.chairs || []).filter(c => c.state === 'ground').map(c => [c.root.position.x, c.root.position.z]), zone: CHAIRS.zone }; }
}
