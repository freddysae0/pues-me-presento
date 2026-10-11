// Idiomas (src/i18n/): diccionarios de UI, capas de datos y textos sin extraer. El guion de cada idioma lo valida
// tests/script.test.js con las mismas restricciones que el español.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LANGUAGES, LANGS, PACKS, lang, t, translator, detectLanguage, chain, data, scriptLayer, overrideById, overrideMap } from '../src/i18n/index.js';
import { readSettings, writeSettings } from '../src/save/settings.js';
import { LocalPersistence } from '../src/save/persistence.js';
import { FEED_IDS } from '../src/data/feed.js';
import { PHONE_TEXT_IDS } from '../src/data/phoneNews.js';

const es = PACKS.es.ui;
const leaves = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? leaves(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]));
const params = s => new Set([...String(s).matchAll(/\{(\w+)\}/g)].map(m => m[1]));
const tags = s => [...String(s).matchAll(/<\/?([a-z]+)/g)].map(m => m[1]).sort().join(',');
const memory = () => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) }; };

test('idiomas: los nueve de la lista, con nombre nativo y paquete', () => {
  assert.deepEqual(LANGUAGES.map(l => [l.id, l.name]), [['es', 'Español'], ['en', 'English'], ['ca', 'Català'], ['ca-valencia', 'Valencià'], ['eu', 'Euskara'], ['gl', 'Galego'], ['ast', 'Asturianu'], ['an', 'Aragonés'], ['oc-aranes', 'Aranés']]);
  for (const id of LANGS) { assert.ok(PACKS[id]?.ui, `${id}: ui.js`); assert.ok(id === 'es' || PACKS[id].script, `${id}: script.js`); assert.ok(PACKS[id].data, `${id}: data.js`); }
  assert.equal(lang, 'es', 'en Node el idioma por defecto es español');
});

test('detección y cadenas de respaldo', () => {
  assert.equal(detectLanguage(['ca-ES-valencia']), 'ca-valencia');
  assert.equal(detectLanguage(['ca-valencia']), 'ca-valencia');
  assert.equal(detectLanguage(['ca-ES']), 'ca');
  assert.equal(detectLanguage(['oc-aranes']), 'oc-aranes');
  assert.equal(detectLanguage(['oc']), 'oc-aranes');
  assert.equal(detectLanguage(['ast-ES']), 'ast');
  assert.equal(detectLanguage(['an']), 'an');
  assert.equal(detectLanguage(['eu-ES']), 'eu');
  assert.equal(detectLanguage(['gl']), 'gl');
  assert.equal(detectLanguage(['en-US']), 'en');
  assert.equal(detectLanguage(['fr-FR', 'de']), 'es');
  assert.equal(detectLanguage(['fr-FR', 'gl-ES']), 'gl');
  assert.deepEqual(chain('ca-valencia'), ['ca-valencia', 'ca', 'es']);
  assert.deepEqual(chain('oc-aranes'), ['oc-aranes', 'ca', 'es']);
  for (const id of ['en', 'ca', 'eu', 'gl', 'ast', 'an']) assert.deepEqual(chain(id), [id, 'es']);
  assert.deepEqual(chain('es'), ['es']);
});

test('ajustes: el idioma se guarda con el adaptador y se sanea', () => {
  const store = memory(), p = new LocalPersistence(store);
  assert.equal(p.settings().lang, null);
  p.settings({ ...p.settings(), lang: 'gl', speed: 65 });
  assert.deepEqual([readSettings(store).lang, readSettings(store).speed], ['gl', 65]);
  writeSettings({ lang: 'klingon' }, store); assert.equal(readSettings(store).lang, null);
  writeSettings({ lang: 'ca-valencia' }, store); assert.equal(p.settings().lang, 'ca-valencia');
  assert.equal(p.settings().speed, 65, 'guardar el idioma no pisa otros ajustes');
});

test('t(): interpolación, respaldo y claves inexistentes', () => {
  assert.equal(t('call.status', { connected: 4, ready: 2 }), '4 conectados · 2 con cargo');
  assert.equal(t('no.existe'), 'no.existe');
  assert.equal(t('menu.newGame'), es.menu.newGame);
});

