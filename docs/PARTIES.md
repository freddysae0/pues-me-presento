# Partidos rivales · biblia

Datos en `src/data/parties.js` (`PARTIES`, `partyById`, `DEBATE_RIVALS`, `MODERATOR`, `debateParties`). Este documento es para guionistas: qué parodia cada partido, en qué hechos públicos se apoya el chiste y qué no se escribe.

**Estado:** solo datos. Aún no está conectado al juego: `flow.js` (`RIVALS`), `minigames.js` (`duelRounds`) y `cinematics.js` (`hall`) siguen usando a Borja Valcárcel, Encarna Robles y Pilar Ortega. Al integrarlo, actualizar también la frase de `docs/RESEARCH_SPAIN.md` que dice que no se nombra a partidos reales: ahora se parodian sus siglas y su estilo, pero no se nombra a ningún político real.

## Reglas

- **Parodiamos partidos, siglas, estéticas, promesas y tics de comunicación**, no a personas. Los líderes son inventados, no tienen apellidos de líderes reales y su aspecto no copia rasgos de nadie (por eso algunos cambian de género respecto al original).
- **No se atribuyen delitos ni casos judiciales** a nadie. Se puede satirizar la conducta pública de un partido (cambios de postura, pactos, rupturas, estética); los casos con nombre propio, no.
- **Ninguna cifra es un dato.** Si sale un número («catorce logos», «siete escaños»), tiene que ser claramente una exageración o un guiño, no una estadística.
- **Sin aviso de ficción en el juego.** Va una vez, en los créditos.
- **Todos se llevan su parte**, incluido el partido del jugador (ver más abajo). La línea editorial del creador inclina algunas indirectas; no convierte a nadie en «el bueno».

## Línea editorial / indirectas

El creador del juego es de derechas y quiere que el juego suelte, de vez en cuando, indirectas en ese sentido. Esto sustituye a la equidistancia estricta del primer encargo, pero **no** la convierte en panfleto: el PP y Fox se llevan sus chistes (la derecha que promete liberalizar y luego hereda cada impuesto «por responsabilidad»; la que pacta y rompe gobiernos por un portazo), y eso hace más creíble el resto.

**Temas de las indirectas**

1. **Libre mercado frente a topes de precios.** Topar el alquiler vacía el mercado: los pisos pasan a temporada, a venta o se quedan cerrados. El chiste es que el político lo celebra porque «ya no sube ningún piso».
2. **Ayudas y regularizaciones como reclamo.** Las «paguitas» y los papeles anunciados como cartel luminoso, y la ofensa cuando alguien pregunta por el efecto llamada o por quién paga.
3. **Buenismo con la reincidencia.** La culpa es del sistema, nunca del que reincide por trigésima vez; la puerta giratoria de los juzgados.
4. **Ministerios y observatorios para todo.** Cada problema se resuelve con un organismo, una directora general y un logo.
5. **Subir impuestos y llamarlo «redistribuir»** (o «escudo»).

**Indirectas que funcionan** (ya están en `parties.js`)

- Sobrevivo: «Desde que topamos el alquiler, en mi barrio no sube ningún piso. Tampoco se alquila ninguno, pero eso es otro bloque.»
- Sobrevivo: «No subimos impuestos: redistribuimos. Usted paga más, pero con más justicia social.»
- Sumandos: «Si los caseros retiran los pisos por el tope, topamos también a los caseros. Con cariño.»
- Sumandos: «Topar el alquiler, el pan, la luz y el café. Si falta café, un Observatorio Estatal del Café.»
- Podríamos: «No hablemos de delincuencia, hablemos de las causas. Y si el mismo señor ha robado treinta veces, hablemos de las treinta causas.»
- Podríamos: «Papeles y paguita para todo el que llegue, sin colas ni preguntas. Quien pregunte quién paga, a las cloacas.»
- Paciente (la indirecta también apunta a casa): «Quitar los topes al alquiler. Primero, una comisión que estudie cómo quitarlos sin que se note.»

Por qué funcionan: el blanco es una política y el político que la vende; el chiste se sostiene por su lógica interna (el tope que «funciona» porque no queda nada que medir) y lo puede disfrutar alguien que no comparte la idea.

