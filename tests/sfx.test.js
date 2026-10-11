import test from 'node:test';
import assert from 'node:assert/strict';
import { syllableShape, voiceFor, voices } from '../src/audio/sfx.js';
import { script } from '../src/data/script/index.js';

test('babble syllables are deterministic and follow punctuation', () => {
  const line = 'Hola, ¿vienes mañana? Vale.';
  assert.deepEqual(syllableShape('Marisa', line, 2), syllableShape('Marisa', line, 2));
  assert.equal(syllableShape('Marisa', line, 2).accent, true); // «Hola» empieza en mayúscula: P
  const asked = syllableShape('Marisa', 'Mañana vale?', 10), stated = syllableShape('Marisa', 'Mañana vale.', 10);
  assert.equal(asked.semis - stated.semis, 7, 'pregunta sube, afirmación baja');
  assert.notDeepEqual(['Lola', 'Dani', 'Nico'].map(s => syllableShape(s, line, 9).semis + voiceFor(s).pitch), [0, 0, 0]);
});
test('every speaking character has its own voice', () => {
  const pitches = Object.values(voices).map(v => v.pitch);
  assert.equal(new Set(pitches).size, pitches.length);
  assert.ok(voiceFor('Desconocido').pitch > 0);
  assert.equal(voiceFor(script.rivals.hard.name).pitch, 140, 'Fox babbles at the pitch from parties.js');
});
