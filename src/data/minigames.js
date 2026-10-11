// Datos de los minijuegos. Rivales y cifras son ficticios; los temas vienen de docs/RESEARCH_SPAIN.md.
// Gráficas deterministas (sin azar): la misma partida suena y puntúa igual cada vez.
// Textos (etiquetas, tomas, frases del mitin, réplicas del duelo) del guion activo: script.minigames.
import { script, say } from './script/index.js';
import { DEBATE_ROLES } from './parties.js';

const M = script.minigames;

// ---------------------------------------------------------------- «Hazlo viral» (misión video)
export const VIRAL_LANES = [
  { codes: ['ArrowLeft', 'KeyA'], key: '←', label: M.viral.lanes[0], gesture: 'wave', color: 'var(--sky)' },
  { codes: ['ArrowUp', 'KeyW'], key: '↑', label: M.viral.lanes[1], gesture: 'cheer_arms', color: 'var(--sun)' },
  { codes: ['ArrowRight', 'KeyD'], key: '→', label: M.viral.lanes[2], gesture: 'clap', color: 'var(--grass)' },
  { codes: ['ArrowDown', 'KeyS'], key: '↓', label: M.viral.lanes[3], gesture: 'shrug', color: 'var(--c-reach)' },
];
// [beat, lane] at 96 BPM: ~28 s of take after a three-beat count-in.
export const VIRAL_BPM = 96;
export const VIRAL_CHART = [
  [0, 0], [2, 1], [4, 2], [6, 3],
  [8, 0], [9, 0], [10, 1], [12, 2],
  [14, 3], [15, 2], [16, 1], [18, 0],
  [20, 1], [21, 1], [22, 3], [23, 3],
  [24, 0], [26, 2], [27, 1], [28, 3],
  [30, 2], [31, 0], [32, 1], [33, 3],
  [35, 0], [36, 2], [37, 1], [39, 1],
];
export const VIRAL_TAKES = M.viral.takes;

// ---------------------------------------------------------------- Mitin final (misión finalSpeech)
// Each phrase lands on its punchline (Space). `beat` at 84 BPM.
export const RALLY_BPM = 84;
const RALLY_BEATS = [0, 4, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
export function rallyChart(state) {
  const phrases = say(M.rally.phrases, state);
  return RALLY_BEATS.map((beat, i) => ({ beat, text: phrases[i][0], punch: phrases[i][1] }));
}

// ---------------------------------------------------------------- Debate: duelo de réplicas (misión debate)
// `correct` es el índice de la respuesta que defiende algo concreto y asume su coste.
// El guion da topic/role/claim/options/correct; aquí se resuelve quién habla y qué personaje 3D gesticula.
// Si el guion trae `foxDebate.round` (role 'hard'), se añade como quinta y última ronda, con su propia
// interrupción (`foxDebate.interruption`) y reacciones (`foxDebate.reactions`), que dice el rival de Fox.
const ACTOR = Object.fromEntries([...DEBATE_ROLES.map(r => [r.role, r.actor]), ['moderator', 'Moderadora']]);
export const DUEL_ROLES = Object.keys(ACTOR);

/** Reacciones de una ronda con voz propia. Las ramas usan right/wrong/timeout o win/lose/timeout: se aceptan ambas. */
export function normalizeReactions(r = {}) {
  const out = { right: r.right ?? r.win, wrong: r.wrong ?? r.lose, timeout: r.timeout };
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
}

/** Ronda extra de Fox, o null si el guion no la define. */
export function foxRound(state) {
  const F = script.foxDebate, round = F && say(F.round, state);
  if (!round || !script.rivals.hard?.name) return null;
  return { ...round, role: 'hard', interruption: F.interruption, reactions: normalizeReactions(F.reactions) };
}

export function duelRounds(state) {
  const rivals = script.rivals, fox = foxRound(state);
  const rounds = [...say(M.duel.rounds, state), ...(fox ? [fox] : [])];
  return rounds.map(r => ({
    topic: r.topic, speaker: r.role === 'moderator' ? rivals.moderator : rivals[r.role].name, actor: ACTOR[r.role], role: r.role,
    claim: r.claim, options: [...r.options], correct: r.correct,
    ...(r.interruption ? { interruption: r.interruption } : {}), ...(r.reactions ? { reactions: r.reactions } : {}),
  }));
}

// ---------------------------------------------------------------- Seis sillas (misión finalPrep, plaza)
// Sin colisionadores: las sillas se recogen al pasar por encima y no estorban rutas.
export const CHAIRS = {
  time: 70,
  zone: [0, -1.5],
  start: [0, -3.4],
  spots: [[-5.0, -7.0, 0.6], [4.4, -8.2, -0.4], [-3.2, 5.8, 1.9], [5.6, 0.6, -1.2], [-6.4, -1.0, 2.6], [2.4, 8.8, 0.3]],
};
