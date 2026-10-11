// Ajustes del jugador (localStorage 'pmp.settings'). Módulo sin dependencias: lo usan el adaptador de guardado
// (src/save/persistence.js → LocalPersistence.settings) y src/i18n/index.js, que necesita el idioma antes de que se
// evalúe el guion (importar persistence.js desde i18n crearía un ciclo state → data → script → i18n).
export const SETTINGS_KEY = 'pmp.settings';
export const LANGUAGE_IDS = ['es', 'en', 'ca', 'ca-valencia', 'eu', 'gl', 'ast', 'an', 'oc-aranes'];
const DEFAULTS = { speed: 38, babble: true, volume: 0.35, music: 0.6, sensitivity: 1, lang: null };

const storageOf = storage => { try { return storage ?? globalThis.localStorage ?? null; } catch { return null; } };

/** Ajustes saneados. `lang: null` = sin elegir (se detecta del navegador). */
export function readSettings(storage) {
  try {
    const s = JSON.parse(storageOf(storage)?.getItem(SETTINGS_KEY) || '{}');
    return {
      speed: [20, 38, 65].includes(s.speed) ? s.speed : 38, babble: s.babble !== false,
      volume: Number.isFinite(s.volume) ? Math.max(0, Math.min(1, s.volume)) : 0.35,
      music: Number.isFinite(s.music) ? Math.max(0, Math.min(1, s.music)) : 0.6,
      sensitivity: Number.isFinite(s.sensitivity) ? Math.max(0.3, Math.min(2, s.sensitivity)) : 1,
      lang: LANGUAGE_IDS.includes(s.lang) ? s.lang : null,
    };
  } catch { return { ...DEFAULTS }; }
}

/** Guarda los ajustes (fusionados con los actuales). Devuelve false si el almacenamiento no está disponible. */
export function writeSettings(value, storage) {
  try { const store = storageOf(storage); if (!store) return false; store.setItem(SETTINGS_KEY, JSON.stringify({ ...readSettings(store), ...value })); return true; } catch { return false; }
}
