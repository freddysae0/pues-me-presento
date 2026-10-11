// =====================================================================================================
// GUION ACTUAL: todo el texto narrativo/hablado del juego, tal y como está hoy.
// b.js (rama B, la que usa el juego) sobrescribe cualquier clave de este archivo; lo que no defina cae aquí.
// =====================================================================================================
//
// CÓMO SE FUSIONA (src/data/script/index.js → deepMerge)
//   · Objetos: se fusionan clave a clave (puedes cambiar solo `missions.video.title`).
//   · Arrays y funciones: la rama REEMPLAZA el valor entero (si tocas `dialogues.neighbor`, escribe las 3 líneas).
//   · Claves nuevas que el juego no lee (p. ej. `extraLines`) se toleran y se ignoran.
//
// FUNCIONES DEL GUION
//   Donde el texto depende de la partida, el valor es una función `(state, ctx) => …`.
//   `state` es el estado de campaña (solo lectura): state.memories.{id}, state.proposal
//   ('shade'|'parking'|'festival'|'housing'), state.speech ({ coherent, picks:[opening,argument,close], reach }),
//   state.support/credibility/organization/reach, state.party.{name,slogan}.
//   `ctx` siempre trae `rivals` (los de este guion) y además lo que indica cada clave.
//   Cualquier texto de pantalla (title, intro, flavor…) puede ser una cadena o una función así.
//
// RESTRICCIONES (las pruebas y la lógica dependen de ellas; tests/script.test.js las comprueba)
//   · Diálogos: máx. 3 elecciones por línea (teclas 1–3). Cada elección = { text, memory, response }.
//     `memory` NO se puede inventar ni cambiar: los efectos van ligados a ella (src/data/dialogues.js).
//     Cada charla debe usar exactamente las mismas memories que aquí (puedes reordenar líneas o elecciones,
//     salvo en `neighbor`).
//   · dialogues.neighbor: exactamente 3 líneas; elecciones SOLO en la segunda y en este orden de memory:
//     listened, promisedBoth, spectacle (las pruebas pulsan 1 → listened y 2 → promisedBoth).
//   · dialogues.aftermath(state): devuelve exactamente 3 líneas, sin elecciones (las pruebas pulsan 6 veces Espacio).
//   · Hablantes ('speaker'): Marisa, Paco, Lola, Dani, Nico, 'Tú' tienen color y voz propios; otros nombres valen,
//     pero sin personaje 3D que gesticule. En cinemáticas, 'moderator' | 'tech' | 'populist' | 'hard' se sustituyen
//     por los nombres de `rivals` (personajes del salón: Moderadora, Rival A, Rival B, Rival C).
//   · rivals: tech, populist y hard = { name, party }; moderator = cadena. 'hard' es Fox (tercer atril del debate;
//     color y tono de voz salen de src/data/parties.js, no del guion).
//   · missions.*.title debe seguir conteniendo (las pruebas lo buscan en el HUD):
//       hqBrief 'La sede es mi salón' · video 'Hazlo viral' · crisis 'Eso no fue' · debate 'debate' (minúscula)
//       finalPrep 'Última vuelta' · finalSpeech 'último mitin' · election 'noche de las sillas'.
//     Los ids de misión, su orden, escenas y objetivos 3D no son del guion (src/data/campaign.js).
//   · proposals: ids fijos shade/parking/festival/housing; números (coste real, efectos) fuera del guion.
//   · friends: nombres e ids fijos; exactamente 2 `choices` por amigo, en el mismo orden (cargo fijo:
//     Lola Tesorería/Estrategia, Dani Comunicación/Portavoz, Nico Organización/Actos).
//   · speech.parts: ids de opción fijos y en este orden (las pruebas eligen por índice); `argument` debe tener
//     shade, parking, festival, housing, everything.
//   · cinematics.*.subs: mismo número de subtítulos que aquí (van sincronizados con cámara y gestos).
//     Cada sub = [hablante|null, texto]; null = narrador.
//   · flow.*.choices: ids fijos (las pruebas pulsan siempre la primera). Efectos fuera del guion.
//     `intro` se inserta como HTML: no uses < ni > salvo <b>…</b>.
//   · minigames.duel.rounds(state): exactamente 4 rondas, cada una con 3 options y `correct` (0–2) apuntando a
//     la respuesta concreta que asume un coste. role: 'tech' | 'populist' | 'moderator'.
//     El título puede decir «Cuatro/Cinco preguntas…»: el juego ajusta esa palabra al número real de rondas.
//   · foxDebate (opcional; si falta, el debate queda con dos rivales hablando y sin ronda de Fox):
//       hallLine      cadena: subtítulo de Fox al final de la cinemática del salón (plano propio de 4,4 s).
//       interruption  cadena o (state) => …: lo que dice Fox al interrumpir en su ronda.
//       round         { topic, role: 'hard', claim, options: [3], correct } (u función de state): 5.ª y última ronda.
//       reactions     { right, wrong, timeout } (también vale { win, lose, timeout }): las dice Fox en su ronda.
//   · minigames.rally.phrases(state): exactamente 12 pares [frase, REMATE]; el remate corto y en mayúsculas.
//   · minigames.viral.lanes: 4 etiquetas (saludo, arriba, palmas, encogerse) — los gestos son fijos.
//   · Nada de avisos de «esto es ficción»: el aviso va una sola vez en los créditos.
//
// CLAVES DE PRIMER NIVEL
//   rivals      nombres de rivales y moderadora (debate, duelo, cinemática del salón)
//   foxDebate   tercer rival (Fox): frase del salón, interrupción, ronda extra del duelo y reacciones
//   menu        cinta y frase del menú principal
//   chapters    títulos de los 6 capítulos (array)
//   missions    { id: { title, objective } } — diario de pausa y HUD
//   travel      { id: { title, objective, prompt, loading, sign } } — caminar a la salida antes de la misión id
//   proposals   { id: { title, cost, benefit, compromise } } — tablón de la plaza
//   friends     { id: { role, line, choices: [{ label, reply }×2] } } — videollamada
//   call        textos de la videollamada
//   register    formulario de fundación del partido
//   program     tablón de propuestas
//   speech      primer discurso (atril de la plaza)
//   dialogues   neighbor, aftermath, paco, marisa, lola, dani, nico
//   cinematics  intro, plaza, hq, hall, victory, defeat
//   flow        pantallas de decisión: hq, video, crisis, debate, finalPrep, finalSpeech
//   endings     victoria y derrota
//   minigames   viral, duel, chairs, rally
// =====================================================================================================

