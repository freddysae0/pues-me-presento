# Tráiler LinkedIn · «Pues me presento» · storyboard

Plan creativo y de rodaje. No hay nada implementado aquí: el modo «trailer» (planos declarativos → vídeo) lo construye otro agente. Los planos en formato JS están en `docs/trailer/shots.draft.js`; este documento manda si hay discrepancia.

**Estado de este plan:** escrito a partir del código (`world.js`, `cinematics.js`, `director.js`, `minigames/*`, `debug.js`), del guion activo (actual + B) y de las capturas de `art/review/` y `artifacts/`. Las coordenadas son reales del mundo, pero **ningún encuadre se ha renderizado todavía**: hay que revisar cada plano en una pasada de prueba antes de grabar el máster.

---

## 1. Concepto

**«Un ciudadano corriente ve un tiktok… y monta un partido.»**

Escalada de lo mínimo a lo máximo: del sofá y el móvil, a la plaza, a la tele, al debate y al confeti. El chiste está en el texto, así que se entiende sin sonido: cada plano lleva **una sola idea en pantalla**, con una tarjeta corta (el verbo de la mecánica) o un subtítulo del guion B (el humor). Nunca las dos a la vez en primer plano.

- **Gancho (0–3 s):** el feed vertical de *unratito* (abuelo del tobogán → 6 7 → «Se vienen elecciones.»). Es UI 2D, se lee al instante y en 1:1 queda perfecto porque el móvil ya es vertical y está centrado.
- **Columna vertebral:** tarjetas-verbo con la tipografía del juego (Fredoka, tinta `#2b2140` sobre `#fff7e6`, acentos `--sun #ffc83d` / `--tomato #ff6b4f`): *Monta un partido · Baja a la calle · Da la cara · Hazte viral · Sobrevive al debate · Gana. (O no.)*
- **Humor:** 3 líneas principales del guion B que funcionan sin contexto (Nico, Fox, la periodista) y 2 de apoyo (Marisa, Paco).
- **Cierre:** logo, firma, stack y CTA.

Duración del máster: **68 s** (dentro de 45–75). Hay un corte alternativo de 45 s en §6.

### Ritmo (beats)

| Tiempo | Beat | Energía |
|---|---|---|
| 0:00–0:04.5 | Gancho: scroll del feed → «Se vienen elecciones.» | Rápido, cortes cada ~1,2 s |
| 0:04.5–0:12.5 | La idea: «Pues yo tengo una propuesta» → videollamada → registro | Sube |
| 0:12.5–0:22.5 | El barrio: plaza viva, Marisa, Paco | Respira (plano grúa) y vuelve a subir |
| 0:22.5–0:32 | Mecánicas: atril y minijuego viral | Alta, música de ritmo |
| 0:32–0:48 | Política: sede, debate, Fox, duelo de réplicas | Alta, chistes |
| 0:48–0:54.5 | Remate: parada del 27 y último mitin | Prepara el clímax |
| 0:54.5–0:60 | Clímax: noche electoral y confeti | Pico |
| 0:60–0:68 | Logo, firma y CTA | Baja, se queda en pantalla |

---

## 2. Preparación común (todas las tomas)

1. **Ocultar siempre:** panel `DEV · F8` (`installPanel`), HUD de misión/barras, chuleta de teclas, botón del móvil, `skip-hint` del director («Espacio saltar»), marcador flotante del objetivo (`world.marker`) y el letterbox del director (las tarjetas del tráiler ya tienen su propio marco). Excepción: la UI de minijuegos, feed, videollamada y la señal de la parada se ven a propósito (columna «UI»).
2. **Identidad del partido:** `stateAt()` pone «Partido de prueba», que se ve en el telón de la plaza, el del salón y el HUD (ver `art/review/debate-fox-hall-1-wide.png`). Antes de cada toma: `state.party = { name: 'La Gente del Banco', slogan: 'Una cosa bien hecha, para empezar.', color: '#ff6b4f' }` y `game.world.setIdentity(state.party)`. El nombre es el valor por defecto del guion B, y el doble sentido banco/banco es un chiste que se pilla sin contexto. (Alternativa de marca: nombre «Pues me presento». Así el telón repite el título del juego, pero se pierde el chiste.)
3. **Cinemáticas automáticas:** `stateAt()` marca `seen` y no las relanza. Los planos del tráiler llevan su propia cámara; de las cinemáticas solo se reutilizan coordenadas y textos.
4. **Pantalla «RECUENTO» detrás del debate:** durante los planos 11–13 conviene `world.drawLabel('results', 'DEBATE · BLOQUE 1')`. Lo de «RECUENTO» confunde en el debate (se ve en todas las capturas del salón).
5. **Resolución:** máster 1920×1080 a 60 fps (o 30 si el render no aguanta 60 estables; LinkedIn reproduce bien a 30).
6. **1:1:** los planos marcados **«2.ª pasada 1:1»** no se recortan del máster: se vuelven a grabar con viewport 1080×1080 y la UI se recoloca sola (es responsive). En el resto basta recortar del máster con el centro `cx` indicado, en px de 1920. El recorte por defecto es `cx = 960` (x 420–1500).
7. **Pausa / reloj:** el tráiler debe avanzar con `update(dt)` fijo (dt = 1/60), no con tiempo real, para que gestos, confeti y notas sean deterministas y la grabación no dependa del rendimiento.

