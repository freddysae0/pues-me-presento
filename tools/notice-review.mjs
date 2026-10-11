// Capturas del aviso inicial (antes del menú) para revisión visual. Requiere `npm.cmd run dev` (o GAME_URL).
// node tools/notice-review.mjs → art/review/aviso-inicial.png (1440×900) y aviso-inicial-small.png (520×480).
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const URL = process.env.GAME_URL || 'http://127.0.0.1:5173';
await mkdir('art/review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const errors = [];
try {
  for (const [viewport, file] of [[{ width: 1440, height: 900 }, 'aviso-inicial.png'], [{ width: 520, height: 480 }, 'aviso-inicial-small.png']]) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(URL); await page.locator('#notice-enter').waitFor();
    await page.waitForFunction(() => document.activeElement?.id === 'notice-enter'); await page.waitForTimeout(900); // pop-in done
    await page.screenshot({ path: `art/review/${file}` });
    const scroll = await page.evaluate(() => { const p = document.querySelector('.panel-notice'); return p.scrollHeight - p.clientHeight; });
    console.log(file, viewport, 'desbordamiento vertical del panel:', scroll, 'px');
    await page.keyboard.press('Enter'); await page.locator('#new').waitFor(); await page.close();
  }
  assert.deepEqual(errors, []);
  console.log('capturas en art/review/aviso-inicial*.png');
} finally { await browser.close(); }
