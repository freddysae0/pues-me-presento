import test from 'node:test';
import assert from 'node:assert/strict';
import { newCampaign, validCampaign, advance, appoint, chooseProposal, finishSpeech, applyEffect, scoreSpeech, electionForecast, makeCheckpoint, restoreCheckpoint, crossExit } from '../src/state/campaign.js';
import { LocalPersistence, SAVE_KEY } from '../src/save/persistence.js';
import { friends } from '../src/data/campaign.js';

function street() {
  const s = newCampaign(); advance(s, 'phone'); friends.forEach(f => appoint(s, f.id, 0)); advance(s, 'call');
  s.party = { name: 'Partido de prueba', slogan: 'Un banco con sombra.', color: '#42877c' }; advance(s, 'register'); advance(s, 'leave'); return s;
}
test('ordered progression, no duplicate rewards, complete and serializable slice', () => {
  const s = street(); assert.equal(validCampaign(s), true); assert.equal(advance(s, 'speech'), false);
  s.memories.listened = true; applyEffect(s, { credibility: 4 }); advance(s, 'neighbor'); chooseProposal(s, 'shade'); advance(s, 'program');
  finishSpeech(s, ['listen', 'shade', 'accountable'], 1); const support = s.support;
  assert.equal(finishSpeech(s, ['listen', 'shade', 'accountable'], 1), false); assert.equal(s.support, support);
  advance(s, 'speech'); advance(s, 'aftermath'); assert.equal(s.mission, 'hqBrief'); assert.equal(validCampaign(JSON.parse(JSON.stringify(s))), true);
});
test('coherence and listening outweigh perfect timing on contradictory promises', () => {
  const s = street(); s.memories.listened = true; chooseProposal(s, 'shade');
  const good = scoreSpeech(s, ['listen', 'shade', 'accountable'], 0), bad = scoreSpeech(s, ['grand', 'everything', 'forever'], 1);
  assert.ok(good.score > bad.score); assert.ok(bad.reach > good.reach); assert.ok(bad.credibility < 0);
});
test('NPC memory penalizes incompatible promises, proposals cannot be farmed', () => {
  const s = street(); s.memories.promisedBoth = true; const before = s.credibility; chooseProposal(s, 'shade'); assert.equal(s.credibility, before + 4 - 6);
  assert.equal(chooseProposal(s, 'parking'), false); assert.equal(s.proposal, 'shade');
});
test('storage recovers from corruption, unsupported version and inaccessible storage', () => {
  const map = new Map(), store = new LocalPersistence({ getItem: k => map.get(k), setItem: (k, v) => map.set(k, v) });
  assert.equal(store.save(street()), true); assert.deepEqual(store.load().state, street());
  map.set(SAVE_KEY, '{bad'); assert.ok(store.load().error);
  map.set(SAVE_KEY, JSON.stringify({ ...street(), version: 99 })); assert.ok(store.load().error);
  const denied = new LocalPersistence({ getItem: () => { throw Error(); }, setItem: () => { throw Error(); } }); assert.equal(denied.save(street()), false); assert.ok(denied.load().error);
});
test('reject impossible mission jumps and malformed state', () => {
  assert.equal(validCampaign({ ...newCampaign(), mission: 'speech', scene: 'plaza' }), false);
  assert.equal(validCampaign({ ...newCampaign(), credibility: null }), false);
  assert.equal(validCampaign({ ...newCampaign(), completed: {} }), false);
});
test('deterministic election supports loss and a real checkpoint comeback', () => {
  const s = street(); advance(s, 'neighbor'); chooseProposal(s, 'festival'); advance(s, 'program'); finishSpeech(s, ['grand','everything','forever'], 0); advance(s, 'speech'); advance(s, 'aftermath');
  crossExit(s); advance(s, 'hqBrief'); crossExit(s); advance(s, 'video'); crossExit(s); makeCheckpoint(s);
  assert.equal(electionForecast(s).winning, false);
  applyEffect(s, { support: 16, credibility: 22, organization: 10 }); advance(s, 'crisis'); crossExit(s);
  applyEffect(s, { support: 5, credibility: 10 }); advance(s, 'debate'); crossExit(s);
  applyEffect(s, { support: 12 }); advance(s, 'finalPrep'); crossExit(s);
  applyEffect(s, { support: 8, credibility: 8, organization: 5 }); advance(s, 'finalSpeech');
  assert.equal(electionForecast(s).winning, true);
  const retry = restoreCheckpoint(s); assert.equal(retry.mission, 'crisis'); assert.equal(electionForecast(retry).winning, false);
});
