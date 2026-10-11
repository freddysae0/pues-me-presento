// Capturas del feed de «unratito» para revisión visual (requiere `npm.cmd run dev` activo).
// node tools/feed-review.mjs → art/review/tiktok-*.png (1280×720, ventana pequeña y movimiento reducido).
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const URL = process.env.GAME_URL || 'http://127.0.0.1:5173';
await mkdir('art/review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const errors = [];
async function openPhone(options) {
  const page = await browser.newPage(options);
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL); await page.locator('#notice-enter').click(); await page.waitForFunction(() => !!window.gameDebug);
  await page.locator('#new').click(); await page.waitForFunction(() => document.body.dataset.mode === 'cinematic');
  await page.keyboard.press('Space'); await page.waitForFunction(() => document.body.dataset.mode === 'play');
  await page.evaluate(() => window.gameDebug.teleport('phone')); await page.waitForTimeout(150); await page.keyboard.press('KeyE');
  await page.locator('.feed-slide.active').waitFor();
  return page;
}
const index = page => page.evaluate(() => Number(document.querySelector('.feed').dataset.index));
try {
  const page = await openPhone({ viewport: { width: 1280, height: 720 } });
  const ids = await page.evaluate(() => [...document.querySelectorAll('.feed-slide')].map(s => s.dataset.video));
  for (let i = 0; i < ids.length; i++) {
    if (i === 1) { // mitad del segundo vídeo: el abuelo en pleno tobogán
      await page.waitForTimeout(1500);
    } else await page.waitForTimeout(900);
    await page.screenshot({ path: `art/review/tiktok-${i + 1}-${ids[i]}.png` });
    if (i < ids.length - 1) { await page.keyboard.press('ArrowDown'); await page.waitForTimeout(600); }
  }
  // Pausa: la barra de progreso no avanza.
  await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  await page.locator('#resume').click(); await page.waitForTimeout(50);
  assert.equal(await index(page), ids.length - 1);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'idea');
  await page.close();

  const small = await openPhone({ viewport: { width: 520, height: 480 } });
  await small.waitForTimeout(500); await small.screenshot({ path: 'art/review/tiktok-small-1.png' });
  for (let i = 0; i < 3; i++) { await small.keyboard.press('ArrowDown'); await small.waitForTimeout(550); }
  await small.screenshot({ path: 'art/review/tiktok-small-news.png' }); await small.close();

  const reduced = await openPhone({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  await reduced.keyboard.press('ArrowDown'); await reduced.waitForTimeout(300);
  await reduced.screenshot({ path: 'art/review/tiktok-reduced-abuelo.png' }); await reduced.close();
  assert.deepEqual(errors, []);
  console.log('capturas en art/review/tiktok-*.png');
} finally { await browser.close(); }
