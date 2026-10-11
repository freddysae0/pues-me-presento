// Diálogos declarativos. El texto vive en el guion activo (src/data/script/); aquí solo la lógica:
// qué efecto aplica cada memoria, qué charla toca en cada misión y cuándo una charla ya está hecha.
// Ninguna cifra de estos textos pretende ser un dato real (ver docs/RESEARCH_SPAIN.md).
//
// Restricciones del motor (src/dialogue/dialogue.js) y de las pruebas:
// - Cada elección fija `memory` (memoria persistente) y aplica `effect` una sola vez.
// - Máximo tres elecciones por línea (teclas 1–3).
// - `neighbor` debe tener exactamente tres líneas y las elecciones en la segunda:
//   índice 0 → listened, 1 → promisedBoth, 2 → spectacle (las pruebas lo pulsan así).
// - `aftermathLines` debe devolver tres líneas sin elecciones.
import { script, say } from './script/index.js';

// Efecto de cada memoria. El guion elige el texto; la memoria (y por tanto el efecto) es fija.
export const MEMORY_EFFECTS = {
  listened: { credibility: 4, support: 2 }, promisedBoth: { support: 4, credibility: -2 }, spectacle: { reach: 6, support: -1 },
  pacoHeard: { support: 2 }, chairs: { support: 1, credibility: 1 }, pacoRent: { support: 1, organization: 1 },
  pacoWages: { credibility: 2 }, pacoBlame: { support: 1, credibility: -2 }, pacoLucia: { support: 2, organization: 1 },
  lolaBooks: { credibility: 2 }, lolaWait: { organization: 1, credibility: -1 },
  lolaReceipts: { credibility: 2 }, lolaCousin: { organization: 1, credibility: -2 }, lolaRent: { support: 1, organization: 1 },
  daniReply: { support: 1, credibility: 1 }, daniMeme: { reach: 3, credibility: -2 },
  daniNoFilter: { credibility: 2 }, daniTrend: { reach: 3, credibility: -1 }, daniJobs: { support: 1, organization: 1 },
  nicoInvite: { organization: 1, support: 1 }, nicoEnemy: { support: 1, credibility: -1 },
  nicoTruth: { credibility: 2 }, nicoPromise: { support: 2, credibility: -2 }, nicoAssembly: { organization: 2 },
};

// Líneas del guion → líneas del motor: cada elección recibe el efecto de su memoria. Copia fresca en cada llamada.
const withEffects = lines => lines.map(line => line.choices
  ? { ...line, choices: line.choices.map(c => ({ text: c.text, memory: c.memory, effect: { ...MEMORY_EFFECTS[c.memory] }, response: c.response })) }
  : { ...line });

const D = script.dialogues;

export const dialogues = {
  neighbor: withEffects(D.neighbor),
};

// Reacción de Marisa tras el primer discurso: recuerda lo que dijiste en la plaza y lo que has defendido.
export function aftermathLines(state) {
  return withEffects(say(D.aftermath, state));
}

// Conversaciones laterales. `once`: memorias que marcan la charla como hecha (todas las de su primera elección);
// si alguna está fijada, se muestra `after` como aviso y no se puede repetir la recompensa.
// Sin `once`, son comentarios repetibles sin efectos. `when` decide qué charla toca según la misión.
const talk = (text, once) => ({ once, after: s => say(text.after, s), lines: () => withEffects(text.lines) });

const pacoTalk = talk(D.paco, ['pacoHeard', 'chairs', 'pacoRent']);

const marisaAmbient = { lines: s => withEffects(say(D.marisa, s)) };

const crisis = s => s.mission === 'crisis', always = () => true;
const lolaTalks = [{ when: crisis, ...talk(D.lola.crisis, ['lolaBooks', 'lolaWait']) }, { when: always, ...talk(D.lola.default, ['lolaReceipts', 'lolaCousin', 'lolaRent']) }];
const daniTalks = [{ when: crisis, ...talk(D.dani.crisis, ['daniReply', 'daniMeme']) }, { when: always, ...talk(D.dani.default, ['daniNoFilter', 'daniTrend', 'daniJobs']) }];
const nicoTalks = [{ when: crisis, ...talk(D.nico.crisis, ['nicoInvite', 'nicoEnemy']) }, { when: always, ...talk(D.nico.default, ['nicoTruth', 'nicoPromise', 'nicoAssembly']) }];

const sideTalks = { paco: [pacoTalk], marisa: [marisaAmbient], lolaHq: lolaTalks, daniHq: daniTalks, nicoHq: nicoTalks };

export const hasSideTalk = id => !!sideTalks[id];

// Devuelve { lines } para abrir una conversación, { toast } si ya está hecha, o null si el personaje no tiene charla lateral.
export function sideTalk(id, state) {
  const t = (sideTalks[id] || []).find(t => !t.when || t.when(state));
  if (!t) return null;
  if (t.once?.some(memory => state.memories[memory])) return { toast: t.after(state) };
  return { lines: t.lines(state) };
}

// Compatibilidad con el código anterior, que abría la charla de Paco directamente.
dialogues.optional = pacoTalk.lines();
