import { Vector3, Matrix } from '@babylonjs/core';
import { escapeHTML, speakerColor, keycap, focusEntry } from '../ui/ui.js';
export class Dialogue {
  constructor(game) { this.game = game; this.el = document.querySelector('#dialogue'); }
  start(lines, entity, onDone) {
    this.lines = structuredClone(lines); this.entity = entity; this.onDone = onDone; this.index = 0; this.active = true; this.game.setMode('dialogue'); this.el.hidden = false;
    this.el.classList.remove('enter'); void this.el.offsetWidth; this.el.classList.add('enter'); this.showLine();
  }
  showLine() {
    this.line = this.lines[this.index]; this.visible = 0; this.elapsed = 0; this.pause = 0; this.game.audio.stop();
    this.el.style.setProperty('--speaker', speakerColor(this.line.speaker));
    this.el.innerHTML = `<div class="speaker">${escapeHTML(this.line.speaker)}<span class="offscreen"></span></div><div class="spoken"></div><div class="responses"></div><button class="dialogue-next">Completar ${keycap('Espacio')}</button>`;
    this.el.querySelector('.dialogue-next').onclick = () => this.next();
    this.el.querySelector('button').focus();
  }
  finishText() {
    this.visible = this.line.text.length; this.el.querySelector('.spoken').textContent = this.line.text; this.game.audio.stop();
    const button = this.el.querySelector('.dialogue-next'); button.innerHTML = this.line.choices ? `Elige con ${keycap('1')}–${keycap(String(this.line.choices.length))}` : `Continuar ${keycap('Espacio')}`; button.disabled = !!this.line.choices;
    if (this.line.choices) {
      const choices = this.el.querySelector('.responses');
      choices.innerHTML = this.line.choices.map((c, i) => `<button data-choice="${i}"><kbd>${i + 1}</kbd><span>${escapeHTML(c.text)}</span></button>`).join('');
      choices.querySelectorAll('button').forEach((b, i) => b.onclick = () => this.choose(i)); focusEntry(this.el);
    }
  }
  choose(index) {
    if (!this.active || this.game.mode !== 'dialogue' || this.visible < this.line.text.length) return;
    const choice = this.line.choices?.[index]; if (!choice) return;
    this.game.remember(choice); this.lines.splice(this.index + 1, 0, { speaker: this.line.speaker, text: choice.response }); this.index++; this.showLine();
  }
  next() {
    if (!this.active || this.game.mode !== 'dialogue') return;
    if (this.visible < this.line.text.length) { this.finishText(); return; }
    if (this.line.choices) return;
    this.index++;
    if (this.index >= this.lines.length) { this.stop(); this.onDone?.(); } else this.showLine();
  }
  update(dt) {
    if (!this.active) return;
    if (this.visible < this.line.text.length) {
      this.pause -= dt; this.elapsed += dt;
      while (this.pause <= 0 && this.elapsed >= 1 / this.game.settings.speed && this.visible < this.line.text.length) {
        this.elapsed -= 1 / this.game.settings.speed;
        const char = this.line.text[this.visible++]; this.game.audio.syllable(char, this.line.speaker, this.visible, this.line.text);
        if (/[.,;:!?]/.test(char)) { this.pause = /[.!?]/.test(char) ? 0.2 : 0.09; this.elapsed = 0; }
      }
      this.el.querySelector('.spoken').textContent = this.line.text.slice(0, this.visible);
      if (this.visible === this.line.text.length) this.finishText();
    }
    const anchor = this.entity?.anchor.position || this.game.player.body.position;
    const scene = this.game.world.scene, engine = this.game.engine;
    const p = Vector3.Project(anchor.add(new Vector3(0, 2.1, 0)), Matrix.Identity(), scene.getTransformMatrix(), scene.activeCamera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
    const x = p.x * innerWidth / engine.getRenderWidth(), y = p.y * innerHeight / engine.getRenderHeight();
    const offscreen = p.z < 0 || p.z > 1 || x < 30 || x > innerWidth - 30 || y < 30 || y > innerHeight - 50;
    const width = this.el.offsetWidth, height = this.el.offsetHeight;
    const left = Math.max(16, Math.min(innerWidth - width - 16, offscreen ? (innerWidth - width) / 2 : x - width / 2));
    this.el.style.left = `${left}px`;
    this.el.style.top = `${Math.max(100, Math.min(innerHeight - height - 55, offscreen ? innerHeight - height - 75 : y - height - 40))}px`;
    this.el.style.setProperty('--tail', `${Math.max(34, Math.min(width - 34, x - left))}px`); this.el.classList.toggle('no-tail', offscreen);
    this.el.querySelector('.offscreen').textContent = offscreen ? 'fuera de cámara' : '';
  }
  stop() { this.active = false; this.el.hidden = true; this.game.audio.stop(); }
}
