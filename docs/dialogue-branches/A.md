# Rama A · Costumbrismo electoral

Archivo: `src/data/script/a.js` (`?guion=a`). Pitch: *La campaña de verdad, vista desde la cola del pan: farolas con cuatro carteles, mesas por sorteo y un sondeo que se hace pidiendo barra.*

Tono: humor seco y observacional, de barra de bar. El chiste sale del ritual electoral español: la convocatoria en el BOE, los cincuenta y cuatro días, la pegada de carteles a las 00:00, el corte de quince segundos, el debate a cinco con un atril vacío, la prohibición de publicar encuestas la última semana (y las «peras» andorranas), el voto por correo, la mesa electoral por sorteo, la jornada de reflexión, el «y tú más», el balcón de la noche electoral y el «todos dicen que han ganado».

Rivales: `tech` Fermín Aguardo (Partido Paciente), `populist` Nuria Giro (Partido Sobrevivo Otra Elección), `hard` Covadonga del Muro (Fox), moderadora Maite Escaleta. La clave extra `foxDebate` (`hallLine`, `interruption`, `round` con role `hard`, `reactions`) queda lista para que la conecte el coordinador.

**Running gag con pago** (sustituye a las seis sillas y la libreta de Marisa): a Paco le toca **vocal de mesa** por sorteo. Lo plantea al final de su charla («"Tener un bar" no vale de excusa»), vuelve en sus avisos `after` y en la última vuelta («pregunta si puede ser interventor siendo vocal. No»), y se paga en la victoria: llega del colegio con catorce horas de vocal y el acta firmada, «Una y nos vamos», y no se va nadie. Hay un segundo gag más pequeño: el balcón de la sede (Nico: «antes hay que quitar las pinzas» → Ana en la victoria: «recoged la ropa tendida, que sale en la tele»).

Voces: **Marisa**, imperativa, «cariño», pan y horno, la cola como sondeo. **Paco**, aforismos de barra, «jefe», la tele del bar. **Lola**, de gestoría: BOE, modelo 303, «por escrito». **Dani**, métricas, el corte de quince segundos, «literal». **Nico**, nombres propios (la Reme, Ernesto), portal, derrama y engrudo. **Aguardo**: periódico, gestión, «fase posterior», herencia. **Giro**: rectificar, «desde ayer», observatorio. **Del Muro**: caballo, anglicismos, «sin complejos». **Escaleta**: cronómetro y «queda dicho». **Periodista**: el escrutinio y el «todos han ganado».

## Iteraciones

Rúbrica (1–5): (1) inteligente frente a cuñado · (2) referencias españolas · (3) voces · (4) indirectas dosificadas · (5) ritmo/globo · (6) originalidad frente al guion actual · (7) consecuencias.

| Iteración | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Media |
|---|---|---|---|---|---|---|---|---|
| 1 · borrador | 3 | 4 | 3 | 2,5 | 4 | 3,5 | 3,5 | 3,4 |
| 2 | 3,5 | 4 | 3 | 3,5 | 4 | 3,5 | 4 | 3,6 |
| 3 | 4 | 4 | 3,5 | 3,5 | 4,5 | 4 | 4 | 3,9 |
| 4 | 4 | 4,5 | 4 | 4 | 4,5 | 4 | 4 | 4,1 |
| 5 | 4 | 4,5 | 4 | 4 | 4,5 | 4 | 4 | 4,1 |

Son puntuaciones de autocrítica, no de lectores reales. `npm.cmd test` pasó en las cinco iteraciones (23/23).

**Iteración 1.** Borrador completo de todas las claves. Rivales de `parties.js`; la propuesta `housing` pasa a «Grúas en el solar, llaves en el tercero» (licencias rápidas, suelo, desalojo ágil de okupaciones, sin tope). A petición del coordinador se añadieron `rivals.hard`, `foxDebate` y Fox como tercer atril en el debate. Crítica: «tope» aparecía seis veces y la indirecta dejaba de serlo para volverse martillo; la indirecta sobre ayudas era demasiado literal («sin preguntar cómo has llegado»); Paco daba cifras concretas de nómina que podían leerse como dato; dos chistes de cartel superpuesto repetidos.

**Iteración 2.** Quité el tope de la presentación de Marisa: el tercero queda como misterio («una caja de llaves en la puerta») que Ernesto explica después en la crisis de Nico. La cuña fiscal de Paco ya va sin cifras («le llega la mitad de la subida; la otra mitad se la queda un socio que no friega»). La tele de la última vuelta pasa a «papeles y ayudas para todo el que llegue, "y que se entere bien todo el mundo"», que apunta al anuncio como reclamo y no a nadie que llegue. Cambié el aviso repetido de la cebolla de carteles. Consecuencia nueva: si invitaste a Ernesto, aparece en el debate con tu chapa. Añadí «jefe» a Paco y «por escrito» a Lola.

