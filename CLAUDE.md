# Pues me presento

Juego narrativo 3D de sátira política. Stack fijo: Babylon.js + JS ES modules + Vite + HTML/CSS; modelos en Blender → GLB. Sin React ni TypeScript.

## Visión

- **Historia**: un ciudadano español corriente ve en TikTok que el presidente convoca elecciones y piensa "yo tengo una propuesta". Llama a sus amigos (pantalla dividida), los convence de fundar partido ofreciéndoles cargos y se registra como candidato. Luego: discursos, convencer oyentes, subir tiktoks, hacer trends, crear programa, ganar votantes.
- **Final**: ganar → créditos → menú principal. Perder → pantalla de reintentar.
- **Duración**: objetivo ≥ 2 h de juego jugable hasta el final. No afirmarlo sin partidas reales medidas.
- **Estilo visual**: Portal Knights — ver `docs/reference/style-portal-knights.png`. TODO low poly, flat shaded, colores saturados y alegres, personajes chibi cabezones, vegetación estilizada, cielo con nubes suaves.
- **Diálogo**: globos integrados artísticamente que salen del personaje; balbuceo sintetizado semi-aleatorio con pitch distinto por NPC mientras habla.
- **Animaciones**: Quaternius Universal Animation Library. Hasta tener el paquete real en el repo y validar su rig (idle/caminar/correr) en Blender, se usan las animaciones procedurales de `src/npc/`.
- Políticos y partidos rivales ficticios; nada se publica en redes reales. No repetir en el juego que es ficción: solo el aviso inicial (antes del menú, en cada arranque) y una línea en los créditos.

## Comandos (PowerShell, usar `npm.cmd`)

- `npm.cmd run dev` → http://127.0.0.1:5173 · `build` → `dist/` · `preview` → http://127.0.0.1:4173
- `npm.cmd test`: dominio y persistencia (Node).
- `test:browser` y `test:recovery`: Playwright, requieren dev activo.
- `test:production`: recorrido con teclado sin API debug, requiere preview activo; depende de tiempos de pulsación.
- `npm.cmd run desktop:dev`: Vite + ventana Electron (F12 DevTools, Ctrl+R, F11). `desktop`: build y abre `dist/` vía `app://`. `test:desktop`: Playwright sobre Electron, requiere build.
- `npm.cmd run assets [categoría…]`: regenera el kit con Blender 5.0 (`tools/blender/build_all.mjs`, ruta en `BLENDER`) → GLB en `public/assets/`, `.blend` y previews en `art/`.

## Estructura

`src/main.js` (ciclo, pausa, transiciones) · `world/` escenas y GLB · `player/` tercera persona, colisión, cámara · `npc/` · `dialogue/` · `data/` contenido declarativo (misiones, amigos, propuestas, diálogos) · `state/` progresión pura + validación · `ui/` · `audio/` · `save/` adaptador (futuro IPC Electron) · `assets/` catálogo · `cinema/` director de cinemáticas (datos en `data/cinematics.js`) · `minigames/` minijuegos (puntuación en `state/minigames.js`) · `dev/` debug solo con `import.meta.env.DEV`.

Antes de ampliar, leer `docs/STATUS.md`, `docs/MILESTONES.md`, `docs/ART.md`.

## Reglas

1. Misiones estrictamente ordenadas e idempotentes; avanzar con `advance`. Contenido nuevo define objetivos, inicio, fin, consecuencias y recuperación.
2. Guardar solo en puntos seguros. Llamadas y conversaciones son transacciones: abandonar restaura la instantánea previa. Al recargar, posición vuelve a la entrada segura del escenario; el progreso se conserva.
3. En pausa no corre simulación, timers, texto ni audio; no destruir nodos DOM.
4. Todo recurso local: sin CDN, fuentes remotas ni voz externa. `base: './'`. Electron en `electron/main.cjs`: renderer sin Node (sandbox), red externa bloqueada; sin Steamworks ni instalador.
5. Distinguir siempre: implementado vs. probado automáticamente vs. inspección visual vs. validado por humanos.

## Debug (solo dev)

`gameDebug.state()`, `entities()`, `teleport(id | x, z)`, `camera(yaw, pitch)`, `metrics()`, `reset(1)`, `loadChapter(1 | 3)`, `simulate('good-speech' | 'bad-speech')`. No usarlo para tapar bloqueos jugables.

## Siguiente paso

Milestone 3: convertir decisiones provisionales en misiones 3D con contenido real, manteniendo recorrido completo, checkpoints y pruebas de victoria/derrota.
