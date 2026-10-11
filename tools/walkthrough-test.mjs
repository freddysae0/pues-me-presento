import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [], externalRequests = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('request', r => { if (!r.url().startsWith(process.env.WALK_URL || 'http://127.0.0.1:4173') && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) externalRequests.push(r.url()); });
const move = async (key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key); await page.waitForTimeout(80); };
// Public DOM only: body[data-mode] tells when an arrival cinematic is playing; Space skips it, X skips a minigame.
const skipCinema = async () => { await page.waitForFunction(() => document.body.dataset.mode === 'cinematic'); await page.keyboard.press('Space'); await page.waitForFunction(() => document.body.dataset.mode === 'play'); };
const skipMinigame = async () => { await page.locator('#mg-start').waitFor(); await page.keyboard.press('KeyX'); };
const interact = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(100); };
// Walked transitions: when the next mission is in another scene the HUD objective becomes the walk to the exit
// (.objective[data-mission="exit-<id>"]). Follow the route, wait for the door's prompt, E, and the next scene loads
// with the player at its entry (same spawn as before, so the routes after each arrival are unchanged).
// WALK_PROBE=1 with WALK_URL=http://127.0.0.1:5173 replays the route on the dev server and logs positions (needs debug).
const URL = process.env.WALK_URL || 'http://127.0.0.1:4173', PROBE = !!process.env.WALK_PROBE;
const where = async label => { if (PROBE) console.log('POS', label, JSON.stringify(await page.evaluate(() => window.gameDebug.metrics().player))); };
const exitBy = async (mission, route, prompt) => {
  await page.waitForFunction(id => document.querySelector('.objective')?.dataset.mission === `exit-${id}` && document.querySelector('#overlay').hidden && document.body.dataset.mode === 'play', mission);
  await where(`${mission} exit start`);
  for (const [key, ms] of route) await move(key, ms);
  await where(`${mission} exit end`);
  await page.waitForFunction(p => !document.querySelector('#interaction').hidden && document.querySelector('#interaction').textContent.includes(p), prompt, { timeout: 4000 });
  await interact();
  await page.waitForFunction(id => document.querySelector('.objective')?.dataset.mission === id && document.body.dataset.mode !== 'loading' && document.querySelector('#overlay').hidden, mission);
};
// Routes to the plaza's exits (yaw 0 on arrival: W +z, S -z, D +x, A -x; 3 m/s walking). Around the crowd, the bench
// by the camera mark, Paco and the terrace, then along z ≈ -8 to the portal beside the bar.
const AFTERMATH_TO_SEDE = [['KeyS', 4900], ['KeyD', 3850]];
const VIDEO_TO_SEDE = [['KeyD', 320], ['KeyS', 2170], ['KeyA', 650], ['KeyS', 2500], ['KeyD', 1150]];
try {
  await page.goto(URL);
  // Start-up notice with the keyboard: its button takes focus, Enter enters the menu.
  await page.locator('#notice-enter').waitFor(); await page.waitForFunction(() => document.activeElement?.id === 'notice-enter');
  await page.keyboard.press('Enter'); await page.locator('#new').click();
  await page.waitForFunction(() => !document.querySelector('#hud').hidden);
  if (!PROBE) assert.equal(await page.evaluate(() => typeof window.gameDebug), 'undefined'); await skipCinema();
  await move('KeyA', 1000); await move('KeyW', 650); await interact();
  // unratito: bajar por los vídeos con el teclado hasta la noticia, que es la que habilita #idea.
  await page.locator('.feed-slide.active').waitFor(); let videos = 0;
  while (await page.locator('#idea').isDisabled()) { await page.keyboard.press('ArrowDown'); await page.waitForTimeout(520); assert.ok(++videos <= 12, 'el feed no llega a la noticia'); }
  assert.ok(videos >= 3, 'faltan vídeos antes de la noticia');
  await page.locator('#idea').click();
  await move('KeyD', 1900); await move('KeyW', 850); await interact();
  for (let i = 0; i < 3; i++) { await page.locator('#job-0').click(); await page.locator('#next-friend').click(); }
  await page.locator('#finish-call').click(); await move('KeyD', 600); await interact(); await page.locator('button[type="submit"]').click();
  await move('KeyA', 1500); await move('KeyW', 750); await interact(); await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('EL BARRIO') && document.querySelector('#overlay').hidden); await skipCinema();
  await move('KeyA', 1150); await move('KeyW', 4000); await move('KeyA', 500); await interact(); await page.locator('#dialogue').waitFor({ state: 'visible' });
  for (let i = 0; i < 3; i++) await page.keyboard.press('Space'); await page.keyboard.press('Digit1');
  for (let i = 0; i < 4; i++) await page.keyboard.press('Space');
  await move('KeyD', 500); await move('KeyS', 3350); await move('KeyA', 550); await interact(); await page.locator('#proposal-shade').click();
  await move('KeyD', 700); await move('KeyW', 4000); await move('KeyD', 1000); await interact();
  await page.locator('#speech-0').click(); await page.locator('#speech-0').click(); await page.locator('#speech-0').click(); await page.waitForTimeout(620); await page.locator('#hit').click(); await page.locator('#finish-speech').click();
  await move('KeyA', 1200); await move('KeyS', 400); await interact(); for (let i = 0; i < 6; i++) await page.keyboard.press('Space');
  await exitBy('hqBrief', AFTERMATH_TO_SEDE, 'Portal');
  await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('La sede es mi salón') && document.querySelector('#overlay').hidden); await skipCinema();
  await move('KeyW', 1600); await interact(); await page.locator('#flow-0').click();
  await exitBy('video', [['KeyS', 1800]], 'Puerta');
  await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('Hazlo viral') && document.querySelector('#overlay').hidden); await move('KeyD',1300); await move('KeyW',2700); await move('KeyD',850); await move('KeyW',1700); await move('KeyA',300); await interact(); await page.locator('#flow-0').click(); await skipMinigame();
  await exitBy('crisis', VIDEO_TO_SEDE, 'Portal');
  await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('Eso no fue') && document.querySelector('#overlay').hidden); await move('KeyD',1900); await move('KeyW',2900); await interact(); await page.locator('#flow-0').click();
  await exitBy('debate', [['KeyS', 3200], ['KeyA', 1850]], 'Puerta');
  await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('debate') && document.querySelector('#overlay').hidden); await skipCinema(); await move('KeyW',2300); await interact(); await page.locator('#flow-0').click(); await skipMinigame();
  await exitBy('finalPrep', [['KeyS', 2500]], 'Puerta');
  await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('Última vuelta') && document.querySelector('#overlay').hidden); await move('KeyA',2000); await move('KeyW',300); await interact(); await page.locator('#flow-0').click(); await skipMinigame();
  await exitBy('finalSpeech', [['KeyA', 230], ['KeyS', 1650]], 'Parada');
  await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('último mitin') && document.querySelector('#overlay').hidden); await move('KeyA',2300); await move('KeyW',2600); await move('KeyD',1300); await interact(); await page.locator('#flow-0').click(); await skipMinigame();
  await page.waitForFunction(() => document.querySelector('#hud').textContent.includes('noche de las sillas') && document.querySelector('#overlay').hidden); await page.locator('#interaction').waitFor({state:'visible'}); await page.keyboard.press('KeyE');
  await page.waitForFunction(() => document.body.dataset.mode === 'cinematic'); await page.locator('#credits-win').waitFor({ timeout: 40000 });
  await page.screenshot({ path: 'artifacts/07-production-complete.png' });
  assert.deepEqual(errors, []); assert.deepEqual(externalRequests, []);
  console.log('PASS: production completed with WASD/E and public UI only (cinematics skipped with Space except the ending, minigames skipped with X); no debug API; no external requests; no console errors.');
} catch (e) { await page.screenshot({ path: 'artifacts/walkthrough-failure.png' }); console.error(await page.locator('#interaction').textContent(), errors); throw e; }
finally { await browser.close(); }
