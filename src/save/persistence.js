import { validCampaign, passedCinematics, SCHEMA } from '../state/campaign.js';
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
      if (!validCampaign(state)) return { state: null, error: 'El guardado no es compatible o está dañado. Puedes iniciar una nueva partida.' };
      return { state };
    } catch { return { state: null, error: 'No se pudo leer el guardado local.' }; }
  }
  save(state) {
    if (!validCampaign(state)) return false;
    try { this.storage.setItem(SAVE_KEY, JSON.stringify(state)); return true; } catch { return false; }
  }
  settings(value) {
    try {
      if (value) this.storage.setItem('pmp.settings', JSON.stringify(value));
      const s = JSON.parse(this.storage.getItem('pmp.settings') || '{}');
      return { speed: [20, 38, 65].includes(s.speed) ? s.speed : 38, babble: s.babble !== false, volume: Number.isFinite(s.volume) ? Math.max(0, Math.min(1, s.volume)) : 0.35, music: Number.isFinite(s.music) ? Math.max(0, Math.min(1, s.music)) : 0.6, sensitivity: Number.isFinite(s.sensitivity) ? Math.max(0.3, Math.min(2, s.sensitivity)) : 1 };
    } catch { return { speed: 38, babble: true, volume: 0.35, music: 0.6, sensitivity: 1 }; }
  }
}