**Iteración 3.** Fuera el relleno: el chiste inicial pasa a «seré más breve que una legislatura»; el grito vacío del Senado, a «¡Este barrio no se calla! …Bueno, a partir de las once, sí», con el pago en el mitin final; la norma de Dani de «los vecinos y las vecinas» (sonaba a cuñado) pasa a «hoja de ruta / a día de hoy → abstención»; la frase de Paco heredada del guion actual pasa a «Treinta años y nadie ha cumplido un programa tan corto»; y quité un «de reojo» duplicado.

**Iteración 4.** El Paciente recibe su parte («Los del Paciente no vinieron: esperan su turno») y Fox, la del inglés («Sorry, pero eso es ideología… en inglés, que es como se dice ahora lo de siempre»). Menos observatorios: el del debate pasa a «vivienda digna por cuarta campaña seguida… ¿cuántas grúas ha visto?». Quité dos «autobús» que pisaban el remate del mitin.

**Iteración 5.** Pulido: el coste de `housing` en el duelo, la línea de Dani en la videollamada (la cuota de autónomos «que esa no perdona»), la reacción de Fox cuando aciertas y una interrupción más corta. Todos los globos y líneas de diálogo quedan en ≤ 200 caracteres; solo los pasan los textos de panel (intros y el texto de victoria).

## Las 10 mejores líneas

1. Marisa: «Aquí el sondeo se hace en la cola: si piden barra, todo sigue igual; si piden integral, quieren cambio. Hoy, todo barras.»
2. Marisa: «Eso no es un programa, cariño: es la carta a los Reyes. Y aquí todos sabemos quién paga a los Reyes.»
3. Giro (duelo): «Nuestro tope funciona: en su barrio el alquiler ya no sube. Lo certifica el observatorio, que está en un piso que antes se alquilaba.»
4. Paco: «Las sillas no votan, jefe: se dejan.» (prestadas antes a los de la gaviota y a los de la rosa)
5. Registro: «REGISTRADO. Ya salís en el BOE, entre una subvención a la trufa y un cese.»
6. Nico: «A las doce y un minuto, Fox nos tapó por arriba y Sobrevivo por abajo. Los del Paciente no vinieron: esperan su turno.»
7. Paco: «Has juntado a dos personas sin crear un observatorio.»
8. Del Muro (entrada al salón): «Yo he venido a caballo. Ella ha venido con su programa de hace cuatro años, pero al revés.»
9. Discurso: «Tranquilos: seré más breve que una legislatura. Que tampoco es decir mucho.»
10. Marisa: «Mi madre te vota. Por correo, que en agosto no sale.»

## Indirectas (dónde aparecen)

| Tema | Línea | Lugar |
|---|---|---|
| Topes de alquiler que vacían el mercado | Lola: «Toparon el alquiler y mi casero lo pasó a "temporada": ahora firmo cada once meses» | `dialogues.lola.default` (lolaRent) |
| Topes → piso turístico | Ernesto «alquilaba por años hasta que con lo del tope le salió más a cuenta el turista» | `dialogues.nico.crisis` (nicoInvite) |
| Topes + observatorio | Observatorio «en un piso que antes se alquilaba»; respuesta correcta: «han bajado los carteles de "se alquila"» | `minigames.duel.rounds` (Vivienda) |
| El jugador cae en el tope | Debate «Prometer topar el alquiler a la mitad»: Lola cuenta pisos que se pasan a «temporada» (−8 de credibilidad) | `flow.debate.choices.promise` |
| Vivienda en positivo: oferta y seguridad jurídica | `housing`: licencias en meses, suelo, desalojo ágil de okupaciones, «ni tope ni titular fácil» | `proposals.housing`, `speech`, `finalSpeech`, `endings` |
| Observatorio para todo | Convocatoria con observatorio (tele); «sin crear un observatorio» (Paco) | `cinematics.intro`, `dialogues.paco` |
| Impuestos y cuña fiscal | «El que más gana en este bar no pone cafés: es la ventanilla»; «la otra mitad se la queda un socio que no friega»; «quién paga a los Reyes»; cuota de autónomos | Paco (pacoRent, pacoWages), `aftermath`, Dani |
| Ayudas como reclamo | Podríamos anuncia papeles y ayudas «y que se entere bien todo el mundo»; Fox, un muro sin partida presupuestaria (los dos reciben) | `flow.finalPrep.intro` |
| Reincidencia / puerta giratoria | Marisa: «lo han soltado otra vez. Es la cuarta. Ya nos saludamos»; Fox lo usa en el duelo; la respuesta errónea es «culpa del sistema, hablemos de las causas», y la correcta, el juicio rápido sin caballo | `dialogues.marisa` (video), `foxDebate.round` |
| Derecha también | Aguardo: «lo diremos en una fase posterior, tras auditar la herencia»; Paciente «esperan su turno»; Fox: caballo en doble fila, anglicismos, «Make Barrio Great Again» como respuesta errónea | duelo, Nico, debate, `foxDebate` |

Ninguna indirecta apunta a personas por su origen: el reincidente es «el chaval», sin nacionalidad, y lo que se satiriza son la política judicial y el anuncio de ayudas como reclamo.

**Sin validar:** el humor y el reconocimiento de referencias solo se sabrán con lectores reales. La rama no se ha jugado en el navegador: solo se ha comprobado con `npm.cmd test`.
