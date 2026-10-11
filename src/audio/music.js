import { music as catalog } from '../assets/catalog.js';

const FADE = 1.6, LOOP_FADE = 3, DUCK = 0.45, BASE = 0.6, SILENCE = 0.003, CACHE = 3;

// Pure: which track belongs to the current scene/mission/mode. Missing tracks fall back here.
export function trackFor(state, mode) {
  if (mode === 'menu') return 'theme';
  if (mode === 'speech' || (mode === 'minigame' && state.mission === 'finalSpeech')) return 'speech';
  if (state.scene === 'flat') return 'flat';
  if (state.scene === 'plaza') return state.mission === 'video' && (mode === 'modal' || mode === 'minigame') ? 'trend' : 'plaza';
  if (state.scene === 'hq') return state.mission === 'crisis' ? 'crisis' : 'hq';
  return 'theme'; // hall: debate, mitin y recuento aún sin pista propia
}

// Audible region, so AI-generated silence at either end does not leave a gap in the loop.
function bounds(buffer) {
  const data = buffer.getChannelData(0); let a = 0, b = data.length - 1;
  while (a < b && Math.abs(data[a]) < SILENCE) a++;
  while (b > a && Math.abs(data[b]) < SILENCE) b--;
  return { buffer, start: a / buffer.sampleRate, end: (b + 1) / buffer.sampleRate };
}

// Campaign order: the menu theme first, then each scene's track roughly when the player will need it.
const PREFETCH = ['theme', 'flat', 'plaza', 'hq', 'trend', 'speech', 'crisis'];

// Looping background music with crossfades. Time is the AudioContext clock, so suspending it pauses everything.
export class Music {
  constructor(audio, settings) {
    this.audio = audio; this.settings = settings; this.buffers = new Map(); this.bytes = new Map(); this.wanted = null; this.current = null; this.ducked = false;
    this.prefetch();
  }
  /** Download every track's MP3 in the background from page load, one at a time so it never competes much with the
   *  3D assets. Downloading needs no user gesture (decoding does), so on slow connections the music is already here
   *  when a scene asks for it. A track requested before its turn is fetched immediately (see fetchBytes). */
  async prefetch() {
    if (typeof fetch !== 'function' || typeof window === 'undefined') return;
    const order = [...new Set([...PREFETCH, ...Object.keys(catalog)])].filter(id => catalog[id]);
    for (const id of order) await this.fetchBytes(id).catch(() => null);
  }
  fetchBytes(id) {
    if (!this.bytes.has(id)) {
      const p = fetch(catalog[id].path).then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.status)));
      p.catch(() => this.bytes.delete(id)); // a failed download may be retried later
      this.bytes.set(id, p);
    }
    return this.bytes.get(id);
  }
  level() { return BASE * this.settings.music * (this.ducked ? DUCK : 1); }
  play(id) { this.wanted = catalog[id] ? id : null; this.sync(); }
  duck(on) { if (this.ducked !== on) { this.ducked = on; this.updateVolume(); } }
  updateVolume() { const c = this.audio.context; if (this.bus) this.bus.gain.setTargetAtTime(this.level(), c.currentTime, 0.25); }
  async sync() {
    const c = this.audio.context; if (!c) return;
    if (!this.bus) { this.bus = c.createGain(); this.bus.gain.value = this.level(); this.bus.connect(c.destination); }
    const id = this.wanted; if (this.current?.id === id) return;
    this.fadeOut(this.current); this.current = null; if (!id) return;
    const track = { id, voices: [] }; this.current = track;
    const loaded = await this.load(id); if (!loaded || this.current !== track) return;
    track.loaded = loaded; track.xfade = Math.min(LOOP_FADE, (loaded.end - loaded.start) / 4);
    this.voice(track, c.currentTime + 0.05, FADE);
  }
  load(id) {
    // decodeAudioData detaches its input, so it gets a copy: the downloaded bytes stay for a later re-decode.
    if (!this.buffers.has(id)) this.buffers.set(id, this.fetchBytes(id).then(data => this.audio.context.decodeAudioData(data.slice(0))).then(bounds).catch(() => null));
    for (const key of this.buffers.keys()) if (this.buffers.size > CACHE && key !== id && key !== this.current?.id) this.buffers.delete(key);
    return this.buffers.get(id);
  }
  voice(track, when, fadeIn) {
    const c = this.audio.context, { buffer, start, end } = track.loaded, length = end - start;
    const src = c.createBufferSource(), gain = c.createGain(); src.buffer = buffer;
    gain.gain.setValueAtTime(0, when); gain.gain.linearRampToValueAtTime(1, when + fadeIn);
    gain.gain.setValueAtTime(1, when + length - track.xfade); gain.gain.linearRampToValueAtTime(0, when + length);
    src.connect(gain).connect(this.bus); src.start(when, start, length);
    const voice = { src, gain }; track.voices.push(voice); track.next = when + length - track.xfade;
    src.onended = () => { src.disconnect(); gain.disconnect(); track.voices = track.voices.filter(v => v !== voice); };
  }
  fadeOut(track) {
    if (!track) return; const now = this.audio.context.currentTime;
    for (const { src, gain } of track.voices) {
      gain.gain.cancelScheduledValues(now); gain.gain.setValueAtTime(gain.gain.value, now); gain.gain.linearRampToValueAtTime(0, now + FADE);
      try { src.stop(now + FADE); } catch {}
    }
  }
  // Called every frame; schedules the next loop pass shortly before the crossfade point.
  tick() {
    const c = this.audio.context, t = this.current;
    if (c?.state === 'running' && t?.loaded && c.currentTime > t.next - 0.5) this.voice(t, t.next, t.xfade);
  }
}
