# Estado de entrega · v0.3 (M2 + cinemáticas y minijuegos)

## Salidas a pie entre escenarios (2026-10-10)

**Implementado.** Ninguna misión salta ya de mapa al terminar (salvo la puerta verde del piso, que ya era su propia misión `leave`). Al acabar una misión cuya siguiente está en otro escenario, el jugador se queda donde está; el HUD, la pausa y el marcador flotante pasan a «ve a la salida» y en la salida aparece una señal (anillo dorado flat-shaded con chevrones que avanzan hacia la puerta + poste de madera con cartel de destino). E en la salida → cartel de transición existente → nuevo mapa en su entrada → cinemática de llegada (`cinematicFor`) una sola vez.

| Antes (salto) | Ahora | Salida |
|---|---|---|
| aftermath → hqBrief (plaza → sede) | a pie | `sedeDoor`: portal junto al bar de Paco, fachada este, cartel «SEDE DE CAMPAÑA» |
| hqBrief → video (sede → plaza) | a pie | `hqDoor`: puerta de la sede, cartel «A LA CALLE» |
| video → crisis (plaza → sede) | a pie | `sedeDoor` |
| crisis → debate (sede → salón) | a pie | `hqDoor` (cartel del poste: SALÓN) |
| debate → finalPrep (salón → plaza) | a pie | `hallDoor`: puerta doble, cartel «SALIDA» |
| finalPrep → finalSpeech (plaza → salón) | a pie | `busStop`: parada del 27 junto al quiosco |
| leave (piso → plaza) | sin cambio (ya era a pie) | `door`, ahora con la misma señal |
| finalSpeech → election → complete | sin cambio: mismo salón | — |
| derrota → «Reintentar desde la crisis» | sin cambio: es una carga del checkpoint (como Continuar), no un viaje | — |

Diseño de estado: **salida pendiente derivada**, sin campo nuevo ni cambio de esquema. `advance()` ya no cambia `state.scene` (salvo misiones `travel`, solo `leave`); la salida está pendiente mientras `state.scene` sea la escena de la misión anterior (`pendingExit`), y `crossExit()` la cruza (idempotente, sin efectos). `advance()` rechaza completar una misión desde el mapa anterior. `objectiveFor()` da el objetivo efectivo (misión o trayecto). `validCampaign` acepta la escena de la misión o, con salida pendiente, la de la anterior. Guardado en puntos seguros: al acabar la misión (recarga → entrada segura del mapa con la puerta, progreso intacto) y al cruzar (recarga → nuevo mapa). Guardados existentes: todos tienen escena = escena de su misión, así que cargan igual (ya están «al otro lado»); v1 sigue migrando. Datos: `exits` y `travels` en `src/data/campaign.js`; textos `travel` en `actual.js` (título, objetivo, etiqueta E, cartel de carga, cartel del poste) y título/objetivo con voz B en `b.js`. Debug: `gameDebug.jumpToExit(id)`; `stateAt`/`jumpTo` cruzan las puertas.

**Probado automáticamente.** `npm.cmd test` 35/35 (nuevo `tests/exits.test.js`: lista exacta de transiciones a pie, puerta real en `world.js`, avance bloqueado con salida pendiente, cruce idempotente y sin efectos, validación, guardado/recarga en la puerta, guardados antiguos y v1, reintento; textos sin las cadenas que buscan las pruebas). `test:browser`: las seis salidas por E con baliza activa, cinemáticas de sede y salón una vez, reintento → crisis en la sede → puerta → salón sin repetir cinemática; cero errores. `test:recovery`: pausa en «ve a la sede» (diario), volver al menú/Continuar, recarga → plaza en (0,-7) con la salida pendiente, E lejos no hace nada, cruzar → sede, recarga → sede. `test:production` (build, solo WASD/E, sin debug) 3/3 pasadas caminando a las seis salidas; `WALK_PROBE=1 WALK_URL=http://127.0.0.1:5173` repite la ruta en dev y registra posiciones. `test:desktop`: guardado en la puerta de la sede, caminar con teclado, cruzar, reiniciar Electron → guardado en la sede.

