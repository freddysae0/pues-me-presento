import { debateCast } from '../data/parties.js';
import { script } from '../data/script/index.js';
// Procedural sound effects: no samples, everything is synthesised locally with Web Audio.
// Each function schedules nodes on (context, output) and returns the sources so callers can stop them.

const noiseBuffers = new WeakMap();
function noise(c) {
  let buffer = noiseBuffers.get(c);
  if (!buffer) { buffer = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = buffer.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; noiseBuffers.set(c, buffer); }
  return buffer;
}
function envelope(c, t, gain, duration, attack = 0.004) {
  const env = c.createGain(); env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + attack); env.gain.exponentialRampToValueAtTime(0.0001, t + duration); return env;
}
function filtered(c, source, { type, frequency, Q = 1 }) { const f = c.createBiquadFilter(); f.type = type; f.frequency.value = frequency; f.Q.value = Q; source.connect(f); return f; }
function blip(c, out, { type = 'sine', from, to = from, at = 0, duration, gain, filter }) {
  const t = c.currentTime + at, osc = c.createOscillator(); osc.type = type;
  osc.frequency.setValueAtTime(from, t); if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  (filter ? filtered(c, osc, filter) : osc).connect(envelope(c, t, gain, duration)).connect(out);
  osc.start(t); osc.stop(t + duration + 0.02); return osc;
}
function burst(c, out, { at = 0, duration, gain, type = 'bandpass', frequency, Q = 1, attack = 0.002 }) {
  const t = c.currentTime + at, src = c.createBufferSource(); src.buffer = noise(c);
  filtered(c, src, { type, frequency, Q }).connect(envelope(c, t, gain, duration, attack)).connect(out);
  src.start(t, Math.random() * 0.9, duration + 0.02); return src;
}

// Interface: soft tick on hover, bubbly pop on click, rising arpeggio to confirm (start-up notice), two falling notes to go back.
export const uiSounds = {
  hover: (c, out, v) => [blip(c, out, { from: 1650, to: 1350, duration: 0.04, gain: 0.19 * v })],
  click: (c, out, v) => [burst(c, out, { duration: 0.015, gain: 0.25 * v, frequency: 3200 }), blip(c, out, { from: 380, to: 920, duration: 0.08, gain: 0.45 * v })],
  confirm: (c, out, v) => [blip(c, out, { type: 'triangle', from: 523, duration: 0.09, gain: 0.4 * v }), blip(c, out, { type: 'triangle', from: 659, at: 0.08, duration: 0.09, gain: 0.4 * v }), blip(c, out, { type: 'triangle', from: 784, to: 1046, at: 0.16, duration: 0.22, gain: 0.45 * v })],
  back: (c, out, v) => [blip(c, out, { type: 'triangle', from: 720, to: 650, duration: 0.07, gain: 0.4 * v }), blip(c, out, { type: 'triangle', from: 480, to: 400, at: 0.075, duration: 0.11, gain: 0.4 * v })],
};

// Footsteps: a filtered noise scuff plus a low thump, tuned per floor.
const surfaces = {
  plaza: { frequency: 2300, Q: 0.9, thump: 85 },   // adoquín
  flat: { frequency: 750, Q: 1.6, thump: 125 },    // tarima
  hq: { frequency: 750, Q: 1.6, thump: 125 },
  hall: { frequency: 1200, Q: 1.2, thump: 105 },   // suelo de salón multiusos
};
export function footstep(c, out, v, surface, running) {
  const s = surfaces[surface] || surfaces.plaza, r = 0.85 + Math.random() * 0.3, g = v * r * (running ? 1.3 : 1);
  return [
    burst(c, out, { duration: running ? 0.05 : 0.075, gain: 0.5 * g, frequency: s.frequency * r, Q: s.Q, attack: 0.004 }),
    blip(c, out, { from: s.thump * 1.3, to: s.thump * 0.75, duration: 0.07, gain: 0.55 * g }),
  ];
}

// Babble: every syllable is a "p" (lip pop + short pitched vowel). Accented ones are a louder, higher "P";
// some come doubled as "pp". Timbre and formant change per character.
export const voices = {
  Tú: { pitch: 155, type: 'square', formant: 1150 },
  Marisa: { pitch: 190, type: 'triangle', formant: 1500 },
  Paco: { pitch: 115, type: 'sawtooth', formant: 820 },
  Lola: { pitch: 175, type: 'square', formant: 1700 },
  Dani: { pitch: 230, type: 'triangle', formant: 2100 },
  Nico: { pitch: 135, type: 'sawtooth', formant: 960 },
};
// Debate rivals and moderator: pitch from src/data/parties.js (leader.voicePitch), keyed by the names of the active script.
const DEBATE_TIMBRE = { tech: 'sawtooth', populist: 'triangle', hard: 'square', moderator: 'triangle' };
for (const c of debateCast(script.rivals)) voices[c.name] ??= { pitch: c.voicePitch, type: DEBATE_TIMBRE[c.role], formant: Math.round(c.voicePitch * 7.4) };
// Bandpassed triangle/saw waves are much quieter than square ones; equalise so every character is as audible.
const typeGain = { square: 1, sawtooth: 1.8, triangle: 3.2 };
const fallbackVoice = { pitch: 165, type: 'triangle', formant: 1300 };
export const voiceFor = speaker => voices[speaker] || fallbackVoice;
const SCALE = [0, 2, 4, 7, 9, -3, 5, 0];
const random = (n, seed) => { const x = Math.sin(n * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
const seedOf = text => [...text].reduce((a, ch) => a + ch.charCodeAt(0), 0);

// Pure description of a syllable at `index` (1-based, as revealed) of `text`: pitch offset, accent and doubling.
export function syllableShape(speaker, text, index) {
  const seed = seedOf(speaker), r = random(index, seed), word = text.slice(0, index).match(/[\p{L}]+$/u)?.[0] || '';
  const rest = text.slice(index).search(/[.?!…]/u), end = rest >= 0 && rest < 6 ? text[index + rest] : null;
  let semis = SCALE[Math.floor(r * SCALE.length)];
  if (end === '?') semis += 5; else if (end === '.' || end === '…') semis -= 2;
  const accent = /^[\p{Lu}]/u.test(word) || end === '!' || r > 0.82;
  return { semis, accent, double: random(index + 0.5, seed) > 0.8 };
}
export function plosive(c, out, v, voice, { semis, accent, double }, at = 0) {
  const f = voice.pitch * 2 ** (semis / 12) * (accent ? 1.15 : 1), g = (accent ? 1 : 0.7) * v * typeGain[voice.type], d = accent ? 0.09 : 0.07, nodes = [];
  for (let i = 0; i < (double ? 2 : 1); i++) {
    const t = at + i * 0.06;
    nodes.push(burst(c, out, { at: t, duration: 0.014, gain: 0.35 * g, frequency: voice.formant * 1.6, Q: 0.8, attack: 0.001 }));
    nodes.push(blip(c, out, { type: voice.type, from: f * 1.3, to: f, at: t + 0.006, duration: d, gain: 0.9 * g, filter: { type: 'bandpass', frequency: voice.formant, Q: 1.3 } }));
  }
  return nodes;
}
