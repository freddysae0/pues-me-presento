// Live "webcam" portraits of the real rigged characters for UI panels (video call, dialogue portraits).
//
// Technique: ONE auxiliary Babylon engine on a detached canvas. Every person gets a small "room" far apart in a shared
// scene, its own camera and a viewport slice (layerMask isolates rooms). One scene.render() draws all slices; each slice
// is then blitted into a 2D <canvas> placed inside the DOM tile. The DOM can be re-rendered (innerHTML) freely: the
// tile canvases are re-attached to the new elements, so nothing is reloaded and nothing flashes.
//
// Animation is driven manually (scene.animationsEnabled = false; idle clip via goToFrame + small procedural gestures for
// whoever is speaking) with a private clock that only advances while the tiles are in the document and the tab is
// visible. The game's pause swaps the overlay nodes out of the DOM, so pause freezes time and rendering (CLAUDE.md rule 6).
// If the tiles stay detached for a while the GPU resources are released and rebuilt on re-attachment.
// If WebGL or a GLB fails, the existing CSS placeholder inside the tile stays visible.
import { Engine, Scene, Color3, Color4, Vector3, Quaternion, Viewport, FreeCamera, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, TransformNode, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

const ASSET_DIR = './assets/';
const FPS = 30;                // webcam-like frame rate, also halves the cost
const RELEASE_AFTER = 3;       // seconds detached before freeing the GPU
const SPACING = 40;            // distance between rooms

/** GLB model for a person id or display name. */
export const PORTRAIT_MODELS = { you: 'char_protagonist_01', 'Tú': 'char_protagonist_01', lola: 'char_lola_01', Lola: 'char_lola_01', dani: 'char_dani_01', Dani: 'char_dani_01', nico: 'char_nico_01', Nico: 'char_nico_01', marisa: 'char_marisa_01', Marisa: 'char_marisa_01', paco: 'char_paco_01', Paco: 'char_paco_01' };
const modelFor = p => p.model ?? PORTRAIT_MODELS[p.id] ?? PORTRAIT_MODELS[p.name] ?? (String(p.id).startsWith('char_') ? p.id : 'char_neighbor_01');

// Room per person: wall, side wall, accent and a few cheap props (primitives, no extra downloads).
const ROOMS = {
  you: { wall: '#e8d7b4', side: '#d9c39c', accent: 'party', props: ['poster', 'lamp', 'shelf'] },
  lola: { wall: '#b9cbbf', side: '#a6bbae', accent: '#c77657', props: ['binders', 'clock'] },
  dani: { wall: '#3c3557', side: '#2f2a47', accent: '#e05fa0', props: ['ringlight', 'led', 'poster'] },
  nico: { wall: '#ecd38f', side: '#dcc078', accent: '#5f8f5a', props: ['window', 'plant', 'cork'] },
  default: { wall: '#d8d2c2', side: '#c9c2b0', accent: '#7a8f8a', props: ['frame'] },
};

let active = null;

/**
 * Mount live portraits into the tiles of `container`. A tile is `[data-portrait="<id>"]` or, failing that, the i-th
 * `.portrait` element. Calling it again with the same people (e.g. after re-rendering the panel) re-uses the running
 * renderer. people: [{ id, name?, model? }]. options: { speaking: id|null, partyColor: '#hex', active: () => bool }.
 * Returns { setSpeaking, dispose }.
 */
export function mountCallPortraits(container, people, options = {}) {
  const key = people.map(modelFor).join('|');
  if (active && active.key === key && !active.disposed) { active.attach(container); active.options = { ...active.options, ...options }; active.setSpeaking(options.speaking ?? null); if (options.partyColor) active.setPartyColor(options.partyColor); return handle(active); }
  active?.dispose();
  active = new CallPortraits(key, people, options);
  active.attach(container); active.start();
  return handle(active);
}
const handle = inst => ({ setSpeaking: id => inst.setSpeaking(id), dispose: () => { inst.dispose(); if (active === inst) active = null; } });
/** Load the call's characters before the call opens (no tiles yet) so the first frame of the call is already 3D. */
export function preloadCallPortraits(people, options = {}) {
  const key = people.map(modelFor).join('|');
  if (active && active.key === key && !active.disposed) return;
  active?.dispose(); active = new CallPortraits(key, people, options); active.build(); active.start();
}
/** Who gesticulates in the mounted call (null = nobody). */
export function setSpeaking(id) { active?.setSpeaking(id); }
/** Free the call renderer (tiles keep their CSS placeholder). */
export function dispose() { active?.dispose(); active = null; }

const urlCache = new Map();
/**
 * PNG data URL of a character portrait in its room, for static UI (dialogue boxes, menus).
 * characterId: person id ('lola'), display name ('Lola') or GLB name ('char_lola_01').
 * options: { expression: 'idle' | 'talk', width, height, partyColor, room }.
 */
export function portraitUrl(characterId, options = {}) {
  const { expression = 'idle', width = 256, height = 256, partyColor = null, room = null } = options;
  const key = [characterId, expression, width, height, partyColor, room].join('|');
  if (!urlCache.has(key)) {
    const promise = (async () => {
      const studio = new Studio([{ id: characterId, room }], { partyColor, width, height, preserve: true });
      try {
        await studio.load();
        studio.speaking = expression === 'talk' ? characterId : null; studio.actors[0].blend = expression === 'talk' ? 1 : 0;
        studio.step(expression === 'talk' ? 0.35 : 0.8); studio.render();
        return studio.canvas.toDataURL('image/png');
      } finally { studio.dispose(); }
    })();
    promise.catch(() => urlCache.delete(key));
    urlCache.set(key, promise);
  }
  return urlCache.get(key);
}

class CallPortraits {
  constructor(key, people, options) {
    this.key = key; this.people = people; this.options = options; this.speaking = options.speaking ?? null; this.partyColor = options.partyColor ?? null;
    this.tiles = people.map(p => { const c = document.createElement('canvas'); c.className = 'portrait-live'; c.dataset.person = p.id; c.setAttribute('aria-hidden', 'true'); c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;visibility:hidden;z-index:1'; return c; });
    this.studio = null; this.detachedFor = 0; this.acc = 1; this.last = 0; this.disposed = false; this.raf = 0; this.poll = 0;
    this.time = 0; // private clock, survives GPU release
  }
  attach(container) {
    this.container = container;
    if (this.failed) { container.querySelectorAll('.portrait').forEach(el => el.classList.add('failed')); return; }
    const fallback = [...container.querySelectorAll('.portrait')];
    this.people.forEach((p, i) => { const el = container.querySelector(`[data-portrait="${CSS.escape(String(p.id))}"]`) ?? fallback[i]; if (el && this.tiles[i].parentElement !== el) el.append(this.tiles[i]); });
    this.resize();
    if (this.studio?.ready) { this.studio.render(); this.blit(); } // re-rendered panel: show the live frame at once
  }
  connected() { return this.tiles.some(t => t.isConnected) && !document.hidden && this.options.active?.() !== false; }
  setSpeaking(id) { this.speaking = id; if (this.studio) this.studio.speaking = id; }
  setPartyColor(hex) { this.partyColor = hex; this.studio?.setPartyColor(hex); }
  tileSize() {
    const r = this.tiles.find(t => t.isConnected)?.parentElement?.getBoundingClientRect();
    const scale = Math.min(2, window.devicePixelRatio || 1);
    return r && r.width > 0 ? [Math.round(r.width * scale), Math.round(r.height * scale)] : [320, 180];
  }
  resize() {
    const [w, h] = this.tileSize();
    for (const t of this.tiles) if (t.width !== w || t.height !== h) { t.width = w; t.height = h; }
    this.studio?.setSize(w, h);
  }
  start() {
    this.last = performance.now();
    const loop = now => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      if (!this.connected()) { if (!this.container) return; this.detachedFor += dt; if (this.detachedFor > RELEASE_AFTER && this.studio) this.suspend(); return; }
      this.detachedFor = 0;
      if (!this.studio) { this.build(); return; }
      if (!this.studio.ready) return;
      this.time += dt; this.studio.step(dt); this.acc += dt;
      if (this.acc < 1 / FPS) return;
      this.acc = 0; this.resize(); this.studio.render(); this.blit();
    };
    this.raf = requestAnimationFrame(loop);
  }
  build() {
    const [w, h] = this.tileSize();
    try { this.studio = new Studio(this.people, { partyColor: this.partyColor, width: w, height: h, time: this.time }); }
    catch (error) { console.warn('[portraits] WebGL no disponible; se mantiene el retrato CSS.', error); this.fail(); return; }
    this.studio.speaking = this.speaking;
    this.studio.load().then(() => { if (!this.disposed) { this.studio?.render(); this.blit(); } }).catch(error => { console.warn('[portraits] No se pudieron cargar los personajes.', error); this.fail(); });
  }
  fail() { this.failed = true; this.tiles.forEach(t => t.parentElement?.classList.add('failed')); this.dispose();
  }
  suspend() { this.studio?.dispose(); this.studio = null; } // when detached long enough (menu, long pause); rebuilt on return
  blit() {
    const s = this.studio; if (!s?.ready) return;
    this.tiles.forEach((t, i) => { const ctx = t.getContext('2d'); ctx.drawImage(s.canvas, i * s.w, 0, s.w, s.h, 0, 0, t.width, t.height); t.style.visibility = 'visible'; t.parentElement?.classList.add('live'); });
  }
  dispose() {
    if (this.disposed) return; this.disposed = true; cancelAnimationFrame(this.raf);
    this.suspend(); this.tiles.forEach(t => t.remove());
  }
}

/** Rooms + characters + one camera per person, all rendered in one pass into horizontal slices of `canvas`. */
class Studio {
  constructor(people, { partyColor = null, width = 320, height = 180, preserve = true, time = 0 } = {}) {
    this.people = people; this.partyColor = partyColor; this.speaking = null; this.ready = false; this.t = time;
    this.canvas = document.createElement('canvas');
    this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: preserve, stencil: false, antialias: true, powerPreference: 'low-power' }, false);
    this.scene = new Scene(this.engine); const s = this.scene;
    s.animationsEnabled = false; s.skipPointerMovePicking = true; s.clearColor = new Color4(0.85, 0.82, 0.74, 1);
    const hemi = new HemisphericLight('pt-hemi', new Vector3(0, 1, 0.3), s); hemi.intensity = 0.85; hemi.diffuse = Color3.FromHexString('#fff4e2'); hemi.groundColor = Color3.FromHexString('#8f7a68');
    const key = new DirectionalLight('pt-key', new Vector3(-0.45, -0.6, -1), s); key.intensity = 1.5; key.diffuse = Color3.FromHexString('#fff0d6');
    this.actors = []; this.setSize(width, height);
  }
  setSize(w, h) {
    this.w = w; this.h = h; const W = w * this.people.length;
    if (this.canvas.width !== W || this.canvas.height !== h) { this.canvas.width = W; this.canvas.height = h; this.engine.setSize(W, h); }
  }
  async load() {
    const s = this.scene, n = this.people.length;
    const files = [...new Set(this.people.map(modelFor))];
    const containers = Object.fromEntries(await Promise.all(files.map(async f => [f, await SceneLoader.LoadAssetContainerAsync(ASSET_DIR, `${f}.glb`, s)])));
    if (s.isDisposed) return;
    this.tints = Object.values(containers).flatMap(c => c.materials.filter(m => m.name.startsWith('MAT_tint_')));
    if (this.partyColor) this.setPartyColor(this.partyColor);
    s.activeCameras = [];
    this.people.forEach((p, i) => {
      const mask = 1 << (i % 28), origin = new Vector3(i * SPACING, 0, 0);
      const root = new TransformNode(`pt-${p.id}`, s); root.position.copyFrom(origin);
      const entries = containers[modelFor(p)].instantiateModelsToScene(name => `pt${i}-${name}`, false, { doNotInstantiate: true });
      entries.rootNodes.forEach(r => { r.parent = root; });
      const meshes = root.getChildMeshes(); meshes.forEach(m => { m.layerMask = mask; m.isPickable = false; m.alwaysSelectAsActiveMesh = true; });
      let idle = null; for (const g of entries.animationGroups) { if (g.name.endsWith('idle')) idle = g; else g.stop(); }
      idle?.start(true); idle?.goToFrame(idle.from);
      const nodes = {}; for (const t of root.getChildTransformNodes()) { const base = t.name.replace(/^pt\d+-/, ''); if (['Head', 'Neck', 'Chest', 'RightArm', 'RightForeArm', 'LeftArm'].includes(base)) nodes[base] = t; }
      const animated = new Set(idle?.targetedAnimations.map(a => a.target) ?? []);
      const rest = Object.fromEntries(Object.entries(nodes).map(([k, t]) => [k, (t.rotationQuaternion ?? Quaternion.FromEulerVector(t.rotation)).clone()]));
      for (const t of Object.values(nodes)) t.rotationQuaternion ??= Quaternion.FromEulerVector(t.rotation);
      // Framing: bust shot from the animated head pivot to the top of the hair.
      root.computeWorldMatrix(true); meshes.forEach(m => m.refreshBoundingInfo?.({ applySkeleton: true, applyMorph: false }));
      const head = nodes.Head?.getAbsolutePosition().clone() ?? origin.add(new Vector3(0, 1.3, 0));
      const top = Math.max(head.y + 0.3, ...meshes.map(m => m.getBoundingInfo().boundingBox.maximumWorld.y));
      const span = top - head.y, low = head.y - span * 1.55, high = top + span * 0.22, fov = 0.62;
      const dist = ((high - low) / 2) / Math.tan(fov / 2) * 1.04;
      const target = new Vector3(origin.x, (low + high) / 2, head.z);
      const cam = new FreeCamera(`pt-cam-${p.id}`, target.add(new Vector3(0.04 * dist, 0.06 * dist, dist)), s); cam.fov = fov; cam.minZ = 0.05; cam.maxZ = 20; cam.setTarget(target);
      cam.viewport = new Viewport(i / n, 0, 1 / n, 1); cam.layerMask = mask; s.activeCameras.push(cam);
      this.room(ROOMS[p.room] ?? ROOMS[p.id] ?? ROOMS[String(p.name).toLowerCase()] ?? ROOMS.default, origin, head, span, mask);
      const range = idle ? idle.to - idle.from : 1, fps = idle?.targetedAnimations[0]?.animation.framePerSecond ?? 30;
      this.actors.push({ id: p.id, idle, range, fps, phase: (i * 0.37 % 1) * range, nodes, rest, animated, blend: 0, cam, camBase: cam.position.clone(), target, seed: i * 1.7 + 0.4 });
    });
    this.step(0, true);
    await s.whenReadyAsync(); // shaders compile asynchronously; never show a half-drawn first frame
    if (!s.isDisposed) this.ready = true;
  }
  setPartyColor(hex) { this.partyColor = hex; const c = Color3.FromHexString(hex); for (const m of this.tints ?? []) { if (m.albedoColor) m.albedoColor = c; else if (m.diffuseColor) m.diffuseColor = c; } for (const m of this.partyMats ?? []) m.emissiveColor = c.scale(0.92); }
  room(cfg, o, head, span, mask) {
    const s = this.scene, accent = cfg.accent === 'party' ? (this.partyColor ?? '#3fa65a') : cfg.accent;
    // Unlit flat colours: the key light is tuned for the characters and would bleach the walls.
    const mat = (hex, glow = 0) => { const m = new StandardMaterial(`pt-m-${hex}-${glow}`, s); m.disableLighting = true; m.emissiveColor = Color3.FromHexString(hex).scale(glow ? 1 : 0.92); return m; };
    const add = (mesh, hex, pos, glow = 0) => { mesh.position.copyFrom(o.add(new Vector3(...pos))); mesh.material = typeof hex === 'string' ? mat(hex, glow) : hex; mesh.layerMask = mask; mesh.isPickable = false; return mesh; };
    const box = (w, h, d, hex, pos, glow) => add(MeshBuilder.CreateBox('pt-box', { width: w, height: h, depth: d }, s), hex, pos, glow);
    const y = head.y, z = -0.75, u = span; // u ~ head height, scales props to the framing
    box(6, 6, 0.05, cfg.wall, [0, y, z]);
    const side = box(0.05, 6, 3, cfg.side, [-1.25 * u * 2, y, z + 1.2]); side.rotation.y = -0.35;
    box(6, 0.12, 0.06, '#f3ead6', [0, y - 1.6 * u, z + 0.04]); // skirting / desk edge seen low in frame
    const partyMat = cfg.accent === 'party' ? mat(accent) : null; if (partyMat) (this.partyMats ??= []).push(partyMat);
    for (const prop of cfg.props) {
      if (prop === 'poster') { box(0.62 * u, 0.86 * u, 0.02, '#f6efe0', [1.05 * u, y + 0.25 * u, z + 0.04]); box(0.5 * u, 0.42 * u, 0.025, partyMat ?? accent, [1.05 * u, y + 0.38 * u, z + 0.05]); box(0.4 * u, 0.06 * u, 0.025, '#2d2d2d', [1.05 * u, y + 0.02 * u, z + 0.05]); }
      if (prop === 'lamp') { add(MeshBuilder.CreateCylinder('pt-shade', { diameterTop: 0.22 * u, diameterBottom: 0.4 * u, height: 0.3 * u, tessellation: 12 }, s), '#fff2c9', [-1.05 * u, y + 0.15 * u, z + 0.35], 0.7); add(MeshBuilder.CreateCylinder('pt-pole', { diameter: 0.03 * u, height: 2 * u, tessellation: 6 }, s), '#3a3a36', [-1.05 * u, y - 0.85 * u, z + 0.35]); }
      if (prop === 'shelf') { box(1.1 * u, 0.05 * u, 0.25, '#8a6a4a', [-0.95 * u, y + 0.62 * u, z + 0.13]); ['#c86b4f', '#3f6f78', '#e2c46a', '#5c5a8a', '#6f8b55'].forEach((c, k) => box(0.12 * u, (0.3 + (k % 3) * 0.05) * u, 0.18, c, [(-1.35 + k * 0.15) * u, y + (0.79 + (k % 3) * 0.025) * u, z + 0.13])); }
      if (prop === 'binders') { box(1.4 * u, 0.05 * u, 0.28, '#e9e4d6', [-0.85 * u, y + 0.35 * u, z + 0.14]); box(1.4 * u, 0.05 * u, 0.28, '#e9e4d6', [-0.85 * u, y - 0.25 * u, z + 0.14]); ['#c77657', '#c77657', '#4a6b8a', '#e3c05a', '#4a6b8a', '#7aa07a'].forEach((c, k) => box(0.17 * u, 0.48 * u, 0.24, c, [(-1.4 + k * 0.2) * u, y + 0.61 * u, z + 0.14])); [0, 1, 2].forEach(k => box(0.3 * u, 0.24 * u, 0.22, '#d9cdb0', [(-1.35 + k * 0.34) * u, y - 0.11 * u, z + 0.14])); }
      if (prop === 'clock') { const c = add(MeshBuilder.CreateCylinder('pt-clock', { diameter: 0.5 * u, height: 0.04, tessellation: 20 }, s), '#f7f2e2', [1.0 * u, y + 0.55 * u, z + 0.05]); c.rotation.x = Math.PI / 2; box(0.03 * u, 0.18 * u, 0.02, '#2d2d2d', [1.0 * u, y + 0.62 * u, z + 0.08]); const hand = box(0.03 * u, 0.13 * u, 0.02, accent, [1.04 * u, y + 0.53 * u, z + 0.08]); hand.rotation.z = -1.1; }
      if (prop === 'ringlight') { const r = add(MeshBuilder.CreateTorus('pt-ring', { diameter: 0.9 * u, thickness: 0.07 * u, tessellation: 28 }, s), '#fff8ec', [1.1 * u, y + 0.2 * u, z + 0.45], 0.95); r.rotation.x = Math.PI / 2; }
      if (prop === 'led') { box(6, 0.035 * u, 0.03, accent, [0, y + 0.95 * u, z + 0.04], 1); box(6, 0.4 * u, 0.02, '#5a3f6f', [0, y + 0.95 * u, z + 0.03], 0.25); }
      if (prop === 'window') { box(0.95 * u, 1.05 * u, 0.03, '#f4f0e4', [-1.05 * u, y + 0.3 * u, z + 0.04]); box(0.82 * u, 0.92 * u, 0.035, '#a9d3ec', [-1.05 * u, y + 0.3 * u, z + 0.05], 0.55); box(0.04 * u, 0.92 * u, 0.04, '#f4f0e4', [-1.05 * u, y + 0.3 * u, z + 0.06]); box(0.82 * u, 0.04 * u, 0.04, '#f4f0e4', [-1.05 * u, y + 0.3 * u, z + 0.06]); }
      if (prop === 'plant') { add(MeshBuilder.CreateCylinder('pt-pot', { diameterTop: 0.36 * u, diameterBottom: 0.26 * u, height: 0.32 * u, tessellation: 10 }, s), '#b8643f', [1.15 * u, y - 0.55 * u, z + 0.35]); [[0, 0.1, 0.32], [-0.13, 0.28, 0.24], [0.14, 0.33, 0.22], [0.02, 0.5, 0.2]].forEach(([dx, dy, r]) => add(MeshBuilder.CreateSphere('pt-leaf', { diameter: r * u, segments: 6 }, s), accent, [(1.15 + dx) * u, y + (-0.32 + dy) * u, z + 0.35])); }
      if (prop === 'cork') { box(0.75 * u, 0.55 * u, 0.03, '#b98a57', [1.05 * u, y + 0.55 * u, z + 0.04]); ['#f6e27a', '#f2a0a0', '#9fd0e8', '#f6e27a'].forEach((c, k) => { const n = box(0.16 * u, 0.16 * u, 0.02, c, [(0.85 + (k % 2) * 0.33) * u, y + (0.65 - Math.floor(k / 2) * 0.22) * u, z + 0.06]); n.rotation.z = (k - 1.5) * 0.12; }); }
      if (prop === 'frame') { box(0.6 * u, 0.45 * u, 0.03, '#6b5440', [1.0 * u, y + 0.45 * u, z + 0.04]); box(0.5 * u, 0.35 * u, 0.035, accent, [1.0 * u, y + 0.45 * u, z + 0.05]); }
    }
  }
  /** Advance the private animation clock. Called only while visible (never during pause). */
  step(dt, force = false) {
    if (!this.ready && !force) return; this.t += dt; const t = this.t;
    for (const a of this.actors) {
      const talking = this.speaking != null && a.id === this.speaking;
      a.blend += ((talking ? 1 : 0) - a.blend) * Math.min(1, dt * 5);
      if (a.idle) { a.phase = (a.phase + dt * a.fps * (1 + 0.5 * a.blend)) % a.range; a.idle.goToFrame(a.idle.from + a.phase); }
      for (const [k, node] of Object.entries(a.nodes)) if (!a.animated.has(node)) node.rotationQuaternion.copyFrom(a.rest[k]);
      const b = a.blend, q = (node, x, y, z) => { if (node && (x || y || z)) node.rotationQuaternion.multiplyInPlace(Quaternion.FromEulerAngles(x, y, z)); };
      const st = t + a.seed;
      // Listening: slow, small head drift. Talking: nods, head tilts, chest sway and a hand gesture.
      q(a.nodes.Head, Math.sin(st * 0.7) * 0.04 + b * Math.sin(st * 7.3) * 0.09, Math.sin(st * 0.45) * 0.08 + b * Math.sin(st * 2.1) * 0.12, Math.sin(st * 0.33) * 0.03 + b * Math.sin(st * 3.1) * 0.06);
      q(a.nodes.Chest, 0, b * Math.sin(st * 1.9) * 0.08, b * Math.sin(st * 2.4) * 0.03);
      const g = 0.5 + 0.5 * Math.sin(st * 2.6);
      // Hand gesture (axes checked visually on the rig: +x opens the arm sideways, -z brings it forward).
      q(a.nodes.RightArm, b * (0.15 + 0.25 * g), 0, -b * (0.3 + 0.25 * g));
      q(a.nodes.RightForeArm, b * (0.3 + 0.6 * g + Math.sin(st * 6.2) * 0.08), 0, -b * (0.6 + 0.2 * g));
      // Handheld webcam: tiny drift.
      a.cam.position.set(a.camBase.x + Math.sin(st * 0.5) * 0.008, a.camBase.y + Math.sin(st * 0.37) * 0.006, a.camBase.z);
      a.cam.setTarget(a.target);
    }
  }
  render() { if (this.ready && !this.scene.isDisposed) this.scene.render(); }
  dispose() { this.ready = false; this.scene.dispose(); this.engine.dispose(); }
}