**Gestos verificados** (`src/npc/character.js` `GESTURES` + estados de pool): `jump`, `cheer_arms`, `clap`, `wave`, `talk_gesture_a`, `talk_gesture_b`, `nod`, `shrug`, `disappointed`, `boo`, `idle_look`; estados compuestos `cheer` (sorteo cheer_arms/clap/jump/wave), `talk` (alterna talk_gesture_a/b), `boo`, `disappointed`, `idle`. `'Tú'` = protagonista (vía `game.playerGesture`). Los clips tienen 0–0,4 s de retardo de reacción por personaje: lanzar los gestos **~0,3 s antes** del momento en que deben verse.

---

## 3. Lista de planos

Formato de cámara: `from [pos], [mira] → to [pos], [mira]`, interpolado con el `smooth` del director. Coordenadas en metros del mundo (Y arriba).

### 01 · Gancho: el scroll · 0:00–0:04.5 (4,5 s)
- **Escena/estado:** piso, misión `phone`. `gameDebug.reset(1)` → saltar la cinemática `intro` → `teleport('phone')` → E → feed de *unratito* (`src/ui/phoneFeed.js`).
- **Contenido:** **arranca ya en el vídeo del abuelo** (no en el trend: el abuelo con periódico en el tobogán es la imagen más rara y para el scroll en 1 s). 0,0–1,4 s `abuelo` → swipe → 1,4–2,5 s `sixseven` → swipe → 2,5–4,5 s `news` («ÚLTIMA HORA · Se vienen elecciones.»). A los 3,6 s el botón «Pues yo tengo una propuesta» hace pulso (hover programático) y a los 4,3 s, clic.
- **Cámara:** la del juego tras el móvil (fondo del piso desenfocado). Zoom digital lento del 100 % al 106 % sobre el móvil.
- **Texto:** el del propio feed. Sin tarjeta extra: la noticia ES el gancho.
- **UI:** feed visible; HUD que asoma desenfocado detrás → ocultar.
- **Transición:** el clic del botón hace corte con flash blanco de 2 frames.
- **1:1:** recorte `cx = 960` (el móvil está centrado); cabe entero. **Mejor plano del vídeo para 1:1.**

### 02 · «Pues yo tengo una propuesta» · 0:04.5–0:07.0 (2,5 s)
- **Escena/estado:** piso, mismo estado; protagonista en el spawn `(0, 0.02, -2.8)`, `rotation.y = 0`.
- **Cámara:** primer plano frontal (como el plano 4 de la cinemática `intro`): from `[0.55, 1.80, -1.20]`, `[0, 1.55, -2.8]` → to `[0.35, 1.70, -1.55]`, `[0, 1.60, -2.8]`, fov 0,7.
- **Personajes:** `Tú` `idle_look` (0,0) → `cheer_arms` (0,9 s, 1,4 s).
- **Texto (tarjeta grande, centrada, entra con pop a 0,2 s):** «Pues yo tengo una propuesta.»
- **UI:** oculta.
- **Transición:** corte seco a la videollamada.
- **1:1:** `cx = 960`; la cara queda centrada.

### 03 · La videollamada · 0:07.0–0:11.0 (4,0 s)
- **Escena/estado:** piso, misión `call`. `gameDebug.jumpTo('call')` → E en `laptop` → saltar el tono («Entrar ya») → panel de llamada con los 4 retratos 3D (`call-grid`).
- **Contenido:** Dani hablando (barras de voz activas) con su réplica de Comunicación: «Cada mañana a las 7:00, argumentario en el grupo.» (recortada de `friends.dani.choices[0].reply`). A los 2,6 s pasa a Lola o Nico (cambia el retrato activo) para que se vea la pantalla dividida viva.
- **Cámara:** UI a pantalla completa; push digital del 100 % al 104 %.
- **Texto (tarjeta-verbo, esquina superior izquierda):** «Monta un partido con tus amigos.»
- **UI:** panel de llamada visible; HUD oculto.
- **Transición:** corte.
- **1:1:** **2.ª pasada 1:1** (la rejilla de 4 retratos es horizontal; en 1080×1080 se recoloca).