**Lo que cruza la línea** (no se escribe)

- Cualquier chiste sobre el inmigrante como persona o sobre un colectivo por su origen, nacionalidad, religión o color: nada de estereotipos étnicos, acentos de burla ni «los de fuera».
- Vincular delincuencia con origen («los X roban»). La reincidencia se satiriza como política judicial, sin nacionalidad.
- Términos despectivos para colectivos («menas», «moros», «sudacas», «panchitos», etc.) en boca de cualquier personaje, ni siquiera de Fox para ridiculizarlo.
- Convertir a los votantes de izquierda en tontos o malvados: se ríe de la promesa y del político, no del que vota.
- Frases panfleto sin chiste («la izquierda arruina España»). Si no tiene giro, no entra.

## Tabla resumen

| id | Nombre (siglas) | Parodia de | Líder | Eslogan | Rol |
|---|---|---|---|---|---|
| `paciente` | Partido Paciente (PP) | PP | Fermín Aguardo | Ya nos toca. | debate (A) |
| `sobrevivo` | Partido Sobrevivo Otra Elección (PSOE) | PSOE | Nuria Giro | Avanzamos. En la dirección que toque. | debate (B) |
| `bisagra` | Bloque Bisagra (BB) | Junts, PNV, ERC, EH Bildu, BNG, CC | Mertxe Soler Arrieta | Sin nosotros, no hay nada. Con nosotros, depende. | debate (C) |
| `fox` | Fox (FOX) | Vox | Covadonga del Muro | Make España Grande Again. | fondo |
| `sumandos` | Sumandos (S+) | Sumar | Héctor Abrazo | Sumamos. Luego ya contamos quién se ha quedado. | fondo |
| `podriamos` | Podríamos (POD) | Podemos | Rebeca Bases | Sí se podría. | fondo |
| `siesta` | Se Acabó La Siesta (SALS) | Se Acabó La Fiesta | Kevin Lupa | Despierta. Te lo están ocultando. | fondo |
| `centrifugados` | Centrifugados (Cf) | Ciudadanos | Lucas Centeno | Seguimos aquí. (Comprobado por última vez: hace un rato.) | fondo, atril vacío |

Moderadora: **Maite Escaleta** (la escaleta es el guion de un programa de tele).

**Por qué estos tres en el debate.** El cara a cara de los dos grandes es el debate español por excelencia, y uno de cada lado mantiene el reparto. El Bloque Bisagra es el tercero porque no compite por ganar sino por que le llamen después, que es el chiste estructural de la política española reciente. Con el jugador y el atril vacío de Centrifugados salen **cinco atriles**: el debate a cinco de la tele. Fox, Sumandos, Podríamos y Se Acabó La Siesta aparecen en carteles, telediarios, tiktoks y noche electoral; cualquiera puede pasar al debate cambiando `DEBATE_RIVALS`.

## Fichas: por qué funciona y en qué se apoya

### Partido Paciente (PP)
- **El chiste:** el partido que espera su turno. Mismas siglas, azul, gaviota y un reloj de arena.
- **Referencias reales:** lista más votada en las generales de 2023 sin conseguir la investidura; el argumento de «que gobierne la lista más votada»; «derogar» como eje de campaña; el mantra de la gestión y el «sentido común»; los vídeos en mangas de camisa; pactos autonómicos con Vox en 2023 y la distancia que marca en Madrid; los barones con perfil propio.
- **Indirecta hacia casa:** promete liberalizar y bajar impuestos y luego hereda lo que había. Sirve para que la sátira de derechas no parezca propaganda.

### Partido Sobrevivo Otra Elección (PSOE)
- **El chiste:** las mismas siglas leídas como manual de supervivencia. Rosa en un puño que cruza los dedos.
- **Referencias reales:** cambios de postura públicos y su defensa («rectificar es de sabios»); «escudo social»; «máquina del fango»; «ola reaccionaria»; «mayoría progresista» con socios variables; la vivienda como «competencia autonómica»; la ley de vivienda y las zonas tensionadas; la chapa de colores de la Agenda 2030 en la solapa.
- **Indirectas:** topes de alquiler, impuestos llamados redistribución y observatorios.

