import { newCampaign, appoint, chooseProposal, advance, finishSpeech, makeCheckpoint, validCampaign, passedCinematics, crossExit } from '../state/campaign.js';
import { friends, missions } from '../data/campaign.js';
import { createTrailer } from './trailer.js';

// Builds a valid state at `target` by playing every earlier mission with a neutral default.
// Later choice screens (sede, vídeo, crisis…) are skipped without applying their effects.
export function stateAt(target) {
  if (!missions.some(m => m.id === target)) throw new Error(`Misión desconocida: ${target}`);
  const s = newCampaign();
  while (s.mission !== target) {
    const id = s.mission;
    if (id === 'call') friends.forEach(f => appoint(s, f.id, 0));
    if (id === 'register') s.party = { name: 'Partido de prueba', slogan: 'Una cosa bien hecha.', color: '#42877c' };
    if (id === 'neighbor') s.memories.listened = true;
    if (id === 'program') chooseProposal(s, 'shade');
    if (id === 'speech') finishSpeech(s, ['listen', 'shade', 'accountable'], 1);
    if (id === 'crisis') makeCheckpoint(s);
    if (!advance(s, id)) throw new Error(`No se pudo avanzar ${id}`);
    crossExit(s); // a jump walks through every door on the way: it lands in the target mission's own scene
  }
  s.seen = passedCinematics(s); // a jump does not replay the arrivals it skipped over
  if (!validCampaign(s)) throw new Error(`Estado inválido en ${target}`);
  return s;
}

function installPanel(game) {
  const root = document.createElement('div'); root.id = 'dev-panel';
  root.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;font:12px/1.3 monospace;color:#f4eddc';
  const toggle = document.createElement('button');
  toggle.textContent = 'DEV · F8'; toggle.title = 'Saltar a una misión (solo dev)';
  toggle.style.cssText = 'background:#183e3a;color:inherit;border:1px solid #f4eddc55;border-radius:6px;padding:4px 8px;cursor:pointer;font:inherit';
  const list = document.createElement('div');
  list.hidden = true;
  list.style.cssText = 'position:absolute;right:0;bottom:30px;width:300px;max-height:70vh;overflow:auto;background:#183e3aee;border:1px solid #f4eddc55;border-radius:8px;padding:6px';
  missions.filter(m => m.next).forEach((m, i) => {
    const b = document.createElement('button');
    b.textContent = `${String(i + 1).padStart(2, '0')} · ${m.id} — ${m.title}`;
    b.style.cssText = 'display:block;width:100%;text-align:left;background:none;color:inherit;border:0;padding:4px 6px;cursor:pointer;font:inherit';
    b.onmouseenter = () => { b.style.background = '#f4eddc22'; }; b.onmouseleave = () => { b.style.background = 'none'; };
    b.onclick = async () => { list.hidden = true; await window.gameDebug.jumpTo(m.id); };
    list.append(b);
  });
  toggle.onclick = () => { list.hidden = !list.hidden; };
  window.addEventListener('keydown', e => { if (e.code === 'F8') { e.preventDefault(); list.hidden = !list.hidden; } });
  root.append(list, toggle); document.body.append(root);
}

export function installDebug(game) {
  window.gameDebug = Object.freeze({
    // Modo tráiler (docs/trailer/PIPELINE.md): planos declarativos, grabación con tools/trailer/record.mjs.
    trailer: createTrailer(game, { stateAt }),
    state: () => structuredClone(game.state),
    entities: () => game.world.entities.map(e => ({ id: e.id, position: e.anchor.position.asArray() })),
    teleport: (idOrX, z) => {
      const pos = typeof idOrX === 'string' ? game.world.entityById(idOrX)?.anchor.position : { x: idOrX, z };
      if (!pos || !Number.isFinite(pos.x) || !Number.isFinite(pos.z)) return false;
      game.player.body.position.set(pos.x, 0.02, pos.z - (typeof idOrX === 'string' ? 1.4 : 0)); return true;
    },
    camera: (yaw = 0, pitch = 0.36) => { game.player.yaw = yaw; game.player.pitch = Math.max(0.08, Math.min(1.05, pitch)); },
    // Force a crowd reaction ('cheer', 'boo', 'talk', a clip name, or null) to inspect animation blending.
    reaction: (r = null) => { game.reaction = r; return true; },
    scene: () => game.world.scene,
    metrics: () => ({ fps: Math.round(game.engine.getFps()), meshes: game.world.scene.meshes.length, activeMeshes: game.world.scene.getActiveMeshes().length, resolution: [game.engine.getRenderWidth(), game.engine.getRenderHeight()], cameraDistance: game.player.cameraDistance, player: game.player.body.position.asArray().map(v => +v.toFixed(2)), assets: game.world.assetStatus }),
    reset: async (seed = 1) => { if (seed !== 1) throw new Error('Solo semilla 1 disponible; la experiencia es determinista.'); await game.start(newCampaign()); },
    loadChapter: async id => {
      if (id !== 1 && id !== 3) throw new Error('Solo están implementados el inicio y la muestra de plaza.');
      const s = newCampaign();
      if (id === 3) { advance(s, 'phone'); friends.forEach(f => appoint(s, f.id, 0)); advance(s, 'call'); s.party = { name: 'Partido de prueba', slogan: 'Una cosa bien hecha.', color: '#42877c' }; advance(s, 'register'); advance(s, 'leave'); }
      await game.start(s);
    },
    simulate: kind => {
      if (!['good-speech', 'bad-speech'].includes(kind)) return { available: false, reason: 'Elecciones y reintento pertenecen al milestone 2, aún no implementado.' };
      const s = newCampaign(); chooseProposal(s, 'shade'); finishSpeech(s, kind === 'good-speech' ? ['listen', 'shade', 'accountable'] : ['grand', 'everything', 'forever'], kind === 'good-speech' ? 1 : 0); return s.speech;
    },
    music: () => { const m = game.audio.music, t = m.current; return { track: t?.id ?? null, context: game.audio.context?.state ?? null, voices: t?.voices.length ?? 0, ducked: m.ducked, bus: m.bus?.gain.value ?? null, region: t?.loaded ? [t.loaded.start, t.loaded.end, t.loaded.buffer.duration].map(n => Math.round(n * 100) / 100) : null }; },
    missions: () => missions.map(m => m.id),
    cinematic: () => ({ mode: game.mode, id: game.director.active?.id ?? null, time: game.director.time }),
    minigame: () => game.minigame?.debug() ?? null,
    // Lands on the walk to `id`'s exit: the previous mission is done and the door of its scene is pending.
    jumpToExit: async id => {
      if (game.mode === 'loading') return false;
      const i = missions.findIndex(m => m.id === id), prev = missions[i - 1]; if (!prev) return false;
      const s = stateAt(prev.id); if (prev.id === 'crisis' && !s.checkpoint) makeCheckpoint(s); advance(s, prev.id); if (s.scene === missions[i].scene) return false;
      await game.start(s); return true;
    },
    jumpTo: async id => { if (game.mode === 'loading') return false; const s = stateAt(id); await game.start(s); const target = missions.find(m => m.id === id).target; if (target) window.gameDebug.teleport(target); return true; },
    simulateElection: kind => {
      if (game.state.mission !== 'election' || !['victory','defeat'].includes(kind)) return false;
      Object.assign(game.state, kind === 'victory' ? { support: 70, credibility: 70, organization: 70 } : { support: 10, credibility: 10, organization: 10 });
      game.refreshHUD(); return true;
    },
  });
  installPanel(game);
}
