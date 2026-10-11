// Guion · Català (ca). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte queda en español.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
// Traducción completa del guion efectivo (actual + b). Gag: l’argumentari de les 7:00 que la Marisa «tradueix».

const PROPOSAL_DEFAULT = 'Una cosa ben feta, per començar.';

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: 'Fermí Aguardo', party: 'Partit Pacient' },
    populist: { name: 'Núria Gir', party: 'Partit Sobrevisc Una Altra Elecció' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Maite Escaleta',
  },

  foxDebate: {
    hallLine: 'He deixat el cavall en doble fila. Si se l’endú la grua, és ideologia.',
    interruption: 'Excuse me! Sense complexos: o em deixa parlar o m’aixeco i me’n vaig. Tinc pràctica sortint de governs.',
    round: {
      topic: 'Seguretat', role: 'hard',
      claim: 'Al que roba la bossa a la senyora de la parada l’han detingut onze vegades. Onze. I el Govern, en lloc de jutges, obre un observatori. Vostè què faria?',
      options: [
        'Que reincidir no surti gratis: judici ràpid i que no surti per la mateixa porta el mateix dia. I jutges, que costen diners. Ho diem.',
        'Mà dura! I un cavall per barri!',
        'Parlem de les causes. De les onze.',
      ],
      correct: 0,
    },
    reactions: {
      right: 'Home. Això no és de dreteta covarda. Per aquesta vegada.',
      wrong: 'Ho veu? Sense complexos es pensa més ràpid. Li deixo el cavall.',
      timeout: 'Mentre vostè pensa, l’Espanya que matina ja se n’ha anat a dormir.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'ELECCIONS GENERALS · ARGUMENTARI INCLÒS',
    tagline: 'Els altres partits tenen assessors. Tu tens una flequera que tradueix.',
  },

  chapters: ['Doncs em presento', 'La seu és el meu menjador', 'Baixar al carrer', 'Fes-ho viral', 'Ho han tret de context', 'L’últim míting'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'Compareixença al sofà', objective: 'Acosta’t al mòbil, al costat del sofà. Prem E.' },
    call: { title: 'Ronda de consultes', objective: 'Fes servir el portàtil de la taula per trucar als teus amics.' },
    register: { title: 'Constituïts a tots els efectes', objective: 'Ves a la carpeta de l’escriptori i registra el partit.' },
    leave: { title: 'Presa de contacte amb la realitat', objective: 'Surt per la porta verda per baixar a la plaça.' },
    neighbor: { title: 'Procés d’escolta (de debò)', objective: 'Parla amb la Marisa, al costat del tendal de la fleca. En Paco, a la terrassa del bar, també té coses per explicar.' },
    program: { title: 'No tot cap en un decret', objective: 'Tria la teva primera proposta al tauler de la plaça.' },
    speech: { title: 'Primera compareixença, amb públic', objective: 'Puja al punt del faristol i fes el teu primer discurs.' },
    aftermath: { title: 'La cua del pa fa l’anàlisi', objective: 'Torna amb la Marisa per saber què es comenta a la cua del pa.' },
    hqBrief: { title: 'La seu és el meu menjador', objective: 'Reuneix l’equip a la taula de campanya. La Lola, en Dani i en Nico també volen parlar amb tu.' },
    video: { title: 'Fes-ho viral (amb missatge, si pot ser)', objective: 'Grava un vídeo a la marca del costat de la fleca.' },
    crisis: { title: 'Això no és exactament el que vaig dir', objective: 'Afronta la crisi al tauler. Abans, potser convé escoltar l’equip.' },
    debate: { title: 'El debat de la sala polivalent', objective: 'Entra al debat amb els rivals.' },
    finalPrep: { title: 'Última volta pel barri', objective: 'Tria al mapa on concentrar l’últim esforç.' },
    finalSpeech: { title: 'L’últim míting, sense autocars', objective: 'Tanca la campanya davant del públic.' },
    election: { title: 'La nit de les cadires', objective: 'Consulta el resultat electoral.' },
    complete: { title: 'Campanya completada', objective: 'La campanya s’ha acabat.' },
  },

  travel: {
    hqBrief: { title: 'Desplaçament institucional', objective: 'La seu és als baixos del portal del costat del bar d’en Paco. Ves a la porta i prem E.', prompt: 'Portal · Entrar a la seu', loading: 'ENTRANT A LA SEU…', sign: 'SEU' },
    video: { title: 'Sortir als mitjans (a la plaça)', objective: 'Per gravar cal llum i veïns. Surt per la porta de la seu i baixa a la plaça.', prompt: 'Porta · Baixar a la plaça', loading: 'BAIXANT A LA PLAÇA…', sign: 'PLAÇA' },
    crisis: { title: 'Reunió d’urgència, amb tàper', objective: 'Alguna cosa crema al grup de la seu. Torna pel portal del costat del bar.', prompt: 'Portal · Tornar a la seu', loading: 'PUJANT A LA SEU A CORRE-CUITA…', sign: 'SEU' },
    debate: { title: 'Trasllat a la sala polivalent', objective: 'Surt per la porta de la seu. A la sala polivalent ja han muntat els faristols.', prompt: 'Porta · Anar a la sala polivalent', loading: 'CAP A LA SALA POLIVALENT…', sign: 'SALA' },
    finalPrep: { title: 'Trepitjar territori', objective: 'Surt de la sala per la porta doble. Queda una setmana i es guanya al carrer.', prompt: 'Porta · Tornar a la plaça', loading: 'TORNANT AL BARRI…', sign: 'PLAÇA' },
    finalSpeech: { title: 'Transport públic, com el votant mitjà', objective: 'Ves a la parada del costat del quiosc i agafa el 27 fins a la sala polivalent.', prompt: 'Parada · Agafar el 27 cap a la sala', loading: 'ARRIBA EL 27. TARD, PERÒ ARRIBA…', sign: 'BUS 27' },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: 'Ombra abans que un observatori de la calor', cost: '2 de pressupost', benefit: 'Arbres, tendals, una font que funcioni i els baixos buits de la cantonada com a sala fresca per a la gent gran. Sense pla director: amb jardiner.', compromise: 'Es perden places d’aparcament, la terrassa d’en Paco s’encongeix dues taules i el nebot de la Marisa torna a la doble fila.' },
    parking: { title: 'Que el barri pugui treballar', cost: '2 de pressupost', benefit: 'Càrrega i descàrrega amb horari, places rotatòries per al comerç, aparcaments de bicis per als repartidors i llicències de terrassa en dies, no en trimestres.', compromise: 'Més cotxes a la plaça i un altre agost a ple sol. El banc continuarà bullint.' },
    festival: { title: 'Cultura després de les vuit', cost: '2 de pressupost', benefit: 'Escenari per als grups del barri, cinema a la fresca i un local d’assaig que gestiona l’associació de veïns, no una fundació amb logo.', compromise: 'Soroll dues nits per setmana; els del primer, amb taps. L’ombra i la càrrega i descàrrega, al calaix.' },
    housing: { title: 'Que el tercer torni a tenir veïns', cost: '2 de pressupost', benefit: 'Llicències en setmanes, construir al solar de la cantonada i que llogar un pis tancat no faci por.', compromise: 'Construir triga més que anunciar un topall. No surt al telenotícies, et diran «el dels propietaris» i la plaça continua sense ombra.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'Llegeix el BOE per gust', line: 'Treballo en una gestoria i llegeixo el BOE al metro, com qui llegeix novel·la negra: el mort sempre és a la disposició addicional. Et porto els comptes.', choices: [
      { label: 'Tresoreria. Tu decideixes quan és que no.', reply: 'Accepto. Primera norma: aquí res no «es finança amb creixement». Es finança amb diners, que és més avorrit, però existeix.' },
      { label: 'Estratègia. Que algú llegeixi la lletra petita.', reply: 'Fet. La lletra petita és on els governs amaguen el que importa. La grossa és per al cartell.' },
    ] },
    dani: { role: 'Parla en fils', line: 'Faig vídeos per a una clínica dental i un gimnàs. M’he llegit tots els fils d’«exassessor de campanya» que existeixen. Vosaltres poseu les idees; jo us faig el relat.', choices: [
      { label: 'Comunicació. Relat sí, fum no.', reply: 'Tracte fet. Cada matí a les 7:00, argumentari al grup. Curt, clar i sense la paraula «resiliència». Bé, gairebé sense.' },
      { label: 'Portaveu. Hauràs de contestar preguntes.', reply: 'Rodes de premsa amb preguntes? Això ja no ho fa ningú. Va, serem vintage.' },
    ] },
    nico: { role: 'Coneix tota l’escala', line: 'Faig torns en un magatzem i conec tota l’escala. Jo mobilitzo. Però si algú diu «transversal» en una reunió, baixo a comprar pipes.', choices: [
      { label: 'Organització. Tu poses els horaris.', reply: 'Fet. Reunions de vint minuts. Si dura més, és que algú està llegint un argumentari.' },
      { label: 'Actes. Necessitem la teva veu de megàfon.', reply: 'Quan va tocar la Grossa al bar, va baixar tot el carrer en sabatilles. Dona’m un motiu així i t’omplo la plaça.' },
    ] },
  },

  call: {
    title: 'Ronda de consultes. Per videotrucada.',
    you: 'Ha tingut una idea',
    next: 'Següent valent',
    done: 'Ja tenim equip. En Dani ha creat el grup «Argumentari 7:00». I, sense voler, hi ha afegit la Marisa, la del forn.',
    doneBabble: 'Ja tenim equip.',
    finish: 'Baixar a la plaça',
  },

  register: {
    eyebrow: 'FUNDACIÓ · FINESTRETA ÚNICA',
    title: 'Un nom per a la papereta.',
    stamp: 'PENDENT D’ESMENA',
    intro: 'Tres camps. Ni certificat digital, ni cita prèvia, ni annex III. Si això és un somni, que no es desperti ningú del Ministeri.',
    defaultName: 'La Gent del Banc',
    defaultSlogan: PROPOSAL_DEFAULT,
    submit: 'Registrar la candidatura',
    toast: 'REGISTRAT. Resolt en zero dies hàbils. A la finestreta ningú no sap com ha passat.',
  },

  program: {
    eyebrow: 'PROGRAMA · PRESSUPOST: 2 CRÈDITS',
    title: 'Prioritzar: triar, però amb corbata.',
    intro: 'Només hi cap una proposta. Les altres no es «calendaritzen» ni es «posposen a una segona fase»: es queden per fer. El barri sap distingir-ho.',
    promisedBothNote: 'La Marisa recorda que vas prometre ombra, aparcament i pis per al seu nebot. Cap opció no paga tot això. −6 de credibilitat en concretar.',
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Ara, a explicar-ho al faristol. Amb preguntes.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ['Bé. Doncs aquí som.', 'Què defensaràs?', 'L’última frase compta.'],
    parts: {
      opening: { title: '01 / Trencar el gel', prompt: 'Set persones. Dues esperen el bus, una ha baixat a comprar el pa i una altra et grava per si dius «resiliència».', options: {
        listen: 'Abans de parlar, he vingut a escoltar. De debò, no en «procés d’escolta».',
        joke: 'Seré breu. Ho dic com a polític, així que poseu-vos còmodes.',
        grand: 'Avui iniciem un full de ruta transversal cap a un nou horitzó de país!',
      } },
      argument: { title: '02 / Dir alguna cosa concreta', prompt: 'Ara toca defensar el que has clavat al tauler. La Marisa ja ha tret la llibreta.', options: {
        shade: 'Ombra i un lloc fresc per a la gent gran, encara que perdem aparcament. Sense pla director: amb arbres.',
        parking: 'Que qui treballa pugui descarregar, encara que la plaça continuï sense arbres aquest estiu.',
        festival: 'Cultura i un local per al jovent, amb horari de soroll pactat i per escrit.',
        housing: 'Més pisos: sòl, llicències ràpides i que llogar no faci por. No baixa dilluns; baixa construint.',
        everything: 'Arbres, aparcament, festivals i un pis per a cadascú, gratis i en un decret dilluns!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'La Marisa mira el rellotge. És un rellotge que ha vist moltes campanyes.', options: {
        accountable: 'Si no ho complim, ens ho pregunteu aquí. I contestarem, que ja és una novetat.',
        chant: 'Menys cotxe i més gaspatxo!',
        forever: 'Per concloure, i en benefici de la brevetat, els meus vint-i-set eixos següents…',
      } },
    },
    timing: { eyebrow: '04 / EL COP FINAL', title: 'Ara. Amb convicció.', button: 'I per això em presento!' },
    result: {
      eyebrow: 'EL BARRI HA ESCOLTAT',
      goodTitle: 'Un aplaudiment. Sense claca.',
      badTitle: 'Aplaudiment de cortesia. A la tele, «bona acollida».',
      coherent: 'Has defensat la teva proposta i has dit el que costa. En política això té un nom estrany: dir la veritat.',
      incoherent: 'El teu discurs no coincideix amb el programa. A la tele en diuen «matisar». A la cua del pa, una altra cosa.',
      fine: 'L’abast mesura atenció, no vots. Les conseqüències depenen del que has dit.',
      button: 'Baixar del faristol',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: 'Tu ets el del partit nou? M’ha arribat el vostre argumentari: en Dani em va afegir al grup sense voler. El llegeixo a les cinc, amb la primera fornada.' },
      { speaker: 'Marisa', text: 'El meu nebot fa repartiment i no té on parar. Trenta-quatre anys, a l’habitació de quan era petit. I el tercer és tancat des d’allò de la llei. Per on comences?', choices: [
        { text: 'Per escoltar-te. Què et treu la son?', memory: 'listened', response: 'A mi? La paciència. La cita de la meva mare és d’aquí a uns mesos, i l’espera, al sol.' },
        { text: 'Per tot: ombra, aparcament i un pis per al teu nebot.', memory: 'promisedBoth', response: 'Això a la tele es diu «paquet integral de mesures». Aquí, «ja ho veurem». M’ho apunto a la llibreta.' },
        { text: 'Per fer soroll: un festival que ens posi al mapa.', memory: 'spectacle', response: 'Al mapa? Si sortim a totes les webs de pisos turístics: «autèntic barri de tota la vida». L’única cosa de tota la vida que queda soc jo, i tanco a les dues.' },
      ] },
      { speaker: 'Marisa', text: 'Aquí tens el tauler. Dona per a una cosa. Una. I al faristol, res de «posar en valor» ni de «full de ruta». Si ho dius, et llanço una barra de pa.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Em vas prometre ombra, aparcament i pis per al meu nebot. Tres coses i cap data. Pàgina dotze de la llibreta.'
        : m.listened ? 'Abans m’has escoltat. Sembla poca cosa, però els que venen amb el discurs plastificat no aixequen la vista del paper.'
        : m.spectacle ? 'Allò del festival ho ha sentit tot el barri. Els del primer ja pregunten si els taps van al programa o en un reial decret.'
        : 'Ja has baixat de la caixa. Et tremolaven les cames menys que al de l’any passat. I el de l’any passat portava un autocar de simpatitzants.';
      const coherent = {
        shade: 'Has dit que treus cotxes per posar ombra. El meu nebot ja no et parla; la meva mare ja et defensa. Has triat. Ja tocava.',
        parking: 'Has triat la furgoneta abans que els arbres. El meu nebot et convida a una canya. Jo, a l’agost, t’envio la meva mare a esperar el bus al teu menjador.',
        festival: 'Cultura fins a les dotze i soroll amb horari. Almenys no ho has anomenat «dinamització de l’espai públic».',
        housing: 'Has dit «construir» i «triga». En un faristol això no se sent: se sent «topall» i «ja». El meu nebot diu que és la primera vegada que li expliquen per què no hi ha pisos.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'No hi estic d’acord en tot. Però has dit què costa. Això, en un faristol, és gairebé exòtic.')
        : speech.picks?.[1] === 'everything' ? 'Arbres, aparcament, festivals i pisos per decret. Rei, això no és un programa: és un decret òmnibus.'
        : 'El tauler deia una cosa i tu una altra. A la tele en diuen «matisar». Aquí, «canviar d’idea entre el pa i l’autobús».';
      const closing = m.pacoLucia ? 'M’ha dit en Paco que li has trobat cambrera. Això no surt a cap argumentari. Surt a la cua del pa, que és on es vota.'
        : (speech.reach || 0) >= 12 ? 'En Dani diu que el vídeo l’han vist milers de persones. Aquí l’han vist dotze. I els dotze estan empadronats. Tu sabràs a qui parles.'
        : 'Bé. Ja tens partit, equip i una senyora que et vigila. Ara sí que ets en política.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Sis cadires. La setena és meva i no entra a la negociació».' : s.memories.pacoLucia ? 'Paco: «La noia ja en sap més de truita que jo. No li diguis».' : 'Paco: «Mira, et diré una cosa: quant costa. I si no ho saps, que no ho saps».',
      lines: [
        { speaker: 'Paco', text: 'Paco, bar L’Última. Aquí es tanquen més pactes que al Congrés, i tots es paguen a escot. Què et poso?', choices: [
          { text: 'Què li demanaries tu a un partit nou?', memory: 'pacoHeard', response: 'Mira, et diré una cosa: que digui quant costen les coses. I si no ho sap, «no ho sé». A la tele no ho he sentit mai. Seria tendència, com diu la meva neboda.' },
          { text: 'Ens deixes cadires per a l’acte?', memory: 'chairs', response: 'Sis. És un préstec, no una subvenció: tornen al seu lloc i tornen netes.' },
          { text: 'Com va el negoci?', memory: 'pacoRent', response: 'M’han apujat el local, la llum i el cafè. Ara un de la tele vol topar el preu del cafè. Doncs posaré «cafè de temporada». Com amb els pisos.' },
        ] },
        { speaker: 'Paco', text: 'I mira aquell cartell: «Es busca cambrer». Hi és penjat des de Setmana Santa. Ja té més antiguitat que la meva cafetera.', choices: [
          { text: 'Has provat de pagar més?', memory: 'pacoWages', response: 'Sí. Apujo el cafè deu cèntims i em cau una ressenya: «atracament». Si me l’apugés Hisenda, se’n diria «redistribuir».' },
          { text: 'És que els joves ja no volen treballar.', memory: 'pacoBlame', response: 'Això deia jo, fins que en va venir un amb tres currículums i una pregunta: «I on visc?». Amb el que pago, al magatzem de les cadires. No va tornar.' },
          { text: 'La Lucía, l’estudiant de la font, busca feina per als caps de setmana.', memory: 'pacoLucia', response: 'La dels apunts en quatre colors? Que vingui. Contracte per escrit i truita de la casa. Has ajuntat dues persones sense crear cap mesa de diàleg. Això és nou.' },
        ] },
        { speaker: 'Paco', text: 'I ara perdona, que la taula del fons demana sangria a les onze del matí. Aquests sí que tenen un programa clar, i el compleixen.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'El tauler, al costat de l’arbre. Una proposta. Si en claves dues ja és un «paquet de mesures», i els paquets, rei, sempre els paga algú.',
        speech: 'Puja ja a la caixa, que es refreda el pa i es refreda la gent. I res de «posar en valor».',
        video: 'L’argumentari d’avui diu «to proper». Més a prop? Si et veig des del forn.',
        crisis: 'El vídeo m’ha arribat pel grup de la parròquia, pel del gimnàs i pel de la meva cunyada. Quan arriba a la meva cunyada, carinyo, ja és oficial.',
        debate: 'Aquesta nit, debat. Si et sento dir «la majoria social», et llanço una barra de pa des de la graderia.',
        finalPrep: 'Última volta. Passa per la parada del bus: la gent que espera té temps i té queixes. Escolta, que ells ja fa estona que parlen.',
      }[s.mission] || 'Jo aquí, amb la meva llibreta. Tu a la teva, que t’estic mirant.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Continuo amb el BOE d’avui. Disposició final setena. Ha mort el majordom».', lines: [
        { speaker: 'Lola', text: 'Mentre us baralleu amb el vídeo, he llegit el BOE. Un decret fica pensions i canvi d’hora al mateix paquet. El nostre cas és més petit: ens miren els comptes amb lupa.', choices: [
          { text: 'Publica’ls. Tots.', memory: 'lolaBooks', response: 'Fins al tiquet del cel·lo. Si ens enxampen, que sigui per un arrodoniment de set cèntims. I en un document a part, no ficat entre les pensions.' },
          { text: 'Millor esperem que passi.', memory: 'lolaWait', response: 'Això en un ministeri es diu «no consta». Les crisis no passen: s’arxiven. I algú les desarxiva la setmana abans de votar.' },
        ] },
      ] },
      default: { after: 'Lola: «Pestanya nova: “Coses que no pagarem”. Dotze files. Cap no diu “s’autofinança”».', lines: [
        { speaker: 'Lola', text: 'He obert el full «Campanya_DEFINITIVA_v3». Ingressos: el pot del grup i quaranta euros que ens deu en Dani. Ell en diu «deute històric».' },
        { speaker: 'Lola', text: 'Despeses: pizzes, impremta i una factura de «consultoria de relat» signada pel cosí d’en Dani. La pago?', choices: [
          { text: 'Ni de broma. Tot amb factura i tot publicat.', memory: 'lolaReceipts', response: 'Gràcies. Si sortim a les notícies, que sigui per avorrits. Transparència de veritat, no un portal que cau el dia que el busques.' },
          { text: 'Paga-la, que el cosí és maco.', memory: 'lolaCousin', response: 'Maco ho és. Te l’apunto a la pestanya «Adjudicacions a dit, versió barri». Ja veuràs que bé queda en un fil.' },
          { text: 'Escolta, Lola… i tu com arribes a final de mes?', memory: 'lolaRent', response: 'Comparteixo pis amb dos opositors. Estudien lleis que canvien abans de l’examen. Jo pago i ells em resumeixen el BOE. Per això soc aquí, d’acord?' },
        ] },
        { speaker: 'Lola', text: 'Au, a taula. Comanda: barbacoa i quatre formatges. La de pinya la va proposar en Dani, però no ha superat el tràmit d’audiència.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Porto tres versions del comunicat. Totes tres comencen per “Davant les informacions aparegudes”».', lines: [
        { speaker: 'Dani', text: 'Quatre-cents comentaris: dos-cents bots, cent de la meva mare defensant-te i cent de gent real molt emprenyada. El clip l’ha penjat un canal de S’ha Acabat La Migdiada.', choices: [
          { text: 'Contesta els de veritat, un per un.', memory: 'daniReply', response: 'Un per un. Sense «lamentem que s’hagi pogut malinterpretar». Passa’m cafè. Si em veus escriure «relat», treu-me el mòbil.' },
          { text: 'Bloqueja tothom i penja un meme.', memory: 'daniMeme', response: 'Fet. Ara el meme té més comentaris que el problema. Els assessors en diuen «canviar el marc». La meva àvia, «fer l’orni».' },
        ] },
      ] },
      default: { after: 'Dani: «Estic amb l’argumentari de demà. Fa dues hores que dubto entre “apostar per” i “continuar apostant per”».', lines: [
        { speaker: 'Dani', text: 'Demà surt el teu primer argumentari. Te’l llegeixo: «Davant del soroll, barri. Davant del relat, fets. Davant de…». Vaja, m’ha quedat una mica frontista.' },
        { speaker: 'Dani', text: 'Et gravo explicant el programa. Format oficial, en mànigues de camisa passejant per un polígon, o amb filtre i la cançó de moda?', choices: [
          { text: 'Sense filtre i sense polígon. Que es vegin les ulleres de no dormir.', memory: 'daniNoFilter', response: 'Valent. Les ulleres són l’única cosa autèntica que queda a internet. Pocs likes, però de gent que existeix.' },
          { text: 'Amb filtre i amb la cançó de moda.', memory: 'daniTrend', response: 'Així m’agrada. Demà ningú no sabrà què proposes, però tothom sabrà que balles com un conseller a la festa major.' },
          { text: 'I tu què tal, amb tantes feines?', memory: 'daniJobs', response: 'Tres clients i la meva mare preguntant quan em faran fix discontinu, que a ella li sona a fix. Això és l’única cosa que faig gratis. I l’única que em ve de gust.' },
        ] },
        { speaker: 'Dani', text: 'Una cosa: l’argumentari l’escric jo, però el corregeix la Marisa. No sé com va entrar al grup. Ja no goso fer-la fora.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Estic muntant cadires. Una es plega sola. Aquesta no vota».', lines: [
        { speaker: 'Nico', text: 'Ha baixat l’Ernesto, el del tercer. Té el pis tancat des d’allò del topall i diu que el vídeo l’anomena especulador. Després m’ha demanat que li regui les plantes.', choices: [
          { text: 'Convida’l a l’assemblea de l’escala. Que doni la seva versió.', memory: 'nicoInvite', response: 'D’acord. Diu que llogaria si sabés que el recupera. O sigui: ell té un pis, el nebot de la Marisa no, i al mig hi ha una llei. Quines coses.' },
          { text: 'Ni cas. És l’enemic.', memory: 'nicoEnemy', response: 'Enemic? És l’Ernesto, de l’escola. Li dec una pilota des de sisè. En Dani li diu «gran tenidor» a l’argumentari. Té un pis. Heretat.' },
        ] },
      ] },
      default: { after: 'Nico: «Vaig a buscar més cel·lo. Aquest enganxa quan vol, com un soci de Govern».', lines: [
        { speaker: 'Nico', text: 'He penjat quaranta cartells. Al costat del de Fox hi havia un cavall de debò, en doble fila. Li n’he enganxat un a ell també. No ha protestat. Primer suport.' },
        { speaker: 'Nico', text: 'Per cert, la Reme diu que vota qui li aconsegueixi hora amb el cardiòleg abans de Nadal. Què li dic?', choices: [
          { text: 'La veritat: que això no s’arregla en un mes, però ho lluitarem.', memory: 'nicoTruth', response: 'Li ho dic. Farà la cara que fan les senyores quan senten la veritat: pena i respecte, a parts iguals. El vot, ja veurem.' },
          { text: 'Digues-li que sí. Hora en una setmana.', memory: 'nicoPromise', response: 'Li promets en una setmana el que la llista d’espera triga mig any. Al desembre, la Reme t’ho recordarà. Amb el bastó.' },
          { text: 'Que vingui a l’assemblea de l’escala i ens ho expliqui a tots.', memory: 'nicoAssembly', response: 'Bona idea. Els del bloc fa anys que es queixen cadascú al seu replà. Junts són una junta de veïns: una investidura, però amb derrama.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ['CAPÍTOL 1', 'Doncs em presento'],
      tv: { headline: 'ELECCIONS!', ticker: 'ÚLTIMA HORA · DISSOLUCIÓ DE LES CORTS · COMPAREIXENÇA SENSE PREGUNTES' },
      subs: [
        [null, 'Diumenge, 23:47. «Un vídeo més i ho deixo».'],
        ['Presentadora (TV)', 'Última hora: el Govern dissol les Corts i convoca generals. La presidenta compareix sense preguntes: «les respostes ja són al web».'],
        ['Presentadora (TV)', 'Els partits de sempre ja graven vídeos en mànigues de camisa. Un ha arribat a cavall. Continuarem informant. O no.'],
        [null, 'BZZZ. Quaranta-tres missatges. «I si ens presentem?». «hahaha». «No, de debò».'],
        ['Tú', 'Eleccions? Una altra vegada? …A veure què diu el grup.'],
      ],
      toast: 'El mòbil no para de vibrar. És a la tauleta, al costat del sofà.',
    },
    plaza: {
      banner: ['EL BARRI', 'Baixar al carrer'],
      subs: [
        [null, 'La plaça: fleca, bar, un banc al sol i més opinions per metre quadrat que un plató.'],
        ['Marisa', 'Mira qui és, el del partit nou! Vine, que t’he d’explicar una cosa.'],
        ['Paco', 'Si has de salvar el barri, que sigui després del cafè. I el cafè es paga, que no és una mesura.'],
      ],
    },
    hq: {
      banner: ['CAPÍTOL 2', 'La seu és el meu menjador'],
      subs: [
        [null, 'La seu: un menjador, una taula plegable i dos endolls. Un funciona. L’altre, «en tràmit».'],
        ['Lola', 'Benvinguts a la seu. El sofà és la sala de premsa; la nevera, la tresoreria. Auditada.'],
        ['Dani', 'He posat «Gabinet» de nom al wifi. Ja tenim estructura.'],
        ['Nico', 'Ordre del dia: u, cadires. Dos, qui porta gel. Tres, el país.'],
      ],
    },
    hall: {
      banner: ['CAPÍTOL 5', 'El debat de la sala polivalent'],
      subs: [
        [null, 'Sala polivalent. Avui: debat. Demà: zumba. A ull, la diferència és petita.'],
        ['moderator', 'Bona nit. Uns quants faristols, un cronòmetre i una gerra d’aigua que ningú no obrirà. Primer bloc: habitatge.'],
        ['tech', 'Vinc amb sentit comú. I amb paciència. Sobretot amb paciència: fa anys que esperem que ens toqui.'],
        ['populist', 'Davant l’onada reaccionària, avancem. En la direcció que toqui aquesta nit.'],
      ],
    },
    victory: {
      banner: ['NIT ELECTORAL', 'Victòria!'],
      verdict: 'SUPERA EL 48!',
      subs: [
        ['Periodista', 'Amb el cent per cent escrutat, tots els partits diuen que han guanyat. Per una vegada, un té raó.'],
        ['Tú', 'Hem… guanyat? Sense argumentari?'],
        ['Ana', 'Discurs! Però curtet, que la Marisa obre a les cinc!'],
      ],
    },
    defeat: {
      verdict: 'NO ARRIBA AL 48',
      subs: [
        ['Periodista', '…i la candidatura del barri es queda fora. Tots els altres, això sí, asseguren que han guanyat.'],
        ['Tú', 'En Dani diu que és «un resultat que ens permet continuar construint».'],
        ['Berto', 'La Marisa ja ho ha traduït: «heu perdut, rei». Escolta, la propera et voto. Si m’ho recordes.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: 'CAPÍTOL 2 · LA SEU ÉS EL MEU MENJADOR', title: 'Comitè de direcció: tres persones i un sofà.',
      intro: state => `Argumentari de les 7:00: «Prioritzar eixos estratègics». Resposta de la Marisa al grup: «Trieu una cosa». Hi ha temps per a una prioritat de veritat; la resta, al grup, on moren les idees.${state.memories.nicoAssembly ? ' En Nico ja ha penjat a l’escala un avís d’assemblea.' : ''}`,
      choices: {
        accounts: { title: 'La Lola revisa cada cost', flavor: 'Pressupost a la vista, fins al tiquet del cel·lo. Ni una línia d’«altres despeses». Menys temps per a xarxes' },
        street: { title: 'En Nico organitza el porta a porta', flavor: 'Replà per replà, amb l’excusa de la derrama de l’ascensor. Sense tauleta ni enquesta: amb timbre' },
        content: { title: 'En Dani munta un petit gabinet', flavor: 'Anell de llum, croma de llençol verd i una paret amb la paraula RELAT en pòsits' },
        tenants: { title: 'Assemblea de veïns a l’escala', flavor: 'Baixa gent que no es parlava des d’allò de les humitats. L’Ernesto, el del pis tancat, també. Ningú no recull les cadires' },
      },
    },
    video: {
      eyebrow: 'CAPÍTOL 4 · FES-HO VIRAL', title: 'La marca està posada. Falta el missatge.',
      intro: state => { const m = state.memories; return `Argumentari de les 7:00: «To proper, missatge clar». La Marisa: «Parla com parles». En Dani calcula tres segons abans que la gent llisqui el dit. L’abast obre portes; la gent distingeix entre atenció i suport.${m.daniNoFilter ? ' Avui, sense filtre.' : m.daniTrend ? ' En Dani ja ha triat la cançó. No preguntis.' : ''}`; },
      choices: {
        explain: { title: 'Explicar la proposta i el que costa', flavor: 'Un minut, pla fix i una pissarra de la Lola amb la lletra petita en gran' },
        chairs: { title: 'El ball de les cadires d’en Paco', flavor: 'Coreografia amb cadires prestades. Ningú no sap què proposes; tothom sap que caus al segon onze' },
        neighbor: { title: 'Deixar parlar la Marisa', flavor: 'Ella parla de la calor, del local que li han apujat i de la cita de la seva mare. Tu aguantes el mòbil i calles' },
        debunk: { title: 'Desmuntar la bola del dia', flavor: 'Un canal de S’ha Acabat La Migdiada diu que vols prohibir les terrasses. Ho desmenteixes amb el pla sencer, que és l’arma secreta' },
      },
    },
    crisis: {
      eyebrow: 'CAPÍTOL 5 · CRISI',
      title: (state, ctx) => ctx.contradiction ? 'El teu «tot per a tothom» ha arribat abans que la premsa.' : 'Un vídeo retallat ha arribat abans que la veritat.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Algú ha penjat el moment en què ho prometies tot alhora. Música de tràiler, títol en majúscules i un rètol: «LA MARISA HO TRADUEIX». No ha estat ella. Però ho subscriu.'
        : 'Circula un clip de nou segons tallat just abans que expliquessis el cost. Sobrevisc el comparteix amb «Això és el que hi ha al darrere». Pacient, amb «Sense comentaris». Que és un comentari.'}${state.memories.nicoPromise ? ' I la Reme ha trucat: continua sense hora.' : ''} Previsió actual: <b>${ctx.forecast.score}/100</b>. Se’n necessiten ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Donar la cara: reconèixer l’error i corregir-lo', flavor: 'Vídeo sense música i sense «s’ha tret de context». Amb preguntes, que ja és gairebé un escàndol' },
        team: { title: 'Publicar costos i responsables', flavor: 'La Lola penja els comptes; en Nico, qui fa què. Avorrit, comprovable i difícil de retallar' },
        distract: { title: 'Sortejar una fregidora d’aire', flavor: 'Per participar: seguir el compte, mencionar tres amics i oblidar el tema. Als manuals, «marcar agenda pròpia»' },
        blame: { title: 'Culpar la màquina del fang', flavor: 'Bots, algoritme i «les clavegueres». Funciona amb els teus. Els altres reconeixen el truc: el fan servir tots els partits' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTOL 5 · EL DEBAT', title: 'Tres rivals, una moderadora i una gerra sense obrir.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `A un costat, ${populist.name}, del ${populist.party}, amb dos argumentaris: el del matí i el de la tarda. A l’altre, ${tech.name}, del ${tech.party}, que promet derogar coses que no anomena. Al fons, ${hard?.name || 'Covadonga del Muro'}, de Fox, que ha intentat entrar a cavall. ${moderator}: «A què renuncia el seu programa?».`,
      choices: {
        tradeoff: { title: 'Defensar la renúncia concreta', flavor: (state, { rivals }) => `Dius què perds i a qui molestes. ${rivals.tech.name} demana «una dada». Li la dones. L’apunta per derogar-la` },
        attack: { title: (state, { rivals }) => `Treure-li l’hemeroteca a ${rivals.populist.name}`, flavor: 'Li llegeixes el que va dir fa dues campanyes. Aplaudiment fàcil, titular fàcil, zero propostes. Ella: «Rectificar és de savis»' },
        manage: { title: 'Donar torns i desmuntar xifres amb calma', flavor: (state, { rivals }) => `${rivals.tech.name} promet abaixar impostos «a partir del segon any, si l’herència ho permet». Preguntes de quin any. Silenci. Aigua` },
        promise: { title: 'Prometre topar el lloguer a la meitat «per decret»', flavor: (state, { rivals }) => `El públic aplaudeix. ${rivals.populist.name} et mira amb enveja professional. ${rivals.moderator}: «Queda dit»` },
      },
    },
    finalPrep: {
      eyebrow: 'CAPÍTOL 6 · ÚLTIMA VOLTA', title: 'Encara queda marge.',
      intro: (state, ctx) => `Previsió: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'per sobre' : 'per sota'} del llindar). Queden dos dies. L’enquesta oficial us dona «al voltant de zero»; sempre l’encerta a favor de qui l’encarrega. Argumentari: «Mobilitzar el vot útil». La Marisa: «Que hi vagi la gent». Només hi ha temps per a una cosa ben feta.`,
      choices: {
        listen: { title: 'Visitar els que encara dubten', flavor: state => `La parada del bus, la cua del CAP i la senyora de la bossa, que ja coneix el que la hi va robar: coincideixen cada mes al jutjat${state.memories.nicoAssembly || state.memories.nicoInvite ? '. L’assemblea de l’escala et demana que tornis' : ''}. Escoltes més que no parles` },
        receipts: { title: 'Publicar el pressupost definitiu', flavor: 'La Lola l’imprimeix en A3: «la transparència també és mida de lletra». Sense annexos que surtin a l’agost' },
        volunteers: { title: 'Ordenar voluntaris i col·legis', flavor: state => `En Nico reparteix torns, entrepans i un mapa de col·legis dibuixat en un tovalló${state.memories.pacoLucia ? '. La Lucía, la cambrera d’en Paco, s’apunta d’interventora' : ''}. Sense autocars de simpatitzants: amb el bus de línia` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTOL 6 · L’ÚLTIM MÍTING', title: 'Una frase abans de la jornada de reflexió.',
      intro: 'Cadires plegables, un globus que es desinfla i una periodista del diari local amb cara de tercer míting avui. Als altres tancaments hi ha autocars i banderes; aquí, el del butà. Consolida el que has après o torna a prometre-ho tot.',
      choices: {
        account: {
          title: state => ({
            shade: '“Hi haurà ombra i hi haurà menys cotxes. Això triem, això costa i aquí en respondrem.”',
            parking: '“El barri podrà treballar, encara que aquest estiu continuï sense arbres. Això triem i aquí en respondrem.”',
            festival: '“Hi haurà cultura i hi haurà soroll pactat. Això triem, això costa i aquí en respondrem.”',
            housing: '“Hi haurà més pisos perquè els construirem, no perquè els anunciem. Trigarà. I aquí en respondrem.”',
          }[state.proposal] || '“Això triem, això costa i aquí en respondrem.”'),
          flavor: 'Ho dius sense papers. La Marisa obre la llibreta i, per primera vegada, no apunta res',
        },
        viral: { title: '“Menys cotxe i més gaspatxo!”', flavor: 'En Dani ho emet en directe. Es corea. Ningú no sap què vol dir. A les dotze ja ho han copiat tres partits' },
        everything: { title: '“Demà hi haurà de tot per a tothom, per decret.”', flavor: (state, { rivals }) => `Aplaudiment enorme. La Lola es tapa la cara amb el pressupost. ${rivals.populist.name} t’escriu: «En parlem?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'NIT ELECTORAL · VICTÒRIA', title: 'Hi ha més cadires que persones.',
      text: state => `La Marisa aplaudeix una vegada. La Lola pregunta qui ha guardat les factures. Pacient i Sobrevisc ja han trucat dues vegades: «Què oferiu?». A les 7:00 arriba l’últim argumentari d’en Dani: «Hem guanyat». La Marisa contesta: «Això ho entenc». ${{
        shade: 'Demà comença el més difícil: explicar a la furgoneta del nebot on aparca.',
        parking: 'Demà comença el més difícil: el primer agost sense arbres amb el teu nom a la placa.',
        festival: 'Demà comença el més difícil: la primera reunió amb els del primer, que ja t’han portat taps.',
        housing: 'Demà comença el més difícil: la primera llicència. L’Ernesto pregunta si pot llogar el tercer abans que s’acabi la legislatura.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NIT ELECTORAL · DERROTA', title: 'Un resultat que ens permet continuar construint.',
      reasons: {
        support: 'Va faltar suport directe: el barri et va veure més al mòbil que al replà.',
        credibility: 'Les contradiccions van pesar: a la cua del pa no hi ha hemeroteca, però hi ha memòria.',
        organization: 'L’equip va arribar desordenat: un col·legi sense interventor i un altre amb tres.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: 'MINIJOC · FES-HO VIRAL', title: 'Gravant a la marca.', goWord: 'Acció!',
      lanes: ['Salutació', 'Amunt!', 'Palmes', 'No consta'],
      takes: {
        explain: 'Pissarra de la Lola, pla fix i cada gest subratlla un cost.',
        chairs: 'El ball de les cadires. En Paco mira amb els braços plegats.',
        neighbor: 'La Marisa parla de la calor; tu, al darrere, marques el ritme sense que es noti. Es nota.',
        debunk: 'Desmuntes la bola amb gestos clars: això no, això sí, això costa.',
      },
      intro: (state, ctx) => `Mòbil al trípode, veïns mirant i en Dani comptant. ${ctx.take} Fes cada posa quan la seva icona arribi al cercle. El ritme suma abast, no vots.`,
      titles: { great: 'Viral! Sumands ja t’ha ofert ser un pètal.', ok: 'Es comparteix en tres grups de WhatsApp. Un és el de la teva mare.', bad: 'Quaranta visualitzacions. En Dani en diu «impacte qualitatiu».' },
      texts: { ok: 'En Dani ja hi posa subtítols en groc. La presa és bona: l’abast obre portes, però els vots es guanyen a l’escala.', bad: 'T’has perdut entre la salutació i les palmes. Repeteix la presa: de moment, «no consta».' },
    },
    duel: {
      eyebrow: 'MINIJOC · DUEL DE RÈPLIQUES', title: 'Cinc preguntes, un cronòmetre.',
      intro: (state, ctx) => `${ctx.rounds} rèpliques. Tria la resposta que defensa alguna cosa concreta i n’assumeix el cost abans que s’acabi el temps. A mig camí, algú t’interromprà: demana la paraula.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'A qui aparca en doble fila i a dues taules de la terrassa d’en Paco. Ombra a canvi de cotxes, dit clar.',
          parking: 'Al banc al sol: aquest estiu continuarà sense arbres. Triem que el barri pugui treballar.',
          festival: 'Als del primer, dues nits per setmana. Amb horari pactat i taps de regal, literalment.',
          housing: 'A la plaça, que continua sense ombra, i a la nostra paciència: construir triga més que una legislatura. I ens diran «els dels propietaris».',
        }[state.proposal];
        return [
          { topic: 'Habitatge', role: 'populist', claim: 'Gràcies a la nostra llei, a les zones tensionades el lloguer s’ha estabilitzat. Els pisos que falten els amaga l’especulació.',
            options: ['Si està «estabilitzat», per què fa un any que el tercer és tancat? Topar no fa pisos. Construir, sí, encara que trigui més que un titular.', 'Doncs nosaltres el topem a la meitat! I el pa!', 'Vostè porta una xapa de colors. Ho sap tot el barri.'], correct: 0 },
          { topic: 'Dades', role: 'tech', claim: 'Segons un informe que no he portat, la seva proposta enfonsarà el barri. Ho diu aquest gràfic. El de la fletxa vermella.',
            options: ['I segons el meu, el seu gràfic és una bola. Empat tècnic.', 'Bé, les dades són relatives. Com les enquestes.', 'Ensenyi la font. La nostra: el pressupost de la Lola, pàgina dos, amb foto del banc a les cinc de la tarda.'], correct: 2 },
          { topic: 'La seva proposta', role: 'moderator', claim: 'Pregunta directa: a qui perjudica la seva proposta? Minut d’or. Bé, deu segons de bronze.',
            options: ['A ningú. És una proposta transversal, sense perdedors, com un anunci de colònia.', cost || 'A algú segur. Ho direm amb noms i cognoms quan ho sapiguem.', 'Als de sempre, que ja saben qui són.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'La promesa', role: 'populist', claim: 'Vostè va prometre a una flequera ombra, aparcament i un pis per al seu nebot! Això és populisme. I ho dic amb coneixement de causa.',
                options: ['És veritat. Em vaig equivocar prometent-ho tot; després vam triar una cosa i n’expliquem el cost.', 'S’ha tret de context. El context era jo prometent-ho tot.', 'Vostè també ho promet tot. Empat.'], correct: 0 }
            : { topic: 'Sanitat', role: 'tech', claim: 'I la sanitat? O només li importa la seva plaça? Nosaltres gestionarem. Molt. Amb gestió.',
                options: ['Prometo que demà no hi haurà llistes d’espera. Paraula.', 'Ens importa. Per això no prometem el que no gestionem: portarem la cita de la Reme al ple, amb nom i data.', 'Ho derogarem tot, com vostè. Ja veurem què.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: 'Perdoni! Això és cosa de la màquina del fang. Ho dic sense haver-ho sentit sencer.',
        tech: 'Si em permet… com deia aquest matí un diari… li’l llegeixo sencer…',
        moderator: 'Li queden deu segons. Nou. Queda dit.',
        fallback: 'Perdoni, perdoni!',
      },
      floor: 'Deixi’m acabar, que això no és una roda de premsa.',
      floorBabble: 'Deixi’m acabar',
      reactions: {
        timeout: 'S’ha acabat el temps. Queda dit. Bloc següent.',
        quick: 'Resposta concreta i a temps. Insòlit. En prenc nota.',
        slow: 'Concreta, tot i que justeta de temps.',
        wrong: 'Gràcies per donar-me la raó. Ho posaré a l’argumentari.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} assenteix. I no diu «queda dit».`, mid: 'Has aguantat el tipus. Sense xuleta.', low: 'Demà els rivals diran que han guanyat. Avui, amb motiu.' },
      text: 'L’estratègia que vas triar marca el debat; les rèpliques decideixen si et creuen.',
    },
    chairs: {
      eyebrow: 'MINIJOC · SIS CADIRES', title: 'Préstec, no subvenció.',
      intro: (state, ctx) => `Per a l’última assemblea calen les sis cadires d’en Paco, escampades pel barri. Passa per sobre d’una per agafar-la i porta-la a la rotllana. D’una en una: «l’esquena també vota», diu en Nico. Tens ${ctx.time} segons.`,
      hints: {
        start: 'Passa per sobre d’una cadira per agafar-la.',
        carry: 'Ara, a la rotllana groga.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. Va, la següent.`,
        full: 'Rotllana completa!',
      },
      titles: { all: 'Sis cadires a la rotllana. En Paco, conforme.', mid: 'Mitja rotllana. La resta, drets i opinant.', low: 'En Paco recull les cadires ell mateix. I ho comenta.' },
      texts: { all: 'En Nico apunta el temps al tovalló. Organitzar és això: que hi hagi lloc quan arriba la gent.', other: 'Les que falten continuen per la plaça. Repeteix: ningú no ha vist res, tret d’en Paco.' },
    },
    rally: {
      eyebrow: 'MINIJOC · L’ÚLTIM MÍTING', title: 'Que no se t’escapi la sala.', goWord: 'Parla!', lane: 'Remata la frase',
      intro: 'Cada frase té un remat. Prem quan la paraula arribi al cercle: el públic aplaudeix i l’atenció puja. Si falles, algú mira el mòbil. O pitjor: xiula.',
      phrases: state => {
        const own = {
          shade: ['Aquest estiu, la plaça tindrà', 'OMBRA'], parking: ['Qui treballa en aquest barri podrà', 'DESCARREGAR'],
          festival: ['El jovent tindrà local i la plaça,', 'CULTURA'], housing: ['Els pisos no s’anuncien: es', 'CONSTRUEIXEN'],
        }[state.proposal] || ['Una cosa ben feta, per', 'COMENÇAR'];
        return [
          ['Bona nit. Gràcies per venir sense autocar i amb', 'CADIRA'],
          ['No vinc amb argumentari: vinc amb', 'UNA COSA'],
          own,
          ['I sí: té un cost. L’hem posat per', 'ESCRIT'],
          ['Sense observatori, sense comissió i sense', 'LOGO'],
          ['Ningú aquí no us ha dit que això es pagui', 'SOL'],
          ['Si no complim, ja sabeu on és el', 'FORN'],
          ['Aquesta nit la Marisa no té res a', 'TRADUIR'],
          ['Diumenge no us demano fe: us demano que', 'VOTEU'],
          ['A qui vulgueu. Però que no decideixi el', 'SOFÀ'],
          ['Gràcies, barri. I ara, les cadires, cap a', 'CAL PACO'],
          ['Doncs sí: em', 'PRESENTO!'],
        ];
      },
      titles: { great: 'La sala dreta. Els que tenen cadira, també.', ok: 'Aplaudiments sincers i algun badall.', bad: 'S’ha sentit un mòbil. Era l’argumentari.' },
      text: 'El públic recordarà com ho vas dir; la decisió que has pres decideix què recorda.',
    },
  },
};
