// Datos con texto · Asturianu (ast): feed de unratito (src/data/feed.js) y móvil (src/data/phoneNews.js), por id.
// Secciones: feed: { hint, videos: { <id>: {…} } } · phone: { apps, notifications: { <id>: {…} }, policies: { <id>: {…} }, poll, policyHeadline }.
// Lo que falte cae en: es. Ver src/i18n/README.md.
// Les funciones repiten la mesma lóxica que src/data/phoneNews.js (namás camuda’l testu). Utilidaes locales pa nun
// importar phoneNews.js (importación circular): mesmu comportamientu que handle/tag/lower/fmt de l’orixinal.
const handle = (name = '') => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const tag = (party = '') => party.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '');
const lower = (text = '') => (text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '') : '');
const fmt = n => (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');

const ECO = 'El Ecu del Barriu';
const MARISA = 'Marisa (mercería)';

export default {
  feed: {
    hint: {
      swipe: 'Esliza',
      keys: 'Rueda, arrastrar, S o Espaciu',
      end: 'Nun hai más vídeos. Namás esto.',
    },
    videos: {
      trend: {
        caption: 'Tercer día ensayando’l trend. Mio ma entró dos veces a por la fregona y yá se sabe los pasos meyor que yo.',
        tags: ['trend', 'baillin', 'ensayu47', 'pati'],
        sound: 'soníu orixinal · Espicha Remix (versión cocina)',
        sticker: 'POV: el baille pide 40 m² y el pisu tien 38',
        likes: '1,2 M',
        comments: '8.431',
        shares: '22,9 mil',
        alt: 'Una moza con coleta baila un trend delantre d’un aru de lluz nuna cocina diminuta, cola fregona de so ma al fondu.',
      },
      abuelo: {
        caption: 'Mio güelu enteróse de que’l tobogán de la piscina municipal ye de baldre pa los xubilaos. Lleva 37 baxaes. Nun soltó’l periódicu.',
        tags: ['guelu', 'piscinamunicipal', 'xubilacionactiva', 'calcetinosconsandalies'],
        sound: 'soníu orixinal · Pasodoble del chiringuitu',
        sticker: 'Baxada n.º 37. Nin se despeinó.',
        likes: '3,4 M',
        comments: '41,7 mil',
        shares: '210 mil',
        alt: 'Un señor mayor con gafes de sol, bigote y calcetinos con sandalies baxa per un tobogán xigante nun flotador lleendo’l periódicu con tola seriedá, y cai a la piscina.',
      },
      sixseven: {
        caption: 'La profe de mates dixo «abrimos pela páxina 67» y perdió la clase pa siempre. Tán asina dende’l martes.',
        tags: ['67', 'sixseven', 'clasedemates', 'perdonprofe'],
        sound: 'soníu orixinal · six seven (sped up)',
        likes: '6,7 M',
        comments: '67 mil',
        shares: '67 mil',
        alt: 'Un guaje cola gorra del revés fai’l xestu del «6 7» xubiendo y baxando les manes coles palmes p’arriba delantre d’una pizarra que pon «páx. 67».',
      },
      news: {
        tag: 'ÚLTIMA HORA',
        title: ['Vienen', 'eleiciones.'],
        body: 'El Gobiernu disuelve les Cortes y convoca eleiciones xenerales. Los partíos de siempre yá tán grabando vídeos en manga de camisa.',
        caption: 'Comentariu destacáu · @maripuri_63: «¿Otra vez? Si entá tengo nel buzón la propaganda de les últimes».',
        tags: ['eleiciones', 'ultimahora', 'otravez'],
        sound: 'soníu orixinal · Sintonía d’urxencia',
        likes: '48,2 mil',
        comments: '3.104',
        shares: '9.870',
        aside: 'Lleves venti minutos de «ún más y déxolo». Y agora esto.',
        cta: '«Pues yo tengo una propuesta»',
        alt: 'Noticia d’última hora: l’edificiu del Congresu con una urna onde caen sobres. El Gobiernu disuelve les Cortes y convoca eleiciones xenerales.',
      },
    },
  },

  phone: {
    apps: {
      press: { label: ECO },
      social: { label: 'unratito' },
      group: { label: 'Esto va en serio' },
      neighbors: { label: 'Vecinos Portal 3' },
    },

    notifications: {
      // ---------------------------------------------------------------- enantes de nada
      'start-news': { from: ECO, title: 'Eleiciones xenerales: el barriu vuelve votar',
        text: 'Disueltes les Cortes. Nel mercáu alderíquese qué ye peor: otra campaña o’l preciu de los güevos. Gana la campaña por poco.' },
      'start-dani': { from: 'Dani',
        text: '¿Vistis lo de les eleiciones? Daquién d’esti grupu tendría que presentase. Yo non, que tengo cuatro trabayos y dengún con contratu.' },

      // ---------------------------------------------------------------- capítulu 1
      'phone-lola': { from: 'Lola',
        text: 'Acabo de lleer «pues me presento». Dime que ye broma. Abrí una fueya de cálculu por si nun lo ye.' },
      'call-lola-treasury': { from: 'Lola',
        text: 'Estáu de cuentes: 43 euros, un vale de pizzería y una factura de cada cosa. Si salimos nes noticies, que sea por aburríos.' },
      'call-lola-strategy': { from: 'Lola',
        text: 'Fixi un DAFO. Debilidaes: nosotros. Amenaces: tamién nosotros. Fortaleces: tengo rotuladores.' },
      'call-nico': { from: 'Nico',
        text: state => state.team?.nico?.job === 'Actos' ? 'Primer actu confirmáu: alcontrar un actu. Segundu actu: silles.' : 'Mapa del barriu con chinchetes fechu. Sobra una chincheta y naide sabe de qué portal ye.' },
      'register-press': { from: ECO, title: (s, { party }) => `Naz «${party}»`,
        text: (s, { party }) => `Rexistráu un partíu nuevu nel barriu. Na ventaniella entrugaron si «${party}» yera una asociación de vecinos. Rempuesta del fundador: «Téunicamente, tamién».` },
      'register-tech': { from: (s, { rivals }) => `@${handle(rivals.tech.name)}`,
        text: (s, { rivals, party }) => `Bienveníos, «${party}». Cuando queráis xestionar daqué más grande qu’un portal, pásovos un gráficu. Xube. Ye bonu. #${tag(rivals.tech.party)}` },
      'leave-neighbors': { from: 'Encarni (1.ºA)',
        text: 'Avisu: el del segundu baxó con carpeta y cara de dir dar un discursu. O preséntase a daqué o vende enciclopedies.' },

      // ---------------------------------------------------------------- capítulu 2 · la plaza
      'neighbor-listened': { from: MARISA,
        text: 'Dixi na frutería que hai ún qu’escucha enantes de falar. Riéronse, pero apuntaron el to nome.' },
      'neighbor-both': { from: MARISA,
        text: 'Cuéntenme que prometisti solombra y aparcamientu a la vez. Paco entruga si tamién-y pues prometer un camareru.' },
      'neighbor-spectacle': { from: '@plaza_en_directo',
        text: 'Candidatu faciendo’l show na plaza: 34 visualizaciones, 30 de so ma. Les otres cuatro, de la ma de Dani. #barriu' },
      'program-press': { from: ECO, title: (s, { party }) => `«${party}» escueye una propuesta (namás una)`,
        text: (s, { proposal }) => proposal ? `«${proposal.title}». Lo que cuesta, dicho por ellos mesmos: ${lower(proposal.compromise)}. Ye la primer vez que daquién lo cuenta enantes de votar.` : 'Propuesta presentada. Costu incluyíu, cosa rara.' },
      'program-populist': { from: (s, { rivals }) => `@${handle(rivals.populist.name)}`,
        text: (s, { rivals }) => `Eso que propón el partíu nuevu yá lo propunximos nosotros. Y lo contrario, tamién. Rectificar ye de sabios. #${tag(rivals.populist.party)}` },
      'speech-coherent': { from: ECO, title: 'Un discursu con lletra pequeña… lleída en voz alta',
        text: 'Na plaza dixo qué costaba la so propuesta y a quién molesta. Un vecín aplaudió. Dempués miró alredor, por si yera l’únicu. Nun lo yera.' },
      'speech-everything': { from: '@clips_del_barriu',
        text: '«¡De too pa toos!» Clip viral. Comentariu destacáu: «¿Y quién lo paga?». Rempuesta con más likes: «El to primu».' },
      'speech-mixed': { from: '@clips_del_barriu',
        text: 'Discursu na plaza: entamó con una propuesta y acabó con otra. Los del chigre ficieron una porra p’alivinar la tercera.' },
      'aftermath-dani': { from: 'Dani',
        text: s => s.reach >= 15 ? 'Estadístiques: viéronnos un montón de persones. Dos entendieron la propuesta. Ye un entamu.' : 'Estadístiques d’algame: la to tía, la mio tía y un bot que vende gafes de sol. Hai que dir a por más tíes.' },

      // ---------------------------------------------------------------- capítulu 3 · la sede
      'hq-accounts': { from: 'Lola',
        text: 'Cuentes publicaes na puerta del salón. Un señor lleóles enteres. Yera’l del butanu, pero cuenta.' },
      'hq-street': { from: 'Nico',
        text: 'Plan de cai: cada portal, un timbre. Cada timbre, un señor que yá votó en 1982 y cuéntatelo.' },
      'hq-content': { from: 'Dani',
        text: 'Calendariu de conteníos llistu: llunes propuesta, martes meme, miércoles pidir perdón pol meme.' },
      'hq-tenants': { from: 'Asamblea del Portal 5',
        text: 'Gracies por venir a la reunión d’inquilinos. Yes el primer candidatu que se queda hasta’l turnu de ruegos y entrugues.' },

      // ---------------------------------------------------------------- capítulu 4 · vídeo
      'video-explain': { from: '@unratito_tendencias',
        text: 'Vídeo esplicando una propuesta con cifres y ensin música épica. L’algoritmu nun sabe qué facer con él y amuésalu por si acasu.' },
      'video-chairs': { from: '@unratito_tendencias',
        text: 'Baille de les silles: tendencia númberu ún del barriu. La propuesta nun apaez, pero les silles salen guapísimes.' },
      'video-neighbor': { from: MARISA,
        text: 'Paráronme tres persones pela cai pol vídeo. Una pa votate y dos pa que-yos arregle un baxu.' },
      'video-debunk': { from: ECO, title: 'Un candidatu desmiente un bulu con… datos',
        text: 'El montaxe dicía que quería prohibir les terraces. El vídeo de rempuesta dura un minutu y nun glaya. Coméntase como una rareza.' },
      'video-viral-score': { from: 'Dani',
        text: 'El ritmu del vídeo, claváu. Mio ma compartiólu en cuatro grupos y ún yera’l de la parroquia.' },

      // ---------------------------------------------------------------- capítulu 5 · crisis
      'crisis-admit': { from: ECO, title: 'Un políticu reconoz un error. Los espertos pidin calma',
        text: 'Almitió que s’equivocara y esplicó cómo lo arregla. Los tertulianos nun teníen preparada esa opción y tuvieron qu’improvisar.' },
      'crisis-team': { from: 'Lola',
        text: 'Rueda de prensa d’equipu: cada ún dixo lo so y per una vez dicíamos lo mesmo. Téngolo apuntao por si nun se repite.' },
      'crisis-distract': { from: '@clips_del_barriu',
        text: 'Yá naide fala de la contradicción. Tol mundu fala del perru con gafes del vídeo nuevu. Misión cumplida, ¿non?' },
      'crisis-blame': { from: 'Paco (chigre)',
        text: 'Dices que la culpa ye del algoritmu y de los de siempre. Equí nel chigre los de siempre somos nosotros, que conste.' },

      // ---------------------------------------------------------------- capítulu 5 · debate
      'debate-tradeoff': { from: ECO, title: 'El debate, nuna frase: «esto cuesta esto»',
        text: (s, { rivals }) => `${rivals.tech.name} pidió «un datu». Diéron-ylu. Fontes del so partíu confirmen que lu tán estudiando pa derogalu.` },
      'debate-attack': { from: '@debate_en_vivo',
        text: (s, { rivals }) => `Zasca a ${rivals.populist.name} cola hemeroteca. Aplausos, memes y nin una propuesta. El barriu pasólo bomba.` },
      'debate-manage': { from: ECO, title: '«¿De qué añu?»: la entruga que dexó mudu al salón',
        text: (s, { rivals }) => `${rivals.tech.name} prometió baxar impuestos «a partir del segundu añu». Entrugáron-y de qué añu. Pidió agua.` },
      'debate-promise': { from: '@debate_en_vivo',
        text: (s, { rivals }) => `Prometer l’alquiler a la metá «per decretu». ${rivals.populist.name} yá pidió’l númberu del que t’escribe los discursos.` },
      'debate-duel': { from: 'Nico',
        text: 'Les répliques del debate, de diez. La mio güela diz que nun te punxisti nerviosu. La mio güela tampoco, y viólu enteru.' },

      // ---------------------------------------------------------------- capítulu 6 · última vuelta y mitin
      'prep-poll': { from: ECO, title: 'Sondéu del barriu: apriétase',
        text: (s, { poll }) => poll?.player ? (poll.winning ? `L’institutu To Primu Demoscopia asitia a «${poll.player.party}» per delantre de ${poll.leader.party}. Marxe d’error: el que faiga falta.` : `${poll.leader.party} sigue per delantre; «${poll.player.party}» queda a ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} puntos. Indecisos: los de siempre, más que nunca.`) : 'Sondéu publicáu. Indecisos: los de siempre.' },
      'prep-listen': { from: MARISA,
        text: 'La de la parada del bus diz que yes l’únicu que-y entrugó pol autobús en cuenta de pol votu. Va votar. Pol autobús.' },
      'prep-receipts': { from: 'Lola',
        text: 'Presupuestu n’A3 colgáu na plaza. Una señora lleólu con gafes de cerca y dixo «esto sí». Nun sé qué parte.' },
      'prep-volunteers': { from: 'Nico',
        text: 'Voluntarios per colexu: cubiertos. Bocadiellos: cubiertos. El mapa de la servilleta: con una mancha d’aceite onde va’l colexu 3.' },
      'final-account': { from: ECO, title: 'Zarru de campaña ensin autobuses',
        text: 'Silles plegables, un globu picáu y un discursu que repetía la mesma propuesta del primer día. En campaña, eso ye casi una escentricidá.' },
      'final-viral': { from: '@clips_del_barriu',
        text: 'El remate del mitin yá tien remix. Naide sabe de qué diba’l mitin, pero’l remix dura tres hores.' },
      'final-everything': { from: 'Lola',
        text: '«De too pa toos, per decretu». Tapéme la cara col presupuestu. Lliteralmente. Tengo tinta na nariz.' },
      'reflection': { from: 'Encarni (1.ºA)',
        text: 'Xornada de reflexón. Recordatoriu: nun se pue facer campaña nel grupu. Dicho esto, mañana toos a votar al del segundu.' },
      'election-won': { from: ECO, title: (s, { party }) => `«${party}» gana nel barriu`,
        text: 'Nueche de recuentu con silles plegables. Los rivales yá anunciaron que «faen autocrítica», que na so llingua quier dicir camudar el logo.' },
      'election-lost': { from: ECO, title: 'Nueche electoral: el barriu piénsalo',
        text: 'El partíu nuevu nun llega esta vez. El so equipu recueye les silles y anuncia que se presenta a les siguientes. Dícenlo en serio. Paco yá apartó les silles.' },
    },

    policies: {
      'tech-derogar': { topic: 'Programa', text: 'Derogar «too lo anterior». Lo que pongan dempués presentaráse nuna fase posterior.' },
      'tech-rent': { topic: 'Alquiler', text: 'Quitar los topes al alquiler pa que «el mercáu se calme solu». Mientres se calma, una comisión.' },
      'tech-tourism': { topic: 'Turismu', text: 'Llicencies de pisu turísticu per ventaniella única. Abre un día al añu y hai que pidir cita pa la cita.' },
      'tech-health': { topic: 'Sanidá', text: 'Acabar coles llistes d’espera camudándo-yos el nome: agora son «itinerarios de paciencia».' },
      'tech-taxes': { topic: 'Impuestos', text: 'Baxar impuestos a partir del segundu añu, si la herencia lo permite. L’añu nun s’especifica.' },
      'tech-jobs': { topic: 'Emplegu', text: 'Plan d’emplegu mozu: práutiques ensin pagar na mesma campaña, con certificáu de «xestión».' },
      'pop-observatory': { topic: 'Vivienda', text: 'Un observatoriu del alquiler pa observar, con munchu detalle, cómo sigue xubiendo.' },
      'pop-transport': { topic: 'Tresporte', text: 'Cercaníes y FEVE de baldre pa tol mundu, pagaos por «los d’arriba». Entá nun dixeron quién son.' },
      'pop-rent': { topic: 'Alquiler', text: 'Topar l’alquiler a la metá. Si nun sal, topar el tope. Si tampoco, un observatoriu del tope.' },
      'pop-health': { topic: 'Sanidá', text: 'Un ministeriu por cada llista d’espera. La llista de ministerios tamién va tener llista d’espera.' },
      'pop-pensions': { topic: 'Costu de la vida', text: 'Xubir pensiones y salarios y baxar tolos impuestos a la vez. La calculadora ta nel taller.' },
      'pop-uturn': { topic: 'Programa', text: 'Defender lo contrario de lo que dixo nel debate, qu’agora ye xusto lo que’l barriu necesita.' },
      'hard-roundabout': { topic: 'Urbanismu', text: 'Reconquistar la rotonda del polígonu, que lleva años ocupada por unes obres. Entamando, como manda la tradición, per Covadonga.' },
      'hard-kiosks': { topic: 'Gastu', text: 'Zarrar tolos chiringuitos públicos, sacante’l de la playa, que ye tradición y tien terraza.' },
      'hard-heat': { topic: 'Calor', text: 'Escontra la calor, sentíu común: negala per decretu y regalar abanicos con bandera.' },
      'hard-horse': { topic: 'Seguridá', text: 'Un caballu per barriu. El piensu, que lu paguen los conceyos «ensin complexos».' },
      'hard-housing': { topic: 'Vivienda', text: '«La solución a la vivienda ye casase enantes». Ónde vive la pareya esplicaráse otru día.' },
      'hard-agenda': { topic: 'Programa', text: 'Derogar l’Axenda 2030 ensin lleela, por si acasu. Y el calendariu 2031, yá puestos.' },
    },

    poll: {
      pollster: 'To Primu Demoscopia',
      method: 'Encuesta del barriu: 400 entrevistes na cola del pan. Marxe d’error: el que faiga falta.',
      noParty: 'Entá nun tienes partíu rexistráu. Na cola del pan nun entruguen por ti.',
      undecided: 'Indecisos',
      threshold: 'Umbral pa ganar',
    },

    policyHeadline: (rival, policy) => `${rival.party} propón (${policy.topic.toLowerCase()})`,
  },
};
