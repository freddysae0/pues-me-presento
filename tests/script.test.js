// Valida el guion del juego: el efectivo (actual.js + b.js, src/data/script/index.js) y actual.js como base,
// contra las restricciones del juego y de las pruebas. Las ramas A y C están archivadas (docs/dialogue-branches/archive/).
// Los guionistas pueden ejecutarlo con: npm.cmd test
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildScript, deepMerge, script as active, say, scriptFor } from '../src/data/script/index.js';
import { LANGS } from '../src/i18n/index.js';
import actual from '../src/data/script/actual.js';
import b from '../src/data/script/b.js';
import { MEMORY_EFFECTS, dialogues, aftermathLines, sideTalk } from '../src/data/dialogues.js';
import { newCampaign } from '../src/state/campaign.js';
import { missions, proposals, friends, speechParts } from '../src/data/campaign.js';
import { duelRounds, rallyChart, normalizeReactions } from '../src/data/minigames.js';

const PROPOSALS = ['shade', 'parking', 'festival', 'housing'];
const MISSION_TITLE_NEEDS = { hqBrief: 'La sede es mi salón', video: 'Hazlo viral', crisis: 'Eso no fue', debate: 'debate', finalPrep: 'Última vuelta', finalSpeech: 'último mitin', election: 'noche de las sillas' };

// Estados de ejemplo que recorren las ramas de las funciones del guion.
function samples() {
  const base = () => { const s = newCampaign(); s.party = { name: 'Partido de prueba', slogan: 'Una cosa bien hecha.', color: '#42877c' }; return s; };
  const list = [base()];
  for (const proposal of [...PROPOSALS, null]) {
    for (const variant of ['listened', 'promisedBoth', 'spectacle', 'none']) {
      const s = base(); s.proposal = proposal; if (variant !== 'none') s.memories[variant] = true;
      s.speech = variant === 'promisedBoth' ? { coherent: false, picks: ['grand', 'everything', 'forever'], reach: 14 } : { coherent: variant !== 'spectacle', picks: ['listen', proposal || 'shade', 'accountable'], reach: 4 };
      if (variant === 'listened') Object.assign(s.memories, { pacoLucia: true, nicoAssembly: true, daniNoFilter: true, chairs: true });
      if (variant === 'spectacle') Object.assign(s.memories, { nicoPromise: true, nicoInvite: true, daniTrend: true });
      list.push(s);
    }
  }
  for (const mission of ['program', 'speech', 'video', 'finalPrep', 'crisis', 'debate']) { const s = base(); s.mission = mission; list.push(s); }
  return list;
}
const ctxFor = script => ({ rivals: script.rivals, forecast: { score: 41, threshold: 48, winning: false }, contradiction: true, proposal: { id: 'shade', title: 'Refugio' }, take: 'Toma de prueba.', rounds: '4', time: 70, delivered: 2, total: 6 });
const ctxVariants = script => [ctxFor(script), { ...ctxFor(script), contradiction: false, forecast: { score: 55, threshold: 48, winning: true } }];

// Todo lo que devuelve el guion debe tener texto: cadenas no vacías, arrays no vacíos (null solo como hablante narrador).
function assertFilled(value, where) {
  if (value === null) return;
  if (typeof value === 'string') { assert.ok(value.trim().length > 0, `${where}: cadena vacía`); return; }
  if (typeof value === 'number' || typeof value === 'boolean') return;
  if (Array.isArray(value)) { assert.ok(value.length > 0, `${where}: lista vacía`); value.forEach((v, i) => assertFilled(v, `${where}[${i}]`)); return; }
  if (typeof value === 'object') { for (const [k, v] of Object.entries(value)) assertFilled(v, `${where}.${k}`); return; }
  assert.fail(`${where}: tipo inesperado ${typeof value}`);
}
const resolve = (v, s, ctx) => typeof v === 'function' ? v(s, ctx) : v;

function checkLines(lines, where) {
  assert.ok(Array.isArray(lines) && lines.length > 0, `${where}: debe ser una lista de líneas`);
  lines.forEach((line, i) => {
    assert.equal(typeof line.speaker, 'string', `${where}[${i}].speaker`); assert.ok(line.text?.trim(), `${where}[${i}].text vacío`);
    if (line.choices) {
      assert.ok(line.choices.length >= 1 && line.choices.length <= 3, `${where}[${i}]: entre 1 y 3 elecciones (tiene ${line.choices.length})`);
      for (const c of line.choices) { assert.ok(c.text?.trim() && c.response?.trim(), `${where}[${i}]: elección sin text/response`); assert.ok(MEMORY_EFFECTS[c.memory], `${where}[${i}]: memory desconocida «${c.memory}»`); }
    }
  });
}
const memoriesOf = lines => lines.flatMap(l => (l.choices || []).map(c => c.memory)).sort();

