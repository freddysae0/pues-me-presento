// Idiomas del juego. Español (es) es la base: la UI está en ./es/ui.js, el guion en src/data/script/ (actual.js + b.js)
// y los datos con texto (feed, móvil…) en src/data/*.js. Cada idioma añade, en su carpeta ./<código>/ (en, ca, ca-valencia, eu, gl, ast, an, oc-aranes):
//   ui.js      diccionario de la interfaz con las mismas claves que ./es/ui.js (lo que falte cae en español)
//   script.js  capa del guion: se fusiona encima de actual.js + b.js con el mismo deepMerge
//   data.js    textos de datos por id (feed de unratito, notificaciones y programas del móvil, encuesta)
// Ver ./README.md. Un traductor solo toca src/i18n/<lang>/*.
//
// El idioma se decide UNA vez, al cargar el módulo (ajuste guardado → idioma del navegador → 'es'), porque los
// módulos de datos construyen misiones, propuestas y diálogos al importarse. Cambiar de idioma = guardar el ajuste y
// recargar la página (main.js); el progreso se conserva y se vuelve al último punto seguro.
// Fuera del navegador (pruebas con Node) el idioma por defecto es siempre 'es'.
import { readSettings, writeSettings, LANGUAGE_IDS } from '../save/settings.js';
import esUi from './es/ui.js';
import enUi from './en/ui.js';
import enScript from './en/script.js';
import enData from './en/data.js';
import caUi from './ca/ui.js';
import caScript from './ca/script.js';
import caData from './ca/data.js';
import caValUi from './ca-valencia/ui.js';
import caValScript from './ca-valencia/script.js';
import caValData from './ca-valencia/data.js';
import euUi from './eu/ui.js';
import euScript from './eu/script.js';
import euData from './eu/data.js';
import glUi from './gl/ui.js';
import glScript from './gl/script.js';
import glData from './gl/data.js';
import astUi from './ast/ui.js';
import astScript from './ast/script.js';
import astData from './ast/data.js';
import anUi from './an/ui.js';
import anScript from './an/script.js';
import anData from './an/data.js';
import ocUi from './oc-aranes/ui.js';
import ocScript from './oc-aranes/script.js';
import ocData from './oc-aranes/data.js';

/** Idiomas disponibles: nombre nativo (selector), configuración regional para números y cadena de respaldo.
 *  Lo que un idioma no traduce cae en el siguiente de `fallback` y, al final, siempre en español.
 *  · Valencià → Català → Español: comparten casi todo el léxico; mejor catalán que saltar al español.
 *  · Aranés → Català → Español: el aranés (occitano) se escolariza junto al catalán en Arán y está mucho más
 *    cerca de él que del español; quien juega en aranés lee catalán con naturalidad.
 *  · Asturianu, Aragonés → Español. */
export const LANGUAGES = [
  { id: 'es', name: 'Español', locale: 'es-ES', fallback: [] },
  { id: 'en', name: 'English', locale: 'en-GB', fallback: ['es'] },
  { id: 'ca', name: 'Català', locale: 'ca-ES', fallback: ['es'] },
  { id: 'ca-valencia', name: 'Valencià', locale: 'ca-ES-valencia', fallback: ['ca', 'es'] },
  { id: 'eu', name: 'Euskara', locale: 'eu-ES', fallback: ['es'] },
  { id: 'gl', name: 'Galego', locale: 'gl-ES', fallback: ['es'] },
  { id: 'ast', name: 'Asturianu', locale: 'ast-ES', fallback: ['es'] },
  { id: 'an', name: 'Aragonés', locale: 'an-ES', fallback: ['es'] },
  { id: 'oc-aranes', name: 'Aranés', locale: 'oc-ES', fallback: ['ca', 'es'] },
];
export const LANGS = LANGUAGE_IDS;
export const BASE_LANG = 'es';

/** ui: diccionario; script: capa del guion (null en español); data: textos de datos por id. */
export const PACKS = {
  es: { ui: esUi, script: null, data: {} },
  'en': { ui: enUi, script: enScript, data: enData },
  'ca': { ui: caUi, script: caScript, data: caData },
  'ca-valencia': { ui: caValUi, script: caValScript, data: caValData },
  'eu': { ui: euUi, script: euScript, data: euData },
  'gl': { ui: glUi, script: glScript, data: glData },
  'ast': { ui: astUi, script: astScript, data: astData },
  'an': { ui: anUi, script: anScript, data: anData },
  'oc-aranes': { ui: ocUi, script: ocScript, data: ocData },
};

/** Cadena de idiomas a consultar, del propio al español: chain('ca-valencia') → ['ca-valencia', 'ca', 'es']. */
export const chain = id => [id, ...(LANGUAGES.find(l => l.id === id)?.fallback || [BASE_LANG])].filter((x, i, a) => PACKS[x] && a.indexOf(x) === i);

const DEV = (() => { try { return !!import.meta.env?.DEV; } catch { return false; } })();

/** Primer idioma soportado de una lista de etiquetas BCP 47 ('ca-ES', 'eu', 'en-US'…), o 'es'. */
export function detectLanguage(tags = []) {
  for (const tag of tags) {
    const parts = String(tag || '').toLowerCase().split(/[-_]/), base = parts[0];
    if (base === 'ca' && parts.includes('valencia')) return 'ca-valencia';
    if (base === 'oc') return 'oc-aranes'; // oc, oc-ES, oc-aranes: la única variante occitana del juego
    if (LANGS.includes(base)) return base;
  }
  return BASE_LANG;
}

