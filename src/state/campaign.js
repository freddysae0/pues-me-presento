import { missions, proposals, friends, exits, travels } from '../data/campaign.js';
export const SCHEMA = 2;
export function newCampaign() {
  return { version: SCHEMA, mission: 'phone', scene: 'flat', completed: [], party: null, team: {}, memories: {}, proposal: null, support: 12, credibility: 50, reach: 0, organization: 25, speech: null, campaignChoices: {}, checkpoint: null, result: null, activeSeconds: 0, seen: {}, minigames: {} };
}
export function missionFor(state) { return missions.find(m => m.id === state.mission); }
export function applyEffect(state, effect = {}) {
  for (const key of ['support', 'credibility', 'reach', 'organization']) state[key] = Math.max(0, Math.min(100, state[key] + (effect[key] || 0)));
}
export function advance(state, id) {
  if (state.mission !== id || pendingExit(state)) return false; // a mission is played in its own scene: cross the door first
  const m = missionFor(state);
  if (!m.next) return false;
  applyEffect(state, m.effect); state.completed.push(id); state.mission = m.next;
  // A travel mission (the flat's door) is the trip itself. Otherwise the player stays in this scene and walks to its
  // exit: `state.scene` keeps the old scene until crossExit(). Saving here is safe; a reload lands at this scene's entry.
  if (m.travel) state.scene = missionFor(state).scene;
  return true;
}

// ---------------------------------------------------------------- walked transitions (pending exit)
// Derived, not stored: the exit is pending while `state.scene` is still the scene of the previous mission.
// No schema change: every older save has scene === mission scene, i.e. it is already past the door.
/** { from, to, door, mission } while the player must walk to an exit, else null. */
export function pendingExit(state) {
  const m = missionFor(state);
  if (!m || state.scene === m.scene) return null;
  return { from: state.scene, to: m.scene, door: exits[state.scene]?.[m.scene] ?? null, mission: m.id };
}
/** Cross the pending exit: idempotent, it only moves the scene forward to the current mission's. */
export function crossExit(state) {
  if (!pendingExit(state)) return false;
  state.scene = missionFor(state).scene; return true;
}
/** What the HUD, the marker and E point at: the mission, or the walk to its exit ({ id, target, title, objective, exit }). */
export function objectiveFor(state) {
  const m = missionFor(state), exit = pendingExit(state);
  if (!exit) return m;
  const t = travels[m.id];
  return { id: `exit-${m.id}`, scene: exit.from, target: exit.door, title: t.title, objective: t.objective, prompt: t.prompt, loading: t.loading, sign: t.sign, exit };
}
/** The scene a mission may be in: its own, or the previous mission's while its exit is pending. */
function sceneAllowed(s, step) {
  const m = missions[step], prev = missions[step - 1];
  if (s.scene === m.scene) return true;
  return !!prev && !prev.travel && prev.scene === s.scene && !!exits[s.scene]?.[m.scene] && !!travels[m.id];
}
export function appoint(state, friendId, index) {
  const friend = friends.find(f => f.id === friendId), choice = friend?.choices[index];
  if (!choice || state.team[friendId]) return false;
  state.team[friendId] = { job: choice.job, relation: choice.relation };
  applyEffect(state, choice); return true;
}
export function chooseProposal(state, id) {
  if (state.proposal) return false;
  const p = proposals.find(p => p.id === id); if (!p) return false;
  state.proposal = id; applyEffect(state, p);
  if (state.memories.promisedBoth) applyEffect(state, { credibility: -6 });
  return true;
}
export function scoreSpeech(state, picks, timing) {
  const opening = { listen: state.memories.listened ? 3 : 2, joke: 1, grand: -1 }[picks[0]] ?? 0;
  const coherence = picks[1] === state.proposal ? 4 : picks[1] === 'everything' ? -4 : -2;
  const closing = { accountable: 2, chant: 1, forever: -2 }[picks[2]] ?? 0;
  const execution = timing >= 0.68 ? 3 : timing >= 0.35 ? 1 : 0;
  const score = opening + coherence + closing + execution;
  return { picks, timing, score, coherent: coherence > 0, support: Math.max(-3, score), credibility: coherence > 0 ? 3 : -6, reach: picks[1] === 'everything' ? 12 : 4 };
}
export function finishSpeech(state, picks, timing) {
  if (state.speech) return false;
  state.speech = scoreSpeech(state, picks, timing); applyEffect(state, state.speech); return true;
}
export function validCampaign(s) {
  if (!s || s.version !== SCHEMA || !missionFor(s) || !sceneAllowed(s, missions.findIndex(m => m.id === s.mission))) return false;
  if (!['support', 'credibility', 'reach', 'organization', 'activeSeconds'].every(k => Number.isFinite(s[k]) && s[k] >= 0)) return false;
  if (['support', 'credibility', 'reach', 'organization'].some(k => s[k] > 100)) return false;
  if (!Array.isArray(s.completed) || !s.team || typeof s.team !== 'object' || !s.memories || typeof s.memories !== 'object') return false;
  if (s.proposal !== null && !proposals.some(p => p.id === s.proposal)) return false;
  const step = missions.findIndex(m => m.id === s.mission);
  if (s.completed.length !== step || !missions.slice(0, step).every((m, i) => s.completed[i] === m.id)) return false;
  if (step >= 2 && !friends.every(f => f.choices.some(c => c.job === s.team[f.id]?.job))) return false;
  if (step >= 3 && (!s.party || typeof s.party.name !== 'string' || s.party.name.length > 32 || typeof s.party.slogan !== 'string' || s.party.slogan.length > 70 || !['#d5754f', '#42877c', '#7473a5'].includes(s.party.color))) return false;
  if (step >= 6 && !s.proposal) return false;
  // Optional since v0.3 (cinematics seen, minigame results); older saves are migrated by the persistence adapter.
  for (const k of ['seen', 'minigames']) if (s[k] !== undefined && (typeof s[k] !== 'object' || s[k] === null || Array.isArray(s[k]))) return false;
  // Optional since the player's phone (src/state/phone.js): ids of notifications already read, { id: true }.
  if (s.phoneRead !== undefined && (typeof s.phoneRead !== 'object' || s.phoneRead === null || Array.isArray(s.phoneRead) || !Object.values(s.phoneRead).every(v => v === true))) return false;
  if (step >= 7 && (!s.speech || !Number.isFinite(s.speech.score))) return false;
  return true;
}

