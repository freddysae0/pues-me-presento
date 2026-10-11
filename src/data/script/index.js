// Guion del juego. `script` es actual.js (base) con b.js («Sátira de argumentario») fusionado encima.
// No hay selector: el texto se resuelve una sola vez, al cargar. Las ramas A y C están archivadas en
// docs/dialogue-branches/archive/ y el juego no las usa.
import actual from './actual.js';
import b from './b.js';

const isPlain = v => !!v && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;

/** Objetos se fusionan clave a clave; arrays, funciones y valores simples de la capa reemplazan enteros. */
export function deepMerge(base, over) {
  if (over === undefined) return base;
  if (!isPlain(base) || !isPlain(over)) return over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = deepMerge(base[k], v);
  return out;
}

/** actual.js con una capa encima (por defecto b.js). buildScript(null) → actual.js sin capa. */
export function buildScript(layer = b) {
  return layer ? deepMerge(actual, layer) : actual;
}

export const script = buildScript();

/** Resuelve un valor del guion: cadena tal cual, o función (state, ctx) con `rivals` siempre en ctx. */
export const say = (value, state, ctx = {}) => typeof value === 'function' ? value(state, { rivals: script.rivals, ...ctx }) : value;

/** 'moderator' | 'tech' | 'populist' | 'hard' → nombre del rival en este guion; cualquier otro hablante, tal cual. */
export const who = speaker => speaker === 'moderator' ? script.rivals.moderator : script.rivals[speaker]?.name ?? speaker;
