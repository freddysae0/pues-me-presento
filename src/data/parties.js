// Partidos rivales: parodias de los partidos españoles. Datos puros (sin Babylon ni DOM).
// Biblia, referencias reales, línea editorial y chistes prohibidos: docs/PARTIES.md.
// Líderes inventados; ninguna cifra es un dato real. `parodyOf` es solo para desarrollo:
// no se muestra en el juego (el aviso de ficción va únicamente en los créditos).

export const PARTIES = [
  {
    id: 'paciente',
    name: 'Partido Paciente',
    short: 'PP',
    parodyOf: 'PP (Partido Popular)',
    color: '#1f6fc5',
    color2: '#8fd0ff',
    logo: 'Gaviota azul sentada en un banco, con el periódico abierto y un reloj de arena a su lado.',
    leader: {
      name: 'Fermín Aguardo',
      title: 'Candidato a la Presidencia (otra vez, pero esta es la buena)',
      look: 'Chibi con traje azul marino sin corbata, mangas remangadas exactamente dos vueltas, camisa celeste, gafas de leer en la frente y un periódico doblado bajo el brazo. Pin de gaviota. Sonrisa de notario.',
      voicePitch: 118,
    },
    slogan: 'Ya nos toca.',
    promises: [
      'Derogar todo lo aprobado desde la última vez que gobernamos. Lo que pongamos después, en una fase posterior.',
      'Bajar impuestos con una calculadora que solo tiene la tecla de restar… a partir del segundo año, si la herencia lo permite.',
      'Quitar los topes al alquiler. Primero, una comisión que estudie cómo quitarlos sin que se note que los quitamos.',
      'Gestión. Mucha gestión. La palabra «gestión» cuarenta veces por mitin.',
      'Ganar las elecciones. Lo de gobernar se estudiará en una fase posterior.',
    ],
    tics: [
      '«Con sentido común.»',
      '«Lo que España necesita es un Gobierno serio.»',
      '«Como decía esta mañana un periódico…» (y lo lee entero)',
      '«Nosotros ya gobernamos y se notó.»',
      '«Hay que respetar a la lista más votada.» (solo cuando son ellos)',
    ],
    weakSpots: [
      'Ganar y no gobernar: la lista más votada esperando a la puerta del Congreso con el traje planchado.',
      'Pactan con Fox en las autonomías y en Madrid dicen que no los conocen de nada.',
      'Prometen liberalizar y, una vez dentro, heredan cada impuesto «por responsabilidad».',
      'Su programa es la palabra «derogar» con anexos.',
      'Cada barón tiene su propio partido dentro del partido: sus ejecutivas parecen una junta de vecinos.',
    ],
    debateLines: [
      'Señora moderadora, no vengo a hablar de mí; vengo a hablar de lo mal que lo hacen los demás.',
      'Nosotros ya bajamos impuestos una vez. Cuándo los subimos es otro bloque.',
      'Lo que propone usted ya lo propusimos nosotros, en otro programa, con otro nombre y en otra década.',
      'Yo he ganado las elecciones. Las últimas. Y las de antes, según cómo se cuente.',
      'Aquí hay uno que gestiona y luego están ustedes, que hacen política. Qué horror, la política.',
      'Le traigo un gráfico. Sube. Es bueno. No le diré de qué es.',
    ],
    tvLine: 'Aguardo asegura que «el cambio está más cerca que nunca», frase que su partido registró como marca hace ya varias campañas.',
    posterLine: 'FERMÍN AGUARDO · Ya nos toca · Vota con sentido común',
    tiktokLine: 'Paseo en mangas de camisa por un polígono industrial con música épica de banco de sonidos; rótulo «GESTIÓN». El candidato no habla en veinte segundos. Comentarios desactivados.',
    jabAtPlayer: 'Muy simpático lo del barrio. Cuando quiera gestionar algo más grande que un portal, me llama.',
    role: 'debate',
  },
  {
    id: 'sobrevivo',
    name: 'Partido Sobrevivo Otra Elección',
    short: 'PSOE',
    parodyOf: 'PSOE (Partido Socialista Obrero Español)',
    color: '#d8232a',
    color2: '#ffa3a8',
    logo: 'Puño sosteniendo una rosa; mirado de cerca, el puño cruza los dedos. En la versión animada la rosa gira ciento ochenta grados.',
    leader: {
      name: 'Nuria Giro',
      title: 'Secretaria General y Candidata (y lo que haga falta)',
      look: 'Chibi con camisa blanca remangada, vaqueros, chaqueta roja al hombro que nunca se pone y una chapa redonda de colores en la solapa. Gesto de mano abierta, como explicando algo evidente. Siempre recién llegada de algún sitio.',
      voicePitch: 205,
    },
    slogan: 'Avanzamos. En la dirección que toque.',
    promises: [
      'Topar el alquiler en toda España: los pisos bajarán de precio y, sobre todo, de número.',
      'Subir impuestos y llamarlo «redistribuir», que suena a reparto y no a recibo.',
      'Un ministerio por problema y un observatorio por ministerio, para observar cómo sigue el problema.',
      'Lo contrario de lo que prometimos la última vez, que ahora es justo lo que el país necesita.',
      'Frenar a la derecha. Es el programa, y también el plan B.',
    ],
    tics: [
      '«Rectificar es de sabios.» (y rectificar mucho, de muy sabios)',
      '«Frente a la ola reaccionaria…»',
      '«La mayoría social de este país…»',
      '«Eso es un bulo de la máquina del fango.»',
      '«Estamos en el lado correcto de la historia.»',
    ],
    weakSpots: [
      'Donde dijo «nunca» dice ahora «siempre lo defendimos»: la hemeroteca es su peor rival.',
      'Topan el alquiler y se sorprenden de que los pisos se vayan al alquiler de temporada o a la venta: zona tensionada, portal vacío.',
      'Llevan años en el Gobierno y la vivienda «es competencia autonómica»; los éxitos, competencia suya.',
      'Cada subida de impuestos llega con nombre de escudo; el escudo lo pagas tú.',
      'Gobiernan con socios que les votan un día sí y al siguiente depende.',
    ],
    debateLines: [
      'Desde que topamos el alquiler, en mi barrio no sube ningún piso. Tampoco se alquila ninguno, pero eso es otro bloque.',
      'Nosotros no cambiamos de opinión: la opinión evoluciona sola y nosotros la acompañamos.',
      'No subimos impuestos: redistribuimos. Usted paga más, pero con más justicia social.',
      'La alternativa a nosotros es el caos. Y la alternativa al caos, también nosotros.',
      'Eso que dice usted es un bulo. No sé cuál todavía, pero tiene pinta.',
      'Usted habla de hemeroteca. Yo prefiero hablar de futuro, que no tiene hemeroteca.',
    ],
    tvLine: 'Giro avisa de que «o nosotros o la derecha» y presenta un programa «igual que el anterior, pero corregido», acompañado de un nuevo Observatorio de Programas Corregidos.',
    posterLine: 'NURIA GIRO · Avanzamos · Que vienen los otros',
    tiktokLine: 'Dúo con un vídeo de la oposición: cara de incredulidad, zoom dramático y el rótulo «Lo han vuelto a hacer». Lo comparten a la vez todas las cuentas del Gobierno.',
    jabAtPlayer: 'Valoramos mucho las candidaturas vecinales. Tanto, que la próxima legislatura os absorbemos.',
    role: 'debate',
  },
  {
    id: 'fox',
    name: 'Fox',
    short: 'FOX',
    parodyOf: 'Vox',
    color: '#4f9a2c',
    color2: '#f2c230',
    logo: 'Cabeza de zorro verde con la mandíbula apretada y una pulserita rojigualda en la oreja. Debajo, «FOX», en inglés, sin que nadie en el partido quiera explicar por qué.',
    leader: {
      name: 'Covadonga del Muro',
      title: 'Presidenta y Jinete Nacional',
      look: 'Chibi con chaleco acolchado verde, camisa remangada, botas de montar y una pulsera rojigualda en cada muñeca. La acompaña a todos los actos un caballo low poly, aparcado en doble fila.',
      voicePitch: 140,
    },
    slogan: 'Make España Grande Again.',
    promises: [
      'Reconquistar lo que haga falta, empezando por la rotonda del polígono.',
      'Cerrar todos los chiringuitos, salvo el de la playa, que es tradición.',
      'Derogar la Agenda 2030 sin haberla leído, por si acaso.',
      'Más caballos en campaña y menos ideología en los colegios, incluidas las matemáticas si resultan sospechosas.',
      'Entrar en los gobiernos regionales para poder salir dando un portazo.',
    ],
    tics: [
      '«Derechita cobarde.»',
      '«La España que madruga.»',
      '«Sin complejos.»',
      '«Eso es ideología.» (cualquier cosa)',
      '«Los españoles de bien.»',
    ],
    weakSpots: [
      'Patriotas de pulserita con nombre y eslogan importados en inglés.',
      'Entran en gobiernos regionales y los abandonan en cuanto toca gestionar algo que no sea un enfado.',
      'Contra los políticos de carrera, con una cúpula que lleva media vida cobrando de la política.',
      'Defienden la España rural desde el escenario de una plaza de toros de capital de provincia.',
      'Mucho programa de banderas y poco de cuentas: si les preguntas por el presupuesto, te hablan de Covadonga.',
    ],
    debateLines: [
      'Mientras ustedes debaten, la España que madruga ya está durmiendo. Son las once de la noche.',
      'Sin complejos se lo digo: no he leído su programa y no me hace falta.',
      'Eso es ideología. Lo mío es sentido común. Lo del señor de azul, sentido común cobarde.',
      'Yo no pacto con nadie… salvo para entrar y luego irme dando un portazo.',
      'Make España Grande Again. Lo digo en inglés porque así me entienden en Bruselas.',
      'Le traigo un dato que no está en ningún sitio, precisamente porque nos lo ocultan.',
    ],
    tvLine: 'Del Muro llega al debate a caballo, se niega a dejarlo en el aparcamiento y el animal acaba en plano durante el minuto de oro.',
    posterLine: 'COVADONGA DEL MURO · Make España Grande Again · Defiende lo tuyo',
    tiktokLine: 'Cámara lenta a caballo por un trigal al atardecer, trompetas épicas, banderas al viento y el rótulo «Tienen miedo». Se oye un tractor que no sale en plano.',
    jabAtPlayer: 'Un partido de barrio, qué tierno. Cuando quiera defender algo más grande que una plaza, le presto el caballo.',
    role: 'debate',
  },
  {
    id: 'sumandos',
    name: 'Sumandos',
    short: 'S+',
    parodyOf: 'Sumar (y su galaxia de confluencias)',
    color: '#ff5f8f',
    color2: '#6fd3c7',
    logo: 'Flor de pétalos de colores, un pétalo por partido socio. En el cartel ya se le han caído dos y otro está a medio despegar.',
    leader: {
      name: 'Héctor Abrazo',
      title: 'Coordinador provisional de la mesa del espacio de la plataforma',
      look: 'Chibi con chaqueta de punto color frambuesa, chapa de flor multicolor, bandolera llena de pósits y una sonrisa que aguanta el mitin entero. Saluda abrazando a la cámara.',
      voicePitch: 175,
    },
    slogan: 'Sumamos. Luego ya contamos quién se ha quedado.',
    promises: [
      'Topar el alquiler, el pan, la luz y el café. Si falta café, un Observatorio Estatal del Café.',
      'Reducir la jornada sin tocar el sueldo: lo paga la empresa, que para eso es mala.',
      'Una ayuda para cada situación vital y otra para tramitar las anteriores, sin preguntar a nadie cómo ha llegado hasta la ventanilla.',
      'Un proceso de escucha de dieciocho meses para decidir si se abre un proceso de escucha.',
      'Unir a toda la izquierda en una sola lista, con primarias para el orden de los logos.',
    ],
    tics: [
      '«La gente.»',
      '«Con cariño.»',
      '«Vamos a escuchar.»',
      '«Este espacio…»',
      '«La vida cotidiana.»',
    ],
    weakSpots: [
      'Se llaman Sumandos y cada temporada se resta un socio.',
      'Cuando el tope vacía el mercado de alquiler, la solución propuesta es otro tope, ahora para los que se han ido.',
      'Cada problema se resuelve con un observatorio, una directora general y un logo nuevo.',
      'Más tiempo negociando el orden de los logos en la papeleta que haciendo campaña.',
      'En el Gobierno y en la oposición al Gobierno a la vez, según el ministerio.',
    ],
    debateLines: [
      'Si los caseros retiran los pisos por el tope, topamos también a los caseros. Con cariño.',
      'Yo no vengo a confrontar, vengo a escuchar. Y lo que oigo es que usted está mal.',
      'No es gasto, es inversión en la gente. Lo de quién lo paga lo escuchamos en la siguiente fase.',
      'Somos el espacio más plural: tan plural que no nos ponemos de acuerdo ni en el color del atril.',
      'Le invito a sumarse. Bueno, si se suma usted, igual se van dos.',
    ],
    tvLine: 'Sumandos presenta catorce logos en una sola papeleta y asegura que «la unidad está más fuerte que nunca», mientras dos socios dan otra rueda de prensa en la sala de al lado.',
    posterLine: 'HÉCTOR ABRAZO · Sumamos · (logos de los socios: consultar versión actualizada)',
    tiktokLine: 'Vídeo en una cocina, café en mano y guitarra acústica: «Hoy quiero hablaros con el corazón». Dura cuatro minutos. Quien llega al final se emociona; no llega nadie.',
    jabAtPlayer: 'Nos encanta lo que hacéis. ¿Habéis pensado en ser un pétalo?',
    role: 'background',
  },
  {
    id: 'podriamos',
    name: 'Podríamos',
    short: 'POD',
    parodyOf: 'Podemos',
    color: '#6b2d8f',
    color2: '#c8a2e8',
    logo: 'Tres círculos morados que se han ido fusionando hasta quedar uno, cada vez más pequeño y más saturado.',
    leader: {
      name: 'Rebeca Bases',
      title: 'Secretaria General (ratificada por las bases en una consulta que duró una tarde)',
      look: 'Chibi con camisa morada, pañuelo morado al cuello, mochila llena de libros de teoría y un micrófono de pódcast colgado al cuello. Saluda con el puño en alto por defecto.',
      voicePitch: 230,
    },
    slogan: 'Sí se podría.',
    promises: [
      'Asaltar los cielos, ahora con cita previa.',
      'Expropiar los pisos vacíos, empezando por los que se vaciaron cuando topamos el alquiler.',
      'Papeles y paguita para todo el que llegue, sin colas ni preguntas. Quien pregunte quién paga, a las cloacas.',
      'Un medio de comunicación propio, para que por fin alguien cuente la verdad, que es la nuestra.',
      'Acabar con la casta, de la que ya somos socios fundadores con antigüedad.',
    ],
    tics: [
      '«Las cloacas.»',
      '«Los poderes mediáticos.»',
      '«Los de arriba y los de abajo.»',
      '«Sí se puede.» (ahora en condicional)',
      '«Eso es un relato de la derecha.»',
    ],
    weakSpots: [
      'Nacieron contra la casta y ya tienen veteranos con trienios.',
      'Convierten las regularizaciones y las ayudas en un cartel luminoso y luego se ofenden si alguien dice «efecto llamada».',
      'Tratan la reincidencia como un problema de autoestima: la culpa es del sistema, del barrio y del Código Penal, nunca del que reincide.',
      'Salen de cada coalición denunciando que la coalición les traicionó; ya van varias.',
      'Llevan años diciendo que todos los medios están contra ellos… en todos los medios.',
    ],
    debateLines: [
      'No hablemos de delincuencia, hablemos de las causas. Y si el mismo señor ha robado treinta veces, hablemos de las treinta causas.',
      'Usted representa a la casta. Yo también, pero desde la autocrítica.',
      'Los pisos no faltan: están escondidos por los caseros. Desde que los topamos, se esconden mejor.',
      'Hay cloacas detrás de esta pregunta. No sé cuáles, pero huele.',
      'Nos fuimos de la coalición por coherencia. Y volveremos, también por coherencia.',
    ],
    tvLine: 'Bases anuncia que su partido «ha decidido por unanimidad» salir de la coalición que fundó, y que lo explicará en directo en su propio canal.',
    posterLine: 'REBECA BASES · Sí se podría · Que no te lo cuenten los de siempre',
    tiktokLine: 'Directo de tres horas desde su propio canal, desmontando un titular frase a frase con una pizarra. Todos los espectadores son cuentas del partido o del partido rival.',
    jabAtPlayer: 'Muy bonito lo vecinal. Ya os traicionará alguien, y entonces hablamos.',
    role: 'background',
  },
  {
    id: 'siesta',
    name: 'Se Acabó La Siesta',
    short: 'SALS',
    parodyOf: 'Se Acabó La Fiesta (SALF)',
    color: '#1d1d1f',
    color2: '#ffdd00',
    logo: 'Despertador antiguo sonando, con una lupa por tapa. Debajo, el enlace a un canal de mensajería en vez de una dirección.',
    leader: {
      name: 'Kevin Lupa',
      title: 'Fundador, portavoz y único community manager',
      look: 'Chibi con sudadera negra con capucha, gafas de sol en interiores, auriculares de diadema y un móvil en un palo de selfi siempre grabando. Detrás le flota un icono rojo de «EN DIRECTO».',
      voicePitch: 160,
    },
    slogan: 'Despierta. Te lo están ocultando.',
    promises: [
      'Una macrocárcel con wifi para retransmitir a los corruptos en directo, con suscripción mensual.',
      'Auditarlo todo en streaming, empezando por los demás.',
      'Sortear el sueldo de diputado entre los seguidores, en cuanto termine de leer las bases del sorteo.',
      'Gobernar sin partido, sin programa y sin medios: solo con la verdad y con el canal.',
    ],
    tics: [
      '«Esto no lo vas a ver en la tele.» (lo dice en la tele)',
      '«Compártelo antes de que lo borren.»',
      '«Abre los ojos.»',
      '«Los mafiosos de los partidos.»',
      '«Os lo dije.»',
    ],
    weakSpots: [
      'Antisistema con escaño, sueldo, asistente y sitio fijo en la cafetería del Parlamento.',
      'Su programa electoral es un hilo de mensajes que se borra a las veinticuatro horas.',
      'Dice que no es un partido, pero ya tiene dimisiones, expulsiones y un cisma interno, como un partido.',
      'Defiende la libertad de expresión de todos menos de quienes le critican, a los que bloquea.',
    ],
    debateLines: [
      'Este debate está amañado. Lo sé porque no me han dejado hablar el primero. Ni el último. Ni todo el rato.',
      'Tengo pruebas. Están en mi canal. Enlace en la bio.',
      'Ustedes son la casta y yo soy el pueblo. El pueblo con aro de luz, pero el pueblo.',
      'No he traído programa: el programa es la verdad, y la verdad no cabe en un PDF.',
      'Moderadora, ¿quién le paga? Es una pregunta. Solo pregunto.',
    ],
    tvLine: 'Lupa no acude al debate porque «está amañado», pero lo comenta en directo desde el móvil y asegura tener más audiencia que la cadena. No aporta el dato.',
    posterLine: 'SE ACABÓ LA SIESTA · Despierta · (el candidato sale de espaldas, mirando el móvil)',
    tiktokLine: 'Vertical, letras amarillas enormes, sirena de fondo y voz en off: «Lo que te esconden». Diez segundos, un enlace y «compártelo antes de que lo borren». Nadie lo borra.',
    jabAtPlayer: 'Partido de barrio… ya. ¿Y quién os paga el aro de luz? Solo pregunto.',
    role: 'background',
  },
  {
    id: 'bisagra',
    name: 'Bloque Bisagra',
    short: 'BB',
    parodyOf: 'Partidos nacionalistas y regionales que deciden investiduras (Junts, PNV, ERC, EH Bildu, BNG, Coalición Canaria…)',
    color: '#e0a100',
    color2: '#2a9d8f',
    logo: 'Llave dorada de siete dientes, cada uno pintado con una bandera regional inventada. El llavero es un calendario de negociaciones.',
    leader: {
      name: 'Mertxe Soler Arrieta',
      title: 'Portavoz rotatoria (este mes)',
      look: 'Chibi con traje gris de negociadora, maletín con candado, agenda con pósits de colores y una llave dorada colgada al cuello. Bufanda de un equipo de fútbol inventado.',
      voicePitch: 190,
    },
    slogan: 'Sin nosotros, no hay nada. Con nosotros, depende.',
    promises: [
      'Apoyar la investidura de quien sea a cambio de lo que sea, explicado en un comunicado de cuatro folios.',
      'Traspasar todas las competencias que queden, incluida la del cambio de hora.',
      'Un tren, una autovía y un ferri, pagados por todos e inaugurados solo aquí.',
      'Votar sí, votar no y votar «depende» en la misma semana, con la misma cara.',
    ],
    tics: [
      '«Lo nuestro.»',
      '«No es un cheque en blanco.»',
      '«Madrid.» (dicho como quien dice «Hacienda»)',
      '«Cada voto tiene su precio… perdón, su valor.»',
      '«Ya lo hablaremos.»',
    ],
    weakSpots: [
      'Dicen que la política española no les interesa y la deciden cada legislatura.',
      'Negocian con unos por la mañana y con otros por la tarde; su programa es una lista de la compra.',
      'Quieren irse de Madrid y tienen hotel reservado en Madrid para toda la legislatura.',
      'Con un puñado de escaños mandan más que partidos diez veces más grandes, y a eso lo llaman «aritmética».',
    ],
    debateLines: [
      'Yo no vengo a ganar el debate. Vengo a ver quién me llama después.',
      'Nuestro apoyo no es un cheque en blanco. Es un cheque con muchas cifras.',
      'Escuchar a los grandes pelearse es precioso. Ahora, que nos llamen.',
      'La política española no nos interesa. Por eso la decidimos nosotros.',
      'Pacto con usted, con usted y con usted. Por orden de llegada; el que traiga el tren, primero.',
    ],
    tvLine: 'El Bloque Bisagra «escuchará todas las propuestas» y deja la noche electoral sin gobierno conocido hasta nuevo aviso.',
    posterLine: 'BLOQUE BISAGRA · Lo nuestro, primero · Lo vuestro, ya veremos',
    tiktokLine: 'Una llave gira en una cerradura, luz cálida, silencio. Rótulo: «Ya sabéis dónde estamos». No necesitan seguidores: necesitan siete escaños.',
    jabAtPlayer: '¿Partido de barrio sin competencias transferidas? Qué pena. Así no os puedo ayudar.',
    members: [
      { name: 'Partido Negociador Vasco', parodyOf: 'PNV', line: 'Firmamos con quien sea. Pero antes, merienda y el cupo.' },
      { name: 'Junts per Després', parodyOf: 'Junts', line: 'Apoyaremos la investidura. O no. Lo decidiremos el último día, a la última hora, en el último minuto.' },
      { name: 'Esquerra Ho Tornarem a Pensar', parodyOf: 'ERC', line: 'Lo volveremos a hacer. Bueno, lo volveremos a pensar. Bueno, ya veremos.' },
      { name: 'Eh, Builder!', parodyOf: 'EH Bildu', line: 'Venimos a hablar de carreteras, presupuestos y guarderías. Pregúntennos por el polideportivo.' },
      { name: 'Bloque Non Grazas', parodyOf: 'BNG', line: 'Non, grazas. Bueno, sí, pero con la autopista.' },
      { name: 'Coalición con Cualquiera', parodyOf: 'Coalición Canaria', line: 'Con un solo escaño hemos conseguido más que ustedes con muchísimos. Ese ferri no se pagó solo.' },
    ],
    role: 'background',
  },
  {
    id: 'centrifugados',
    name: 'Centrifugados',
    short: 'Cf',
    parodyOf: 'Ciudadanos (Cs)',
    color: '#ff7a1a',
    color2: '#ffd2a8',
    logo: 'Corazón naranja dentro de una lavadora en pleno centrifugado, cada vez más pequeño, con el piloto de «fin de programa» encendido.',
    leader: {
      name: 'Lucas Centeno',
      title: 'Candidato, portavoz, tesorero y el que apaga la luz',
      look: 'Chibi semitransparente con traje naranja impecable, como un holograma que parpadea. Sonríe a un público que ya no está; sus seguidores son siluetas de cartón.',
      voicePitch: 250,
    },
    slogan: 'Seguimos aquí. (Comprobado por última vez: hace un rato.)',
    promises: [
      'Regenerar la política, empezando por regenerar el partido, a ser posible con alguien dentro.',
      'Ser bisagra de quien nos acepte; si no nos acepta nadie, de una puerta.',
      'Bajar impuestos o subirlos: lo que diga la última encuesta que todavía nos incluya.',
      'Ni de izquierdas ni de derechas ni, últimamente, de ningún sitio.',
    ],
    tics: [
      '«Regeneración.»',
      '«Centro liberal.»',
      '«Fuimos decisivos.»',
      '«¿Hola? ¿Se me oye?»',
      '«Volveremos más fuertes.»',
    ],
    weakSpots: [
      'Pasaron de decidir gobiernos a no tener representación, y nadie en el plató recuerda en qué momento.',
      'Sus dirigentes se fueron a otros partidos y no queda nadie en el suyo para denunciarlo.',
      'Iban a regenerar la política y la política los regeneró a ellos fuera.',
      'Cambiaron del centro a la derecha y de vuelta tantas veces que ya giran solos.',
    ],
    debateLines: [
      '¿Me oyen? Tengo atril, pero no me han puesto micro.',
      'Hace unos años todos ustedes me llamaban para pactar. Ahora ni para felicitarme el cumpleaños.',
      'Yo propongo lo mismo que usted, pero en naranja.',
      'Fuimos decisivos. Lo pone en la enciclopedia.',
      'Mi equipo está en la sala. Bueno, está en otros partidos, pero me anima desde allí.',
    ],
    tvLine: 'Centrifugados convoca una rueda de prensa para anunciar que sigue existiendo; acuden dos periodistas y uno se ha equivocado de sala.',
    posterLine: 'CENTRIFUGADOS · Seguimos aquí · (cartel de hace dos campañas, reaprovechado)',
    tiktokLine: 'Su último vídeo es de hace dos años. Cada semana alguien comenta «¿Seguís vivos?» y el community manager responde con un corazón… desde la cuenta de otro partido.',
    jabAtPlayer: 'Un partido nuevo, qué ilusión. Nosotros también fuimos nuevos. Disfrutadlo, que dura poco.',
    cameo: 'Quinto atril vacío en el debate: micrófono apagado, vaso de agua y una chapa naranja.',
    role: 'background',
  },
];

