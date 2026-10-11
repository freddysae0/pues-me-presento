import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
const state = () => page.evaluate(() => window.gameDebug.state());
const mode = () => page.evaluate(() => document.body.dataset.mode);
const skipCinema = async () => { await page.waitForFunction(() => document.body.dataset.mode === 'cinematic'); await page.keyboard.press('Space'); await page.waitForFunction(() => document.body.dataset.mode !== 'cinematic'); };
const enter = async () => { await page.locator('#notice-enter').click(); await page.locator('#new').waitFor(); }; // start-up notice, every app launch/reload
const teleport = async (id, z) => { await page.evaluate(([id, z]) => window.gameDebug.teleport(id, z), [id, z]); await page.waitForTimeout(100); };
try {
  await page.goto('http://127.0.0.1:5173'); await enter(); await page.waitForFunction(() => !!window.gameDebug); await page.locator('#new').click(); await page.waitForFunction(() => !document.querySelector('#hud').hidden); await skipCinema();
  await teleport(0, -5.8); const cameraDistance = await page.evaluate(() => window.gameDebug.metrics().cameraDistance); assert.ok(cameraDistance < 3, `camera must retract near wall: ${cameraDistance}`);
  await page.keyboard.down('KeyS'); await page.waitForTimeout(1200); await page.keyboard.up('KeyS');
  // Camera must remain retracted when the body meets the wall.
  assert.ok((await page.evaluate(() => window.gameDebug.metrics().cameraDistance)) < 2);
  await page.evaluate(() => window.gameDebug.loadChapter(3));
  // Cinematic interrupted: pause freezes it, a reload in the middle resumes after it (seen, saved, same progress).
  await page.waitForFunction(() => window.gameDebug.cinematic().time > 1.5); await page.keyboard.press('Escape');
  const t = (await page.evaluate(() => window.gameDebug.cinematic())).time; await page.waitForTimeout(400);
  assert.equal((await page.evaluate(() => window.gameDebug.cinematic())).time, t); await page.locator('#resume').click();
  await page.reload(); await enter(); await page.locator('#continue').click(); await page.waitForFunction(() => document.querySelector('#overlay').hidden);
  assert.equal(await mode(), 'play'); assert.equal((await state()).seen.plaza, true); assert.equal((await state()).mission, 'neighbor');
  await teleport('marisa'); await page.keyboard.press('KeyE');
  await page.keyboard.press('Space'); await page.keyboard.press('Space'); await page.keyboard.press('Space'); await page.keyboard.press('Digit2');
  assert.equal((await state()).memories.promisedBoth, true);
  await page.keyboard.press('Escape'); await page.locator('#save-menu').click(); await page.locator('#continue').click(); await page.waitForFunction(() => document.querySelector('#overlay').hidden);
  assert.equal((await state()).memories.promisedBoth, undefined); assert.equal((await state()).mission, 'neighbor');
  await teleport('marisa'); await page.keyboard.press('KeyE'); await page.keyboard.press('Space'); await page.keyboard.press('Space'); await page.keyboard.press('Space'); await page.keyboard.press('Digit2');
  for (let i = 0; i < 4; i++) await page.keyboard.press('Space');
  assert.equal((await state()).memories.promisedBoth, true);
  await page.reload(); await enter(); await page.locator('#continue').click(); await page.waitForFunction(() => document.querySelector('#overlay').hidden); assert.equal((await state()).memories.promisedBoth, true);
  await teleport('board'); await page.keyboard.press('KeyE'); await page.locator('#proposal-shade').click();
  await teleport('podium'); await page.keyboard.press('KeyE'); await page.locator('#speech-2').click(); await page.locator('#speech-3').click(); await page.locator('#speech-2').click(); await page.locator('#hit').click();
  assert.equal((await state()).speech.coherent, false); await page.locator('#finish-speech').click();
  await page.reload(); await enter(); await page.locator('#continue').click(); await page.waitForFunction(() => document.querySelector('#overlay').hidden); assert.equal((await state()).mission, 'aftermath'); assert.equal((await state()).speech.coherent, false);
  // Minigame abandoned halfway: nothing is applied; a retry then a skip commits only the decision, once.
  await page.evaluate(() => window.gameDebug.jumpTo('video')); await page.waitForFunction(() => document.querySelector('#overlay').hidden);
  const before = await state(); await page.keyboard.press('KeyE'); await page.locator('#flow-0').click(); await page.locator('#mg-start').click();
  await page.waitForTimeout(2500); await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Escape'); await page.locator('#save-menu').click(); await page.locator('#continue').click();
  await page.waitForFunction(() => document.querySelector('#overlay').hidden);
  assert.equal((await state()).mission, 'video'); assert.equal((await state()).reach, before.reach); assert.equal((await state()).minigames.viral, undefined);
  await teleport('cameraSpot'); await page.keyboard.press('KeyE'); await page.locator('#flow-0').click(); await page.locator('#mg-start').click(); await page.waitForTimeout(800);
  await page.keyboard.press('KeyR'); await page.waitForTimeout(300); await page.keyboard.press('KeyX');
  await page.waitForFunction(() => window.gameDebug.state().mission === 'crisis');
  assert.deepEqual((await state()).minigames.viral, { score: 0, bonus: {}, skipped: true });
  // Walked transition interrupted: «ve a la sede» is pending in the plaza. Pause shows it; a reload brings the player
  // back to the plaza's safe entry with the same progress and the exit still pending; crossing then loads the sede.
  await page.waitForFunction(() => document.querySelector('#overlay').hidden && document.body.dataset.mode === 'play');
  const atDoor = await state(); assert.equal(atDoor.scene, 'plaza'); assert.equal(atDoor.mission, 'crisis');
  await page.keyboard.press('Escape'); assert.ok((await page.locator('.journal').textContent()).includes('portal'), 'pause journal shows the walk to the exit');
  await page.locator('#save-menu').click(); await page.locator('#continue').click(); await page.waitForFunction(() => document.querySelector('#overlay').hidden && document.body.dataset.mode === 'play');
  assert.equal((await state()).scene, 'plaza');
  await page.evaluate(() => window.gameDebug.teleport(-3, 5)); await page.reload(); await enter(); await page.locator('#continue').click();
  await page.waitForFunction(() => document.querySelector('#overlay').hidden && document.body.dataset.mode === 'play');
  const reloaded = await state(); assert.equal(reloaded.scene, 'plaza'); assert.equal(reloaded.mission, 'crisis'); assert.deepEqual(reloaded.completed, atDoor.completed);
  assert.equal(reloaded.reach, atDoor.reach); assert.equal(reloaded.support, atDoor.support);
  const spawn = await page.evaluate(() => window.gameDebug.metrics().player); assert.ok(Math.abs(spawn[0]) < 0.2 && Math.abs(spawn[2] + 7) < 0.2, `reload at the plaza entry: ${spawn}`);
  assert.equal(await page.evaluate(() => document.querySelector('.objective').dataset.mission), 'exit-crisis');
  await page.keyboard.press('KeyE'); await page.waitForTimeout(200); assert.equal((await state()).scene, 'plaza', 'E far from the door does nothing');
  const door = (await page.evaluate(() => window.gameDebug.entities())).find(e => e.id === 'sedeDoor').position;
  await page.evaluate(([x, z]) => window.gameDebug.teleport(x, z), [door[0], door[2]]); await page.waitForTimeout(150); await page.keyboard.press('KeyE');
  await page.waitForFunction(() => window.gameDebug.state().scene === 'hq' && document.querySelector('#overlay').hidden && document.body.dataset.mode === 'play');
  await page.reload(); await enter(); await page.locator('#continue').click(); await page.waitForFunction(() => document.querySelector('#overlay').hidden);
  assert.equal((await state()).scene, 'hq'); assert.equal((await state()).mission, 'crisis'); assert.deepEqual((await state()).completed, atDoor.completed);
  await page.evaluate(() => localStorage.setItem('pues-me-presento.campaign.v1', '{invalid')); await page.reload(); await enter(); assert.equal(await page.locator('#continue').isDisabled(), true); assert.ok((await page.locator('#overlay').textContent()).includes('No se pudo leer'));
  assert.deepEqual(errors, []); console.log('PASS: camera retraction, wall contact, interrupted dialogue rollback, cinematic pause/reload, minigame abandon/retry/skip, pause/reload at a pending exit, persistent memory, bad speech, reload and corrupt-save recovery.');
} finally { await browser.close(); }