export function electionScore(state) { return Math.round(state.support * .55 + state.credibility * .30 + state.organization * .15); }
export function electionForecast(state) { const score = electionScore(state); return { score, threshold: 48, winning: score >= 48, gap: 48 - score }; }
export function makeCheckpoint(state) { state.checkpoint = structuredClone({ ...state, checkpoint: null }); }
// Cinematics already watched survive the retry: the checkpoint rewinds the campaign, not what the player has seen.
export function restoreCheckpoint(state) { return state.checkpoint ? structuredClone({ ...state.checkpoint, checkpoint: state.checkpoint, result: null, seen: { ...state.checkpoint.seen, ...state.seen }, phoneRead: { ...state.checkpoint.phoneRead, ...state.phoneRead } }) : null; }

// Cinematics play once per campaign. Each one belongs to the mission at which it is triggered.
export const CINEMATIC_MISSION = { intro: 'phone', plaza: 'neighbor', hq: 'hqBrief', hall: 'debate' };
export function markSeen(state, id) { state.seen ??= {}; if (state.seen[id]) return false; state.seen[id] = true; return true; }
/** Cinematics whose mission is already behind `state` (migrating old saves, debug jumps). */
export function passedCinematics(state) {
  const step = missions.findIndex(m => m.id === state.mission);
  return Object.fromEntries(Object.entries(CINEMATIC_MISSION).filter(([, id]) => missions.findIndex(m => m.id === id) < step).map(([k]) => [k, true]));
}