test('deepMerge: objetos se fusionan; arrays y funciones se reemplazan; claves nuevas se toleran', () => {
  const f = () => 'x';
  const merged = deepMerge({ a: { b: 1, c: [1, 2] }, d: () => 'y' }, { a: { c: [3] }, d: f, extraLines: ['nueva'] });
  assert.deepEqual(merged.a, { b: 1, c: [3] }); assert.equal(merged.d, f); assert.deepEqual(merged.extraLines, ['nueva']);
  assert.equal(buildScript(null), actual);
});

test('el guion del juego es siempre actual.js con b.js encima (sin selector)', () => {
  assert.deepEqual(active, deepMerge(actual, b));
  for (const k of Object.keys(actual)) if (!(k in b)) assert.equal(active[k], actual[k], `${k}: sin capa B debe venir de actual.js`);
  assert.equal(active.rivals.hard.name, b.rivals.hard.name);
  assert.equal(active.foxDebate.hallLine, b.foxDebate.hallLine);
});

test('el guion efectivo (actual + B) alimenta los datos del juego con los mismos ids y efectos', () => {
  assert.deepEqual(dialogues.neighbor[1].choices.map(c => [c.memory, c.effect]), [['listened', { credibility: 4, support: 2 }], ['promisedBoth', { support: 4, credibility: -2 }], ['spectacle', { reach: 6, support: -1 }]]);
  assert.equal(missions.length, 16); assert.ok(missions.every(m => m.title && m.objective));
  assert.deepEqual(proposals.map(p => [p.id, p.support, p.credibility]), [['shade', 6, 4], ['parking', 5, 2], ['festival', 7, -1], ['housing', 5, 4]]);
  assert.deepEqual(friends.map(f => f.choices.map(c => c.job)), [['Tesorería', 'Estrategia'], ['Comunicación', 'Portavoz'], ['Organización', 'Actos']]);
  assert.deepEqual(speechParts.map(p => p.options.map(o => o.id)), [['listen', 'joke', 'grand'], ['shade', 'parking', 'festival', 'housing', 'everything'], ['accountable', 'chant', 'forever']]);
  const s = newCampaign(); s.memories.chairs = true; assert.ok(sideTalk('paco', s).toast);
  s.proposal = 'shade'; s.memories = { promisedBoth: true }; s.speech = { coherent: false, picks: ['grand', 'everything', 'forever'] };
  // Los datos del juego deben salir del guion efectivo.
  assert.equal(aftermathLines(s).length, 3);
  assert.equal(duelRounds(s)[3].topic, say(active.minigames.duel.rounds, s)[3].topic);
  assert.equal(rallyChart(s)[2].punch, say(active.minigames.rally.phrases, s)[2][1]);
  // Fox: quinta ronda, la dice Covadonga del Muro desde el atril de Rival C, con su interrupción y reacciones.
  const fox = duelRounds(s)[4];
  assert.equal(duelRounds(s).length, 5); assert.deepEqual([fox.role, fox.actor, fox.speaker], ['hard', 'Rival C', active.rivals.hard.name]);
  assert.ok(fox.interruption && fox.reactions.right && fox.reactions.wrong && fox.reactions.timeout);
  assert.deepEqual(normalizeReactions({ win: 'w', lose: 'l', timeout: 't' }), { right: 'w', wrong: 'l', timeout: 't' });
  assert.deepEqual(normalizeReactions({ right: 'r', wrong: 'x', timeout: 't' }), { right: 'r', wrong: 'x', timeout: 't' });
});

