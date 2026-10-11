import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { trackFor } from '../src/audio/music.js';
import { music } from '../src/assets/catalog.js';

test('every catalogued music track exists locally', () => {
  for (const [id, t] of Object.entries(music)) assert.ok(existsSync(new URL(`../public/${t.path.slice(2)}`, import.meta.url)), id);
});
test('music follows scene, mission and mode', () => {
  assert.equal(trackFor({ scene: 'flat', mission: 'phone' }, 'menu'), 'theme');
  assert.equal(trackFor({ scene: 'flat', mission: 'call' }, 'modal'), 'flat');
  assert.equal(trackFor({ scene: 'plaza', mission: 'neighbor' }, 'dialogue'), 'plaza');
  assert.equal(trackFor({ scene: 'plaza', mission: 'speech' }, 'speech'), 'speech');
  assert.equal(trackFor({ scene: 'plaza', mission: 'video' }, 'play'), 'plaza');
  assert.equal(trackFor({ scene: 'plaza', mission: 'video' }, 'modal'), 'trend');
  assert.equal(trackFor({ scene: 'plaza', mission: 'video' }, 'minigame'), 'trend');
  assert.equal(trackFor({ scene: 'hall', mission: 'finalSpeech' }, 'minigame'), 'speech');
  assert.equal(trackFor({ scene: 'hq', mission: 'hqBrief' }, 'play'), 'hq');
  assert.equal(trackFor({ scene: 'hq', mission: 'crisis' }, 'play'), 'crisis');
  for (const scene of ['flat', 'plaza', 'hq', 'hall']) for (const mode of ['menu', 'play', 'modal', 'dialogue', 'speech', 'cinematic', 'minigame']) assert.ok(music[trackFor({ scene, mission: 'debate' }, mode)]);
});
