// Debate: duelo de réplicas. Four rounds from the script (five when it brings Fox's `foxDebate.round`): a rival (or the
// moderator) attacks, you pick a reply against the clock, and halfway through someone interrupts: Space asks for the
// floor back. Rounds may carry their own interruption/reactions (Fox's). Time advances only through update(dt).
import { icon, keycap, meterBar, setMeter, choiceList, escapeHTML as esc } from '../ui/ui.js';
import { Actors, stageCamera } from '../cinema/director.js';
import { duelRounds } from '../data/minigames.js';
import { duelBonus } from '../state/minigames.js';
import { script, say } from '../data/script/index.js';
import { t } from '../i18n/index.js';

const T = script.minigames.duel;

const ASK = 3.2, ANSWER = 10, INTERRUPT_AT = 3.5, INTERRUPT = 2.2, REACT = 2.2;
const HALL_CROWD = ['Ana', 'Berto', 'Cris', 'Dora', 'Eloy', 'Fina'];
// The scripts title the duel «Cuatro preguntas…». With Fox's extra round the count word follows the real number
// of rounds, so the writers' text stays as written and still tells the truth.
const COUNT = ['Cero', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'];
const countTitle = (title, n) => typeof title === 'string' && COUNT[n] ? title.replace(/^(Cuatro|Cinco)(?= preguntas)/, COUNT[n]) : title;

export class DuelGame {
  constructor(game) {
    this.game = game; this.id = 'duel'; this.actors = new Actors(game); this.rounds = duelRounds(game.state);
    this.eyebrow = say(T.eyebrow, game.state); this.title = countTitle(say(T.title, game.state), this.rounds.length);
    this.intro = say(T.intro, game.state, { rounds: esc(this.rounds.length) });
    this.howto = [[`${keycap('1')}${keycap('2')}${keycap('3')}`, t('duel.howtoAnswer')], [keycap(t('keys.space')), t('duel.howtoFloor')], [icon('credibility'), t('duel.howtoFast')]];
  }
  stage() {
    const p = this.game.player; p.body.position.set(-0.4, 0.57, 3.9); p.character.root.position.copyFrom(p.body.position); p.character.root.rotation.y = Math.PI;
    // Wide enough for the four lecterns (you, Rival A, B, C) and the moderator, kept in the left 60% of the screen
    // because the reply panel covers the right side.
    this.rig = stageCamera(this.game, [3.85, 3.1, -1.9], [3.85, 1.45, 3.9], 0.95);
  }
  reset() {
    Object.assign(this, { round: -1, points: 0, correct: 0, done: false, log: [] });
    this.actors.clear(); // mount() opens the first round on the fresh HUD
  }
  hud() {
    return `<div class="mg-top"><span class="chip-big duel-round"></span><span class="chip-big">${icon('credibility')}<b class="duel-points">0</b> ${t('duel.points')}</span><button class="secondary small" id="mg-skip-play">${t('minigame.skip', { key: keycap('X') })}</button></div>
<div class="mg-bottom panel duel-panel"><span class="eyebrow">${icon('mic')}<span class="duel-topic"></span></span><p class="duel-claim"></p>${meterBar(1, { label: t('minigame.time'), color: 'var(--sun)', id: 'duel-timer' })}<p class="duel-interrupt" hidden>${icon('chat')}<span>${t('duel.interrupt', { key: keycap(t('keys.space')) })}</span></p><div class="duel-options"></div><p class="fine">${t('duel.keys', { r: keycap('R'), x: keycap('X'), esc: keycap('Esc') })}</p></div>`;
  }
  mount(root) {
    this.root = root; this.timer = root.querySelector('#duel-timer'); this.claim = root.querySelector('.duel-claim'); this.options = root.querySelector('.duel-options');
    this.interruptEl = root.querySelector('.duel-interrupt'); this.next();
  }
  next() {
    this.round++;
    if (this.round >= this.rounds.length) { this.done = true; return; }
    const r = this.rounds[this.round];
    Object.assign(this, { phase: 'ask', clock: 0, interrupted: false, interruptLeft: 0, interruptedOnce: false, picked: null });
    this.root.querySelector('.duel-round').textContent = t('duel.round', { n: this.round + 1, total: this.rounds.length });
    this.root.querySelector('.duel-topic').textContent = r.topic.toLocaleUpperCase();
    this.claim.innerHTML = `<b style="color:var(--tomato)">${esc(r.speaker)}:</b> ${esc(r.claim)}`;
    this.options.innerHTML = choiceList(r.options.map((o, i) => ({ id: `duel-${i}`, title: o })));
    this.options.querySelectorAll('button').forEach((b, i) => { b.disabled = true; b.tabIndex = -1; b.onclick = () => this.answer(i); });
    setMeter(this.timer, 1); this.interruptEl.hidden = true;
    this.game.ui.subtitle(r.speaker, r.claim); this.game.audio.chatter(r.speaker, r.claim);
    this.actors.set(r.actor, 'talk', ASK);
  }
  update(dt) {
    if (this.done) return;
    this.actors.update(dt); this.clock += dt;
    const r = this.rounds[this.round];
    if (this.phase === 'ask' && this.clock >= ASK) {
      this.phase = 'answer'; this.clock = 0; this.game.ui.subtitle(null);
      this.options.querySelectorAll('button').forEach(b => { b.disabled = false; });
    } else if (this.phase === 'answer') {
      setMeter(this.timer, 1 - this.clock / ANSWER);
      if (!this.interruptedOnce && this.clock >= INTERRUPT_AT) this.interrupt(r, true);
      if (this.interrupted && (this.interruptLeft -= dt) <= 0) this.interrupt(r, false);
      if (this.clock >= ANSWER) this.answer(-1);
    } else if (this.phase === 'react' && this.clock >= REACT) { this.game.ui.subtitle(null); this.next(); }
  }
  interrupt(r, on) {
    this.interrupted = on; this.interruptEl.hidden = !on;
    this.options.querySelectorAll('button').forEach(b => { b.disabled = on; });
    if (on) {
      this.interruptedOnce = true; this.interruptLeft = INTERRUPT;
      const line = say(r.interruption || T.interruptions[r.role] || T.interruptions.fallback, this.game.state); this.game.ui.subtitle(r.speaker, line); this.game.audio.chatter(r.speaker, line);
      this.actors.set(r.actor, 'talk', INTERRUPT); this.actors.set('Tú', 'shrug', 1);
    } else this.game.ui.subtitle(null);
  }
  key(e) {
    if (e.code === 'Space') { e.preventDefault(); if (this.phase === 'answer' && this.interrupted) { this.interrupt(this.rounds[this.round], false); this.game.ui.subtitle('Tú', say(T.floor, this.game.state)); this.game.audio.chatter('Tú', say(T.floorBabble || T.floor, this.game.state)); } return; }
    const m = e.code.match(/^Digit([1-3])$/); if (m) { e.preventDefault(); this.answer(Number(m[1]) - 1); }
  }
  answer(i) {
    if (this.phase !== 'answer' || (this.interrupted && i >= 0)) return;
    const r = this.rounds[this.round], right = i === r.correct, quick = ANSWER - this.clock >= 5;
    const gained = right ? (quick ? 2 : 1) : 0;
    this.points += gained; if (right) this.correct++;
    this.log.push({ round: this.round, picked: i, right, gained });
    this.phase = 'react'; this.clock = 0; this.interruptEl.hidden = true; this.interrupted = false;
    this.root.querySelector('.duel-points').textContent = this.points;
    this.options.querySelectorAll('button').forEach((b, k) => { b.disabled = true; b.classList.toggle('right', k === r.correct); b.classList.toggle('wrong', k === i && !right); });
    if (i >= 0) this.actors.set('Tú', 'talk_gesture_a', 1.4);
    if (right) { for (const c of HALL_CROWD) this.actors.set(c, 'clap', 1.8); this.actors.set(r.actor, 'disappointed', 2); }
    else for (const c of HALL_CROWD.slice(0, 3)) this.actors.set(c, i < 0 ? 'shrug' : 'boo', 1.8);
    // Default: the moderator judges time and right answers, the asker gloats over wrong ones. A round with its own
    // reactions (Fox) has the asker say them all.
    const s = this.game.state, moderator = script.rivals.moderator, own = r.reactions || {};
    const line = i < 0 ? (own.timeout ? [r.speaker, say(own.timeout, s)] : [moderator, say(T.reactions.timeout, s)])
      : right ? (own.right ? [r.speaker, say(own.right, s)] : [moderator, say(quick ? T.reactions.quick : T.reactions.slow, s)])
        : [r.speaker, say(own.wrong || T.reactions.wrong, s)];
    this.game.ui.subtitle(...line); this.game.audio.chatter(...line);
    this.game.audio.tone(right ? 660 : 180, 0.16, 0.08);
  }
  result() {
    const max = this.rounds.length * 2, bonus = duelBonus({ points: this.points, max, correct: this.correct, rounds: this.rounds.length });
    return {
      score: this.points, bonus, great: this.correct === this.rounds.length, badge: t('duel.badge', { correct: this.correct, total: this.rounds.length, points: this.points, max }),
      title: say(this.correct === this.rounds.length ? T.titles.all : this.correct >= Math.ceil(this.rounds.length / 2) ? T.titles.mid : T.titles.low, this.game.state),
      text: say(T.text, this.game.state),
    };
  }
  dispose() { this.actors.clear(); this.rig?.restore(); this.rig = null; this.game.ui.subtitle(null); this.root = null; }
  debug() { const r = this.rounds[this.round]; return { round: this.round, rounds: this.rounds.length, role: r?.role, actor: r?.actor, step: this.phase, correct: r?.correct, interrupted: this.interrupted, points: this.points }; }
}
