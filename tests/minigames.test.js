import test from 'node:test';
import assert from 'node:assert/strict';
import { newCampaign, advance, appoint, chooseProposal, finishSpeech, validCampaign, markSeen, passedCinematics, makeCheckpoint, restoreCheckpoint, crossExit } from '../src/state/campaign.js';
import { recordMinigame, viralBonus, chairsBonus, duelBonus, rallyBonus, clampBonus } from '../src/state/minigames.js';
import { cinematicFor } from '../src/data/cinematics.js';
import { duelRounds, rallyChart, VIRAL_CHART, CHAIRS } from '../src/data/minigames.js';
import { LocalPersistence, SAVE_KEY } from '../src/save/persistence.js';
import { friends } from '../src/data/campaign.js';

function at(target) {
  const s = newCampaign();
  while (s.mission !== target) {
    const id = s.mission;
    if (id === 'call') friends.forEach(f => appoint(s, f.id, 0));
    if (id === 'register') s.party = { name: 'Partido de prueba', slogan: 'Una cosa bien hecha.', color: '#42877c' };
    if (id === 'program') chooseProposal(s, 'shade');
    if (id === 'speech') finishSpeech(s, ['listen', 'shade', 'accountable'], 1);
    advance(s, id); crossExit(s); // walk through the door, if the next mission is in another scene
  }
  return s;
}

test('minigame bonuses are bounded, never negative, and grow with the result', () => {
  assert.deepEqual(viralBonus({ points: 0, max: 56 }), { reach: 0 });
  assert.deepEqual(viralBonus({ points: 56, max: 56 }), { reach: 10 });
  assert.deepEqual(chairsBonus({ delivered: 6, timeLeft: 25 }), { organization: 8 });
  assert.deepEqual(chairsBonus({ delivered: 6, timeLeft: 5 }), { organization: 6 });
  assert.deepEqual(chairsBonus({ delivered: 2, timeLeft: 0 }), { organization: 2 });
  assert.deepEqual(duelBonus({ points: 8, max: 8, correct: 4, rounds: 4 }), { credibility: 6, support: 2 });
  assert.deepEqual(duelBonus({ points: 1, max: 8, correct: 1, rounds: 4 }), { credibility: 1, support: 0 });
  // Five rounds (Fox): same proportions, support still needs all but one.
  assert.deepEqual(duelBonus({ points: 10, max: 10, correct: 5, rounds: 5 }), { credibility: 6, support: 2 });
  assert.deepEqual(duelBonus({ points: 7, max: 10, correct: 4, rounds: 5 }), { credibility: 4, support: 2 });
  assert.deepEqual(duelBonus({ points: 6, max: 10, correct: 3, rounds: 5 }), { credibility: 4, support: 0 });
  assert.ok(rallyBonus({ hits: 12, notes: 12, attention: 1 }).support === 6);
  assert.deepEqual(clampBonus('viral', { reach: 999, support: 50 }), { reach: 10 });
  assert.deepEqual(clampBonus('chairs', { organization: -4 }), {});
});

test('minigame results are recorded once, only during their mission, and skipping gives nothing', () => {
  const s = at('video'), reach = s.reach;
  assert.equal(recordMinigame(s, 'duel', { score: 8, bonus: { credibility: 6 } }), false, 'out of order');
  assert.equal(recordMinigame(s, 'viral', { score: 40, bonus: { reach: 7 } }), true);
  assert.equal(s.reach, reach + 7);
  assert.equal(recordMinigame(s, 'viral', { score: 56, bonus: { reach: 10 } }), false, 'idempotent');
  assert.equal(s.reach, reach + 7);
  assert.equal(validCampaign(JSON.parse(JSON.stringify(s))), true);
  const t = at('finalPrep'), org = t.organization;
  assert.equal(recordMinigame(t, 'chairs', { skipped: true }), true);
  assert.equal(t.organization, org); assert.deepEqual(t.minigames.chairs, { score: 0, bonus: {}, skipped: true });
});

test('cinematics play once, survive the checkpoint retry and are migrated for old saves', () => {
  const s = newCampaign();
  assert.equal(cinematicFor(s), 'intro'); assert.equal(markSeen(s, 'intro'), true); assert.equal(markSeen(s, 'intro'), false); assert.equal(cinematicFor(s), null);
  const plaza = at('neighbor'); assert.equal(cinematicFor(plaza), 'plaza');
  assert.equal(cinematicFor(at('program')), null, 'only on arrival');
  assert.equal(cinematicFor(at('hqBrief')), 'hq'); assert.equal(cinematicFor(at('debate')), 'hall');
  // Walked transition: no arrival cinematic while the exit is still pending, only once through the door.
  const walking = at('aftermath'); advance(walking, 'aftermath'); assert.equal(walking.scene, 'plaza'); assert.equal(cinematicFor(walking), null);
  crossExit(walking); assert.equal(cinematicFor(walking), 'hq'); markSeen(walking, 'hq'); assert.equal(cinematicFor(walking), null); assert.equal(cinematicFor(at('finalSpeech')), null);
  assert.deepEqual(passedCinematics(at('crisis')), { intro: true, plaza: true, hq: true });
  const c = at('crisis'); makeCheckpoint(c); advance(c, 'crisis'); markSeen(c, 'hall'); markSeen(c, 'defeat');
  const restored = restoreCheckpoint(c); assert.equal(restored.mission, 'crisis'); assert.equal(restored.seen.hall, true); assert.equal(restored.seen.defeat, true);
  // A save from before cinematics existed resumes without replaying arrivals it already passed.
  const map = new Map(), store = new LocalPersistence({ getItem: k => map.get(k), setItem: (k, v) => map.set(k, v) });
  const old = at('video'); delete old.seen; delete old.minigames; map.set(SAVE_KEY, JSON.stringify(old));
  const loaded = store.load().state; assert.ok(loaded); assert.equal(cinematicFor(loaded), null); assert.deepEqual(loaded.minigames, {});
  assert.equal(validCampaign({ ...at('video'), seen: [] }), false);
});

test('minigame data is deterministic and covers every proposal', () => {
  for (const proposal of ['shade', 'parking', 'festival', 'housing']) {
    const s = at('debate'); s.proposal = proposal;
    const rounds = duelRounds(s); assert.equal(rounds.length, 5); assert.equal(rounds[4].role, 'hard', 'Fox closes the duel');
    for (const r of rounds) { assert.equal(r.options.length, 3); assert.ok(r.correct >= 0 && r.correct < 3); }
    assert.equal(rallyChart(s).length, 12);
  }
  const beats = VIRAL_CHART.map(([b]) => b); assert.deepEqual(beats, [...beats].sort((a, b) => a - b));
  assert.equal(CHAIRS.spots.length, 6);
});
