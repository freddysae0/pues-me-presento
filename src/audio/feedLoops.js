// Bucles cortos sintetizados para los vídeos de «unratito» (misión 'phone'). Sin samples ni assets.
// Usa el contexto del mundo (GameAudio.context): al pausar se suspende y el reloj se congela, así que
// el secuenciador deja de programar notas. El feed llama a tick() en cada frame y a stop() al cambiar
// de vídeo o al cerrar el móvil.

const hz = midi => 440 * 2 ** ((midi - 69) / 12);
const _ = null;

// 16 pasos por compás (semicorcheas). lead/bass: notas MIDI por paso; kick/snare/hat: 1 = golpe.
export const loops = {
  // Trend: pop verbenero.
  pop: { bpm: 118, lead: { type: 'square', gain: .05, len: .11, cutoff: 2600, notes: [76, _, 79, _, 81, _, 79, 76, _, 74, _, 76, _, 72, _, _] },
    bass: { type: 'triangle', gain: .22, len: .2, notes: [45, _, _, 45, _, _, 52, _, 41, _, _, 41, _, _, 48, _] },
    kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1] },
  // Abuelo: pasodoble de chiringuito (chunda-chunda y trompeta de feria).
  pasodoble: { bpm: 112, lead: { type: 'sawtooth', gain: .035, len: .2, cutoff: 1700, notes: [69, _, _, 71, 72, _, 74, _, 76, _, _, 74, 72, _, 71, _] },
    bass: { type: 'triangle', gain: .24, len: .14, notes: [45, _, _, _, 57, _, _, _, 40, _, _, _, 56, _, _, _] },
    kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
  // 6 7: trap acelerado, 808 grave y dos notas que suben y bajan como las manos.
  trap: { bpm: 140, lead: { type: 'square', gain: .045, len: .1, cutoff: 3200, notes: [_, _, _, _, 78, _, 73, _, _, _, _, _, 78, _, 73, _] },
    bass: { type: 'sine', gain: .32, len: .34, glide: .7, notes: [38, _, _, _, _, _, _, 38, _, _, 41, _, _, _, _, _] },
    kick: [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0], snare: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], hat: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1] },
  // Noticia: sintonía de urgencia con tic-tac.
  news: { bpm: 100, lead: { type: 'square', gain: .04, len: .16, cutoff: 2200, notes: [72, _, 79, _, _, _, _, _, 71, _, 74, _, _, _, _, _] },
    bass: { type: 'sine', gain: .2, len: .12, notes: [48, _, _, _, 48, _, _, _, 43, _, _, _, 43, _, _, _] },
    kick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], snare: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], hat: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
};

const noiseBuffers = new WeakMap();
function noise(c) {
  let b = noiseBuffers.get(c);
  if (!b) { b = c.createBuffer(1, c.sampleRate / 2, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; noiseBuffers.set(c, b); }
  return b;
}
function env(c, t, gain, len, attack = .005) {
  const g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(.0002, gain), t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + len); return g;
}

export class FeedLoop {
  constructor(audio) { this.audio = audio; this.sources = new Set(); this.pattern = null; this.bus = null; }
  play(id) { this.stop(); this.pattern = loops[id] || null; this.step = 0; this.next = null; }
  stop() { for (const s of this.sources) { try { s.stop(); } catch {} } this.sources.clear(); this.pattern = null; }
  dispose() { this.stop(); try { this.bus?.disconnect(); } catch {} this.bus = null; }
  tick() {
    const a = this.audio, c = a.context;
    if (!this.pattern || !c || c.state !== 'running' || a.paused) return;
    if (!this.bus || this.bus.context !== c) { this.bus = c.createGain(); this.bus.connect(c.destination); }
    this.bus.gain.value = 0.55 * (a.settings.volume ?? 1);
    const step = 60 / this.pattern.bpm / 4;
    if (this.next === null || this.next < c.currentTime - .05) this.next = c.currentTime + .05;
    while (this.next < c.currentTime + .15) { this.schedule(this.step, this.next); this.step = (this.step + 1) % 16; this.next += step; }
  }
  keep(src) { this.sources.add(src); src.onended = () => { this.sources.delete(src); src.disconnect(); }; }
  schedule(i, t) {
    const p = this.pattern, c = this.audio.context, out = this.bus;
    for (const part of [p.lead, p.bass]) {
      const n = part.notes[i]; if (n == null) continue;
      const osc = c.createOscillator(); osc.type = part.type; osc.frequency.setValueAtTime(hz(n) * (part.glide ? 1.5 : 1), t);
      if (part.glide) osc.frequency.exponentialRampToValueAtTime(hz(n), t + .06);
      let node = osc;
      if (part.cutoff) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = part.cutoff; osc.connect(f); node = f; }
      node.connect(env(c, t, part.gain, part.len)).connect(out); osc.start(t); osc.stop(t + part.len + .03); this.keep(osc);
    }
    if (p.kick[i]) { const o = c.createOscillator(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + .12); o.connect(env(c, t, .45, .16, .002)).connect(out); o.start(t); o.stop(t + .18); this.keep(o); }
    for (const [hit, freq, len, gain, type] of [[p.snare[i], 1800, .12, .16, 'bandpass'], [p.hat[i], 7500, .035, .06, 'highpass']]) {
      if (!hit) continue;
      const s = c.createBufferSource(); s.buffer = noise(c); const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq;
      s.connect(f).connect(env(c, t, gain, len, .002)).connect(out); s.start(t, Math.random() * .3, len + .02); this.keep(s);
    }
  }
}
