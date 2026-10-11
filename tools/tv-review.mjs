// Captura la tele del piso (intro) para revisar que apoya en el mueble. Requiere `npm.cmd run dev`.
import { chromium } from 'playwright';
const URL = process.env.GAME_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(URL); await page.locator('#notice-enter').waitFor(); await page.keyboard.press('Enter');
  await page.locator('#new').waitFor(); await page.click('#new');
  await page.waitForTimeout(6500); await page.screenshot({ path: 'art/review/tv-intro.png' });
} finally { await browser.close(); }
