import { MeshBuilder, TransformNode, StandardMaterial, Color3 } from '@babylonjs/core';

// Rigged GLB per character (tools/blender/build_characters.py). Names without entry use a neighbour model.
export const CHARACTER_MODELS = {
  'Tú': 'char_protagonist_01', Marisa: 'char_marisa_01', Paco: 'char_paco_01', Lola: 'char_lola_01', Dani: 'char_dani_01', Nico: 'char_nico_01',
  Alba: 'char_neighbor_01', Rafa: 'char_neighbor_02', Reme: 'char_neighbor_03', Luis: 'char_neighbor_04',
  Ana: 'char_terrace_01', Berto: 'char_terrace_03', Cris: 'char_student_01', Dora: 'char_terrace_02', Eloy: 'char_courier_01', Fina: 'char_neighbor_02',
};
export const characterModel = (name, model) => model ?? CHARACTER_MODELS[name] ?? 'char_neighbor_01';

/** Character with { root, state, stepped, update(dt, state) }. Uses the preloaded GLB container in scene.metadata.characters. */
export function createCharacter(scene, name, shirt = '#c57450', model = null) {
  const container = scene.metadata?.characters?.[characterModel(name, model)];
  return container ? riggedCharacter(scene, name, container) : proceduralCharacter(scene, name, shirt);
}

// Clips in the character GLBs: idle/walk/run/jump (build_characters.py) + gestures (build_char_anims.py).
const BASE_CLIPS = ['idle', 'walk', 'run'];
const GESTURES = ['jump', 'cheer_arms', 'clap', 'wave', 'talk_gesture_a', 'talk_gesture_b', 'nod', 'shrug', 'disappointed', 'boo', 'idle_look'];
// Abstract states -> clip pools. Any clip name can also be passed directly as a state (e.g. 'clap', 'shrug').
const POOLS = {
  cheer: ['cheer_arms', 'clap', 'cheer_arms', 'clap', 'jump', 'wave'],   // repeats = weights
  talk: ['talk_gesture_a', 'talk_gesture_b'],
  boo: ['boo', 'disappointed'],
  disappointed: ['disappointed', 'shrug'],
};
const FALLBACK = { cheer: 'jump', cheer_arms: 'jump', clap: 'jump', wave: 'jump' }; // older GLBs without gesture clips
const IDLE_VARIATIONS = ['idle_look', 'idle_look', 'nod'];

/** Deterministic per-name random stream: FNV-1a seed, counter hashed with the murmur3 finaliser (no cross-name correlation). */
function seededRandom(text) {
  let seed = 2166136261, n = 0;
  for (const c of text) { seed ^= c.codePointAt(0); seed = Math.imul(seed, 16777619); }
  const mix = x => { x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); return (x ^ (x >>> 16)) >>> 0; };
  seed = mix(seed);
  return () => mix((seed + Math.imul(++n, 0x9e3779b9)) | 0) / 4294967296;
}

/** q and -q are the same rotation, but Babylon blends weighted clips component-wise: if idle stores a bone as q and a
 * gesture stores it as -q, a crossfade passes through a degenerate quaternion and the limb snaps ~90 deg for a frame.
 * Every key is put in the hemisphere of the bone's rest rotation so all clips blend the short way. */
function alignHemisphere(t) {
  const rest = t.target?.rotationQuaternion;
  if (t.animation.targetProperty !== 'rotationQuaternion' || !rest) return;
  for (const key of t.animation.getKeys()) {
    const q = key.value;
    if (q.x * rest.x + q.y * rest.y + q.z * rest.z + q.w * rest.w < 0) key.value = q.scale(-1);
  }
}

