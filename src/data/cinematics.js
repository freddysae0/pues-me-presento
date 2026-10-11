// Cinemáticas cortas in-engine, declarativas. Las ejecuta src/cinema/director.js.
// Cada plano interpola cámara de `from` a `to` ([posición], [punto mirado]) durante `dur` segundos.
// Eventos con `at` (segundos desde el inicio):
//   sub: [hablante|null, texto]  subtítulo + balbuceo local      act: [[nombre, estado, segundos?], …]  ('Tú' = protagonista)
//   banner: [eyebrow, título, opciones]   confetti: n   fx: { kind: 'buzz', at: [x,y,z], dur }   run: game => …
// Reglas: no mueven al jugador salvo los finales (el recorrido de producción depende de la posición de entrada),
// se ven una vez por partida (state.seen) y se pueden saltar con Espacio. Todo es ficción.
import { electionForecast } from '../state/campaign.js';
import { script, who } from './script/index.js';
import { MeshBuilder, StandardMaterial, DynamicTexture, Color3 } from '@babylonjs/core';

const CREW_HALL = ['Ana', 'Berto', 'Cris', 'Dora', 'Eloy', 'Fina'];
const all = (names, state, dur) => names.map(n => [n, state, dur]);
// Texto del guion activo: banners y subtítulos por posición (el número de subs de cada cinemática es fijo).
const T = script.cinematics;
const sub = (id, i) => { const [speaker, text] = T[id].subs[i]; return [who(speaker), text]; };
// Fox (third rival, 'Rival C' at the right-hand lectern): optional line in the hall, from script.foxDebate.hallLine.
const FOX_LINE = script.rivals.hard?.name && typeof script.foxDebate?.hallLine === 'string' ? script.foxDebate.hallLine : null;
const FOX_SHOT = { dur: 4.4, from: [[2.7, 2.35, 0.3], [4.0, 1.75, 3.9]], to: [[3.0, 2.25, 0.85], [4.05, 1.75, 3.9]] };

