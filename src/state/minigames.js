// Pure scoring of the campaign minigames. A minigame never takes points away: skipping or abandoning
// gives an empty bonus, and the bonus is recorded once per mission (idempotent, see recordMinigame).
import { applyEffect } from './campaign.js';

// Minigame id -> mission during which it can be recorded.
export const MINIGAME_MISSION = { viral: 'video', duel: 'debate', chairs: 'finalPrep', rally: 'finalSpeech' };
// Ceiling per stat, so data or UI bugs can never inflate a result.
const CAP = { viral: { reach: 10 }, duel: { credibility: 6, support: 2 }, chairs: { organization: 8 }, rally: { support: 6 } };

const ratio = (a, b) => (b > 0 ? Math.max(0, Math.min(1, a / b)) : 0);

/** «Hazlo viral»: rhythm accuracy -> reach (attention, not votes). */
export const viralBonus = ({ points, max }) => ({ reach: Math.round(ratio(points, max) * 10) });
/** «Seis sillas»: one organization point per chair, +2 if all six arrive with 20 s to spare. */
export const chairsBonus = ({ delivered, total = 6, timeLeft = 0 }) => ({ organization: Math.min(total, delivered) + (delivered >= total && timeLeft >= 20 ? 2 : 0) });
/** Debate: quick, correct replies -> credibility; holding the line almost every round -> a little support. */
export const duelBonus = ({ points, max, correct, rounds }) => ({ credibility: Math.round(ratio(points, max) * 6), support: rounds > 0 && correct >= rounds - 1 ? 2 : 0 });
/** Final rally: punchlines on time and the room still listening at the end -> support. */
export const rallyBonus = ({ hits, notes, attention }) => ({ support: Math.round(ratio(hits, notes) * 4 + Math.max(0, Math.min(1, attention)) * 2) });

export function clampBonus(id, bonus = {}) {
  const cap = CAP[id] || {}, out = {};
  for (const [k, max] of Object.entries(cap)) { const v = Math.round(Number(bonus[k]) || 0); if (v > 0) out[k] = Math.min(max, v); }
  return out;
}

/** Records a finished (or skipped) minigame once, during its own mission. Returns false if already recorded or out of order. */
export function recordMinigame(state, id, result = {}) {
  if (state.mission !== MINIGAME_MISSION[id]) return false;
  state.minigames ??= {};
  if (state.minigames[id]) return false;
  const bonus = result.skipped ? {} : clampBonus(id, result.bonus);
  applyEffect(state, bonus);
  state.minigames[id] = { score: Math.max(0, Math.round(Number(result.score) || 0)), bonus, skipped: !!result.skipped };
  return true;
}