// Además del español, el guion fusionado de cada idioma (actual + B + src/i18n/<lang>/script.js) cumple el mismo esquema.
const LANGUAGE_SCRIPTS = LANGS.filter(l => l !== 'es').map(l => [`idioma ${l} (actual + B + i18n/${l}/script.js)`, () => scriptFor(l), l]);
for (const [label, build, lang = 'es'] of [['actual.js (base)', () => buildScript(null)], ['efectivo (actual + B)', () => active], ...LANGUAGE_SCRIPTS]) {
  test(`guion ${label} cumple el esquema`, () => {
    const script = build(), states = samples(), ctxs = ctxVariants(script);
    const D = script.dialogues;

    // Rivales.
    for (const r of ['tech', 'populist', 'hard']) assert.ok(script.rivals[r]?.name?.trim() && script.rivals[r]?.party?.trim(), `rivals.${r}`);

    // Fox (tercer atril): frase del salón, interrupción, ronda extra y reacciones (right/wrong o win/lose, y timeout).
    const F = script.foxDebate;
    assert.ok(F, 'foxDebate');
    assert.ok(typeof F.hallLine === 'string' && F.hallLine.trim(), 'foxDebate.hallLine: cadena');
    for (const s of states) {
      assert.ok(String(resolve(F.interruption, s, ctxs[0]) || '').trim(), 'foxDebate.interruption');
      const r = resolve(F.round, s, ctxs[0]);
      assert.equal(r?.role, 'hard', 'foxDebate.round.role: «hard»'); assert.ok(r.topic?.trim() && r.claim?.trim(), 'foxDebate.round topic/claim');
      assert.equal(r.options.length, 3, 'foxDebate.round: 3 options'); r.options.forEach((o, i) => assert.ok(o?.trim(), `foxDebate.round.options[${i}]`));
      assert.ok(Number.isInteger(r.correct) && r.correct >= 0 && r.correct < 3, 'foxDebate.round.correct 0–2');
    }
    const fr = normalizeReactions(F.reactions);
    for (const k of ['right', 'wrong', 'timeout']) assert.ok(String(fr[k] ?? '').trim(), `foxDebate.reactions.${k} (o win/lose)`);
    assert.ok(script.rivals.moderator?.trim(), 'rivals.moderator');

    // Misiones: todas, y con las cadenas que buscan las pruebas.
    for (const m of missions) assert.ok(script.missions[m.id]?.title?.trim() && script.missions[m.id]?.objective?.trim(), `missions.${m.id}`);
    // Las pruebas de navegador buscan estas cadenas en español; en otros idiomas el título es libre.
    if (lang === 'es') for (const [m, needle] of Object.entries(MISSION_TITLE_NEEDS)) assert.ok(script.missions[m].title.includes(needle), `missions.${m}.title debe contener «${needle}»`);
    assert.equal(script.chapters.length, 6, 'chapters: 6 títulos');

    // Propuestas, amigos, discurso.
    for (const p of PROPOSALS) for (const k of ['title', 'cost', 'benefit', 'compromise']) assert.ok(script.proposals[p]?.[k]?.trim(), `proposals.${p}.${k}`);
    for (const f of ['lola', 'dani', 'nico']) {
      const t = script.friends[f]; assert.ok(t.role?.trim() && t.line?.trim(), `friends.${f}`);
      assert.equal(t.choices.length, 2, `friends.${f}.choices: exactamente 2`); t.choices.forEach((c, i) => assert.ok(c.label?.trim() && c.reply?.trim(), `friends.${f}.choices[${i}]`));
    }
    const speechIds = { opening: ['listen', 'joke', 'grand'], argument: [...PROPOSALS, 'everything'], close: ['accountable', 'chant', 'forever'] };
    for (const [part, ids] of Object.entries(speechIds)) for (const o of ids) assert.ok(script.speech.parts[part].options[o]?.trim(), `speech.parts.${part}.options.${o}`);
    assert.equal(script.speech.headings.length, 3, 'speech.headings: 3');

    // Vecina: 3 líneas, elecciones solo en la segunda, en el orden que pulsan las pruebas.
    checkLines(D.neighbor, 'dialogues.neighbor');
    assert.equal(D.neighbor.length, 3, 'dialogues.neighbor: exactamente 3 líneas');
    assert.ok(!D.neighbor[0].choices && !D.neighbor[2].choices, 'dialogues.neighbor: elecciones solo en la segunda línea');
    assert.deepEqual(D.neighbor[1].choices.map(c => c.memory), ['listened', 'promisedBoth', 'spectacle']);

    // Charlas laterales: mismas memorias que el guion actual, máx. 3 elecciones por línea.
    const talks = { paco: D.paco, 'lola.crisis': D.lola.crisis, 'lola.default': D.lola.default, 'dani.crisis': D.dani.crisis, 'dani.default': D.dani.default, 'nico.crisis': D.nico.crisis, 'nico.default': D.nico.default };
    const base = { paco: actual.dialogues.paco, 'lola.crisis': actual.dialogues.lola.crisis, 'lola.default': actual.dialogues.lola.default, 'dani.crisis': actual.dialogues.dani.crisis, 'dani.default': actual.dialogues.dani.default, 'nico.crisis': actual.dialogues.nico.crisis, 'nico.default': actual.dialogues.nico.default };
    for (const [name, talk] of Object.entries(talks)) {
      checkLines(talk.lines, `dialogues.${name}.lines`);
      assert.deepEqual(memoriesOf(talk.lines), memoriesOf(base[name].lines), `dialogues.${name}: debe usar las mismas memories`);
      for (const s of states) assert.ok(String(resolve(talk.after, s, ctxs[0]) || '').trim(), `dialogues.${name}.after vacío`);
    }
    for (const s of states) {
      const after = resolve(D.aftermath, s, ctxs[0]);
      checkLines(after, 'dialogues.aftermath'); assert.equal(after.length, 3, 'dialogues.aftermath: exactamente 3 líneas');
      assert.ok(after.every(l => !l.choices), 'dialogues.aftermath: sin elecciones');
      const amb = resolve(D.marisa, s, ctxs[0]); checkLines(amb, 'dialogues.marisa'); assert.ok(amb.every(l => !l.choices), 'dialogues.marisa: sin elecciones');
    }

    // Cinemáticas: mismo número de subtítulos (van sincronizados con cámara y gestos).
    for (const [cid, c] of Object.entries(actual.cinematics)) {
      assert.equal(script.cinematics[cid].subs.length, c.subs.length, `cinematics.${cid}.subs: exactamente ${c.subs.length}`);
      script.cinematics[cid].subs.forEach(([who, text], i) => { assert.ok(who === null || typeof who === 'string', `cinematics.${cid}.subs[${i}] hablante`); assert.ok(text?.trim(), `cinematics.${cid}.subs[${i}] texto`); });
      if (c.banner) assert.equal(script.cinematics[cid].banner.length, 2, `cinematics.${cid}.banner: [antetítulo, título]`);
    }

    // Pantallas de campaña: los mismos ids de elección.
    for (const [sid, screen] of Object.entries(actual.flow)) for (const cid of Object.keys(screen.choices)) {
      const c = script.flow[sid].choices[cid]; assert.ok(c, `flow.${sid}.choices.${cid}`);
      for (const s of states) for (const ctx of ctxs) for (const k of ['title', 'flavor']) assert.ok(String(resolve(c[k], s, ctx)).trim(), `flow.${sid}.choices.${cid}.${k}`);
    }
    for (const k of ['support', 'credibility', 'organization']) assert.ok(script.endings.defeat.reasons[k], `endings.defeat.reasons.${k}`);

    // Minijuegos.
    const M = script.minigames;
    assert.equal(M.viral.lanes.length, 4, 'minigames.viral.lanes: 4 etiquetas');
    for (const t of ['explain', 'chairs', 'neighbor', 'debunk']) assert.ok(M.viral.takes[t]?.trim(), `minigames.viral.takes.${t}`);
    for (const r of ['tech', 'populist', 'moderator', 'fallback']) assert.ok(M.duel.interruptions[r]?.trim(), `minigames.duel.interruptions.${r}`);
    for (const s of states) {
      const rounds = resolve(M.duel.rounds, s, ctxs[0]);
      assert.equal(rounds.length, 4, 'minigames.duel.rounds: exactamente 4');
      assert.ok([4, 5].includes(rounds.length + (script.foxDebate?.round ? 1 : 0)), 'duelo: 4 rondas, o 5 con la de Fox');
      for (const r of rounds) {
        assert.ok(['tech', 'populist', 'moderator'].includes(r.role), `duel role «${r.role}»`); assert.ok(r.topic?.trim() && r.claim?.trim(), 'duel topic/claim');
        assert.equal(r.options.length, 3, 'duel: 3 options'); assert.ok(Number.isInteger(r.correct) && r.correct >= 0 && r.correct < 3, 'duel correct 0–2');
      }
      const phrases = resolve(M.rally.phrases, s, ctxs[0]);
      assert.equal(phrases.length, 12, 'minigames.rally.phrases: exactamente 12'); phrases.forEach(([text, punch], i) => assert.ok(text?.trim() && punch?.trim(), `rally.phrases[${i}]`));
    }

    // Todas las funciones del guion devuelven texto para cada estado de ejemplo; y no hay cadenas vacías.
    const walk = (v, where) => {
      if (typeof v === 'function') { for (const s of states) for (const ctx of ctxs) assertFilled(v(s, ctx), `${where}()`); return; }
      if (v && typeof v === 'object') { for (const [k, x] of Object.entries(v)) walk(x, `${where}.${k}`); return; }
      if (typeof v === 'string') assert.ok(v.trim(), `${where}: cadena vacía`);
    };
    walk(script, 'script');
  });
}
