// Lógica pura del móvil del jugador (tecla M): notificaciones desbloqueadas, leídas, encuesta del barrio,
// tendencia respecto a la misión anterior y programas. Sin DOM ni azar: mismo estado → mismo móvil.
// Textos en src/data/phoneNews.js. Lo único que se guarda es `state.phoneRead` ({ id: true }), opcional.
import { missions, proposals, friends } from '../data/campaign.js';
import { MEMORY_EFFECTS } from '../data/dialogues.js';
import { headquartersScreen, videoScreen, crisisScreen, debateScreen, finalPrepScreen, finalSpeechScreen } from '../data/flow.js';
import { script } from '../data/script/index.js';
import { debateCast } from '../data/parties.js';
import { notifications, rivalPolicies, policyHeadline, APPS, pollText } from '../data/phoneNews.js';
import { electionForecast } from './campaign.js';
import { t } from '../i18n/index.js';

const STATS = ['support', 'credibility', 'reach', 'organization'];
export const RIVAL_ROLES = ['tech', 'populist', 'hard'];
/** Escala de la encuesta: % de voto = puntos de campaña × 0,6 (el umbral 48 equivale a 28,8 %). */
export const VOTE_PER_POINT = 0.6;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = v => Math.round(v * 10) / 10;
const missionIndex = id => (id == null ? -1 : missions.findIndex(m => m.id === id));
const resolve = (v, state, ctx) => (typeof v === 'function' ? v(state, ctx) : v);

// Pantallas de decisión por misión: clave en state.campaignChoices, pantalla (para recuperar efecto y título) y minijuego.
const FLOW = {
  hqBrief: { key: 'hq', label: t('phone.decisions.hqBrief'), screen: headquartersScreen },
  video: { key: 'video', label: t('phone.decisions.video'), screen: videoScreen, minigame: 'viral' },
  crisis: { key: 'crisis', label: t('phone.decisions.crisis'), screen: crisisScreen },
  debate: { key: 'debate', label: t('phone.decisions.debate'), screen: debateScreen, minigame: 'duel' },
  finalPrep: { key: 'prep', label: t('phone.decisions.finalPrep'), screen: finalPrepScreen, minigame: 'chairs' },
  finalSpeech: { key: 'final', label: t('phone.decisions.finalSpeech'), screen: finalSpeechScreen, minigame: 'rally' },
};
function flowChoice(state, mission) {
  const f = FLOW[mission], id = f && state.campaignChoices?.[f.key];
  if (!id) return null;
  try { return f.screen(state, electionForecast(state)).choices.find(c => c.id === id) || null; } catch { return null; }
}

export const phoneAvailable = state => !!state?.completed?.includes('phone');

// ---------------------------------------------------------------- rivales
export function rivalCast() {
  const cast = debateCast(script.rivals);
  return RIVAL_ROLES.map(role => cast.find(c => c.role === role)).filter(Boolean);
}

/** Peso de cada rival según el momento de la campaña y lo que ha decidido el jugador (determinista). */
export function rivalWeights(state) {
  const step = state.completed?.length || 0, c = state.campaignChoices || {}, m = state.memories || {};
  const w = { tech: 1, populist: 0.92, hard: 0.6 + 0.02 * step };
  const add = (k, v) => { if (k in w) w[k] += v; };
  ({ housing: () => add('populist', -0.12), parking: () => add('tech', -0.1), festival: () => add('populist', 0.06), shade: () => add('hard', 0.05) })[state.proposal]?.();
  if (m.promisedBoth) add('populist', 0.05);
  if (state.speech?.picks?.[1] === 'everything') add('populist', 0.08);
  const table = {
    hq: { accounts: ['tech', -0.05], street: ['hard', -0.05], tenants: ['populist', -0.08], content: ['tech', 0.03] },
    video: { explain: ['tech', -0.05], chairs: ['populist', 0.06], neighbor: ['populist', -0.05], debunk: ['hard', -0.08] },
    crisis: { admit: ['tech', -0.03], blame: ['hard', 0.1], distract: ['populist', 0.05] },
    debate: { tradeoff: ['tech', -0.1], attack: ['populist', -0.18], manage: ['tech', -0.15], promise: ['populist', 0.12] },
    prep: { listen: ['populist', -0.06], receipts: ['tech', -0.06], volunteers: ['hard', -0.05] },
    final: { account: ['hard', -0.05], viral: ['tech', 0.04], everything: ['populist', 0.1] },
  };
  for (const [key, opts] of Object.entries(table)) { const hit = opts[c[key]]; if (hit) add(...hit); }
  if (c.debate === 'attack') add('hard', 0.06);
  return w;
}

