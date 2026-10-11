// Borrador declarativo del tráiler LinkedIn. NO lo importa el juego: es material para el agente que construye el
// modo «trailer» (dev). Fuente de verdad creativa: docs/trailer/STORYBOARD.md (si discrepan, manda el .md).
//
// Convenciones (inspiradas en src/data/cinematics.js para que el director pueda reutilizarse):
//   dur            segundos del plano (el tráiler avanza con dt fijo 1/60)
//   setup          cómo llegar al estado: { via: 'reset'|'jumpTo'|'jumpToExit', mission, patch?, after?: [pasos] }
//                  `patch` se aplica sobre game.state antes de game.start(); `after` son pasos que el modo trailer
//                  debe implementar (abrir feed, arrancar minijuego, saltar a ronda…). Nombres orientativos.
//   player         { pos: [x,y,z], rotY, walkTo?: [x,z] }  (rotY en radianes; π mira -Z)
//   camera         [{ dur, from: [[pos],[look]], to: [[pos],[look]], fov? }]  coordenadas reales del mundo
//                  'ui' = sin cámara 3D propia (la UI ocupa el plano); `zoom` = push digital [inicio, fin]
//   act            [{ at, name, state, dur }]  name: NPC de world.js o 'Tú'; state: gesto/estado verificado
//   text           [{ at, dur, kind: 'card'|'cardSmall'|'sub'|'bubble'|'tag'|'sticker'|'logo'|'credits', ... }]
//   ui             qué capas del juego se ven: { hud:false, devPanel:false, skipHint:false, marker:false, letterbox:false, game:[...] }
//   fx             [{ at, kind: 'confetti'|'banner'|'flash'|'blackout'|'fadeWhite'|'reaction'|'label', ... }]
//   sfx            [{ at, kind }]  (opcional; ver §5 del storyboard)
//   transition     cómo sale del plano
//   square         1:1 → { cx } recorte del máster centrado en x (px de 1920) | { repass: true, note } nueva pasada 1080×1080

const PI = Math.PI;

export const trailerSetup = {
  resolution: [1920, 1080], fps: 60, squareResolution: [1080, 1080],
  // stateAt() pone «Partido de prueba»: sobrescribir siempre y llamar a world.setIdentity(party).
  party: { name: 'La Gente del Banco', slogan: 'Una cosa bien hecha, para empezar.', color: '#ff6b4f' },
  hideAlways: ['devPanel', 'hud', 'skipHint', 'marker', 'directorLetterbox', 'controlsCheatsheet', 'phoneButton'],
  palette: { ink: '#2b2140', paper: '#fff7e6', sun: '#ffc83d', tomato: '#ff6b4f', grass: '#5cc46e', sky: '#58b8f0' },
  fonts: { display: 'Fredoka', body: 'Nunito' }, // locales: src/ui/fonts/
  gestureLead: 0.3, // los clips reaccionan con 0–0,4 s de retraso: los `at` ya van adelantados
};

export const music = [
  { at: 0, track: null, note: 'Solo loops del feed (feedLoops.js: pasodoble → trap → news)' },
  { at: 4.5, track: 'theme', from: 0, attack: 0, note: 'mus_theme_01.mp3 (192 kbps): lecho principal' },
  { at: 27.0, track: 'trend', from: 16, fadeOthers: 0.15, note: 'mus_trend_01.mp3, 96 BPM. Elegir el compás de estribillo a oído; 16 s es un candidato' },
  { at: 32.0, track: 'theme', continuous: true, note: 'retoma en continuidad (sonaba silenciado por debajo)' },
  { at: 54.5, sync: 'theme onset', note: 'ajustar el offset del tema para que un golpe caiga en el confeti (envolvente RMS)' },
  { at: 65.5, fadeOut: 2.5 },
];

