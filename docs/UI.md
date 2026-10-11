# UI — kit de interfaz

Dirección: cozy cartoon (Animal Crossing / Portal Knights). Papel crema, contorno tinta gruesa (`--ink`), botones con sombra sólida 3D que se hunden al pulsar, formas redondas, colores saturados. Tipografías locales SIL OFL en `src/ui/fonts/` (Fredoka para títulos/botones, Nunito para lectura) con sus licencias. Iconos SVG inline propios (`icon()`), sin CDN.

## Capas DOM (`index.html`)

| Capa | z | Uso |
|---|---|---|
| `#hud` | 3 | Marca del partido, 4 medidores (apoyo, credibilidad, organización, alcance, con marca del umbral 48), libreta de objetivo, chuleta de controles. Se construye una vez y se parchea: los cambios de stat rebotan y muestran `+N`/`−N`. |
| `#interaction` | 4 | Prompt `E` + etiqueta. `UI.interaction()` solo toca el DOM cuando cambia el objetivo. |
| `#dialogue` | 10 | Globo anclado en 3D (`src/dialogue/dialogue.js`). Cinta con color por hablante (`speakerColor`), cola que apunta al personaje (`--tail`), respuestas numeradas. |
| `#cinema` | 15 | Letterbox, subtítulos, banners de capítulo, confeti. |
| `#overlay` | 20 | Pantallas modales. Clase del backdrop: `menu`, `speech-overlay`, `loading-screen`, `win`, `loss`. |
| `#phone-button` | 5 | Botón del móvil (abajo a la derecha) con badge de no leídas; solo en modo `play` y tras la misión `phone`. Vibra (`.buzz`) al llegar notificaciones. |
| `#smartphone` | 30 | Móvil del jugador (`src/ui/smartphone.js`), solo visible con `body[data-mode=phone]`. |
| `#toast` | 40 | Notificación con icono. |

`body[data-mode]` refleja `game.mode`; el CSS lo usa para atenuar HUD en diálogo/modal y **congelar animaciones con vida (toast, banner, confeti) en pausa** (regla 6). Los temporizadores visuales son animaciones CSS, no `setTimeout`.

## API (`src/ui/ui.js`)

Marcado (devuelven strings; los ids siempre los pasa quien llama):

- `panel(eyebrow, title, body, footer?, { variant, icon, className })` — variantes `paper` (defecto), `board` (corcho), `form`, `pause`, `settings`, `credits`, `win`, `loss`.
- `choiceList([{ id, title, detail?, effect?, extra? }], { className })` — botones numerados; `main.js` mapea teclas 1–9 a `.choice-list button`. `className: 'two-col'` para 4+ opciones.
- `buttons([{ id, label, kind: 'primary'|'secondary'|'danger', icon }])`
- `statChips(effect)`, `resultStats(values, { signed })`
- `keycap('E')`, `icon(name)`; nombres en `ICONS`.
- `meterBar(value, { label, color, id })` + `setMeter(el, v)` — barra para minijuegos.
- `timingTrack({ zone: [a, b] })` — el juego mueve `.timing-cursor` con `style.left`.
- `speakerColor(name)`

Métodos de `game.ui`:

- `show(html, backdropClass)`, `hide()`, `on(id, fn)`
- `transition(text)` — pantalla de carga/transición.
- `toast(text, { icon, kind: 'info'|'good'|'bad' })`
- `letterbox(bool)`, `subtitle(speaker, text)` / `subtitle(null)`, `banner(eyebrow, title, { icon, kind })`, `confetti(n)`
- `onDispose(fn)` — limpieza al siguiente `show()`/`hide()`. **No** usarlo para recursos que sobreviven a redibujos (los retratos de `portraits.js` se gestionan solos).
- `stash()` / `restore(s)` — la pausa saca los nodos del overlay sin destruirlos y los devuelve intactos.

## Reglas para cinemáticas y minijuegos

