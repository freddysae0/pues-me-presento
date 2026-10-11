// Decisiones de las pantallas de campaña (sede, vídeo, crisis, debate, última vuelta, mitin, recuento).
// El texto viene del guion activo (src/data/script/, clave `flow` y `endings`); aquí quedan ids, orden y efectos.
// Los ids, claves y efectos existentes se mantienen; las pruebas pulsan siempre la primera opción (#flow-0).
import { script, say } from './script/index.js';

const STAT = { support: 'apoyo', credibility: 'credibilidad', organization: 'organización', reach: 'alcance' };
export const effectSummary = effect => Object.entries(effect).filter(([, v]) => v).map(([k, v]) => `${v > 0 ? '+' : '−'}${Math.abs(v)} ${STAT[k]}`).join(', ');
const choice = (key, id, title, flavor, effect) => ({ key, id, title, detail: `${flavor} · ${effectSummary(effect)}.`, effect });

// Nombres de rivales y moderadora: los pone el guion (script.rivals).
export const RIVALS = script.rivals;

// Pantalla del guion + lista fija [id, efecto] → { eyebrow, title, intro, choices } como antes.
function build(text, key, list, state, ctx = {}) {
  return {
    eyebrow: say(text.eyebrow, state, ctx), title: say(text.title, state, ctx), intro: say(text.intro, state, ctx),
    choices: list.map(([id, effect]) => choice(key, id, say(text.choices[id].title, state, ctx), say(text.choices[id].flavor, state, ctx), effect)),
  };
}

export function headquartersScreen(state) {
  return build(script.flow.hq, 'hq', [
    ['accounts', { credibility: 8, organization: 5, reach: -2 }],
    ['street', { support: 8, organization: 5, reach: -2 }],
    ['content', { reach: 12, credibility: -3 }],
    ['tenants', { support: 6, credibility: 4, organization: -2 }],
  ], state);
}

export function videoScreen(state) {
  return build(script.flow.video, 'video', [
    ['explain', { credibility: 7, support: 4, reach: 3 }],
    ['chairs', { reach: 18, credibility: -7 }],
    ['neighbor', { support: 7, credibility: 5 }],
    ['debunk', { credibility: 5, reach: 6, support: -1 }],
  ], state);
}

export function crisisScreen(state, forecast) {
  const m = state.memories, speech = state.speech || {};
  const contradiction = m.promisedBoth || speech.picks?.[1] === 'everything' || speech.coherent === false;
  return build(script.flow.crisis, 'crisis', [
    ['admit', { credibility: 12, support: 4 }],
    ['team', { organization: 10, credibility: 8 }],
    ['distract', { reach: 12, credibility: -8 }],
    ['blame', { support: 5, reach: 6, credibility: -6 }],
  ], state, { forecast, contradiction });
}

export function debateScreen(state) {
  return build(script.flow.debate, 'debate', [
    ['tradeoff', { credibility: 10, support: 5 }],
    ['attack', { support: 6, credibility: -4 }],
    ['manage', { organization: 8, credibility: 7 }],
    ['promise', { support: 7, credibility: -8 }],
  ], state);
}

export function finalPrepScreen(state, forecast) {
  return build(script.flow.finalPrep, 'prep', [
    ['listen', { support: 12 }],
    ['receipts', { credibility: 12 }],
    ['volunteers', { organization: 12 }],
  ], state, { forecast });
}

export function finalSpeechScreen(state) {
  return build(script.flow.finalSpeech, 'final', [
    ['account', { support: 8, credibility: 8, organization: 5 }],
    ['viral', { reach: 14, support: 4 }],
    ['everything', { support: 8, credibility: -12 }],
  ], state);
}

export function victoryText(state) {
  return say(script.endings.victory.text, state);
}

export function defeatReasons(state, threshold = 48) {
  const reasons = script.endings.defeat.reasons;
  return ['support', 'credibility', 'organization'].map(k => state[k] < threshold ? say(reasons[k], state) : '').filter(Boolean);
}
