// Desktop smoke test: launches the real Electron shell on dist/ (run `npm.cmd run build` first).
// Checks isolation, local assets over app://, blocked network, a short keyboard session, and saves surviving a restart.
import { _electron as electron } from 'playwright';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { newCampaign, advance, appoint, chooseProposal, finishSpeech, crossExit } from '../src/state/campaign.js';
import { friends } from '../src/data/campaign.js';
import { SAVE_KEY } from '../src/save/persistence.js';

// A save written right after «El barrio toma nota»: the sede is next, its exit (the portal by the bar) still pending.
function atSedeDoor() {
  const s = newCampaign();
  while (s.mission !== 'hqBrief') {
    const id = s.mission;
    if (id === 'call') friends.forEach(f => appoint(s, f.id, 0));
    if (id === 'register') s.party = { name: 'Partido de escritorio', slogan: 'Una cosa bien hecha.', color: '#42877c' };
    if (id === 'program') chooseProposal(s, 'shade');
    if (id === 'speech') finishSpeech(s, ['listen', 'shade', 'accountable'], 1);
    advance(s, id); if (s.mission !== 'hqBrief') crossExit(s);
  }
  s.seen = { intro: true, plaza: true }; return s;
}
const enterNotice = async page => { await page.locator('#notice-enter').waitFor({ timeout: 60000 }); await page.waitForFunction(() => document.activeElement?.id === 'notice-enter'); await page.keyboard.press('Enter'); await page.locator('#new').waitFor({ timeout: 60000 }); };
const hold = async (page, key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key); await page.waitForTimeout(80); };

const profile = await mkdtemp(path.join(tmpdir(), 'pmp-desktop-')); // throwaway user data, never the real saves
await mkdir('artifacts', { recursive: true });
const launch = async () => {
  const app = await electron.launch({ args: ['.', `--user-data-dir=${profile}`] });
  const page = await app.firstWindow(); const errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.locator('#notice-enter').waitFor({ timeout: 60000 }); // start-up notice, every launch: entered with the keyboard
  await page.waitForFunction(() => document.activeElement?.id === 'notice-enter'); await page.keyboard.press('Enter');
  await page.locator('#new').waitFor({ timeout: 60000 });
  return { app, page, errors };
};
try {
  let { app, page, errors } = await launch();
  assert.equal(await page.evaluate(() => location.href), 'app://game/index.html');
  assert.deepEqual(await page.evaluate(() => [typeof require, typeof process, typeof window.gameDebug]), ['undefined', 'undefined', 'undefined']);
  const assets = await page.evaluate(async () => Promise.all(['./assets/music/mus_theme_01.mp3', './assets/prop_bench_01.glb'].map(async u => (await fetch(u)).status)));
  assert.deepEqual(assets, [200, 200]);
  assert.equal(await page.evaluate(() => fetch('https://example.com').then(() => 'reached', () => 'blocked')), 'blocked');
  errors.length = 0; // the probe above logs its own ERR_BLOCKED_BY_CLIENT
  await page.locator('#new').click(); await page.waitForFunction(() => !document.querySelector('#hud').hidden, null, { timeout: 60000 });
  if (await page.evaluate(() => document.body.dataset.mode) === 'cinematic') await page.keyboard.press('Space');
  await page.waitForFunction(() => document.body.dataset.mode === 'play');
  await page.keyboard.down('KeyW'); await page.waitForTimeout(800); await page.keyboard.up('KeyW');
  await page.screenshot({ path: 'artifacts/desktop-play.png' });
  assert.deepEqual(errors, []); await app.close();

  ({ app, page, errors } = await launch());
  assert.equal(await page.locator('#continue').isDisabled(), false, 'el guardado sobrevive al reinicio');
  // Walked exit on desktop: a save at the plaza with the sede's door pending resumes at the plaza entry; walking to
  // the portal and pressing E loads the sede (its arrival cinematic, skipped), and that survives another restart.
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [SAVE_KEY, JSON.stringify(atSedeDoor())]);
  await page.reload(); await enterNotice(page); await page.locator('#continue').click();
  await page.waitForFunction(() => document.body.dataset.mode === 'play' && document.querySelector('.objective')?.dataset.mission === 'exit-hqBrief', null, { timeout: 60000 });
  await hold(page, 'KeyD', 2650); await hold(page, 'KeyS', 330);
  await page.waitForFunction(() => !document.querySelector('#interaction').hidden && document.querySelector('#interaction').textContent.includes('Portal'), null, { timeout: 5000 });
  await page.screenshot({ path: 'artifacts/desktop-exit.png' }); await page.keyboard.press('KeyE');
  await page.waitForFunction(() => document.body.dataset.mode === 'cinematic', null, { timeout: 60000 }); await page.keyboard.press('Space');
  await page.waitForFunction(() => document.body.dataset.mode === 'play' && document.querySelector('.objective')?.dataset.mission === 'hqBrief');
  assert.deepEqual(errors, []); await app.close();

  ({ app, page, errors } = await launch());
  const saved = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), SAVE_KEY);
  assert.deepEqual([saved.scene, saved.mission, saved.seen.hq], ['hq', 'hqBrief', true], 'cruzar la puerta queda guardado');
  assert.deepEqual(errors, []); await app.close();
  console.log('PASS: Electron on app://, no Node in renderer, local assets, network blocked, play mode reached, save survives restart, walked exit to the sede by keyboard and saved across a restart, no console errors.');
} finally { await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }).catch(() => {}); } // Electron may hold files a moment after close
