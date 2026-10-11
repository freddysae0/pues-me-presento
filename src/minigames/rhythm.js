// Rhythm minigames: «Hazlo viral» (four poses to the beat, phone on a tripod) and the final rally
// (punchlines on Space while keeping the room's attention). Time advances only through update(dt).
import { icon, keycap, meterBar, setMeter, escapeHTML as esc } from '../ui/ui.js';
import { Actors, stageCamera } from '../cinema/director.js';
import { VIRAL_LANES, VIRAL_BPM, VIRAL_CHART, VIRAL_TAKES, RALLY_BPM, rallyChart } from '../data/minigames.js';
import { viralBonus, rallyBonus } from '../state/minigames.js';
import { script, say } from '../data/script/index.js';
import { t, formatNumber } from '../i18n/index.js';

const VT = script.minigames.viral, RT = script.minigames.rally;

const PERFECT = 0.09, GOOD = 0.2, HIT_X = 10; // seconds; hit ring at 10% of the lane

class Rhythm {
  constructor(game, { lanes, bpm, chart, lead = 2.4, countIn = 4 }) {
    Object.assign(this, { game, lanes, bpm, chart, lead, countIn }); this.spb = 60 / bpm; this.actors = new Actors(game); this.facing = [];
  }
  reset() {
    this.t = -this.countIn * this.spb; this.beat = Math.floor(this.t / this.spb) - 1;
    this.notes = this.chart.map((n, i) => ({ ...n, i, t: n.beat * this.spb, judged: null, el: null }));
    Object.assign(this, { points: 0, hits: 0, perfects: 0, combo: 0, best: 0, done: false });
    this.actors.clear();
  }
  get max() { return this.notes.length * 2; }
  mount(root) {
    this.root = root; this.lane = root.querySelector('.rhythm-lane'); this.judgeEl = root.querySelector('.rhythm-judge'); this.countEl = root.querySelector('.rhythm-count');
    for (const n of this.notes) {
      const l = this.lanes[n.lane], el = document.createElement('span');
      el.className = 'rhythm-note'; el.style.setProperty('--c', l.color); el.textContent = l.key; el.hidden = true;
      this.lane.append(el); n.el = el;
    }
  }
  laneHTML() {
    const legend = this.lanes.map(l => `<span style="--c:${l.color}">${keycap(l.key)}${esc(l.label)}</span>`).join('');
    return `<div class="rhythm"><div class="rhythm-lane"><i class="rhythm-hit"></i><b class="rhythm-judge"></b></div><div class="rhythm-legend">${legend}</div></div>`;
  }
  update(dt) {
    this.t += dt; this.actors.update(dt);
    const beat = Math.floor(this.t / this.spb);
    if (beat !== this.beat) { this.beat = beat; this.onBeat(beat); }
    if (this.countEl) this.countEl.textContent = this.t < 0 ? String(Math.ceil(-this.t / this.spb)) : this.t < this.spb ? this.goWord : '';
    for (const n of this.notes) {
      if (!n.judged && this.t - n.t > GOOD) this.judge(n, 'miss');
      const x = (n.t - this.t) / this.lead;
      if (n.el) { const show = !n.judged && x < 1.04 && x > -0.2; n.el.hidden = !show; if (show) n.el.style.left = `${HIT_X + x * (97 - HIT_X)}%`; }
    }
    this.tick?.(dt);
    if (this.t > this.notes.at(-1).t + 1.2) this.done = true;
  }
  onBeat(beat) { if (beat < 0) this.game.audio.tone(beat === -1 ? 880 : 600, 0.07, 0.07); else if (beat % 2 === 0) this.game.audio.tone(220, 0.05, 0.035); }
  key(e) {
    const lane = this.lanes.findIndex(l => l.codes.includes(e.code)); if (lane < 0) return;
    e.preventDefault(); if (this.t < -GOOD) return;
    let best = null;
    for (const n of this.notes) if (!n.judged && n.lane === lane && Math.abs(n.t - this.t) <= GOOD && (!best || Math.abs(n.t - this.t) < Math.abs(best.t - this.t))) best = n;
    if (best) this.judge(best, Math.abs(best.t - this.t) <= PERFECT ? 'perfect' : 'good');
    else { this.combo = 0; this.flash('whiff', t('rhythm.offBeat')); this.onWhiff?.(); this.game.audio.tone(150, 0.08, 0.05); }
  }
  judge(n, kind) {
    n.judged = kind; if (n.el) n.el.hidden = true;
    if (kind === 'miss') this.combo = 0; else { this.hits++; this.combo++; this.best = Math.max(this.best, this.combo); }
    if (kind === 'perfect') this.perfects++;
    this.points += kind === 'perfect' ? 2 : kind === 'good' ? 1 : 0;
    this.flash(kind, t(`rhythm.${kind}`));
    this.game.audio.tone(kind === 'perfect' ? 784 : kind === 'good' ? 587 : 165, 0.12, 0.08);
    this.onJudge(kind, n);
  }
  flash(kind, text) {
    const j = this.judgeEl; if (!j) return;
    j.className = `rhythm-judge ${kind}`; j.textContent = text; void j.offsetWidth; j.classList.add('pop');
  }
  /** Turn named characters towards a point; restored on dispose. */
  face(names, x, z) {
    for (const name of names) {
      const ch = this.actors.character(name); if (!ch) continue;
      this.facing.push([ch, ch.root.rotation.y]); ch.root.rotation.y = Math.atan2(x - ch.root.position.x, z - ch.root.position.z);
    }
  }
  dispose() {
    this.actors.clear(); this.rig?.restore(); this.rig = null;
    for (const [ch, rot] of this.facing) ch.root.rotation.y = rot; this.facing = [];
    this.game.reaction = null;
  }
  debug() {
    const next = this.notes?.find(n => !n.judged);
    return { t: this.t, points: this.points, max: this.notes ? this.max : 0, next: next ? { lane: next.lane, code: this.lanes[next.lane].codes[0], in: next.t - this.t } : null };
  }
}

