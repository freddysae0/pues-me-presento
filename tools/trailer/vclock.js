// Reloj virtual para grabar el tráiler fotograma a fotograma (solo herramienta de desarrollo; no lo importa el juego).
// Se inyecta con page.addInitScript ANTES de que cargue la página. Hasta freeze() todo va en tiempo real
// (carga, aviso inicial, menú). Tras freeze():
//   - performance.now() / Date.now() devuelven un reloj que solo avanza con step(ms);
//   - requestAnimationFrame / setTimeout / setInterval creados después se ejecutan solo dentro de step();
//     los rAF que ya estaban pedidos en tiempo real se reencolan en el reloj virtual al dispararse;
//   - cada animación CSS/Web Animation (document.getAnimations(), incluye transiciones) se pausa y se le fija
//     currentTime = tiempo virtual transcurrido; al pasar su endTime se llama a finish() (dispara animationend).
// Math.random se siembra desde el principio para que las variaciones procedurales (fase de idles, confeti) se repitan.
// El orden dentro de step(): temporizadores vencidos → callbacks rAF (el juego simula y renderiza) → animaciones CSS.
export function virtualClock(seed = 1) {
  if (window.__vclock) return;
  let s = seed >>> 0;
  Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const perf = performance, realNow = perf.now.bind(perf), realDateNow = Date.now;
  const realRAF = window.requestAnimationFrame.bind(window), realCAF = window.cancelAnimationFrame.bind(window);
  const realST = window.setTimeout.bind(window), realCT = window.clearTimeout.bind(window), realSI = window.setInterval.bind(window), realCI = window.clearInterval.bind(window);
  const vc = { frozen: false, now: 0, dateBase: 0, frame: 0, raf: new Map(), realRaf: new Map(), timers: new Map(), anims: new WeakMap(), id: 1, errors: [] };
  perf.now = () => (vc.frozen ? vc.now : realNow());
  Date.now = () => (vc.frozen ? Math.round(vc.dateBase + vc.now) : realDateNow());
  window.requestAnimationFrame = cb => {
    const id = vc.id++;
    if (vc.frozen) { vc.raf.set(id, cb); return id; }
    vc.realRaf.set(id, realRAF(t => { if (!vc.realRaf.delete(id)) return; if (vc.frozen) vc.raf.set(id, cb); else cb(t); }));
    return id;
  };
  window.cancelAnimationFrame = id => { vc.raf.delete(id); const r = vc.realRaf.get(id); if (r !== undefined) { realCAF(r); vc.realRaf.delete(id); } };
  const VBASE = 2e9; // ids virtuales separados de los reales
  const virtualTimer = (fn, ms, args, repeat) => {
    const id = VBASE + vc.id++, delay = Math.max(0, Number(ms) || 0);
    vc.timers.set(id, { due: vc.now + delay, fn, args, repeat: repeat ? Math.max(1, delay) : 0 }); return id;
  };
  window.setTimeout = (fn, ms, ...args) => (vc.frozen ? virtualTimer(fn, ms, args, false) : realST(fn, ms, ...args));
  window.setInterval = (fn, ms, ...args) => (vc.frozen ? virtualTimer(fn, ms, args, true) : realSI(fn, ms, ...args));
  window.clearTimeout = id => { if (id >= VBASE) vc.timers.delete(id); else realCT(id); };
  window.clearInterval = id => { if (id >= VBASE) vc.timers.delete(id); else realCI(id); };
  const run = (fn, args) => { try { typeof fn === 'function' ? fn(...(args || [])) : (0, eval)(String(fn)); } catch (e) { vc.errors.push(String(e?.stack || e)); console.error(e); } };

  function syncAnimations(ms) {
    for (const a of document.getAnimations()) {
      let st = vc.anims.get(a);
      if (!st) { st = { t: 0 }; vc.anims.set(a, st); } else st.t += ms; // una animación nueva se ve en su primer fotograma
      if (a.playState === 'finished' || a.playState === 'idle') continue;
      const end = a.effect?.getComputedTiming().endTime;
      if (Number.isFinite(end) && st.t >= end) a.finish();
      else { if (a.playState !== 'paused') a.pause(); a.currentTime = st.t; }
    }
  }
  window.__vclock = {
    get frozen() { return vc.frozen; }, get now() { return vc.now; }, get frame() { return vc.frame; }, errors: vc.errors,
    freeze() {
      if (vc.frozen) return vc.now;
      vc.now = realNow(); vc.dateBase = realDateNow() - vc.now; vc.frozen = true;
      for (const a of document.getAnimations()) vc.anims.set(a, { t: Number(a.currentTime) || 0 }); // las que ya corrían siguen donde iban
      return vc.now;
    },
    /** Avanza el reloj `ms` milisegundos: temporizadores vencidos en orden, un fotograma rAF y las animaciones CSS. */
    step(ms) {
      if (!vc.frozen) throw new Error('vclock: freeze() antes de step()');
      const target = vc.now + ms;
      for (let guard = 0; guard < 10000; guard++) {
        let next = null;
        for (const [id, t] of vc.timers) if (t.due <= target && (!next || t.due < next[1].due || (t.due === next[1].due && id < next[0]))) next = [id, t];
        if (!next) break;
        const [id, t] = next; vc.now = Math.max(vc.now, t.due);
        if (t.repeat) t.due += t.repeat; else vc.timers.delete(id);
        run(t.fn, t.args);
      }
      vc.now = target;
      const callbacks = [...vc.raf.values()]; vc.raf.clear();
      for (const cb of callbacks) run(cb, [vc.now]);
      syncAnimations(ms); vc.frame++;
      return vc.frame;
    },
  };
}