### 04 · Registro exprés · 0:11.0–0:12.5 (1,5 s) · *recortable*
- **Escena/estado:** piso, misión `register`, formulario relleno con «La Gente del Banco». `jumpTo('register')` → E en `folder`.
- **Contenido:** clic en «Registrar candidatura» → toast «REGISTRADO.». Si el sello «PENDIENTE DE SUBSANAR» se anima, que se vea.
- **Texto:** tarjeta pequeña «Registrado en cero días hábiles.» (del toast de B).
- **UI:** panel de registro visible.
- **Transición:** whip-pan / barrido lateral hacia la plaza.
- **1:1:** **2.ª pasada 1:1**.

### 05 · La plaza (grúa) · 0:12.5–0:16.5 (4,0 s)
- **Escena/estado:** plaza, misión `neighbor`. `gameDebug.jumpTo('neighbor')` + identidad del partido. Protagonista en `(0, 0.02, -4)` mirando +Z.
- **Cámara:** plano 1 de la cinemática `plaza`: from `[-6, 11, -14]`, `[0, 2, 4]` → to `[5.5, 7.5, -12]`, `[0, 1.5, 6]`.
- **Personajes:** `Alba, Rafa, Reme, Luis` `wave` (0,3 s, 3 s); `Tere, Manolo` `clap` (1,5 s, 2,5 s); Carmen, Rubén y Lucía en idle.
- **Texto (tarjeta-verbo):** «Baja a la calle.»
- **UI:** oculta.
- **Transición:** corte a Marisa.
- **1:1:** `cx = 900` (el telón y el atril quedan algo a la izquierda del centro durante el arco).

### 06 · Marisa (globo + balbuceo) · 0:16.5–0:20.0 (3,5 s)
- **Escena/estado:** igual. Protagonista colocado en `(-3.9, 0.02, 5.2)` mirando a Marisa (`rotation.y ≈ -0.6`), de espaldas a cámara a la izquierda del cuadro.
- **Cámara:** plano 2 de la cinemática `plaza`: from `[-3.5, 1.75, 4.3]`, `[-5, 1.5, 6.7]` → to `[-3.85, 1.6, 4.85]`, `[-5, 1.5, 6.7]`. **No usar la cámara de seguimiento**: en diálogo la tapa la fachada de la panadería (`artifacts/05-dialogue.png`).
- **Personajes:** `Marisa` `wave` (0,0, 1,2 s) → `talk` (1,0, 2,5 s).
- **Texto:** **globo de diálogo del juego** anclado a Marisa (no subtítulo): «¡Anda, el del argumentario! Ven, que te lo traduzco.» (`cinematics.plaza.subs[1]`). El balbuceo suena con su tono.
- **UI:** solo el globo.
- **Transición:** corte.
- **1:1:** `cx = 1000`. El globo debe caer dentro del recorte (el globo se limita a pantalla; en 1:1 conviene 2.ª pasada si se sale).

### 07 · Paco · 0:20.0–0:22.5 (2,5 s) · *recortable*
- **Escena/estado:** igual. Paco en `(6.3, 0, -1.5)`, mira -X.
- **Cámara:** plano 3 de la cinemática `plaza`: from `[4.6, 1.75, -0.4]`, `[6.3, 1.4, -1.5]` → to `[4.35, 1.6, -1.0]`, `[6.3, 1.4, -1.5]`.
- **Personajes:** `Paco` `talk` (0,0, 1,8 s) → `nod` (1,8 s); `Tere` `clap` al fondo.
- **Texto:** globo de Paco: «Y el café se paga, que no es una medida.» (final de `cinematics.plaza.subs[2]`).
- **Transición:** corte.
- **1:1:** `cx = 960`.