function riggedCharacter(scene, name, container) {
  const root = new TransformNode(name, scene);
  const entries = container.instantiateModelsToScene(n => `${name}-${n}`, false, { doNotInstantiate: true });
  entries.rootNodes.forEach(n => { n.parent = root; });
  for (const m of root.getChildMeshes()) { m.isPickable = false; m.receiveShadows = true; scene.metadata?.shadows?.addShadowCaster(m, false); }
  const groups = {}, weights = {}, prefix = `${name}-`;
  for (const g of entries.animationGroups) {
    const key = g.name.startsWith(prefix) ? g.name.slice(prefix.length) : g.name;
    if (BASE_CLIPS.includes(key) || GESTURES.includes(key)) { groups[key] = g; weights[key] = 0; }
    // instantiateModelsToScene shares Animation objects between every copy of a model, and Babylon then evaluates
    // a shared animation once (its first runtime animation) for all of them. A gesture playing on one neighbour
    // but stopped on another left the second one with stale values: flicker and bind T-pose. Own copies fix it.
    for (const t of g.targetedAnimations) { t.animation = t.animation.clone(); alignHemisphere(t); }
    g.stop();
  }
  const rand = seededRandom(name);
  const speed = 1 + (rand() - 0.5) * 0.26;          // +-13% tempo per character
  const lag = rand() * 0.4;                          // staggered reaction delay
  const span = g => Math.max(1, g.to - g.from);
  const seconds = g => span(g) / (g.targetedAnimations[0]?.animation.framePerSecond || 60) / (g.speedRatio || 1);
  function play(key) {
    const g = groups[key]; if (!g || g.isPlaying) return;
    g.start(true, speed * (0.95 + rand() * 0.1));
    g.weight = weights[key];
    // Random phase so neighbours never line up; idle variations start from their neutral first frame.
    // Base loops get a random phase; gestures start near their first frame so the arm rises instead of popping in.
    g.goToFrame(g.from + rand() * span(g) * (BASE_CLIPS.includes(key) ? 1 : 0.12));
  }
  // Babylon blends any missing weight towards the value a property had when its first animation started. Posing the
  // rig on idle's first frame beforehand makes that fallback the idle pose instead of the bind T-pose.
  for (const t of groups.idle?.targetedAnimations ?? []) {
    const v = t.animation.evaluate(t.animation.getKeys()[0].frame);
    t.target[t.animation.targetProperty] = v?.clone ? v.clone() : v;
  }
  for (const key of BASE_CLIPS) play(key);
  weights.idle = 1; if (groups.idle) groups.idle.weight = 1;
  const has = key => !!groups[key];
  const pick = (pool, avoid) => { const opts = pool.filter(has); const fresh = opts.filter(k => k !== avoid); const list = fresh.length ? fresh : opts; return list.length ? list[Math.floor(rand() * list.length)] : null; };

  // True in the last ~15% of a gesture cycle (or its first frames): the pose is close to rest, so switching is seamless.
  const nearLoopEnd = key => { const g = groups[key], a = g?.animatables[0]; if (!a) return true; const t = ((a.masterFrame - g.from) / span(g)) % 1; return t > 0.85 || t < 0.04; };
  let requested = 'idle', effective = 'idle', wait = 0, clip = 'idle', hold = 0, idleTimer = 4 + rand() * 8, half = 0, grace = 0;
  function choose(state, changed) {
    if (state === 'walk' || state === 'run') return state;
    // Leaving a gesture: let the current cycle finish (up to a few seconds) so a wave never stops mid-air.
    if (changed) grace = 3;
    if (GESTURES.includes(clip) && !IDLE_VARIATIONS.includes(clip) && !POOLS[state]?.includes(clip) && clip !== state && grace > 0 && !nearLoopEnd(clip)) return clip;
    if (POOLS[state]) {
      if (!changed && POOLS[state].includes(clip) && (hold > 0 || !nearLoopEnd(clip))) return clip;
      const next = pick(POOLS[state], changed ? null : clip) ?? FALLBACK[state] ?? 'idle';
      hold = has(next) ? seconds(groups[next]) * (state === 'talk' ? 1 + Math.floor(rand() * 2) : 2 + Math.floor(rand() * 3)) : 3;
      return next;
    }
    if (GESTURES.includes(state)) return has(state) ? state : FALLBACK[state] ?? 'idle';
    // idle (or unknown state): occasional look-around / nod
    if (clip !== 'idle' && IDLE_VARIATIONS.includes(clip) && hold > 0 && !changed) return clip;
    if (idleTimer <= 0) {
      idleTimer = 5 + rand() * 9; const v = pick(IDLE_VARIATIONS);
      if (v) { hold = seconds(groups[v]) * 0.98; return v; }
    }
    return 'idle';
  }

  // Several systems may drive the same character in one frame (world reaction, dialogue, cinematics). Calls are
  // collected and the most specific state (anything beats idle) is applied once, just before Babylon animates.
  let pending = null, pendingDt = 0;
  const self = { root, state: 'idle', stepped: false, update(dt, state = 'idle') {
    if (pending === null || (pending === 'idle' && state !== 'idle')) pending = state;
    pendingDt = Math.max(pendingDt, dt); self.state = pending;
  } };
  scene.onBeforeAnimationsObservable.add(() => { if (pending !== null) step(pendingDt, pending); pending = null; pendingDt = 0; });
  return self;
  function step(dt, state) {
    if (state !== requested) { requested = state; wait = state === 'walk' || state === 'run' || state === 'jump' ? 0 : lag + rand() * 0.12; }
    let changed = false;
    if (requested !== effective) { wait -= dt; if (wait <= 0) { effective = requested; changed = true; } }
    hold -= dt; grace -= dt; if (effective === 'idle' && clip === 'idle') idleTimer -= dt;
    const next = choose(effective, changed);
    if (next !== clip) clip = next;
    // Crossfade over ~0.35 s. Weights are renormalised to sum 1 every frame: in Babylon any missing weight blends
    // towards the bind T-pose, which is what made gesture-to-gesture switches pop.
    const gesture = key => !BASE_CLIPS.includes(key);
    play(clip);
    const k = 1 - Math.exp(-dt * 7);
    for (const key of Object.keys(groups)) weights[key] += ((key === clip ? 1 : 0) - weights[key]) * k;
    // Only clips with real weight stay running: zero-weight animatables still take part in Babylon's quaternion
    // blend and made bones flicker between two poses.
    for (const [key, g] of Object.entries(groups)) if (key !== clip && weights[key] < 0.01) { weights[key] = 0; if (g.isPlaying) g.stop(); }
    // The sum must be exactly 1: Babylon blends any shortfall (even 1e-16 from rounding) towards the bind pose and
    // switches to a multi-quaternion average that snaps limbs during crossfades.
    const live = Object.entries(groups).filter(([, g]) => g.isPlaying), total = live.reduce((sum, [key]) => sum + weights[key], 0) || 1;
    let rest = 1, main = null;
    for (const [key, g] of live) { g.weight = weights[key] / total; if (!main || g.weight > main.weight) main = g; }
    for (const [, g] of live) if (g !== main) rest -= g.weight;
    if (main) main.weight = rest;
    if (groups.idle) groups.idle.speedRatio = effective === 'talk' && !has('talk_gesture_a') ? 1.8 : speed;
    // A foot lands twice per locomotion cycle.
    const loco = weights.run > weights.walk ? groups.run : groups.walk, a = loco?.animatables[0];
    self.stepped = false;
    if (a && Math.max(weights.walk ?? 0, weights.run ?? 0) > 0.5) { const now = ((a.masterFrame - loco.from) / (loco.to - loco.from)) % 1 < 0.5 ? 0 : 1; self.stepped = now !== half; half = now; }
  }
}