for (const id of LANGS) {
  test(`UI ${id}: todas las claves existen o caen en español sin romper`, () => {
    const tr = translator(id), own = PACKS[id].ui, esKeys = new Map(leaves(es));
    // Sin claves inventadas (erratas): todo lo que define el idioma existe en español (salvo credits.translationValue).
    for (const [key, value] of leaves(own)) {
      if (key === 'credits.translationValue') { assert.equal(typeof value, 'string'); continue; }
      assert.ok(esKeys.has(key), `${id}/ui.js: clave desconocida «${key}» (no está en es/ui.js)`);
      assert.equal(typeof value, typeof esKeys.get(key) === 'function' ? typeof value : 'string', `${id}/ui.js «${key}»: debe ser texto`);
      if (typeof value === 'string' && typeof esKeys.get(key) === 'string') {
        assert.ok(value.trim(), `${id}/ui.js «${key}»: vacía (bórrala para caer en el respaldo)`);
        for (const p of params(esKeys.get(key))) assert.ok(params(value).has(p), `${id}/ui.js «${key}»: falta {${p}}`);
        for (const p of params(value)) assert.ok(params(esKeys.get(key)).has(p), `${id}/ui.js «${key}»: parámetro {${p}} desconocido`);
        assert.equal(tags(value), tags(esKeys.get(key)), `${id}/ui.js «${key}»: mismas etiquetas HTML que en español`);
        assert.ok(!/[ĿŀḶḷḤḥ]/.test(value) || id === 'ast', `${id}/ui.js «${key}»: carácter fuera de la fuente`);
      }
    }
    // Cada clave española resuelve a texto (propio o de respaldo), nunca a la clave cruda.
    for (const [key, value] of esKeys) {
      if (typeof value !== 'string') continue;
      const out = tr(key, Object.fromEntries([...params(value)].map(p => [p, `<${p}>`])));
      assert.ok(out && out !== key, `${id}: «${key}» no resuelve`);
      assert.ok(!/\{\w+\}/.test(out), `${id}: «${key}» deja llaves sin interpolar: ${out}`);
    }
  });

  test(`datos ${id}: solo ids existentes y campos de texto`, () => {
    const feed = data('feed', id), phone = data('phone', id);
    for (const vid of Object.keys(feed.videos || {})) assert.ok(FEED_IDS.includes(vid), `${id}/data.js feed.videos.${vid}: id inexistente`);
    for (const [vid, v] of Object.entries(feed.videos || {})) for (const k of ['id', 'art', 'loop', 'duration', 'avatar', 'news']) assert.ok(!(k in v), `${id}/data.js feed.videos.${vid}.${k}: no se traduce`);
    for (const [section, ids] of Object.entries(PHONE_TEXT_IDS)) for (const k of Object.keys(phone[section] || {})) assert.ok(ids.includes(k), `${id}/data.js phone.${section}.${k}: id inexistente`);
    for (const [nid, n] of Object.entries(phone.notifications || {})) for (const k of ['id', 'after', 'app', 'when']) assert.ok(!(k in n), `${id}/data.js phone.notifications.${nid}.${k}: no se traduce`);
    for (const [pid, p] of Object.entries(phone.policies || {})) for (const k of ['id', 'after']) assert.ok(!(k in p), `${id}/data.js phone.policies.${pid}.${k}: no se traduce`);
    if (phone.policyHeadline !== undefined) assert.equal(typeof phone.policyHeadline, 'function', `${id}/data.js phone.policyHeadline: (rival, policy) => texto`);
  });
}

test('capas: valenciano y aranés heredan del catalán; overrides por id', () => {
  assert.equal(scriptLayer('es'), null);
  const list = overrideById([{ id: 'a', text: 'x', n: 1 }, { id: 'b', text: 'y' }], { a: { text: 'X' }, zzz: { text: '?' } });
  assert.deepEqual(list, [{ id: 'a', text: 'X', n: 1 }, { id: 'b', text: 'y' }]);
  assert.deepEqual(overrideMap({ press: { label: 'A', icon: 'note' }, k: 'v' }, { press: { label: 'B' } }), { press: { label: 'B', icon: 'note' }, k: 'v' });
  // Si el catalán define algo y el valenciano no, el valenciano lo hereda (y lo propio del valenciano gana).
  // Packs reales sustituidos por mínimos: la prueba mide la cadena de herencia, no las traducciones.
  const saved = { ca: PACKS.ca, val: PACKS['ca-valencia'], oc: PACKS['oc-aranes'], ast: PACKS.ast };
  try {
    PACKS['oc-aranes'] = { ui: {}, script: {}, data: {} }; PACKS.ast = { ui: {}, script: {}, data: {} };
    PACKS.ca = { ui: { menu: { newGame: 'Partida nova', continue: 'Continua' } }, script: { menu: { ribbon: 'CA' } }, data: { feed: { hint: { swipe: 'Llisca' } } } };
    PACKS['ca-valencia'] = { ui: { menu: { continue: 'Continua (val)' } }, script: { menu: { tagline: 'VAL' } }, data: {} };
    const tv = translator('ca-valencia');
    assert.equal(tv('menu.newGame'), 'Partida nova'); assert.equal(tv('menu.continue'), 'Continua (val)'); assert.equal(tv('menu.credits'), es.menu.credits);
    assert.deepEqual(scriptLayer('ca-valencia'), { menu: { ribbon: 'CA', tagline: 'VAL' } });
    assert.equal(data('feed', 'ca-valencia').hint.swipe, 'Llisca');
    assert.equal(translator('oc-aranes')('menu.newGame'), 'Partida nova');
    assert.equal(translator('ast')('menu.newGame'), es.menu.newGame);
  } finally { PACKS.ca = saved.ca; PACKS['ca-valencia'] = saved.val; PACKS['oc-aranes'] = saved.oc; PACKS.ast = saved.ast; }
});

