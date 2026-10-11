// Móvil del jugador (tecla M): notificaciones y programas de los rivales. Solo datos y textos; la lógica
// (qué está desbloqueado, encuesta, tendencia) vive en src/state/phone.js.
//
// Convención de textos igual que el guion (src/data/script/): cadena o función (state, ctx). `ctx` trae
// `rivals` (script.rivals: tech, populist, hard), `party` (nombre del partido del jugador o «tu partido»)
// y `poll` (encuesta actual, ver pollFor).
//
// NOTIFICACIONES: { id, after, app, from, title?, text, when? }
//   id     estable y único: es lo único que se guarda (state.phoneRead). No renombrar ids publicados.
//   after  id de misión que debe estar COMPLETADA (null = desde el principio). Desbloqueo en orden de misión.
//   app    'press' (El Eco del Barrio) | 'social' (unratito) | 'group' (grupo de amigos) | 'neighbors' (Portal 3)
//   when   (state) => bool opcional: decisiones y memorias. Debe ser determinista.
//
// POLÍTICAS DE LOS RIVALES: { tech|populist|hard: [{ id, after, topic, text }] }. Cada una genera además una
// notificación de prensa («X propone…»). Sátira de políticas, nunca de colectivos (docs/RESEARCH_SPAIN.md,
// docs/PARTIES.md). Sin avisos de ficción: el aviso va solo en el arranque y en los créditos.

const choice = (key, id) => state => state.campaignChoices?.[key] === id;
const memory = id => state => !!state.memories?.[id];
const job = (friend, name) => state => state.team?.[friend]?.job === name;

export const APPS = {
  press: { label: 'El Eco del Barrio', icon: 'note', color: '#ff6b4f' },
  social: { label: 'unratito', icon: 'heart', color: '#a77bff' },
  group: { label: 'Esto va en serio', icon: 'chat', color: '#5cc46e' },
  neighbors: { label: 'Vecinos Portal 3', icon: 'home', color: '#ffb43a' },
};