**Visto.** `art/review/salida-1-plaza-a-sede.png` … `salida-6-plaza-a-salon-bus.png` (`node tools/exit-review.mjs`, dev activo), revisadas: señal visible, cartel legible, poste corregido (atravesaba el cartel). **Sin validación humana**: legibilidad de la señal a distancia, si el trayecto plaza→sede (≈20 m desde Marisa) resulta largo o claro, y el chiste de la parada del 27.

## Móvil del jugador (2026-10-10)

**Implementado.** Tecla `M` o botón del HUD (con badge) desde la misión 2 en exploración: modo `phone`, simulación detenida. Apps: Avisos (prensa, unratito, grupo de amigos, vecinos; desbloqueo por misión completada + decisiones/memorias; toast y vibración del icono al volver a `play`), Encuesta (voto jugador = puntos de campaña × 0,6; umbral 48 → 28,8 %; el rival líder queda por encima del umbral si pierdes y por debajo si ganas, así que «vas primero» ⇔ `electionForecast().winning`; rivales e indecisos deterministas según misión y decisiones; tendencia frente al estado reconstruido al inicio de la misión anterior) y Programas (tu propuesta, equipo, discurso y decisiones de campaña; anuncios satíricos de los tres rivales). Persistencia: solo `state.phoneRead` (opcional, validado; guardados antiguos cargan; el reintento conserva lo leído). Archivos: `src/state/phone.js`, `src/data/phoneNews.js`, `src/ui/smartphone.js`, `src/ui/smartphone.css`; ganchos mínimos en `main.js`, `ui.js` (chuleta) y `state/campaign.js`.

**Probado.** `tests/phone.test.js` (8 pruebas: orden de desbloqueo, decisiones, leídos idempotentes y validación, retry, encuesta suma 100 y coherente con el umbral en una rejilla de estados, determinismo, tendencia, programas). `test:browser` completo sin errores con servidor propio. Capturas revisadas en `neighbor` y `finalPrep` (las tres apps), badge, toast + vibración, pausa (M no abre), 390×844. **Sin validación humana** del tono de los textos ni del ritmo de notificaciones.

## Guion único y aviso inicial (2026-10-10)

**Implementado.** Un solo guion: `src/data/script/index.js` exporta siempre `script = deepMerge(actual, b)` (base `actual.js` + rama B «Sátira de argumentario»). Retirados el botón «Guion: …» del menú, el selector de Ajustes, `?guion=` y la clave `pmp.guion`. Ramas A y C movidas a `docs/dialogue-branches/archive/` (no las importa el juego; ver `docs/dialogue-branches/README.md`). Aviso inicial antes del menú (`Game.notice()` en `src/main.js`, estilos `.panel-notice` en `style.css`): parodia, personajes/partidos/hechos inventados, parecido pura coincidencia, «Espero que lo disfrutéis». Botón «¡Vamos allá!» con foco automático (Enter/Espacio/clic); su clic es el primer gesto: crea/reanuda los AudioContext (`GameAudio.start`), suena una confirmación (`uiSounds.confirm`) y arranca el tema del menú. Antes del botón no se crea ningún AudioContext (teclas y punteros no desbloquean en modo `notice`). Se muestra en cada arranque (web y Electron), nunca al volver al menú. Electron ya no usa `autoplay-policy=no-user-gesture-required`. La línea de ficción de Créditos se mantiene.

**Probado automáticamente.** `npm.cmd test` 22/22 (`tests/script.test.js` valida el guion efectivo actual+B y `actual.js` como base). `test:browser`: aviso visible antes del menú, botón con foco, cero AudioContext antes del clic y dos después, sin avisos de autoplay; volver al menú no repite el aviso; resto del recorrido igual, cero errores. `test:recovery` (pasa el aviso en cada reload), `test:production` (aviso con Enter, sin debug), `test:desktop` (aviso con Enter en Electron, en cada arranque). Scripts de capturas (`feed-review`, `debate-review` ya sin `?guion=a`, nuevo `tools/notice-review.mjs`) pasan por el aviso.

**Visto.** `art/review/aviso-inicial.png` (1440×900) y `aviso-inicial-small.png` (520×480, sin desbordamiento). **Sin validación humana** del texto, del sonido de confirmación ni del arranque de la música.

## v0.3 · cinemáticas y minijuegos (2026-10-10)