### 08 · El atril · 0:22.5–0:27.0 (4,5 s)
- **Escena/estado:** plaza, misión `speech`. `jumpTo('speech')`; protagonista en `(0, 0.02, 8)`, `rotation.y = π` (lo que hace `experiences.js` → `speech`). `game.reaction = 'cheer'` a los 2,4 s.
- **Cámara:** por encima del público hacia el atril, con el telón del partido detrás: from `[0.8, 3.2, 0.6]`, `[0, 1.4, 7.8]` → to `[0.4, 2.6, 2.4]`, `[0, 1.5, 7.8]`. **Comprobar** que la cabeza de Reme (`crowd2`, `(-0.5, 3.5)`) no tape al protagonista en el primer tercio; si lo hace, `x += 0.5`.
- **Personajes:** `Tú` `talk` todo el plano + `cheer_arms` (3,0 s, 1 s); público `idle_look` hasta 2,4 s y luego `cheer`.
- **Texto:** 0,3 s tarjeta-verbo «Da la cara.»; a los 2,6 s, el botón de timing del juego como pegatina: «¡Y por eso me presento!» (`speech.timing.button`), con el aplauso.
- **UI:** paneles del discurso ocultos (solo la pegatina del botón, recreada por el tráiler o capturada).
- **Transición:** corte a ritmo (en el primer golpe de la pista trend).
- **1:1:** `cx = 960`.

### 09 · Minijuego viral · 0:27.0–0:32.0 (5,0 s)
- **Escena/estado:** plaza, misión `video`, minijuego `ViralGame` en fase `play`, toma `chairs` («El baile de las sillas»). `jumpTo('video')`, `memories.daniTrend = true`, arrancar el minijuego con la elección `chairs`. Avanzar la partida hasta el **beat 8** (combo en marcha, contador de vistas ya en miles) antes de grabar; puntuar todas las notas en perfecto (autoplay del tráiler).
- **Cámara:** `stageCamera` del minijuego empujada: from `[4.2, 2.0, 0.6]`, `[5.3, 1.25, 6.0]` → to `[4.6, 1.8, 2.2]`, `[5.4, 1.3, 6.0]`, fov 0,8.
- **Personajes:** `Tú` sigue la carta (`wave` / `cheer_arms` / `clap` / `shrug` según la nota). Los mirones (`Alba, Rafa, Reme, Luis, Marisa`) hacen `cheer` cada 4 de combo (lo hace el propio juego).
- **Texto:** tarjeta-verbo «Hazte viral.» (0,2–1,8 s). Luego manda la UI del juego: marco REC, carril de notas, «¡PERFECTO!» y el contador de visualizaciones subiendo.
- **UI:** HUD del minijuego **visible** (es el plano); HUD general oculto.
- **Transición:** corte a la sede.
- **1:1:** **2.ª pasada 1:1** (el carril de notas va de lado a lado).

### 10 · La sede · 0:32.0–0:36.0 (4,0 s)
- **Escena/estado:** sede, misión `hqBrief`. `jumpTo('hqBrief')`. Lola `(-2, 0, 2.7)`, Dani `(0, 0, 3.2)`, Nico `(2, 0, 2.7)`, todos mirando -Z.
- **Cámara:** 0–1,4 s dolly del plano 1 de la cinemática `hq` (from `[0, 3.6, -7.3]`, `[0, 1.2, 2.5]` → `[0, 2.6, -3.2]`, `[0, 1.3, 2.8]`); 1,4–4,0 s corte a Nico: from `[1.25, 1.75, 0.7]`, `[2, 1.45, 2.7]` → to `[1.45, 1.68, 1.1]`, `[2, 1.45, 2.7]`.
- **Personajes:** `Lola, Dani, Nico` `wave` (0,0, 1,4 s); `Nico` `talk` (1,4 s, 2,0 s) → `cheer_arms` (3,4 s).
- **Texto:** **subtítulo B principal** (estilo de subtítulo del juego, nombre en color): **Nico — «Orden del día: uno, sillas. Dos, quién trae hielo. Tres, España.»**
- **UI:** oculta.
- **Transición:** corte.
- **1:1:** `cx = 1000` en el plano de Nico.

