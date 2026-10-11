// Guion · Aragonés (an). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte cae en: es.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
// Ortografía: Academia Aragonesa d'a Luenga (2023). Cadenas entre comillas dobles por los apóstrofos.
// Running gags adaptados: «sillas» → «cadieras», Marisa dice «pichón» (no «cariño»), el gazpacho se queda.

const PROPOSAL_DEFAULT = "Una cosa bien feita, ta encomenzar.";

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: "Fermín Aguardo", party: "Partiu Pacient" },
    populist: { name: "Nuria Giro", party: "Partiu Sobrevivo Unatra Elección" },
    hard: { name: "Covadonga del Muro", party: "Fox" },
    moderator: "Maite Escaleta",
  },

  foxDebate: {
    hallLine: "He deixau o caballo en doble ringlera. Si se lo levan, ye ideolochía.",
    interruption: "Excuse me! Sin complexos: u me deixa charrar u me levanto y me'n voi. Tiengo práctica salindo de gubiernos.",
    round: {
      topic: "Seguranza", role: "hard",
      claim: "A o que le roba o bolso a la sinyora d'a parada l'han deteniu onze vegadas. Onze. Y o Gubierno, en cuenta de chueces, ubre un observatorio. ¿Vusté qué faría?",
      options: [
        "Que reincidir no salga de baldes: chuicio rápido y que no salga por a mesma puerta o mesmo día. Y chueces, que cuestan diners. Lo dicimos.",
        "¡Man dura! ¡Y un caballo por barrio!",
        "Charremos d'as causas. D'as onze.",
      ],
      correct: 0,
    },
    reactions: {
      right: "Ome. Ixo no ye de dreteta cobarde. Por ista vegada.",
      wrong: "¿Lo veye? Sin complexos se piensa más rápido. Le presto o caballo.",
      timeout: "Mientres vusté piensa, a Espanya que madruga ya s'ha chitau.",
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: "ELECCIONS CHENERALS · ARGUMENTARIO INCLUYIU",
    tagline: "Os atros partius tienen asesors. Tu tiens una fornera que traduz.",
  },

  chapters: ["Pues me presento", "A sede ye o mío salón", "Baixar ta la carrera", "Fe-lo viral", "S'ha sacau de contexto", "O zaguer mitin"],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: "Comparecencia en o sofá", objective: "Amana-te ta o móbil, chunto a lo sofá. Preta E." },
    call: { title: "Ronda de consultas", objective: "Usa o portátil d'a mesa ta clamar a los tuyos amigos." },
    register: { title: "Constituius a totz os efectos", objective: "Ves ta la carpeta de l'escritorio y rechistra o partiu." },
    leave: { title: "Presa de contacto con a realidat", objective: "Sal por a puerta verde ta baixar ta la plaza." },
    neighbor: { title: "Proceso d'escuita (de verdat)", objective: "Charra con Marisa, chunto a lo toldo d'o forno. Paco, en a terraza d'o bar, tamién tiene cosas que contar." },
    program: { title: "No bi cabe tot en un decreto", objective: "Tría a tuya primera propuesta en o tablón d'a plaza." },
    speech: { title: "Primera comparecencia, con público", objective: "Puya ta lo punto de l'atril y fe o tuyo primer discurso." },
    aftermath: { title: "A cola d'o pan fa l'análisi", objective: "Torna con Marisa ta saber qué se comenta en a cola d'o pan." },
    hqBrief: { title: "A sede ye o mío salón", objective: "Achunta l'equipo en a mesa de campanya. Lola, Dani y Nico tamién quieren charrar con tu." },
    video: { title: "Fe-lo viral (y con mensache, si se puede)", objective: "Graba un vídeo en a marca chunto a lo forno." },
    crisis: { title: "Ixo no ye exactament o que he dito", objective: "Fe-le frent a la crisis en o tablón. Antes, igual conviene sentir a l'equipo." },
    debate: { title: "O debate d'o salón", objective: "Dentra en o debate con os rivals." },
    finalPrep: { title: "Zaguera vuelta por o barrio", objective: "Tría en o mapa an concentrar o zaguer esfuerzo." },
    finalSpeech: { title: "O zaguer mitin, sin autobuses", objective: "Zarra a campanya debant d'o público." },
    election: { title: "A nueit d'as cadieras", objective: "Consulta o resultau electoral." },
    complete: { title: "Campanya completada", objective: "A campanya ha rematau." },
  },

  travel: {
    hqBrief: { title: "Desplazamiento institucional", objective: "A sede ye en o baixo d'o portal de chunto a lo bar de Paco. Ves ta la puerta y preta E.", prompt: "Portal · Dentrar en a sede", loading: "DENTRANDO EN A SEDE…", sign: "SEDE" },
    video: { title: "Salir a medios (a la plaza)", objective: "Ta grabar fa falta luz y vecinos. Sal por a puerta d'a sede y baixa ta la plaza.", prompt: "Puerta · Baixar ta la plaza", loading: "BAIXANDO TA LA PLAZA…", sign: "PLAZA" },
    crisis: { title: "Reunión d'urchencia, con tupper", objective: "Bella cosa crema en o grupo d'a sede. Torna por o portal chunto a lo bar.", prompt: "Portal · Tornar ta la sede", loading: "PUYANDO TA LA SEDE A TOT CORRER…", sign: "SEDE" },
    debate: { title: "Treslado ta lo salón multiusos", objective: "Sal por a puerta d'a sede. En o salón multiusos ya han parau os atrils.", prompt: "Puerta · Ir ta lo salón multiusos", loading: "DE CAMINO TA LO SALÓN MULTIUSOS…", sign: "SALÓN" },
    finalPrep: { title: "Pisar territorio", objective: "Sal d'o salón por a puerta doble. Queda una semana y se gana en a carrera.", prompt: "Puerta · Tornar ta la plaza", loading: "TORNANDO TA LO BARRIO…", sign: "PLAZA" },
    finalSpeech: { title: "Transporte público, como o votant meyo", objective: "Ves ta la parada chunto a lo quiosco y agarra o 27 dica o salón multiusos.", prompt: "Parada · Agarrar o 27 ta lo salón", loading: "O 27 PLEGA. TARDI, PERO PLEGA…", sign: "BUS 27" },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: "Solombra antes que un observatorio d'a calorina", cost: "2 de presupuesto", benefit: "Árbols, toldos, una fuent que funcione y o baixo vuedo d'o cantón como sala fresca ta la chent gran. Sin plan director: con chardinero.", compromise: "Se pierden plazas d'aparcamiento, a terraza de Paco encoge dos mesas y o sobrino de Marisa torna a la doble ringlera." },
    parking: { title: "Que o barrio pueda treballar", cost: "2 de presupuesto", benefit: "Carga y descarga con horario, plazas rotatorias ta o comercio, aparcabicis ta repartidors y licencias de terraza en días, no en trimestres.", compromise: "Más coches en a plaza y unatro agosto a pleno sol. O banco seguirá bullindo." },
    festival: { title: "Cultura dimpués d'as ueito", cost: "2 de presupuesto", benefit: "Escenario ta grupos d'o barrio, cine d'estiu y un local d'ensayo que chestiona l'asociación de vecinos, no una fundación con logo.", compromise: "Roido dos nueitz por semana; os d'o primero, con tapons. A solombra y a carga y descarga, a lo caixón." },
    housing: { title: "Que o tercero torne a tener vecinos", cost: "2 de presupuesto", benefit: "Licencias en semanas, construir en o solar d'o cantón y que alquilar un piso zarrau no faiga miedo.", compromise: "Construir tarda más que anunciar un tope. No sale en o telediario, te dirán «o d'os caseros» y a plaza sigue sin solombra." },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: "Leye o BOE por gusto", line: "Treballo en una chestoría y en o tranvía leyo o BOE como qui leye novela negra: o muerto siempre ye en a disposición adicional. Te levo as cuentas.", choices: [
      { label: "Tresorería. Tu decides cuán ye que no.", reply: "Accepto. Primera norma: aquí cosa no «se financia con creiximiento». Se financia con diners, que ye más aburriu, pero existe." },
      { label: "Estratechia. Que belún se mire a letra chicota.", reply: "Feito. A letra chicota ye an os gubiernos amagan o important. A gran ye ta lo cartel." },
    ] },
    dani: { role: "Charra en filo", line: "Foi vídeos ta una clínica dental y un chimnasio. M'he leyiu totz os filos d'«exasesor de campanya» que existen. Vusatros metetz as ideas; yo tos foi o relato.", choices: [
      { label: "Comunicación. Relato sí, fumo no.", reply: "Trato. Cada maitino a las 7:00, argumentario en o grupo. Curto, claro y sin a parola «resiliencia». Bueno, cuasi sin." },
      { label: "Portavoz. Habrás de contestar preguntas.", reply: "¿Ruedas de prensa con preguntas? Ixo ya no lo fa dengún. Vale: seremos vintage." },
    ] },
    nico: { role: "Conoixe a tot o portal", line: "Foi turnos en un almacén y conoixco a tot o portal. Yo mobilizo. Pero si belún diz «transversal» en una reunión, me'n baixo a buscar pipas.", choices: [
      { label: "Organización. Tu metes os horarios.", reply: "Feito. Reunions de vinte minutos. Si dura más, ye que belún ye leyendo un argumentario." },
      { label: "Actos. Nos fa falta a tuya voz de megáfono.", reply: "Cuan tocó o Gordo en o bar, baixó tota a carrera en zapatiellas. Da-me un motivo asinas y te pleno a plaza." },
    ] },
  },

  call: {
    title: "Ronda de consultas. Por videoclamada.",
    you: "Ha teniu una idea",
    next: "Siguient valient",
    done: "Ya tenemos equipo. Dani ha creyau o grupo «Argumentario 7:00». Y, sin querer, ha metiu a Marisa, a d'o forno.",
    doneBabble: "Ya tenemos equipo.",
    finish: "Baixar ta la plaza",
  },

  register: {
    eyebrow: "FUNDACIÓN · FINESTRETA UNICA",
    title: "Un nombre ta la papereta.",
    stamp: "PENDIENT D'ESMENDAR",
    intro: "Tres campos. Ni certificau dichital, ni cita previa, ni anexo III. Si isto ye un suenyo, que no se dispierte dengún d'o Ministerio.",
    defaultName: "A Chent d'o Banco",
    defaultSlogan: PROPOSAL_DEFAULT,
    submit: "Rechistrar candidatura",
    toast: "RECHISTRAU. Resolviu en cero días hábils. Dengún en a finestreta no sabe cómo ha pasau.",
  },

  program: {
    eyebrow: "PROGRAMA · PRESUPUESTO: 2 CRÉDITOS",
    title: "Priorizar: triar, pero con corbata.",
    intro: "Nomás bi cabe una propuesta. As demás no se «calendarizan» ni s'«aplazan ta una segunda fase»: se quedan sin fer. O barrio sabe destriar.",
    promisedBothNote: "Marisa se'n acuerda: prometiés solombra, aparcamiento y piso ta o suyo sobrino. Garra opción no paga tot ixo. −6 de credibilidat en concretar.",
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Agora, a explicar-lo en l'atril. Con preguntas.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ["Bueno. Pos aquí estamos.", "¿Qué vas a defender?", "A zaguera frase conta."],
    parts: {
      opening: { title: "01 / Trencar o chelo", prompt: "Siet personas. Dos aguardan o bus, una ha baixau a buscar o pan y unatra te graba por si dices «resiliencia».", options: {
        listen: "Antes de charrar, he veniu a escuitar. De verdat, no en «proceso d'escuita».",
        joke: "Seré curto. Lo digo como político, asinas que tos podetz sentar.",
        grand: "¡Hue encetamos una fuella de ruta transversal enta un nuevo horizont de país!",
      } },
      argument: { title: "02 / Dicir bella cosa concreta", prompt: "Agora toca defender o que has clavau en o tablón. Marisa ya ha sacau a libreta.", options: {
        shade: "Solombra y un puesto fresco ta la chent gran, encara que perdamos aparcamiento. Sin plan director: con árbols.",
        parking: "Que qui treballa pueda descargar, encara que a plaza siga sin árbols iste estiu.",
        festival: "Cultura y un local ta los mozez, con horario de roido pactau y por escrito.",
        housing: "Más pisos: suelo, licencias rápidas y que alquilar no faiga miedo. No baixa o luns; baixa construindo.",
        everything: "¡Árbols, aparcamiento, festivals y un piso ta cadaguno, de baldes y en un decreto o luns!",
      } },
      close: { title: "03 / Saber rematar", prompt: "Marisa mira o reloch. Ye un reloch que ha visto muitas campanyas.", options: {
        accountable: "Si no lo cumplimos, nos lo preguntatz aquí. Y responderemos, que ya ye novedat.",
        chant: "¡Menos embozo y más gazpacho!",
        forever: "Ta concluyir, y en favor d'a brevedat, os míos siguients vintisiet exes…",
      } },
    },
    timing: { eyebrow: "04 / DAR-LE O GOLPE FINAL", title: "Agora. Con convicción.", button: "¡Y por ixo me presento!" },
    result: {
      eyebrow: "O BARRIO HA ESCUITAU",
      goodTitle: "Un aplauso. Sin claca.",
      badTitle: "Aplauso de cortesía. En a tele, «buena acollida».",
      coherent: "Has defendiu a tuya propuesta y has dito o que cuesta. En política ixo tiene un nombre raro: dicir a verdat.",
      incoherent: "O tuyo discurso no concuerda con o programa. En a tele lo claman «matizar». En a cola d'o pan, unatra cosa.",
      fine: "L'alcance mide atención, no votos. As consecuencias dependen d'o que has dito.",
      button: "Baixar de l'atril",
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: "Marisa", text: "¿Tu yes o d'o partiu nuevo? M'ha plegau o vuestro argumentario: Dani me metió en o grupo sin querer. Lo leyo a las cinco, con a primera fornada." },
      { speaker: "Marisa", text: "O mío sobrino reparte y no tiene án parar. Trenta y cuatro anyos, en o suyo cuarto de chicot. Y o tercero ye zarrau dende lo d'a lei. ¿Por án encomienzas?", choices: [
        { text: "Por escuitar-te. ¿Qué te quita o suenyo?", memory: "listened", response: "¿A yo? A paciencia. A cita d'a mía mai ye ta d'aquí a meses, y l'aspera, a lo sol." },
        { text: "Por tot: solombra, aparcamiento y un piso ta o tuyo sobrino.", memory: "promisedBoth", response: "Ixo en a tele se clama «paquet integral de medidas». Aquí, «ya veyeremos». Lo apunto en a libreta." },
        { text: "Por fer roido: un festival que nos meta en o mapa.", memory: "spectacle", response: "¿En o mapa? Si salimos en todas as webs de pisos turisticos: «auténtico barrio de tota a vida». O unico de tota a vida que queda soi yo, y zarro a las dos." },
      ] },
      { speaker: "Marisa", text: "Astí tiens o tablón. Da ta una cosa. Una. Y en l'atril, ni «meter en valor» ni «fuella de ruta». Si lo dices, te tiro una barra de pan." },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? "Me prometiés solombra, aparcamiento y piso ta o mío sobrino. Tres cosas y garra calendata. Pachina dotze d'a libreta."
        : m.listened ? "Antes m'has escuitau. Pareix poca cosa, pero os que vienen con o discurso plastificau no levantan os uellos d'o paper."
        : m.spectacle ? "Lo d'o festival lo ha sentiu tot o barrio. Os d'o primero ya preguntan si os tapons van en o programa u en un real decreto."
        : "Ya has baixau d'o caixón. Te tremolaban as garras menos que a lo de l'anyo pasau. Y o de l'anyo pasau traiba autobús de simpatizants.";
      const coherent = {
        shade: "Has dito que quitas coches ta meter solombra. O mío sobrino ya no te charra; a mía mai ya te defiende. Has triau. Ya yera hora.",
        parking: "Has triau a furgoneta antes que os árbols. O mío sobrino te convida a una canya. Yo, en agosto, te ninvio a mía mai a aguardar o bus en o tuyo salón.",
        festival: "Cultura dica las dotze y roido con horario. A lo menos no l'has clamau «dinamización de l'espacio público».",
        housing: "Has dito «construir» y «tarda». En un atril ixo no se siente: se siente «tope» y «ya». O mío sobrino diz que ye a primera vegada que le explican por qué no bi ha pisos.",
      }[state.proposal];
      const result = speech.coherent ? (coherent || "No soi d'acuerdo en tot. Pero has dito qué cuesta. Ixo, en un atril, ye cuasi exótico.")
        : speech.picks?.[1] === "everything" ? "Árbols, aparcamiento, festivals y pisos por decreto. Pichón, ixo no ye un programa: ye un decreto ómnibus."
        : "O tablón diciba una cosa y tu unatra. En a tele lo claman «matizar». Aquí, «cambiar d'idea entre o pan y l'autobús».";
      const closing = m.pacoLucia ? "M'ha dito Paco que l'has trobau camarera. Ixo no sale en garra argumentario. Sale en a cola d'o pan, que ye an se vota."
        : (speech.reach || 0) >= 12 ? "Dani diz que o vídeo l'han visto miles. Aquí l'han visto dotze. Y os dotze son empadronaus. Tu veyerás a qui le charras."
        : "Bueno. Ya tiens partiu, equipo y una sinyora vichilando-te. Agora sí que yes en política.";
      return [{ speaker: "Marisa", text: memory }, { speaker: "Marisa", text: result }, { speaker: "Marisa", text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? "Paco: «Seis cadieras. A setena ye a mía y no dentra en a negociación»." : s.memories.pacoLucia ? "Paco: «A moza ya en sabe más de tortiella que yo. No le'n digas cosa»." : "Paco: «Mía, te digo una cosa: cuánto cuesta. Y si no lo sabes, que no lo sabes».",
      lines: [
        { speaker: "Paco", text: "Paco, bar A Zaguera. Aquí se zarran más pactos que en o Congreso, y totz se pagan a escote. ¿Qué te poso?", choices: [
          { text: "¿Qué le demandarías tu a un partiu nuevo?", memory: "pacoHeard", response: "Mía, te digo una cosa: que diga cuánto cuesta. Y si no lo sabe, «no lo sé». En a tele no lo he sentiu nunca. Sería tendencia, que diz a mía sobrina." },
          { text: "¿Nos emprestas cadieras ta l'acto?", memory: "chairs", response: "Seis. Ye un emprestamo, no una subvención: tornan a lo suyo puesto y tornan limpias." },
          { text: "¿Cómo va o negocio?", memory: "pacoRent", response: "M'han puyau o local, a luz y o café. Agora uno en a tele quiere topar o precio d'o café. Pos meteré «café de temporada». Como con os pisos." },
        ] },
        { speaker: "Paco", text: "Y mía ixe cartel: «Se busca camarero». Leva penchau dende Semana Santa. Ya tiene más antigüedat que a mía cafetera.", choices: [
          { text: "¿Has prebau a pagar más?", memory: "pacoWages", response: "Sí. Puyo o café diez centimos y me cai una resenya: «atraco». Si me lo puyase Hacienda, se clamaría «redistribuir»." },
          { text: "Ye que os choves ya no quieren treballar.", memory: "pacoBlame", response: "Ixo diciba yo, dica que plegó uno con tres currículums y una pregunta: «¿y án vivo?». Con o que pago, en o almacén d'as cadieras. No tornó." },
          { text: "Lucía, a estudiant d'a fuent, busca bella cosa ta los findes.", memory: "pacoLucia", response: "¿A d'os apuntes en cuatro colors? Que venga. Contrato por escrito y tortiella d'a casa. Has achuntau a dos personas sin creyar una mesa de diálogo. Ixo ye nuevo." },
        ] },
        { speaker: "Paco", text: "Y agora perdona, que a mesa d'o fondo demanda sangría a las onze d'o maitín. Ixos tienen un programa claro y lo cumplen." },
      ],
    },

    marisa: s => {
      const text = {
        program: "O tablón, chunto a l'árbol. Una propuesta. Si en claves dos ya ye un «paquet de medidas», y os paquetz, pichón, siempre los paga belún.",
        speech: "Puya ya a lo caixón, que se refreda o pan y se refreda a chent. Y ni se t'ocurra «meter en valor».",
        video: "L'argumentario de hue diz «tono cercano». ¿Más cerca? Si te veigo dende o forno.",
        crisis: "O vídeo m'ha plegau por o grupo d'a parroquia, o d'o chimnasio y o d'a mía cunyada. Cuan plega a la mía cunyada, pichón, ya ye oficial.",
        debate: "Esta nueit, debate. Si te siento «a mayoría social», te tiro una barra de pan dende a grada.",
        finalPrep: "Zaguera vuelta. Pasa-te por a parada d'o bus: a chent que aguarda tiene tiempo y tiene queixas. Escuita, que ells ya levan un rato charrando.",
      }[s.mission] || "Yo aquí, con a mía libreta. Tu a lo tuyo, que te estoi mirando.";
      return [{ speaker: "Marisa", text }];
    },

    lola: {
      crisis: { after: "Lola: «Sigo con o BOE de hue. Disposición final setena. Ha muerto o mayordomo».", lines: [
        { speaker: "Lola", text: "Mientres vusatros tos barallatz con o vídeo, he leyiu o BOE. Un decreto mete pensions y cambio d'hora en o mesmo paquet. Lo nuestro ye más chicot: nos miran as cuentas con lupa.", choices: [
          { text: "Publica-las. Todas.", memory: "lolaBooks", response: "Dica o tiquet d'o celo. Si nos pillan, que siga en un redondeo de siet centimos. Y en documento a parte, no metiu entre as pensions." },
          { text: "Millor aguardamos que pase.", memory: "lolaWait", response: "Ixo en un ministerio se clama «no consta». As crisis no pasan: s'archivan. Y belún las desarchiva a semana antes de votar." },
        ] },
      ] },
      default: { after: "Lola: «Pestanya nueva: “Cosas que no pagaremos”. Dotze filas. Garra no diz “se financia sola”».", lines: [
        { speaker: "Lola", text: "He ubierto a fuella «Campanya_DEFINITIVA_v3». Ingresos: o bote d'o grupo y cuaranta euros que nos debe Dani. Ell lo clama «deuda histórica»." },
        { speaker: "Lola", text: "Gastos: pizzas, imprenta y una factura de «consultoría de relato» sinyada por o primo de Dani. ¿La pago?", choices: [
          { text: "Ni de chanza. Tot con factura y tot publicau.", memory: "lolaReceipts", response: "Gracias. Si salimos en as noticias, que siga por aburrius. Transparencia de verdat, no un portal que se cai o día que lo buscas." },
          { text: "Paga-la, que o primo ye majo.", memory: "lolaCousin", response: "Majo ye. Te l'apunto en a pestanya «Achudicacions a dedo, versión barrio». Ya veyerás qué bien queda en un filo." },
          { text: "Cucha, Lola… ¿y tu cómo plegas a fin de mes?", memory: "lolaRent", response: "Comparto piso con dos opositors. Estudian leis que cambian antes de l'examen. Yo pago y ells me resumen o BOE. Por ixo soi aquí, ¿vale?" },
        ] },
        { speaker: "Lola", text: "Ala, a la mesa. Pediu: barbacoa y cuatro quesos. A de pinya la quereba Dani, pero no ha superau o trámite d'audiencia." },
      ] },
    },

    dani: {
      crisis: { after: "Dani: «Levo tres versions d'o comunicau. As tres encomienzan por “Debant d'as informacions apareixidas”».", lines: [
        { speaker: "Dani", text: "Cuatrocientos comentarios: doscientos bots, cien d'a mía mai defendiendo-te y cien de chent real muit enrabiada. O clip l'ha puyau un canal de Se Acabó La Siesta.", choices: [
          { text: "Contesta a los de verdat, un a un.", memory: "daniReply", response: "Un a un. Sin «lamentamos que s'haiga puesto malinterpretar». Pasa-me café. Si me veyes escribir «relato», quita-me o móbil." },
          { text: "Bloqueya a tot o mundo y puya un meme.", memory: "daniMeme", response: "Feito. Agora o meme tiene más comentarios que o problema. Os asesors lo claman «cambiar o marco». A mía yaya, «escurrir o bulto»." },
        ] },
      ] },
      default: { after: "Dani: «Estoi con l'argumentario de manyana. Levo dos horas dubdando entre “apostar por” y “seguir apostando por”».", lines: [
        { speaker: "Dani", text: "Manyana sale o tuyo primer argumentario. Te leyo: «Frent a o roido, barrio. Frent a o relato, feitos. Frent a…». Vale, m'ha quedau un poquet frentista." },
        { speaker: "Dani", text: "Te grabo explicando o programa. ¿Formato oficial, en mangas de camisa pasiando por un polígono, u con filtro y a canción de moda?", choices: [
          { text: "Sin filtro y sin polígono. Que se veigan as bolsas d'os uellos.", memory: "daniNoFilter", response: "Valient. As bolsas d'os uellos son lo unico auténtico que queda en internet. Pocos likes, pero de chent que existe." },
          { text: "Con filtro y con a canción de moda.", memory: "daniTrend", response: "Asinas me fa goyo. Manyana dengún no sabrá qué propones, pero tot o mundo sabrá que bailas como un ministro en una verbena." },
          { text: "¿Y tu qué tal, con tantos treballos?", memory: "daniJobs", response: "Tres clients y a mía mai preguntando cuán me fan fixo discontinuo, que a ella le suena a fixo. Isto ye lo unico que foi de baldes. Y lo unico que me fa goyo." },
        ] },
        { speaker: "Dani", text: "Una cosa: l'argumentario lo escribo yo, pero lo corriche Marisa. No sé cómo dentró en o grupo. Ya no m'atrevo a echar-la." },
      ] },
    },

    nico: {
      crisis: { after: "Nico: «Estoi parando cadieras. Una se plega sola. Ixa no vota».", lines: [
        { speaker: "Nico", text: "Ha baixau Ernesto, o d'o tercero. Tiene o piso zarrau dende lo d'o tope y diz que o vídeo le clama especulador. Dimpués m'ha demandau que le riegue as plantas.", choices: [
          { text: "Convida-lo a l'asambleya d'o portal. Que dé a suya versión.", memory: "nicoInvite", response: "Vale. Diz que alquilaría si sabese que lo recupera. U siga: ell tiene un piso, o sobrino de Marisa no, y en meyo bi ha una lei. Qué cosas." },
          { text: "Ni caso. Ye l'enemigo.", memory: "nicoEnemy", response: "¿Enemigo? Ye Ernesto, d'o colechio. Le debo un balón dende sexto. Dani le clama «gran tenedor» en l'argumentario. Tiene un piso. Heredau." },
        ] },
      ] },
      default: { after: "Nico: «Voi a buscar más celo. Iste pega cuan quiere, como un socio de Gubierno».", lines: [
        { speaker: "Nico", text: "He apegau cuaranta cartels. Chunto a lo de Fox bi heba un caballo de verdat, en doble ringlera. Le n'he apegau uno tamién. No ha protestau. Primer suporte." },
        { speaker: "Nico", text: "Por cierto, a Reme diz que vota a qui le consiga cita con o cardiólogo antes de Nadal. ¿Qué le digo?", choices: [
          { text: "A verdat: que ixo no s'arregla en un mes, pero lo pelearemos.", memory: "nicoTruth", response: "Se lo digo. Ferá a cara que fan as sinyoras cuan sienten a verdat: pena y respecto, a partes iguals. O voto, ya veyeremos." },
          { text: "Di-le que sí. Cita en una semana.", memory: "nicoPromise", response: "Le prometes en una semana o que a lista d'aspera tarda meyo anyo. En aviento, a Reme te lo recuerda. Con o gayato." },
          { text: "Que venga a l'asambleya d'o portal y nos lo cuente a totz.", memory: "nicoAssembly", response: "Buena idea. Os d'o bloque levan anyos queixando-se cadaguno en o suyo replano. Chuntos son una chunta de vecinos: una investidura, pero con derrama." },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ["CAPÍTOL 1", "Pues me presento"],
      tv: { headline: "¡ELECCIONS!", ticker: "ZAGUERA HORA · DISOLUCIÓN D'AS CORTES · COMPARECENCIA SIN PREGUNTAS" },
      subs: [
        [null, "Domingo, 23:47. «Un vídeo más y lo deixo»."],
        ["Presentadora (TV)", "Zaguera hora: o Gubierno disuelve as Cortes y convoca chenerals. A presidenta compareix sin preguntas: «as respuestas ya son en a web»."],
        ["Presentadora (TV)", "Os partius de siempre ya graban vídeos en mangas de camisa. Uno ha plegau a caballo. Seguiremos informando. U no."],
        [null, "BZZZ. Cuaranta y tres mensaches. «¿Y si nos presentamos?». «jajaja». «No, en serio»."],
        ["Tú", "¿Eleccions? ¿Atra vegada? …A veyer qué diz o grupo."],
      ],
      toast: "O móbil no para de vibrar. Ye en a mesadeta, chunto a lo sofá.",
    },
    plaza: {
      banner: ["O BARRIO", "Baixar ta la carrera"],
      subs: [
        [null, "A plaza: forno, bar, un banco a lo sol y más opinions por metro cuadrau que un plató."],
        ["Marisa", "¡Ala, o d'o partiu nuevo! Ven acá, que te tiengo que contar."],
        ["Paco", "Si vas a salvar o barrio, que siga dimpués d'o café. Y o café se paga, que no ye una medida."],
      ],
    },
    hq: {
      banner: ["CAPÍTOL 2", "A sede ye o mío salón"],
      subs: [
        [null, "A sede: un salón, una mesa plegable y dos enchufes. Uno funciona. L'atro, «en tramitación»."],
        ["Lola", "Bienvenius a la sede. O sofá ye a sala de prensa; a nevera, a tresorería. Auditada."],
        ["Dani", "He clamau a o wifi «Gabinete». Ya tenemos estructura."],
        ["Nico", "Orden d'o día: uno, cadieras. Dos, qui trai chelo. Tres, Espanya."],
      ],
    },
    hall: {
      banner: ["CAPÍTOL 5", "O debate d'o salón"],
      subs: [
        [null, "Salón multiusos. Hue: debate. Manyana: zumba. A uello, a diferencia ye chicota."],
        ["moderator", "Buenas nueitz. Bells atrils, un cronómetro y una cherra d'augua que dengún no ubrirá. Primer bloque: vivienda."],
        ["tech", "Vengo con sentiu común. Y con paciencia. Sobre tot con paciencia: levamos anyos aguardando que nos toque."],
        ["populist", "Frent a la ola reaccionaria, abanzamos. En a dirección que toque esta nueit."],
      ],
    },
    victory: {
      banner: ["NUEIT ELECTORAL", "¡Victoria!"],
      verdict: "¡SUPERA O 48!",
      subs: [
        ["Periodista", "Con o cien por cien escrutau, totz os partius dicen que han ganau. Por una vegada, uno tiene razón."],
        ["Tú", "¿Hemos… ganau? ¿Sin argumentario?"],
        ["Ana", "¡Discurso! ¡Pero curtet, que Marisa ubre a las cinco!"],
      ],
    },
    defeat: {
      verdict: "NO PLEGA A LO 48",
      subs: [
        ["Periodista", "…y a candidatura d'o barrio se queda difuera. Totz os demás, ixo sí, aseguran que han ganau."],
        ["Tú", "Dani diz que ye «un resultau que nos permite seguir construindo»."],
        ["Berto", "Marisa ya l'ha traduciu: «hez perdiu, pichón». Cucha, a proxima te voto. Si me lo recuerdas."],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: "CAPÍTOL 2 · A SEDE YE O MÍO SALÓN", title: "Comité de dirección: tres personas y un sofá.",
      intro: state => `Argumentario d'as 7:00: «Priorizar exes estratechicos». Respuesta de Marisa en o grupo: «Triatz una cosa». Bi ha tiempo ta una prioridat de verdat; o resto, ta lo grupo, an mueren as ideas.${state.memories.nicoAssembly ? " Nico ya ha apegau en o portal un aviso d'asambleya." : ""}`,
      choices: {
        accounts: { title: "Lola revisa cada coste", flavor: "Presupuesto a la vista, dica o tiquet d'o celo. Ni una linia d'«atros gastos». Menos tiempo ta las rets" },
        street: { title: "Nico organiza puerta por puerta", flavor: "Replano por replano, con a excusa d'a derrama de l'ascensor. Sin tablet ni encuesta: con timbre" },
        content: { title: "Dani mete un gabinete chicotet", flavor: "Aro de luz, croma de sabana verde y una paret con a parola RELATO en pósits" },
        tenants: { title: "Asambleya de vecinos en o portal", flavor: "Baixa chent que no se charraba dende lo d'as humedatz. Ernesto, o d'o piso zarrau, tamién. Dengún no replega as cadieras" },
      },
    },
    video: {
      eyebrow: "CAPÍTOL 4 · FE-LO VIRAL", title: "A marca ye puesta. Falta o mensache.",
      intro: state => { const m = state.memories; return `Argumentario d'as 7:00: «Tono cercano, mensache claro». Marisa: «Charra como charras». Dani calcula tres segundos antes que esvaren o dido. L'alcance ubre puertas; a chent destría atención de suporte.${m.daniNoFilter ? " Hue, sin filtro." : m.daniTrend ? " Dani ya ha triau a canción. No preguntes." : ""}`; },
      choices: {
        explain: { title: "Explicar a propuesta y o que cuesta", flavor: "Un minuto, plano fixo y una pizarra de Lola con a letra chicota en gran" },
        chairs: { title: "O baile d'as cadieras de Paco", flavor: "Coreografía con cadieras emprestadas. Dengún no sabe qué propones; tot o mundo sabe que te caes en o segundo onze" },
        neighbor: { title: "Deixar charrar a Marisa", flavor: "Ella charra d'a calorina, d'o local que le han puyau y d'a cita d'a suya mai. Tu aguantas o móbil y te callas" },
        debunk: { title: "Esmontar o bulo d'o día", flavor: "Un canal de Se Acabó La Siesta diz que quiers prohibir as terrazas. Lo desmientes con o plano entero, que ye l'arma secreta" },
      },
    },
    crisis: {
      eyebrow: "CAPÍTOL 5 · CRISIS",
      title: (state, ctx) => ctx.contradiction ? "O tuyo «tot ta totz» ha plegau antes que a prensa." : "Un vídeo retallau ha plegau antes que a verdat.",
      intro: (state, ctx) => `${ctx.contradiction
        ? "Belún ha puyau o momento en que lo prometebas tot a la vegada. Mosica de tráiler, títol en mayusclas y un rotulo: «MARISA LO TRADUZ». Ella no ha estau. Pero lo suscribe."
        : "Corre un clip de nueu segundos retallau chusto antes que explicases o coste. Sobrevivo lo comparte con «Isto ye o que bi ha dezaga». Pacient, con «Sin comentarios». Que ye un comentario."}${state.memories.nicoPromise ? " Y a Reme ha clamau: sigue sin cita." : ""} Previsión actual: <b>${ctx.forecast.score}/100</b>. Fan falta ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: "Dar a cara: reconoixer l'error y corrichir-lo", flavor: "Vídeo sin mosica y sin «s'ha sacau de contexto». Con preguntas, que ya ye cuasi escándalo" },
        team: { title: "Publicar costes y responsables", flavor: "Lola puya as cuentas; Nico, qui fa qué. Aburriu, comprebable y difícil de retallar" },
        distract: { title: "Sortiar una freidora d'aire", flavor: "Ta participar: seguir a cuenta, mencionar a tres amigos y oblidar o tema. En os manuals, «marcar agenda propia»" },
        blame: { title: "Culpar a la máquina d'o fango", flavor: "Bots, algoritmo y «as cloacas». Funciona con os tuyos. Os demás reconoixen o truco: lo usan totz os partius" },
      },
    },
    debate: {
      eyebrow: "CAPÍTOL 5 · O DEBATE", title: "Tres rivals, una moderadora y una cherra sin ubrir.",
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `A un costau, ${populist.name}, de ${populist.party}, con dos argumentarios: o d'o maitín y o d'a tarde. A l'atro, ${tech.name}, de ${tech.party}, que promete derogar cosas que no nombra. A lo fondo, ${hard?.name || "Covadonga del Muro"}, de Fox, que ha intentau dentrar a caballo. ${moderator}: «¿A qué renuncia o suyo programa?».`,
      choices: {
        tradeoff: { title: "Defender a renuncia concreta", flavor: (state, { rivals }) => `Dices qué pierdes y a qui molestas. ${rivals.tech.name} demanda «un dato». Se lo das. L'apunta ta derogar-lo` },
        attack: { title: (state, { rivals }) => `Sacar-le a hemeroteca a ${rivals.populist.name}`, flavor: "Le leyes o que dició fa dos campanyas. Aplauso fácil, titular fácil, cero propuestas. Ella: «Rectificar ye de sabios»" },
        manage: { title: "Dar turnos y esmontar cifras con calma", flavor: (state, { rivals }) => `${rivals.tech.name} promete baixar impuestos «a partir d'o segundo anyo, si a herencia lo permite». Preguntas de qué anyo. Silencio. Augua` },
        promise: { title: "Prometer topar l'alquiler a la metat «por decreto»", flavor: (state, { rivals }) => `O público aplaude. ${rivals.populist.name} te mira con envidia profesional. ${rivals.moderator}: «Queda dito»` },
      },
    },
    finalPrep: {
      eyebrow: "CAPÍTOL 6 · ZAGUERA VUELTA", title: "Encara queda marguin.",
      intro: (state, ctx) => `Previsión: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? "por dencima" : "por debaixo"} d'o branquil). Quedan dos días. O sondeo oficial tos da «arredol de cero»; encierta siempre a favor de qui lo encarga. Argumentario: «Mobilizar o voto util». Marisa: «Que vaiga a chent». Nomás bi ha tiempo ta una cosa bien feita.`,
      choices: {
        listen: { title: "Visitar a los que encara dubdan", flavor: state => `A parada d'o bus, a cola d'o centro de salut y a sinyora d'o bolso, que ya conoixe a o que le lo robó: coinciden cada mes en o chulgau${state.memories.nicoAssembly || state.memories.nicoInvite ? ". L'asambleya d'o portal te demanda que tornes" : ""}. Escuitas más que no charras` },
        receipts: { title: "Publicar o presupuesto definitivo", flavor: "Lola lo imprime en A3: «a transparencia tamién ye tamanyo de letra». Sin anexos que salgan en agosto" },
        volunteers: { title: "Ordenar voluntarios y colechios", flavor: state => `Nico reparte turnos, bocadillos y un mapa de colechios dibuixau en una servilleta${state.memories.pacoLucia ? ". Lucía, a camarera de Paco, s'apunta d'interventora" : ""}. Sin autobuses de simpatizants: con o de linia` },
      },
    },
    finalSpeech: {
      eyebrow: "CAPÍTOL 6 · O ZAGUER MITIN", title: "Una frase antes d'a chornada de reflexión.",
      intro: "Cadieras plegables, un globo que se desinfla y una periodista d'o diario local con cara de tercer mitin hue. En os atros zarres bi ha autobuses y banderas; aquí, o d'o butano. Consolida o que has aprendiu u torna a prometer-lo tot.",
      choices: {
        account: {
          title: state => ({
            shade: "“Bi haberá solombra y bi haberá menos coches. Isto triamos, isto cuesta y aquí responderemos.”",
            parking: "“O barrio podrá treballar, encara que iste estiu siga sin árbols. Isto triamos y aquí responderemos.”",
            festival: "“Bi haberá cultura y bi haberá roido pactau. Isto triamos, isto cuesta y aquí responderemos.”",
            housing: "“Bi haberá más pisos porque los construiremos, no porque los anunciemos. Tardará. Y aquí responderemos.”",
          }[state.proposal] || "“Isto triamos, isto cuesta y aquí responderemos.”"),
          flavor: "Lo dices sin papers. Marisa ubre a libreta y, por primera vegada, no apunta cosa",
        },
        viral: { title: "“¡Menos embozo y más gazpacho!”", flavor: "Dani lo emite en directo. Se corea. Dengún no sabe qué significa. A las dotze ya lo han copiau tres partius" },
        everything: { title: "“Manyana bi haberá de tot ta totz, por decreto.”", flavor: (state, { rivals }) => `Aplauso enorme. Lola se tapa a cara con o presupuesto. ${rivals.populist.name} t'escribe: «¿Charramos?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: "NUEIT ELECTORAL · VICTORIA", title: "Bi ha más cadieras que personas.",
      text: state => `Marisa aplaude una vegada. Lola pregunta qui ha alzau as facturas. Pacient y Sobrevivo ya han clamau dos vegadas: «¿Qué ufritz?». A las 7:00 plega o zaguer argumentario de Dani: «Hemos ganau». Marisa contesta: «Isto sí que l'entiendo». ${{
        shade: "Manyana encomienza lo difícil: explicar-le a la furgoneta d'o sobrino án aparca.",
        parking: "Manyana encomienza lo difícil: o primer agosto sin árbols con o tuyo nombre en a placa.",
        festival: "Manyana encomienza lo difícil: a primera reunión con os d'o primero, que ya han traito tapons ta tu.",
        housing: "Manyana encomienza lo difícil: a primera licencia. Ernesto pregunta si puede alquilar o tercero antes que remate a lechislatura.",
      }[state.proposal] || ""}`.trim(),
    },
    defeat: {
      eyebrow: "NUEIT ELECTORAL · DERROTA", title: "Un resultau que nos permite seguir construindo.",
      reasons: {
        support: "Faltó suporte directo: o barrio te vio más en o móbil que en o replano.",
        credibility: "As contradiccions pesoron: en a cola d'o pan no bi ha hemeroteca, pero bi ha memoria.",
        organization: "L'equipo plegó desordenau: un colechio sin interventor y unatro con tres.",
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: "MINICHUEGO · FE-LO VIRAL", title: "Grabando en a marca.", goWord: "¡Acción!",
      lanes: ["Saludo", "¡Ta alto!", "Palmas", "No consta"],
      takes: {
        explain: "Pizarra de Lola, plano fixo y cada chesto subraya un coste.",
        chairs: "O baile d'as cadieras. Paco mira con os brazos cruzaus.",
        neighbor: "Marisa charra d'a calorina; tu, dezaga, marcas o ritmo sin que se note. Se nota.",
        debunk: "Esmontas o bulo con chestos claros: isto no, isto sí, isto cuesta.",
      },
      intro: (state, ctx) => `Móbil en o trípode, vecinos mirando y Dani contando. ${ctx.take} Fe cada pose cuan o suyo icono plegue a lo cerclo. O ritmo suma alcance, no votos.`,
      titles: { great: "¡Viral! Sumandos ya t'ha ofreciu de estar un pétalo.", ok: "Se comparte en tres grupos de WhatsApp. Uno ye o d'a tuya mai.", bad: "Cuaranta visualizacions. Dani lo clama «impacto cualitativo»." },
      texts: { ok: "Dani ya mete subtitols en amariello. A toma vale: l'alcance ubre puertas, pero os votos se ganan en o portal.", bad: "T'has perdiu entre o saludo y as palmas. Repite a toma: por agora, «no consta»." },
    },
    duel: {
      eyebrow: "MINICHUEGO · DUELO DE RÉPLICAS", title: "Cinco preguntas, un cronómetro.",
      intro: (state, ctx) => `${ctx.rounds} réplicas. Tría a respuesta que defiende bella cosa concreta y asume o suyo coste antes que s'acabe o tiempo. A meyas, belún t'interrumpirá: demanda a parola.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: "A qui aparca en doble ringlera y a dos mesas d'a terraza de Paco. Solombra a cambio de coches, dito claro.",
          parking: "A lo banco a lo sol: iste estiu seguirá sin árbols. Triamos que o barrio pueda treballar.",
          festival: "A los d'o primero, dos nueitz por semana. Con horario pactau y tapons de regalo, literalment.",
          housing: "A la plaza, que sigue sin solombra, y a la nuestra paciencia: construir tarda más que una lechislatura. Y nos dirán «os d'os caseros».",
        }[state.proposal];
        return [
          { topic: "Vivienda", role: "populist", claim: "Gracias a la nuestra lei, en as zonas tensionadas l'alquiler s'ha estabilizau. Os pisos que faltan los amaga a especulación.",
            options: ["Si ye «estabilizau», ¿por qué o tercero leva un anyo zarrau? Topar no fa pisos. Construir sí, encara que tarde más que un titular.", "¡Pos nusatros lo topamos a la metat! ¡Y o pan!", "Vusté leva una chapa de colors. Lo sabe tot o barrio."], correct: 0 },
          { topic: "Datos", role: "tech", claim: "Seguntes un informe que no he traito, a suya propuesta afundirá o barrio. Lo diz ista gráfica. A d'a flecha roya.",
            options: ["Y seguntes o mío, o suyo gráfico ye un bulo. Empate técnico.", "Bueno, os datos son relativos. Como as encuestas.", "Amuestre a fuent. A nuestra: o presupuesto de Lola, pachina dos, con foto d'o banco a las cinco d'a tarde."], correct: 2 },
          { topic: "A suya propuesta", role: "moderator", claim: "Pregunta directa: ¿a qui perchudica a suya propuesta? Minuto d'oro. Bueno, diez segundos de bronce.",
            options: ["A dengún. Ye una propuesta transversal, sin perdedors, como un anuncio de colonia.", cost || "A belún seguro. Lo diremos con nombre y apellius cuan lo sepamos.", "A los de siempre, que ya saben qui son."], correct: 1 },
          m.promisedBoth
            ? { topic: "A promesa", role: "populist", claim: "¡Vusté le prometió a una fornera solombra, aparcamiento y un piso ta o suyo sobrino! Ixo ye populismo. Y lo digo con conoiximiento de causa.",
                options: ["Ye verdat. M'equivoqué en prometer-lo tot; dimpués triemos una cosa y explicamos o que cuesta.", "S'ha sacau de contexto. O contexto yera yo prometendo-lo tot.", "Vusté tamién lo promete tot. Empate."], correct: 0 }
            : { topic: "Sanidat", role: "tech", claim: "¿Y a sanidat? ¿U nomás le importa a suya plaza? Nusatros chestionaremos. Muito. Con chestión.",
                options: ["Prometo que manyana no bi ha listas d'aspera. Parola.", "Nos importa. Por ixo no prometemos o que no chestionamos: levaremos a cita d'a Reme a lo pleno, con nombre y calendata.", "Lo derogaremos tot, como vusté. Ya veyeremos qué."], correct: 1 },
        ];
      },
      interruptions: {
        populist: "¡Perdone! Ixo ye d'a máquina d'o fango. Lo digo sin haber-lo sentiu entero.",
        tech: "Si me permite… como diciba iste maitín un periódico… se lo leyo entero…",
        moderator: "Le quedan diez segundos. Nueu. Queda dito.",
        fallback: "¡Perdone, perdone!",
      },
      floor: "Deixe-me rematar, que isto no ye una rueda de prensa.",
      floorBabble: "Deixe-me rematar",
      reactions: {
        timeout: "S'ha acabau o tiempo. Queda dito. Siguient bloque.",
        quick: "Respuesta concreta y en tiempo. Raro. Prenco nota.",
        slow: "Concreta, encara que chustet de tiempo.",
        wrong: "Gracias por dar-me a razón. Lo meteré en l'argumentario.",
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} asiente. Y no diz «queda dito».`, mid: "Has aguantau o tipo. Sin chuleta.", low: "Manyana os rivals dirán que han ganau. Hue, con motivo." },
      text: "L'estratechia que triés marca o debate; as réplicas deciden si se te creye.",
    },
    chairs: {
      eyebrow: "MINICHUEGO · SEIS CADIERAS", title: "Emprestamo, no subvención.",
      intro: (state, ctx) => `Ta la zaguera asambleya fan falta as seis cadieras de Paco, repartidas por o barrio. Pasa por dencima d'una ta agarrar-la y leva-la a lo corro. Una a una: «a esquena tamién vota», diz Nico. Tiens ${ctx.time} segundos.`,
      hints: {
        start: "Pasa por dencima d'una cadiera ta agarrar-la.",
        carry: "Agora, ta lo corro amariello.",
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. Ta la siguient.`,
        full: "¡Corro completo!",
      },
      titles: { all: "Seis cadieras en o corro. Paco, conforme.", mid: "Meyo corro. O resto, de piet y opinando.", low: "Paco replega as cadieras ell mesmo. Y lo comenta." },
      texts: { all: "Nico apunta o tiempo en a servilleta. Organizar ye isto: que bi haiga puesto cuan plega a chent.", other: "As que faltan siguen por a plaza. Repite: dengún no ha visto cosa, fueras de Paco." },
    },
    rally: {
      eyebrow: "MINICHUEGO · O ZAGUER MITIN", title: "Que no se te'n vaiga a sala.", goWord: "¡Charra!", lane: "Remata a frase",
      intro: "Cada frase tiene un remate. Preta cuan a parola plegue a lo cerclo: o público aplaude y l'atención puya. Si fallas, belún mira o móbil. U pior: chiula.",
      phrases: state => {
        const own = {
          shade: ["Iste estiu, a plaza tendrá", "SOLOMBRA"], parking: ["Qui treballa en iste barrio podrá", "DESCARGAR"],
          festival: ["Os mozez tendrán local y a plaza,", "CULTURA"], housing: ["Os pisos no s'anuncian: se", "CONSTRUYEN"],
        }[state.proposal] || ["Una cosa bien feita, ta", "ENCOMENZAR"];
        return [
          ["Buenas nueitz. Gracias por venir sin autobús y con", "CADIERA"],
          ["No vengo con argumentario: vengo con", "UNA COSA"],
          own,
          ["Y sí: tiene un coste. L'hemos puesto por", "ESCRITO"],
          ["Sin observatorio, sin comisión y sin", "LOGO"],
          ["Dengún aquí tos ha dito que isto se pague", "SOLO"],
          ["Si no cumplimos, ya sabetz an ye o", "FORNO"],
          ["Esta nueit Marisa no tiene cosa que", "TRADUCIR"],
          ["O domingo no tos demando fe: tos demando o", "VOTO"],
          ["A qui queratz. Pero que no decida o", "SOFÁ"],
          ["Gracias, barrio. Y agora, as cadieras, ta", "PACO"],
          ["¡Pos me", "PRESENTO!"],
        ];
      },
      titles: { great: "A sala de piet. Os que tienen cadiera, tamién.", ok: "Aplausos sinceros y bell badallo.", bad: "S'ha sentiu un móbil. Yera l'argumentario." },
      text: "O público se'n acordará de cómo lo diciés; a decisión que has preso decide de qué se'n acuerda.",
    },
  },
};