**Implementado.** `src/cinema/director.js` (rig de cámara propio, letterbox, subtítulos, banners, confeti, gestos por personaje, balbuceo local), datos en `src/data/cinematics.js`: intro (TV con la convocatoria + móvil vibrando), plaza, sede, salón/debate, victoria y derrota. Espacio/Enter salta; Esc pausa (reloj, cámara, eventos y audio congelados). Una vez por partida (`state.seen`, guardado al empezar; reload a mitad → se reanuda tras la cinemática). Minijuegos en `src/minigames/` (viral, duelo, sillas, mitin; tabla en `MILESTONES.md`), puntuación pura en `src/state/minigames.js`. Guardados antiguos se migran (`seen`, `minigames`). Corrección en `src/npc/character.js`: los gestos podían caer a la T-pose de bind (animaciones compartidas entre copias del modelo y gesto encadenado sobre gesto); ahora cada personaje clona sus animaciones, el rig se posa en idle antes de arrancar y un gesto nuevo espera a que se desvanezca el anterior. Textos de ficción repetidos retirados del juego; aviso único en Créditos.

**Probado automáticamente** (servidores propios 5187/4197): `npm.cmd test` 14/14 (incluye `tests/minigames.test.js`: bonus acotados, idempotencia, orden, salto, cinemáticas una vez, migración, retry). `test:browser`: cinemáticas con letterbox y salto, pausa congela el reloj de la cinemática, viral jugado con teclado (bonus ≥7), duelo con interrupción, sillas completas, mitin saltado, derrota → reintento sin repetir la cinemática del salón → victoria; cero errores. `test:recovery`: pausa y reload a mitad de cinemática, abandono de minijuego sin efectos, repetir + saltar. `test:production` (build): cinemáticas saltadas con Espacio salvo el final, minijuegos saltados con X, sin debug ni peticiones externas.

**Visto (capturas Chrome headless revisadas).** Cada cinemática en 3 instantes y cada minijuego (intro, juego, resultado). **Sin validación humana**: dificultad/ritmo de los minijuegos, legibilidad de la pista, sincronía de gestos (los clips tienen un retardo de reacción de 0,1–0,5 s), mezcla de sonido y duración real.

# Estado previo · Milestone 2 provisional (v0.2)

## Implementado

Recorrido completo provisional de los seis capítulos y cuatro escenarios. Tras el slice original: sede con prioridad de equipo, grabación de vídeo, crisis, debate, última acción recuperadora, mitin y noche electoral. Modelo visible y determinista: 55% apoyo, 30% credibilidad y 15% organización; umbral 48. Alcance abre atención pero no votos. Derrota explica debilidades y vuelve al checkpoint anterior a la crisis; victoria abre créditos y menú.

Primera experiencia conectada: menú → piso → vídeo de convocatoria explícitamente ficticia → videollamada con tres amigos/cargos/condiciones → nombre/color/lema y registro cómico → plaza → conversación con Marisa → programa excluyente → discurso de apertura/argumento/cierre/timing → consecuencias recordadas → autoguardado y Continuar. Paco ofrece una conversación opcional de una sola recompensa.

Tercera persona WASD, Shift, cámara de ratón con captura o arrastre, E, Escape. Colisiones del jugador; retracción de cámara por cinco rayos; indicador flotante del objetivo. Cámara lateral durante discurso para ver público y gestos. Identidad del partido en HUD y telón. UI HTML/CSS, 3D Babylon.js, JS ES modules, Vite; no React/TypeScript.

Texto progresivo con pausa por puntuación y completar/continuar; teclado/ratón; globo proyectado con límites de pantalla y fallback para hablante fuera de cámara; velocidad configurable. Web Audio local activado por gesto, balbuceo de tono por personaje y volumen/interruptor independiente. Pausa detiene tiempo de juego, texto, movimientos, timing y sonidos.

Guardado local esquema v1, validación, recuperación ante JSON corrupto/versión desconocida, avisos si almacenamiento no disponible. Reanudación en entrada segura de escenario; posición exacta no persistida. Decisiones de llamadas y diálogos se consolidan solo al acabar. Sin recompensas repetibles. Adaptador aislado para futuro escritorio.