export const cinematics = {
  intro: {
    shots: [
      { dur: 4.2, from: [[5.6, 3.4, -6.4], [-2, 0.8, 1]], to: [[4.6, 2.9, -5.1], [-2.6, 0.8, 1.2]] },
      { dur: 5.6, from: [[-4.1, 1.33, -0.7], [-6.6, 0.98, 0.95]], to: [[-4.7, 1.18, -0.05], [-6.6, 0.93, 0.95]] },
      { dur: 3.6, from: [[-2.55, 1.3, -0.3], [-3.3, 0.47, 0.75]], to: [[-2.85, 1.0, 0.1], [-3.3, 0.47, 0.75]] },
      { dur: 3.8, from: [[0.55, 1.8, -1.2], [0, 1.55, -2.8]], to: [[0.35, 1.7, -1.55], [0, 1.6, -2.8]] },
    ],
    setup: game => { game.player.character.root.rotation.y = 0; tvNews(game); },
    events: [
      { at: 0.3, banner: [...T.intro.banner, { icon: 'ballot' }] },
      { at: 0.5, sub: sub('intro', 0) },
      { at: 4.4, sub: sub('intro', 1) },
      { at: 7.2, sub: sub('intro', 2) },
      { at: 9.9, fx: { kind: 'buzz', at: [-3.3, 0.5, 0.75], dur: 5.5 } },
      { at: 10.0, sub: sub('intro', 3) },
      { at: 13.6, act: [['Tú', 'shrug', 1.8]] },
      { at: 13.7, sub: sub('intro', 4) },
    ],
    done: game => game.ui.toast(T.intro.toast, { icon: 'phone' }),
  },
  plaza: {
    shots: [
      { dur: 5.2, from: [[-6, 11, -14], [0, 2, 4]], to: [[5.5, 7.5, -12], [0, 1.5, 6]] },
      { dur: 4.6, from: [[-3.5, 1.75, 4.3], [-5, 1.5, 6.7]], to: [[-3.85, 1.6, 4.85], [-5, 1.5, 6.7]] },
      { dur: 4.6, from: [[4.6, 1.75, -0.4], [6.3, 1.4, -1.5]], to: [[4.35, 1.6, -1.0], [6.3, 1.4, -1.5]] },
    ],
    events: [
      { at: 0.3, banner: [...T.plaza.banner, { icon: 'pin' }] },
      { at: 0.5, sub: sub('plaza', 0) },
      { at: 0.6, act: all(['Alba', 'Rafa', 'Reme', 'Luis'], 'wave', 3) },
      { at: 5.3, act: [['Marisa', 'wave', 2.4]] },
      { at: 5.4, sub: sub('plaza', 1) },
      { at: 9.9, act: [['Paco', 'nod', 2], ['Tere', 'clap', 2.5], ['Manolo', 'clap', 2.5]] },
      { at: 10.0, sub: sub('plaza', 2) },
    ],
  },
  hq: {
    shots: [
      { dur: 4.6, from: [[0, 3.6, -7.3], [0, 1.2, 2.5]], to: [[0, 2.4, -2.4], [0, 1.3, 2.8]] },
      { dur: 4.2, from: [[-1.15, 1.75, 0.9], [-2, 1.5, 2.7]], to: [[-1.35, 1.65, 1.25], [-2, 1.5, 2.7]] },
      { dur: 5.0, from: [[1.3, 1.9, -0.9], [1.0, 1.45, 3]], to: [[1.0, 1.8, -0.3], [1.0, 1.45, 3]] },
    ],
    events: [
      { at: 0.3, banner: [...T.hq.banner, { icon: 'home' }] },
      { at: 0.5, sub: sub('hq', 0) },
      { at: 0.6, act: all(['Lola', 'Dani', 'Nico'], 'wave', 2.6) },
      { at: 4.7, act: [['Lola', 'talk', 3.6]] },
      { at: 4.8, sub: sub('hq', 1) },
      { at: 8.9, act: [['Dani', 'talk', 2.4]] },
      { at: 9.0, sub: sub('hq', 2) },
      { at: 11.4, act: [['Nico', 'cheer_arms', 2.2]] },
      { at: 11.5, sub: sub('hq', 3) },
    ],
  },
  hall: {
    shots: [
      { dur: 5.0, from: [[0, 4.2, -7.2], [0, 1.5, 3]], to: [[-3, 3.4, -5.6], [1.6, 1.5, 3.5]] },
      { dur: 4.6, from: [[0.0, 2.6, -0.9], [1.3, 1.7, 5.0]], to: [[0.1, 2.5, -0.2], [1.3, 1.7, 5.0]] },
      { dur: 5.4, from: [[2.3, 1.95, 0.1], [1.6, 1.6, 3.9]], to: [[1.6, 1.95, 0.4], [2.1, 1.6, 3.9]] },
      ...(FOX_LINE ? [FOX_SHOT] : []),
    ],
    events: [
      { at: 0.3, banner: [...T.hall.banner, { icon: 'mic' }] },
      { at: 0.5, sub: sub('hall', 0) },
      { at: 0.6, act: all(CREW_HALL, 'clap', 3.5) },
      { at: 5.1, act: [['Moderadora', 'talk', 3.6]] },
      { at: 5.2, sub: sub('hall', 1) },
      { at: 9.7, act: [['Rival A', 'talk', 2.4]] },
      { at: 9.8, sub: sub('hall', 2) },
      { at: 12.2, act: [['Rival B', 'cheer_arms', 2.6]] },
      { at: 12.3, sub: sub('hall', 3) },
      // Optional fourth beat: Fox's line (script.foxDebate.hallLine) on its own shot. Without it the scene ends at 15 s.
      ...(FOX_LINE ? [
        { at: 15.0, act: [['Rival C', 'talk', 3.4]] },
        { at: 15.1, sub: [who('hard'), FOX_LINE] },
        { at: 17.6, act: [['Rival B', 'shrug', 1.6], ['Rival A', 'disappointed', 1.8]] },
      ] : []),
    ],
  },
  victory: {
    shots: [
      { dur: 4.2, from: [[4.0, 2.1, 1.4], [4.6, 2.0, 5.6]], to: [[4.3, 2.05, 2.3], [4.6, 2.0, 5.6]] },
      { dur: 4.8, from: [[-0.4, 2.7, 3.5], [-0.7, 1.1, -0.6]], to: [[0.5, 2.3, 3.1], [-0.7, 1.1, -0.6]] },
      { dur: 4.2, from: [[0.2, 1.95, 2.9], [-1, 1.25, 0.4]], to: [[-0.3, 1.8, 2.5], [-1, 1.3, 0.4]] },
    ],
    setup: game => endingSetup(game, T.victory.verdict),
    events: [
      { at: 0.4, sub: sub('victory', 0) },
      { at: 4.3, banner: [...T.victory.banner, { icon: 'trophy', kind: 'good' }] },
      { at: 4.4, confetti: 110 },
      { at: 4.4, act: [...all(CREW_HALL, 'cheer', 8), ['Tú', 'cheer_arms', 4]] },
      { at: 4.8, sub: sub('victory', 1) },
      { at: 8.6, act: [['Tú', 'jump', 3.6]] },
      { at: 9.0, sub: sub('victory', 2) },
    ],
  },
  defeat: {
    shots: [
      { dur: 4.2, from: [[4.0, 2.1, 1.4], [4.6, 2.0, 5.6]], to: [[4.3, 2.05, 2.3], [4.6, 2.0, 5.6]] },
      { dur: 4.0, from: [[0.5, 2.3, 3.1], [-0.7, 1.1, -0.6]], to: [[-0.2, 2.4, 3.3], [-0.7, 1.1, -0.6]] },
      { dur: 3.8, from: [[-0.1, 1.85, 2.6], [-1, 1.3, 0.4]], to: [[-0.4, 1.75, 2.3], [-1, 1.3, 0.4]] },
    ],
    setup: game => endingSetup(game, T.defeat.verdict),
    events: [
      { at: 0.4, sub: sub('defeat', 0) },
      { at: 4.2, act: [...all(CREW_HALL, 'disappointed', 7), ['Tú', 'disappointed', 7]] },
      { at: 4.4, sub: sub('defeat', 1) },
      { at: 8.3, act: [['Berto', 'shrug', 3]] },
      { at: 8.4, sub: sub('defeat', 2) },
    ],
  },
};

