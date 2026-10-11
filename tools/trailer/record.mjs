// Graba un tráiler fotograma a fotograma (requiere `npm.cmd run dev` activo) y lo monta con assemble.mjs.
//   node tools/trailer/record.mjs [tools/trailer/sample.js] [--fps 30] [--out out/trailer] [--review art/review/trailer-sample]
//        [--only 16x9|1x1] [--no-assemble] [--keep-frames]
// Chrome headless a 1920×1080. El reloj de la página (performance.now, rAF, timers, animaciones CSS) es virtual
// (tools/trailer/vclock.js): cada fotograma avanza exactamente 1/fps aunque el render tarde lo que tarde.
// Si algún plano define `square`, se hace una segunda pasada con esas variantes para el 1:1.
import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { virtualClock } from './vclock.js';
import { assemble } from './assemble.mjs';

const args = process.argv.slice(2), opt = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const flag = name => args.includes(`--${name}`);
const valued = new Set(['fps', 'out', 'review', 'only', 'url']);
const file = args.find((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]?.replace(/^--/, ''))) || 'tools/trailer/sample.js';
const URL = opt('url') || process.env.GAME_URL || 'http://127.0.0.1:5173';
const OUT = opt('out') || 'out/trailer';
const module = '/' + relative(process.cwd(), resolve(file)).replaceAll('\\', '/');

async function checkServer() {
  try { const r = await fetch(`${URL}${module}`); if (!r.ok) throw new Error(`HTTP ${r.status} en ${module}`); }
  catch (e) { console.error(`No responde el servidor de desarrollo en ${URL} (${e.message}).\nArráncalo antes: npm.cmd run dev`); process.exit(1); }
}

async function record(variant, framesDir) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--hide-scrollbars'] });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.addInitScript(virtualClock, 7);
    await page.goto(URL);
    await page.locator('#notice-enter').click();
    await page.waitForFunction(() => !!window.gameDebug?.trailer && document.body.dataset.mode === 'menu', null, { timeout: 60000 });
    await page.mouse.move(1919, 1079); // sin hover sobre botones
    const plan = await page.evaluate(([m, v]) => window.gameDebug.trailer.load(m, { variant: v, record: true }), [module, variant]);
    const ms = 1000 / plan.fps, cdp = await page.context().newCDPSession(page);
    await page.evaluate(() => { window.__vclock.freeze(); window.gameDebug.trailer.start(); });
    await mkdir(framesDir, { recursive: true });
    let captured = 0, steps = 0, idle = 0; const t0 = Date.now();
    for (;;) {
      const st = await page.evaluate(ms => { window.__vclock.step(ms); return window.gameDebug.trailer.status(); }, ms);
      steps++;
      if (st.phase === 'error') throw new Error(`El tráiler falló en el plano ${st.id}: ${st.error}`);
      if (st.rendered) {
        if (st.rendered.frame !== captured) throw new Error(`Fotograma fuera de orden: esperado ${captured}, llega ${st.rendered.frame}`);
        const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        await writeFile(`${framesDir}/${String(captured).padStart(5, '0')}.png`, Buffer.from(data, 'base64'));
        captured++; idle = 0;
        if (captured % 30 === 0) process.stdout.write(`\r[${variant}] ${captured}/${plan.frames} fotogramas · plano ${st.id}   `);
      } else {
        if (st.phase === 'done') break;
        if (++idle > 3000) throw new Error(`Preparación atascada en el plano ${st.id}`);
        await new Promise(r => setTimeout(r, 4)); // deja respirar cargas reales (GLB, texturas) entre pasos virtuales
      }
    }
    process.stdout.write(`\r[${variant}] ${captured} fotogramas en ${((Date.now() - t0) / 1000).toFixed(1)} s (${steps} pasos)\n`);
    const timeline = await page.evaluate(() => window.gameDebug.trailer.timeline());
    const cues = await page.evaluate(() => window.gameDebug.trailer.cues());
    const wav = variant === '16x9' ? await page.evaluate(() => window.gameDebug.trailer.renderAudio()) : null;
    const pageErrors = await page.evaluate(() => window.__vclock.errors);
    if (captured !== plan.frames) throw new Error(`Se esperaban ${plan.frames} fotogramas y se grabaron ${captured}`);
    return { timeline, cues, wav, errors: [...errors, ...pageErrors] };
  } finally { await browser.close(); }
}

await checkServer();
await mkdir(OUT, { recursive: true });
const only = opt('only');
const main = await record('16x9', `${OUT}/frames`);
await writeFile(`${OUT}/timeline.json`, JSON.stringify({ ...main.timeline, cueList: main.cues }, null, 2));
await writeFile(`${OUT}/sfx.wav`, Buffer.from(main.wav, 'base64'));
console.log(`${main.cues.length} sonidos registrados → ${OUT}/sfx.wav`);
let squareFrames = null;
if (main.timeline.square && only !== '16x9') {
  const sq = await record('1x1', `${OUT}/frames-1x1`);
  squareFrames = `${OUT}/frames-1x1`;
  main.errors.push(...sq.errors);
}
if (main.errors.length) console.warn('Errores de página durante la grabación:\n  ' + main.errors.join('\n  '));
if (!flag('no-assemble')) {
  await assemble({ out: OUT, frames: `${OUT}/frames`, squareFrames, review: opt('review'), only });
  if (!flag('keep-frames')) { await rm(`${OUT}/frames`, { recursive: true, force: true }); if (squareFrames) await rm(squareFrames, { recursive: true, force: true }); }
}