// ---------------------------------------------------------------- «Hazlo viral»
const WATCHERS = ['Alba', 'Rafa', 'Reme', 'Luis', 'Marisa'];
export class ViralGame extends Rhythm {
  constructor(game, choice) {
    super(game, { lanes: VIRAL_LANES, bpm: VIRAL_BPM, chart: VIRAL_CHART.map(([beat, lane]) => ({ beat, lane })) });
    this.id = 'viral'; this.goWord = say(VT.goWord, game.state);
    this.eyebrow = say(VT.eyebrow, game.state); this.title = say(VT.title, game.state);
    this.intro = say(VT.intro, game.state, { take: esc(VIRAL_TAKES[choice?.id] || '') });
    this.howto = [[`${keycap('←')}${keycap('↑')}${keycap('→')}${keycap('↓')}`, t('viral.howtoKeys')], [keycap(t('keys.space')), t('viral.howtoStart')]];
  }
  stage() {
    const p = this.game.player; p.body.position.set(5.5, 0.02, 6); p.character.root.position.copyFrom(p.body.position); p.character.root.rotation.y = Math.PI;
    this.rig = stageCamera(this.game, [4.4, 1.85, 1.3], [5.3, 1.25, 6.0], 0.8);
    this.face(WATCHERS, 5.5, 6);
  }
  reset() { super.reset(); this.views = 0; }
  hud() {
    return `<b class="rhythm-count"></b><div class="rec-frame" aria-hidden="true"><span class="rec">${icon('play')}REC <b class="rec-time">00:00</b></span></div>
<div class="mg-top"><span class="chip-big">${icon('reach')}<b class="views">0</b> ${t('viral.views')}</span><span class="chip-big">${t('viral.combo')} <b class="combo">0</b></span><button class="secondary small" id="mg-skip-play">${t('minigame.skip', { key: keycap('X') })}</button></div>
<div class="mg-bottom panel">${this.laneHTML()}<p class="fine">${t('viral.keys', { r: keycap('R'), x: keycap('X'), esc: keycap('Esc') })}</p></div>`;
  }
  mount(root) { super.mount(root); this.viewsEl = root.querySelector('.views'); this.comboEl = root.querySelector('.combo'); this.recEl = root.querySelector('.rec-time'); }
  tick() {
    const s = Math.max(0, this.t); this.recEl.textContent = `00:${String(Math.floor(s)).padStart(2, '0')}`;
    this.comboEl.textContent = this.combo; this.viewsEl.textContent = formatNumber(this.views);
  }
  onJudge(kind, n) {
    if (kind === 'miss') { this.actors.set(WATCHERS[n.i % WATCHERS.length], 'shrug', 1.2); return; }
    this.actors.set('Tú', this.lanes[n.lane].gesture, 0.75);
    this.views += Math.round((kind === 'perfect' ? 900 : 350) * (1 + this.combo * 0.15));
    if (this.combo > 0 && this.combo % 4 === 0) for (const w of WATCHERS) this.actors.set(w, 'cheer', 1.4);
  }
  result() {
    const a = this.points / this.max, bonus = viralBonus({ points: this.points, max: this.max });
    return {
      score: this.points, bonus, great: a >= 0.85, badge: t('viral.badge', { pct: Math.round(a * 100), combo: this.best, views: formatNumber(this.views) }),
      title: say(a >= 0.85 ? VT.titles.great : a >= 0.5 ? VT.titles.ok : VT.titles.bad, this.game.state),
      text: say(a >= 0.5 ? VT.texts.ok : VT.texts.bad, this.game.state),
    };
  }
}