/** Rivales del debate del salón y del duelo de réplicas, en orden (Rival A, Rival B, Rival C). */
export const DEBATE_RIVALS = ['paciente', 'sobrevivo', 'fox'];
/** Rol de cada uno en el guion (script.rivals.<role>) y su personaje 3D en el salón, en el mismo orden que DEBATE_RIVALS. */
export const DEBATE_ROLES = [{ role: 'tech', actor: 'Rival A' }, { role: 'populist', actor: 'Rival B' }, { role: 'hard', actor: 'Rival C' }];

/** Moderadora ficticia: parodia de los debates a cinco de la televisión. */
export const MODERATOR = {
  name: 'Maite Escaleta',
  title: 'Moderadora del debate',
  style: 'Debate a cinco de televisión: dos cronómetros, bloques temáticos, «minuto de oro», tarjetas que reordena sin parar y una ceja que se oye. Nunca dice que alguien miente: dice «queda dicho».',
  look: 'Chibi con americana color crema, tarjetas en la mano, pinganillo y un cronómetro de mesa gigante. Media melena perfecta que no se mueve ni con el aire acondicionado.',
  voicePitch: 215,
  lines: [
    'Buenas noches. Cinco atriles, cuatro candidatos y una jarra de agua que nadie va a abrir.',
    'Les recuerdo que el tiempo es igual para todos. Los cronómetros, no.',
    'Pasamos al bloque de vivienda. Lo hemos dejado para el final para que lleguen cansados.',
    'Minuto de oro: sesenta segundos para convencer a quien siga despierto.',
    'No se interrumpan, por favor. Bueno, sigan, que da audiencia.',
    'Queda dicho.',
  ],
};

const BY_ID = new Map(PARTIES.map(p => [p.id, p]));

/** Partido por id, o null si no existe. */
export function partyById(id) {
  return BY_ID.get(id) || null;
}

/** Partidos del debate, en el orden de DEBATE_RIVALS. */
export function debateParties() {
  return DEBATE_RIVALS.map(partyById);
}

/**
 * Reparto del debate para los rivales de un guion: [{ role, actor, name, party, color, voicePitch }].
 * Nombres del guion activo (pueden no coincidir con los líderes de PARTIES); color y tono de voz, del partido.
 * Más la moderadora (role 'moderator', actor 'Moderadora').
 */
export function debateCast(rivals = {}) {
  const cast = DEBATE_ROLES.map(({ role, actor }, i) => {
    const p = partyById(DEBATE_RIVALS[i]), r = rivals[role];
    return r?.name ? { role, actor, name: r.name, party: r.party, color: p.color, voicePitch: p.leader.voicePitch } : null;
  }).filter(Boolean);
  if (rivals.moderator) cast.push({ role: 'moderator', actor: 'Moderadora', name: rivals.moderator, party: null, color: '#c9a66b', voicePitch: MODERATOR.voicePitch });
  return cast;
}
