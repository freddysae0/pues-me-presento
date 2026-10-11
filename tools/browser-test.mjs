import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' }); // es-ES: the checks read Spanish text (src/i18n)
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error' || (m.type() === 'warning' && /AudioContext|autoplay/i.test(m.text()))) errors.push(m.text()); });
// Counts AudioContexts: none may exist before the start-up notice button (the first user gesture).
await page.addInitScript(() => { window.__audioContexts = 0; const A = window.AudioContext; window.AudioContext = class extends A { constructor(...a) { super(...a); window.__audioContexts++; } }; });
page.on('response', r => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
try {
  const state = () => page.evaluate(() => window.gameDebug.state());
  const mode = () => page.evaluate(() => document.body.dataset.mode);
  // Arrival cinematics (once per campaign): letterbox on, then Space skips to the safe point after them.
  const skipCinema = async () => {
    await page.waitForFunction(() => document.body.dataset.mode === 'cinematic');
    assert.ok(await page.evaluate(() => document.querySelector('#cinema').classList.contains('letterbox')));
    await page.keyboard.press('Space'); await page.waitForFunction(() => document.body.dataset.mode !== 'cinematic');
    assert.equal(await page.evaluate(() => document.querySelector('#cinema').classList.contains('letterbox')), false);
  };
  const minigame = () => page.evaluate(() => window.gameDebug.minigame());
  // Walked transitions: after a mission whose next step is in another scene, the player stays put with a pending exit
  // (HUD objective = travel title, beacon on, door answers E). Standing on the ring and pressing E loads the next scene.
  const exitVia = async (door, mission, scene) => {
    await page.waitForFunction(([m, d]) => { const s = window.gameDebug.state(); return s.mission === m && document.querySelector('#overlay').hidden && document.body.dataset.mode === 'play' && document.querySelector('.objective')?.dataset.mission === `exit-${m}`; }, [mission, door]);
    const from = (await state()).scene; assert.notEqual(from, scene, `${mission}: still in the old scene`);
    assert.ok(await page.evaluate(() => window.gameDebug.scene().getTransformNodeByName('exit-beacon').isEnabled()), `${mission}: exit beacon visible`);
    const pos = (await page.evaluate(() => window.gameDebug.entities())).find(e => e.id === door)?.position; assert.ok(pos, `exit ${door} exists in ${from}`);
    await page.evaluate(([x, z]) => window.gameDebug.teleport(x, z), [pos[0], pos[2]]); await page.waitForTimeout(150);
    assert.ok((await page.locator('#interaction').textContent()).length > 1 && !(await page.locator('#interaction').getAttribute('class') || '').includes('locked'), `${door}: prompt available`);
    await page.keyboard.press('KeyE');
    await page.waitForFunction(sc => window.gameDebug.state().scene === sc && document.querySelector('#overlay').hidden && document.body.dataset.mode !== 'loading', scene);
    assert.equal((await state()).mission, mission, 'crossing a door does not advance the mission');
  };
  await page.goto('http://127.0.0.1:5173');
  // Start-up notice: shown before the menu, button focused, no audio until it is pressed.
  await page.locator('#notice-enter').waitFor(); assert.equal(await mode(), 'notice');
  await page.waitForFunction(() => document.activeElement?.id === 'notice-enter');
  await page.waitForFunction(() => !!window.gameDebug); await page.waitForTimeout(300);
  assert.equal(await page.locator('#new').count(), 0, 'el menú no aparece antes del aviso');
  assert.equal(await page.evaluate(() => window.__audioContexts), 0, 'sin AudioContext antes del aviso');
  await page.screenshot({ path: 'artifacts/00-notice.png' });
  await page.locator('#notice-enter').click(); await page.locator('#new').waitFor();
  assert.equal(await page.evaluate(() => window.__audioContexts), 2, 'el botón del aviso crea los contextos de audio');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/01-menu.png' });
  await page.locator('#new').click(); await page.waitForFunction(() => !document.querySelector('#hud').hidden);
  await skipCinema(); assert.equal((await state()).seen.intro, true);
  await page.waitForTimeout(500); await page.screenshot({ path: 'artifacts/02-flat.png' });
  const teleport = async id => { await page.evaluate(id => window.gameDebug.teleport(id), id); await page.waitForTimeout(120); await page.keyboard.press('KeyE'); };
  // unratito: al menos tres vídeos antes de la noticia; rueda, arrastre y teclado; #idea solo en la noticia.
  await teleport('phone'); await page.locator('.feed-slide.active').waitFor();
  const feedIndex = () => page.evaluate(() => Number(document.querySelector('.feed').dataset.index));
  const waitIndex = i => page.waitForFunction(i => document.querySelector('.feed')?.dataset.index === String(i), i);
  const progress = () => page.evaluate(() => Number(document.querySelector('.feed-slide.active').style.getPropertyValue('--p')));
  const slides = await page.evaluate(() => [...document.querySelectorAll('.feed-slide')].map(s => s.dataset.video));
  assert.ok(slides.length >= 4); assert.equal(slides.at(-1), 'news');
  assert.equal(await page.locator('#idea').isDisabled(), true);
  await page.mouse.move(720, 450); await page.mouse.wheel(0, 240); await waitIndex(1);
  await page.screenshot({ path: 'artifacts/02b-feed.png' });
  // Pausa: la barra de progreso del vídeo no avanza.
  await page.waitForTimeout(500); const before = await progress(); await page.keyboard.press('Escape'); await page.waitForTimeout(700); await page.locator('#resume').click();
  assert.ok(await progress() - before < 0.05, 'el progreso del vídeo avanzó en pausa');
  await page.waitForTimeout(450); const box = await page.locator('.feed').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * .7); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2, box.y + box.height * .25, { steps: 8 }); await page.mouse.up(); await waitIndex(2);
  await page.waitForTimeout(450); await page.keyboard.press('ArrowUp'); await waitIndex(1);
  await page.waitForTimeout(450); await page.keyboard.press('ArrowDown'); await waitIndex(2);
  await page.waitForTimeout(450); await page.keyboard.press('Space'); await waitIndex(3);
  await page.waitForTimeout(450); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(200); assert.equal(await feedIndex(), 3);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'idea');
  await page.locator('#idea').click(); assert.equal((await state()).mission, 'call');
  await teleport('laptop'); await page.screenshot({ path: 'artifacts/03-call.png' });
  for (let i = 0; i < 3; i++) { await page.locator('#job-0').click(); await page.locator('#next-friend').click(); }
  await page.locator('#finish-call').click(); assert.equal((await state()).mission, 'register');
  await teleport('folder'); await page.locator('#party-name').fill('El Partido de las Sillas'); await page.locator('button[type="submit"]').click();
  await teleport('door'); await page.waitForFunction(() => window.gameDebug.state().scene === 'plaza' && document.querySelector('#overlay').hidden);
  // Pause freezes the cinematic clock; then skip it.
  await page.waitForFunction(() => window.gameDebug.cinematic().time > 1); await page.keyboard.press('Escape');
  const frozen = (await page.evaluate(() => window.gameDebug.cinematic())).time; await page.waitForTimeout(400);
  assert.equal((await page.evaluate(() => window.gameDebug.cinematic())).time, frozen); await page.locator('#resume').click();
  assert.equal(await mode(), 'cinematic'); await skipCinema();
  await page.waitForTimeout(500); await page.screenshot({ path: 'artifacts/04-plaza.png' });
  await teleport('marisa');
  await page.keyboard.press('Space'); await page.keyboard.press('Space'); await page.keyboard.press('Space');
  await page.screenshot({ path: 'artifacts/05-dialogue.png' });
  await page.keyboard.press('Digit1');
  for (let i = 0; i < 4; i++) await page.keyboard.press('Space');
  assert.equal((await state()).mission, 'program');
  await teleport('board'); await page.locator('#proposal-shade').click();
  await teleport('podium'); await page.locator('#speech-0').click(); await page.locator('#speech-0').click(); await page.locator('#speech-0').click();
  await page.keyboard.press('Escape'); const paused = await state(); await page.waitForTimeout(250); assert.equal((await state()).activeSeconds, paused.activeSeconds); await page.locator('#resume').click();
  await page.waitForTimeout(620); await page.locator('#hit').click(); await page.screenshot({ path: 'artifacts/06-speech.png' });
  await page.locator('#finish-speech').click(); await teleport('marisa');
  for (let i = 0; i < 6; i++) await page.keyboard.press('Space');
  await exitVia('sedeDoor', 'hqBrief', 'hq');
  await skipCinema(); assert.equal((await state()).seen.hq, true); await teleport('planning'); await page.locator('#flow-0').click();
  await exitVia('hqDoor', 'video', 'plaza'); await teleport('cameraSpot'); await page.locator('#flow-0').click();
  // «Hazlo viral»: play the take with the keyboard, hitting each note on time.
  await page.locator('#mg-start').click();
  for (let d = await minigame(); d?.phase === 'play'; d = await minigame()) {
    if (d.next && d.next.in < 0.03 && d.next.in > -0.15) { await page.keyboard.press(d.next.code); await page.waitForTimeout(40); } else await page.waitForTimeout(d.next && d.next.in < 0.2 ? 5 : 25);
  }
  await page.screenshot({ path: 'artifacts/08-viral.png' }); await page.locator('#mg-accept').click();
  const viral = (await state()).minigames.viral; assert.ok(viral.bonus.reach >= 7, `viral take too weak: ${JSON.stringify(viral)}`);
  await exitVia('sedeDoor', 'crisis', 'hq'); assert.equal(await mode(), 'play', 'the sede cinematic plays once'); await teleport('crisisBoard'); await page.locator('#flow-0').click();
  await exitVia('hqDoor', 'debate', 'hall'); await skipCinema(); await teleport('debateDesk'); await page.locator('#flow-0').click();
  // Debate duel: answer every round with the concrete reply, asking for the floor when interrupted.
  // Five rounds: the script's four plus Fox's (role 'hard', spoken from Rival C's lectern) to close.
  await page.locator('#mg-start').click();
  const duelRoles = [];
  for (let d = await minigame(); d?.phase === 'play'; d = await minigame()) {
    assert.equal(d.rounds, 5, 'duel has five rounds with Fox'); if (d.role) duelRoles[d.round] = `${d.role}:${d.actor}`;
    if (d.interrupted) await page.keyboard.press('Space'); else if (d.step === 'answer') await page.keyboard.press(`Digit${d.correct + 1}`);
    await page.waitForTimeout(120);
  }
  assert.equal(duelRoles[4], 'hard:Rival C', `Fox closes the duel (${duelRoles})`);
  await page.locator('#mg-accept').click(); assert.ok((await state()).minigames.duel.score >= 8);
  await exitVia('hallDoor', 'finalPrep', 'plaza'); await teleport('finalBoard'); await page.locator('#flow-0').click();
  // Seis sillas: carry the six chairs to the circle (teleport stands in for walking).
  await page.locator('#mg-start').click();
  for (let i = 0; i < 6; i++) { const d = await minigame(); const goTo = ([x, z]) => page.evaluate(([x, z]) => window.gameDebug.teleport(x, z), [x, z]); await goTo(d.chairs[0]); await page.waitForTimeout(150); await goTo(d.zone); await page.waitForTimeout(150); }
  await page.locator('#mg-accept').click(); assert.equal((await state()).minigames.chairs.score, 6);
  await exitVia('busStop', 'finalSpeech', 'hall'); await teleport('finalPodium'); await page.locator('#flow-0').click();
  // Final rally skipped: the decision still counts, the minigame adds nothing.
  await page.locator('#mg-skip').click(); assert.deepEqual((await state()).minigames.rally, { score: 0, bonus: {}, skipped: true });
  await page.waitForFunction(() => window.gameDebug.state().mission === 'election' && document.querySelector('#overlay').hidden); await page.evaluate(()=>window.gameDebug.simulateElection('defeat')); await teleport('results');
  await skipCinema(); await page.locator('#retry-election').waitFor();
  await page.locator('#retry-election').click(); await page.waitForFunction(() => window.gameDebug.state().mission === 'crisis' && document.querySelector('#overlay').hidden);
  assert.equal((await state()).scene, 'hq', 'the retry restores the crisis in the sede');
  await teleport('crisisBoard'); await page.locator('#flow-0').click(); await exitVia('hqDoor', 'debate', 'hall');
  assert.equal(await mode(), 'play', 'the hall cinematic is not replayed after the retry');
  await teleport('debateDesk'); await page.locator('#flow-0').click(); await page.locator('#mg-start').waitFor(); await page.keyboard.press('KeyX'); await exitVia('hallDoor', 'finalPrep', 'plaza');
  await teleport('finalBoard'); await page.locator('#flow-0').click(); await page.locator('#mg-skip').click(); await exitVia('busStop', 'finalSpeech', 'hall');
  await teleport('finalPodium'); await page.locator('#flow-0').click(); await page.locator('#mg-skip').click(); await page.waitForFunction(() => window.gameDebug.state().mission === 'election' && document.querySelector('#overlay').hidden);
  await page.evaluate(()=>window.gameDebug.simulateElection('victory')); await teleport('results'); await skipCinema(); await page.locator('#credits-win').waitFor();
  assert.equal((await state()).mission, 'complete'); await page.locator('#menu-win').click(); await page.locator('#continue').waitFor();
  assert.equal(await page.locator('#notice-enter').count(), 0, 'volver al menú no repite el aviso'); await page.locator('#continue').click();
  await page.waitForFunction(() => document.querySelector('#overlay').hidden); assert.equal((await state()).mission, 'complete');
  const metrics = await page.evaluate(() => window.gameDebug.metrics());
  assert.equal(metrics.assets.podium, 'GLB'); assert.deepEqual(Object.entries(metrics.assets).filter(([, v]) => v !== 'GLB'), []);
  console.log(JSON.stringify({ completed: (await state()).mission, metrics, errors }, null, 2));
  assert.deepEqual(errors, []);
} catch (error) { await page.screenshot({ path: 'artifacts/failure.png' }); console.error('Browser errors:', errors); throw error; }
finally { await browser.close(); }
