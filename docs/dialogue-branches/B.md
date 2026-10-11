# Rama B · Sátira de argumentario

Archivo: `src/data/script/b.js` (`?guion=b`). Pitch: *el lenguaje político como enemigo. Dani manda el argumentario a las 7:00 y Marisa, que entró en el grupo por error, lo traduce al castellano.*

**Running gag único**: el grupo «Argumentario 7:00». Se planta en la videollamada (Nico), se presenta en la plaza (Marisa lo lee antes que nadie porque se levanta a las cinco) y reaparece en sede, vídeo y última vuelta (cada argumentario va seguido de la traducción de Marisa). Se paga en el mitin (remate «TRADUCIR»), en la frase de cierre (Marisa no tiene nada que traducir), en la victoria (último argumentario: «Hemos ganado». Marisa: «Esto lo entiendo») y en la derrota («un resultado que nos permite seguir construyendo» → «habéis perdido, cariño»). La libreta de Marisa, el filtro de yogur y «que conste en acta» desaparecen; las seis sillas se quedan solo donde la mecánica las exige.

**Voces**
- Marisa: «cariño», «traducción:», se levanta a las cinco, frases cortas.
- Paco: «Mira, te digo una cosa», todo en precio y cuenta.
- Lola: el BOE como novela negra, vocabulario administrativo («trámite de audiencia», «no consta»).
- Dani: jerga de asesor («relato», «marco», «impacto cualitativo»); es quien cae en el idioma.
- Nico: «A ver, en cristiano», literal, del portal.
- Aguardo (Paciente): gestión, periódico, derogar, ganar sin gobernar.
- Giro (Sobrevivo): «rectificar es de sabios», ola reaccionaria, máquina del fango, estabilizar.
- Del Muro (Fox): caballo, inglés, portazos, «derechita cobarde».
- Escaleta: «queda dicho», minuto de oro.

**Fox (cambio del creador)**: se añaden `rivals.hard` y `foxDebate` (`hallLine`, `interruption`, `round` con role `hard`, `reactions`: right/wrong/timeout), y Fox aparece en la intro del debate, en la tele y en los carteles.

## Iteraciones

Rúbrica: (1) inteligente frente a cuñado · (2) referencias españolas · (3) voces · (4) indirectas dosificadas · (5) ritmo y globo · (6) originalidad frente al guion actual · (7) consecuencias.

| Iter. | 1 | 2 | 3 | 4 | 5 | 6 | 7 | `npm.cmd test` |
|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 3 | 3 | 3 | 4 | 3 | 4 | 23/23 |
| 2 | 3,5 | 3 | 3,5 | 3,5 | 4 | 3,5 | 4 | 23/23 |
| 3 | 4 | 4 | 4 | 3,5 | 4 | 4 | 4 | 23/23 |
| 4 | 4 | 4 | 4 | 4,5 | 4,5 | 4 | 4,5 | 23/23 |
| 5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 4,5 | 23/23 |

Las puntuaciones son autocrítica del guionista, no una validación con lectores.

**Iteración 1, borrador completo.** Se reescriben todas las claves del esquema. Rivales de `parties.js`. La propuesta `housing` pasa a «Que el tercero vuelva a tener vecinos»: suelo, licencias rápidas, áticos y bajos, y desalojo rápido de okupaciones. Su coste: tarda y no da titulares. Crítica: demasiadas líneas recicladas del guion actual (la sobrina en Dublín, el Seat, la Reme, «una comunidad de vecinos, que es peor»), un hombre de paja en el duelo («los caseros son muy de derechas») y una reacción de Fox que no se entendía.

**Iteración 2, 11 cambios.** Fuera los reciclados (Paco y la sobrina, el Seat de Nico, las respuestas de Nico y la Reme, la asamblea y la respuesta de Marisa a «escuchar»). El ataque de Giro en el duelo pasa del hombre de paja al eufemismo real («el alquiler se ha estabilizado»), y el jugador lo desmonta con el tercero cerrado. Se arreglan la reacción de Fox, el flavor de la freidora («marcar agenda propia»), el ambiente de Marisa en programa («los paquetes siempre los paga alguien») y la presentación de Paco («más pactos que en el Congreso, a escote»).

**Iteración 3, 10 cambios.** Más referencias reales: el sondeo oficial que acierta a favor de quien lo encarga, ganar sin gobernar (Aguardo en el salón), Giro con «dos argumentarios: el de la mañana y el de la tarde», «redistribuir» para el café que sube Hacienda (Paco) y el decreto ómnibus concretado («si votas no al cambio de hora, votas contra las pensiones»). Muletillas reforzadas: «A ver, en cristiano» para Nico y «Mira, te digo una cosa» para Paco. Nuevo ambiente de Marisa en crisis («cuando llega a mi cuñada, ya es oficial»).