export const shots = [
  {
    id: '01-hook-feed', dur: 4.5,
    setup: { via: 'reset', mission: 'phone', after: ['skipCinematic:intro', 'teleport:phone', 'interact', 'feed.goto:abuelo'] },
    camera: 'ui', zoom: [1.0, 1.06],
    feed: [{ at: 0, video: 'abuelo' }, { at: 1.4, swipe: 'sixseven' }, { at: 2.5, swipe: 'news' }, { at: 3.6, hover: 'cta' }, { at: 4.3, click: 'cta' }],
    text: [],
    ui: { game: ['phoneFeed'] },
    sfx: [{ at: 1.4, kind: 'whoosh' }, { at: 2.5, kind: 'whoosh' }, { at: 4.3, kind: 'uiSounds.confirm' }],
    transition: { kind: 'flash', frames: 2, color: '#ffffff' },
    square: { cx: 960, note: 'el mejor plano para 1:1: el móvil vertical cabe entero' },
  },
  {
    id: '02-idea', dur: 2.5,
    setup: { via: 'same' },
    player: { pos: [0, 0.02, -2.8], rotY: 0 },
    camera: [{ dur: 2.5, from: [[0.55, 1.80, -1.20], [0, 1.55, -2.8]], to: [[0.35, 1.70, -1.55], [0, 1.60, -2.8]], fov: 0.7 }],
    act: [{ at: 0, name: 'Tú', state: 'idle_look', dur: 0.9 }, { at: 0.9, name: 'Tú', state: 'cheer_arms', dur: 1.4 }],
    text: [{ at: 0.2, dur: 2.3, kind: 'card', es: 'Pues yo tengo una propuesta.', en: 'Well… I\'ve got a proposal.' }],
    transition: { kind: 'cut' },
    square: { cx: 960 },
  },
  {
    id: '03-videocall', dur: 4.0,
    setup: { via: 'jumpTo', mission: 'call', after: ['interact:laptop', 'call.skipRing', 'call.speak:dani@0', 'call.speak:lola@2.6'] },
    camera: 'ui', zoom: [1.0, 1.04],
    text: [
      { at: 0.2, dur: 3.6, kind: 'cardSmall', pos: 'topLeft', es: 'Monta un partido con tus amigos.', en: 'Start a party with your mates.' },
      { at: 0.4, dur: 2.2, kind: 'callLine', speaker: 'Dani', es: 'Cada mañana a las 7:00, argumentario en el grupo.', en: 'Talking points in the group chat. 7 a.m. sharp.' },
    ],
    ui: { game: ['callPanel'] },
    transition: { kind: 'cut' },
    square: { repass: true, note: 'la rejilla de 4 retratos se recoloca en 1080×1080' },
  },
  {
    id: '04-register', dur: 1.5, optional: true,
    setup: { via: 'jumpTo', mission: 'register', after: ['interact:folder', 'register.fill:party', 'register.submit@0.6'] },
    camera: 'ui',
    text: [{ at: 0.6, dur: 0.9, kind: 'cardSmall', es: 'Registrado en cero días hábiles.', en: 'Registered in zero working days.' }],
    ui: { game: ['registerPanel', 'toast'] },
    sfx: [{ at: 0.6, kind: 'uiSounds.click' }],
    transition: { kind: 'whipPan', dir: 'right', frames: 8 },
    square: { repass: true },
  },
  {
    id: '05-plaza-crane', dur: 4.0,
    setup: { via: 'jumpTo', mission: 'neighbor', patch: { party: 'trailerSetup.party' } },
    player: { pos: [0, 0.02, -4], rotY: 0 },
    camera: [{ dur: 4.0, from: [[-6, 11, -14], [0, 2, 4]], to: [[5.5, 7.5, -12], [0, 1.5, 6]] }],
    act: [
      ...['Alba', 'Rafa', 'Reme', 'Luis'].map(name => ({ at: 0.3, name, state: 'wave', dur: 3 })),
      { at: 1.5, name: 'Tere', state: 'clap', dur: 2.5 }, { at: 1.5, name: 'Manolo', state: 'clap', dur: 2.5 },
    ],
    text: [{ at: 0.4, dur: 3.2, kind: 'card', es: 'Baja a la calle.', en: 'Hit the streets.' }],
    transition: { kind: 'cut' },
    square: { cx: 900 },
  },
  {
    id: '06-marisa', dur: 3.5,
    setup: { via: 'same' },
    player: { pos: [-3.9, 0.02, 5.2], rotY: -0.6 },
    camera: [{ dur: 3.5, from: [[-3.5, 1.75, 4.3], [-5, 1.5, 6.7]], to: [[-3.85, 1.6, 4.85], [-5, 1.5, 6.7]] }],
    act: [{ at: 0, name: 'Marisa', state: 'wave', dur: 1.2 }, { at: 1.0, name: 'Marisa', state: 'talk', dur: 2.5 }],
    text: [{ at: 0.3, dur: 3.2, kind: 'bubble', anchor: 'Marisa', speaker: 'Marisa', babble: true,
      es: '¡Anda, el del argumentario! Ven, que te lo traduzco.', en: 'Oh, it\'s the talking-points guy! Come here, I\'ll translate.' }],
    note: 'No usar la cámara de seguimiento: la fachada de la panadería la tapa (artifacts/05-dialogue.png).',
    transition: { kind: 'cut' },
    square: { cx: 1000, note: 'repass si el globo se sale del recorte' },
  },
  {
    id: '07-paco', dur: 2.5, optional: true,
    setup: { via: 'same' },
    camera: [{ dur: 2.5, from: [[4.6, 1.75, -0.4], [6.3, 1.4, -1.5]], to: [[4.35, 1.6, -1.0], [6.3, 1.4, -1.5]] }],
    act: [{ at: 0, name: 'Paco', state: 'talk', dur: 1.8 }, { at: 1.8, name: 'Paco', state: 'nod', dur: 1.2 }, { at: 0.5, name: 'Tere', state: 'clap', dur: 2 }],
    text: [{ at: 0.2, dur: 2.3, kind: 'bubble', anchor: 'Paco', speaker: 'Paco', babble: true,
      es: 'Y el café se paga, que no es una medida.', en: 'And you pay for the coffee. It\'s not a policy.' }],
    transition: { kind: 'cut' },
    square: { cx: 960 },
  },
  {
    id: '08-podium', dur: 4.5,
    setup: { via: 'jumpTo', mission: 'speech', patch: { party: 'trailerSetup.party' } },
    player: { pos: [0, 0.02, 8], rotY: PI },
    camera: [{ dur: 4.5, from: [[0.8, 3.2, 0.6], [0, 1.4, 7.8]], to: [[0.4, 2.6, 2.4], [0, 1.5, 7.8]] }],
    act: [{ at: 0, name: 'Tú', state: 'talk', dur: 3.0 }, { at: 3.0, name: 'Tú', state: 'cheer_arms', dur: 1.0 }],
    fx: [{ at: 0, kind: 'reaction', value: 'idle_look' }, { at: 2.4, kind: 'reaction', value: 'cheer' }],
    text: [
      { at: 0.3, dur: 2.0, kind: 'card', es: 'Da la cara.', en: 'Face the crowd.' },
      { at: 2.6, dur: 1.9, kind: 'sticker', style: 'timingButton', es: '¡Y por eso me presento!', en: 'And that\'s why I\'m running!' },
    ],
    note: 'Comprobar que Reme (crowd2, -0.5,3.5) no tape al protagonista; si lo hace, desplazar la cámara x += 0.5.',
    transition: { kind: 'cut', onBeat: true },
    square: { cx: 960 },
  },
  {
    id: '09-viral', dur: 5.0,
    setup: { via: 'jumpTo', mission: 'video', patch: { party: 'trailerSetup.party', memories: { daniTrend: true } },
      after: ['minigame.start:viral(choice=chairs)', 'minigame.autoplay:perfect', 'minigame.seekBeat:8'] },
    camera: [{ dur: 5.0, from: [[4.2, 2.0, 0.6], [5.3, 1.25, 6.0]], to: [[4.6, 1.8, 2.2], [5.4, 1.3, 6.0]], fov: 0.8 }],
    act: [], // los gestos los pone el propio ViralGame (VIRAL_LANES: wave/cheer_arms/clap/shrug) y los mirones hacen cheer cada 4 de combo
    text: [{ at: 0.2, dur: 1.6, kind: 'card', es: 'Hazte viral.', en: 'Go viral.' }],
    ui: { game: ['minigameHud'] },
    transition: { kind: 'cut' },
    square: { repass: true, note: 'el carril de notas va de lado a lado' },
  },
  {
    id: '10-hq-nico', dur: 4.0,
    setup: { via: 'jumpTo', mission: 'hqBrief', patch: { party: 'trailerSetup.party' } },
    camera: [
      { dur: 1.4, from: [[0, 3.6, -7.3], [0, 1.2, 2.5]], to: [[0, 2.6, -3.2], [0, 1.3, 2.8]] },
      { dur: 2.6, from: [[1.25, 1.75, 0.7], [2, 1.45, 2.7]], to: [[1.45, 1.68, 1.1], [2, 1.45, 2.7]] },
    ],
    act: [
      ...['Lola', 'Dani', 'Nico'].map(name => ({ at: 0, name, state: 'wave', dur: 1.4 })),
      { at: 1.4, name: 'Nico', state: 'talk', dur: 2.0 }, { at: 3.4, name: 'Nico', state: 'cheer_arms', dur: 0.6 },
    ],
    text: [{ at: 1.5, dur: 2.5, kind: 'sub', speaker: 'Nico', babble: true, highlight: true,
      es: 'Orden del día: uno, sillas. Dos, quién trae hielo. Tres, España.', en: 'Agenda: one, chairs. Two, who\'s bringing ice. Three, Spain.' }],
    transition: { kind: 'cut' },
    square: { cx: 1000 },
  },
  {
    id: '11-debate-wide', dur: 4.0,
    setup: { via: 'jumpTo', mission: 'debate', patch: { party: 'trailerSetup.party' } },
    player: { pos: [-0.4, 0.57, 3.9], rotY: PI },
    fx: [{ at: 0, kind: 'label', key: 'results', text: 'DEBATE · BLOQUE 1' }],
    camera: [{ dur: 4.0, from: [[-1.2, 3.4, -2.6], [1.9, 1.6, 4.0]], to: [[0.6, 2.8, -0.4], [2.6, 1.6, 4.0]] }],
    act: [
      { at: 0, name: 'Moderadora', state: 'talk', dur: 1.5 }, { at: 0.6, name: 'Rival A', state: 'nod', dur: 1.2 },
      { at: 1.4, name: 'Rival B', state: 'talk', dur: 1.5 }, { at: 2.0, name: 'Rival C', state: 'idle_look', dur: 0.6 }, { at: 2.6, name: 'Rival C', state: 'cheer_arms', dur: 1.2 },
      ...['Ana', 'Berto', 'Cris', 'Dora', 'Eloy', 'Fina'].map(name => ({ at: 0, name, state: 'clap', dur: 1.5 })),
    ],
    text: [
      { at: 0.4, dur: 3.6, kind: 'tag', anchor: [1.1, 2.6, 3.9], es: 'Fermín Aguardo · PARTIDO PACIENTE' },
      { at: 0.9, dur: 3.1, kind: 'tag', anchor: [2.6, 2.6, 3.9], es: 'Nuria Giro · PARTIDO SOBREVIVO OTRA ELECCIÓN' },
      { at: 1.4, dur: 2.6, kind: 'tag', anchor: [4.1, 2.6, 3.9], es: 'Covadonga del Muro · FOX' },
      { at: 2.6, dur: 1.4, kind: 'card', es: 'Sobrevive al debate.', en: 'Survive the debate.' },
    ],
    note: 'Por encima de las cabezas del público: el plano 1 de la cinemática hall queda tapado (art/review/debate-fox-hall-1-wide.png).',
    transition: { kind: 'cut' },
    square: { repass: true, note: 'cámara 1,5 m más atrás (z -1.5) para que entren los cuatro atriles' },
  },
  {
    id: '12-fox-horse', dur: 4.0,
    setup: { via: 'same' },
    camera: [{ dur: 4.0, from: [[2.7, 2.35, 0.3], [4.0, 1.75, 3.9]], to: [[3.0, 2.25, 0.85], [4.05, 1.75, 3.9]] }], // FOX_SHOT
    act: [{ at: 0, name: 'Rival C', state: 'talk', dur: 3.0 }, { at: 2.8, name: 'Rival B', state: 'shrug', dur: 1.2 }, { at: 3.0, name: 'Rival A', state: 'disappointed', dur: 1.0 }],
    text: [{ at: 0.2, dur: 3.8, kind: 'sub', speaker: 'Covadonga del Muro (Fox)', babble: true, highlight: true,
      es: 'He dejado el caballo en doble fila. Si se lo llevan, es ideología.', en: 'I double-parked my horse. If they tow it, that\'s ideology.' }],
    transition: { kind: 'cut' },
    square: { cx: 1150 },
  },
  {
    id: '13-duel', dur: 4.0,
    setup: { via: 'same', after: ['minigame.start:duel', 'duel.gotoRound:4', 'duel.seekAnswerClock:3.5'] },
    camera: [{ dur: 4.0, from: [[3.85, 3.1, -1.9], [3.85, 1.45, 3.9]], to: [[3.6, 2.9, -1.2], [3.7, 1.45, 3.9]], fov: 0.95 }],
    script: [{ at: 0, event: 'interrupt' }, { at: 1.6, key: 'Space' }, { at: 2.4, key: 'Digit1' }], // DuelGame hace los gestos (talk, clap, disappointed)
    text: [{ at: 0.2, dur: 3.6, kind: 'cardSmall', pos: 'topLeft', es: 'Duelo de réplicas.', en: 'Comeback duel.' }],
    ui: { game: ['minigameHud', 'gameSubtitle'] },
    sfx: [{ at: 2.4, kind: 'tone:660' }],
    transition: { kind: 'cut' },
    square: { repass: true, note: 'el panel ocupa el 40 % derecho del máster' },
  },
  {
    id: '14-bus-27', dur: 2.5, optional: true,
    setup: { via: 'jumpToExit', mission: 'finalSpeech', patch: { party: 'trailerSetup.party' } },
    player: { pos: [-4.0, 0.02, -8.0], walkTo: [-6.2, -11.0], run: false },
    camera: [{ dur: 2.5, from: [[-2.2, 1.8, -7.6], [-6.4, 1.1, -11.0]], to: [[-3.4, 1.6, -9.0], [-6.6, 1.2, -11.2]] }],
    text: [{ at: 0.3, dur: 2.2, kind: 'cardSmall', es: 'Transporte público, como el votante medio.', en: 'Public transport, like the average voter.' }],
    ui: { game: ['exitBeacon', 'interactPrompt'] }, // «E · Parada · Coger el 27 al salón» visible: es el chiste
    sfx: [{ at: 0, kind: 'footsteps:plaza' }],
    transition: { kind: 'blackout', frames: 4 },
    square: { cx: 1020 },
  },
  {
    id: '15-rally', dur: 4.0,
    setup: { via: 'jumpTo', mission: 'finalSpeech', patch: { party: 'trailerSetup.party' },
      after: ['minigame.start:rally', 'minigame.autoplay:perfect', 'rally.seekPhrase:6', 'rally.jumpPhrase:11@2.2'] },
    camera: [{ dur: 4.0, from: [[-4.6, 2.3, 5.4], [-1.0, 1.0, -0.8]], to: [[-4.2, 2.1, 4.6], [-1.0, 1.1, -0.8]], fov: 0.85 }],
    act: [...['Ana', 'Berto', 'Cris', 'Dora', 'Eloy', 'Fina'].map(name => ({ at: 3.2, name, state: 'jump', dur: 0.8 }))],
    text: [{ at: 0.2, dur: 1.8, kind: 'cardSmall', pos: 'topLeft', es: 'El último mitin.', en: 'The final rally.' }],
    ui: { game: ['minigameHud'] }, // «…ya sabéis dónde está la PANADERÍA» → «¡Pues me PRESENTO!»
    transition: { kind: 'cut', onPunch: 'PRESENTO!' },
    square: { repass: true },
  },
  {
    id: '16-victory', dur: 5.5,
    setup: { via: 'jumpTo', mission: 'election', patch: { party: 'trailerSetup.party' }, after: ['simulateElection:victory', 'cinematicSetup:victory'] },
    player: { pos: [-1, 0.02, 0.6], rotY: 0.35 }, // endingSetup()
    camera: [
      { dur: 2.0, from: [[4.0, 2.1, 1.4], [4.6, 2.0, 5.6]], to: [[4.3, 2.05, 2.3], [4.6, 2.0, 5.6]] },
      { dur: 3.5, from: [[-0.4, 2.7, 3.5], [-0.7, 1.1, -0.6]], to: [[0.5, 2.3, 3.1], [-0.7, 1.1, -0.6]] },
    ],
    act: [
      ...['Ana', 'Berto', 'Cris', 'Dora', 'Eloy', 'Fina'].map(name => ({ at: 2.0, name, state: 'cheer', dur: 3.5 })),
      { at: 2.0, name: 'Tú', state: 'cheer_arms', dur: 2.0 }, { at: 4.0, name: 'Tú', state: 'jump', dur: 1.5 },
    ],
    fx: [{ at: 2.0, kind: 'banner', args: ['NOCHE ELECTORAL', '¡Victoria!', { icon: 'trophy', kind: 'good' }] }, { at: 2.0, kind: 'confetti', n: 140 }],
    text: [{ at: 0.2, dur: 3.0, kind: 'sub', speaker: 'Periodista', babble: true, highlight: true,
      es: 'Todos los partidos dicen que han ganado. Por una vez, uno tiene razón.', en: 'Every party claims victory. For once, one of them is right.' }],
    sfx: [{ at: 2.0, kind: 'uiSounds.confirm' }],
    transition: { kind: 'fadeWhite', color: '#fff7e6', frames: 12 },
    square: { cx: 1180, cxSecond: 960, note: 'primer subplano centrado en la pantalla de resultados, segundo centrado' },
  },
  {
    id: '17-logo', dur: 3.5,
    setup: { via: 'jumpTo', mission: 'neighbor', patch: { party: 'trailerSetup.party' } },
    camera: [{ dur: 3.5, from: [[5.5, 7.5, -12], [0, 1.5, 6]], to: [[0, 9, -15], [0, 1.5, 6]] }],
    post: { blur: 8, overlay: { color: '#fff7e6', alpha: 0.3 } },
    text: [
      { at: 0.2, dur: 3.3, kind: 'logo', es: 'Pues me presento' },
      { at: 0.8, dur: 2.7, kind: 'cardSmall', pos: 'belowLogo', es: 'Un juego de sátira política.', en: 'A political satire game.' },
    ],
    transition: { kind: 'none' },
    square: { cx: 960 },
  },
  {
    id: '18-credits-cta', dur: 4.5,
    setup: { via: 'same' },
    camera: [{ dur: 4.5, from: [[0, 9, -15], [0, 1.5, 6]], to: [[-1.5, 9.6, -16.5], [0, 1.5, 6]] }],
    post: { blur: 8, overlay: { color: '#fff7e6', alpha: 0.45 } },
    text: [
      { at: 0.0, dur: 4.5, kind: 'credits', es: 'Hecho por Freddy · github.com/freddysae0' },
      { at: 0.5, dur: 4.0, kind: 'chips', items: ['Babylon.js', 'Blender', 'Vite'] },
      { at: 1.0, dur: 3.5, kind: 'card', es: '¿Qué propuesta llevarías tú? Te leo en comentarios.', en: 'What would your proposal be? Tell me in the comments.' },
    ],
    holdLastFrame: 2.0,
    transition: { kind: 'end' },
    square: { cx: 960 },
  },
];

// 68,0 s
export const totalDuration = shots.reduce((t, s) => t + s.dur, 0);

// Corte de 45 s (§6 del storyboard): sin 04, 07, 10 ni 14, con duraciones recortadas y 17+18 fusionados en 5,5 s.
export const cut45 = {
  drop: ['04-register', '07-paco', '10-hq-nico', '14-bus-27'],
  durations: { '01-hook-feed': 4.0, '02-idea': 2.0, '06-marisa': 3.0, '12-fox-horse': 3.5, '15-rally': 3.5, '03-videocall': 3.0, '05-plaza-crane': 3.0, '08-podium': 3.5, '09-viral': 4.0, '11-debate-wide': 3.0, '13-duel': 3.0, '16-victory': 4.5, '17-logo': 2.5, '18-credits-cta': 3.0 },
};
