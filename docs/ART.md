# Integración artística

Referencia de estilo: `docs/reference/style-portal-knights.png` (Portal Knights: low poly, flat shaded, saturado, chibi). Manda sobre la paleta provisional de abajo.

## Convenciones

- 1 unidad = 1 metro. Personaje provisional ~2 m caricaturesco. Blender Z arriba; exportar GLB con Y arriba; en Babylon Y arriba, personaje mira +Z. Verificar orientación tras importación por conversión glTF; no corregir todos los assets con rotaciones dispersas.
- Aplicar rotación/escala en Blender. Pivote props en centro de apoyo al suelo; personajes entre los pies; puertas en bisagra. Geometría flat shaded y siluetas legibles.
- `prop_<nombre>_<nn>.glb`, `char_<nombre>_<nn>.glb`, `env_<escena>_<nn>.glb`; fuentes bajo `art/`, generadores bajo `tools/blender/`, ejecución bajo `public/assets/`.
- Materiales `MAT_<nombre>`, paleta terracota, verde apagado, crema y azul pizarra. Roughness ≥ .8; sin mapas externos necesarios para props actuales. Reducir materiales compartiendo paleta. Transparencia solo donde aporte.
- Colisión simplificada en catálogo; nunca colisión triángulo a triángulo de un personaje detallado. Props separan collider invisible de GLB; cámara usa metadato `cameraBlock`. Personaje usa elipsoide y suelo.
- Esqueleto futuro: un root al suelo, jerarquía humanoide estable; registrar nombres y rest pose exactos en catálogo. Animaciones locomoción in-place, no root motion para esta cámara/controlador. No prometer compatibilidad hasta probar retargeting con archivo real.
- Mapa semántico previsto: idle, walk, run, talk, cheer, point, shrug; transiciones 120–200 ms. Catálogo actual solo declara los cinco estados procedurales realmente disponibles, con fallback explícito. No son clips Quaternius.

## Archivos disponibles e inspeccionados

Blender 5.0.1 detectado en `C:/Program Files/Blender Foundation/Blender 5.0/blender.exe`. `tools/blender/build_props.py` ha exportado tres props y guardado la fuente `art/props.blend`.

| Asset | Ruta | Estado | Animaciones |
|---|---|---|---|
| Banco | public/assets/prop_bench_01.glb | Provisional de Blender, cargado en navegador | Ninguna |
| Atril | public/assets/prop_podium_01.glb | Provisional de Blender, cargado en navegador | Ninguna |
| Jardinera | public/assets/prop_planter_01.glb | Provisional de Blender, cargado en navegador | Ninguna |
| Ciudadanos | src/npc/character.js | Piezas procedurales reemplazables | idle, walk, run, talk, cheer procedurales |

## Quaternius: pendiente exacto

Referencia inspeccionada: https://quaternius.com/packs/universalanimationlibrary.html. La página describe distintas ediciones/formats; esa información NO prueba qué incluye un archivo descargado. No hay ningún paquete Quaternius en este repositorio ni clips suyos integrados. No se ha comprado ni accedido a contenido de pago.

Necesitamos descargar la edición gratuita accesible, conservar su licencia y enumerar sus GLB/FBX y nombres de animación reales. Después validar un personaje con idle, caminar y correr usando su rig o retargeting en Blender, exportar GLB y probar transiciones/colliders. Solo después mapear gestos que realmente estén en el paquete. Los nombres externos permanecen deliberadamente sin asignar. El fallback actual funciona sin red ni esos archivos.

## Preparación escritorio

Recursos locales, rutas relativas (`base: './'`), persistencia mediante adaptador pequeño. Futuro Electron: protocolo local seguro que sirva `dist`, renderer aislado, `contextIsolation: true`, `nodeIntegration: false`, persistencia vía IPC restringido. No se entrega todavía shell Electron ni integración Steam. Build web preparado no equivale a instalador validado.

## Kit generado (v0.3)

Hoja objetivo: `docs/reference/asset-kit-sheet.png`. Inventario: `docs/ASSETS.md`. `npm.cmd run assets [structure|interior|tech_stage_food|campaign|urban|characters]` ejecuta `tools/blender/build_<cat>.py` sobre `tools/blender/kit_common.py` (paleta, primitivas con bevel, `part()` para piezas móviles con pivote, `label()` para texto dinámico, materiales `tint_*` recoloreables, export y hoja `art/previews/<cat>.png`).

- 134 props/entornos + 22 personajes (incl. `char_rival_c_01`, Fox, colores leídos de `src/data/parties.js`), un GLB por asset en `public/assets/` (~35 MB; personajes ~8 MB por los 400 frames de idle).
- Piezas móviles: `prop_door_01` (leaf), `prop_door_double_01` (leaf_l/r), `prop_shutter_paco_01` (shutter, escala Z), `prop_fridge_01` (door), `prop_wall_clock_01` (hand_h/m), `prop_laptop_01` (lid), `prop_cashbox_01` (lid).
- Labels dinámicos: `party_name`, `party_slogan`, `rival_name`, `phone`, `laptop`, `results`, `name`, `tv`. Tinte: `MAT_tint_party`.
- Personajes: rig de Babylon_101 rama 17_Rigged_Animations (`art/source/babylon101_character.glb`), reducido a 23 huesos, escala ×0.5; piezas rígidas al 100% por hueso. Clips `idle`, `walk` (derivado de run), `run`, `jump`. Miran +Z en Babylon sin rotación. **Licencia del repo sin confirmar.**
- Gestos (post-proceso `tools/blender/build_char_anims.py`, categoría `char_anims` tras `characters`; idempotente, reemplaza sus clips y conserva idle/walk/run/jump, piel y materiales): `cheer_arms` 1.0 s, `clap` 1.0 s, `wave` 1.33 s, `talk_gesture_a` 2.0 s, `talk_gesture_b` 2.33 s, `nod` 1.17 s, `shrug` 1.67 s, `disappointed` 2.0 s (brazos cruzados + negar), `boo` 1.0 s (pulgares abajo), `idle_look` 3.0 s. Autoría propia por keyframes (FK + IK de dos huesos, pies plantados, Catmull-Rom periódico → bucles limpios); sin fuentes externas, misma licencia que el proyecto. +~170 KB por GLB. Hoja: `art/previews/char_anims.png`.
- Runtime (`src/npc/character.js`): estados `cheer` (sorteo por personaje entre cheer_arms/clap/jump/wave, re-sorteo cada 2–4 ciclos), `talk` (alterna talk_gesture_a/b), `boo` (boo/disappointed), `disappointed` (disappointed/shrug), cualquier nombre de clip directo, e `idle` con variaciones ocasionales idle_look/nod. Fase, tempo (±13 %) y retardo de reacción (0–0.4 s) deterministas por nombre. Clips de gesto se arrancan/paran bajo demanda. Inspección visual en Blender y comprobación headless de la reacción del público; sin validación humana del ritmo.
- Integración (v0.3): `src/world/world.js` coloca el kit con `place(name, x, z, {rot, y, scale, collider})`; cada GLB se fusiona en una malla con color por vértice + mallas especiales (label/tint/emisivo/vidrio) y se instancia (≈130 FPS headless en plaza). Colliders invisibles aparte. Personajes GLB con mezcla idle/walk/run + gestos (ver arriba). Sombras de sol PCF. Las animaciones se congelan en pausa con `animationTimeScale`. Todas las pruebas (unidad, browser, recovery, production) pasan.
