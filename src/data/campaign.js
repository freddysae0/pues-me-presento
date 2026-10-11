// Estructura de la campaña. Los textos (títulos, objetivos, propuestas, líneas de amigos, discurso) vienen del
// guion activo (src/data/script/); aquí quedan ids, orden, escenas, objetivos 3D y números.
import { script } from './script/index.js';

const S = script;

export const chapters = [
  { id: 1, targetMinutes: 15, status: 'vertical-slice' },
  { id: 2, targetMinutes: 20, status: 'planned' },
  { id: 3, targetMinutes: 25, status: 'planned' },
  { id: 4, targetMinutes: 20, status: 'planned' },
  { id: 5, targetMinutes: 25, status: 'planned' },
  { id: 6, targetMinutes: 20, status: 'planned' },
].map((c, i) => ({ id: c.id, title: S.chapters[i], targetMinutes: c.targetMinutes, status: c.status }));

// This slice samples chapters 1–3; it is not the full campaign.
// Los títulos deben seguir conteniendo las cadenas que buscan las pruebas de navegador
// ('La sede es mi salón', 'Hazlo viral', 'Eso no fue', 'debate', 'Última vuelta', 'último mitin', 'noche de las sillas').
// `travel`: completing the mission is itself the trip (the flat's door). Any other change of scene is walked:
// the next mission starts in the old scene with a pending exit (see exits below and src/state/campaign.js).
const mission = (id, scene, target, next, effect = {}, travel = false) => ({ id, scene, target, title: S.missions[id].title, objective: S.missions[id].objective, next, effect, optional: false, travel });
export const missions = [
  mission('phone', 'flat', 'phone', 'call'),
  mission('call', 'flat', 'laptop', 'register'),
  mission('register', 'flat', 'folder', 'leave'),
  mission('leave', 'flat', 'door', 'neighbor', {}, true),
  mission('neighbor', 'plaza', 'marisa', 'program', { support: 3 }),
  mission('program', 'plaza', 'board', 'speech'),
  mission('speech', 'plaza', 'podium', 'aftermath'),
  mission('aftermath', 'plaza', 'marisa', 'hqBrief'),
  mission('hqBrief', 'hq', 'planning', 'video'),
  mission('video', 'plaza', 'cameraSpot', 'crisis'),
  mission('crisis', 'hq', 'crisisBoard', 'debate'),
  mission('debate', 'hall', 'debateDesk', 'finalPrep'),
  mission('finalPrep', 'plaza', 'finalBoard', 'finalSpeech'),
  mission('finalSpeech', 'hall', 'finalPodium', 'election'),
  mission('election', 'hall', 'results', 'complete'),
  mission('complete', 'hall', null, null),
];

// Walked transitions. When a mission ends in a different scene from the next one, the player stays put and walks
// to the exit of the current scene that leads to the next one: { [from]: { [to]: entity id in `from` } }.
// The entities live in src/world/world.js. Texts (HUD title/objective, prompt, loading card) come from the script
// (`travel`, keyed by the mission waiting on the other side of the door).
export const exits = {
  plaza: { hq: 'sedeDoor', hall: 'busStop' },
  hq: { plaza: 'hqDoor', hall: 'hqDoor' },
  hall: { plaza: 'hallDoor' },
};
export const travels = Object.fromEntries(Object.entries(S.travel).map(([id, t]) => [id, { title: t.title, objective: t.objective, prompt: t.prompt, loading: t.loading, sign: t.sign }]));

// Cada propuesta tiene un coste visible y alguien del barrio que pierde con ella.
// Los valores numéricos de shade/parking/festival los usan las pruebas; no cambiarlos sin revisar tests/.
const proposal = (id, support, credibility) => { const t = S.proposals[id]; return { id, title: t.title, cost: t.cost, benefit: t.benefit, compromise: t.compromise, support, credibility }; };
export const proposals = [
  proposal('shade', 6, 4),
  proposal('parking', 5, 2),
  proposal('festival', 7, -1),
  proposal('housing', 5, 4),
];

// `job` debe coincidir con lo que valida src/state (cargo por amigo). El guion pone role, line, label y reply.
const friend = (id, name, color, pitch, choices) => {
  const t = S.friends[id];
  return { id, name, role: t.role, color, pitch, line: t.line, choices: choices.map((c, i) => ({ label: t.choices[i].label, ...c, reply: t.choices[i].reply })) };
};
export const friends = [
  friend('lola', 'Lola', '#c77657', 175, [{ job: 'Tesorería', relation: 2, credibility: 3 }, { job: 'Estrategia', relation: 1, credibility: 1 }]),
  friend('dani', 'Dani', '#789bad', 230, [{ job: 'Comunicación', relation: 2, reach: 7 }, { job: 'Portavoz', relation: 0, credibility: 2 }]),
  friend('nico', 'Nico', '#b8a45b', 135, [{ job: 'Organización', relation: 2, support: 3 }, { job: 'Actos', relation: 1, reach: 4 }]),
];

// El orden importa: las pruebas eligen por índice. En «argument», los ids deben coincidir con proposals.
const part = (id, options) => {
  const t = S.speech.parts[id];
  return { id, title: t.title, prompt: t.prompt, options: options.map(([oid, quality]) => quality === undefined ? { id: oid, text: t.options[oid] } : { id: oid, text: t.options[oid], quality }) };
};
export const speechParts = [
  part('opening', [['listen', 2], ['joke', 1], ['grand', -1]]),
  part('argument', [['shade'], ['parking'], ['festival'], ['housing'], ['everything']]),
  part('close', [['accountable', 2], ['chant', 1], ['forever', -2]]),
];