**Iteración 4, 10 cambios.** Dosificación. Había siete toques al tope de alquiler; se quitan dos (la reacción de Marisa al festival y el flavor de `manage`). `manage` pasa a la ración de la derecha: Aguardo baja impuestos «a partir del segundo año, si la herencia lo permite». Fox recibe el portazo («tengo práctica saliendo de gobiernos») y «derechita cobarde». «Préstamo, no subvención» salía cuatro veces; queda una (Paco) más el título del minijuego. Los títulos duplicados pasan a «Ronda de consultas» y «No cabe todo en un decreto». El «sillas, hielo, España» de Nico sustituye una repetición.

**Iteración 5, 10 cambios.** Error de lógica corregido: Nico decía «tu sobrino» cuando el sobrino es de Marisa. Se reescriben los últimos ecos del guion actual: la sombrilla y «te odia dos semanas» en la reacción de Marisa, y el «trescientos por cien de sombra» del duelo, que pasa a «un informe que no he traído; la gráfica de la flecha roja». Nuevo `pacoBlame`: el candidato que pregunta «¿y dónde vivo?», que une empleo y vivienda sin sermón. También el `after` de Dani («apostar por» frente a «seguir apostando por») y los títulos del vídeo viral y del discurso fallido («En la tele, “buena acogida”»).

## Las 10 mejores líneas

1. Marisa (reacción, prometer todo): «Cariño, eso no es un programa: es un decreto ómnibus. Mete tanto que nadie puede votar en contra.»
2. Paco (`pacoRent`): «Ahora dice uno en la tele que va a topar el precio del café. Pues pondré “café de temporada”. Como con los pisos.»
3. Lola (crisis): «Si votas no al cambio de hora, votas contra las pensiones. Un thriller.»
4. Lola (`after`): «Sigo con el BOE de hoy. Disposición final séptima. Ha muerto el mayordomo.»
5. Nico (asamblea): «Juntos son una junta de vecinos: una investidura, pero con derrama.»
6. Paco (`pacoWages`): «Subo el café diez céntimos y me cae una reseña: “atraco”. Si me lo subiera Hacienda, se llamaría “redistribuir”.»
7. Duelo, opción trampa: «Se ha sacado de contexto. El contexto era yo prometiéndolo todo.»
8. Fox (`hallLine`): «He dejado el caballo en doble fila. Si se lo llevan, es ideología.»
9. Nico (`after`): «Voy a por más celo. Este pega cuando quiere, como un socio de Gobierno.»
10. Victoria: «A las 7:00 llega el último argumentario de Dani: “Hemos ganado”. Marisa contesta: “Esto lo entiendo”.»

## Indirectas incluidas (dónde)

Topes y control de precios:
- `dialogues.neighbor[1]`: «el tercero lleva cerrado desde lo de la ley».
- `paco` (`pacoRent`): el café de temporada.
- `nico.crisis`: Ernesto tiene el piso cerrado «desde lo del tope» y alquilaría «si supiera que lo recupera» (seguridad jurídica).
- `minigames.duel` ronda 1: Giro presume de alquiler «estabilizado» y el tercero sigue cerrado.
- `flow.debate.promise`: la opción mala del jugador es topar el alquiler a la mitad por decreto.

Vivienda en positivo:
- `proposals.housing`, `speech.argument.housing`, reacción de Marisa, coste en el duelo, cierre del mitin («los construiremos, no los anunciaremos») y final de victoria.

Impuestos con eufemismo:
- `paco` (`pacoWages`): «redistribuir».
- `lola.default.after`: «ninguna se llama “escudo”».

Regularizaciones y ayudas como reclamo legislativo:
- `lola.crisis`: decreto ómnibus con «regularización exprés» mezclada con las pensiones. Apunta a la técnica legislativa y al Gobierno, no a personas.

Reincidencia:
- `flow.finalPrep.listen`: la señora del bolso «coincide cada mes en el juzgado» con quien se lo robó.
- `foxDebate.round`: «detenido once veces». La respuesta correcta asume el coste (jueces), Fox se lleva su opción ridícula y Podríamos la de «hablemos de las causas. De las once».

Observatorios e intervencionismo:
- `proposals.shade` («Sombra antes que un observatorio del calor»), `proposals.festival` («no una fundación con logo»), remate del mitin («Sin observatorio, sin comisión y sin LOGO»), `foxDebate.round` («en vez de jueces, abre un observatorio»).

Ración para la derecha:
- Aguardo: «ya nos toca… y si no, ganaremos igual», derogar lo que no nombra, el dato que apunta para derogarlo, impuestos «a partir del segundo año, si la herencia lo permite» y «gestionaremos. Mucho. Con gestión».
- Del Muro: el caballo en doble fila, «Excuse me!», el portazo al salir de los gobiernos y «¡Mano dura! ¡Y un caballo por barrio!» como opción errónea.

## Sin validar

Tono, ritmo de lectura en globo y si las parodias se reconocen: solo con lectores reales. `foxDebate` y `rivals.hard` todavía no los lee el juego (los conecta el coordinador).
