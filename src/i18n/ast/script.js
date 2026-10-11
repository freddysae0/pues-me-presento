// Guion · Asturianu (ast). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte cae en: es.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
// Traduz el guion efectivu (actual + b) completu. Hablante del protagonista: siempre 'Tú' (clave interna).

const PROPOSAL_DEFAULT = 'Una cosa bien fecha, pa entamar.';

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: 'Fermín Aguardo', party: 'Partíu Paciente' },
    populist: { name: 'Nuria Giro', party: 'Partíu Sobrevivo Otra Eleición' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Maite Escaleta',
  },

  foxDebate: {
    hallLine: 'Dexé’l caballu en doble fila. Si me lu lleven, ye ideoloxía.',
    interruption: 'Excuse me! Ensin complexos: o me dexa falar o llevántome y voime. Tengo práctica saliendo de gobiernos.',
    round: {
      topic: 'Seguridá', role: 'hard',
      claim: 'Al que-y roba’l bolsu a la señora de la parada detuviéronlu once veces. Once. Y el Gobiernu, en cuenta de xueces, abre un observatoriu. ¿Usté qué faría?',
      options: [
        'Que reincidir nun salga de baldre: xuiciu rápidu y que nun salga pela mesma puerta’l mesmu día. Y xueces, que cuesten dineru. Dicímoslo.',
        '¡Mano dura! ¡Y un caballu per barriu!',
        'Falemos de les causes. De les once.',
      ],
      correct: 0,
    },
    reactions: {
      right: 'Home. Eso nun ye de derechina cobarde. Por esta vez.',
      wrong: '¿Velo? Ensin complexos piénsase más rápido. Présto-y el caballu.',
      timeout: 'Mientres usté piensa, la España que madruga yá se foi a la cama.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'ELEICIONES XENERALES · ARGUMENTARIU INCLUÍU',
    tagline: 'Los otros partíos tienen asesores. Tu tienes una panadera que traduz.',
  },

  chapters: ['Pues me presento', 'La sede ye’l mio salón', 'Baxar a la cai', 'Failo viral', 'Sacóse de contestu', 'L’últimu mitin'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'Comparecencia nel sofá', objective: 'Avérate al móvil, xunto al sofá. Calca E.' },
    call: { title: 'Ronda de consultes', objective: 'Usa’l portátil de la mesa pa llamar a los tos collacios.' },
    register: { title: 'Constituíos a tolos efeutos', objective: 'Vete a la carpeta del escritoriu y rexistra’l partíu.' },
    leave: { title: 'Toma de contactu cola realidá', objective: 'Sal pela puerta verde pa baxar a la plaza.' },
    neighbor: { title: 'Procesu d’escucha (de verdá)', objective: 'Fala con Marisa, xunto al toldu de la panadería. Paco, na terraza del chigre, tamién tien coses que contar.' },
    program: { title: 'Nun cabe too nun decretu', objective: 'Escueyi la to primer propuesta nel tablón de la plaza.' },
    speech: { title: 'Primer comparecencia, con públicu', objective: 'Xubi al puntu del atril y da’l to primer discursu.' },
    aftermath: { title: 'La cola del pan fai l’análisis', objective: 'Vuelve onde Marisa pa saber qué se comenta na cola del pan.' },
    hqBrief: { title: 'La sede ye’l mio salón', objective: 'Axunta al equipu na mesa de campaña. Lola, Dani y Nico tamién quieren falar contigo.' },
    video: { title: 'Failo viral (con mensaxe, a poder ser)', objective: 'Graba un vídeo na marca xunto a la panadería.' },
    crisis: { title: 'Eso nun foi exactamente lo que dixi', objective: 'Enfrenta la crisis nel tablón. Enantes, quiciabes convién oyer al equipu.' },
    debate: { title: 'El debate del salón', objective: 'Entra nel debate colos rivales.' },
    finalPrep: { title: 'Última vuelta al barriu', objective: 'Escueyi nel mapa ónde concentrar l’últimu esfuerciu.' },
    finalSpeech: { title: 'L’últimu mitin, ensin autobuses', objective: 'Zarra la campaña delantre del públicu.' },
    election: { title: 'La nueche de les silles', objective: 'Consulta’l resultáu electoral.' },
    complete: { title: 'Campaña completada', objective: 'La campaña acabó.' },
  },

  travel: {
    hqBrief: { title: 'Desplazamientu institucional', objective: 'La sede ta nel baxu del portal d’al llau del chigre de Paco. Vete a la puerta y calca E.', prompt: 'Portal · Entrar na sede', loading: 'ENTRANDO NA SEDE…', sign: 'SEDE' },
    video: { title: 'Salir a medios (a la plaza)', objective: 'Pa grabar fai falta lluz y vecinos. Sal pela puerta de la sede y baxa a la plaza.', prompt: 'Puerta · Baxar a la plaza', loading: 'BAXANDO A LA PLAZA…', sign: 'PLAZA' },
    crisis: { title: 'Reunión d’urxencia, con táper', objective: 'Daqué arde nel grupu de la sede. Vuelve pel portal xunto al chigre.', prompt: 'Portal · Volver a la sede', loading: 'XUBIENDO A LA SEDE A ESCAPE…', sign: 'SEDE' },
    debate: { title: 'Treslláu al salón multiusos', objective: 'Sal pela puerta de la sede. Nel salón multiusos yá montaron los atriles.', prompt: 'Puerta · Dir al salón multiusos', loading: 'CAMÍN DEL SALÓN MULTIUSOS…', sign: 'SALÓN' },
    finalPrep: { title: 'Pisar territoriu', objective: 'Sal del salón pela puerta doble. Queda una selmana y gánase na cai.', prompt: 'Puerta · Volver a la plaza', loading: 'VOLVIENDO AL BARRIU…', sign: 'PLAZA' },
    finalSpeech: { title: 'Tresporte públicu, como’l votante mediu', objective: 'Vete a la parada xunto al quioscu y coyi’l 27 hasta’l salón multiusos.', prompt: 'Parada · Coyer el 27 al salón', loading: 'EL 27 LLEGA. TARDE, PERO LLEGA…', sign: 'BUS 27' },
  },

  // ------------------------------------------------------------------------------------------------ propuestes
  proposals: {
    shade: { title: 'Solombra enantes qu’un observatoriu de la calor', cost: '2 de presupuestu', benefit: 'Árboles, toldos, una fonte que funcione y el baxu vacíu de la esquina como sala fresca pa los mayores. Ensin plan director: con xardineru.', compromise: 'Piérdense places d’aparcamientu, la terraza de Paco encueye dos meses y el sobrín de Marisa vuelve a la doble fila.' },
    parking: { title: 'Que’l barriu pueda trabayar', cost: '2 de presupuestu', benefit: 'Carga y descarga con horariu, places rotatories pal comerciu, aparcabicis pa repartidores y llicencies de terraza en díes, non en trimestres.', compromise: 'Más coches na plaza y otru agostu a pleno sol. El bancu va siguir ferviendo.' },
    festival: { title: 'Cultura dempués de les ocho', cost: '2 de presupuestu', benefit: 'Escenariu pa grupos del barriu, cine de branu y un llocal d’ensayu que xestiona l’asociación de vecinos, non una fundación con logo.', compromise: 'Ruíu dos nueches per selmana; los del primeru, con tapones. La solombra y la carga y descarga, al caxón.' },
    housing: { title: 'Que’l terceru vuelva tener vecinos', cost: '2 de presupuestu', benefit: 'Llicencies en selmanes, construir nel solar de la esquina y qu’alquilar un pisu zarráu nun dea mieu.', compromise: 'Construir tarda más qu’anunciar un tope. Nun sal nel telediariu, van llamate «el de los caseros» y la plaza sigue ensin solombra.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'Llee’l BOE por gustu', line: 'Trabayo nuna xestoría y lleo’l BOE nel metro como quien llee novela negra: el muertu siempre ta na disposición adicional. Llévote les cuentes.', choices: [
      { label: 'Tesorería. Tu decides cuándo ye que non.', reply: 'Aceuto. Primer norma: equí nada «se financia con crecimientu». Finánciase con dineru, que ye más aburrío, pero esiste.' },
      { label: 'Estratexa. Que daquién llea la lletra pequeña.', reply: 'Fecho. La lletra pequeña ye onde los gobiernos esconden lo importante. La grande ye pal cartel.' },
    ] },
    dani: { role: 'Fala en filu', line: 'Fago vídeos pa una clínica dental y un ximnasiu. Lleí tolos filos d’«exasesor de campaña» qu’esisten. Vosotros ponéi les idees; yo fáigovos el rellatu.', choices: [
      { label: 'Comunicación. Rellatu sí, fumu non.', reply: 'Tratu. Cada mañana a les 7:00, argumentariu nel grupu. Curtiu, claru y ensin la pallabra «resiliencia». Bueno, casi ensin.' },
      { label: 'Portavoz. Vas tener que contestar entrugues.', reply: '¿Ruedes de prensa con entrugues? Eso yá nun lo fai naide. Vale: vamos ser vintage.' },
    ] },
    nico: { role: 'Conoz a tol portal', line: 'Fago turnos nun almacén y conozo a tol portal. Yo movilizo. Pero si daquién diz «tresversal» nuna reunión, baxo a por pipes.', choices: [
      { label: 'Organización. Tu pones los horarios.', reply: 'Fecho. Reuniones de venti minutos. Si dura más, ye que daquién ta lleendo un argumentariu.' },
      { label: 'Actos. Necesitamos la to voz de megáfonu.', reply: 'Cuando tocó’l Gordu nel chigre, baxó la cai entera en zapatielles. Dame un motivu asina y llénote la plaza.' },
    ] },
  },

  call: {
    title: 'Ronda de consultes. Per videollamada.',
    you: 'Tuvo una idea',
    next: 'Siguiente valiente',
    done: 'Yá tenemos equipu. Dani creó’l grupu «Argumentariu 7:00». Y, ensin querer, metió a Marisa la de la panadería.',
    doneBabble: 'Yá tenemos equipu.',
    finish: 'Baxar a la plaza',
  },

  register: {
    eyebrow: 'FUNDACIÓN · VENTANIELLA ÚNICA',
    title: 'Un nome pa la papeleta.',
    stamp: 'PENDIENTE D’EMENDAR',
    intro: 'Tres campos. Nin certificáu dixital, nin cita previa, nin anexu III. Si esto ye un suañu, que nun s’esperte naide del Ministeriu.',
    defaultName: 'La Xente del Bancu',
    defaultSlogan: PROPOSAL_DEFAULT,
    submit: 'Rexistrar candidatura',
    toast: 'REXISTRÁU. Resueltu en cero díes hábiles. Naide na ventaniella sabe cómo pasó.',
  },

  program: {
    eyebrow: 'PROGRAMA · PRESUPUESTU: 2 CRÉDITOS',
    title: 'Priorizar: escoyer, pero con corbata.',
    intro: 'Namás cabe una propuesta. Les otres nun se «calendarizan» nin se «posponen a una segunda fase»: quedan ensin facer. El barriu sabe estremar.',
    promisedBothNote: 'Marisa alcuérdase de que prometisti solombra, aparcamientu y pisu pal so sobrín. Denguna opción paga too eso. −6 de credibilidá al concretar.',
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Agora, a esplicalo nel atril. Con entrugues.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discursu
  speech: {
    headings: ['Bueno. Pues equí tamos.', '¿Qué vas defender?', 'La última frase cuenta.'],
    parts: {
      opening: { title: '01 / Rompe’l xelu', prompt: 'Siete persones. Dos esperen el bus, una baxó a por pan y otra grábate por si dices «resiliencia».', options: {
        listen: 'Enantes de falar, vini a escuchar. De verdá, non en «procesu d’escucha».',
        joke: 'Voi ser breve. Dígolo como políticu, asina que ponéivos cómodos.',
        grand: '¡Güei entamamos una fueya de ruta tresversal escontra un horizonte nuevu de país!',
      } },
      argument: { title: '02 / Dicir daqué concreto', prompt: 'Agora toca defender lo que clavasti nel tablón. Marisa yá sacó la llibreta.', options: {
        shade: 'Solombra y un sitiu frescu pa los mayores, anque perdamos aparcamientu. Ensin plan director: con árboles.',
        parking: 'Que’l que trabaya pueda descargar, anque la plaza siga ensin árboles esti branu.',
        festival: 'Cultura y un llocal pa los guajes, con horariu de ruíu pactáu y per escritu.',
        housing: 'Más pisos: suelu, llicencies rápides y qu’alquilar nun dea mieu. Nun baxa’l llunes; baxa construyendo.',
        everything: '¡Árboles, aparcamientu, festivales y un pisu pa cada ún, de baldre y nun decretu’l llunes!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'Marisa mira’l reló. Ye un reló que vio munches campañes.', options: {
        accountable: 'Si nun lo cumplimos, entrugáinoslo equí. Y vamos contestar, que yá ye novedá.',
        chant: '¡Menos atascu y más gazpachu!',
        forever: 'Pa concluyir, y n’aras de la brevedá, los mios siguientes ventisiete exes…',
      } },
    },
    timing: { eyebrow: '04 / EL GOLPE FINAL', title: 'Agora. Con convicción.', button: '¡Y por eso preséntome!' },
    result: {
      eyebrow: 'EL BARRIU ESCUCHÓ',
      goodTitle: 'Un aplausu. Ensin claque.',
      badTitle: 'Aplausu de cortesía. Na tele, «bona acoyida».',
      coherent: 'Defendisti la to propuesta y dixisti lo que cuesta. En política eso tien un nome raru: dicir la verdá.',
      incoherent: 'El to discursu nun casa col programa. Na tele llámenlo «matizar». Na cola del pan, otra cosa.',
      fine: 'L’algame mide atención, non votos. Les consecuencies dependen de lo que dixisti.',
      button: 'Baxar del atril',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: '¿Tu yes el del partíu nuevu? Llegóme’l vuestru argumentariu: Dani metióme nel grupu ensin querer. Léolo a les cinco, cola primer fornada.' },
      { speaker: 'Marisa', text: 'El mio sobrín reparte y nun tien ónde parar. Trenta y cuatro años, nel so cuartu de neñu. Y el terceru lleva zarráu dende lo de la llei. ¿Per ónde entames?', choices: [
        { text: 'Por escuchate. ¿Qué te quita’l suañu?', memory: 'listened', response: '¿A mi? La paciencia. La cita de mio ma ye pa dientro de meses, y la espera, al sol.' },
        { text: 'Por too: solombra, aparcamientu y un pisu pal to sobrín.', memory: 'promisedBoth', response: 'Eso na tele llámase «paquete integral de midíes». Equí, «yá veremos». Apúntolo na llibreta.' },
        { text: 'Por facer ruíu: un festival que nos ponga nel mapa.', memory: 'spectacle', response: '¿Nel mapa? Si salimos en toles webs de pisos turísticos: «auténticu barriu de toa la vida». Lo único de toa la vida que queda soi yo, y zarro a les dos.' },
      ] },
      { speaker: 'Marisa', text: 'Ehí tienes el tablón. Da pa una cosa. Una. Y nel atril, nada de «poner en valor» nin «fueya de ruta». Si lo dices, tírote una boroña.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Prometísteme solombra, aparcamientu y pisu pal mio sobrín. Tres coses y denguna fecha. Páxina doce de la llibreta.'
        : m.listened ? 'Enantes escuchásteme. Paez poco, pero los que vienen col discursu plastificáu nun lleventen la vista del papel.'
        : m.spectacle ? 'Lo del festival oyólo tol barriu. Los del primeru yá entruguen si los tapones van nel programa o nun real decretu.'
        : 'Yá baxasti del caxón. Tremábente les piernes menos qu’al del añu pasáu. Y el del añu pasáu traía autobús de simpatizantes.';
      const coherent = {
        shade: 'Dixisti que quites coches pa poner solombra. El mio sobrín yá nun te fala; mio ma yá te defende. Escoyisti. Yá yera hora.',
        parking: 'Escoyisti la furgoneta enantes que los árboles. El mio sobrín convídate a un culín. Yo, n’agostu, mándote a mio ma a esperar el bus al to salón.',
        festival: 'Cultura hasta les doce y ruíu con horariu. Polo menos nun lo llamasti «dinamización del espaciu públicu».',
        housing: 'Dixisti «construir» y «tarda». Nun atril eso nun s’oye: óyese «tope» y «yá». El mio sobrín diz que ye la primer vez que-y esplicen por qué nun hai pisos.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'Nun toi d’alcuerdu en too. Pero dixisti lo que cuesta. Eso, nun atril, ye casi exóticu.')
        : speech.picks?.[1] === 'everything' ? 'Árboles, aparcamientu, festivales y pisos per decretu. Fíu, eso nun ye un programa: ye un decretu ómnibus.'
        : 'El tablón dicía una cosa y tu otra. Na tele llámenlo «matizar». Equí, «camudar d’idea ente’l pan y l’autobús».';
      const closing = m.pacoLucia ? 'Díxome Paco que-y consiguisti camarera. Eso nun sal en dengún argumentariu. Sal na cola del pan, que ye onde se vota.'
        : (speech.reach || 0) >= 12 ? 'Dani diz que’l vídeo viéronlu miles. Equí viéronlu doce. Y los doce tán empadronaos. Tu verás a quién-y fales.'
        : 'Bueno. Yá tienes partíu, equipu y una señora vixilándote. Agora sí que tas en política.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Seis silles. La séptima ye la mía y nun entra na negociación».' : s.memories.pacoLucia ? 'Paco: «La moza yá sabe más de tortiella que yo. Esto queda ente nós».' : 'Paco: «Mira, dígote una cosa: cuánto cuesta. Y si nun lo sabes, que nun lo sabes».',
      lines: [
        { speaker: 'Paco', text: 'Paco, chigre La Última. Equí zárrense más pactos que nel Congresu, y toos se paguen a escote. ¿Qué te pongo?', choices: [
          { text: '¿Qué-y pidiríes tu a un partíu nuevu?', memory: 'pacoHeard', response: 'Mira, dígote una cosa: que diga cuánto cuesta. Y si nun lo sabe, «nun lo sé». Na tele enxamás lo oí. Diba ser tendencia, como diz la mio sobrina.' },
          { text: '¿Préstesnos silles pal actu?', memory: 'chairs', response: 'Seis. Ye un préstamu, non una subvención: vuelven al so sitiu y vuelven llimpies.' },
          { text: '¿Cómo va’l negociu?', memory: 'pacoRent', response: 'Xubiéronme’l llocal, la lluz y el café. Agora ún na tele quier topar el preciu del café. Pues voi poner «café de temporada». Como colos pisos.' },
        ] },
        { speaker: 'Paco', text: 'Y mira esi cartel: «Búscase camareru». Lleva colgáu dende Selmana Santa. Yá tien más antigüedá que la mio cafetera.', choices: [
          { text: '¿Probasti a pagar más?', memory: 'pacoWages', response: 'Sí. Xubo’l café diez céntimos y cáeme una reseña: «atracu». Si me lu xubiera Facienda, llamaríase «redistribuir».' },
          { text: 'Ye que los mozos yá nun quieren trabayar.', memory: 'pacoBlame', response: 'Eso dicía yo, hasta que vieno ún con tres currículos y una entruga: «¿y ónde vivo?». Colo que pago, nel almacén de les silles. Nun volvió.' },
          { text: 'Lucía, la estudiante de la fonte, busca daqué pa los fines de selmana.', memory: 'pacoLucia', response: '¿La de los apuntes en cuatro colores? Que venga. Contratu per escritu y tortiella de la casa. Axuntasti a dos persones ensin crear una mesa de diálogu. Eso ye nuevo.' },
        ] },
        { speaker: 'Paco', text: 'Y agora perdona, que la mesa del fondu pide sidra ensin escanciar a les once la mañana. Esos tienen un programa claru y cúmplenlu.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'El tablón, al llau del árbol. Una propuesta. Si claves dos yá ye un «paquete de midíes», y los paquetes, fíu, siempre los paga daquién.',
        speech: 'Xubi yá al caxón, que s’enfría’l pan y enfríase la xente. Y nada de «poner en valor».',
        video: 'L’argumentariu de güei pon «tonu cercanu». ¿Más cerca? Si te veo dende’l fornu.',
        crisis: 'El vídeo llegóme pel grupu de la parroquia, pel del ximnasiu y pel de la mio cuñada. Cuando llega a la mio cuñada, fíu, yá ye oficial.',
        debate: 'Esta nueche, debate. Si te sento «la mayoría social», tírote una boroña dende la grada.',
        finalPrep: 'Última vuelta. Pásate pela parada del bus: la xente qu’espera tien tiempu y tien quexes. Escucha, qu’ellos yá lleven un ratu falando.',
      }[s.mission] || 'Yo equí, cola mio llibreta. Tu a lo tuyo, que toi mirándote.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Sigo col BOE de güei. Disposición final séptima. Morrió’l mayordomu».', lines: [
        { speaker: 'Lola', text: 'Mientres vos peleáis col vídeo, lleí’l BOE. Un decretu mete pensiones y cambéu d’hora nel mesmu paquete. Lo nuestro ye más pequeño: mírennos les cuentes con lupa.', choices: [
          { text: 'Publícales. Toes.', memory: 'lolaBooks', response: 'Hasta’l tíquet del celo. Si nos pillen, que sea nun redondéu de siete céntimos. Y en documentu aparte, non metíu ente les pensiones.' },
          { text: 'Meyor esperamos a que pase.', memory: 'lolaWait', response: 'Eso nun ministeriu llámase «nun consta». Les crisis nun pasen: archívense. Y daquién les desarchiva la selmana enantes de votar.' },
        ] },
      ] },
      default: { after: 'Lola: «Pestaña nueva: “Coses que nun vamos pagar”. Doce fileres. Denguna diz “se financia sola”».', lines: [
        { speaker: 'Lola', text: 'Abrí la fueya «Campaña_DEFINITIVA_v3». Ingresos: el bote del grupu y cuarenta euros que nos debe Dani. Él llámalo «delda histórica».' },
        { speaker: 'Lola', text: 'Gastos: pizzes, imprenta y una factura de «consultoría de rellatu» firmada pol primu de Dani. ¿Págola?', choices: [
          { text: 'Nin de broma. Too con factura y too publicao.', memory: 'lolaReceipts', response: 'Gracies. Si salimos nes noticies, que sea por aburríos. Tresparencia de verdá, non un portal que se cai el día que lu busques.' },
          { text: 'Págala, que’l primu ye bon rapaz.', memory: 'lolaCousin', response: 'Bon rapaz ye. Apúntotela na pestaña «Axudicaciones a dedu, versión barriu». Yá verás qué bien queda nun filu.' },
          { text: 'Oye, Lola… ¿y tu cómo llegues a fin de mes?', memory: 'lolaRent', response: 'Comparto pisu con dos opositores. Estudien lleis que camuden enantes del exame. Yo pago y ellos resúmenme’l BOE. Por eso toi equí, ¿vale?' },
        ] },
        { speaker: 'Lola', text: 'Venga, a la mesa. Pidíu: barbacoa y cuatro quesos. La de piña propúnxola Dani, pero nun superó’l trámite d’audiencia.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Llevo tres versiones del comunicáu. Les tres empiecen por “Ante les informaciones apaecíes”».', lines: [
        { speaker: 'Dani', text: 'Cuatrocientos comentarios: doscientos bots, cien de mio ma defendiéndote y cien de xente real mui enfadada. El clip xubiólu una canal d’Acabóse La Siesta.', choices: [
          { text: 'Contesta a los de verdá, ún a ún.', memory: 'daniReply', response: 'Ún a ún. Ensin «llamentamos que se pudiera malinterpretar». Pásame café. Si me ves escribir «rellatu», quítame’l móvil.' },
          { text: 'Bloquia a tol mundu y xubi un meme.', memory: 'daniMeme', response: 'Fecho. Agora’l meme tien más comentarios que’l problema. Los asesores llámenlo «camudar el marcu». La mio güela, «escurrir el bultu».' },
        ] },
      ] },
      default: { after: 'Dani: «Toi col argumentariu de mañana. Llevo dos hores dudando ente “apostar por” y “siguir apostando por”».', lines: [
        { speaker: 'Dani', text: 'Mañana sal el to primer argumentariu. Léote: «Frente al ruíu, barriu. Frente al rellatu, fechos. Frente a…». Vale, quedóme un poco frentista.' },
        { speaker: 'Dani', text: 'Grábote esplicando’l programa. ¿Formatu oficial, en manga de camisa paseando per un polígonu, o con filtru y la canción de moda?', choices: [
          { text: 'Ensin filtru y ensin polígonu. Que se vean les oyeres.', memory: 'daniNoFilter', response: 'Valiente. Les oyeres son lo único auténtico que queda n’internet. Pocos likes, pero de xente qu’esiste.' },
          { text: 'Con filtru y cola canción de moda.', memory: 'daniTrend', response: 'Asina me presta. Mañana naide va saber qué propones, pero tol mundu va saber que bailles como un ministru nuna espicha.' },
          { text: '¿Y tu qué tal, con tantos trabayos?', memory: 'daniJobs', response: 'Tres clientes y mio ma entrugando cuándo me faen fixu discontinuu, que a ella suéna-y a fixu. Esto ye lo único que fago de baldre. Y lo único que me presta.' },
        ] },
        { speaker: 'Dani', text: 'Una cosa: l’argumentariu escríbolu yo, pero corríxelu Marisa. Nun sé cómo entró nel grupu. Yá nun m’atrevo a echala.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Toi montando silles. Una plégase sola. Esa nun vota».', lines: [
        { speaker: 'Nico', text: 'Baxó Ernesto, el del terceru. Tien el pisu zarráu dende lo del tope y diz que’l vídeo llámalu especulador. Dempués pidióme que-y riegue les plantes.', choices: [
          { text: 'Invítalu a l’asamblea del portal. Que dea la so versión.', memory: 'nicoInvite', response: 'Vale. Diz qu’alquilaría si supiera que lu recupera. O seya: él tien un pisu, el sobrín de Marisa non, y en mediu hai una llei. Qué coses.' },
          { text: 'Nin casu. Ye l’enemigu.', memory: 'nicoEnemy', response: '¿Enemigu? Ye Ernesto, del colexu. Débo-y un balón dende sestu. Dani llámalu «gran tenedor» nel argumentariu. Tien un pisu. Heredáu.' },
        ] },
      ] },
      default: { after: 'Nico: «Voi a por más celo. Esti pega cuando quier, como un sociu de Gobiernu».', lines: [
        { speaker: 'Nico', text: 'Pegué cuarenta carteles. Xunto al de Fox había un caballu de verdá, en doble fila. Pegué-y ún tamién. Nun protestó. Primer sofitu.' },
        { speaker: 'Nico', text: 'Por cierto, la Reme diz que vota a quien-y consiga cita col cardiólogu enantes de Navidá. ¿Qué-y digo?', choices: [
          { text: 'La verdá: qu’eso nun s’arregla nun mes, pero vamos pelealo.', memory: 'nicoTruth', response: 'Dígo-ylo. Va poner la cara que ponen les señores cuando oyen la verdá: pena y respetu, a partes iguales. El votu, yá veremos.' },
          { text: 'Di-y que sí. Cita nuna selmana.', memory: 'nicoPromise', response: 'Prométes-y nuna selmana lo que la llista d’espera tarda mediu añu. N’avientu, la Reme recuérdatelo. Col bastón.' },
          { text: 'Que venga a l’asamblea del portal y nos lo cuente a toos.', memory: 'nicoAssembly', response: 'Bona idea. Los del bloque lleven años quexándose cada ún nel so rellanu. Xuntos son una xunta de vecinos: una investidura, pero con derrama.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemátiques
  cinematics: {
    intro: {
      banner: ['CAPÍTULU 1', 'Pues me presento'],
      tv: { headline: '¡ELEICIONES!', ticker: 'ÚLTIMA HORA · DISOLUCIÓN DE LES CORTES · COMPARECENCIA ENSIN ENTRUGUES' },
      subs: [
        [null, 'Domingu, 23:47. «Un vídeo más y déxolo».'],
        ['Presentadora (TV)', 'Última hora: el Gobiernu disuelve les Cortes y convoca xenerales. La presidenta comparez ensin entrugues: «les rempuestes yá tán na web».'],
        ['Presentadora (TV)', 'Los partíos de siempre yá graben vídeos en manga de camisa. Ún llegó a caballu. Siguiremos informando. O non.'],
        [null, 'BZZZ. Cuarenta y tres mensaxes. «¿Y si nos presentamos?». «jajaja». «Non, en serio».'],
        ['Tú', '¿Eleiciones? ¿Otra vez? …A ver qué diz el grupu.'],
      ],
      toast: 'El móvil nun para de vibrar. Ta na mesina, xunto al sofá.',
    },
    plaza: {
      banner: ['EL BARRIU', 'Baxar a la cai'],
      subs: [
        [null, 'La plaza: panadería, chigre, un bancu al sol y más opiniones per metru cuadráu qu’un platón.'],
        ['Marisa', '¡Mira, el del partíu nuevu! Ven, que tengo que contate.'],
        ['Paco', 'Si vas salvar el barriu, que sea dempués del café. Y el café págase, que nun ye una midida.'],
      ],
    },
    hq: {
      banner: ['CAPÍTULU 2', 'La sede ye’l mio salón'],
      subs: [
        [null, 'La sede: un salón, una mesa plegable y dos enchufes. Ún funciona. L’otru, «en tramitación».'],
        ['Lola', 'Bienveníos a la sede. El sofá ye la sala de prensa; la nevera, la tesorería. Auditada.'],
        ['Dani', 'Llamé al wifi «Gabinete». Yá tenemos estructura.'],
        ['Nico', 'Orde del día: ún, silles. Dos, quién trai xelu. Tres, España.'],
      ],
    },
    hall: {
      banner: ['CAPÍTULU 5', 'El debate del salón'],
      subs: [
        [null, 'Salón multiusos. Güei: debate. Mañana: zumba. A güeyu, la diferencia ye pequeña.'],
        ['moderator', 'Bones nueches. Dellos atriles, un cronómetru y una xarra d’agua que naide va abrir. Primer bloque: vivienda.'],
        ['tech', 'Vengo con sentíu común. Y con paciencia. Sobre too con paciencia: llevamos años esperando a que nos toque.'],
        ['populist', 'Frente a la ola reaccionaria, avanzamos. Na direición que toque esta nueche.'],
      ],
    },
    victory: {
      banner: ['NUECHE ELECTORAL', '¡Victoria!'],
      verdict: '¡SUPERA’L 48!',
      subs: [
        ['Periodista', 'Col cien por cien escrutao, toos los partíos dicen que ganaron. Per una vez, ún tien razón.'],
        ['Tú', '¿Ganamos…? ¿Ensin argumentariu?'],
        ['Ana', '¡Discursu! ¡Pero curtiu, que Marisa abre a les cinco!'],
      ],
    },
    defeat: {
      verdict: 'NUN LLEGA AL 48',
      subs: [
        ['Periodista', '…y la candidatura del barriu queda fuera. Tolos demás, eso sí, aseguren que ganaron.'],
        ['Tú', 'Dani diz que ye «un resultáu que nos permite siguir construyendo».'],
        ['Berto', 'Marisa yá lo tradució: «perdiestis, fíu». Oye, la próxima vótote. Si me lo recuerdes.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantalles de campaña
  flow: {
    hq: {
      eyebrow: 'CAPÍTULU 2 · LA SEDE YE’L MIO SALÓN', title: 'Comité de direición: tres persones y un sofá.',
      intro: state => `Argumentariu de les 7:00: «Priorizar exes estratéxicos». Rempuesta de Marisa nel grupu: «Escoyéi una cosa». Hai tiempu pa una prioridá de verdá; lo demás, al grupu, onde muerren les idees.${state.memories.nicoAssembly ? ' Nico yá pegó nel portal un avisu d’asamblea.' : ''}`,
      choices: {
        accounts: { title: 'Lola revisa cada costu', flavor: 'Presupuestu a la vista, hasta’l tíquet del celo. Nin una llinia d’«otros gastos». Menos tiempu pa redes' },
        street: { title: 'Nico organiza puerta a puerta', flavor: 'Rellanu a rellanu, cola escusa de la derrama del ascensor. Ensin tableta nin encuesta: con timbre' },
        content: { title: 'Dani monta un gabinete pequeñu', flavor: 'Aru de lluz, croma de sábana verde y una paré cola pallabra RELLATU en pósits' },
        tenants: { title: 'Asamblea de vecinos nel portal', flavor: 'Baxa xente que nun se falaba dende lo de les humedaes. Ernesto, el del pisu zarráu, tamién. Naide recueye les silles' },
      },
    },
    video: {
      eyebrow: 'CAPÍTULU 4 · FAILO VIRAL', title: 'La marca ta puesta. Falta’l mensaxe.',
      intro: state => { const m = state.memories; return `Argumentariu de les 7:00: «Tonu cercanu, mensaxe claru». Marisa: «Fala como fales». Dani calcula tres segundos enantes de que eslicen el deu. L’algame abre puertes; la xente estrema atención de sofitu.${m.daniNoFilter ? ' Güei, ensin filtru.' : m.daniTrend ? ' Dani yá escoyó la canción. Nun entrugues.' : ''}`; },
      choices: {
        explain: { title: 'Esplicar la propuesta y lo que cuesta', flavor: 'Un minutu, planu fixu y una pizarra de Lola cola lletra pequeña en grande' },
        chairs: { title: 'El baille de les silles de Paco', flavor: 'Coreografía con silles emprestaes. Naide sabe qué propones; tol mundu sabe que te caes nel segundu once' },
        neighbor: { title: 'Dexar falar a Marisa', flavor: 'Ella fala de la calor, del llocal que-y xubieron y de la cita de so ma. Tu suxetes el móvil y cálleste' },
        debunk: { title: 'Desmontar el bulu del día', flavor: 'Una canal d’Acabóse La Siesta diz que quies prohibir les terraces. Desmiénteslo col planu enteru, que ye l’arma secreta' },
      },
    },
    crisis: {
      eyebrow: 'CAPÍTULU 5 · CRISIS',
      title: (state, ctx) => ctx.contradiction ? 'El to «too pa toos» llegó enantes que la prensa.' : 'Un vídeo recortáu llegó enantes que la verdá.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Daquién xubió’l momentu en que lo prometíes too a la vez. Música de tráiler, títulu en mayúscules y un rótulu: «MARISA TRADÚZLO». Ella nun foi. Pero suscríbelo.'
        : 'Circula un clip de nueve segundos cortáu xusto enantes de qu’esplicares el costu. Sobrevivo compártelu con «Esto ye lo que hai detrás». Paciente, con «Ensin comentarios». Que ye un comentariu.'}${state.memories.nicoPromise ? ' Y la Reme llamó: sigue ensin cita.' : ''} Previsión actual: <b>${ctx.forecast.score}/100</b>. Faen falta ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Dar la cara: reconocer l’error y correxilu', flavor: 'Vídeo ensin música y ensin «sacóse de contestu». Con entrugues, que yá ye casi escándalu' },
        team: { title: 'Publicar costos y responsables', flavor: 'Lola xube les cuentes; Nico, quién fai qué. Aburrío, comprobable y difícil de recortar' },
        distract: { title: 'Sortear una freidora d’aire', flavor: 'Pa participar: siguir la cuenta, mentar a tres collacios y escaecer el tema. Nos manuales, «marcar axenda propia»' },
        blame: { title: 'Echar la culpa a la máquina del barru', flavor: 'Bots, algoritmu y «les cloaques». Funciona colos tuyos. Los demás reconocen el trucu: úsenlu tolos partíos' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTULU 5 · EL DEBATE', title: 'Tres rivales, una moderadora y una xarra ensin abrir.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `A un llau, ${populist.name}, de ${populist.party}, con dos argumentarios: el de la mañana y el de la tarde. Al otru, ${tech.name}, de ${tech.party}, que promete derogar coses que nun nomba. Al fondu, ${hard?.name || 'Covadonga del Muro'}, de Fox, qu’intentó entrar a caballu. ${moderator}: «¿A qué renuncia’l so programa?».`,
      choices: {
        tradeoff: { title: 'Defender la renuncia concreta', flavor: (state, { rivals }) => `Dices qué pierdes y a quién molestes. ${rivals.tech.name} pide «un datu». Dás-ylu. Apúntalu pa derogalu` },
        attack: { title: (state, { rivals }) => `Sacar la hemeroteca a ${rivals.populist.name}`, flavor: 'Llees-y lo que dixo hai dos campañes. Aplausu fácil, titular fácil, cero propuestes. Ella: «Rectificar ye de sabios»' },
        manage: { title: 'Dar turnos y desmontar cifres con calma', flavor: (state, { rivals }) => `${rivals.tech.name} promete baxar impuestos «a partir del segundu añu, si la herencia lo permite». Entrugues de qué añu. Silenciu. Agua` },
        promise: { title: 'Prometer topar l’alquiler a la metá «per decretu»', flavor: (state, { rivals }) => `El públicu aplaude. ${rivals.populist.name} mírate con envidia profesional. ${rivals.moderator}: «Queda dicho»` },
      },
    },
    finalPrep: {
      eyebrow: 'CAPÍTULU 6 · ÚLTIMA VUELTA', title: 'Entá queda marxe.',
      intro: (state, ctx) => `Previsión: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'per enriba' : 'per debaxo'} del umbral). Queden dos díes. El sondéu oficial davos «alredor de cero»; acierta siempre a favor de quien lu encarga. Argumentariu: «Movilizar el votu útil». Marisa: «Que vaya la xente». Namás hai tiempu pa una cosa bien fecha.`,
      choices: {
        listen: { title: 'Visitar a los que entá duden', flavor: state => `La parada del bus, la cola del centru de salú y la señora del bolsu, que yá conoz al que-y lu robó: coinciden cada mes nel xulgáu${state.memories.nicoAssembly || state.memories.nicoInvite ? '. L’asamblea del portal pídete que vuelvas' : ''}. Escuches más de lo que fales` },
        receipts: { title: 'Publicar el presupuestu definitivu', flavor: 'Lola imprímelu n’A3: «la tresparencia tamién ye tamañu de fonte». Ensin anexos que salgan n’agostu' },
        volunteers: { title: 'Ordenar voluntarios y colexos', flavor: state => `Nico reparte turnos, bocadiellos y un mapa de colexos dibuxáu nuna servilleta${state.memories.pacoLucia ? '. Lucía, la camarera de Paco, apúntase d’interventora' : ''}. Ensin autobuses de simpatizantes: col de llinia` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTULU 6 · L’ÚLTIMU MITIN', title: 'Una frase enantes de la xornada de reflexón.',
      intro: 'Silles plegables, un globu que se desinfla y una periodista del diariu llocal con cara de tercer mitin güei. Nos otros zarres hai autobuses y banderes; equí, el del butanu. Consolida lo aprendío o vuelve prometelo too.',
      choices: {
        account: {
          title: state => ({
            shade: '“Va haber solombra y va haber menos coches. Esto escoyemos, esto cuesta y equí vamos responder.”',
            parking: '“El barriu va poder trabayar, anque esti branu siga ensin árboles. Esto escoyemos y equí vamos responder.”',
            festival: '“Va haber cultura y va haber ruíu pactáu. Esto escoyemos, esto cuesta y equí vamos responder.”',
            housing: '“Va haber más pisos porque los vamos construir, non porque los anunciemos. Va tardar. Y equí vamos responder.”',
          }[state.proposal] || '“Esto escoyemos, esto cuesta y equí vamos responder.”'),
          flavor: 'Díceslo ensin papeles. Marisa abre la llibreta y, per primer vez, nun apunta nada',
        },
        viral: { title: '“¡Menos atascu y más gazpachu!”', flavor: 'Dani emítelo en directu. Corease. Naide sabe qué significa. A les doce yá lo copiaron tres partíos' },
        everything: { title: '“Mañana va haber de too pa toos, per decretu.”', flavor: (state, { rivals }) => `Aplausu enorme. Lola tápase la cara col presupuestu. ${rivals.populist.name} escríbete: «¿Falamos?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'NUECHE ELECTORAL · VICTORIA', title: 'Hai más silles que persones.',
      text: state => `Marisa aplaude una vez. Lola entruga quién guardó les factures. Paciente y Sobrevivo yá llamaron dos veces: «¿Qué ufrís?». A les 7:00 llega l’últimu argumentariu de Dani: «Ganamos». Marisa contesta: «Esto entiéndolo». ${{
        shade: 'Mañana entama lo difícil: esplica-y a la furgoneta del sobrín ónde aparca.',
        parking: 'Mañana entama lo difícil: el primer agostu ensin árboles col to nome na placa.',
        festival: 'Mañana entama lo difícil: la primer reunión colos del primeru, que yá te traxeron tapones.',
        housing: 'Mañana entama lo difícil: la primer llicencia. Ernesto entruga si pue alquilar el terceru enantes de que s’acabe la llexislatura.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NUECHE ELECTORAL · DERROTA', title: 'Un resultáu que nos permite siguir construyendo.',
      reasons: {
        support: 'Faltó sofitu direutu: el barriu vióte más nel móvil que nel rellanu.',
        credibility: 'Pesaron les contradicciones: na cola del pan nun hai hemeroteca, pero hai memoria.',
        organization: 'L’equipu llegó desordenáu: un colexu ensin interventor y otru con tres.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minixuegos
  minigames: {
    viral: {
      eyebrow: 'MINIXUEGU · FAILO VIRAL', title: 'Grabando na marca.', goWord: '¡Aición!',
      lanes: ['Saludu', '¡Arriba!', 'Palmes', 'Nun consta'],
      takes: {
        explain: 'Pizarra de Lola, planu fixu y cada xestu subraya un costu.',
        chairs: 'El baille de les silles. Paco mira colos brazos cruciaos.',
        neighbor: 'Marisa fala de la calor; tu, detrás, marques el ritmu ensin que se note. Nótase.',
        debunk: 'Desmontes el bulu con xestos claros: esto non, esto sí, esto cuesta.',
      },
      intro: (state, ctx) => `Móvil nel trípode, vecinos mirando y Dani contando. ${ctx.take} Fai cada pose cuando’l so iconu llegue al círculu. El ritmu suma algame, non votos.`,
      titles: { great: '¡Viral! Sumandos yá te ufrió ser un pétalu.', ok: 'Compártese en tres grupos de WhatsApp. Ún ye’l de to ma.', bad: 'Cuarenta visualizaciones. Dani llámalo «impactu cualitativu».' },
      texts: { ok: 'Dani yá pon subtítulos en mariellu. La toma val: l’algame abre puertes, pero los votos gánense nel portal.', bad: 'Perdístite ente’l saludu y les palmes. Repite la toma: de momentu, «nun consta».' },
    },
    duel: {
      eyebrow: 'MINIXUEGU · DUELU DE RÉPLIQUES', title: 'Cinco entrugues, un cronómetru.',
      intro: (state, ctx) => `${ctx.rounds} répliques. Escueyi la rempuesta que defiende daqué concreto y asume’l so costu enantes de que s’acabe’l tiempu. A la metá, daquién va interrumpite: pidi la pallabra.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'A quien aparca en doble fila y a dos meses de la terraza de Paco. Solombra a cambéu de coches, dicho a les clares.',
          parking: 'Al bancu al sol: esti branu va siguir ensin árboles. Escoyemos que’l barriu pueda trabayar.',
          festival: 'A los del primeru, dos nueches per selmana. Con horariu pactáu y tapones de regalu, lliteralmente.',
          housing: 'A la plaza, que sigue ensin solombra, y a la nuestra paciencia: construir tarda más qu’una llexislatura. Y van llamanos «los de los caseros».',
        }[state.proposal];
        return [
          { topic: 'Vivienda', role: 'populist', claim: 'Gracies a la nuestra llei, nes zones tensionaes l’alquiler estabilizóse. Los pisos que falten escuéndelos la especulación.',
            options: ['Si ta «estabilizáu», ¿por qué’l terceru lleva un añu zarráu? Topar nun fai pisos. Construir sí, anque tarde más qu’un titular.', '¡Pues nosotros topámoslu a la metá! ¡Y el pan!', 'Usté lleva una chapa de colores. Sábelo tol barriu.'], correct: 0 },
          { topic: 'Datos', role: 'tech', claim: 'Según un informe que nun traxi, la so propuesta va afundir el barriu. Dizlo esta gráfica. La de la flecha colorada.',
            options: ['Y según el mio, la so gráfica ye un bulu. Empate téunicu.', 'Bueno, los datos son relativos. Como les encuestes.', 'Amuese la fonte. La nuestra: el presupuestu de Lola, páxina dos, con foto del bancu a les cinco la tarde.'], correct: 2 },
          { topic: 'La so propuesta', role: 'moderator', claim: 'Entruga direuta: ¿a quién perxudica la so propuesta? Minutu d’oru. Bueno, diez segundos de bronce.',
            options: ['A naide. Ye una propuesta tresversal, ensin perdedores, como un anunciu de colonia.', cost || 'A daquién, seguro. Dirémoslo con nome y apellíos cuando lo sepamos.', 'A los de siempre, que yá saben quién son.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'La promesa', role: 'populist', claim: '¡Usté prometió-y a una panadera solombra, aparcamientu y un pisu pal so sobrín! Eso ye populismu. Y dígolo con conocimientu de causa.',
                options: ['Ye verdá. Equivoquéme al prometelo too; dempués escoyimos una cosa y esplicamos lo que cuesta.', 'Sacóse de contestu. El contestu yera yo prometiéndolo too.', 'Usté tamién lo promete too. Empate.'], correct: 0 }
            : { topic: 'Sanidá', role: 'tech', claim: '¿Y la sanidá? ¿O a usté namás-y importa la so plaza? Nosotros vamos xestionar. Muncho. Con xestión.',
                options: ['Prometo que mañana nun hai llistes d’espera. Pallabra.', 'Impórtanos. Por eso nun prometemos lo que nun xestionamos: vamos llevar la cita de la Reme al plenu, con nome y fecha.', 'Vamos derogalo too, como usté. Yá veremos qué.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: '¡Perdone! Eso ye de la máquina del barru. Dígolo ensin oyelo enteru.',
        tech: 'Si me permite… como dicía esta mañana un periódicu… lléo-ylo enteru…',
        moderator: 'Quéden-y diez segundos. Nueve. Queda dicho.',
        fallback: '¡Perdone, perdone!',
      },
      floor: 'Déxeme acabar, qu’esto nun ye una rueda de prensa.',
      floorBabble: 'Déxeme acabar',
      reactions: {
        timeout: 'Acabóse’l tiempu. Queda dicho. Bloque siguiente.',
        quick: 'Rempuesta concreta y en tiempu. Inusual. Tomo nota.',
        slow: 'Concreta, anque xustina de tiempu.',
        wrong: 'Gracies por dame la razón. Voi ponelo nel argumentariu.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} asiente. Y nun diz «queda dicho».`, mid: 'Aguantasti’l tipu. Ensin chuleta.', low: 'Mañana los rivales van dicir que ganaron. Güei, con motivu.' },
      text: 'La estratexa qu’escoyisti marca’l debate; les répliques deciden si se te cree.',
    },
    chairs: {
      eyebrow: 'MINIXUEGU · SEIS SILLES', title: 'Préstamu, non subvención.',
      intro: (state, ctx) => `Pa l’última asamblea faen falta les seis silles de Paco, esparnaes pel barriu. Pasa per enriba d’una pa coyela y llévala al corru. Una a una: «l’espalda tamién vota», diz Nico. Tienes ${ctx.time} segundos.`,
      hints: {
        start: 'Pasa per enriba d’una silla pa coyela.',
        carry: 'Agora, al corru mariellu.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. A por la siguiente.`,
        full: '¡Corru completu!',
      },
      titles: { all: 'Seis silles nel corru. Paco, conforme.', mid: 'Mediu corru. El restu, de pies y opinando.', low: 'Paco recueye les silles él mesmu. Y coméntalo.' },
      texts: { all: 'Nico apunta’l tiempu na servilleta. Organizar ye esto: que haya sitiu cuando llega la xente.', other: 'Les que falten siguen pela plaza. Repite: naide vio nada, sacante Paco.' },
    },
    rally: {
      eyebrow: 'MINIXUEGU · L’ÚLTIMU MITIN', title: 'Que nun se te vaya la sala.', goWord: '¡Fala!', lane: 'Remata la frase',
      intro: 'Cada frase tien un remate. Calca cuando la pallabra llegue al círculu: el públicu aplaude y l’atención xube. Si falles, daquién mira’l móvil. O peor: abuchea.',
      phrases: state => {
        const own = {
          shade: ['Esti branu, la plaza va tener', 'SOLOMBRA'], parking: ['El que trabaya nesti barriu va poder', 'DESCARGAR'],
          festival: ['Los guajes van tener llocal y la plaza,', 'CULTURA'], housing: ['Los pisos nun s’anuncien: hai que', 'CONSTRUILOS'],
        }[state.proposal] || ['Una cosa bien fecha, pa', 'ENTAMAR'];
        return [
          ['Bones nueches. Gracies por venir ensin autobús y con', 'SILLA'],
          ['Nun vengo con argumentariu: vengo con', 'UNA COSA'],
          own,
          ['Y sí: tien un costu. Punxímoslu per', 'ESCRITU'],
          ['Ensin observatoriu, ensin comisión y ensin', 'LOGO'],
          ['Naide equí vos dixo qu’esto se paga', 'SOLO'],
          ['Si nun cumplimos, yá sabéis ónde ta la', 'PANADERÍA'],
          ['Esta nueche Marisa nun tien nada que', 'TRADUCIR'],
          ['El domingu nun vos pido fe: pídovos que', 'VOTÉIS'],
          ['A quien queráis. Pero que nun decida’l', 'SOFÁ'],
          ['Gracies, barriu. Y agora, les silles, onde', 'PACO'],
          ['¡Pues', 'PRESÉNTOME!'],
        ];
      },
      titles: { great: 'La sala en pie. Los que tienen silla, tamién.', ok: 'Aplausos sinceros y dalgún bocexu.', bad: 'Sintióse un móvil. Yera l’argumentariu.' },
      text: 'El públicu va alcordase de cómo lo dixisti; la decisión que tomasti decide de qué s’alcuerda.',
    },
  },
};
