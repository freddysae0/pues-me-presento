# Traducir «Pues me presento»

El juego está escrito en **español (es)**, que es la base y el respaldo de todo. Cada idioma vive en su carpeta y **un traductor solo toca `src/i18n/<código>/`**: así varias personas pueden trabajar a la vez sin pisarse.

| Código | Selector | Si falta una cadena, cae en… |
|---|---|---|
| `en` | English | es |
| `ca` | Català | es |
| `ca-valencia` | Valencià | **ca** → es |
| `eu` | Euskara | es |
| `gl` | Galego | es |
| `ast` | Asturianu | es |
| `an` | Aragonés | es |
| `oc-aranes` | Aranés | **ca** → es |

Valencià hereda del catalán: basta con escribir lo que cambia (formas verbales, léxico propio). El aranés cae en catalán antes que en español porque en Arán se escolariza en aranés y catalán y el occitano está mucho más cerca del catalán: es mejor respaldo para quien juega en aranés.

## Qué archivos rellenar

Cada carpeta tiene tres archivos, todos `export default { … }`:

1. **`ui.js` — interfaz.** Copia la estructura de [`es/ui.js`](es/ui.js) (menú, pausa, ajustes, HUD, móvil, minijuegos, carteles 3D…) y traduce los valores. Lo que no pongas se ve en el idioma de respaldo. Además puedes añadir `credits: { translationValue: 'Tu nombre' }` y aparecerá una fila «Traducción» en los créditos.
2. **`script.js` — guion.** Es una capa que se fusiona encima de `src/data/script/actual.js` + `b.js` (lo que hoy se juega). Mismo esquema, mismas claves. Lee la **cabecera de `src/data/script/actual.js`**: ahí están todas las claves y restricciones. Conviene traducir desde el guion efectivo: `b.js` sobrescribe gran parte de `actual.js` (cuando una clave está en los dos, manda `b.js`).
3. **`data.js` — datos con texto, por id.**
   - `feed`: el feed de vídeos de «unratito» (`src/data/feed.js`): `{ hint: { swipe, keys, end }, videos: { trend: { caption, tags, sound, sticker, likes, comments, shares, alt }, …, news: { tag, title: [l1, l2], body, aside, cta, … } } }`.
   - `phone`: el móvil del jugador (`src/data/phoneNews.js`): `{ apps: { press: { label } … }, notifications: { '<id>': { from, title, text } }, policies: { '<id>': { topic, text } }, poll: { pollster, method, noParty, undecided, threshold }, policyHeadline: (rival, policy) => '…' }`.
   - No se traducen `id`, `after`, `app`, `when`, `art`, `loop`, `duration`, `avatar` ni `news`.

### Cómo se fusiona

- Objetos: clave a clave (puedes traducir solo `missions.video.title`).
- **Arrays y funciones se reemplazan enteros**: si tocas `dialogues.neighbor`, escribe las 3 líneas completas; si una clave es una función `(state, ctx) => …`, escribe la función entera (mismas ramas, otro texto).
- Ids de notificaciones/vídeos/políticas que no existan se ignoran (y las pruebas avisan).

## Formato de `ui.js`

- `{nombre}` es un hueco que rellena el juego: `'{connected} conectados · {ready} con cargo'`. **Conserva todas las llaves** (puedes moverlas de sitio).
- Algunos huecos reciben una tecla ya dibujada (`{key}`, `{space}`, `{r}`, `{x}`, `{esc}`…). Algunas cadenas llevan HTML (`<b>…</b>`, `<br>`): **mismas etiquetas que en español**.
- `keys.space` es el nombre de la tecla espaciadora («Space», «Espai», «Zuriunea», «Espazo»…).
- `speakers.you` es cómo se ve el hablante «Tú» en globos y subtítulos. En el guion, el hablante del protagonista **se sigue escribiendo `'Tú'`** (es una clave interna: color, voz y gestos).
- `jobs.*`: nombres de cargo que se muestran; los cargos que se guardan siguen en español.
- Carteles 3D (`world.*`) y rótulos de ilustraciones (`feedArt.*`): cortos, se dibujan en un hueco fijo; `world.posts` cabe en ~8 caracteres. Sin `<` ni `&` en `feedArt`.
- `format.decimal` (`,` o `.`) y `format.percent` (`'{value} %'` o `'{value}%'`).
- Se recomienda dejar «Pues me presento» como marca del juego (`menu.logoLine1/2`, `hud.defaultParty`, `world.labels.party_name`), pero se puede adaptar.

