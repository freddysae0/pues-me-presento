export const assets = {
  bench: { path: './assets/prop_bench_01.glb', scale: 1, status: 'provisional', source: 'tools/blender/build_*.py', animations: [], collision: [2.3, 0.95, 0.8] },
  podium: { path: './assets/prop_podium_01.glb', scale: 1, status: 'provisional', source: 'tools/blender/build_*.py', animations: [], collision: [0.9, 1.2, 0.65] },
  planter: { path: './assets/prop_planter_01.glb', scale: 1, status: 'provisional', source: 'tools/blender/build_*.py', animations: [], collision: [0.8, 1.1, 0.8] },
  citizen: { path: null, scale: 1, status: 'procedural-placeholder', animations: ['idle', 'walk', 'run', 'talk', 'cheer'], rig: 'rigid-parts-v1; NOT Quaternius compatible' },
};
export const animationMap = {
  idle: { implementation: 'procedural', fallback: 'static' },
  walk: { implementation: 'procedural', fallback: 'idle' },
  run: { implementation: 'procedural', fallback: 'walk' },
  talk: { implementation: 'procedural', fallback: 'idle' },
  cheer: { implementation: 'procedural', fallback: 'talk' },
};
// Background music generated with AI by the user (MP3, local). Missing ids fall back in src/audio/music.js.
export const music = {
  theme: { path: './assets/music/mus_theme_01.mp3', status: 'provisional', use: 'menú y créditos' },
  flat: { path: './assets/music/mus_flat_01.mp3', status: 'provisional', use: 'piso del protagonista' },
  plaza: { path: './assets/music/mus_plaza_01.mp3', status: 'provisional', use: 'exploración de la plaza' },
  hq: { path: './assets/music/mus_hq_01.mp3', status: 'provisional', use: 'sede de campaña' },
  speech: { path: './assets/music/mus_speech_01.mp3', status: 'provisional', use: 'discurso con timing' },
  trend: { path: './assets/music/mus_trend_01.mp3', status: 'provisional', use: 'grabación de vídeo / trend' },
  crisis: { path: './assets/music/mus_crisis_01.mp3', status: 'provisional', use: 'crisis en la sede' },
};
