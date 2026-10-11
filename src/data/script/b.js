// Rama B del guion: «Sátira de argumentario». Sobrescribe actual.js; lo que falte cae en actual.
// Lee el encabezado de actual.js: esquema, funciones (state, ctx) y restricciones que comprueban las pruebas.
// Running gag: Dani manda el argumentario a las 7:00; Marisa, metida en el grupo por error, lo traduce.
// Es la capa que usa el juego: src/data/script/index.js la fusiona siempre sobre actual.js. Validar: npm.cmd test (tests/script.test.js).

export const meta = {
  label: 'B · Sátira de argumentario',
  pitch: 'El lenguaje político como enemigo: Dani manda el argumentario a las 7:00 y Marisa, metida en el grupo por error, lo traduce al castellano.',
};

const PROPOSAL_DEFAULT = 'Una cosa bien hecha, para empezar.';

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: 'Fermín Aguardo', party: 'Partido Paciente' },
    populist: { name: 'Nuria Giro', party: 'Partido Sobrevivo Otra Elección' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Maite Escaleta',
  },

  // Clave nueva para el tercer atril (la conecta el coordinador).
  foxDebate: {
    hallLine: 'He dejado el caballo en doble fila. Si se lo llevan, es ideología.',
    interruption: 'Excuse me! Sin complejos: o me deja hablar o me levanto y me voy. Tengo práctica saliendo de gobiernos.',
    round: {
      topic: 'Seguridad', role: 'hard',
      claim: 'Al que le roba el bolso a la señora de la parada lo han detenido once veces. Once. Y el Gobierno, en vez de jueces, abre un observatorio. ¿Usted qué haría?',
      options: [
        'Que reincidir no salga gratis: juicio rápido y que no salga por la misma puerta el mismo día. Y jueces, que cuestan dinero. Lo decimos.',
        '¡Mano dura! ¡Y un caballo por barrio!',
        'Hablemos de las causas. De las once.',
      ],
      correct: 0,
    },
    reactions: {
      right: 'Hombre. Eso no es de derechita cobarde. Por esta vez.',
      wrong: '¿Lo ve? Sin complejos se piensa más rápido. Le presto el caballo.',
      timeout: 'Mientras usted piensa, la España que madruga ya se ha acostado.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'ELECCIONES GENERALES · ARGUMENTARIO INCLUIDO',
    tagline: 'Los demás partidos tienen asesores. Tú tienes una panadera que traduce.',
  },

  chapters: ['Pues me presento', 'La sede es mi salón', 'Bajar a la calle', 'Hazlo viral', 'Se ha sacado de contexto', 'El último mitin'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'Comparecencia en el sofá', objective: 'Acércate al móvil, junto al sofá. Pulsa E.' },
    call: { title: 'Ronda de consultas', objective: 'Usa el portátil de la mesa para llamar a tus amigos.' },
    register: { title: 'Constituidos a todos los efectos', objective: 'Ve a la carpeta del escritorio y registra el partido.' },
    leave: { title: 'Toma de contacto con la realidad', objective: 'Sal por la puerta verde para bajar a la plaza.' },
    neighbor: { title: 'Proceso de escucha (de verdad)', objective: 'Habla con Marisa, junto al toldo de la panadería. Paco, en la terraza del bar, también tiene cosas que contar.' },
    program: { title: 'No cabe todo en un decreto', objective: 'Elige tu primera propuesta en el tablón de la plaza.' },
    speech: { title: 'Primera comparecencia, con público', objective: 'Sube al punto del atril y da tu primer discurso.' },
    aftermath: { title: 'La cola del pan hace el análisis', objective: 'Vuelve con Marisa para saber qué se comenta en la cola del pan.' },
    hqBrief: { title: 'La sede es mi salón', objective: 'Reúne al equipo en la mesa de campaña. Lola, Dani y Nico también quieren hablar contigo.' },
    video: { title: 'Hazlo viral (con mensaje, a poder ser)', objective: 'Graba un vídeo en la marca junto a la panadería.' },
    crisis: { title: 'Eso no fue exactamente lo que dije', objective: 'Afronta la crisis en el tablón. Antes, quizá convenga oír al equipo.' },
    debate: { title: 'El debate del salón', objective: 'Entra en el debate con los rivales.' },
    finalPrep: { title: 'Última vuelta al barrio', objective: 'Elige en el mapa dónde concentrar el último esfuerzo.' },
    finalSpeech: { title: 'El último mitin, sin autobuses', objective: 'Cierra la campaña ante el público.' },
    election: { title: 'La noche de las sillas', objective: 'Consulta el resultado electoral.' },
    complete: { title: 'Campaña completada', objective: 'La campaña ha terminado.' },
  },

  // Trayectos a pie (ver actual.js): solo título y objetivo; prompt, loading y sign caen de actual.js.
  travel: {
    hqBrief: { title: 'Desplazamiento institucional', objective: 'La sede está en el bajo del portal de al lado del bar de Paco. Ve a la puerta y pulsa E.' },
    video: { title: 'Salir a medios (a la plaza)', objective: 'Para grabar hace falta luz y vecinos. Sal por la puerta de la sede y baja a la plaza.' },
    crisis: { title: 'Reunión de urgencia, con tupper', objective: 'Algo arde en el grupo de la sede. Vuelve por el portal junto al bar.' },
    debate: { title: 'Traslado al salón multiusos', objective: 'Sal por la puerta de la sede. En el salón multiusos ya han montado los atriles.' },
    finalPrep: { title: 'Pisar territorio', objective: 'Sal del salón por la puerta doble. Queda una semana y se gana en la calle.' },
    finalSpeech: { title: 'Transporte público, como el votante medio', objective: 'Ve a la parada junto al quiosco y coge el 27 hasta el salón multiusos.' },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: 'Sombra antes que un observatorio del calor', cost: '2 de presupuesto', benefit: 'Árboles, toldos, una fuente que funcione y el bajo vacío de la esquina como sala fresca para mayores. Sin plan director: con jardinero.', compromise: 'Se pierden plazas de aparcamiento, la terraza de Paco encoge dos mesas y el sobrino de Marisa vuelve a la doble fila.' },
    parking: { title: 'Que el barrio pueda trabajar', cost: '2 de presupuesto', benefit: 'Carga y descarga con horario, plazas rotatorias para el comercio, aparcabicis para repartidores y licencias de terraza en días, no en trimestres.', compromise: 'Más coches en la plaza y otro agosto a pleno sol. El banco seguirá hirviendo.' },
    festival: { title: 'Cultura después de las ocho', cost: '2 de presupuesto', benefit: 'Escenario para grupos del barrio, cine de verano y un local de ensayo que gestiona la asociación de vecinos, no una fundación con logo.', compromise: 'Ruido dos noches por semana; los del primero, con tapones. La sombra y la carga y descarga, al cajón.' },
    housing: { title: 'Que el tercero vuelva a tener vecinos', cost: '2 de presupuesto', benefit: 'Licencias en semanas, construir en el solar de la esquina y que alquilar un piso cerrado no dé miedo.', compromise: 'Construir tarda más que anunciar un tope. No sale en el telediario, te llamarán «el de los caseros» y la plaza sigue sin sombra.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'Lee el BOE por gusto', line: 'Trabajo en una gestoría y leo el BOE en el metro, como quien lee novela negra: el muerto siempre está en la disposición adicional. Te llevo las cuentas.', choices: [
      { label: 'Tesorería. Tú decides cuándo es no.', reply: 'Acepto. Primera norma: aquí nada «se financia con crecimiento». Se financia con dinero, que es más aburrido, pero existe.' },
      { label: 'Estrategia. Que alguien lea la letra pequeña.', reply: 'Hecho. La letra pequeña es donde los gobiernos esconden lo importante. La grande es para el cartel.' },
    ] },
    dani: { role: 'Habla en hilo', line: 'Hago vídeos para una clínica dental y un gimnasio. Me he leído todos los hilos de «exasesor de campaña» que existen. Vosotros poned las ideas; yo os hago el relato.', choices: [
      { label: 'Comunicación. Relato sí, humo no.', reply: 'Trato. Cada mañana a las 7:00, argumentario en el grupo. Corto, claro y sin la palabra «resiliencia». Bueno, casi sin.' },
      { label: 'Portavoz. Tendrás que contestar preguntas.', reply: '¿Ruedas de prensa con preguntas? Eso ya no lo hace nadie. Vale: seremos vintage.' },
    ] },
    nico: { role: 'Conoce a todo el portal', line: 'Hago turnos en un almacén y conozco a todo el portal. Yo movilizo. Pero si alguien dice «transversal» en una reunión, me bajo a por pipas.', choices: [
      { label: 'Organización. Tú pones los horarios.', reply: 'Hecho. Reuniones de veinte minutos. Si dura más, es que alguien está leyendo un argumentario.' },
      { label: 'Actos. Necesitamos tu voz de megáfono.', reply: 'Cuando tocó el Gordo en el bar, bajó la calle entera en zapatillas. Dame un motivo así y te lleno la plaza.' },
    ] },
  },

  call: {
    title: 'Ronda de consultas. Por videollamada.',
    you: 'Ha tenido una idea',
    next: 'Siguiente valiente',
    done: 'Ya tenemos equipo. Dani ha creado el grupo «Argumentario 7:00». Y, sin querer, ha metido a Marisa la de la panadería.',
    doneBabble: 'Ya tenemos equipo.',
    finish: 'Bajar a la plaza',
  },

  register: {
    eyebrow: 'FUNDACIÓN · VENTANILLA ÚNICA',
    title: 'Un nombre para la papeleta.',
    stamp: 'PENDIENTE DE SUBSANAR',
    intro: 'Tres campos. Ni certificado digital, ni cita previa, ni anexo III. Si esto es un sueño, que no se despierte nadie del Ministerio.',
    defaultName: 'La Gente del Banco',
    defaultSlogan: PROPOSAL_DEFAULT,
    submit: 'Registrar candidatura',
    toast: 'REGISTRADO. Resuelto en cero días hábiles. Nadie en la ventanilla sabe cómo ha pasado.',
  },

  program: {
    eyebrow: 'PROGRAMA · PRESUPUESTO: 2 CRÉDITOS',
    title: 'Priorizar: elegir, pero con corbata.',
    intro: 'Solo cabe una propuesta. Las demás no se «calendarizan» ni se «posponen a una segunda fase»: se quedan sin hacer. El barrio sabe distinguir.',
    promisedBothNote: 'Marisa recuerda que prometiste sombra, aparcamiento y piso para su sobrino. Ninguna opción paga todo eso. −6 de credibilidad al concretar.',
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Ahora, a explicarlo en el atril. Con preguntas.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ['Bueno. Pues aquí estamos.', '¿Qué vas a defender?', 'La última frase cuenta.'],
    parts: {
      opening: { title: '01 / Romper el hielo', prompt: 'Siete personas. Dos esperan el bus, una ha bajado a por el pan y otra te graba por si dices «resiliencia».', options: {
        listen: 'Antes de hablar, he venido a escuchar. De verdad, no en «proceso de escucha».',
        joke: 'Seré breve. Lo digo como político, así que poneos cómodos.',
        grand: '¡Hoy iniciamos una hoja de ruta transversal hacia un nuevo horizonte de país!',
      } },
      argument: { title: '02 / Decir algo concreto', prompt: 'Ahora toca defender lo que has clavado en el tablón. Marisa ya ha sacado la libreta.', options: {
        shade: 'Sombra y un sitio fresco para los mayores, aunque perdamos aparcamiento. Sin plan director: con árboles.',
        parking: 'Que quien trabaja pueda descargar, aunque la plaza siga sin árboles este verano.',
        festival: 'Cultura y un local para los chavales, con horario de ruido pactado y por escrito.',
        housing: 'Más pisos: suelo, licencias rápidas y que alquilar no dé miedo. No baja el lunes; baja construyendo.',
        everything: '¡Árboles, aparcamiento, festivales y un piso para cada uno, gratis y en un decreto el lunes!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'Marisa mira el reloj. Es un reloj que ha visto muchas campañas.', options: {
        accountable: 'Si no lo cumplimos, nos lo preguntáis aquí. Y contestaremos, que ya es novedad.',
        chant: '¡Menos atasco y más gazpacho!',
        forever: 'Para concluir, y en aras de la brevedad, mis siguientes veintisiete ejes…',
      } },
    },
    timing: { eyebrow: '04 / DARLE EL GOLPE FINAL', title: 'Ahora. Con convicción.', button: '¡Y por eso me presento!' },
    result: {
      eyebrow: 'EL BARRIO HA ESCUCHADO',
      goodTitle: 'Un aplauso. Sin claque.',
      badTitle: 'Aplauso de cortesía. En la tele, «buena acogida».',
      coherent: 'Has defendido tu propuesta y has dicho lo que cuesta. En política eso tiene un nombre raro: decir la verdad.',
      incoherent: 'Tu discurso no coincide con el programa. En la tele lo llaman «matizar». En la cola del pan, otra cosa.',
      fine: 'El alcance mide atención, no votos. Las consecuencias dependen de lo que has dicho.',
      button: 'Bajar del atril',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: '¿Tú eres el del partido nuevo? Me ha llegado vuestro argumentario: Dani me metió en el grupo sin querer. Lo leo a las cinco, con la primera hornada.' },
      { speaker: 'Marisa', text: 'Mi sobrino reparte y no tiene dónde parar. Treinta y cuatro años, en su cuarto de pequeño. Y el tercero lleva cerrado desde lo de la ley. ¿Por dónde empiezas?', choices: [
        { text: 'Por escucharte. ¿Qué te quita el sueño?', memory: 'listened', response: '¿A mí? La paciencia. La cita de mi madre es para dentro de meses, y la espera, al sol.' },
        { text: 'Por todo: sombra, aparcamiento y un piso para tu sobrino.', memory: 'promisedBoth', response: 'Eso en la tele se llama «paquete integral de medidas». Aquí, «ya veremos». Lo apunto en la libreta.' },
        { text: 'Por hacer ruido: un festival que nos ponga en el mapa.', memory: 'spectacle', response: '¿En el mapa? Si salimos en todas las webs de pisos turísticos: «auténtico barrio castizo». Lo único castizo que queda soy yo, y cierro a las dos.' },
      ] },
      { speaker: 'Marisa', text: 'Ahí tienes el tablón. Da para una cosa. Una. Y en el atril, nada de «poner en valor» ni «hoja de ruta». Si lo dices, te tiro una barra de pan.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Me prometiste sombra, aparcamiento y piso para mi sobrino. Tres cosas y ninguna fecha. Página doce de la libreta.'
        : m.listened ? 'Antes me has escuchado. Parece poco, pero los que vienen con el discurso plastificado no levantan la vista del papel.'
        : m.spectacle ? 'Lo del festival lo ha oído todo el barrio. Los del primero ya preguntan si los tapones van en el programa o en un real decreto.'
        : 'Ya has bajado del cajón. Te temblaban las piernas menos que al del año pasado. Y el del año pasado traía autobús de simpatizantes.';
      const coherent = {
        shade: 'Has dicho que quitas coches para poner sombra. Mi sobrino ya no te habla; mi madre ya te defiende. Has elegido. Ya era hora.',
        parking: 'Has elegido la furgoneta antes que los árboles. Mi sobrino te invita a una caña. Yo, en agosto, te mando a mi madre a esperar el bus a tu salón.',
        festival: 'Cultura hasta las doce y ruido con horario. Por lo menos no lo has llamado «dinamización del espacio público».',
        housing: 'Has dicho «construir» y «tarda». En un atril eso no se oye: se oye «tope» y «ya». Mi sobrino dice que es la primera vez que le explican por qué no hay pisos.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'No estoy de acuerdo en todo. Pero has dicho qué cuesta. Eso, en un atril, es casi exótico.')
        : speech.picks?.[1] === 'everything' ? 'Árboles, aparcamiento, festivales y pisos por decreto. Cariño, eso no es un programa: es un decreto ómnibus.'
        : 'El tablón decía una cosa y tú otra. En la tele lo llaman «matizar». Aquí, «cambiar de idea entre el pan y el autobús».';
      const closing = m.pacoLucia ? 'Me ha dicho Paco que le has conseguido camarera. Eso no sale en ningún argumentario. Sale en la cola del pan, que es donde se vota.'
        : (speech.reach || 0) >= 12 ? 'Dani dice que el vídeo lo han visto miles. Aquí lo han visto doce. Y los doce están empadronados. Tú verás a quién le hablas.'
        : 'Bueno. Ya tienes partido, equipo y una señora vigilándote. Ahora sí estás en política.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Seis sillas. La séptima es la mía y no entra en la negociación».' : s.memories.pacoLucia ? 'Paco: «La chica ya sabe más de tortilla que yo. No se lo digas».' : 'Paco: «Mira, te digo una cosa: cuánto cuesta. Y si no lo sabes, que no lo sabes».',
      lines: [
        { speaker: 'Paco', text: 'Paco, bar La Última. Aquí se cierran más pactos que en el Congreso, y todos se pagan a escote. ¿Qué te pongo?', choices: [
          { text: '¿Qué le pedirías tú a un partido nuevo?', memory: 'pacoHeard', response: 'Mira, te digo una cosa: que diga cuánto cuesta. Y si no lo sabe, «no lo sé». En la tele no lo he oído nunca. Sería tendencia, que dice mi sobrina.' },
          { text: '¿Nos prestas sillas para el acto?', memory: 'chairs', response: 'Seis. Es un préstamo, no una subvención: vuelven a su sitio y vuelven limpias.' },
          { text: '¿Cómo va el negocio?', memory: 'pacoRent', response: 'Me han subido el local, la luz y el café. Ahora uno en la tele quiere topar el precio del café. Pues pondré «café de temporada». Como con los pisos.' },
        ] },
        { speaker: 'Paco', text: 'Y mira ese cartel: «Se busca camarero». Lleva colgado desde Semana Santa. Ya tiene más antigüedad que mi cafetera.', choices: [
          { text: '¿Has probado a pagar más?', memory: 'pacoWages', response: 'Sí. Subo el café diez céntimos y me cae una reseña: «atraco». Si me lo subiera Hacienda, se llamaría «redistribuir».' },
          { text: 'Es que los jóvenes ya no quieren trabajar.', memory: 'pacoBlame', response: 'Eso decía yo, hasta que vino uno con tres currículums y una pregunta: «¿y dónde vivo?». Con lo que pago, en el almacén de las sillas. No volvió.' },
          { text: 'Lucía, la estudiante de la fuente, busca algo para los findes.', memory: 'pacoLucia', response: '¿La de los apuntes en cuatro colores? Que venga. Contrato por escrito y tortilla de la casa. Has juntado a dos personas sin crear una mesa de diálogo. Eso es nuevo.' },
        ] },
        { speaker: 'Paco', text: 'Y ahora perdona, que la mesa del fondo pide sangría a las once de la mañana. Esos tienen un programa claro y lo cumplen.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'El tablón, al lado del árbol. Una propuesta. Si clavas dos ya es un «paquete de medidas», y los paquetes, cariño, siempre los paga alguien.',
        speech: 'Sube ya al cajón, que se enfría el pan y se enfría la gente. Y nada de «poner en valor».',
        video: 'El argumentario de hoy pone «tono cercano». ¿Más cerca? Si te veo desde el horno.',
        crisis: 'El vídeo me ha llegado por el grupo de la parroquia, el del gimnasio y el de mi cuñada. Cuando llega a mi cuñada, cariño, ya es oficial.',
        debate: 'Esta noche, debate. Si te oigo «la mayoría social», te tiro una barra de pan desde la grada.',
        finalPrep: 'Última vuelta. Pásate por la parada del bus: la gente que espera tiene tiempo y tiene quejas. Escucha, que ellos ya llevan un rato hablando.',
      }[s.mission] || 'Yo aquí, con mi libreta. Tú a lo tuyo, que te estoy mirando.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Sigo con el BOE de hoy. Disposición final séptima. Ha muerto el mayordomo».', lines: [
        { speaker: 'Lola', text: 'Mientras os peleáis con el vídeo, he leído el BOE. Un decreto mete pensiones y cambio de hora en el mismo paquete. Lo nuestro es más pequeño: nos miran las cuentas con lupa.', choices: [
          { text: 'Publícalas. Todas.', memory: 'lolaBooks', response: 'Hasta el tíquet del celo. Si nos pillan, que sea en un redondeo de siete céntimos. Y en documento aparte, no metido entre las pensiones.' },
          { text: 'Mejor esperamos a que pase.', memory: 'lolaWait', response: 'Eso en un ministerio se llama «no consta». Las crisis no pasan: se archivan. Y alguien las desarchiva la semana antes de votar.' },
        ] },
      ] },
      default: { after: 'Lola: «Pestaña nueva: “Cosas que no vamos a pagar”. Doce filas. Ninguna dice “se financia sola”».', lines: [
        { speaker: 'Lola', text: 'He abierto la hoja «Campaña_DEFINITIVA_v3». Ingresos: el bote del grupo y cuarenta euros que nos debe Dani. Él lo llama «deuda histórica».' },
        { speaker: 'Lola', text: 'Gastos: pizzas, imprenta y una factura de «consultoría de relato» firmada por el primo de Dani. ¿La pago?', choices: [
          { text: 'Ni de broma. Todo con factura y todo publicado.', memory: 'lolaReceipts', response: 'Gracias. Si salimos en las noticias, que sea por aburridos. Transparencia de verdad, no un portal que se cae el día que lo buscas.' },
          { text: 'Págala, que el primo es majo.', memory: 'lolaCousin', response: 'Majo es. Te la apunto en la pestaña «Adjudicaciones a dedo, versión barrio». Ya verás qué bien queda en un hilo.' },
          { text: 'Oye, Lola… ¿y tú cómo llegas a fin de mes?', memory: 'lolaRent', response: 'Comparto piso con dos opositores. Estudian leyes que cambian antes del examen. Yo pago y ellos me resumen el BOE. Por eso estoy aquí, ¿vale?' },
        ] },
        { speaker: 'Lola', text: 'Venga, a la mesa. Pedido: barbacoa y cuatro quesos. La de piña la propuso Dani, pero no ha superado el trámite de audiencia.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Llevo tres versiones del comunicado. Las tres empiezan por “Ante las informaciones aparecidas”».', lines: [
        { speaker: 'Dani', text: 'Cuatrocientos comentarios: doscientos bots, cien de mi madre defendiéndote y cien de gente real muy enfadada. El clip lo ha subido un canal de Se Acabó La Siesta.', choices: [
          { text: 'Contesta a los de verdad, uno a uno.', memory: 'daniReply', response: 'Uno a uno. Sin «lamentamos que se haya podido malinterpretar». Pásame café. Si me ves escribir «relato», quítame el móvil.' },
          { text: 'Bloquea a todo el mundo y sube un meme.', memory: 'daniMeme', response: 'Hecho. Ahora el meme tiene más comentarios que el problema. Los asesores lo llaman «cambiar el marco». Mi abuela, «escurrir el bulto».' },
        ] },
      ] },
      default: { after: 'Dani: «Estoy con el argumentario de mañana. Llevo dos horas dudando entre “apostar por” y “seguir apostando por”».', lines: [
        { speaker: 'Dani', text: 'Mañana sale tu primer argumentario. Te leo: «Frente al ruido, barrio. Frente al relato, hechos. Frente a…». Vale, me ha quedado un poco frentista.' },
        { speaker: 'Dani', text: 'Te grabo explicando el programa. ¿Formato oficial, en mangas de camisa paseando por un polígono, o con filtro y la canción de moda?', choices: [
          { text: 'Sin filtro y sin polígono. Que se vean las ojeras.', memory: 'daniNoFilter', response: 'Valiente. Las ojeras son lo único auténtico que queda en internet. Pocos likes, pero de gente que existe.' },
          { text: 'Con filtro y con la canción de moda.', memory: 'daniTrend', response: 'Así me gusta. Mañana nadie sabrá qué propones, pero todo el mundo sabrá que bailas como un ministro en una verbena.' },
          { text: '¿Y tú qué tal, con tantos curros?', memory: 'daniJobs', response: 'Tres clientes y mi madre preguntando cuándo me hacen fijo discontinuo, que a ella le suena a fijo. Esto es lo único que hago gratis. Y lo único que me apetece.' },
        ] },
        { speaker: 'Dani', text: 'Una cosa: el argumentario lo escribo yo, pero lo corrige Marisa. No sé cómo entró en el grupo. Ya no me atrevo a echarla.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Estoy montando sillas. Una se pliega sola. Esa no vota».', lines: [
        { speaker: 'Nico', text: 'Ha bajado Ernesto, el del tercero. Tiene el piso cerrado desde lo del tope y dice que el vídeo le llama especulador. Luego me ha pedido que le riegue las plantas.', choices: [
          { text: 'Invítale a la asamblea del portal. Que dé su versión.', memory: 'nicoInvite', response: 'Vale. Dice que alquilaría si supiera que lo recupera. O sea: él tiene un piso, el sobrino de Marisa no, y en medio hay una ley. Qué cosas.' },
          { text: 'Ni caso. Es el enemigo.', memory: 'nicoEnemy', response: '¿Enemigo? Es Ernesto, del colegio. Le debo un balón desde sexto. Dani le llama «gran tenedor» en el argumentario. Tiene un piso. Heredado.' },
        ] },
      ] },
      default: { after: 'Nico: «Voy a por más celo. Este pega cuando quiere, como un socio de Gobierno».', lines: [
        { speaker: 'Nico', text: 'He pegado cuarenta carteles. Junto al de Fox había un caballo de verdad, en doble fila. Le he pegado uno también. No ha protestado. Primer apoyo.' },
        { speaker: 'Nico', text: 'Por cierto, la Reme dice que vota a quien le consiga cita con el cardiólogo antes de Navidad. ¿Qué le digo?', choices: [
          { text: 'La verdad: que eso no se arregla en un mes, pero lo vamos a pelear.', memory: 'nicoTruth', response: 'Se lo digo. Pondrá la cara que ponen las señoras cuando oyen la verdad: pena y respeto, a partes iguales. El voto, ya veremos.' },
          { text: 'Dile que sí. Cita en una semana.', memory: 'nicoPromise', response: 'Le prometes en una semana lo que la lista de espera tarda medio año. En diciembre, la Reme te lo recuerda. Con el bastón.' },
          { text: 'Que venga a la asamblea del portal y nos lo cuente a todos.', memory: 'nicoAssembly', response: 'Buena idea. Los del bloque llevan años quejándose cada uno en su rellano. Juntos son una junta de vecinos: una investidura, pero con derrama.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ['CAPÍTULO 1', 'Pues me presento'],
      tv: { headline: '¡ELECCIONES!', ticker: 'ÚLTIMA HORA · DISOLUCIÓN DE LAS CORTES · COMPARECENCIA SIN PREGUNTAS' },
      subs: [
        [null, 'Domingo, 23:47. «Un vídeo más y lo dejo».'],
        ['Presentadora (TV)', 'Última hora: el Gobierno disuelve las Cortes y convoca generales. La presidenta comparece sin preguntas: «las respuestas ya están en la web».'],
        ['Presentadora (TV)', 'Los partidos de siempre ya graban vídeos en mangas de camisa. Uno ha llegado a caballo. Seguiremos informando. O no.'],
        [null, 'BZZZ. Cuarenta y tres mensajes. «¿Y si nos presentamos?». «jajaja». «No, en serio».'],
        ['Tú', '¿Elecciones? ¿Otra vez? …A ver qué dice el grupo.'],
      ],
      toast: 'El móvil no para de vibrar. Está en la mesita, junto al sofá.',
    },
    plaza: {
      banner: ['EL BARRIO', 'Bajar a la calle'],
      subs: [
        [null, 'La plaza: panadería, bar, un banco al sol y más opiniones por metro cuadrado que un plató.'],
        ['Marisa', '¡Anda, el del partido nuevo! Ven, que te tengo que contar.'],
        ['Paco', 'Si vas a salvar el barrio, que sea después del café. Y el café se paga, que no es una medida.'],
      ],
    },
    hq: {
      banner: ['CAPÍTULO 2', 'La sede es mi salón'],
      subs: [
        [null, 'La sede: un salón, una mesa plegable y dos enchufes. Uno funciona. El otro, «en tramitación».'],
        ['Lola', 'Bienvenidos a la sede. El sofá es la sala de prensa; la nevera, la tesorería. Auditada.'],
        ['Dani', 'He llamado al wifi «Gabinete». Ya tenemos estructura.'],
        ['Nico', 'Orden del día: uno, sillas. Dos, quién trae hielo. Tres, España.'],
      ],
    },
    hall: {
      banner: ['CAPÍTULO 5', 'El debate del salón'],
      subs: [
        [null, 'Salón multiusos. Hoy: debate. Mañana: zumba. A ojo, la diferencia es pequeña.'],
        ['moderator', 'Buenas noches. Varios atriles, un cronómetro y una jarra de agua que nadie va a abrir. Primer bloque: vivienda.'],
        ['tech', 'Vengo con sentido común. Y con paciencia. Sobre todo con paciencia: llevamos años esperando a que nos toque.'],
        ['populist', 'Frente a la ola reaccionaria, avanzamos. En la dirección que toque esta noche.'],
      ],
    },
    victory: {
      banner: ['NOCHE ELECTORAL', '¡Victoria!'],
      verdict: '¡SUPERA EL 48!',
      subs: [
        ['Periodista', 'Con el cien por cien escrutado, todos los partidos dicen que han ganado. Por una vez, uno tiene razón.'],
        ['Tú', '¿Hemos… ganado? ¿Sin argumentario?'],
        ['Ana', '¡Discurso! ¡Pero cortito, que Marisa abre a las cinco!'],
      ],
    },
    defeat: {
      verdict: 'NO LLEGA AL 48',
      subs: [
        ['Periodista', '…y la candidatura del barrio se queda fuera. Todos los demás, eso sí, aseguran haber ganado.'],
        ['Tú', 'Dani dice que es «un resultado que nos permite seguir construyendo».'],
        ['Berto', 'Marisa ya lo ha traducido: «habéis perdido, cariño». Oye, la próxima te voto. Si me lo recuerdas.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: 'CAPÍTULO 2 · LA SEDE ES MI SALÓN', title: 'Comité de dirección: tres personas y un sofá.',
      intro: state => `Argumentario de las 7:00: «Priorizar ejes estratégicos». Respuesta de Marisa en el grupo: «Elegid una cosa». Hay tiempo para una prioridad de verdad; el resto, al grupo, donde mueren las ideas.${state.memories.nicoAssembly ? ' Nico ya ha pegado en el portal un aviso de asamblea.' : ''}`,
      choices: {
        accounts: { title: 'Lola revisa cada coste', flavor: 'Presupuesto a la vista, hasta el tíquet del celo. Ni una línea de «otros gastos». Menos tiempo para redes' },
        street: { title: 'Nico organiza puerta a puerta', flavor: 'Rellano por rellano, con la excusa de la derrama del ascensor. Sin tablet ni encuesta: con timbre' },
        content: { title: 'Dani monta un pequeño gabinete', flavor: 'Aro de luz, croma de sábana verde y una pared con la palabra RELATO en pósits' },
        tenants: { title: 'Asamblea de vecinos en el portal', flavor: 'Baja gente que no se hablaba desde lo de las humedades. Ernesto, el del piso cerrado, también. Nadie recoge las sillas' },
      },
    },
    video: {
      eyebrow: 'CAPÍTULO 4 · HAZLO VIRAL', title: 'La marca está puesta. Falta el mensaje.',
      intro: state => { const m = state.memories; return `Argumentario de las 7:00: «Tono cercano, mensaje claro». Marisa: «Habla como hablas». Dani calcula tres segundos antes de que deslicen el dedo. El alcance abre puertas; la gente distingue atención de apoyo.${m.daniNoFilter ? ' Hoy, sin filtro.' : m.daniTrend ? ' Dani ya ha elegido la canción. No preguntes.' : ''}`; },
      choices: {
        explain: { title: 'Explicar la propuesta y lo que cuesta', flavor: 'Un minuto, plano fijo y una pizarra de Lola con la letra pequeña en grande' },
        chairs: { title: 'El baile de las sillas de Paco', flavor: 'Coreografía con sillas prestadas. Nadie sabe qué propones; todo el mundo sabe que te caes en el segundo once' },
        neighbor: { title: 'Dejar hablar a Marisa', flavor: 'Ella habla del calor, del local que le han subido y de la cita de su madre. Tú sujetas el móvil y te callas' },
        debunk: { title: 'Desmontar el bulo del día', flavor: 'Un canal de Se Acabó La Siesta dice que quieres prohibir las terrazas. Lo desmientes con el plano entero, que es el arma secreta' },
      },
    },
    crisis: {
      eyebrow: 'CAPÍTULO 5 · CRISIS',
      title: (state, ctx) => ctx.contradiction ? 'Tu «todo para todos» ha llegado antes que la prensa.' : 'Un vídeo recortado ha llegado antes que la verdad.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Alguien ha subido el momento en que lo prometías todo a la vez. Música de tráiler, título en mayúsculas y un rótulo: «MARISA LO TRADUCE». Ella no ha sido. Pero lo suscribe.'
        : 'Circula un clip de nueve segundos cortado justo antes de que explicaras el coste. Sobrevivo lo comparte con «Esto es lo que hay detrás». Paciente, con «Sin comentarios». Que es un comentario.'}${state.memories.nicoPromise ? ' Y la Reme ha llamado: sigue sin cita.' : ''} Previsión actual: <b>${ctx.forecast.score}/100</b>. Se necesitan ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Dar la cara: reconocer el error y corregirlo', flavor: 'Vídeo sin música y sin «se ha sacado de contexto». Con preguntas, que ya es casi escándalo' },
        team: { title: 'Publicar costes y responsables', flavor: 'Lola sube las cuentas; Nico, quién hace qué. Aburrido, comprobable y difícil de recortar' },
        distract: { title: 'Sortear una freidora de aire', flavor: 'Para participar: seguir la cuenta, mencionar a tres amigos y olvidar el tema. En los manuales, «marcar agenda propia»' },
        blame: { title: 'Culpar a la máquina del fango', flavor: 'Bots, algoritmo y «las cloacas». Funciona con los tuyos. Los demás reconocen el truco: lo usan todos los partidos' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTULO 5 · EL DEBATE', title: 'Tres rivales, una moderadora y una jarra sin abrir.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `A un lado, ${populist.name}, de ${populist.party}, con dos argumentarios: el de la mañana y el de la tarde. Al otro, ${tech.name}, de ${tech.party}, que promete derogar cosas que no nombra. Al fondo, ${hard?.name || 'Covadonga del Muro'}, de Fox, que ha intentado entrar a caballo. ${moderator}: «¿A qué renuncia su programa?».`,
      choices: {
        tradeoff: { title: 'Defender la renuncia concreta', flavor: (state, { rivals }) => `Dices qué pierdes y a quién molestas. ${rivals.tech.name} pide «un dato». Se lo das. Lo apunta para derogarlo` },
        attack: { title: (state, { rivals }) => `Sacarle la hemeroteca a ${rivals.populist.name}`, flavor: 'Le lees lo que dijo hace dos campañas. Aplauso fácil, titular fácil, cero propuestas. Ella: «Rectificar es de sabios»' },
        manage: { title: 'Dar turnos y desmontar cifras con calma', flavor: (state, { rivals }) => `${rivals.tech.name} promete bajar impuestos «a partir del segundo año, si la herencia lo permite». Preguntas de qué año. Silencio. Agua` },
        promise: { title: 'Prometer topar el alquiler a la mitad «por decreto»', flavor: (state, { rivals }) => `El público aplaude. ${rivals.populist.name} te mira con envidia profesional. ${rivals.moderator}: «Queda dicho»` },
      },
    },
    finalPrep: {
      eyebrow: 'CAPÍTULO 6 · ÚLTIMA VUELTA', title: 'Todavía queda margen.',
      intro: (state, ctx) => `Previsión: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'por encima' : 'por debajo'} del umbral). Quedan dos días. El sondeo oficial os da «en torno a cero»; acierta siempre a favor de quien lo encarga. Argumentario: «Movilizar el voto útil». Marisa: «Que vaya la gente». Solo hay tiempo para una cosa bien hecha.`,
      choices: {
        listen: { title: 'Visitar a quienes aún dudan', flavor: state => `La parada del bus, la cola del centro de salud y la señora del bolso, que ya conoce al que se lo robó: coinciden cada mes en el juzgado${state.memories.nicoAssembly || state.memories.nicoInvite ? '. La asamblea del portal te pide que vuelvas' : ''}. Escuchas más de lo que hablas` },
        receipts: { title: 'Publicar el presupuesto definitivo', flavor: 'Lola lo imprime en A3: «la transparencia también es tamaño de fuente». Sin anexos que salgan en agosto' },
        volunteers: { title: 'Ordenar voluntarios y colegios', flavor: state => `Nico reparte turnos, bocadillos y un mapa de colegios dibujado en una servilleta${state.memories.pacoLucia ? '. Lucía, la camarera de Paco, se apunta de interventora' : ''}. Sin autobuses de simpatizantes: con el de línea` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTULO 6 · EL ÚLTIMO MITIN', title: 'Una frase antes de la jornada de reflexión.',
      intro: 'Sillas plegables, un globo que se desinfla y una periodista del diario local con cara de tercer mitin hoy. En los otros cierres hay autobuses y banderas; aquí, el del butano. Consolida lo aprendido o vuelve a prometerlo todo.',
      choices: {
        account: {
          title: state => ({
            shade: '“Habrá sombra y habrá menos coches. Esto elegimos, esto cuesta y aquí responderemos.”',
            parking: '“El barrio podrá trabajar, aunque este verano siga sin árboles. Esto elegimos y aquí responderemos.”',
            festival: '“Habrá cultura y habrá ruido pactado. Esto elegimos, esto cuesta y aquí responderemos.”',
            housing: '“Habrá más pisos porque los construiremos, no porque los anunciemos. Tardará. Y aquí responderemos.”',
          }[state.proposal] || '“Esto elegimos, esto cuesta y aquí responderemos.”'),
          flavor: 'Lo dices sin papeles. Marisa abre la libreta y, por primera vez, no apunta nada',
        },
        viral: { title: '“¡Menos atasco y más gazpacho!”', flavor: 'Dani lo emite en directo. Se corea. Nadie sabe qué significa. A las doce ya lo han copiado tres partidos' },
        everything: { title: '“Mañana habrá de todo para todos, por decreto.”', flavor: (state, { rivals }) => `Aplauso enorme. Lola se tapa la cara con el presupuesto. ${rivals.populist.name} te escribe: «¿Hablamos?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'NOCHE ELECTORAL · VICTORIA', title: 'Hay más sillas que personas.',
      text: state => `Marisa aplaude una vez. Lola pregunta quién ha guardado las facturas. Paciente y Sobrevivo ya han llamado dos veces: «¿Qué ofrecéis?». A las 7:00 llega el último argumentario de Dani: «Hemos ganado». Marisa contesta: «Esto lo entiendo». ${{
        shade: 'Mañana empieza lo difícil: explicarle a la furgoneta del sobrino dónde aparca.',
        parking: 'Mañana empieza lo difícil: el primer agosto sin árboles con tu nombre en la placa.',
        festival: 'Mañana empieza lo difícil: la primera reunión con los del primero, que ya han traído tapones para ti.',
        housing: 'Mañana empieza lo difícil: la primera licencia. Ernesto pregunta si puede alquilar el tercero antes de que acabe la legislatura.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NOCHE ELECTORAL · DERROTA', title: 'Un resultado que nos permite seguir construyendo.',
      reasons: {
        support: 'Faltó apoyo directo: el barrio te vio más en el móvil que en el rellano.',
        credibility: 'Las contradicciones pesaron: en la cola del pan no hay hemeroteca, pero hay memoria.',
        organization: 'El equipo llegó desordenado: un colegio sin interventor y otro con tres.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: 'MINIJUEGO · HAZLO VIRAL', title: 'Grabando en la marca.', goWord: '¡Acción!',
      lanes: ['Saludo', '¡Arriba!', 'Palmas', 'No consta'],
      takes: {
        explain: 'Pizarra de Lola, plano fijo y cada gesto subraya un coste.',
        chairs: 'El baile de las sillas. Paco mira con los brazos cruzados.',
        neighbor: 'Marisa habla del calor; tú, detrás, marcas el ritmo sin que se note. Se nota.',
        debunk: 'Desmontas el bulo con gestos claros: esto no, esto sí, esto cuesta.',
      },
      intro: (state, ctx) => `Móvil en el trípode, vecinos mirando y Dani contando. ${ctx.take} Haz cada pose cuando su icono llegue al círculo. El ritmo suma alcance, no votos.`,
      titles: { great: '¡Viral! Sumandos ya te ha ofrecido ser un pétalo.', ok: 'Se comparte en tres grupos de WhatsApp. Uno es el de tu madre.', bad: 'Cuarenta visualizaciones. Dani lo llama «impacto cualitativo».' },
      texts: { ok: 'Dani ya pone subtítulos en amarillo. La toma vale: el alcance abre puertas, pero los votos se ganan en el portal.', bad: 'Te has perdido entre el saludo y las palmas. Repite la toma: de momento, «no consta».' },
    },
    duel: {
      eyebrow: 'MINIJUEGO · DUELO DE RÉPLICAS', title: 'Cuatro preguntas, un cronómetro.',
      intro: (state, ctx) => `${ctx.rounds} réplicas. Elige la respuesta que defiende algo concreto y asume su coste antes de que se acabe el tiempo. A mitad, alguien te interrumpirá: pide la palabra.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'A quien aparca en doble fila y a dos mesas de la terraza de Paco. Sombra a cambio de coches, dicho claro.',
          parking: 'Al banco al sol: este verano seguirá sin árboles. Elegimos que el barrio pueda trabajar.',
          festival: 'A los del primero, dos noches por semana. Con horario pactado y tapones de regalo, literalmente.',
          housing: 'A la plaza, que sigue sin sombra, y a nuestra paciencia: construir tarda más que una legislatura. Y nos llamarán «los de los caseros».',
        }[state.proposal];
        return [
          { topic: 'Vivienda', role: 'populist', claim: 'Gracias a nuestra ley, en las zonas tensionadas el alquiler se ha estabilizado. Los pisos que faltan los esconde la especulación.',
            options: ['Si está «estabilizado», ¿por qué el tercero lleva un año cerrado? Topar no hace pisos. Construir sí, aunque tarde más que un titular.', '¡Pues nosotros lo topamos a la mitad! ¡Y el pan!', 'Usted lleva una chapa de colores. Lo sabe todo el barrio.'], correct: 0 },
          { topic: 'Datos', role: 'tech', claim: 'Según un informe que no he traído, su propuesta hundirá el barrio. Lo dice esta gráfica. La de la flecha roja.',
            options: ['Y según el mío, su gráfico es un bulo. Empate técnico.', 'Bueno, los datos son relativos. Como las encuestas.', 'Enseñe la fuente. La nuestra: el presupuesto de Lola, página dos, con foto del banco a las cinco de la tarde.'], correct: 2 },
          { topic: 'Su propuesta', role: 'moderator', claim: 'Pregunta directa: ¿a quién perjudica su propuesta? Minuto de oro. Bueno, diez segundos de bronce.',
            options: ['A nadie. Es una propuesta transversal, sin perdedores, como un anuncio de colonia.', cost || 'A alguien seguro. Lo diremos con nombre y apellidos cuando lo sepamos.', 'A los de siempre, que ya saben quiénes son.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'La promesa', role: 'populist', claim: '¡Usted le prometió a una panadera sombra, aparcamiento y un piso para su sobrino! Eso es populismo. Y lo digo con conocimiento de causa.',
                options: ['Es verdad. Me equivoqué al prometerlo todo; luego elegimos una cosa y explicamos lo que cuesta.', 'Se ha sacado de contexto. El contexto era yo prometiéndolo todo.', 'Usted también lo promete todo. Empate.'], correct: 0 }
            : { topic: 'Sanidad', role: 'tech', claim: '¿Y la sanidad? ¿O solo le importa su plaza? Nosotros gestionaremos. Mucho. Con gestión.',
                options: ['Prometo que mañana no hay listas de espera. Palabra.', 'Nos importa. Por eso no prometemos lo que no gestionamos: llevaremos la cita de la Reme al pleno, con nombre y fecha.', 'Lo derogaremos todo, como usted. Ya veremos qué.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: '¡Perdone! Eso es de la máquina del fango. Lo digo sin haberlo oído entero.',
        tech: 'Si me permite… como decía esta mañana un periódico… se lo leo entero…',
        moderator: 'Le quedan diez segundos. Nueve. Queda dicho.',
        fallback: '¡Perdone, perdone!',
      },
      floor: 'Déjeme terminar, que esto no es una rueda de prensa.',
      floorBabble: 'Déjeme terminar',
      reactions: {
        timeout: 'Se acabó el tiempo. Queda dicho. Siguiente bloque.',
        quick: 'Respuesta concreta y en tiempo. Inusual. Tomo nota.',
        slow: 'Concreta, aunque justita de tiempo.',
        wrong: 'Gracias por darme la razón. Lo pondré en el argumentario.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} asiente. Y no dice «queda dicho».`, mid: 'Has aguantado el tipo. Sin chuleta.', low: 'Mañana los rivales dirán que han ganado. Hoy, con motivo.' },
      text: 'La estrategia que elegiste marca el debate; las réplicas deciden si se te cree.',
    },
    chairs: {
      eyebrow: 'MINIJUEGO · SEIS SILLAS', title: 'Préstamo, no subvención.',
      intro: (state, ctx) => `Para la última asamblea hacen falta las seis sillas de Paco, repartidas por el barrio. Pasa por encima de una para cogerla y llévala al corro. Una a una: «la espalda también vota», dice Nico. Tienes ${ctx.time} segundos.`,
      hints: {
        start: 'Pasa por encima de una silla para cogerla.',
        carry: 'Ahora, al corro amarillo.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. A por la siguiente.`,
        full: '¡Corro completo!',
      },
      titles: { all: 'Seis sillas en el corro. Paco, conforme.', mid: 'Medio corro. El resto, de pie y opinando.', low: 'Paco recoge las sillas él mismo. Y lo comenta.' },
      texts: { all: 'Nico apunta el tiempo en la servilleta. Organizar es esto: que haya sitio cuando llega la gente.', other: 'Las que faltan siguen por la plaza. Repite: nadie ha visto nada, salvo Paco.' },
    },
    rally: {
      eyebrow: 'MINIJUEGO · EL ÚLTIMO MITIN', title: 'Que no se te vaya la sala.', goWord: '¡Habla!', lane: 'Remata la frase',
      intro: 'Cada frase tiene un remate. Pulsa cuando la palabra llegue al círculo: el público aplaude y la atención sube. Si fallas, alguien mira el móvil. O peor: abuchea.',
      phrases: state => {
        const own = {
          shade: ['Este verano, la plaza tendrá', 'SOMBRA'], parking: ['Quien trabaja en este barrio podrá', 'DESCARGAR'],
          festival: ['Los chavales tendrán local y la plaza,', 'CULTURA'], housing: ['Los pisos no se anuncian: se', 'CONSTRUYEN'],
        }[state.proposal] || ['Una cosa bien hecha, para', 'EMPEZAR'];
        return [
          ['Buenas noches. Gracias por venir sin autobús y con', 'SILLA'],
          ['No vengo con argumentario: vengo con', 'UNA COSA'],
          own,
          ['Y sí: tiene un coste. Lo hemos puesto por', 'ESCRITO'],
          ['Sin observatorio, sin comisión y sin', 'LOGO'],
          ['Nadie aquí os ha dicho que esto se pague', 'SOLO'],
          ['Si no cumplimos, ya sabéis dónde está la', 'PANADERÍA'],
          ['Esta noche Marisa no tiene nada que', 'TRADUCIR'],
          ['El domingo no os pido fe: os pido que', 'VOTÉIS'],
          ['A quien queráis. Pero que no decida el', 'SOFÁ'],
          ['Gracias, barrio. Y ahora, las sillas, a', 'PACO'],
          ['¡Pues me', 'PRESENTO!'],
        ];
      },
      titles: { great: 'La sala en pie. Los que tienen silla, también.', ok: 'Aplausos sinceros y algún bostezo.', bad: 'Se ha oído un móvil. Era el argumentario.' },
      text: 'El público recordará cómo lo dijiste; la decisión que has tomado decide qué recuerda.',
    },
  },
};
