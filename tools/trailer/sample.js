// Tráiler de ejemplo (~11 s) para probar el motor: tarjeta de título, plaza con cámara en movimiento y Marisa
// saludando, feed del móvil con scroll y tarjeta final. Formato: docs/trailer/PIPELINE.md.
// Vista previa (dev, consola):  await gameDebug.trailer.play('/tools/trailer/sample.js')
// Grabación:                    npm.cmd run trailer            (o: node tools/trailer/record.mjs tools/trailer/sample.js)
const PARTY = { name: 'La Gente del Banco', slogan: 'Una cosa bien hecha, para empezar.', color: '#ff6b4f' };
const PLAZA_CRANE = { from: [[-6, 11, -14], [0, 2, 4]], to: [[-2, 9.5, -13], [0, 1.6, 5]], ease: 'linear', fov: 0.8 };

export default {
  title: 'sample',
  fps: 30,
  poster: 1.6, // segundos: fotograma que se guarda como poster.png
  music: [{ track: 'theme', at: 0, from: 0, gain: 0.75, fadeIn: 0.2, fadeOut: 1.4 }],
  shots: [
    {
      id: 'titulo', dur: 2.6,
      setup: { mission: 'neighbor', party: PARTY, warmup: 0.5 },
      camera: PLAZA_CRANE,
      look: { blur: 7, veil: '#fff7e6', veilOpacity: 0.45 },
      cards: [{ style: 'logo', at: 0.1, text: 'Un juego de sátira política.', exit: 0.3 }],
      in: 'fade', out: { kind: 'flash', dur: 2 / 30 },
    },
    {
      id: 'plaza-marisa', dur: 3.4, crop1x1: 0.42,
      setup: { mission: 'neighbor' },
      camera: { from: [[-2.9, 1.9, 3.6], [-5, 1.45, 6.7]], to: [[-3.6, 1.65, 4.6], [-5, 1.5, 6.7]], ease: 'inOut', fov: 0.78 },
      events: [
        { at: 0, act: [['Marisa', 'wave', 2.6]] },
        { at: 1.5, say: ['Marisa', '¡Anda, el del argumentario!', { speed: 30 }] },
      ],
      cards: [{ style: 'verb', at: 0.25, dur: 1.6, title: 'Baja a la calle.', pos: 'top-left', icon: 'pin' }],
      out: 'whip',
    },
    {
      id: 'feed', dur: 3.0,
      setup: { ui: 'feed', party: PARTY, warmup: 0.4 },
      zoom: [1, 1.06],
      events: [{ at: 0.5, key: 'ArrowDown' }, { at: 1.6, key: 'ArrowDown', sfx: 'whoosh' }, { at: 0.5, sfx: 'whoosh' }],
      cards: [{ style: 'small', at: 0.2, dur: 2.4, title: 'Un tiktok…', pos: [16, 24], size: '4.4vh' }],
      in: 'whip', out: 'fade',
    },
    {
      id: 'final', dur: 2.4, backdrop: '#fff7e6',
      setup: { keep: true, warmup: 0 },
      cards: [{ style: 'lines', at: 0.1, hold: true, lines: ['Pues me presento', { chips: ['Babylon.js', 'Blender', 'Vite'] }, { text: '¿Qué propuesta llevarías tú?', strong: true }] }],
      in: 'fade',
    },
  ],
};
