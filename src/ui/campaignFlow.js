import { applyEffect, electionForecast, makeCheckpoint, restoreCheckpoint } from '../state/campaign.js';
import { panel, escapeHTML as esc, icon, choiceList, buttons } from './ui.js';
import { effectSummary, headquartersScreen, videoScreen, crisisScreen, debateScreen, finalPrepScreen, finalSpeechScreen, victoryText, defeatReasons } from '../data/flow.js';
import { recordMinigame } from '../state/minigames.js';
import { script, say } from '../data/script/index.js';
import { t } from '../i18n/index.js';
import { runMinigame } from '../minigames/runner.js';
import { ViralGame, RallyGame } from '../minigames/rhythm.js';
import { DuelGame } from '../minigames/duel.js';
import { ChairsGame } from '../minigames/chairs.js';
const screen = (game, s, done, minigame) => choiceScreen(game, s.eyebrow, s.title, s.intro, s.choices, done, minigame);

// Decision first (#flow-N, as before), then the minigame that plays it out. The choice and the minigame bonus are
// committed together when the minigame is accepted or skipped; abandoning in between restores the transaction.
function choiceScreen(game, eyebrow, title, intro, choices, done, minigame = null) {
  game.beginTransaction(); game.setMode('modal');
  // Effects are shown as stat chips, so the textual summary appended by data/flow.js is trimmed from the detail.
  const items = choices.map((c, i) => ({ id: `flow-${i}`, title: c.title, detail: c.detail.replace(` · ${effectSummary(c.effect)}.`, ''), effect: c.effect }));
  const wide = items.length > 3;
  game.ui.show(panel(eyebrow, title, `<p>${intro}</p>${choiceList(items, { className: wide ? 'two-col' : '' })}`, '', { icon: 'flag', className: wide ? 'panel-wide' : '' }));
  const commit = (c, result) => { applyEffect(game.state, c.effect); Object.assign(game.state.campaignChoices, { [c.key]: c.id }); if (result) recordMinigame(game.state, minigame.id, result); game.transaction = null; done(c); };
  choices.forEach((c, i) => game.ui.on(`flow-${i}`, () => {
    if (!minigame) { commit(c); return; }
    runMinigame(game, minigame.create(game, c), result => commit(c, result));
  }));
}

export function headquarters(game) {
  screen(game, headquartersScreen(game.state), ()=>game.complete('hqBrief'));
}
export function video(game) {
  screen(game, videoScreen(game.state), ()=>game.complete('video'), { id: 'viral', create: (g, c) => new ViralGame(g, c) });
}
export function crisis(game) {
  if (!game.state.checkpoint) makeCheckpoint(game.state);
  screen(game, crisisScreen(game.state, electionForecast(game.state)), ()=>game.complete('crisis'));
}
export function debate(game) {
  screen(game, debateScreen(game.state), ()=>game.complete('debate'), { id: 'duel', create: g => new DuelGame(g) });
}
export function finalPrep(game) {
  screen(game, finalPrepScreen(game.state, electionForecast(game.state)), ()=>game.complete('finalPrep'), { id: 'chairs', create: g => new ChairsGame(g) });
}
export function finalSpeech(game) {
  screen(game, finalSpeechScreen(game.state), ()=>game.complete('finalSpeech'), { id: 'rally', create: g => new RallyGame(g) });
}
export function results(game) {
  const f=electionForecast(game.state); game.state.result={score:f.score,won:f.winning};
  const meter = `<div class="score-meter" style="--v:${Math.max(0, Math.min(100, f.score))}%"><i></i><em title="${t('hud.threshold')}"></em><b><span>${f.score} / 100</span></b></div><div class="score-legend"><span>0</span><span>${t('results.scoreLegend')}</span><span>100</span></div>`;
  if (f.winning) {
    game.complete('election').then(()=>game.playCinematic('victory', ()=>{ game.setMode('modal'); game.ui.show(panel(say(script.endings.victory.eyebrow, game.state), say(script.endings.victory.title, game.state),`<div class="big-medal">${icon('trophy')}</div><p>${t('results.victory', { party: esc(game.state.party.name), score: f.score })}</p>${meter}<p>${esc(victoryText(game.state))}</p>` + buttons([{ id: 'credits-win', kind: 'primary', icon: 'star', label: t('results.credits') }, { id: 'menu-win', icon: 'home', label: t('results.menu') }]), '', { variant: 'win', icon: 'trophy' }), 'win'); game.ui.confetti(90); game.ui.on('credits-win',()=>game.credits()); game.ui.on('menu-win',()=>game.menu()); }));
  } else {
    game.safeSave(); game.playCinematic('defeat', ()=>defeat(game, f, meter));
  }
}
function defeat(game, f, meter) {
    game.setMode('modal');
    const reasons=defeatReasons(game.state,f.threshold);
    game.ui.show(panel(say(script.endings.defeat.eyebrow, game.state), say(script.endings.defeat.title, game.state),`<div class="big-medal">${icon('chair')}</div><p>${t('results.defeatScore', { score: f.score })}</p>${meter}<ul class="reasons">${reasons.map((r, i) => `<li style="--i:${i};--c:var(--tomato)">${icon('close')}<span>${esc(r)}</span></li>`).join('')}</ul><p class="fine">${t('results.defeatFine')}</p>` + buttons([{ id: 'retry-election', kind: 'primary', icon: 'retry', label: t('results.retry') }, { id: 'menu-loss', icon: 'home', label: t('results.menu') }]), '', { variant: 'loss', icon: 'ballot' }), 'loss');
    game.ui.on('retry-election',async()=>{ const restored=restoreCheckpoint(game.state); if(!restored)return; restored.checkpoint=structuredClone(restored); game.state=restored; game.safeSave(); await game.start(game.state); }); game.ui.on('menu-loss',()=>game.menu());
}
