import { Music } from './music.js';
import { uiSounds, footstep, plosive, syllableShape, voiceFor } from './sfx.js';

const VOICE = 1.6; // babble sits above the ducked music

export class GameAudio {
  constructor(settings) { this.settings = settings; this.nodes = new Set(); this.last = 0; this.paused = false; this.music = new Music(this, settings); }
  // Two clocks: `context` is the game world (frozen on pause); `uiContext` keeps menu feedback alive in the pause screen.
  unlock() {
    if (!this.context) { this.context = new AudioContext(); this.uiContext = new AudioContext(); }
    if (!this.paused) this.context.resume().catch(() => {});
    this.uiContext.resume().catch(() => {}); this.music.sync();
  }
  // First user gesture (start-up notice): unlock both clocks, then play `kind` once the interface clock runs.
  start(kind) { this.unlock(); return this.uiContext.resume().catch(() => {}).then(() => this.ui(kind)); }
  pause() { this.paused = true; this.context?.suspend().catch(() => {}); }
  resume() { if (!this.paused) return; this.paused = false; this.context?.resume().catch(() => {}); }
  running() { return this.context?.state === 'running'; }
  track(sources) { for (const s of sources) { this.nodes.add(s); s.onended = () => { this.nodes.delete(s); s.disconnect(); }; } }
  ui(kind) { const c = this.uiContext; if (c?.state === 'running' && uiSounds[kind]) uiSounds[kind](c, c.destination, this.settings.volume); }
  footstep(surface, running) { if (this.running()) footstep(this.context, this.context.destination, this.settings.volume * 0.8, surface, running); }
  tone(frequency, duration = 0.06, gain = 0.08) {
    if (!this.running()) return;
    const c = this.context, osc = c.createOscillator(), env = c.createGain(), filter = c.createBiquadFilter();
    osc.type = 'triangle'; osc.frequency.setValueAtTime(frequency, c.currentTime); osc.frequency.exponentialRampToValueAtTime(frequency * 0.85, c.currentTime + duration);
    filter.type = 'lowpass'; filter.frequency.value = 1100;
    env.gain.setValueAtTime(0, c.currentTime); env.gain.linearRampToValueAtTime(gain * this.settings.volume, c.currentTime + 0.008); env.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    osc.connect(filter).connect(env).connect(c.destination); osc.start(); osc.stop(c.currentTime + duration); this.nodes.add(osc);
    osc.onended = () => { this.nodes.delete(osc); osc.disconnect(); filter.disconnect(); env.disconnect(); };
  }
  // One "p" per revealed vowel, throttled so fast text speeds do not machine-gun.
  syllable(char, speaker, index, text = char) {
    if (!this.settings.babble || !this.running() || !/[aeiouáéíóú]/i.test(char) || performance.now() - this.last < 90) return;
    this.last = performance.now();
    this.track(plosive(this.context, this.context.destination, this.settings.volume * VOICE, voiceFor(speaker), syllableShape(speaker, text, index)));
  }
  // Whole line shown at once (video call, toasts): a short burst of babble instead of per-letter.
  chatter(speaker, text) {
    if (!this.settings.babble || !this.running()) return; this.stop();
    const vowels = [...text.matchAll(/[aeiouáéíóú]/gi)].slice(0, 14);
    vowels.forEach((m, i) => this.track(plosive(this.context, this.context.destination, this.settings.volume * VOICE, voiceFor(speaker), syllableShape(speaker, text, m.index + 1), i * 0.105)));
  }
  stop() { for (const n of this.nodes) { try { n.stop(); } catch {} } this.nodes.clear(); }
}