Música de fondo: 7 pistas MP3 generadas con IA por el usuario en `public/assets/music/` (catálogo `music` en `src/assets/catalog.js`). `src/audio/music.js` elige pista por escena/misión/modo (menú, piso, plaza, sede, discurso, vídeo/trend, crisis), hace fundido de 1,6 s entre pistas y bucle con fundido cruzado de 3 s tras recortar silencios de los extremos. Se atenúa al 45% durante diálogos; volumen de música independiente en Ajustes. La pausa suspende el AudioContext completo. El salón (debate, mitin, recuento) usa provisionalmente el tema principal; faltan pistas propias, victoria y derrota.

Efectos de sonido sintetizados en `src/audio/sfx.js` (sin samples): hover/clic/atrás en todos los botones y controles (contexto de audio de interfaz que sigue sonando en el menú de pausa), pasos sincronizados con la zancada procedural según suelo (adoquín en plaza, tarima en piso/sede, salón) y al correr, y balbuceo de "p" por personaje (timbre, tono y formante propios; «P» acentuada en mayúsculas/exclamaciones o al azar, «pp» dobles, pregunta sube y punto baja). La videollamada balbucea la frase completa. Niveles igualados midiendo RMS offline frente a la pista de plaza.

Escritorio: Electron 44 (`electron/main.cjs`). Producción sirve `dist/` por el protocolo `app://` (los módulos ES y los fetch de GLB/MP3 no funcionan desde `file://`); renderer con sandbox, aislamiento de contexto y sin Node; toda petición fuera de `app://`/dev server se cancela. Guardados en `localStorage` del perfil de Electron. Sin menú; F11/Alt+Enter pantalla completa; en dev F12 y Ctrl+R. Sin instalador, Steamworks ni IPC de guardado todavía.

Tres GLB provisionales reales creados en Blender 5.0.1, con `art/props.blend` y generador reproducible. Inspección binaria: banco 6.796 bytes/4 meshes; jardinera 5.140 bytes/2 meshes; atril 6.916 bytes/4 meshes. Todos exportados por Khronos glTF Blender I/O v5.0.21; cero skins y cero animaciones. Catálogo no les atribuye clips inexistentes.

Guion v0.3 (2026-10-10): diálogos reescritos con temas de actualidad documentados en `docs/RESEARCH_SPAIN.md` (vivienda, pisos turísticos, emancipación, listas de espera, calor, hostelería, bulos). Textos en `src/data/` (`campaign.js`, `dialogues.js`, nuevo `flow.js`); `campaignFlow.js` lee sus pantallas de ahí. Nueva propuesta `housing`. Conversaciones laterales de una sola recompensa (Paco ampliado; Lola, Dani y Nico en la sede, una en la reunión y otra en la crisis) y comentarios repetibles de Marisa, gestionados por `sideTalk()` con memorias que cambian textos posteriores (crisis, vídeo, última vuelta, reacción de Marisa). Cuarta opción en sede, vídeo, crisis y debate. Rivales ficticios: Borja Valcárcel (Sentido Común Plus) y Encarna Robles (Movimiento ¡Ya Está Bien!); moderadora Pilar Ortega. Verificado con `npm.cmd test` y build; **pendiente** ejecutar pruebas de navegador y lectura humana del tono.

## Probado automáticamente