function proceduralCharacter(scene, name, shirt, skin = '#dfaf87', hair = '#41372e') {
  if (['Marisa', 'Reme'].includes(name)) hair = '#c9c8b6';
  if (['Paco', 'Rafa'].includes(name)) skin = '#b88463';
  const root = new TransformNode(name, scene), materials = {};
  function material(hex) { if (!materials[hex]) { const m = new StandardMaterial(`${name}-${hex}`, scene); m.diffuseColor = Color3.FromHexString(hex); m.specularColor = Color3.Black(); materials[hex] = m; } return materials[hex]; }
  function part(id, size, pos, color, parent = root) {
    const mesh = MeshBuilder.CreateBox(`${name}-${id}`, { width: size[0], height: size[1], depth: size[2] }, scene);
    mesh.parent = parent; mesh.position.set(...pos); mesh.material = material(color); mesh.isPickable = false; return mesh;
  }
  part('torso', [0.58, 0.65, 0.34], [0, 1.13, 0], shirt);
  part('head', [0.47, 0.48, 0.42], [0, 1.73, 0], skin);
  part('hair', [0.5, 0.16, 0.45], [0, 1.96, -0.015], hair);
  part('nose', [0.1, 0.11, 0.12], [0, 1.72, 0.24], skin);
  for (const x of [-0.115, 0.115]) part(`eye${x}`, [0.05, 0.045, 0.025], [x, 1.8, 0.217], '#252f30');
  const legs = [], arms = [];
  for (const side of [-1, 1]) {
    const leg = new TransformNode(`${name}-leg${side}`, scene); leg.parent = root; leg.position.set(side * 0.16, 0.84, 0);
    part('trouser', [0.24, 0.65, 0.27], [0, -0.33, 0], '#344652', leg); part('shoe', [0.26, 0.16, 0.4], [0, -0.72, 0.065], '#eee1c8', leg); legs.push(leg);
    const arm = new TransformNode(`${name}-arm${side}`, scene); arm.parent = root; arm.position.set(side * 0.4, 1.39, 0);
    part('sleeve', [0.2, 0.3, 0.29], [0, -0.13, 0], shirt, arm); part('hand', [0.17, 0.32, 0.23], [0, -0.42, 0], skin, arm); arms.push(arm);
  }
  let phase = name.length, blend = 0;
  return { root, state: 'idle', update(dt, state = 'idle') {
    this.state = state; const moving = state === 'walk' || state === 'run';
    const stride = Math.cos(phase); blend += ((moving ? 1 : 0) - blend) * Math.min(1, dt * 10); phase += dt * (state === 'run' ? 13 : moving ? 8 : 2);
    this.stepped = moving && blend > 0.5 && Math.sign(Math.cos(phase)) !== Math.sign(stride); // a foot reaches the end of its swing
    legs.forEach((p, i) => { p.rotation.x = Math.sin(phase + i * Math.PI) * 0.65 * blend; });
    arms.forEach((p, i) => {
      const desired = ['cheer', 'cheer_arms', 'clap', 'wave', 'jump'].includes(state) ? -2.4 + Math.sin(phase * 3 + i) * 0.3 : ['talk', 'talk_gesture_a', 'talk_gesture_b'].includes(state) && i === 0 ? -0.9 + Math.sin(phase * 2) * 0.25 : -Math.sin(phase + i * Math.PI) * 0.55 * blend;
      p.rotation.x += (desired - p.rotation.x) * Math.min(1, dt * 9);
    });
  } };
}
