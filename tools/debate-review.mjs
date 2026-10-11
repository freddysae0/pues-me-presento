// Capturas de revisión del debate con Fox (guion del juego: actual + B): cinemática del salón y ronda de Fox del duelo.
// Requiere el dev server (gameDebug). Uso: node tools/debate-review.mjs [baseUrl] → art/review/debate-fox-*.png
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:5173';
const out = 'art/review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
const shot = name => page.screenshot({ path: `${out}/debate-fox-${name}.png` });
const cine = () => page.evaluate(() => window.gameDebug.cinematic());
const mg = () => page.evaluate(() => window.gameDebug.minigame());
const waitCine = t => page.waitForFunction(t => (window.gameDebug.cinematic().time ?? -1) >= t, t, { timeout: 30000 });
try {
  await page.goto(base); await page.locator('#notice-enter').click();
  await page.waitForFunction(() => !!window.gameDebug); await page.locator('#new').waitFor(); await page.waitForTimeout(800);
  await page.evaluate(() => window.gameDebug.jumpTo('debate'));
  await page.waitForFunction(() => window.gameDebug.state().mission === 'debate');
  await page.waitForTimeout(800);
  const c = await cine(); console.log('cinematic', c);
  if (c.id === 'hall') {
    await waitCine(4.6); await shot('hall-1-wide');
    await waitCine(13.4); await shot('hall-2-rivalB');
    await waitCine(16.6); await shot('hall-3-fox');
    await page.waitForFunction(() => document.body.dataset.mode !== 'cinematic', null, { timeout: 30000 });
  } else console.log('hall cinematic did not play');
  console.log('entities', JSON.stringify(await page.evaluate(() => window.gameDebug.entities().filter(e => e.id === 'debateDesk'))));
  await page.evaluate(() => window.gameDebug.teleport('debateDesk')); await page.waitForTimeout(150); await page.keyboard.press('KeyE');
  await page.locator('#flow-0').click();
  await page.locator('#mg-start').click();
  await page.waitForTimeout(300);
  let shots = 0;
  for (let d = await mg(); d?.phase === 'play'; d = await mg()) {
    if (d.role === 'hard') {
      if (d.step === 'ask' && shots === 0) { await page.waitForTimeout(1200); await shot('duel-1-fox-asks'); shots = 1; continue; }
      if (d.interrupted && shots === 1) { await page.waitForTimeout(300); await shot('duel-2-fox-interrupts'); shots = 2; await page.keyboard.press('Space'); continue; }
      if (d.step === 'answer' && !d.interrupted && shots === 2) { await page.keyboard.press(`Digit${d.correct + 1}`); await page.waitForTimeout(700); await shot('duel-3-fox-reacts'); shots = 3; console.log('fox round', JSON.stringify(await mg())); continue; }
    } else {
      if (d.interrupted) await page.keyboard.press('Space'); else if (d.step === 'answer') await page.keyboard.press(`Digit${d.correct + 1}`);
    }
    await page.waitForTimeout(100);
  }
  await page.locator('#mg-accept').waitFor({ timeout: 15000 }); await shot('duel-4-result');
  console.log('duel', JSON.stringify((await page.evaluate(() => window.gameDebug.state())).minigames?.duel ?? null));
} finally {
  console.log('errors', errors);
  await browser.close();
}