## Restricciones del guion (comprobadas por `tests/script.test.js` para cada idioma)

- **Ids y memories fijos.** Cada elección `{ text, memory, response }` conserva su `memory`; cada charla usa exactamente las mismas memories que el español. `dialogues.neighbor`: 3 líneas, elecciones solo en la 2.ª y en el orden `listened, promisedBoth, spectacle`.
- **Número de líneas fijo**: `dialogues.aftermath` → 3 sin elecciones; `cinematics.*.subs` → mismo número de subtítulos (van sincronizados con cámara y gestos); `chapters` → 6; `speech.headings` → 3; `friends.*.choices` → 2; `minigames.viral.lanes` → 4; `minigames.duel.rounds` → 4 (más la de Fox), cada una con 3 `options` y `correct` apuntando a la respuesta concreta que asume un coste; `minigames.rally.phrases` → 12 pares.
- **Mitin final (rally)**: cada par es `[frase, REMATE]`; el remate es **corto y en MAYÚSCULAS** (se pulsa al compás y se dibuja en una nota).
- **Burbujas**: una línea de diálogo cabe cómoda hasta ~180 caracteres; subtítulos de cinemática, ~120. Si el idioma alarga, parte en dos líneas antes que hacer una enorme.
- `flow.*.intro` se inserta como HTML: sin `<` ni `>` salvo `<b>…</b>`.
- Duelo: el título en español dice «Cuatro preguntas…» y el juego cambia la palabra al número real de rondas; en otros idiomas **escribe el número correcto (5 con la ronda de Fox)** o evita el número.
- **Los títulos de misión que buscan las pruebas** («La sede es mi salón», «Hazlo viral», «Eso no fue», «debate», «Última vuelta», «último mitin», «noche de las sillas») **solo aplican al español**: en tu idioma tradúcelos libremente.
- Funciones `(state, ctx) => …`: mismo comportamiento (mismas ramas por memorias, propuesta, discurso), solo cambia el texto. `ctx.rivals` trae los nombres de rivales.

## Tono

Sátira costumbrista y cariñosa: el barrio, la cola del pan, el grupo de amigos, la campaña hecha con sillas plegables. **Adapta los chistes, no los traduzcas literal**: si un juego de palabras no funciona, busca uno equivalente en tu idioma y en tu cultura (refranes, comidas, costumbres). Partidos, políticos, periódicos y personajes son **inventados**: no uses nombres reales de partidos ni de personas, ni hagas sátira de colectivos (solo de políticas y de la política). **No añadas avisos de «esto es ficción»**: solo existen en el aviso de arranque (`notice.*`) y en los créditos (`credits.fiction`).

## Caracteres y fuentes

Las fuentes locales (Fredoka para títulos, Nunito para texto) cubren ç, ñ, à è ò, á é í ó ú, ï ü, «», ¿¡ y `·` (U+00B7). Fredoka no tiene `ŀ`/`Ŀ`, `ḷ`/`Ḷ` ni `ḥ`/`Ḥ`: el CSS cae a Nunito (incluida en el juego) solo para esos glifos, sin descargas.

- Catalán/valenciano/aranés: escribe la ele geminada como **`l·l` (l + U+00B7 + l)**, nunca con el carácter precompuesto `ŀ` (las pruebas lo rechazan fuera del asturiano).
- Asturiano: `ḷḷ` y `ḥ` se pueden usar; se ven con Nunito en los títulos.
- Los carteles 3D se dibujan con la fuente sans-serif del sistema.

## Cómo probar

```
npm.cmd test        # restricciones del guion y del diccionario para todos los idiomas
npm.cmd run dev     # http://127.0.0.1:5173 → Ajustes o menú principal → Idioma
```

Cambiar de idioma guarda el ajuste y **recarga el juego** (el progreso sigue en el último punto seguro). Con la consola del navegador abierta, en desarrollo, cada cadena que falte en tu idioma aparece una vez como `[i18n] Falta traducción de «clave»`.

Qué no se traduce aquí: los rótulos modelados dentro de los GLB (p. ej. «PLAZA DE LO DE SIEMPRE», «VOTA», «SE VENDE»; geometría generada por `tools/blender/`), que forman parte del decorado del barrio, y las herramientas de desarrollo (`src/dev/`).