### 11 · El debate (presentación de rivales) · 0:36.0–0:40.0 (4,0 s)
- **Escena/estado:** salón, misión `debate`. `jumpTo('debate')`. Protagonista en su atril `(-0.4, 0.57, 3.9)`, `rotation.y = π`. Rival A (Fermín Aguardo, Partido Paciente) `(1.1, .55, 3.9)`; Rival B (Nuria Giro, Partido Sobrevivo Otra Elección) `(2.6, .55, 3.9)`; Rival C (Covadonga del Muro, Fox) `(4.1, .55, 3.9)`; Moderadora `(1.1, .55, 5.7)`. Etiqueta `results` → «DEBATE · BLOQUE 1».
- **Cámara:** travelling lateral elevado, **por encima** de las cabezas del público (el plano 1 de la cinemática `hall` queda tapado por las cabezas: ver `debate-fox-hall-1-wide.png`): from `[-1.2, 3.4, -2.6]`, `[1.9, 1.6, 4.0]` → to `[0.6, 2.8, -0.4]`, `[2.6, 1.6, 4.0]`.
- **Personajes:** `Moderadora` `talk` (0,0); `Rival A` `nod` (0,6); `Rival B` `talk` (1,4); `Rival C` `idle_look` → `cheer_arms` (2,6). Público `Ana…Fina` `clap` (0,0, 1,5 s).
- **Texto:** rótulos de nombre anclados al mundo sobre cada rival (aparecen escalonados a 0,4 / 0,9 / 1,4 s):
  `Fermín Aguardo · PARTIDO PACIENTE` · `Nuria Giro · PARTIDO SOBREVIVO OTRA ELECCIÓN` · `Covadonga del Muro · FOX`. Tarjeta-verbo a 2,6 s: «Sobrevive al debate.»
- **UI:** oculta (los atriles solo ponen «CANDIDATURA»: los rótulos lo arreglan).
- **Transición:** corte a Fox.
- **1:1:** **2.ª pasada 1:1** con la cámara 1,5 m más atrás (`z −1.5`), para que entren los cuatro atriles.

### 12 · Fox y el caballo · 0:40.0–0:44.0 (4,0 s)
- **Escena/estado:** igual.
- **Cámara:** `FOX_SHOT` de `cinematics.js`: from `[2.7, 2.35, 0.3]`, `[4.0, 1.75, 3.9]` → to `[3.0, 2.25, 0.85]`, `[4.05, 1.75, 3.9]`.
- **Personajes:** `Rival C` `talk` (0,0, 3,0 s); `Rival B` `shrug` (2,8 s); `Rival A` `disappointed` (3,0 s).
- **Texto:** **subtítulo B principal: Covadonga del Muro (Fox) — «He dejado el caballo en doble fila. Si se lo llevan, es ideología.»** (`foxDebate.hallLine`).
- **UI:** oculta.
- **Transición:** corte.
- **1:1:** `cx = 1150` (Fox a la derecha del cuadro en el máster; ver `debate-fox-hall-3-fox.png`).

### 13 · Duelo de réplicas · 0:44.0–0:48.0 (4,0 s)
- **Escena/estado:** salón, minijuego `DuelGame`, **ronda 5 / 5 (Fox, «Seguridad»)**, fase `answer`. Saltar a la ronda 5 y avanzar el reloj hasta `INTERRUPT_AT` (3,5 s), para que el plano empiece con la interrupción.
- **Contenido:** 0,0 s: «¡Te interrumpen!» + subtítulo de Fox «Excuse me! Sin complejos…» → 1,6 s: Espacio (pedir la palabra; subtítulo «Déjeme terminar, que esto no es una rueda de prensa.») → 2,4 s: respuesta 1 (la correcta) → botón en verde, público `clap`, `Rival C` `disappointed`, reacción de Fox: «Hombre. Eso no es de derechita cobarde. Por esta vez.»
- **Cámara:** la del minijuego, con push ligero: from `[3.85, 3.1, -1.9]`, `[3.85, 1.45, 3.9]` → to `[3.6, 2.9, -1.2]`, `[3.7, 1.45, 3.9]`, fov 0,95.
- **Texto:** el del panel del juego. Tarjeta pequeña arriba a la izquierda: «Duelo de réplicas.»
- **UI:** panel del duelo **visible**; HUD general oculto.
- **Transición:** corte.
- **1:1:** **2.ª pasada 1:1** (el panel ocupa el 40 % derecho del máster).

### 14 · La parada del 27 · 0:48.0–0:50.5 (2,5 s) · *recortable*
- **Escena/estado:** plaza con salida pendiente a la parada. `gameDebug.jumpToExit('finalSpeech')` (deja `finalPrep` hecha y la baliza `busStop` activa en `(-6.45, 0, -11.2)` con el cartel «BUS 27»). Protagonista desde `(-4.0, 0.02, -8.0)` hasta `(-6.2, 0.02, -11.0)`, caminando (dirección por script, no correr).
- **Cámara:** from `[-2.2, 1.8, -7.6]`, `[-6.4, 1.1, -11.0]` → to `[-3.4, 1.6, -9.0]`, `[-6.6, 1.2, -11.2]`. El quiosco y la marquesina deben verse; el coche `(-3, -13.9)` queda detrás.
- **Personajes:** `Tú` andando; `Rubén` (repartidor) idle.
- **Texto:** la pastilla «E · Parada · Coger el 27 al salón» del juego **visible** (es el chiste) + tarjeta «Transporte público, como el votante medio.» (`travel.finalSpeech.title`).
- **UI:** solo la pastilla E y la señal; HUD oculto.
- **Transición:** corte a negro de 4 frames → mitin (el «viaje en bus»).
- **1:1:** `cx = 1020`.