// ---------------------------------------------------------------- encuesta
/**
 * Intención de voto del barrio. Coherente con electionForecast: el jugador va primero ⇔ forecast.winning.
 * - Jugador: puntos de campaña × 0,6 (sin partido registrado, no aparece).
 * - Umbral: 48 × 0,6. El rival líder queda por encima del umbral si el jugador pierde y por debajo si gana;
 *   la distancia (impulso) crece con la campaña y con la ventaja entre rivales.
 * - Indecisos: bajan con cada misión y con el alcance. El resto se reparte por pesos (rivalWeights).
 * Devuelve { rows, player, leader, threshold, winning, score, hasParty }; los porcentajes suman 100.
 */
export function pollFor(state) {
  const f = electionForecast(state), step = state.completed?.length || 0, hasParty = !!state.party;
  const threshold = r1(f.threshold * VOTE_PER_POINT), w = rivalWeights(state), cast = rivalCast();
  const order = [...cast].sort((a, b) => w[b.role] - w[a.role] || RIVAL_ROLES.indexOf(a.role) - RIVAL_ROLES.indexOf(b.role));
  const [lead, ...others] = order;
  const momentum = clamp(0.6 + 0.12 * step + (w[lead.role] - (others[0] ? w[others[0].role] : 0)) * 2, 0.4, 3.5);
  const p = hasParty ? r1(clamp(f.score * VOTE_PER_POINT, 0, 60)) : 0;
  const winning = hasParty && f.winning;
  const L = r1(winning ? Math.min(threshold - momentum, p - 0.3) : Math.max(threshold + momentum, p + 0.3));
  let u = Math.max(4, 30 - 1.6 * step - (state.reach || 0) * 0.04);
  let rest = 100 - p - L - u; if (rest < 0) { u += rest; rest = 0; }
  const sum = others.reduce((t, o) => t + Math.max(0.05, w[o.role]), 0);
  const shares = { [lead.role]: L, player: p };
  for (const o of others) shares[o.role] = r1(Math.min(L - 0.6, rest * Math.max(0.05, w[o.role]) / sum));
  const used = p + L + others.reduce((t, o) => t + shares[o.role], 0);
  shares.undecided = r1(Math.max(0, 100 - used));
  const party = state.party;
  const rows = [
    ...(hasParty ? [{ id: 'player', name: party.name, party: party.name, color: party.color, share: p, player: true }] : []),
    ...cast.map(c => ({ id: c.role, name: c.name, party: c.party, color: c.color, share: shares[c.role] })),
    { id: 'undecided', name: pollText.undecided, party: pollText.undecided, color: '#b9aecb', share: shares.undecided },
  ];
  const leader = rows.find(r => r.id === lead.role);
  return { rows, player: rows.find(r => r.player) || null, leader, threshold, winning, score: f.score, hasParty };
}

/** Efecto (aproximado, sin recortes 0–100) que tuvo la misión `id` sobre las estadísticas, a partir de lo guardado. */
export function missionDelta(state, id) {
  const d = Object.fromEntries(STATS.map(k => [k, 0]));
  const add = e => { for (const k of STATS) d[k] += Number(e?.[k]) || 0; };
  add(missions.find(m => m.id === id)?.effect);
  if (id === 'call') for (const f of friends) add(f.choices.find(c => c.job === state.team?.[f.id]?.job));
  if (id === 'neighbor') for (const k of ['listened', 'promisedBoth', 'spectacle']) if (state.memories?.[k]) add(MEMORY_EFFECTS[k]);
  if (id === 'program') { add(proposals.find(p => p.id === state.proposal)); if (state.memories?.promisedBoth) add({ credibility: -6 }); }
  if (id === 'speech' && state.speech) add({ support: state.speech.support, credibility: state.speech.credibility, reach: state.speech.reach });
  if (FLOW[id]) { add(flowChoice(state, id)?.effect); if (FLOW[id].minigame) add(state.minigames?.[FLOW[id].minigame]?.bonus); }
  return d;
}

