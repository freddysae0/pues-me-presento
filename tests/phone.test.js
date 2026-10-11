import test from 'node:test';
import assert from 'node:assert/strict';
import { newCampaign, advance, appoint, chooseProposal, finishSpeech, applyEffect, electionForecast, validCampaign, makeCheckpoint, restoreCheckpoint, crossExit } from '../src/state/campaign.js';
import { phoneAvailable, unlockedNotifications, unreadNotifications, markRead, pollFor, pollWithTrend, previousState, programsFor, rivalCast } from '../src/state/phone.js';
import { notifications, rivalPolicies } from '../src/data/phoneNews.js';
import { LocalPersistence, SAVE_KEY } from '../src/save/persistence.js';
import { friends, missions } from '../src/data/campaign.js';

const KEY = { hqBrief: 'hq', video: 'video', crisis: 'crisis', debate: 'debate', finalPrep: 'prep', finalSpeech: 'final' };
function at(target, picks = {}) {
  const s = newCampaign();
  while (s.mission !== target) {
    const id = s.mission;
    if (id === 'call') friends.forEach(f => appoint(s, f.id, 0));
    if (id === 'register') s.party = { name: 'Partido de prueba', slogan: 'Una cosa bien hecha.', color: '#42877c' };
    if (id === 'neighbor') s.memories.listened = true;
    if (id === 'program') chooseProposal(s, 'shade');
    if (id === 'speech') finishSpeech(s, ['listen', 'shade', 'accountable'], 1);
    if (id === 'crisis') makeCheckpoint(s);
    if (KEY[id] && picks[id]) s.campaignChoices[KEY[id]] = picks[id];
    advance(s, id); crossExit(s);
  }
  return s;
}
const ids = s => unlockedNotifications(s).map(n => n.id);

test('the phone unlocks after the first mission and notifications follow mission order', () => {
  assert.equal(phoneAvailable(newCampaign()), false);
  assert.equal(phoneAvailable(at('call')), true);
  const early = ids(at('call')), later = ids(at('speech'));
  assert.ok(early.includes('start-news') && early.includes('phone-lola'));
  assert.ok(!early.includes('register-press'), 'nothing from missions not yet completed');
  assert.ok(early.every(id => later.includes(id)), 'unlocked notifications never disappear as the campaign advances');
  // Order: by the mission that unlocks them.
  const index = id => missions.findIndex(m => m.id === unlockedNotifications(at('speech')).find(n => n.id === id).after);
  const order = later.map(index); assert.deepEqual(order, [...order].sort((a, b) => a - b));
  // Every notification id is unique, every text resolves to a string.
  assert.equal(new Set(notifications.map(n => n.id)).size, notifications.length);
  for (const n of unlockedNotifications(at('election'))) { assert.equal(typeof n.text, 'string'); assert.ok(n.text.length > 10); assert.equal(typeof n.from, 'string'); }
});

test('notifications react to decisions and memories', () => {
  const admit = ids(at('debate', { crisis: 'admit' })), blame = ids(at('debate', { crisis: 'blame' }));
  assert.ok(admit.includes('crisis-admit') && !admit.includes('crisis-blame'));
  assert.ok(blame.includes('crisis-blame') && !blame.includes('crisis-admit'));
  const s = at('program'); assert.ok(ids(s).includes('neighbor-listened')); assert.ok(!ids(s).includes('neighbor-both'));
  const both = at('neighbor'); both.memories.promisedBoth = true; advance(both, 'neighbor'); assert.ok(ids(both).includes('neighbor-both'));
  // Rival policies arrive as press notifications too.
  assert.ok(ids(at('aftermath')).includes(`policy-${rivalPolicies.tech[2].id}`));
});