### 15 · El último mitin · 0:50.5–0:54.5 (4,0 s)
- **Escena/estado:** salón, misión `finalSpeech`, minijuego `RallyGame` en `play`. Avanzar la partida hasta la frase 7 («…ya sabéis dónde está la PANADERÍA»); autoplay en perfecto. A los 2,2 s, frase 12: «¡Pues me PRESENTO!» (saltar las intermedias con un corte invisible si hace falta).
- **Cámara:** `stageCamera` del mitin con push: from `[-4.6, 2.3, 5.4]`, `[-1.0, 1.0, -0.8]` → to `[-4.2, 2.1, 4.6]`, `[-1.0, 1.1, -0.8]`, fov 0,85.
- **Personajes:** `Tú` `talk` → `cheer_arms` en cada remate; público `Ana…Fina` `clap` en cada perfecto (lo hace el juego) + `jump` a los 3,2 s.
- **Texto:** la frase del juego («rally-phrase») como texto principal. Tarjeta pequeña: «El último mitin.»
- **UI:** frase y medidor de atención visibles; HUD general oculto.
- **Transición:** corte en el golpe de «¡PRESENTO!» → noche electoral.
- **1:1:** **2.ª pasada 1:1**.

### 16 · Noche electoral · 0:54.5–0:60.0 (5,5 s) · CLÍMAX
- **Escena/estado:** salón, misión `election`. `jumpTo('election')` → `gameDebug.simulateElection('victory')` → `setup` de la cinemática `victory` (`endingSetup`: protagonista en `(-1, 0.02, 0.6)`, `rotation.y = 0.35`, pantalla con «NN/100 · ¡SUPERA EL 48!»).
- **Cámara:** 0–2,0 s plano 1 de `victory` (pantalla de resultados): from `[4.0, 2.1, 1.4]`, `[4.6, 2.0, 5.6]` → `[4.3, 2.05, 2.3]`, `[4.6, 2.0, 5.6]`; 2,0–5,5 s plano 2 (público y protagonista desde el escenario): from `[-0.4, 2.7, 3.5]`, `[-0.7, 1.1, -0.6]` → to `[0.5, 2.3, 3.1]`, `[-0.7, 1.1, -0.6]`.
- **Personajes:** a 2,0 s: `Ana…Fina` `cheer` (8 s), `Tú` `cheer_arms` (2 s) → `jump` (4,0 s, 1,5 s).
- **Texto:** a 0,2 s **subtítulo B principal: Periodista — «Todos los partidos dicen que han ganado. Por una vez, uno tiene razón.»** (recorte de `cinematics.victory.subs[0]`). A 2,0 s, banner del juego «NOCHE ELECTORAL · ¡Victoria!» + **confeti 140**.
- **UI:** banner y confeti; HUD oculto.
- **Transición:** fundido a blanco cálido `#fff7e6` (12 frames).
- **1:1:** `cx = 960` en el plano 2; `cx = 1180` en el plano 1 (pantalla de resultados).

### 17 · Logo · 0:60.0–0:63.5 (3,5 s)
- **Fondo:** plaza en grúa lenta y desenfocada (blur ~8 px, 70 % de opacidad bajo una capa crema): from `[5.5, 7.5, -12]`, `[0, 1.5, 6]` → to `[0, 9, -15]`, `[0, 1.5, 6]`. Personajes en `idle`.
- **Texto:** logo «Pues me presento» (Fredoka 700, tinta `#2b2140`, contorno y sombra dura `0 6px 0` como la UI), entra con `--pop`. Debajo, más pequeño: «Un juego de sátira política.»
- **1:1:** centrado; sirve igual.

### 18 · Firma + CTA · 0:63.5–0:68.0 (4,5 s)
- **Fondo:** continúa el del 17.
- **Texto (tres líneas, escalonadas 0,0 / 0,5 / 1,0 s):**
  1. «Hecho por Freddy · github.com/freddysae0»
  2. «Babylon.js · Blender · Vite» (en chips, como los chips del juego)
  3. CTA: **«¿Qué propuesta llevarías tú? Te leo en comentarios.»**
- Se queda fijo los últimos 2 s (LinkedIn repite en bucle: que el último fotograma se lea).
- **1:1:** centrado.

**Duración total: 68,0 s.**