### Fox (FOX)
- **El chiste:** el ejemplo del creador. Un partido patriota con nombre en inglés, que además suena a cadena estadounidense. El eslogan en inglés macarrónico remata la contradicción.
- **Referencias reales:** arranque de campaña en Covadonga; vídeos a caballo con música épica; «derechita cobarde» contra el PP; «la España que madruga»; «sin complejos»; contra los «chiringuitos» y la Agenda 2030; salida de los gobiernos autonómicos en 2024; la pulsera de la bandera; la cercanía con el trumpismo.
- **Cuidado:** el chiste es su estética y su contradicción, nunca sus votantes ni ningún colectivo.

### Sumandos (S+)
- **El chiste:** un nombre que suma y una flor que pierde pétalos. Sustituye al gastado «Restar».
- **Referencias reales:** plataforma de muchas siglas; la salida de Podemos de su grupo; socios que se van; el «proceso de escucha»; la «vida cotidiana»; la reducción de jornada; listas cerradas a última hora; estar en el Gobierno y criticarlo a la vez.
- **Indirectas:** topes a todo, observatorios y ayudas sin preguntas.

### Podríamos (POD)
- **El chiste:** «Podemos» en condicional. Sustituye al gastado «Pudimos».
- **Referencias reales:** «asaltar los cielos», «la casta», «las cloacas», «sí se puede», los círculos, las consultas a las bases, el medio de comunicación propio, la salida de coaliciones, la queja contra los medios en todos los medios.
- **Indirectas:** regularizaciones y paguitas como reclamo, la reincidencia vista como culpa del sistema, expropiar lo que vació el tope.

### Se Acabó La Siesta (SALS)
- **El chiste:** cambia una letra y la fiesta pasa a ser la siesta del votante que hay que despertar. Despertador y lupa.
- **Referencias reales:** nace de un canal de mensajería y de redes; la sorpresa de las europeas de 2024; la promesa de sortear el sueldo; la admiración por las macrocárceles; «no somos un partido» y después crisis internas; «lo que no te cuentan los medios».
- **Cuidado:** nada sobre su financiación ni sobre causas judiciales del fundador real.

### Bloque Bisagra (BB)
- **El chiste:** «los que deciden el Gobierno con siete escaños», en un solo partido con miembros. La llave de siete dientes.
- **Miembros:** Partido Negociador Vasco (PNV: pragmatismo y cupo), Junts per Després (Junts: decidir en el último minuto), Esquerra Ho Tornarem a Pensar (ERC: parodia de «ho tornarem a fer»), Eh, Builder! (EH Bildu: su giro hacia la gestión), Bloque Non Grazas (BNG: la transferencia de la AP-9), Coalición con Cualquiera (CC: un diputado decisivo).
- **Cuidado:** nada de terrorismo con Bildu, nada de estereotipos regionales, nada sobre la situación personal de ningún dirigente.

### Centrifugados (Cf)
- **El chiste:** el centro, centrifugado. Una lavadora naranja con el piloto de fin de programa encendido. Sustituye a «Desaparecidos», que en España evoca a las víctimas de dictaduras y de la Guerra Civil.
- **Referencias reales:** pasó de ser decisivo en 2019 a no tener representación; dirigentes que se marcharon a otros partidos; «regeneración»; «centro liberal»; los bandazos entre centro y derecha.
- **Uso:** el quinto atril, vacío, en el debate; un cartel viejo en la plaza; «¿Seguís vivos?» en los comentarios.

### Maite Escaleta (moderadora)
- **Referencias reales:** debates a cinco de la tele pública y privada; bloques temáticos; «minuto de oro»; cronómetros en pantalla; la jarra de agua que nadie abre; el «queda dicho» que sustituye a decir que alguien miente.

## El partido del jugador también es parodiable