- `npm.cmd test`: 5/5 pruebas. Progresión ordenada, efectos idempotentes, coherencia frente a timing, promesas incompatibles, serialización y recuperación de guardados.
- `npm.cmd run test:browser`: ruta completa de v0.2 en Chrome headless a 1440×900, incluyendo derrota, checkpoint, remontada, victoria y Continuar. Pausa detiene contador. GLB cargados. Cero errores de consola. Usa teletransporte para acelerar la navegación.
- `npm.cmd run test:recovery`: retracción de cámara y contacto con pared, abandono de diálogo revierte elección parcial, memoria consolidada sobrevive reload, discurso contradictorio y guardado/carga posteriores, guardado corrupto deshabilita Continuar sin bloquear nueva partida.
- `npm.cmd run test:production`: **build completada a 1920×1080 solo con WASD/E y UI pública, sin usar debug**. Desde Nueva partida hasta pantalla final del slice. `window.gameDebug` es `undefined`. Cero peticiones externas y cero errores de consola. La ruta rodea obstáculos reales. Test por tiempos de pulsación, sensible al rendimiento de la máquina.
- `npm.cmd test` incluye `tests/music.test.js`: archivos del catálogo existen y selección de pista por escena/modo. Comprobación manual con Playwright (no incluida en scripts): cambio de pista en cada escena, atenuación en diálogo, contexto suspendido en pausa incluso con clics, bucle de 30 s de crisis con fundido cruzado, cero errores. **No hay revisión auditiva humana** de mezcla, volúmenes ni puntos de bucle.
- `tests/sfx.test.js`: balbuceo determinista, entonación de pregunta/afirmación y voz distinta por personaje. Comprobación manual con Playwright: hover/clic/atrás disparan, 5 pasos en 2 s caminando y 9 corriendo, cero sonidos del mundo en pausa, niveles RMS de efectos −29…−37 dB y voces −31/−32 dB frente a música −26 dB. **Sin revisión auditiva humana.**
- `npm.cmd run test:desktop`: Electron real sobre `dist/`: carga por `app://`, sin `require`/`process`/debug en el renderer, música y GLB servidos, red externa bloqueada, llega a modo juego y el guardado sobrevive a reiniciar la app, cero errores. `desktop:dev` comprobado cargando el servidor Vite.
- `npm.cmd run build`: correcta, `dist/` generado. Advertencia de Vite por bundle principal grande (~6,33 MB sin comprimir, ~1,39 MB gzip); no es un error de build. Pendiente reducir importaciones cuando se mida su impacto en carga.

## Inspección visual realizada

Capturas reales de Chrome en `artifacts/`: menú, piso, llamada, plaza, globos, resultado del discurso y final de producción. Revisados encuadres, textos y reacción del público. Se corrigieron carteles espejados, sobreexposición y cámara demasiado pegada al protagonista durante el discurso. También se corrigió una carrera de carga de escena que renderizaba antes de tener cámara. Las capturas y pruebas posteriores corresponden a las correcciones.

No equivale a una sesión humana de juego ni a una revisión auditiva del sonido. El recorrido de producción automatizado utiliza avance rápido de diálogo: **no mide duración narrativa**.

## Rendimiento: muestra, no certificación

Equipo detectado: Intel Core i5-10400F, NVIDIA GeForce RTX 3050. En una muestra de Chrome headless a 1440×900, plaza: 212 meshes, 172 activos, indicador instantáneo de 97 FPS (otras pasadas 97–111). No hay protocolo sostenido ni percentiles de frame time; Chrome headless y automatización no sustituyen juego normal. La ruta a 1080p prueba funcionalidad, no certifica 60 FPS. Objetivo pendiente de medir en navegador visible, build final y hardware definido.

## Pendiente / límites explícitos

- El recorrido de M2 usa decisiones provisionales mediante interfaces breves; vídeo, debate y mitin necesitan mecánicas 3D más ricas durante M3/M4.
- Milestone 3: campaña de 120–150 minutos. No se promete ni se ha medido esa duración; el contenido actual es corto. `activeSeconds` cuenta simulación activa e incluye inactividad: no usarlo como duración significativa sin separar actividad/esperas/repeticiones.
- Quaternius: no hay archivos del paquete disponibles localmente ni animaciones integradas. Rig compatible/retargeting y prueba real idle/caminar/correr pendientes. Los ciudadanos usan partes rígidas procedurales y fallback explícito.
- Validar percepción auditiva, hardware variado, sesiones prolongadas, teclado alternativo, accesibilidad y viewport pequeño. Cámara probada junto a pared, no todos los rincones de todos los escenarios futuros.
- Arte de personajes/escenarios aún placeholder; sombras de contacto simplificadas. Electron funciona en desarrollo y sobre la build, pero sin instalador ni Steamworks; guardado aún en localStorage, pendiente adaptador IPC.

## Siguiente paso concreto

Extender los datos de misión para que `aftermath` desbloquee la sede. Añadir una misión provisional por capítulo, construir crisis/debate/mitin final y modelo electoral determinista antes de ampliar guion. Crear checkpoint antes de crisis, demostrar remontada desde el peor estado permitido y automatizar victoria, derrota y reintento. Mantener una opción de recorrer M1 para regresión. Ver lista completa de objetivos y criterios en `MILESTONES.md`.
