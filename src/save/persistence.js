import { validCampaign, passedCinematics, SCHEMA } from '../state/campaign.js';
import { readSettings, writeSettings } from './settings.js';
import { t } from '../i18n/index.js';
export const SAVE_KEY = 'pues-me-presento.campaign.v1';
// Replace this adapter with an Electron IPC adapter later; game code stays unchanged.
export class LocalPersistence {
  constructor(storage = globalThis.localStorage) { this.storage = storage; }
  load() {
    try {
      const raw = this.storage.getItem(SAVE_KEY); if (!raw) return { state: null };
      const state = JSON.parse(raw);
      if (state?.version === 1) {
        Object.assign(state, { version: SCHEMA, organization: 25, campaignChoices: {}, checkpoint: null, result: null });
        if (state.mission === 'complete') Object.assign(state, { mission: 'hqBrief', scene: 'hq' });
      }
      if (state && typeof state === 'object' && state.version === SCHEMA) { state.seen ??= passedCinematics(state); state.minigames ??= {}; }
      if (!validCampaign(state)) return { state: null, error: t('save.incompatible') };
      return { state };
    } catch { return { state: null, error: t('save.unreadable') }; }
  }
  save(state) {
    if (!validCampaign(state)) return false;
    try { this.storage.setItem(SAVE_KEY, JSON.stringify(state)); return true; } catch { return false; }
  }
  /** Ajustes (velocidad, audio, ratón, idioma): lectura saneada; con `value`, guarda antes (src/save/settings.js). */
  settings(value) {
    if (value) writeSettings(value, this.storage);
    return readSettings(this.storage);
  }
}