// ---------------------------------------------------------------- El último mitin
const HALL_CROWD = ['Ana', 'Berto', 'Cris', 'Dora', 'Eloy', 'Fina'];
export class RallyGame extends Rhythm {
  constructor(game) {
    super(game, { lanes: [{ codes: ['Space', 'Enter'], key: t('keys.space'), label: say(RT.lane, game.state), gesture: 'cheer_arms', color: 'var(--tomato)' }], bpm: RALLY_BPM, chart: rallyChart(game.state).map(n => ({ ...n, lane: 0 })), lead: 2.8 });
    this.id = 'rally'; this.goWord = say(RT.goWord, game.state);
    this.eyebrow = say(RT.eyebrow, game.state); this.title = say(RT.title, game.state);
    this.intro = say(RT.intro, game.state);
    this.howto = [[keycap(t('keys.space')), t('rally.howtoHit')], [icon('support'), t('rally.howtoAttention')]];
  }
  stage() {
    const p = this.game.player; p.body.position.set(-3, 0.57, 4.35); p.character.root.position.copyFrom(p.body.position); p.character.root.rotation.y = Math.PI;
    this.rig = stageCamera(this.game, [-4.6, 2.3, 5.4], [-1.0, 1.0, -0.8], 0.85);
    this.face(HALL_CROWD, -3, 4.3);
  }
  reset() { super.reset(); this.attention = 0.55; this.game.reaction = null; this.game.playerGesture = 'talk'; }
  hud() {
    return `<b class="rhythm-count"></b><div class="mg-top"><div class="panel attention">${meterBar(0.55, { label: t('rally.attention'), color: 'var(--c-support)', id: 'mg-attention' })}</div><button class="secondary small" id="mg-skip-play">${t('minigame.skip', { key: keycap('X') })}</button></div>
<div class="mg-bottom panel"><p class="rally-phrase"><span></span> <b></b></p>${this.laneHTML()}<p class="fine">${t('rally.keys', { r: keycap('R'), x: keycap('X'), esc: keycap('Esc') })}</p></div>`;
  }
  mount(root) {
    super.mount(root); this.meter = root.querySelector('#mg-attention'); this.phrase = root.querySelector('.rally-phrase');
    this.notes.forEach(n => { n.el.textContent = n.punch; n.el.classList.add('word'); });
  }
  tick(dt) {
    if (this.t > 0) this.attention = Math.max(0, this.attention - dt * 0.03);
    setMeter(this.meter, this.attention);
    const next = this.notes.find(n => !n.judged);
    if (next && next !== this.shown) { this.shown = next; this.phrase.querySelector('span').textContent = next.text; this.phrase.querySelector('b').textContent = next.punch; this.phrase.classList.remove('fresh'); void this.phrase.offsetWidth; this.phrase.classList.add('fresh'); }
    const bored = this.attention < 0.3;
    if (bored !== this.bored) { this.bored = bored; this.game.reaction = bored ? 'idle_look' : null; }
    if (!this.actors.timers.has('Tú')) this.game.playerGesture = 'talk';
  }
  onJudge(kind, n) {
    if (kind === 'miss') { this.attention = Math.max(0, this.attention - 0.1); this.actors.set(HALL_CROWD[n.i % 6], 'boo', 1.6); this.actors.set(HALL_CROWD[(n.i + 3) % 6], 'disappointed', 1.6); return; }
    this.attention = Math.min(1, this.attention + (kind === 'perfect' ? 0.12 : 0.07));
    this.actors.set('Tú', kind === 'perfect' ? 'cheer_arms' : 'nod', 0.8);
    const who = kind === 'perfect' ? HALL_CROWD : [HALL_CROWD[n.i % 6], HALL_CROWD[(n.i + 2) % 6]];
    for (const c of who) this.actors.set(c, kind === 'perfect' ? 'clap' : 'cheer', 1.3);
  }
  onWhiff() { this.attention = Math.max(0, this.attention - 0.04); }
  result() {
    const bonus = rallyBonus({ hits: this.hits, notes: this.notes.length, attention: this.attention }), a = this.hits / this.notes.length;
    return {
      score: this.points, bonus, great: a >= 0.85 && this.attention >= 0.6, badge: t('rally.badge', { hits: this.hits, total: this.notes.length, pct: Math.round(this.attention * 100) }),
      title: say(a >= 0.85 ? RT.titles.great : a >= 0.5 ? RT.titles.ok : RT.titles.bad, this.game.state),
      text: say(RT.text, this.game.state),
    };
  }
}