// ---------------------------------------------------------------- textos sin extraer
// Recorre el código que pinta UI y busca literales visibles en español fuera de src/i18n. Heurística: cadenas con
// letras acentuadas/ñ/¿¡ o nodos de texto HTML con palabras. Los comentarios se ignoran.
const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SCAN = ['src/main.js', 'src/ui', 'src/minigames', 'src/dialogue', 'src/cinema/director.js', 'src/world/world.js', 'src/state/phone.js', 'src/save/persistence.js'];
// Literales permitidos: claves internas que no se muestran tal cual.
// 'Tú' y 'Narrador' son hablantes internos (se muestran con speakerLabel); los figurantes de world.extra() no tienen etiqueta.
const ALLOW = new Set(['Tú', 'Narrador', 'Rubén', 'Lucía', 'Cámara']);
const files = SCAN.flatMap(p => { const full = join(ROOT, p); return statSync(full).isDirectory() ? readdirSync(full).filter(f => f.endsWith('.js')).map(f => join(p, f)) : [p]; });
function literals(src) {
  const out = []; let i = 0;
  const push = (s, at) => { const line = src.slice(0, at).split('\n').length; out.push([s, line]); };
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (c === '/' && n === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && n === '*') { i = src.indexOf('*/', i + 2) + 2; continue; }
    if (c === '/' && /[(,=:!&|?{};\[]\s*$/.test(src.slice(Math.max(0, i - 20), i))) { // regex literal
      let j = i + 1, cls = false; while (j < src.length && (src[j] !== '/' || cls)) { if (src[j] === '\\') j++; else if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false; j++; } i = j + 1; continue;
    }
    if (c === "'" || c === '"') { let j = i + 1, s = ''; while (j < src.length && src[j] !== c) { if (src[j] === '\\') { s += src[j + 1]; j += 2; continue; } s += src[j++]; } push(s, i); i = j + 1; continue; }
    if (c === '`') { // template: text parts only; ${…} is scanned recursively
      let j = i + 1, s = '', start = i;
      while (j < src.length && src[j] !== '`') {
        if (src[j] === '\\') { s += src[j + 1]; j += 2; continue; }
        if (src[j] === '$' && src[j + 1] === '{') {
          push(s, start); s = ''; let depth = 1, k = j + 2;
          while (k < src.length && depth) { if (src[k] === '{') depth++; else if (src[k] === '}') depth--; else if (src[k] === '`' || src[k] === "'" || src[k] === '"') { const q = src[k]; k++; while (k < src.length && src[k] !== q) { if (src[k] === '\\') k++; k++; } } k++; }
          out.push(...literals(src.slice(j + 2, k - 1)).map(([x, l]) => [x, l + src.slice(0, j).split('\n').length - 1])); j = k; start = j; continue;
        }
        s += src[j++];
      }
      push(s, start); i = j + 1; continue;
    }
    i++;
  }
  return out;
}
test('ningún texto visible en español fuera de src/i18n (código de UI)', () => {
  const leaks = [];
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
    for (const [s, line] of literals(src)) {
      const text = s.replace(/<[^>]*>/g, ' ').trim();
      if (!text || ALLOW.has(text)) continue;
      const accented = /[áéíóúñÁÉÍÓÚÑ¿¡]/.test(text);
      const htmlWords = /<[a-z][^>]*>[^<${}]*\b[A-Za-zÁÉÍÓÚáéíóúñ]{3,}\s+[A-Za-zÁÉÍÓÚáéíóúñ]{2,}/.test(s);
      if (accented || htmlWords) leaks.push(`${f}:${line}  «${text.slice(0, 70)}»`);
    }
  }
  assert.deepEqual(leaks, [], `Textos visibles sin pasar por t():\n${leaks.join('\n')}`);
});