test('read ids are idempotent, persisted as { id: true } and validated', () => {
  const s = at('hqBrief');
  const unread = unreadNotifications(s).length; assert.ok(unread > 0);
  assert.equal(markRead(s, ids(s)), unread); assert.equal(markRead(s, ids(s)), 0);
  assert.equal(unreadNotifications(s).length, 0); assert.ok(validCampaign(s));
  assert.equal(validCampaign({ ...s, phoneRead: ['a'] }), false);
  assert.equal(validCampaign({ ...s, phoneRead: { a: 'yes' } }), false);
  // Old saves without the field still load; new ones keep it.
  const map = new Map(), store = new LocalPersistence({ getItem: k => map.get(k), setItem: (k, v) => map.set(k, v) });
  const old = at('video'); delete old.phoneRead; map.set(SAVE_KEY, JSON.stringify(old));
  assert.ok(store.load().state); assert.equal(unreadNotifications(store.load().state).length, unlockedNotifications(old).length);
  assert.ok(store.save(s)); assert.deepEqual(store.load().state.phoneRead, s.phoneRead);
});

test('retrying from the checkpoint keeps what was already read', () => {
  const s = at('debate'); markRead(s, ids(s));
  const retry = restoreCheckpoint(s); assert.equal(retry.mission, 'crisis');
  assert.ok(ids(s).filter(id => ids(retry).includes(id)).every(id => retry.phoneRead[id]));
});

test('poll: sums to 100, player first exactly when the forecast is winning', () => {
  for (const target of ['leave', 'speech', 'crisis', 'finalPrep', 'election']) {
    for (const v of [0, 20, 40, 47, 48, 49, 60, 80, 100]) {
      const s = at(target); Object.assign(s, { support: v, credibility: v, organization: v });
      const p = pollFor(s), f = electionForecast(s);
      const total = p.rows.reduce((t, r) => t + r.share, 0);
      assert.ok(Math.abs(total - 100) < 0.05, `sum ${total}`);
      assert.ok(p.rows.every(r => r.share >= 0));
      const best = p.rows.filter(r => r.id !== 'undecided').sort((a, b) => b.share - a.share)[0];
      assert.equal(best.id === 'player', f.winning, `${target} ${v}: ${JSON.stringify(p.rows)}`);
      assert.equal(p.winning, f.winning);
      assert.equal(p.player.share >= p.threshold, f.winning);
    }
  }
  const before = pollFor(at('register')); assert.equal(before.player, null); assert.equal(before.hasParty, false);
  assert.equal(pollFor(at('call')).player, null, 'no party, no player row');
  assert.deepEqual(rivalCast().map(r => r.role), ['tech', 'populist', 'hard']);
});

test('poll is deterministic and rivals move with decisions', () => {
  const a = pollFor(at('finalPrep', { debate: 'attack' })), b = pollFor(at('finalPrep', { debate: 'attack' }));
  assert.deepEqual(a, b);
  const promise = pollFor(at('finalPrep', { debate: 'promise' }));
  const share = (p, id) => p.rows.find(r => r.id === id).share;
  assert.ok(share(promise, 'populist') > share(a, 'populist'), 'attacking the populist rival costs them; copying their promise helps them');
});

test('trend compares with the start of the last mission', () => {
  assert.equal(previousState(newCampaign()), null);
  const s = at('hqBrief'); const prev = previousState(s);
  assert.equal(prev.mission, 'aftermath'); assert.equal(prev.completed.length, s.completed.length - 1);
  // A mission with a known effect: the choice in the HQ is subtracted to build the previous poll.
  const h = at('hqBrief'); applyEffect(h, { credibility: 8, organization: 5, reach: -2 }); h.campaignChoices.hq = 'accounts'; advance(h, 'hqBrief');
  const p = previousState(h); assert.equal(p.credibility, h.credibility - 8); assert.equal(p.campaignChoices.hq, undefined);
  const t = pollWithTrend(h); assert.ok(t.player.delta > 0, 'credibility up → player up');
  assert.equal(pollWithTrend(at('register')).player, null);
  assert.equal(pollWithTrend(at('leave')).player.delta, null, 'the party did not exist before registering');
});

test('programs: player program and rival announcements grow with the campaign', () => {
  const early = programsFor(at('leave')), late = programsFor(at('election', { hqBrief: 'accounts', debate: 'tradeoff' }));
  assert.equal(early.player.proposal, null);
  assert.equal(late.player.proposal.title.length > 0, true);
  assert.deepEqual(late.player.decisions.map(d => d.mission), ['hqBrief', 'debate']);
  for (const r of late.rivals) assert.ok(r.policies.length > early.rivals.find(e => e.role === r.role).policies.length);
  assert.equal(programsFor(at('call')).player, null);
});
