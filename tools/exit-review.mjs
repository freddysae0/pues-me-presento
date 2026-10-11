// Review captures of the walked exits (one per transition) → art/review/salida-*.png. Needs `npm.cmd run dev`.
// Each shot: state right after the previous mission (gameDebug.jumpToExit), player a few metres from the exit, camera turned
// slightly so the player does not hide it, so the beacon (ring, chevrons, signpost), the floating marker and the HUD objective are visible.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const SHOTS = [
  ['salida-1-plaza-a-sede', 'hqBrief', [5.0, -11.0], 0.42],
  ['salida-2-sede-a-plaza', 'video', [1.2, -1.0], 2.75],
  ['salida-3-plaza-a-sede-crisis', 'crisis', [4.6, -5.4], 1.85],
  ['salida-4-sede-a-salon', 'debate', [2.5, -2.5], -2.95],
  ['salida-5-salon-a-plaza', 'finalPrep', [0.6, -2.0], 2.85],
  ['salida-6-plaza-a-salon-bus', 'finalSpeech', [-3.5, -12.2], -1.24],
];
await mkdir('art/review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
try {
  await page.goto('http://127.0.0.1:5173');
  await page.locator('#notice-enter').click(); await page.locator('#new').waitFor(); await page.waitForFunction(() => !!window.gameDebug);
  for (const [name, mission, [x, z], yaw] of SHOTS) {
    if (!await page.evaluate(m => window.gameDebug.jumpToExit(m), mission)) throw new Error(`${mission}: no walked exit`);
    await page.waitForFunction(m => document.body.dataset.mode === 'play' && document.querySelector('#overlay').hidden && document.querySelector('.objective')?.dataset.mission === `exit-${m}`, mission);
    await page.evaluate(([x, z, yaw]) => { window.gameDebug.teleport(x, z); window.gameDebug.camera(yaw, 0.3); }, [x, z, yaw]);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `art/review/${name}.png` }); console.log(`art/review/${name}.png`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
} finally { await browser.close(); }
