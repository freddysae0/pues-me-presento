# Rama C · Campaña en la era del scroll

Archivo: `src/data/script/c.js`. Pitch: *La política de siempre en formato vertical: bulos de la familia, trends y promesas de nueve segundos, mientras la panadería pincha la burbuja.*

Rivales: `tech` = Fermín Aguardo (Partido Paciente), `populist` = Nuria Giro (Partido Sobrevivo Otra Elección), `hard` = Covadonga del Muro (Fox), moderadora Maite Escaleta. Clave extra `foxDebate` (hallLine, interruption, round, reactions) para que la conecte el coordinador.

Running gag único: **los audios de la tía Puri** (grupo «Familia (aquí NO se habla de política)»). Planteamiento en la intro, giro en la crisis (reenvía el bulo contra su sobrino sin reconocerlo), pago en el mitin (remate «BULO») y en los dos finales (victoria: «No sé si es bulo. Lo reenvío por si acaso»; derrota: «Eso sí me lo creo, que lo dice todo el grupo»). Las sillas solo quedan donde las pruebas lo exigen y en el minijuego; la libreta de Marisa, el filtro de yogur y «que conste en acta» desaparecen.

Puntuaciones: autoevaluación del guionista (1–5), sin lectura de jugadores reales.

| Iteración | Inteligente | Referencias | Voces | Indirectas | Ritmo | Originalidad | Consecuencias |
|---|---|---|---|---|---|---|---|
| 1 | 3 | 3 | 3 | 3 | 3 | 2 | 3 |
| 2 | 3 | 3 | 3 | 3 | 3 | 4 | 3 |
| 3 | 4 | 4 | 4 | 4 | 3 | 4 | 4 |
| 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| 5 | 4 | 4 | 4 | 4 | 4 | 5 | 4 |

## Iteración 1 · borrador completo
Todo el esquema reescrito con el marco internet (unratito, grupo del portal, recortes, Kevin Lupa, «seis, siete», tocar césped). `housing` pasa a «Grúas, no carteles» (suelo, licencias en meses, desalojo rápido). Rivales de parties.js. Comprobado: todas las líneas de globo ≤ 200 caracteres; `npm.cmd test` 23/23.
**Crítica:** demasiadas respuestas eran calcos del guion actual (Paco y los jóvenes, Nico y la Reme, la caña del sobrino, la pizza sin piña); la tele de la última vuelta amontonaba tres partidos.

## Iteración 2 · originalidad (16 líneas)
Reescritas las respuestas heredadas de Marisa (parking, festival), Paco (pacoHeard, pacoRent, pacoBlame), Nico (las cinco), Lola (lolaBooks, cierre), Dani (crisis, daniReply, daniNoFilter) y Marisa en el atril. La tele de la última vuelta, compactada. Tests 23/23.

## Iteración 3 · indirectas y voces (10 cambios)
La reincidencia en el bar de Paco pasa de «descafeinado como en el juzgado» (oscuro) a «vuelve antes que el atestado». La «barra social» de Marisa parodia el «escudo social». La respuesta correcta contra Fox deja de sermonear y pincha a los dos lados («sin caballo y sin observatorio»). El tope del café se le atribuye a Sumandos. Aguardo pierde la cifra calcada del guion actual y gana la página de opinión. Consecuencia nueva: si cierras el discurso con «¡Seis, siete!», Marisa te lo comenta después. Tests 23/23.

## Iteración 4 · ritmo y coherencia (10 cambios)
Fuera repeticiones: «ministro» salía cuatro veces y «eslóganes que no significan nada», dos. Error de lógica corregido: Marisa y la cinemática de la plaza decían «el del vídeo» antes de que hubieras grabado ninguno; ahora se entera por el grupo del portal que anunció Nico. Remates más cortos en Dani y en el duelo. Tests 23/23.

