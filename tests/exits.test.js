// Walked transitions between scenes: the next mission starts in the old scene with a pending exit until the player
// crosses the signposted door (src/state/campaign.js: pendingExit, crossExit, objectiveFor).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { newCampaign, advance, appoint, chooseProposal, finishSpeech, makeCheckpoint, restoreCheckpoint, validCampaign, pendingExit, crossExit, objectiveFor, missionFor, SCHEMA } from '../src/state/campaign.js';
import { missions, friends, exits, travels } from '../src/data/campaign.js';
import { LocalPersistence, SAVE_KEY } from '../src/save/persistence.js';
import { script } from '../src/data/script/index.js';
import actual from '../src/data/script/actual.js';

const WALKED = ['hqBrief', 'video', 'crisis', 'debate', 'finalPrep', 'finalSpeech'];
const NEEDLES = ['La sede es mi salón', 'Hazlo viral', 'Eso no fue', 'debate', 'Última vuelta', 'último mitin', 'noche de las sillas'];

/** State right after finishing the mission before `target` (exit pending if the scene changes). */
function finished(target) {
  const s = newCampaign();
  for (;;) {
    const id = s.mission;
    if (id === 'call') friends.forEach(f => appoint(s, f.id, 0));
    if (id === 'register') s.party = { name: 'Partido de prueba', slogan: 'Una cosa bien hecha.', color: '#42877c' };
    if (id === 'program') chooseProposal(s, 'shade');
    if (id === 'speech') finishSpeech(s, ['listen', 'shade', 'accountable'], 1);
    if (id === 'crisis') makeCheckpoint(s);
    assert.ok(advance(s, id), `advance ${id}`);
    if (s.mission === target) return s;
    crossExit(s);
  }
}
const memoryStore = () => { const map = new Map(); return { map, store: new LocalPersistence({ getItem: k => map.get(k), setItem: (k, v) => map.set(k, v) }) }; };

test('every change of scene except the flat door is walked; same-scene steps are not', () => {
  const walked = missions.slice(1).filter((m, i) => missions[i].scene !== m.scene && !missions[i].travel).map(m => m.id);
  assert.deepEqual(walked, WALKED);
  assert.equal(missions.find(m => m.id === 'leave').travel, true);
  const s = finished('neighbor'); assert.equal(s.scene, 'plaza', 'the flat door is the trip itself'); assert.equal(pendingExit(s), null);
  for (const id of ['election', 'complete']) assert.equal(pendingExit(finished(id)), null, `${id}: same scene, no exit`);
});

test('pending exit: objective points at a real door, nothing else advances, crossing is idempotent and free', () => {
  const world = readFileSync(new URL('../src/world/world.js', import.meta.url), 'utf8');
  for (const id of WALKED) {
    const s = finished(id), m = missionFor(s), prev = missions[missions.indexOf(m) - 1];
    const exit = pendingExit(s);
    assert.deepEqual(exit, { from: prev.scene, to: m.scene, door: exits[prev.scene][m.scene], mission: id }, id);
    assert.ok(world.includes(`this.exit('${exit.door}'`), `${id}: exit entity ${exit.door} exists in world.js`);
    const goal = objectiveFor(s);
    assert.equal(goal.target, exit.door); assert.equal(goal.title, travels[id].title); assert.ok(goal.objective && goal.prompt && goal.loading && goal.sign);
    assert.equal(validCampaign(JSON.parse(JSON.stringify(s))), true, `${id}: a save at the door is valid`);
    // Strict order: the mission behind the door cannot be completed from the old scene.
    const before = structuredClone(s); assert.equal(advance(s, id), false); assert.deepEqual(s, before);
    assert.equal(crossExit(s), true); assert.equal(s.scene, m.scene); assert.equal(pendingExit(s), null);
    assert.equal(crossExit(s), false, 'idempotent'); assert.equal(objectiveFor(s), m);
    for (const k of ['support', 'credibility', 'reach', 'organization', 'completed', 'mission', 'memories', 'minigames']) assert.deepEqual(s[k], before[k], `${id}: crossing changes no ${k}`);
    assert.equal(validCampaign(s), true);
  }
});

test('validation accepts only the mission scene or the previous scene while its exit is pending', () => {
  const s = finished('hqBrief');
  assert.equal(validCampaign({ ...s, scene: 'plaza' }), true); assert.equal(validCampaign({ ...s, scene: 'hq' }), true);
  assert.equal(validCampaign({ ...s, scene: 'hall' }), false); assert.equal(validCampaign({ ...s, scene: 'flat' }), false);
  const n = finished('neighbor'); assert.equal(validCampaign({ ...n, scene: 'flat' }), false, 'the flat door is not a pending exit');
  const e = finished('election'); assert.equal(validCampaign({ ...e, scene: 'plaza' }), false);
});

test('reload at the door keeps progress and the old scene; old saves and the retry are unaffected', () => {
  const { map, store } = memoryStore();
  const s = finished('debate'); assert.equal(store.save(s), true);
  const loaded = store.load().state; assert.deepEqual(loaded, s); assert.equal(loaded.scene, 'hq'); assert.equal(objectiveFor(loaded).target, 'hqDoor');
  assert.equal(loaded.version, SCHEMA);
  // A save written before walked exits (scene already = mission scene) loads as it was: already past the door.
  const old = finished('video'); crossExit(old); delete old.phoneRead; map.set(SAVE_KEY, JSON.stringify(old));
  assert.deepEqual(store.load().state, old); assert.equal(pendingExit(store.load().state), null);
  // v1 saves still migrate.
  const v1 = finished('hqBrief'); crossExit(v1); Object.assign(v1, { version: 1 }); delete v1.organization; delete v1.campaignChoices; delete v1.checkpoint; delete v1.result;
  map.set(SAVE_KEY, JSON.stringify(v1)); const migrated = store.load().state; assert.ok(migrated); assert.equal(migrated.scene, 'hq');
  // Defeat → retry restores the crisis checkpoint, taken in the sede: no pending exit.
  const r = finished('debate'); const retry = restoreCheckpoint(r); assert.equal(retry.mission, 'crisis'); assert.equal(retry.scene, 'hq'); assert.equal(pendingExit(retry), null);
});

test('travel texts exist in the base and effective script and never contain the mission needles', () => {
  for (const s of [actual, script]) for (const id of WALKED) {
    const t = s.travel[id]; assert.ok(t, `travel.${id}`);
    for (const k of ['title', 'objective', 'prompt', 'loading', 'sign']) assert.ok(typeof t[k] === 'string' && t[k].trim(), `travel.${id}.${k}`);
    for (const n of NEEDLES) assert.ok(!t.title.includes(n) && !t.objective.includes(n), `travel.${id} must not contain «${n}» (tests look for it)`);
  }
});