---

## 4. Tarjetas y subtítulos: ES / EN

| Plano | Español | English |
|---|---|---|
| 01 | (feed) «Se vienen elecciones.» | (feed, traducir en el propio feed o subtítulo) "Snap election incoming." |
| 02 | «Pues yo tengo una propuesta.» | "Well… I've got a proposal." |
| 03 | «Monta un partido con tus amigos.» · Dani: «Cada mañana a las 7:00, argumentario en el grupo.» | "Start a party with your mates." · Dani: "Talking points in the group chat. 7 a.m. sharp." |
| 04 | «Registrado en cero días hábiles.» | "Registered in zero working days." |
| 05 | «Baja a la calle.» | "Hit the streets." |
| 06 | Marisa: «¡Anda, el del argumentario! Ven, que te lo traduzco.» | Marisa: "Oh, it's the talking-points guy! Come here, I'll translate." |
| 07 | Paco: «Y el café se paga, que no es una medida.» | Paco: "And you pay for the coffee. It's not a policy." |
| 08 | «Da la cara.» · «¡Y por eso me presento!» | "Face the crowd." · "And that's why I'm running!" |
| 09 | «Hazte viral.» | "Go viral." |
| 10 | Nico: «Orden del día: uno, sillas. Dos, quién trae hielo. Tres, España.» | Nico: "Agenda: one, chairs. Two, who's bringing ice. Three, Spain." |
| 11 | «Sobrevive al debate.» + rótulos de rivales | "Survive the debate." (party names stay in Spanish) |
| 12 | Fox: «He dejado el caballo en doble fila. Si se lo llevan, es ideología.» | Fox: "I double-parked my horse. If they tow it, that's ideology." |
| 13 | «Duelo de réplicas.» | "Comeback duel." |
| 14 | «Transporte público, como el votante medio.» | "Public transport, like the average voter." |
| 15 | «El último mitin.» | "The final rally." |
| 16 | Periodista: «Todos los partidos dicen que han ganado. Por una vez, uno tiene razón.» | Reporter: "Every party claims victory. For once, one of them is right." |
| 17 | «Pues me presento» · «Un juego de sátira política.» | "Pues me presento" (keep title) · "A political satire game." |
| 18 | «¿Qué propuesta llevarías tú? Te leo en comentarios.» | "What would your proposal be? Tell me in the comments." |

Las tres líneas principales del guion B son las de los planos 10, 12 y 16; las de 06 y 07 son de apoyo. Ninguna necesita contexto. La versión EN tiene un límite: los planos con UI del juego (feed, duelo, mitin) siguen en español. Para la versión EN, o se asume como «juego en español con subtítulos», o se sustituye el texto de la UI por un subtítulo traducido encima.

**Legibilidad sin sonido:** tarjetas-verbo de ≤ 5 palabras (≥ 1,2 s en pantalla); subtítulos de ≤ 75 caracteres (≥ 2,8 s). Tamaño mínimo: 56 px en 1080p, para que se lea en el móvil dentro del feed de LinkedIn. Las tarjetas van siempre dentro de la zona segura 1:1 (x 420–1500) aunque se exporte en 16:9.

**Sin aviso de ficción.** Los rivales son parodias explícitas con nombres inventados y el juego ya lleva el aviso inicial y la línea de créditos. Si LinkedIn o el creador lo pidieran, la opción mínima sería añadir «Partidos y personajes inventados.» en cuerpo pequeño en la línea 2 del plano 18. No se recomienda.

---

## 5. Música y sonido

Pistas en `public/assets/music/` (la ruta real; `public/music/` no existe):

| Pista | Duración | Calidad | Uso en el tráiler |
|---|---|---|---|
| `mus_theme_01.mp3` | ≈148,6 s | 192 kbps CBR | **Lecho principal** (es la única a 192 kbps; el resto son 64 kbps VBR y se nota en altavoz) |
| `mus_trend_01.mp3` | 142,4 s | 64 kbps | Inserto bajo el minijuego viral |
| `mus_speech_01.mp3` | 140,0 s | 64 kbps | Alternativa para el mitin (no recomendada por calidad) |
| `mus_plaza_01.mp3`, `mus_hq_01.mp3`, `mus_crisis_01.mp3`, `mus_flat_01.mp3` | 60 / 172,6 / 30 / 178,4 s | 64 kbps | No se usan |

**Edición propuesta** (tiempos del tráiler; los «desde» son tiempos de la pista medidos tras recortar el silencio inicial como hace `music.js` → `bounds()`):