export const notifications = [
  // ---------------------------------------------------------------- antes de nada
  { id: 'start-news', after: null, app: 'press', from: 'El Eco del Barrio', title: 'Elecciones generales: el barrio vuelve a votar',
    text: 'Disueltas las Cortes. En el mercado se debate qué es peor: otra campaña o el precio de los huevos. Gana la campaña por poco.' },
  { id: 'start-dani', after: null, app: 'group', from: 'Dani',
    text: '¿Habéis visto lo de las elecciones? Alguien de este grupo debería presentarse. Yo no, que tengo cuatro trabajos y ninguno con contrato.' },

  // ---------------------------------------------------------------- capítulo 1
  { id: 'phone-lola', after: 'phone', app: 'group', from: 'Lola',
    text: 'Acabo de leer «pues me presento». Dime que es broma. He abierto una hoja de cálculo por si no lo es.' },
  { id: 'call-lola-treasury', after: 'call', app: 'group', from: 'Lola', when: job('lola', 'Tesorería'),
    text: 'Estado de cuentas: 43 euros, un vale de pizzería y una factura de cada cosa. Si salimos en las noticias, que sea por aburridos.' },
  { id: 'call-lola-strategy', after: 'call', app: 'group', from: 'Lola', when: job('lola', 'Estrategia'),
    text: 'He hecho un DAFO. Debilidades: nosotros. Amenazas: también nosotros. Fortalezas: tengo rotuladores.' },
  { id: 'call-nico', after: 'call', app: 'group', from: 'Nico',
    text: state => state.team?.nico?.job === 'Actos' ? 'Primer acto confirmado: encontrar un acto. Segundo acto: sillas.' : 'Mapa del barrio con chinchetas hecho. Sobra una chincheta y nadie sabe de qué portal es.' },
  { id: 'register-press', after: 'register', app: 'press', from: 'El Eco del Barrio', title: (s, { party }) => `Nace «${party}»`,
    text: (s, { party }) => `Registrado un partido nuevo en el barrio. En la ventanilla preguntaron si «${party}» era una asociación de vecinos. Respuesta del fundador: «Técnicamente, también».` },
  { id: 'register-tech', after: 'register', app: 'social', from: (s, { rivals }) => `@${handle(rivals.tech.name)}`,
    text: (s, { rivals, party }) => `Bienvenidos, «${party}». Cuando queráis gestionar algo más grande que un portal, os paso un gráfico. Sube. Es bueno. #${tag(rivals.tech.party)}` },
  { id: 'leave-neighbors', after: 'leave', app: 'neighbors', from: 'Encarni (1.ºA)',
    text: 'Aviso: el del segundo ha bajado con carpeta y cara de ir a dar un discurso. O se presenta a algo o vende enciclopedias.' },

  // ---------------------------------------------------------------- capítulo 2 · la plaza
  { id: 'neighbor-listened', after: 'neighbor', app: 'neighbors', from: 'Marisa (mercería)', when: memory('listened'),
    text: 'He dicho en la frutería que hay uno que escucha antes de hablar. Se han reído, pero han apuntado tu nombre.' },
  { id: 'neighbor-both', after: 'neighbor', app: 'neighbors', from: 'Marisa (mercería)', when: memory('promisedBoth'),
    text: 'Me cuentan que prometiste sombra y aparcamiento a la vez. Paco pregunta si también puedes prometerle un camarero.' },
  { id: 'neighbor-spectacle', after: 'neighbor', app: 'social', from: '@plaza_en_directo', when: memory('spectacle'),
    text: 'Candidato haciendo el show en la plaza: 34 visualizaciones, 30 de su madre. Las otras cuatro, de la madre de Dani. #barrio' },
  { id: 'program-press', after: 'program', app: 'press', from: 'El Eco del Barrio', title: (s, { party }) => `«${party}» elige una propuesta (solo una)`,
    text: (s, { proposal }) => proposal ? `«${proposal.title}». Lo que cuesta, dicho por ellos mismos: ${lower(proposal.compromise)}. Es la primera vez que alguien lo cuenta antes de votar.` : 'Propuesta presentada. Coste incluido, cosa rara.' },
  { id: 'program-populist', after: 'program', app: 'social', from: (s, { rivals }) => `@${handle(rivals.populist.name)}`,
    text: (s, { rivals }) => `Eso que propone el partido nuevo ya lo propusimos nosotros. Y lo contrario, también. Rectificar es de sabios. #${tag(rivals.populist.party)}` },
  { id: 'speech-coherent', after: 'speech', app: 'press', from: 'El Eco del Barrio', when: s => !!s.speech?.coherent, title: 'Un discurso con letra pequeña… leída en voz alta',
    text: 'En la plaza dijo qué costaba su propuesta y a quién molesta. Un vecino aplaudió. Luego miró alrededor, por si era el único. No lo era.' },
  { id: 'speech-everything', after: 'speech', app: 'social', from: '@clips_del_barrio', when: s => s.speech?.picks?.[1] === 'everything',
    text: '«¡De todo para todos!» Clip viral. Comentario destacado: «¿Y quién lo paga?». Respuesta con más likes: «Tu primo».' },
  { id: 'speech-mixed', after: 'speech', app: 'social', from: '@clips_del_barrio', when: s => s.speech && !s.speech.coherent && s.speech.picks?.[1] !== 'everything',
    text: 'Discurso en la plaza: empezó con una propuesta y acabó con otra. Los del bar han hecho una porra para adivinar la tercera.' },
  { id: 'aftermath-dani', after: 'aftermath', app: 'group', from: 'Dani',
    text: s => s.reach >= 15 ? 'Estadísticas: nos han visto un montón de personas. Dos han entendido la propuesta. Es un comienzo.' : 'Estadísticas de alcance: tu tía, mi tía y un bot que vende gafas de sol. Hay que ir a por más tías.' },

  // ---------------------------------------------------------------- capítulo 3 · la sede
  { id: 'hq-accounts', after: 'hqBrief', app: 'group', from: 'Lola', when: choice('hq', 'accounts'),
    text: 'Cuentas publicadas en la puerta del salón. Un señor las ha leído enteras. Era el del butano, pero cuenta.' },
  { id: 'hq-street', after: 'hqBrief', app: 'group', from: 'Nico', when: choice('hq', 'street'),
    text: 'Plan de calle: cada portal, un timbre. Cada timbre, un señor que ya votó en 1982 y te lo cuenta.' },
  { id: 'hq-content', after: 'hqBrief', app: 'group', from: 'Dani', when: choice('hq', 'content'),
    text: 'Calendario de contenidos listo: lunes propuesta, martes meme, miércoles pedir perdón por el meme.' },
  { id: 'hq-tenants', after: 'hqBrief', app: 'neighbors', from: 'Asamblea del Portal 5', when: choice('hq', 'tenants'),
    text: 'Gracias por venir a la reunión de inquilinos. Eres el primer candidato que se queda hasta el turno de ruegos y preguntas.' },

  // ---------------------------------------------------------------- capítulo 4 · vídeo
  { id: 'video-explain', after: 'video', app: 'social', from: '@unratito_tendencias', when: choice('video', 'explain'),
    text: 'Vídeo explicando una propuesta con cifras y sin música épica. El algoritmo no sabe qué hacer con él y lo enseña por si acaso.' },
  { id: 'video-chairs', after: 'video', app: 'social', from: '@unratito_tendencias', when: choice('video', 'chairs'),
    text: 'Baile de las sillas: tendencia número uno del barrio. La propuesta no aparece, pero las sillas salen guapísimas.' },
  { id: 'video-neighbor', after: 'video', app: 'neighbors', from: 'Marisa (mercería)', when: choice('video', 'neighbor'),
    text: 'Me han parado tres personas por la calle por el vídeo. Una para votarte y dos para que les arregle un bajo.' },
  { id: 'video-debunk', after: 'video', app: 'press', from: 'El Eco del Barrio', when: choice('video', 'debunk'), title: 'Un candidato desmiente un bulo con… datos',
    text: 'El montaje decía que quería prohibir las terrazas. El vídeo de respuesta dura un minuto y no grita. Se comenta como una rareza.' },
  { id: 'video-viral-score', after: 'video', app: 'group', from: 'Dani', when: s => (s.minigames?.viral?.bonus?.reach || 0) >= 6,
    text: 'El ritmo del vídeo, clavado. Mi madre lo ha compartido en cuatro grupos y en uno era el de la parroquia.' },

  // ---------------------------------------------------------------- capítulo 5 · crisis
  { id: 'crisis-admit', after: 'crisis', app: 'press', from: 'El Eco del Barrio', when: choice('crisis', 'admit'), title: 'Un político reconoce un error. Los expertos piden calma',
    text: 'Admitió que se equivocó y explicó cómo lo arregla. Los tertulianos no tenían preparada esa opción y han tenido que improvisar.' },
  { id: 'crisis-team', after: 'crisis', app: 'group', from: 'Lola', when: choice('crisis', 'team'),
    text: 'Rueda de prensa de equipo: cada uno ha dicho lo suyo y por una vez decíamos lo mismo. Lo tengo apuntado por si no se repite.' },
  { id: 'crisis-distract', after: 'crisis', app: 'social', from: '@clips_del_barrio', when: choice('crisis', 'distract'),
    text: 'Nadie habla ya de la contradicción. Todo el mundo habla del perro con gafas del vídeo nuevo. Misión cumplida, ¿no?' },
  { id: 'crisis-blame', after: 'crisis', app: 'neighbors', from: 'Paco (bar)', when: choice('crisis', 'blame'),
    text: 'Dices que la culpa es del algoritmo y de los de siempre. Aquí en el bar los de siempre somos nosotros, que conste.' },

  // ---------------------------------------------------------------- capítulo 5 · debate
  { id: 'debate-tradeoff', after: 'debate', app: 'press', from: 'El Eco del Barrio', when: choice('debate', 'tradeoff'), title: 'El debate, en una frase: «esto cuesta esto»',
    text: (s, { rivals }) => `${rivals.tech.name} pidió «un dato». Se lo dieron. Fuentes de su partido confirman que lo están estudiando para derogarlo.` },
  { id: 'debate-attack', after: 'debate', app: 'social', from: '@debate_en_vivo', when: choice('debate', 'attack'),
    text: (s, { rivals }) => `Zasca a ${rivals.populist.name} con la hemeroteca. Aplausos, memes y ni una propuesta. El barrio se lo pasó bomba.` },
  { id: 'debate-manage', after: 'debate', app: 'press', from: 'El Eco del Barrio', when: choice('debate', 'manage'), title: '«¿De qué año?»: la pregunta que dejó mudo al salón',
    text: (s, { rivals }) => `${rivals.tech.name} prometió bajar impuestos «a partir del segundo año». Le preguntaron de qué año. Pidió agua.` },
  { id: 'debate-promise', after: 'debate', app: 'social', from: '@debate_en_vivo', when: choice('debate', 'promise'),
    text: (s, { rivals }) => `Prometer el alquiler a la mitad «por decreto». ${rivals.populist.name} ya ha pedido el número del que escribe tus discursos.` },
  { id: 'debate-duel', after: 'debate', app: 'group', from: 'Nico', when: s => (s.minigames?.duel?.bonus?.credibility || 0) >= 4,
    text: 'Las réplicas del debate, de diez. Mi abuela dice que no te has puesto nervioso. Mi abuela tampoco, y lo ha visto entero.' },

  // ---------------------------------------------------------------- capítulo 6 · última vuelta y mitin
  { id: 'prep-poll', after: 'debate', app: 'press', from: 'El Eco del Barrio', title: 'Sondeo del barrio: se aprieta',
    text: (s, { poll }) => poll?.player ? (poll.winning ? `El instituto Tu Primo Demoscopia sitúa a «${poll.player.party}» por delante de ${poll.leader.party}. Margen de error: el que haga falta.` : `${poll.leader.party} sigue por delante; «${poll.player.party}» se queda a ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} puntos. Indecisos: los de siempre, más que nunca.`) : 'Sondeo publicado. Indecisos: los de siempre.' },
  { id: 'prep-listen', after: 'finalPrep', app: 'neighbors', from: 'Marisa (mercería)', when: choice('prep', 'listen'),
    text: 'La de la parada del bus dice que eres el único que le ha preguntado por el autobús en vez de por el voto. Va a votar. Por el autobús.' },
  { id: 'prep-receipts', after: 'finalPrep', app: 'group', from: 'Lola', when: choice('prep', 'receipts'),
    text: 'Presupuesto en A3 colgado en la plaza. Una señora lo ha leído con gafas de cerca y ha dicho «esto sí». No sé qué parte.' },
  { id: 'prep-volunteers', after: 'finalPrep', app: 'group', from: 'Nico', when: choice('prep', 'volunteers'),
    text: 'Voluntarios por colegio: cubiertos. Bocadillos: cubiertos. El mapa de la servilleta: con una mancha de aceite donde va el colegio 3.' },
  { id: 'final-account', after: 'finalSpeech', app: 'press', from: 'El Eco del Barrio', when: choice('final', 'account'), title: 'Cierre de campaña sin autobuses',
    text: 'Sillas plegables, un globo pinchado y un discurso que repetía la misma propuesta del primer día. En campaña, eso es casi una excentricidad.' },
  { id: 'final-viral', after: 'finalSpeech', app: 'social', from: '@clips_del_barrio', when: choice('final', 'viral'),
    text: 'El remate del mitin ya tiene remix. Nadie sabe de qué iba el mitin, pero el remix dura tres horas.' },
  { id: 'final-everything', after: 'finalSpeech', app: 'group', from: 'Lola', when: choice('final', 'everything'),
    text: '«De todo para todos, por decreto». Me he tapado la cara con el presupuesto. Literalmente. Tengo tinta en la nariz.' },
  { id: 'reflection', after: 'finalSpeech', app: 'neighbors', from: 'Encarni (1.ºA)',
    text: 'Jornada de reflexión. Recordatorio: no se puede hacer campaña en el grupo. Dicho esto, mañana todos a votar al del segundo.' },
  { id: 'election-won', after: 'election', app: 'press', from: 'El Eco del Barrio', when: s => !!s.result?.won, title: (s, { party }) => `«${party}» gana en el barrio`,
    text: 'Noche de recuento con sillas plegables. Los rivales ya han anunciado que «hacen autocrítica», que en su idioma significa cambiar el logo.' },
  { id: 'election-lost', after: 'election', app: 'press', from: 'El Eco del Barrio', when: s => !!s.result && !s.result.won, title: 'Noche electoral: el barrio se lo piensa',
    text: 'El partido nuevo no llega esta vez. Su equipo recoge las sillas y anuncia que se presenta a las siguientes. Lo dicen en serio. Paco ya ha apartado las sillas.' },
];