Cada partido tiene `jabAtPlayer`. Las pullas devuelven al jugador sus propios tics: el aro de luz de Dani, las sillas prestadas, la sede en el salón, la ilusión de partido nuevo (Centrifugados: «Nosotros también fuimos nuevos. Disfrutadlo, que dura poco»). El jugador puede caer en lo que critica: prometerlo todo, hacerse viral sin programa o topar algo para salir en el telediario. Esas decisiones deberían costarle credibilidad igual que a los rivales.

## Más material de la vida política (usar con libertad)

Pegada de carteles a medianoche; jornada de reflexión en la que todo el mundo reflexiona por WhatsApp; colas de voto por correo en verano; sondeos que dan ganador a quien los encarga; la noche electoral con cada partido diciendo que ha ganado; pactos postelectorales que contradicen la campaña; tránsfugas; el mitin con autobuses de simpatizantes; el «cara a cara» con los cronómetros; mesas electorales con un vocal que no ha venido.

## Chistes prohibidos o gastados

**Prohibidos**
- Nombres, apodos o dobles de políticos reales (motes de redes como «Perro Sanxe», nombres apenas disfrazados, la coleta, la barba, etc.) y sus frases personales conocidas («me gusta la fruta», «manda huevos», «es el vecino el que elige al alcalde»…).
- Casos judiciales con nombre propio o insinuaciones de delito sobre personas reales (sobres, ERE, mascarillas, comisiones, financiación del fundador de SALF…). Ni siquiera «de broma».
- Terrorismo, ETA o víctimas en cualquier chiste sobre Bildu o el País Vasco.
- Estereotipos regionales: catalanes tacaños, vascos brutos, gallegos que «depende», andaluces vagos, canarios lentos.
- Lo que cruza la línea editorial (ver arriba): origen étnico, nacionalidad, religión, insultos a colectivos.
- «Desaparecidos» para Ciudadanos (connotación de dictadura y Guerra Civil).
- Avisos de ficción dentro del juego.

**Gastados** (solo si se les da una vuelta nueva)
- «Pudimos» para Podemos, «Restar» para Sumar, «PPSOE», «Box» para Vox, «naranjito» para Ciudadanos.
- El plasma, el Falcon, el colchón, el chalet: además de gastados, van contra personas concretas.
- «Fachas» y «rojos» como remate: el insulto no es un chiste.
- El presidente del CIS por su nombre: usar «el sondeo oficial» o «la encuesta que siempre acierta a favor del que la paga».

## Iteraciones del diseño

**Borrador 1:** Partido Popurrí (PP), Partido Siempre Opinando Esto (PSOE), Fox, Restar, Pudimos, Se Acabó La Siesta, Los Siete Magníficos (bloque regional), Ciudadanos Desaparecidos; rivales de debate: Fox y Pudimos.

**Crítica 1:** Popurrí no tiene idea de fondo y Siempre Opinando Esto no da el chiste del giro. Restar y Pudimos son de cuñado: ya los ha hecho todo el mundo. Los Siete Magníficos es un halago. Desaparecidos tiene una connotación muy dura en España. Llevar al debate a dos partidos de los extremos lo convierte en circo y no se parece a un debate real.

**Borrador 2:** Paciente (esperar turno, ganar y no gobernar), Sobrevivo Otra Elección (mismas siglas, el giro como método), Sumandos (la flor que pierde pétalos), Podríamos (condicional), Bloque Bisagra con miembros, Centrifugados (centro + lavadora). Debate: los dos grandes y la bisagra; el atril vacío completa el debate a cinco.

**Crítica 2:** los chistes de Fox se acercaban a sus votantes, así que pasaron a su estética y su contradicción. El aspecto de algunos líderes recordaba al de líderes reales (barba, coleta, zapatillas de correr) y se cambió. Se retiraron referencias a la financiación de SALF y a reuniones en el extranjero de Junts. Después llegó la línea editorial del creador: los partidos de izquierda reciben indirectas sobre topes, paguitas, reincidencia, observatorios e impuestos, y el PP y Fox mantienen las suyas sobre timidez liberal, portazos y banderas. Las indirectas que apuntaban a colectivos se reescribieron para apuntar a políticas.

**Sin validar:** si las parodias se reconocen en dos segundos y si el humor funciona solo se sabrá cuando lo lean jugadores reales.