// The flat's TV shows the breaking news on a plane fitted to the model's screen (its emissive part), facing the room (+X).
function tvNews(game) {
  const scene = game.world.scene;
  const screen = scene.meshes.filter(m => m.name.startsWith('prop_tv_01-prop_tv_01-') && !m.name.endsWith('-0'))
    .map(m => m.getBoundingInfo().boundingBox).sort((p, q) => q.extendSizeWorld.y * q.extendSizeWorld.z - p.extendSizeWorld.y * p.extendSizeWorld.z)[0];
  if (!screen) return;
  const { minimumWorld: lo, maximumWorld: hi } = screen, w = 512, h = Math.round(512 * (hi.y - lo.y) / (hi.z - lo.z));
  const t = new DynamicTexture('tv-news', { width: w, height: h }, scene, true), ctx = t.getContext();
  const fit = (text, size, max) => { do ctx.font = `bold ${size}px sans-serif`; while (ctx.measureText(text).width > max && (size -= 2) > 10); };
  ctx.fillStyle = '#13202a'; ctx.fillRect(0, 0, w, h); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const { headline, ticker } = T.intro.tv;
  ctx.fillStyle = '#ffc83d'; fit(headline, Math.round(h * 0.3), w * 0.84); ctx.fillText(headline, w / 2, h * 0.36);
  ctx.fillStyle = '#b8323a'; ctx.fillRect(0, h * 0.64, w, h * 0.24);
  ctx.fillStyle = '#fff3d6'; fit(ticker, Math.round(h * 0.12), w * 0.88); ctx.fillText(ticker, w / 2, h * 0.76);
  t.update();
  const m = new StandardMaterial('tv-news', scene); m.diffuseTexture = t; m.emissiveTexture = t; m.emissiveColor = new Color3(0.6, 0.6, 0.6); m.specularColor = Color3.Black();
  const plane = MeshBuilder.CreatePlane('tv-news', { width: (hi.z - lo.z) * 0.96, height: (hi.y - lo.y) * 0.94 }, scene);
  plane.position.set(hi.x + 0.004, (lo.y + hi.y) / 2, (lo.z + hi.z) / 2); plane.rotation.y = -Math.PI / 2; plane.material = m; plane.isPickable = false;
}

// Endings: the protagonist faces the stage next to the results screen, which shows the score.
function endingSetup(game, verdict) {
  const f = electionForecast(game.state);
  game.player.body.position.set(-1, 0.02, 0.6); game.player.character.root.rotation.y = 0.35;
  game.world.drawLabel('results', `${f.score}/100 · ${verdict}`);
}

/** Which arrival cinematic belongs to the current state, if it has not been seen yet. */
export function cinematicFor(state) {
  const seen = state.seen || {};
  if (state.mission === 'phone' && !seen.intro) return 'intro';
  if (state.scene === 'plaza' && state.mission === 'neighbor' && !seen.plaza) return 'plaza';
  if (state.scene === 'hq' && state.mission === 'hqBrief' && !seen.hq) return 'hq';
  if (state.scene === 'hall' && state.mission === 'debate' && !seen.hall) return 'hall';
  return null;
}