- Cinemática: `ui.letterbox(true)` oculta el HUD; usar `subtitle()` si no hay globo 3D. Cerrar con `letterbox(false)` y `subtitle(null)`.
- Minijuego: panel en `speech-overlay` (abajo a la derecha, mundo visible) o centrado; barras con `meterBar`/`timingTrack`; botón de acción con `keycap('Espacio')`; resultados con `resultStats`.
- Mantener ids estables usados por `tools/*.mjs` (ver lista en el informe de la refactorización: `#new`, `#continue`, `#hud`, `#overlay`, `#interaction`, `#dialogue`, `#idea`, `#job-N`, `#next-friend`, `#finish-call`, `#party-name`, `#proposal-*`, `#speech-N`, `#hit`, `#finish-speech`, `#flow-N`, `#retry-election`, `#credits-win`, `#menu-win`, `#resume`, `#save-menu`). El texto del HUD debe incluir el lugar (`EL BARRIO`…) y el título de la misión.
- `prefers-reduced-motion` desactiva rebotes y confeti.

## Cinemáticas y minijuegos implementados (v0.3)

- `src/cinema/director.js`: `Director` (rig de cámara propio interpolado por `update(dt)`, eventos `sub`/`act`/`banner`/`confetti`/`fx`/`run`), `Actors` (gestos por personaje vía `world.acting`; `'Tú'` = `game.playerGesture`) y `stageCamera()` (cámara fija temporal). Datos en `src/data/cinematics.js`. Pista `.skip-hint` («Espacio saltar») en `#cinema`.
- `src/minigames/runner.js`: tarjeta de intro (`#mg-start`, `#mg-skip`) → HUD de juego en `#overlay.minigame-overlay` (botón `#mg-skip-play`) → tarjeta de resultado (`#mg-accept`, `#mg-retry`). Teclas: Espacio/Enter empezar o aceptar, `R` repetir, `X` saltar sin bonus, `Esc` pausa. Los botones del HUD de juego tienen `tabindex=-1` y se quita el foco para que Espacio/flechas lleguen al juego.
- Estilos en `src/ui/minigames.css`: `.mg-card`, `.mg-howto`, `.mg-hud`, `.mg-top`, `.mg-bottom` (panel inferior), `.chip-big`, `.rhythm-lane`/`.rhythm-note`/`.rhythm-judge`/`.rhythm-count`, `.rec-frame` (marco del móvil), `.rally-phrase`, `.duel-panel`/`.duel-interrupt`, `.chairs-card`/`.chairs-row`. Durante `minigame` el subtítulo sube bajo `.mg-top`.
- Ids de minijuego para pruebas: `#mg-start`, `#mg-skip`, `#mg-skip-play`, `#mg-accept`, `#mg-retry`, `#duel-0..2`.

## Móvil del jugador (tecla M)

- `src/ui/smartphone.js` (`Smartphone`, creado en `main.js`) + `src/ui/smartphone.css`. Lógica pura en `src/state/phone.js`; textos en `src/data/phoneNews.js` (convención del guion: cadena o `(state, ctx)` con `rivals`, `party`, `poll`).
- Se abre en exploración (`play`) con `M` o `#phone-button`; el juego pasa a modo `phone` (sin simulación, como un menú; música atenuada). Se cierra con `M`, `Esc`, `#phone-close` o clic fuera. No se abre desde pausa, diálogos, modales ni minijuegos. `Esc` con el móvil fuera lo guarda (no pausa).
- Apps en `role=tablist`: `1`–`3` o `←`/`→` (`#sp-tab-news`, `#sp-tab-poll`, `#sp-tab-programs`); `↑`/`↓`/`RePág`/`AvPág` desplazan `#sp-panel`; `Tab` queda atrapado en el móvil. El resto de teclas (E, WASD, Espacio) se ignoran mientras está fuera.
- Notificaciones: se desbloquean al completar misiones y según decisiones/memorias; `refreshHUD()` llama a `phone.sync()`, que solo anuncia (toast + vibración) en modo `play`. Abrir Avisos las marca leídas (`state.phoneRead`), y al cerrar se autoguarda si no hay transacción abierta.
- Encuesta: barras con color de partido, marca discontinua del umbral, tendencia ↑/↓ respecto a la misión anterior. Animaciones solo CSS (subida del móvil, barras, vibración); `prefers-reduced-motion` las anula con la regla global.