## Iteración 5 · pulido (4 cambios)
Marisa ya no se contradice («lo he visto en el grupo» / «no tengo de eso»). El aviso de Paco ya no repite el chiste de la foto. La periodista de la victoria remata con Kevin Lupa. Tests 23/23.

## Las 10 mejores líneas
1. Marisa (vecina): «Luego lo cuentas en el atril sin anglicismos, que aquí “engagement” suena a enfermedad de las encías.»
2. Marisa (aftermath, housing): «Te lo digo yo, que vendo pan: cuando hay más barras, la barra no sube. Eso no lo arregla un tope.»
3. Lola (lolaRent): «Los estudios del barrio se fueron a alquiler de temporada cuando los toparon. El tope funcionó: ya no queda nada que topar.»
4. Nico (nicoEnemy): «Es Ernesto, del cole. Así empieza la polarización: con uno que te debe un balón desde sexto.»
5. Populist (hall): «Y yo vengo a defender lo que defendí siempre. Desde el martes.»
6. Tía Puri (victoria): «Hijo, me ha llegado que has ganado. No sé si es bulo. Lo reenvío por si acaso.»
7. Paco: «Ahí viene el chaval que me ha birlado el móvil de la barra tres veces. Lo detienen, lo sueltan y vuelve antes que el atestado.»
8. Marisa (ambiente): «Si me topan la barra, la hago más pequeña y la llamo “barra social”.»
9. Mitin: «Para hacerlo no hemos creado ni un solo… OBSERVATORIO.»
10. Mitin final, opción viral: «Se corea. Por primera vez en la campaña, todo el mundo entiende exactamente lo mismo: nada.»

## Indirectas incluidas (dónde)
- **Topes de precios / alquiler:** Lola `lolaRent`; Paco `pacoWages` (Sumandos topa el café); Marisa ambiente `finalPrep` («barra social»); aftermath `housing`; duelo ronda 1 (Giro: «los que no existen están baratísimos»); debate `manage` (Fox aplaude) y `promise` (topar el alquiler a la mitad resta credibilidad).
- **Construir / seguridad jurídica frente a la okupación:** propuesta `housing`, `speech.argument.housing`, coste en el duelo, mitin («habrá PISOS»), final de victoria (licencia en meses).
- **Observatorios e intervencionismo:** propuesta `shade` («Árboles, no un observatorio del calor»), `flow.hq.tenants`, Sumandos y su Observatorio del Voto Indeciso (`finalPrep`), mitin («OBSERVATORIO»), final de victoria (`shade`), ventanilla única en `parking`, formulario del registro.
- **Reincidencia (como política judicial, sin origen):** última línea de Paco; ronda de Fox en `foxDebate`.
- **Ayudas como reclamo:** tele en `finalPrep` (Podríamos y su «quién paga» en un asterisco diminuto). Es la única, y a propósito.
- **Sobrevivo:** «máquina del fango» (`crisis.blame`, interrupción del duelo), «rectificar» (`crisis.admit`), hall («desde el martes»).
- **Ración para la derecha:** Partido Paciente y el IBI que sigue esperando la bajada de impuestos (Marisa, ambiente por defecto), el vídeo del polígono (intro y `debate.attack`), el periódico subrayado (duelo). Fox: el caballo en doble fila, el inglés patriota, los portazos (`foxDebate`, tele, `finalPrep`).
- **Otros partidos:** Se Acabó La Siesta / Kevin Lupa (crisis, misión `election`, minijuego viral, periodista de la victoria); Centrifugados (registro, atril vacío, Dani); Bloque Bisagra (final de victoria).

## Pendiente / sin validar
- Nadie ha leído esta rama en partida: las puntuaciones son del propio guionista.
- La ruta `foxDebate` no está conectada. `flow.debate` usa `rivals.hard` solo si existe.
- En victoria y derrota, el tercer subtítulo lo dice «Tía Puri (audio)». No tiene personaje 3D, así que no gesticula.