function initialLanguage() {
  const stored = readSettings().lang;
  if (stored) return stored;
  if (typeof document === 'undefined' || typeof navigator === 'undefined') return BASE_LANG; // Node: siempre español
  return detectLanguage(navigator.languages?.length ? navigator.languages : [navigator.language]);
}

/** Idioma activo de esta carga de página. */
export const lang = initialLanguage();
export const locale = LANGUAGES.find(l => l.id === lang)?.locale || 'es-ES';

/** Guarda el idioma elegido (no recarga: eso lo decide quien llama). */
export function saveLanguage(id) { return LANGS.includes(id) && writeSettings({ lang: id }); }

// ---------------------------------------------------------------- t()
const lookup = (dict, key) => key.split('.').reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), dict);
const format = (value, params = {}) => {
  const text = typeof value === 'function' ? value(params) : value;
  return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
};
const warned = new Set();
const warn = (id, key, why) => { if (!DEV || warned.has(`${id}:${key}`)) return; warned.add(`${id}:${key}`); console.warn(`[i18n] ${why} «${key}» (${id})`); };

const missing = v => v === undefined || v === null || v === '';
/** Traductor para un idioma: t(clave, parámetros). Interpola {nombre}; si falta la clave, sigue la cadena de respaldo. */
export function translator(id = lang) {
  const dicts = chain(id).map(l => PACKS[l].ui);
  return (key, params) => {
    let value;
    for (const [i, dict] of dicts.entries()) { value = lookup(dict, key); if (!missing(value)) break; if (i === 0 && id !== BASE_LANG) warn(id, key, 'Falta traducción de'); }
    if (missing(value) || typeof value === 'object') { warn(id, key, 'Clave inexistente'); return key; }
    return format(value, params);
  };
}
/** t('menu.newGame'), t('call.status', { connected: 4, ready: 1 }). Ver ./es/ui.js. */
export const t = translator(lang);
/** Cadena opcional: '' si ningún idioma de la cadena la define (p. ej. el crédito de traducción). */
export function tOptional(key, params, id = lang) {
  for (const l of chain(id)) { const v = lookup(PACKS[l].ui, key); if (!missing(v) && typeof v !== 'object') return format(v, params); }
  return '';
}
/** Lista u objeto del diccionario (p. ej. créditos), con la misma caída a español. */
export function tList(key, id = lang) {
  for (const l of chain(id)) { const v = lookup(PACKS[l].ui, key); if (Array.isArray(v) && v.length) return v; }
  return [];
}

// ---------------------------------------------------------------- guion y datos
const isPlain = v => !!v && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
/** Igual que deepMerge del guion: objetos clave a clave; arrays, funciones y cadenas se reemplazan. */
export function mergeLayers(base, over) {
  if (over === undefined) return base;
  if (!isPlain(base) || !isPlain(over)) return over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = mergeLayers(base[k], v);
  return out;
}
const layered = (id, pick) => chain(id).filter(l => l !== BASE_LANG).reverse().reduce((acc, l) => { const v = pick(PACKS[l]); return v && Object.keys(v).length ? mergeLayers(acc || {}, v) : acc; }, null);
/** Capa del guion del idioma (con su cadena: ca-valencia = ca + ca-valencia). null en español o si todo está vacío.
 *  La aplica src/data/script/index.js encima de actual + b. */
export const scriptLayer = (id = lang) => layered(id, p => p.script);
/** Textos de datos del idioma (con su cadena): data('feed'), data('phone')… Siempre un objeto (vacío si no hay). */
export const data = (section, id = lang) => layered(id, p => p.data?.[section]) || {};

/** Sobrescribe campos de una lista de objetos con `id` (feed, notificaciones, políticas). Ids desconocidos se ignoran. */
export function overrideById(list, overrides = {}) {
  return list.map(item => (overrides[item.id] && typeof overrides[item.id] === 'object' ? { ...item, ...overrides[item.id] } : item));
}
/** Sobrescribe un objeto plano clave a clave (un nivel de profundidad: APPS, textos de la encuesta). */
export function overrideMap(base, overrides = {}) {
  const out = { ...base };
  for (const [k, v] of Object.entries(overrides)) out[k] = v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' ? { ...base[k], ...v } : v;
  return out;
}

// ---------------------------------------------------------------- utilidades de presentación
/** Nombre visible de un hablante. 'Tú' es una clave interna (color, voz, gestos): se muestra traducido. */
export const speakerLabel = name => (name === 'Tú' ? t('speakers.you') : name);
/** Cargos: el guardado conserva el valor español (lo valida src/state); aquí se traduce para mostrarlo. */
const JOB_KEYS = { 'Tesorería': 'treasury', 'Estrategia': 'strategy', 'Comunicación': 'communication', 'Portavoz': 'spokesperson', 'Organización': 'organization', 'Actos': 'events' };
export const jobLabel = job => (JOB_KEYS[job] ? t(`jobs.${JOB_KEYS[job]}`) : job);
/** Número con separadores del idioma (visualizaciones…). */
export const formatNumber = n => Number(n).toLocaleString(locale);
/** Un decimal con el separador del idioma (encuesta del móvil): 28,8 · 28.8. */
export const formatDecimal = n => (Math.round(n * 10) / 10).toFixed(1).replace('.', t('format.decimal'));

/** <html lang>, título de la pestaña y etiquetas fijas de index.html. Lo llama main.js al arrancar. */
export function applyDocumentLanguage(doc = globalThis.document) {
  if (!doc) return;
  doc.documentElement.lang = lang;
  doc.title = t('app.title');
  doc.querySelector('#world')?.setAttribute('aria-label', t('app.canvasLabel'));
}