- **0:00–0:04.5:** sin música. Suenan los loops sintetizados del propio feed (`feedLoops.js`: `pasodoble` → `trap` → `news`), un *whoosh* en cada swipe y el `uiSounds.confirm` en el clic de «Pues yo tengo una propuesta».
- **0:04.5:** entra `mus_theme_01` **desde 0:00** con ataque seco (sin fundido), sincronizado con el corte al plano 02.
- **0:27.0–0:32.0:** el tema baja a −∞ en 0,15 s y entra `mus_trend_01` (a 96 BPM, como `VIRAL_BPM`) desde su primer compás de estribillo. Punto **a elegir a oído**; candidato inicial: 0:16. Encima, los tonos de acierto del minijuego (784 Hz perfecto).
- **0:32.0:** vuelve el tema **en continuidad**: se deja sonar silenciado por debajo, de modo que retoma en su posición 0:27,5.
- **0:54.5 (confeti):** debe coincidir con un golpe fuerte del tema. Si no coincide, **desplazar el offset de inicio del tema** (no cortar en el clímax). El tráiler puede calcular la envolvente RMS cada 50 ms con `decodeAudioData` y escoger el offset que pone un ataque a ±1 frame de 0:54.5.
- **0:60.0–0:68.0:** el tema sigue bajo el logo; fundido de salida de 0:65.5 a 0:68.0.
- Música a −14 LUFS integrados (norma de redes); efectos 3–6 dB por debajo.

**Momentos de sonido** (todo local, sin samples externos: lo que ya genera el juego):

| t | Sonido | Origen |
|---|---|---|
| 0:01.4 / 0:02.5 | whoosh de swipe | crear con `blip` de `sfx.js` (barrido 1200→400 Hz) |
| 0:04.3 | confirm (tres notas) | `uiSounds.confirm` |
| 0:07.0–0:11.0 | balbuceo de Dani y Lola | `audio.chatter` |
| 0:12.4 | click | `uiSounds.click` (registro) |
| 0:16.5 / 0:20.0 | balbuceo de Marisa / Paco | `audio.chatter` (tono propio por NPC) |
| 0:25.1 | aplauso | balbuceo de público o ruido filtrado |
| 0:27–0:32 | tonos de ritmo | `Rhythm.judge` |
| 0:32–0:48 | balbuceos de Nico, Fox y moderadora | `audio.chatter` |
| 0:46.4 | tono de acierto 660 Hz | `DuelGame.answer` |
| 0:48–0:50.5 | pasos en adoquín | `footstep(…, 'plaza')` |
| 0:54.5 | confeti + `confirm` | `ui.confetti` |

Recordatorio: la mayoría lo verá **sin sonido**. El audio es un extra y nada del guion puede depender de él.

---

## 6. Corte alternativo de 45 s

Quitar los planos 04, 07, 10 y 14, y acortar: 01 → 4,0; 02 → 2,0; 03 → 3,0; 05 → 3,0; 06 → 3,0; 08 → 3,5; 09 → 4,0; 11 → 3,0; 12 → 3,5; 13 → 3,0; 15 → 3,5; 16 → 4,5; 17 → 2,5; 18 → 3,0. Total: 45,5 s (`cut45` en `shots.draft.js`). Se pierden la línea de Nico y el gag del 27; la de Fox y la de la periodista se mantienen.

---

## 7. Riesgos y comprobaciones antes del máster

1. **Pasada de prueba de cada plano** a 1920×1080 y revisión de capturas (como `tools/*-review.mjs`): oclusiones (plano 08 con Reme; plano 11 con el público), que los globos y los rótulos queden dentro del cuadro y que no aparezca «Partido de prueba».
2. **Gestos:** los clips tienen retardo de reacción y un gesto nuevo espera a que se desvanezca el anterior (`character.js`). Por eso los `at` van ~0,3 s adelantados; si un gesto no llega a verse, alargar su `dur` antes que encadenar otro.
3. **Minijuegos:** el tráiler necesita un autoplay determinista (pulsar cada nota en `n.t` exacto) y poder saltar a la ronda 5 del duelo y a la frase 7 o 12 del mitin. Hoy no existe API para eso. Es trabajo del agente de grabación, y solo en dev.
4. **Validación humana pendiente:** no se ha revisado a oído si los puntos de corte de música funcionan, ni se ha probado el tráiler con alguien que no conozca el juego para comprobar que los chistes se entienden sin contexto.
5. **Sin trampas:** el tráiler enseña mecánicas que existen. Las cámaras de los planos son cinematográficas, pero toda la UI y todas las situaciones salen del juego real.