/** El estado tal como estaba al empezar la última misión completada (para la tendencia), o null al principio. */
export function previousState(state) {
  const last = state.completed?.at(-1); if (!last) return null;
  const d = missionDelta(state, last);
  const prev = { ...state, completed: state.completed.slice(0, -1), mission: last, campaignChoices: { ...state.campaignChoices }, result: null };
  for (const k of STATS) prev[k] = clamp(state[k] - d[k], 0, 100);
  if (FLOW[last]) delete prev.campaignChoices[FLOW[last].key];
  if (last === 'register') prev.party = null;
  if (last === 'program') prev.proposal = null;
  if (last === 'speech') prev.speech = null;
  return prev;
}

/** Encuesta con tendencia: cada fila lleva `delta` (puntos respecto a la misión anterior) o null si no existía. */
export function pollWithTrend(state) {
  const now = pollFor(state), before = previousState(state), old = before ? pollFor(before) : null;
  for (const row of now.rows) { const o = old?.rows.find(r => r.id === row.id); row.delta = o ? r1(row.share - o.share) : null; }
  return now;
}

// ---------------------------------------------------------------- notificaciones
function context(state) {
  return { rivals: script.rivals, party: state.party?.name || t('phone.yourPartyFallback'), proposal: proposals.find(p => p.id === state.proposal) || null, poll: pollFor(state) };
}

/** Notificaciones desbloqueadas, de la más antigua a la más reciente (orden de misión, luego orden de datos). */
export function unlockedNotifications(state) {
  const done = new Set(state.completed || []), open = after => after === null || done.has(after);
  const ctx = context(state), out = [];
  const push = (n, extra = {}) => {
    try {
      const text = resolve(n.text, state, ctx); if (!text) return;
      out.push({ id: n.id, after: n.after, app: n.app, appLabel: APPS[n.app]?.label || n.app, from: resolve(n.from, state, ctx), title: resolve(n.title, state, ctx) || '', text, ...extra });
    } catch { /* un texto roto no debe tumbar el móvil */ }
  };
  for (const n of notifications) if (open(n.after) && (!n.when || n.when(state))) push(n);
  for (const rival of rivalCast()) for (const p of rivalPolicies[rival.role] || []) {
    if (open(p.after)) push({ id: `policy-${p.id}`, after: p.after, app: 'press', from: APPS.press.label, title: policyHeadline(rival, p), text: p.text }, { rival: rival.role, color: rival.color });
  }
  return out.map((n, i) => ({ n, i })).sort((a, b) => missionIndex(a.n.after) - missionIndex(b.n.after) || a.i - b.i).map(x => x.n);
}

export const isRead = (state, id) => state.phoneRead?.[id] === true;
export const unreadNotifications = state => unlockedNotifications(state).filter(n => !isRead(state, n.id));
/** Marca como leídas (idempotente). Devuelve cuántas eran nuevas. */
export function markRead(state, ids) {
  let fresh = 0;
  for (const id of ids) { if (isRead(state, id)) continue; state.phoneRead ??= {}; state.phoneRead[id] = true; fresh++; }
  return fresh;
}

// ---------------------------------------------------------------- programas
export function programsFor(state) {
  const done = new Set(state.completed || []);
  const proposal = proposals.find(p => p.id === state.proposal) || null;
  const decisions = Object.entries(FLOW).map(([mission, f]) => ({ mission, label: f.label, title: flowChoice(state, mission)?.title || null })).filter(d => d.title);
  const player = state.party ? {
    name: state.party.name, slogan: state.party.slogan, color: state.party.color,
    proposal: proposal ? { title: proposal.title, compromise: proposal.compromise } : null,
    team: friends.filter(f => state.team?.[f.id]).map(f => ({ name: f.name, job: state.team[f.id].job })),
    speech: state.speech ? { coherent: !!state.speech.coherent, everything: state.speech.picks?.[1] === 'everything' } : null,
    decisions,
  } : null;
  const rivals = rivalCast().map(r => ({ ...r, policies: (rivalPolicies[r.role] || []).filter(p => p.after === null || done.has(p.after)).map(p => ({ id: p.id, topic: p.topic, text: p.text, after: p.after })).reverse() }));
  return { player, rivals };
}