// Políticas que va anunciando cada rival. Ancladas en docs/RESEARCH_SPAIN.md (vivienda, turismo, sanidad,
// precariedad, calor, coste de la vida, bulos). `after`: misión completada que las publica.
export const rivalPolicies = {
  tech: [
    { id: 'tech-derogar', after: 'phone', topic: 'Programa', text: 'Derogar «todo lo anterior». Lo que pongan después se presentará en una fase posterior.' },
    { id: 'tech-rent', after: 'register', topic: 'Alquiler', text: 'Quitar los topes al alquiler para que «el mercado se tranquilice solo». Mientras se tranquiliza, una comisión.' },
    { id: 'tech-tourism', after: 'speech', topic: 'Turismo', text: 'Licencias de piso turístico por ventanilla única. Abre un día al año y hay que pedir cita para la cita.' },
    { id: 'tech-health', after: 'hqBrief', topic: 'Sanidad', text: 'Acabar con las listas de espera cambiándoles el nombre: ahora son «itinerarios de paciencia».' },
    { id: 'tech-taxes', after: 'crisis', topic: 'Impuestos', text: 'Bajar impuestos a partir del segundo año, si la herencia lo permite. El año no se especifica.' },
    { id: 'tech-jobs', after: 'debate', topic: 'Empleo', text: 'Plan de empleo joven: prácticas no remuneradas en la propia campaña, con certificado de «gestión».' },
  ],
  populist: [
    { id: 'pop-observatory', after: 'phone', topic: 'Vivienda', text: 'Un observatorio del alquiler para observar, con mucho detalle, cómo sigue subiendo.' },
    { id: 'pop-transport', after: 'register', topic: 'Transporte', text: 'Cercanías gratis para todo el mundo, pagado por «los de arriba». Aún no han dicho quiénes son.' },
    { id: 'pop-rent', after: 'speech', topic: 'Alquiler', text: 'Topar el alquiler a la mitad. Si no sale, topar el tope. Si tampoco, un observatorio del tope.' },
    { id: 'pop-health', after: 'hqBrief', topic: 'Sanidad', text: 'Un ministerio por cada lista de espera. La lista de ministerios también tendrá lista de espera.' },
    { id: 'pop-pensions', after: 'crisis', topic: 'Coste de la vida', text: 'Subir pensiones y salarios y bajar todos los impuestos a la vez. La calculadora está en el taller.' },
    { id: 'pop-uturn', after: 'debate', topic: 'Programa', text: 'Defender lo contrario de lo que dijo en el debate, que ahora es justo lo que el barrio necesita.' },
  ],
  hard: [
    { id: 'hard-roundabout', after: 'leave', topic: 'Urbanismo', text: 'Reconquistar la rotonda del polígono, que lleva años ocupada por unas obras.' },
    { id: 'hard-kiosks', after: 'program', topic: 'Gasto', text: 'Cerrar todos los chiringuitos públicos, salvo el de la playa, que es tradición y tiene terraza.' },
    { id: 'hard-heat', after: 'video', topic: 'Calor', text: 'Contra el calor, sentido común: negarlo por decreto y regalar abanicos con bandera.' },
    { id: 'hard-horse', after: 'crisis', topic: 'Seguridad', text: 'Un caballo por barrio. El pienso, que lo paguen los ayuntamientos «sin complejos».' },
    { id: 'hard-housing', after: 'debate', topic: 'Vivienda', text: '«La solución a la vivienda es casarse antes». Dónde vive la pareja se explicará otro día.' },
    { id: 'hard-agenda', after: 'finalPrep', topic: 'Programa', text: 'Derogar la Agenda 2030 sin haberla leído, por si acaso. Y el calendario 2031, ya puestos.' },
  ],
};

// Cabecera de la notificación automática que acompaña a cada política rival.
export const policyHeadline = (rival, policy) => `${rival.party} propone (${policy.topic.toLowerCase()})`;

export const pollText = {
  pollster: 'Tu Primo Demoscopia',
  method: 'Encuesta del barrio: 400 entrevistas en la cola del pan. Margen de error: el que haga falta.',
  noParty: 'Aún no tienes partido registrado. En la cola del pan no te preguntan por ti.',
  undecided: 'Indecisos',
  threshold: 'Umbral para ganar',
};

// ---------------------------------------------------------------- utilidades de texto
function handle(name = '') { return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
function tag(party = '') { return party.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, ''); }
function lower(text = '') { return text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '') : ''; }
export function fmt(n) { return (Math.round(n * 10) / 10).toFixed(1).replace('.', ','); }