export const meta = { label: 'Guion actual', pitch: 'El texto que hay hoy en el juego.' };

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: 'Borja Valcárcel', party: 'Sentido Común Plus' },
    populist: { name: 'Encarna Robles', party: 'Movimiento ¡Ya Está Bien!' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Pilar Ortega',
  },

  // Tercer atril del debate (Rival C). Ver la cabecera: foxDebate.
  foxDebate: {
    hallLine: 'He venido a caballo. Lo he dejado en doble fila, como todo lo importante.',
    interruption: '¡Sorry! Eso es ideología. Y se lo digo sin complejos.',
    round: {
      topic: 'Seguridad', role: 'hard',
      claim: 'En su plaza roban móviles en las terrazas y usted propone bancos a la sombra. ¿Qué hará con los que reinciden?',
      options: [
        'Un banco a la sombra no roba móviles. Siguiente pregunta.',
        'Pedir en el pleno juicios rápidos y más medios para el juzgado del distrito. Cuesta dinero y lo pondremos en el presupuesto.',
        '¡Mano dura y un caballo por terraza!',
      ],
      correct: 1,
    },
    reactions: {
      right: 'Juicios rápidos. Eso lo iba a decir yo, pero más alto.',
      wrong: 'Ahí lo tienen: el barrio, desprotegido. Gracias por el corte.',
      timeout: 'Mientras usted piensa, a otro le han quitado el móvil.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'UNA CAMPAÑA BASTANTE CORRIENTE',
    tagline: 'Cambiar el país empieza por bajar a la plaza. Y por encontrar seis sillas.',
  },

  chapters: ['Pues me presento', 'La sede es mi salón', 'Bajar a la calle', 'Hazlo viral', 'Eso no fue lo que prometiste', 'El último mitin'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'Un vídeo más y lo dejo', objective: 'Acércate al móvil, junto al sofá. Pulsa E.' },
    call: { title: 'El grupo que nunca se silencia', objective: 'Usa el portátil de la mesa para llamar a tus amigos.' },
    register: { title: 'Tenemos nombre. Casi.', objective: 'Ve a la carpeta del escritorio y registra el partido.' },
    leave: { title: 'Hay vida fuera del grupo', objective: 'Sal por la puerta verde para bajar a la plaza.' },
    neighbor: { title: 'Primero, escuchar', objective: 'Habla con Marisa, junto al toldo de la panadería. Paco, en la terraza del bar, también tiene cosas que contar.' },
    program: { title: 'No cabe todo en un cartel', objective: 'Elige tu primera propuesta en el tablón de la plaza.' },
    speech: { title: 'El primer cajón', objective: 'Sube al punto del atril y da tu primer discurso.' },
    aftermath: { title: 'El barrio toma nota', objective: 'Vuelve con Marisa para saber qué se comenta en la cola del pan.' },
    hqBrief: { title: 'La sede es mi salón', objective: 'Reúne al equipo en la mesa de campaña. Lola, Dani y Nico también quieren hablar contigo.' },
    video: { title: 'Hazlo viral', objective: 'Graba un vídeo en la marca junto a la panadería.' },
    crisis: { title: 'Eso no fue lo que prometiste', objective: 'Afronta la crisis en el tablón. Antes, quizá convenga oír al equipo.' },
    debate: { title: 'El debate del salón', objective: 'Entra en el debate con los rivales.' },
    finalPrep: { title: 'Última vuelta al barrio', objective: 'Elige en el mapa dónde concentrar el último esfuerzo.' },
    finalSpeech: { title: 'El último mitin', objective: 'Cierra la campaña ante el público.' },
    election: { title: 'La noche de las sillas', objective: 'Consulta el resultado electoral.' },
    complete: { title: 'Campaña completada', objective: 'La campaña ha terminado.' },
  },

  // Trayectos a pie entre escenarios: al acabar una misión cuyo siguiente paso está en otro mapa, el jugador se queda
  // donde está y camina hasta la salida señalizada. Clave = misión que espera al otro lado de la puerta.
  // title/objective: HUD y pausa · prompt: etiqueta junto a la salida (tecla E) · loading: cartel de transición ·
  // sign: cartel corto del poste (mayúsculas). No usar aquí las cadenas que buscan las pruebas en los títulos de misión.
  travel: {
    hqBrief: { title: 'Una sede con timbre', objective: 'La sede está en el bajo del portal de al lado del bar de Paco. Ve a la puerta y pulsa E.', prompt: 'Portal · Entrar en la sede', loading: 'ENTRANDO EN LA SEDE…', sign: 'SEDE' },
    video: { title: 'Aquí dentro no hay luz', objective: 'Para grabar hace falta luz y vecinos. Sal por la puerta de la sede y baja a la plaza.', prompt: 'Puerta · Bajar a la plaza', loading: 'BAJANDO A LA PLAZA…', sign: 'PLAZA' },
    crisis: { title: 'Han llamado de la sede', objective: 'Algo arde en el grupo. Vuelve a la sede por el portal junto al bar.', prompt: 'Portal · Volver a la sede', loading: 'SUBIENDO A LA SEDE A TODA PRISA…', sign: 'SEDE' },
    debate: { title: 'Rumbo al salón multiusos', objective: 'Sal por la puerta de la sede: en el salón multiusos ya están montando los atriles.', prompt: 'Puerta · Ir al salón multiusos', loading: 'CAMINO DEL SALÓN MULTIUSOS…', sign: 'SALÓN' },
    finalPrep: { title: 'De vuelta al barrio', objective: 'Sal del salón por la puerta doble. Queda una semana y se gana en la calle.', prompt: 'Puerta · Volver a la plaza', loading: 'VOLVIENDO AL BARRIO…', sign: 'PLAZA' },
    finalSpeech: { title: 'Coger el 27', objective: 'Ve a la parada de autobús, junto al quiosco: el 27 te deja en la puerta del salón multiusos.', prompt: 'Parada · Coger el 27 al salón', loading: 'EL 27 LLEGA. TARDE, PERO LLEGA…', sign: 'BUS 27' },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: 'Refugio climático en la plaza', cost: '2 de presupuesto', benefit: 'Árboles, toldos, una fuente que funcione y el bajo vacío de la esquina como sala fresca para mayores durante las olas de calor.', compromise: 'Se pierden plazas de aparcamiento, la terraza de Paco encoge dos mesas y la furgoneta del sobrino de Marisa sigue en doble fila.' },
    parking: { title: 'Que el barrio pueda trabajar', cost: '2 de presupuesto', benefit: 'Zona de carga y descarga con horario, plazas rotatorias para el comercio y aparcabicis para repartidores.', compromise: 'Más coches en la plaza y otro verano a pleno sol. El banco seguirá hirviendo en agosto.' },
    festival: { title: 'Cultura después de las ocho', cost: '2 de presupuesto', benefit: 'Escenario para grupos del barrio, cine de verano y un local de ensayo para que los chavales tengan algo más que el portal.', compromise: 'Ruido dos noches por semana. Los del primero, con tapones. La sombra y la carga y descarga, al cajón.' },
    housing: { title: 'El tercero vuelve a ser un hogar', cost: '2 de presupuesto', benefit: 'Censo de pisos turísticos sin licencia, inspección de verdad y una bolsa de alquiler con aval para jóvenes y mayores del barrio.', compromise: 'Tarda más de una legislatura, te ganas a todos los caseros de enemigos y la plaza sigue sin sombra.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'Las cuentas claras', line: 'Trabajo en una gestoría y comparto piso a los treinta y seis con dos opositores y un ficus. Te llevo las cuentas. Pero si alguien dice «esto se paga solo», cuelgo.', choices: [
      { label: 'Tesorería. Y derecho a quitarme la calculadora.', reply: 'Acepto. Primera medida: dejar de llamar «inversión en tejido social» al pedido de croquetas.' },
      { label: 'Estrategia. El Excel también puede tener sueños.', reply: 'Vale. Pero los sueños van en una pestaña aparte, con fórmula y con fecha de caducidad.' },
    ] },
    dani: { role: 'El algoritmo es su primo', line: 'Hago vídeos para una clínica dental, un gimnasio y un señor que vende colchones. Esto lo haría gratis. Condición: nadie dice «los jóvenes de hoy» mirando a cámara.', choices: [
      { label: 'Comunicación. Sin comprar seguidores.', reply: 'Perfecto. Los primeros seguidores serán mi madre y sus tres cuentas. Una es del perro.' },
      { label: 'Portavoz. Tendrás que hablar sin filtros.', reply: '¿Sin el filtro de piel de anuncio de yogur? Eso sí que es transparencia radical.' },
    ] },
    nico: { role: 'Conoce a todo el portal', line: 'Hago turnos rotativos en un almacén y me sé el nombre de todos los perros del barrio. Yo movilizo. Pero las reuniones acaban antes de que cierre la ferretería.', choices: [
      { label: 'Organización. Tú pones los horarios.', reply: 'Hecho. Y que conste en acta: las sillas plegables no se pliegan solas, y el celo tampoco pega solo.' },
      { label: 'Actos. Necesitamos tu voz de megáfono.', reply: 'Una vez grité «¿de quién es el Seat?» y bajaron cuatro plantas. Dos no tenían Seat. Hay potencial.' },
    ] },
  },

  call: {
    title: 'Vale, pero… ¿vamos en serio?',
    you: 'Ha tenido una idea', // subtítulo de tu recuadro
    next: 'Vale. Siguiente valiente', // botón tras cada respuesta
    done: 'Ya tenemos equipo. Ahora falta el pequeño detalle de todo lo demás. Y Lola dice que la próxima videollamada, con orden del día.', // lo dice Nico al final
    doneBabble: 'Ya tenemos equipo.', // texto que se «balbucea» (solo audio); si falta, se usa `done`
    finish: 'Nos vemos en la plaza',
  },

  register: {
    eyebrow: 'FUNDACIÓN · VENTANILLA ÚNICA',
    title: 'Un nombre para la papeleta.',
    stamp: 'SELLO PENDIENTE',
    intro: 'El formulario tiene tres campos y ninguno pide certificado digital. La democracia del juego acaba de ganar en usabilidad.',
    defaultName: 'La Gente del Banco',
    defaultSlogan: 'Una cosa bien hecha, para empezar.',
    submit: 'Registrar candidatura',
    toast: 'REGISTRADO. «La grapadora os la lleváis; los principios, también».',
  },

  program: {
    eyebrow: 'PROGRAMA · PRESUPUESTO: 2 CRÉDITOS',
    title: 'Elegir también es renunciar.',
    intro: 'Solo cabe una propuesta. Cada una deja a alguien del barrio esperando. El barrio recordará lo que defiendas y a quién dejaste para luego.',
    promisedBothNote: 'Marisa recuerda que prometiste sombra, aparcamiento y piso para su sobrino. Ninguna opción paga todo eso: −6 de credibilidad al concretar.',
    // ctx: { proposal: { id, title } }
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Ahora toca explicarlo en el atril.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ['Bueno. Pues aquí estamos.', '¿Qué vas a defender?', 'La última frase cuenta.'], // uno por parte
    parts: {
      opening: { title: '01 / Romper el hielo', prompt: 'Hay siete personas. Dos esperan el autobús, una ha bajado a por el pan y otra te está grabando por si te caes.', options: {
        listen: 'Antes de hablar, he venido a escuchar. Y a sudar, por lo que veo.',
        joke: 'Tranquilos: este discurso dura menos que una cita en el médico de cabecera. Bueno, que la espera.',
        grand: '¡Hoy comienza una nueva era para la humanidad, y para este barrio en particular!',
      } },
      argument: { title: '02 / Decir algo concreto', prompt: 'Ahora toca defender lo que has clavado en el tablón. Marisa ya ha sacado la libreta.', options: {
        shade: 'Sombra y un sitio fresco para nuestros mayores, aunque perdamos aparcamiento.',
        parking: 'Que quien trabaja pueda descargar, aunque la plaza siga sin árboles.',
        festival: 'Cultura y un local para los chavales, con un acuerdo de horarios y ruido.',
        housing: 'Que los pisos vuelvan a ser casas. Tardará, costará y algún casero se enfadará.',
        everything: '¡Árboles, aparcamiento, festivales y un piso para cada uno, gratis y para el lunes!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'Marisa mira el reloj. Es un reloj especialmente expresivo.', options: {
        accountable: 'Si no lo cumplimos, nos lo preguntáis aquí mismo. Ya sabéis dónde está la panadería.',
        chant: '¡Menos atasco y más gazpacho!',
        forever: 'Para concluir, y brevemente, mis siguientes veintisiete puntos…',
      } },
    },
    timing: { eyebrow: '04 / DARLE EL GOLPE FINAL', title: 'Ahora. Con convicción.', button: '¡Y por eso me presento!' },
    result: {
      eyebrow: 'EL BARRIO HA ESCUCHADO',
      goodTitle: 'Un aplauso. Luego otro.',
      badTitle: 'Hasta las palomas tienen dudas.',
      coherent: 'Has defendido tu propuesta y reconocido su coste. La gente sabe qué estás ofreciendo.',
      incoherent: 'Tu discurso no coincide con el programa. Se habla de ti, pero las promesas empiezan a chirriar.',
      fine: 'El alcance mide atención, no votos. Las consecuencias principales dependen de lo que has dicho.',
      button: 'Bajar del atril',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    // Exactamente 3 líneas; elecciones en la segunda: listened, promisedBoth, spectacle (en este orden).
    neighbor: [
      { speaker: 'Marisa', text: '¿Tú eres el del partido nuevo? Si vienes a besar un bebé, aquí lo más joven es la masa madre. Siéntate en ese banco, anda. A las cinco de la tarde. En agosto. Ya verás qué programa te sale.' },
      { speaker: 'Marisa', text: 'Mi sobrino reparte con la furgoneta y no tiene dónde parar. Tiene treinta y cuatro años y sigue en su cuarto de pequeño. Y en el tercero ya no vive nadie: viven maletas con ruedas. ¿Por dónde empiezas?', choices: [
        { text: 'Por escucharte. ¿Qué te quita el sueño a ti?', memory: 'listened', response: '¿A mí? Que a mi madre le han dado especialista para dentro de unos meses y yo necesito sombra para esperar viva. Y sentarme en la plaza sin tener que pedir un café. No parece el programa espacial, ¿eh?' },
        { text: 'Por todo a la vez: sombra, aparcamiento y un piso para tu sobrino.', memory: 'promisedBoth', response: 'Apuntado. Tengo una libreta para las promesas y otra para los fontaneros. Los fontaneros, por lo menos, vienen. A veces. Tarde. Pero vienen.' },
        { text: 'Por hacer ruido: un festival que nos ponga en el mapa.', memory: 'spectacle', response: '¿En el mapa? Cariño, ya estamos en todas las webs de alquiler vacacional: «auténtico barrio castizo». Lo único auténtico que queda es mi casero subiéndome el local.' },
      ] },
      { speaker: 'Marisa', text: 'Ahí tienes el tablón. El presupuesto da para una cosa. Una. Y luego lo cuentas en el atril, sin palabras que acaben en «-ización» ni en «-ibilidad», que aquí la gente madruga.' },
    ],

    // Reacción de Marisa tras el primer discurso. Exactamente 3 líneas sin elecciones.
    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Yo apunté sombra, aparcamiento y piso para mi sobrino. Mira: página doce, subrayado dos veces. La libreta no tiene botón de borrar.'
        : m.listened ? 'Antes me has escuchado. Parece una tontería, pero se nota cuando alguien viene con el discurso ya plastificado.'
        : m.spectacle ? 'Lo del festival lo ha oído todo el barrio. Bueno, el del tercero no, que está en Lisboa y alquila desde el móvil.'
        : 'Bueno. Ya has bajado del cajón. Las piernas te temblaban menos que al del año pasado, y eso que el del año pasado era el cartero.';
      const coherent = {
        shade: 'Has dicho que quitas aparcamiento para poner sombra. Mi sobrino te va a odiar dos semanas. Mi madre te va a votar dos veces. Bueno, una, que no se puede.',
        parking: 'Has elegido la furgoneta antes que los árboles. Mi sobrino te invita a una caña. Yo este agosto me traigo la sombrilla de la playa y te la planto delante de la sede.',
        festival: 'Cultura hasta las doce. Los chavales, contentos; los del primero, con tapones. Por lo menos lo del ruido lo has dicho sin esconderlo.',
        housing: 'Lo del tercero. Has dicho que tarda, que no es gratis y que te vas a ganar enemigos. Es la primera vez que oigo eso en un atril y no me ha dado la risa.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'No estoy de acuerdo con todo. Pero has dicho qué cuesta y a qué renuncias. Eso se agradece.')
        : speech.picks?.[1] === 'everything' ? 'Árboles, aparcamiento, festivales y pisos para el lunes. Hasta las palomas se han mirado. Eso no es un programa, cariño: es la carta a los Reyes Magos.'
        : 'El tablón decía una cosa y tú has dicho otra. Si esto era un ensayo, ensaya también lo de cumplir.';
      const closing = m.pacoLucia ? 'Por cierto, me ha dicho Paco que le has conseguido camarera. Ya tienes partido, equipo, un voto en la terraza y una señora vigilándote. Ahora sí que estás en política.'
        : (speech.reach || 0) >= 12 ? 'Dani dice que el vídeo del discurso lo han visto miles de personas. Aquí lo han visto doce. Y las doce votan. Tú verás a quién le hablas.'
        : 'Bueno. Ya tienes partido, equipo y una señora vigilándote. Ahora sí que estás en política.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    // Charlas laterales. `after`: aviso (cadena o función del estado) cuando la charla ya está hecha.
    // memories de Paco: pacoHeard, chairs, pacoRent, pacoWages, pacoBlame, pacoLucia.
    paco: {
      after: s => s.memories.chairs ? 'Paco: «Seis sillas apartadas. La séptima es la mía y no se toca».' : s.memories.pacoLucia ? 'Paco: «La chica es un fichaje. Ya sabe más de tortilla que yo».' : 'Paco: «Lo dicho. Cuánto cuesta y, si no lo sabes, que no lo sabes».',
      lines: [
        { speaker: 'Paco', text: 'Paco. Bar La Última. Nuestro lema es «una y nos vamos», la promesa más incumplida de la historia de este país. ¿Qué te pongo?', choices: [
          { text: '¿Qué le pedirías tú a un partido nuevo?', memory: 'pacoHeard', response: 'Que diga cuánto cuestan las cosas. Y si no lo sabe, que diga «no lo sé». Eso en la tele no lo he oído nunca. Sería tendencia, que dice mi sobrina.' },
          { text: '¿Nos prestas sillas para el acto?', memory: 'chairs', response: 'Seis. Si aparecen siete, habéis empezado demasiado pronto con los milagros contables.' },
          { text: '¿Cómo va el negocio?', memory: 'pacoRent', response: 'Lleno de turistas que piden paella a las seis de la tarde. Y el local me lo han subido. Facturo más que nunca y me queda menos que nunca. Explícame eso en un mitin.' },
        ] },
        { speaker: 'Paco', text: 'Y mira ese cartel: «Se busca camarero». Lleva colgado desde Semana Santa. Tiene ya más antigüedad en el bar que yo.', choices: [
          { text: '¿Has probado a pagar más?', memory: 'pacoWages', response: 'Lo he probado. Entonces el café sube y me ponen reseñas de una estrella que dicen «atraco». Si tienes la cuenta que cuadra las dos cosas, te hago socio.' },
          { text: 'Es que los jóvenes ya no quieren trabajar.', memory: 'pacoBlame', response: 'Eso decía yo. Luego vino mi sobrina, la del máster: doble turno, partido, y con lo que le pagaba no le llegaba ni para la habitación. Ahora está en Dublín. Trabajar quiere. Aquí, no.' },
          { text: 'Lucía, la estudiante de la fuente, busca algo para los findes.', memory: 'pacoLucia', response: '¿La de los apuntes subrayados en cuatro colores? Que venga. Horario por escrito, contrato de verdad y tortilla de la casa. Mira, ya has hecho más que muchos: has juntado a dos personas.' },
        ] },
        { speaker: 'Paco', text: 'Y ahora, si me disculpas, tengo una mesa pidiendo sangría a las once de la mañana. Ellos sí que tienen un programa claro.' },
      ],
    },

    // Comentario repetible de Marisa (sin elecciones) según la misión en curso.
    marisa: s => {
      const text = {
        program: 'El tablón está ahí, al lado del árbol. No muerde. Bueno, la chincheta de abajo sí.',
        speech: 'Sube ya al cajón, que se enfría el pan y se enfría la gente.',
        video: 'Si vas a grabar, ponte a la sombra. Sudando pareces un pollo de asador con propuestas.',
        finalPrep: 'Última vuelta, ¿eh? Pásate por la parada del autobús: la gente que espera tiene tiempo y tiene quejas. Lo que tú necesitas.',
      }[s.mission] || 'Yo aquí, con mi libreta. Tú a lo tuyo, que te estoy mirando.';
      return [{ speaker: 'Marisa', text }];
    },

    // `crisis`: charla durante la misión de crisis; `default`: el resto de la campaña.
    lola: {
      crisis: { after: 'Lola: «Estoy cuadrando. No me hables si no es en euros».', lines: [ // memories: lolaBooks, lolaWait
        { speaker: 'Lola', text: 'La crisis tiene una ventaja: por fin alguien mira mis hojas de cálculo. Con lupa. Y con mala leche.', choices: [
          { text: 'Publícalas. Todas.', memory: 'lolaBooks', response: 'Hasta el tíquet del celo. Si nos quieren pillar, que sea en un error de redondeo de siete céntimos.' },
          { text: 'Mejor esperamos a que pase.', memory: 'lolaWait', response: 'Las crisis no pasan, se archivan. Y alguien las desarchiva justo la semana antes de votar. Tú verás.' },
        ] },
      ] },
      default: { after: 'Lola: «Pestaña nueva: “Cosas que no vamos a pagar”. Ya tiene doce filas».', lines: [ // memories: lolaReceipts, lolaCousin, lolaRent
        { speaker: 'Lola', text: 'He abierto una hoja de cálculo. Se llama «Campaña_DEFINITIVA_v3_ahora_sí». Ingresos: el bote del grupo y cuarenta euros que nos debe Dani desde hace años.' },
        { speaker: 'Lola', text: 'Gastos: cuatro pizzas, una imprenta y una factura de «asesoría de imagen» firmada por el primo de Dani. ¿La pago?', choices: [
          { text: 'Ni de broma. Todo con factura y todo publicado.', memory: 'lolaReceipts', response: 'Gracias. Si un día salimos en las noticias, que sea por aburridos. Ahora mismo es lo más revolucionario que hay.' },
          { text: 'Págala, que el primo es majo y nos hace precio.', memory: 'lolaCousin', response: 'Majo es. Precio, no nos hace. Te la apunto en la pestaña «Cosas que dirán de nosotros en un hilo».' },
          { text: 'Oye, Lola… ¿y tú cómo llegas a fin de mes?', memory: 'lolaRent', response: 'Con dos opositores y un ficus. El ficus es el único que no paga y el que más luz gasta. Por eso estoy aquí, ¿vale? No por la calculadora.' },
        ] },
        { speaker: 'Lola', text: 'Venga, a la mesa. Yo vigilo el pedido: una barbacoa, una cuatro quesos y ninguna con piña, que somos un partido serio.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Llevo cuatro horas contestando. Mi tiempo de pantalla me ha escrito para preguntar si estoy bien».', lines: [ // memories: daniReply, daniMeme
        { speaker: 'Dani', text: 'Tenemos cuatrocientos comentarios. Doscientos son bots, cien son mi madre defendiéndote y cien son gente de verdad muy enfadada.', choices: [
          { text: 'Contesta a los de verdad, uno a uno.', memory: 'daniReply', response: 'Uno a uno. Va a ser la noche más larga de mi vida. Pásame café y no me mires el tiempo de pantalla.' },
          { text: 'Bloquea a todo el mundo y sube un meme.', memory: 'daniMeme', response: 'Hecho. Ahora el meme tiene más comentarios que el problema. Técnicamente es un éxito. Moralmente, no me preguntes.' },
        ] },
      ] },
      default: { after: 'Dani: «Estoy editando. Si me hablas, pierdo el ritmo del corte».', lines: [ // memories: daniNoFilter, daniTrend, daniJobs
        { speaker: 'Dani', text: 'He estudiado el algoritmo. Conclusión científica: funciona un perro, un drama o alguien llorando en un coche. No tenemos perro.' },
        { speaker: 'Dani', text: 'Propuesta: te grabo explicando el programa, pero con el filtro «piel de anuncio de yogur». ¿Sí o sí?', choices: [
          { text: 'Sin filtro. Que se vean las ojeras de campaña.', memory: 'daniNoFilter', response: 'Valiente. Las ojeras son lo último auténtico que queda en internet. Vas a tener pocos likes, pero de calidad.' },
          { text: 'Con filtro y con la canción que esté de moda.', memory: 'daniTrend', response: 'Así me gusta. Mañana nadie sabrá qué propones, pero todo el mundo sabrá que bailas fatal y con ritmo.' },
          { text: '¿Y tú qué tal, con tantos curros?', memory: 'daniJobs', response: 'Cuatro, si cuentas a mi madre preguntándome cuándo me hacen fijo. Esta campaña es lo único que hago gratis y lo único que me apetece hacer.' },
        ] },
        { speaker: 'Dani', text: 'Una cosa: si en algún momento dices «la juventud de hoy», me salgo del grupo. Del de WhatsApp. Que es peor que darse de baja del partido.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Estoy con las sillas. Son treinta. Se pliegan cuando quieren ellas».', lines: [ // memories: nicoInvite, nicoEnemy
        { speaker: 'Nico', text: 'Ha bajado el del tercero, el del piso turístico. Dice que si vamos contra él, nos denuncia. Luego me ha preguntado si le regamos las plantas en agosto.', choices: [
          { text: 'Invítale a la asamblea del portal. Que dé su versión.', memory: 'nicoInvite', response: 'Vale. Igual resulta que él también vive de alquiler en otro barrio. Esto está todo conectado, como los enchufes de la sede.' },
          { text: 'Ni caso. Es el enemigo.', memory: 'nicoEnemy', response: 'Enemigo, enemigo… Es Ernesto, del colegio. Le debo un balón desde sexto. Bueno, tú mandas.' },
        ] },
      ] },
      default: { after: 'Nico: «Voy a por más celo. El de ayer pega solo cuando no quieres».', lines: [ // memories: nicoTruth, nicoPromise, nicoAssembly
        { speaker: 'Nico', text: 'He pegado cuarenta carteles. Treinta y ocho rectos. Los otros dos están un poco en diagonal. Lo llamo «propuesta inclinada».' },
        { speaker: 'Nico', text: 'Por cierto, la Reme dice que vota a quien le consiga cita con el cardiólogo antes de Navidad. ¿Qué le digo?', choices: [
          { text: 'La verdad: que eso no se arregla en un mes, pero lo vamos a pelear.', memory: 'nicoTruth', response: 'Se lo digo. Te va a mirar como miran las señoras a quien dice la verdad: con pena y con respeto. Votarte, no sé. Saludarte, seguro.' },
          { text: 'Dile que sí. Cita en una semana.', memory: 'nicoPromise', response: 'Se lo digo. Y cuando llegue diciembre y siga esperando, te lo dice ella a ti. Con el bastón. La Reme tiene buen brazo.' },
          { text: 'Que venga a la asamblea del portal y nos lo cuente a todos.', memory: 'nicoAssembly', response: 'Buena idea. Los del bloque llevan años quejándose cada uno en su rellano. Si los juntamos, es casi un partido. Bueno, es una comunidad de vecinos, que es peor.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  // banner: [antetítulo, título]. subs: [hablante|null, texto], mismo número que aquí (van con cámara y gestos).
  cinematics: {
    intro: {
      banner: ['CAPÍTULO 1', 'Pues me presento'],
      tv: { headline: '¡ELECCIONES!', ticker: 'ÚLTIMA HORA · CONVOCATORIA' }, // pantalla de la tele del piso
      subs: [
        [null, 'Domingo, 23:47. «Un vídeo más y lo dejo».'],
        ['Presentadora (TV)', 'Última hora: el Gobierno disuelve las Cortes y convoca elecciones generales.'],
        ['Presentadora (TV)', 'Los partidos de siempre ya graban vídeos en mangas de camisa. Seguiremos informando. O no.'],
        [null, 'BZZZ. BZZZ. Cuarenta y tres mensajes del grupo y un vídeo que todo el mundo te reenvía.'],
        ['Tú', '¿Elecciones? ¿Otra vez? …A ver qué dice el móvil.'],
      ],
      toast: 'El móvil no para de vibrar. Está en la mesita, junto al sofá.',
    },
    plaza: {
      banner: ['EL BARRIO', 'Bajar a la calle'],
      subs: [
        [null, 'La plaza: panadería, bar, un banco al sol y siete opiniones por metro cuadrado.'],
        ['Marisa', '¡Anda! ¿Tú no eres el del tercero que no saluda? Ven, que te tengo que contar.'],
        ['Paco', 'Si vas a salvar el barrio, que sea después del café. El café no se salva solo.'],
      ],
    },
    hq: {
      banner: ['CAPÍTULO 2', 'La sede es mi salón'],
      subs: [
        [null, 'La sede: un salón, una mesa plegable y dos enchufes. Uno funciona.'],
        ['Lola', 'Pasa, que esto es la sede. El sofá es la sala de prensa y la nevera, la tesorería.'],
        ['Dani', 'He llamado al wifi «SedeOficial». Ya somos institucionales.'],
        ['Nico', 'Y las sillas son prestadas. Las seis. Que conste en acta.'],
      ],
    },
    hall: {
      banner: ['CAPÍTULO 5', 'El debate del salón'],
      subs: [
        [null, 'Salón multiusos. Hoy: democracia. Mañana: zumba.'],
        ['moderator', 'Buenas noches. Cuatro candidaturas, un cronómetro y una jarra de agua que nadie va a abrir.'],
        ['tech', 'Vengo a optimizar sinergias habitacionales. Con datos.'],
        ['populist', '¡Y yo a bajarlo todo desde el primer día! ¡Ya está bien!'],
      ],
    },
    victory: {
      banner: ['NOCHE ELECTORAL', '¡Victoria!'],
      verdict: '¡SUPERA EL 48!', // pantalla de resultados del salón
      subs: [
        ['Periodista', 'Con el cien por cien escrutado, el recuento dice…'],
        ['Tú', '¿Hemos… ganado? ¿Con seis sillas?'],
        ['Ana', '¡Discurso! ¡Pero cortito, que mañana se madruga!'],
      ],
    },
    defeat: {
      verdict: 'NO LLEGA AL 48',
      subs: [
        ['Periodista', '…y la candidatura del barrio se queda a las puertas. Por poco, pero puertas.'],
        ['Tú', 'Bueno. Las sillas eran prestadas igual.'],
        ['Berto', 'Oye, que la próxima te voto. Si me lo recuerdas.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  // Cada pantalla: { eyebrow, title, intro, choices: { id: { title, flavor } } }. `flavor` es la línea de detalle.
  flow: {
    hq: {
      eyebrow: 'CAPÍTULO 2 · LA SEDE ES MI SALÓN', title: 'Tres personas, una mesa y dos enchufes.',
      intro: state => `El sofá es la sala de prensa y la nevera, la tesorería. Hay tiempo para una prioridad de verdad; lo demás va al grupo de WhatsApp, que es donde van a morir las ideas.${state.memories.nicoAssembly ? ' Nico ya ha pegado en el portal un aviso de asamblea.' : ''}`,
      choices: {
        accounts: { title: 'Lola revisa cada coste', flavor: 'Presupuesto a la vista de cualquiera, hasta el tíquet del celo. Menos tiempo para redes' },
        street: { title: 'Nico organiza puerta a puerta', flavor: 'Rellano por rellano, con la excusa de preguntar por la derrama del ascensor' },
        content: { title: 'Dani monta un pequeño estudio', flavor: 'Aro de luz, croma de sábana verde y un micro de corbata que pita' },
        tenants: { title: 'Asamblea de inquilinos en el portal', flavor: 'Baja gente que no se hablaba desde lo de las humedades. Salen ideas, salen quejas y nadie recoge las sillas' },
      },
    },
    video: {
      eyebrow: 'CAPÍTULO 4 · HAZLO VIRAL', title: 'La marca está puesta. Falta decidir qué grabar.',
      intro: state => { const m = state.memories; return `Dani calcula que tienes tres segundos antes de que la gente deslice el dedo. Menos que un anuncio de seguros. El alcance abre puertas, pero la gente distingue entre atención y apoyo.${m.daniNoFilter ? ' Hoy, sin filtro.' : m.daniTrend ? ' Dani ya ha elegido la canción. No preguntes.' : ''}`; },
      choices: {
        explain: { title: 'Explicar la propuesta y lo que cuesta', flavor: 'Un minuto, plano fijo y una pizarra con la letra de Lola' },
        chairs: { title: 'El baile de las seis sillas', flavor: 'Coreografía con las sillas de Paco. Nadie sabe qué propones; todo el mundo sabe que te caes en el segundo once' },
        neighbor: { title: 'Dejar hablar a Marisa', flavor: 'Ella habla del calor, del local que le han subido y de la cita de su madre. Tú sujetas el móvil y te callas' },
        debunk: { title: 'Desmontar el bulo del día', flavor: 'Circula un montaje que dice que quieres prohibir las terrazas. Lo desmientes con calma y con el plano entero' },
      },
    },
    // ctx: { forecast: { score, threshold }, contradiction } — contradiction = prometiste todo / discurso incoherente.
    crisis: {
      eyebrow: 'CAPÍTULO 5 · CRISIS',
      title: (state, ctx) => ctx.contradiction ? 'La libreta de Marisa ha llegado antes que la prensa.' : 'Un vídeo recortado ha llegado antes que la verdad.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Alguien ha subido el momento en que lo prometías todo a la vez. Le han puesto música de tráiler y un título en mayúsculas. La libreta de Marisa, página doce, sale en la miniatura.'
        : 'Circula un clip de nueve segundos cortado justo antes de que explicaras el coste de tu propuesta. Parece que prometes lo contrario. Los comentarios se escriben solos.'}${state.memories.nicoPromise ? ' Y la Reme ha llamado: sigue sin cita.' : ''} Previsión actual: <b>${ctx.forecast.score}/100</b>. Se necesitan ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Dar la cara: reconocer el error y corregirlo', flavor: 'Vídeo sin música, sin filtro y sin «se ha malinterpretado»' },
        team: { title: 'Publicar costes y responsables', flavor: 'Lola sube las cuentas; Nico, quién hace qué. Aburrido, comprobable y difícil de recortar' },
        distract: { title: 'Sortear una freidora de aire', flavor: 'Para participar: seguir la cuenta, mencionar a tres amigos y olvidar el tema' },
        blame: { title: 'Culpar al algoritmo, a los bots y a «los de siempre»', flavor: 'Funciona con los que ya te seguían. Los demás reconocen el truco: lo han visto en todos los partidos' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTULO 5 · EL DEBATE', title: 'Dos rivales y una jarra de agua sin abrir.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `A un lado del escenario —solo del escenario—, ${tech.name}, de ${tech.party}, que habla de «optimizar sinergias habitacionales» con un puntero láser. Al otro, ${populist.name}, del ${populist.party}, que va a bajar todos los impuestos y subir todo lo demás «desde el primer día».${hard ? ` En el último atril, ${hard.name}, de ${hard.party}, con botas de montar.` : ''} La moderadora, ${moderator}, te mira: «¿A qué renuncia su programa?».`,
      choices: {
        tradeoff: { title: 'Defender la renuncia concreta', flavor: (state, { rivals }) => `Dices qué pierdes y a quién molestas. ${rivals.tech.name} pide «un dato». Se lo das. Se queda sin dato` },
        attack: { title: (state, { rivals }) => `Atacar a ${rivals.tech.party}`, flavor: 'Le sacas el vídeo de su barco. Aplauso fácil, titular fácil, cero propuestas' },
        manage: { title: 'Dar turnos y desmontar cifras con calma', flavor: (state, { rivals }) => `Cuando ${rivals.populist.name} promete «pisos para todos en seis meses», preguntas cuántos albañiles hay. Silencio. Agua` },
        promise: { title: 'Prometer bajar el alquiler a la mitad «el primer mes»', flavor: (state, { rivals }) => `El público aplaude. ${rivals.populist.name} te mira con envidia profesional. ${rivals.moderator} levanta una ceja que se oye` },
      },
    },
    // ctx: { forecast: { score, winning } }
    finalPrep: {
      eyebrow: 'CAPÍTULO 6 · ÚLTIMA VUELTA', title: 'Todavía queda margen.',
      intro: (state, ctx) => `Previsión: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'por encima' : 'por debajo'} del umbral). Quedan dos días. Dani quiere un directo, Lola un PDF y Nico unas zapatillas nuevas. Solo hay tiempo para una cosa bien hecha.`,
      choices: {
        listen: { title: 'Visitar a quienes aún dudan', flavor: state => `La parada del autobús, la cola del centro de salud y el rellano de la Reme${state.memories.nicoAssembly || state.memories.nicoInvite ? '. La asamblea del portal te pide que vuelvas' : ''}. Escuchas más de lo que hablas` },
        receipts: { title: 'Publicar el presupuesto definitivo', flavor: 'Lola lo imprime en A3 con letra grande, porque «la transparencia también es tamaño de fuente»' },
        volunteers: { title: 'Ordenar voluntarios y colegios', flavor: state => `Nico reparte turnos, bocadillos y un mapa de colegios dibujado en una servilleta${state.memories.pacoLucia ? '. Lucía, la nueva camarera de Paco, se apunta de interventora' : ''}` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTULO 6 · EL ÚLTIMO MITIN', title: 'Una frase antes del silencio electoral.',
      intro: 'Sillas plegables, un globo que se desinfla despacio y una periodista del diario local con cara de llevar tres mítines hoy. El cierre puede consolidar lo aprendido o volver a prometerlo todo.',
      choices: {
        account: {
          title: state => ({
            shade: '“Habrá sombra y habrá menos coches. Esto elegimos, esto cuesta y aquí responderemos.”',
            parking: '“El barrio podrá trabajar, aunque este verano siga sin árboles. Esto elegimos y aquí responderemos.”',
            festival: '“Habrá cultura y habrá ruido pactado. Esto elegimos, esto cuesta y aquí responderemos.”',
            housing: '“El tercero volverá a tener vecinos. Tardará. Costará. Y aquí responderemos.”',
          }[state.proposal] || '“Esto elegimos, esto cuesta y aquí responderemos.”'),
          flavor: 'Lo dices mirando a Marisa. Marisa abre la libreta y, por primera vez, no apunta nada',
        },
        viral: { title: '“¡Menos atasco y más gazpacho!”', flavor: 'Dani lo emite en directo. Se corea. Nadie sabe qué significa; tú tampoco' },
        everything: { title: '“Mañana habrá de todo para todos.”', flavor: 'Aplauso enorme. Lola se tapa la cara con el presupuesto' },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'NOCHE ELECTORAL · VICTORIA', title: 'Hay más sillas que personas.',
      text: state => `Marisa aplaude una vez. Lola pregunta quién ha guardado las facturas. Paco anuncia «una y nos vamos» y no se va nadie. Es, inequívocamente, una victoria. ${{
        shade: 'Mañana empieza lo difícil: explicarle a la furgoneta del sobrino dónde aparca.',
        parking: 'Mañana empieza lo difícil: el primer agosto sin árboles con tu nombre en la placa.',
        festival: 'Mañana empieza lo difícil: la primera reunión con los del primero, que ya han traído tapones para ti.',
        housing: 'Mañana empieza lo difícil: el del tercero ya ha preguntado si puede venir a la primera asamblea.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NOCHE ELECTORAL · DERROTA', title: 'Las sillas vuelven al bar.',
      // Una razón por cada estadística por debajo del umbral.
      reasons: {
        support: 'Faltó apoyo directo: el barrio te vio más en el móvil que en el portal.',
        credibility: 'Las contradicciones pesaron: la libreta de Marisa tenía demasiadas páginas.',
        organization: 'El equipo llegó desordenado: un colegio sin interventor y otro con tres.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: 'MINIJUEGO · HAZLO VIRAL', title: 'Grabando en la marca.', goWord: '¡Acción!',
      lanes: ['Saludo', '¡Arriba!', 'Palmas', '¿Y yo qué sé?'], // ← ↑ → ↓ (gestos fijos: saludar, brazos arriba, palmas, encogerse)
      takes: { // según la elección de la pantalla de vídeo
        explain: 'Pizarra de Lola, plano fijo y cada gesto subraya un coste.',
        chairs: 'El baile de las seis sillas. Paco mira con los brazos cruzados.',
        neighbor: 'Marisa habla; tú marcas el ritmo detrás, discretamente. Más o menos.',
        debunk: 'Desmontas el bulo con gestos claros: esto no, esto sí, esto cuesta.',
      },
      intro: (state, ctx) => `Móvil en el trípode, vecinos mirando y Dani contando. ${ctx.take} Haz cada pose cuando su icono llegue al círculo. El ritmo suma alcance, no votos.`, // ctx: { take }
      titles: { great: '¡Viral! En el barrio, por lo menos.', ok: 'Se comparte en tres grupos de WhatsApp.', bad: 'Lo ha visto tu madre. Dos veces.' },
      texts: { ok: 'Dani ya está poniendo subtítulos en amarillo. La toma vale: el alcance abre puertas, pero los votos se ganan en el portal.', bad: 'Te has perdido entre el saludo y las palmas. Puedes repetir la toma; el barrio no ha visto nada (todavía).' },
    },
    duel: {
      eyebrow: 'MINIJUEGO · DUELO DE RÉPLICAS', title: 'Cinco preguntas, un cronómetro.',
      intro: (state, ctx) => `${ctx.rounds} réplicas. Elige la respuesta que defiende algo concreto y asume su coste, antes de que se acabe el tiempo. A mitad, alguien te interrumpirá: pide la palabra.`, // ctx: { rounds }
      // Exactamente 4 rondas · 3 options · `correct` = índice de la respuesta concreta. role: tech | populist | moderator.
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'A quien aparca en doble fila y a dos mesas de la terraza de Paco. Lo decimos claro: sombra a cambio de coches.',
          parking: 'Al banco al sol: este verano seguirá sin árboles. Elegimos que el barrio pueda trabajar.',
          festival: 'A los del primero, dos noches por semana. Habrá horario pactado y tapones de regalo, literalmente.',
          housing: 'A los caseros de pisos turísticos sin licencia. Y tardará más de una legislatura. Lo sabemos.',
        }[state.proposal];
        return [
          { topic: 'Vivienda', role: 'populist', claim: '¡Pisos para todos en seis meses! ¡Y si no, dimito! …Bueno, dimitir es mucho decir.',
            options: ['¿Con cuántos albañiles? Nosotros: censo de pisos turísticos e inspección. Tarda, pero se puede comprobar.', '¡Pues yo en tres meses! ¡Y con plaza de garaje!', 'Usted tiene un barco. Lo sabe todo el barrio.'], correct: 0 },
          { topic: 'Bulos', role: 'tech', claim: 'Mis datos dicen que su plaza tiene un trescientos por cien de sombra. Lo he visto en un gráfico muy bonito.',
            options: ['Y los míos dicen que usted es un bot. Muy bien entrenado, eso sí.', 'Bueno, los datos son relativos, como todo en la vida.', 'Enseñe la fuente. Aquí está la nuestra: el presupuesto de Lola, página dos, con fotos del banco a las cinco.'], correct: 2 },
          { topic: 'Su propuesta', role: 'moderator', claim: 'Pregunta directa: ¿a quién perjudica su propuesta? Treinta segundos. Bueno, diez.',
            options: ['A nadie. Es una propuesta sin perdedores, como los anuncios de colonia.', cost || 'A alguien seguro. Lo diremos con nombre y apellidos cuando lo sepamos.', 'A los de siempre, que ya saben quiénes son.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'La libreta', role: 'populist', claim: '¡Usted le prometió a una señora sombra, aparcamiento y un piso para su sobrino! ¡Lo tengo en vídeo!',
                options: ['Es verdad. Me equivoqué al prometerlo todo; luego elegimos una cosa y la explicamos con su coste.', 'Eso es un montaje de inteligencia artificial.', 'Bueno, y usted prometió bajar todo. Empate.'], correct: 0 }
            : { topic: 'Sanidad', role: 'tech', claim: '¿Y la sanidad? ¿O a usted solo le importa su plaza con su banquito?',
                options: ['Prometo que mañana no hay listas de espera. Palabra.', 'Nos importa. Por eso no prometemos lo que un ayuntamiento no gestiona: pediremos la cita de la Reme en el pleno, con nombre.', 'Mire, yo de sanidad no hablo sin mi abogado.'], correct: 1 },
        ];
      },
      interruptions: { // a mitad de cada ronda, quien pregunta interrumpe
        populist: '¡Perdone, perdone! ¡Que me deja usted con la palabra en la boca!',
        tech: 'Si me permite un dato… otro dato… un último dato…',
        moderator: 'Le quedan pocos segundos. Menos. Ya casi ninguno.',
        fallback: '¡Perdone, perdone!',
      },
      floor: 'Déjeme terminar, por favor.', // lo dices al pedir la palabra
      floorBabble: 'Déjeme terminar', // solo audio; si falta, se usa `floor`
      reactions: { // timeout/quick/slow los dice la moderadora; wrong, quien preguntó
        timeout: 'Se acabó el tiempo. Pasamos a la siguiente, que la jarra se calienta.',
        quick: 'Respuesta concreta y a tiempo. Tomo nota.',
        slow: 'Concreta, aunque justita de tiempo.',
        wrong: 'Gracias por darme la razón. Bueno, casi.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} asiente. Dos veces.`, mid: 'Has aguantado el tipo.', low: 'Los rivales se van a casa contentos.' },
      text: 'La estrategia que elegiste marca el debate; las réplicas deciden si se te cree.',
    },
    chairs: {
      eyebrow: 'MINIJUEGO · SEIS SILLAS', title: 'Paco presta las sillas. Tú las cargas.',
      intro: (state, ctx) => `Para la última asamblea en la plaza hacen falta seis sillas, y están repartidas por todo el barrio. Pasa por encima de una para cogerla y llévala al corro marcado. Una a una: «que la espalda también vota», dice Nico. Tienes ${ctx.time} segundos.`, // ctx: { time }
      hints: {
        start: 'Pasa por encima de una silla para cogerla.',
        carry: 'Ahora, al corro amarillo.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. A por la siguiente.`, // ctx: { delivered, total }
        full: '¡Corro completo!',
      },
      titles: { all: 'Seis sillas, cero excusas.', mid: 'Medio corro. Los demás, de pie.', low: 'Paco recoge las sillas él mismo.' },
      texts: { all: 'Nico apunta el tiempo en la servilleta del mapa. Organización es esto: que haya sitio cuando llegue la gente.', other: 'Las que faltan siguen por la plaza. Puedes repetir: nadie ha visto nada, salvo Paco.' },
    },
    rally: {
      eyebrow: 'MINIJUEGO · EL ÚLTIMO MITIN', title: 'Que no se te vaya la sala.', goWord: '¡Habla!', lane: 'Remata la frase',
      intro: 'Cada frase tiene un remate. Pulsa cuando la palabra llegue al círculo: el público aplaude, la atención sube. Si fallas, alguien mira el móvil. O peor: abuchea.',
      // Exactamente 12 pares [frase, REMATE]; el ritmo (compases) es fijo.
      phrases: state => {
        const own = {
          shade: ['Este verano, la plaza tendrá', 'SOMBRA'], parking: ['Quien trabaja en este barrio podrá', 'DESCARGAR'],
          festival: ['Los chavales tendrán un local y la plaza, ', 'CULTURA'], housing: ['El tercero volverá a tener', 'VECINOS'],
        }[state.proposal] || ['Una cosa bien hecha, para', 'EMPEZAR'];
        return [
          ['Buenas noches, salón multiusos. Gracias por venir y por traer', 'SILLA'],
          ['No vengo a prometeros la luna: vengo a prometeros', 'UNA COSA'],
          own,
          ['Y sí: tiene un coste. Lo hemos puesto por', 'ESCRITO'],
          ['Lola lo ha calculado, Nico lo ha repartido y Dani lo ha', 'SUBIDO'],
          ['Nadie aquí ha dicho que esto se pague', 'SOLO'],
          ['Si no lo cumplimos, ya sabéis dónde está la', 'PANADERÍA'],
          ['Marisa tiene una libreta. Hoy la libreta está', 'TRANQUILA'],
          ['El domingo no os pido fe: os pido que', 'VOTÉIS'],
          ['A quien queráis. Pero que no decida el', 'SOFÁ'],
          ['Gracias, barrio. Y ahora, las sillas, a su', 'SITIO'],
          ['¡Pues me', 'PRESENTO!'],
        ];
      },
      titles: { great: 'La sala en pie. Bueno, los que tienen silla.', ok: 'Aplausos sinceros y algún bostezo.', bad: 'Se ha oído un móvil. Y luego otro.' },
      text: 'El público recordará cómo lo dijiste; la decisión que has tomado decide qué recuerda.',
    },
  },
};
