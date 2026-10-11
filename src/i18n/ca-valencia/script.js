// Guion · Valencià (ca-valencia). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte cae en: ca → es.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
//
// Traduce el guion EFECTIVO (actual + b): donde b.js sobrescribe, se adapta b.js; lo que solo está en actual.js
// (p. ej. travel.*.prompt/loading/sign) se adapta de actual.js. `rivals` no se toca: nombres propios de partidos y
// candidatos inventados (Partido Paciente, Partido Sobrevivo Otra Elección, Fox) se quedan como marca.
// Hablante del protagonista: siempre 'Tú' (clave interna).

const PROPOSAL_DEFAULT = 'Una cosa ben feta, per a començar.';

export default {
  // ------------------------------------------------------------------------------------------------ Fox (tercer faristol)
  foxDebate: {
    hallLine: 'He deixat el cavall en doble fila. Si se l’emporta la grua, és ideologia.',
    interruption: 'Excuse me! Sense complexos: o em deixa parlar o m’alce i me’n vaig. Tinc pràctica eixint de governs.',
    round: {
      topic: 'Seguretat', role: 'hard',
      claim: 'Al que li furta la bossa a la senyora de la parada l’han detingut onze vegades. Onze. I el Govern, en compte de jutges, obri un observatori. Vosté què faria?',
      options: [
        'Que reincidir no isca gratis: judici ràpid i que no isca per la mateixa porta el mateix dia. I jutges, que costen diners. Ho diem.',
        'Mà dura! I un cavall per barri!',
        'Parlem de les causes. De les onze.',
      ],
      correct: 0,
    },
    reactions: {
      right: 'Home. Això no és de dreteta covard. Per esta vegada.',
      wrong: 'Ho veu? Sense complexos es pensa més ràpid. Li deixe el cavall.',
      timeout: 'Mentres vosté pensa, l’Espanya que matina ja se n’ha anat a dormir.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'ELECCIONS GENERALS · ARGUMENTARI INCLÒS',
    tagline: 'Els altres partits tenen assessors. Tu tens una fornera que traduïx.',
  },

  chapters: ['Pues me presento', 'La seu és el meu menjador', 'Baixar al carrer', 'Fes-ho viral', 'S’ha tret de context', 'L’últim míting'],

  // ------------------------------------------------------------------------------------------------ missions
  missions: {
    phone: { title: 'Compareixença al sofà', objective: 'Acosta’t al mòbil, al costat del sofà. Polsa E.' },
    call: { title: 'Ronda de consultes', objective: 'Usa el portàtil de la taula per a cridar els teus amics.' },
    register: { title: 'Constituïts a tots els efectes', objective: 'Ves a la carpeta de l’escriptori i registra el partit.' },
    leave: { title: 'Presa de contacte amb la realitat', objective: 'Ix per la porta verda per a baixar a la plaça.' },
    neighbor: { title: 'Procés d’escolta (de veres)', objective: 'Parla amb Marisa, al costat del tendal del forn. Paco, a la terrassa del bar, també té coses a contar.' },
    program: { title: 'No tot cap en un decret', objective: 'Tria la teua primera proposta al tauler de la plaça.' },
    speech: { title: 'Primera compareixença, amb públic', objective: 'Puja al punt del faristol i fes el teu primer discurs.' },
    aftermath: { title: 'La cua del forn fa l’anàlisi', objective: 'Torna amb Marisa per a saber què es comenta a la cua del forn.' },
    hqBrief: { title: 'La seu és el meu menjador', objective: 'Reunix l’equip a la taula de campanya. Lola, Dani i Nico també volen parlar amb tu.' },
    video: { title: 'Fes-ho viral (amb missatge, si pot ser)', objective: 'Grava un vídeo a la marca del costat del forn.' },
    crisis: { title: 'Això no és exactament el que vaig dir', objective: 'Afronta la crisi al tauler. Abans, potser convé escoltar l’equip.' },
    debate: { title: 'El debat del saló', objective: 'Entra al debat amb els rivals.' },
    finalPrep: { title: 'Última volta pel barri', objective: 'Tria al mapa on concentrar l’últim esforç.' },
    finalSpeech: { title: 'L’últim míting, sense autobusos', objective: 'Tanca la campanya davant del públic.' },
    election: { title: 'La nit de les cadires', objective: 'Consulta el resultat electoral.' },
    complete: { title: 'Campanya completada', objective: 'La campanya s’ha acabat.' },
  },

  // Trajectes a peu: títol i objectiu (de b.js); prompt, loading i sign (d’actual.js).
  travel: {
    hqBrief: { title: 'Desplaçament institucional', objective: 'La seu està al baix del portal del costat del bar de Paco. Ves a la porta i polsa E.', prompt: 'Portal · Entrar a la seu', loading: 'ENTRANT A LA SEU…', sign: 'SEU' },
    video: { title: 'Eixir als mitjans (a la plaça)', objective: 'Per a gravar calen llum i veïns. Ix per la porta de la seu i baixa a la plaça.', prompt: 'Porta · Baixar a la plaça', loading: 'BAIXANT A LA PLAÇA…', sign: 'PLAÇA' },
    crisis: { title: 'Reunió d’urgència, amb carmanyola', objective: 'Alguna cosa crema al grup de la seu. Torna pel portal del costat del bar.', prompt: 'Portal · Tornar a la seu', loading: 'PUJANT A LA SEU A CORRE-CUITA…', sign: 'SEU' },
    debate: { title: 'Trasllat al saló multiús', objective: 'Ix per la porta de la seu. Al saló multiús ja han muntat els faristols.', prompt: 'Porta · Anar al saló multiús', loading: 'CAMÍ DEL SALÓ MULTIÚS…', sign: 'SALÓ' },
    finalPrep: { title: 'Trepitjar territori', objective: 'Ix del saló per la porta doble. Queda una setmana i es guanya al carrer.', prompt: 'Porta · Tornar a la plaça', loading: 'TORNANT AL BARRI…', sign: 'PLAÇA' },
    finalSpeech: { title: 'Transport públic, com el votant mitjà', objective: 'Ves a la parada del costat del quiosc i agafa el 27 fins al saló multiús.', prompt: 'Parada · Agafar el 27 al saló', loading: 'ARRIBA EL 27. TARD, PERÒ ARRIBA…', sign: 'BUS 27' },
  },

  // ------------------------------------------------------------------------------------------------ propostes
  proposals: {
    shade: { title: 'Ombra abans que un observatori de la calor', cost: '2 de pressupost', benefit: 'Arbres, tendals, una font que funcione i el baix buit de la cantonada com a sala fresca per als majors. Sense pla director: amb jardiner.', compromise: 'Es perden places d’aparcament, la terrassa de Paco encongix dues taules i el nebot de Marisa torna a la doble fila.' },
    parking: { title: 'Que el barri puga treballar', cost: '2 de pressupost', benefit: 'Càrrega i descàrrega amb horari, places rotatòries per al comerç, aparcabicis per als repartidors i llicències de terrassa en dies, no en trimestres.', compromise: 'Més cotxes a la plaça i un altre agost a ple sol. El banc continuarà bullint.' },
    festival: { title: 'Cultura després de les huit', cost: '2 de pressupost', benefit: 'Escenari per als grups del barri, cine d’estiu i un local d’assaig que gestiona l’associació de veïns, no una fundació amb logo.', compromise: 'Soroll dues nits per setmana; els del primer, amb taps. L’ombra i la càrrega i descàrrega, al calaix.' },
    housing: { title: 'Que el tercer torne a tindre veïns', cost: '2 de pressupost', benefit: 'Llicències en setmanes, construir al solar de la cantonada i que llogar un pis tancat no faça por.', compromise: 'Construir tarda més que anunciar un topall. No ix al telenotícies, et diran «el dels propietaris» i la plaça continua sense ombra.' },
  },

  // ------------------------------------------------------------------------------------------------ videocridada
  friends: {
    lola: { role: 'Llig el BOE per gust', line: 'Treballe en una gestoria i llig el BOE al metro, com qui llig novel·la negra: el mort sempre està en la disposició addicional. Et porte els comptes.', choices: [
      { label: 'Tresoreria. Tu decidixes quan és que no.', reply: 'Accepte. Primera norma: ací res «es finança amb creixement». Es finança amb diners, que és més avorrit, però existix.' },
      { label: 'Estratègia. Que algú llija la lletra menuda.', reply: 'Fet. La lletra menuda és on els governs amaguen l’important. La gran és per al cartell.' },
    ] },
    dani: { role: 'Parla en fil', line: 'Faig vídeos per a una clínica dental i un gimnàs. M’he llegit tots els fils d’«exassessor de campanya» que existixen. Vosaltres poseu les idees; jo vos faig el relat.', choices: [
      { label: 'Comunicació. Relat sí, fum no.', reply: 'Tracte. Cada matí a les 7:00, argumentari al grup. Curt, clar i sense la paraula «resiliència». Bé, quasi sense.' },
      { label: 'Portaveu. Hauràs de contestar preguntes.', reply: 'Rodes de premsa amb preguntes? Això ja no ho fa ningú. Val: serem vintage.' },
    ] },
    nico: { role: 'Coneix tot el portal', line: 'Faig torns en un magatzem i conec tot el portal. Jo mobilitze. Però si algú diu «transversal» en una reunió, baixe a per pipes.', choices: [
      { label: 'Organització. Tu poses els horaris.', reply: 'Fet. Reunions de vint minuts. Si dura més, és que algú està llegint un argumentari.' },
      { label: 'Actes. Necessitem la teua veu de megàfon.', reply: 'Quan va tocar la grossa de Nadal al bar, va baixar el carrer sencer en sabatilles. Dona’m un motiu així i t’omplic la plaça.' },
    ] },
  },

  call: {
    title: 'Ronda de consultes. Per videocridada.',
    you: 'Ha tingut una idea',
    next: 'Següent valent',
    done: 'Ja tenim equip. Dani ha creat el grup «Argumentari 7:00». I, sense voler, hi ha ficat Marisa, la del forn.',
    doneBabble: 'Ja tenim equip.',
    finish: 'Baixar a la plaça',
  },

  register: {
    eyebrow: 'FUNDACIÓ · FINESTRETA ÚNICA',
    title: 'Un nom per a la papereta.',
    stamp: 'PENDENT D’ESMENA',
    intro: 'Tres camps. Ni certificat digital, ni cita prèvia, ni annex III. Si açò és un somni, que no es desperte ningú del Ministeri.',
    defaultName: 'La Gent del Banc',
    defaultSlogan: PROPOSAL_DEFAULT,
    submit: 'Registrar la candidatura',
    toast: 'REGISTRAT. Resolt en zero dies hàbils. Ningú de la finestreta sap com ha passat.',
  },

  program: {
    eyebrow: 'PROGRAMA · PRESSUPOST: 2 CRÈDITS',
    title: 'Prioritzar: triar, però amb corbata.',
    intro: 'Només hi cap una proposta. Les altres no es «calendaritzen» ni es «posposen a una segona fase»: es queden sense fer. El barri sap distingir-ho.',
    promisedBothNote: 'Marisa recorda que vas prometre ombra, aparcament i pis per al seu nebot. Cap opció paga tot això. −6 de credibilitat en concretar.',
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Ara, a explicar-ho al faristol. Amb preguntes.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurs
  speech: {
    headings: ['Bé. Doncs ací estem.', 'Què defendràs?', 'L’última frase compta.'],
    parts: {
      opening: { title: '01 / Trencar el gel', prompt: 'Set persones. Dues esperen el bus, una ha baixat a per pa i una altra et grava per si dius «resiliència».', options: {
        listen: 'Abans de parlar, he vingut a escoltar. De veres, no en «procés d’escolta».',
        joke: 'Seré breu. Ho dic com a polític, així que poseu-vos còmodes.',
        grand: 'Hui iniciem un full de ruta transversal cap a un nou horitzó de país!',
      } },
      argument: { title: '02 / Dir alguna cosa concreta', prompt: 'Ara toca defendre el que has clavat al tauler. Marisa ja ha tret la llibreta.', options: {
        shade: 'Ombra i un lloc fresc per als majors, encara que perdem aparcament. Sense pla director: amb arbres.',
        parking: 'Que qui treballa puga descarregar, encara que la plaça continue sense arbres este estiu.',
        festival: 'Cultura i un local per als xavals, amb horari de soroll pactat i per escrit.',
        housing: 'Més pisos: sòl, llicències ràpides i que llogar no faça por. No baixa dilluns; baixa construint.',
        everything: 'Arbres, aparcament, festivals i un pis per a cadascú, gratis i en un decret dilluns!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'Marisa mira el rellotge. És un rellotge que ha vist moltes campanyes.', options: {
        accountable: 'Si no ho complim, ens ho pregunteu ací. I contestarem, que ja és novetat.',
        chant: 'Menys embussos i més gaspatxo!',
        forever: 'Per a concloure, i en nom de la brevetat, els meus vint-i-set eixos següents…',
      } },
    },
    timing: { eyebrow: '04 / EL COP FINAL', title: 'Ara. Amb convicció.', button: 'I per això em presente!' },
    result: {
      eyebrow: 'EL BARRI HA ESCOLTAT',
      goodTitle: 'Un aplaudiment. Sense claca.',
      badTitle: 'Aplaudiment de cortesia. A la tele, «bona acollida».',
      coherent: 'Has defés la teua proposta i has dit el que costa. En política això té un nom estrany: dir la veritat.',
      incoherent: 'El teu discurs no coincidix amb el programa. A la tele en diuen «matisar». A la cua del forn, una altra cosa.',
      fine: 'L’abast mesura atenció, no vots. Les conseqüències depenen del que has dit.',
      button: 'Baixar del faristol',
    },
  },

  // ------------------------------------------------------------------------------------------------ diàlegs
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: 'Tu eres el del partit nou? M’ha arribat el vostre argumentari: Dani em va ficar al grup sense voler. El llig a les cinc, amb la primera fornada.' },
      { speaker: 'Marisa', text: 'El meu nebot repartix i no té on parar. Trenta-quatre anys, a l’habitació de xicotet. I el tercer porta tancat des d’allò de la llei. Per on comences?', choices: [
        { text: 'Per escoltar-te. Què et lleva la son?', memory: 'listened', response: 'A mi? La paciència. La cita de ma mare és per a d’ací uns mesos, i l’espera, al sol.' },
        { text: 'Per tot: ombra, aparcament i un pis per al teu nebot.', memory: 'promisedBoth', response: 'Això a la tele es diu «paquet integral de mesures». Ací, «ja ho vorem». Ho apunte a la llibreta.' },
        { text: 'Per fer soroll: un festival que ens pose al mapa.', memory: 'spectacle', response: 'Al mapa? Si eixim en totes les webs de pisos turístics: «autèntic barri de tota la vida». L’únic de tota la vida que queda soc jo, i tanque a les dos.' },
      ] },
      { speaker: 'Marisa', text: 'Allí tens el tauler. Dona per a una cosa. Una. I al faristol, res de «posar en valor» ni «full de ruta». Si ho dius, et tire una barra de pa.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Em vas prometre ombra, aparcament i pis per al meu nebot. Tres coses i cap data. Pàgina dotze de la llibreta.'
        : m.listened ? 'Abans m’has escoltat. Pareix poc, però els que vénen amb el discurs plastificat no alcen la vista del paper.'
        : m.spectacle ? 'Allò del festival ho ha sentit tot el barri. Els del primer ja pregunten si els taps van en el programa o en un reial decret.'
        : 'Ja has baixat del calaix. Et tremolaven les cames menys que al de l’any passat. I el de l’any passat portava autobús de simpatitzants.';
      const coherent = {
        shade: 'Has dit que lleves cotxes per a posar ombra. El meu nebot ja no et parla; ma mare ja et defén. Has triat. Ja era hora.',
        parking: 'Has triat la furgoneta abans que els arbres. El meu nebot et convida a una canya. Jo, a l’agost, t’envie ma mare a esperar el bus al teu menjador.',
        festival: 'Cultura fins a les dotze i soroll amb horari. Almenys no ho has anomenat «dinamització de l’espai públic».',
        housing: 'Has dit «construir» i «tarda». En un faristol això no se sent: se sent «topall» i «ja». El meu nebot diu que és la primera vegada que li expliquen per què no hi ha pisos.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'No estic d’acord en tot. Però has dit què costa. Això, en un faristol, és quasi exòtic.')
        : speech.picks?.[1] === 'everything' ? 'Arbres, aparcament, festivals i pisos per decret. Rei, això no és un programa: és un decret òmnibus.'
        : 'El tauler deia una cosa i tu una altra. A la tele en diuen «matisar». Ací, «canviar d’idea entre el pa i l’autobús».';
      const closing = m.pacoLucia ? 'M’ha dit Paco que li has trobat cambrera. Això no ix en cap argumentari. Ix a la cua del forn, que és on es vota.'
        : (speech.reach || 0) >= 12 ? 'Dani diu que el vídeo l’han vist milers. Ací l’han vist dotze. I els dotze estan empadronats. Tu sabràs a qui li parles.'
        : 'Bé. Ja tens partit, equip i una senyora vigilant-te. Ara sí que estàs en política.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Sis cadires. La setena és la meua i no entra en la negociació».' : s.memories.pacoLucia ? 'Paco: «La xica ja sap més de truita de creïlla que jo. No li ho digues».' : 'Paco: «Mira, et dic una cosa: quant costa. I si no ho saps, que no ho saps».',
      lines: [
        { speaker: 'Paco', text: 'Paco, bar L’Última. Ací es tanquen més pactes que al Congrés, i tots es paguen a escot. Què et pose?', choices: [
          { text: 'Què li demanaries tu a un partit nou?', memory: 'pacoHeard', response: 'Mira, et dic una cosa: que diga quant costa. I si no ho sap, «no ho sé». A la tele no ho he sentit mai. Seria tendència, que diu la meua neboda.' },
          { text: 'Ens deixes cadires per a l’acte?', memory: 'chairs', response: 'Sis. És un préstec, no una subvenció: tornen al seu lloc i tornen netes.' },
          { text: 'Com va el negoci?', memory: 'pacoRent', response: 'M’han apujat el local, la llum i el café. Ara un de la tele vol topar el preu de l’esmorzaret. Doncs posaré «esmorzar de temporada». Com amb els pisos.' },
        ] },
        { speaker: 'Paco', text: 'I mira eixe cartell: «Es busca cambrer». Porta penjat des de Pasqua. Ja té més antiguitat que la meua cafetera.', choices: [
          { text: 'Has provat a pagar més?', memory: 'pacoWages', response: 'Sí. Puge el cremaet deu cèntims i em cau una ressenya: «atracament». Si me’l pujara Hisenda, es diria «redistribuir».' },
          { text: 'És que els joves ja no volen treballar.', memory: 'pacoBlame', response: 'Això deia jo, fins que en va vindre un amb tres currículums i una pregunta: «i on visc?». Amb el que pague, al magatzem de les cadires. No va tornar.' },
          { text: 'Lucía, l’estudiant de la font, busca alguna cosa per als caps de setmana.', memory: 'pacoLucia', response: 'La dels apunts en quatre colors? Que vinga. Contracte per escrit i truita de la casa. Has ajuntat dues persones sense crear una taula de diàleg. Això és nou.' },
        ] },
        { speaker: 'Paco', text: 'I ara perdona, que la taula del fons demana aigua de València a les onze del matí. Eixos sí que tenen un programa clar, i el complixen.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'El tauler, al costat de l’arbre. Una proposta. Si en claves dues ja és un «paquet de mesures», i els paquets, rei, sempre els paga algú.',
        speech: 'Puja ja al calaix, que es refreda el pa i es refreda la gent. I res de «posar en valor».',
        video: 'L’argumentari de hui posa «to proper». Més proper? Si et veig des del forn.',
        crisis: 'El vídeo m’ha arribat pel grup de la parròquia, el del gimnàs i el de la meua cunyada. Quan arriba a la meua cunyada, rei, ja és oficial.',
        debate: 'Esta nit, debat. Si et sent dir «la majoria social», et tire una barra de pa des de la grada.',
        finalPrep: 'Última volta. Passa per la parada del bus: la gent que espera té temps i té queixes. Escolta, que ells ja porten una estona parlant.',
      }[s.mission] || 'Jo ací, amb la meua llibreta. Tu a la teua, que t’estic mirant.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Continue amb el BOE de hui. Disposició final setena. Ha mort el majordom».', lines: [
        { speaker: 'Lola', text: 'Mentres vos baralleu amb el vídeo, he llegit el BOE. Un decret fica pensions i canvi d’hora en el mateix paquet. Lo nostre és més menut: ens miren els comptes amb lupa.', choices: [
          { text: 'Publica’ls. Tots.', memory: 'lolaBooks', response: 'Fins al tiquet del cel·lo. Si ens enxampen, que siga en un arredoniment de set cèntims. I en document a banda, no ficat entre les pensions.' },
          { text: 'Millor esperem que passe.', memory: 'lolaWait', response: 'Això en un ministeri es diu «no consta». Les crisis no passen: s’arxiven. I algú les desarxiva la setmana abans de votar.' },
        ] },
      ] },
      default: { after: 'Lola: «Pestanya nova: “Coses que no pagarem”. Dotze files. Cap diu “es finança a soles”».', lines: [
        { speaker: 'Lola', text: 'He obert el full «Campanya_DEFINITIVA_v3». Ingressos: el pot del grup i quaranta euros que ens deu Dani. Ell en diu «deute històric».' },
        { speaker: 'Lola', text: 'Despeses: pizzes, impremta i una factura de «consultoria de relat» signada pel cosí de Dani. La pague?', choices: [
          { text: 'Ni de broma. Tot amb factura i tot publicat.', memory: 'lolaReceipts', response: 'Gràcies. Si eixim a les notícies, que siga per avorrits. Transparència de veres, no un portal que cau el dia que el busques.' },
          { text: 'Paga-la, que el cosí és bona gent.', memory: 'lolaCousin', response: 'Bona gent, ho és. Te l’apunte a la pestanya «Adjudicacions a dit, versió barri». Ja voràs que bé queda en un fil.' },
          { text: 'Escolta, Lola… i tu com arribes a final de mes?', memory: 'lolaRent', response: 'Compartisc pis amb dos opositors. Estudien lleis que canvien abans de l’examen. Jo pague i ells em resumixen el BOE. Per això estic ací, eh?' },
        ] },
        { speaker: 'Lola', text: 'Au, a la taula. Comanda: barbacoa i quatre formatges. La de pinya la va proposar Dani, però no ha superat el tràmit d’audiència.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Porte tres versions del comunicat. Les tres comencen per “Davant de les informacions aparegudes”».', lines: [
        { speaker: 'Dani', text: 'Quatre-cents comentaris: dos-cents bots, cent de ma mare defenent-te i cent de gent real molt enfadada. El clip l’ha penjat un canal de Se Acabó La Siesta.', choices: [
          { text: 'Contesta els de veres, un per un.', memory: 'daniReply', response: 'Un per un. Sense «lamentem que s’haja pogut malinterpretar». Passa’m café. Si em veus escriure «relat», lleva’m el mòbil.' },
          { text: 'Bloqueja tot el món i penja un mem.', memory: 'daniMeme', response: 'Fet. Ara el mem té més comentaris que el problema. Els assessors en diuen «canviar el marc». Ma iaia, «fer-se el desentés».' },
        ] },
      ] },
      default: { after: 'Dani: «Estic amb l’argumentari de demà. Porte dues hores dubtant entre “apostar per” i “continuar apostant per”».', lines: [
        { speaker: 'Dani', text: 'Demà ix el teu primer argumentari. Te’l llig: «Davant del soroll, barri. Davant del relat, fets. Davant de…». Val, m’ha quedat un poc frontista.' },
        { speaker: 'Dani', text: 'Et grave explicant el programa. Format oficial, en mànegues de camisa passejant per un polígon, o amb filtre i la cançó de moda?', choices: [
          { text: 'Sense filtre i sense polígon. Que es vegen les ulleres.', memory: 'daniNoFilter', response: 'Valent. Les ulleres són l’única cosa autèntica que queda a internet. Pocs m’agrades, però de gent que existix.' },
          { text: 'Amb filtre i amb la cançó de moda.', memory: 'daniTrend', response: 'Així m’agrada. Demà ningú sabrà què proposes, però tot el món sabrà que balles com un conseller en una revetla.' },
          { text: 'I tu què tal, amb tantes faenes?', memory: 'daniJobs', response: 'Tres clients i ma mare preguntant quan em fan fix discontinu, que a ella li sona a fix. Açò és l’única cosa que faig de franc. I l’única que em ve de gust.' },
        ] },
        { speaker: 'Dani', text: 'Una cosa: l’argumentari l’escric jo, però el corregix Marisa. No sé com va entrar al grup. Ja no m’atrevisc a traure-la.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Estic muntant cadires. Una es plega a soles. Eixa no vota».', lines: [
        { speaker: 'Nico', text: 'Ha baixat Ernesto, el del tercer. Té el pis tancat des d’allò del topall i diu que el vídeo li diu especulador. Després m’ha demanat que li regue les plantes.', choices: [
          { text: 'Convida’l a l’assemblea del portal. Que done la seua versió.', memory: 'nicoInvite', response: 'Val. Diu que llogaria si sabera que el recupera. És a dir: ell té un pis, el nebot de Marisa no, i enmig hi ha una llei. Quines coses.' },
          { text: 'Ni cas. És l’enemic.', memory: 'nicoEnemy', response: 'Enemic? És Ernesto, del col·legi. Li dec una pilota des de sisé. Dani li diu «gran tenidor» a l’argumentari. Té un pis. Heretat.' },
        ] },
      ] },
      default: { after: 'Nico: «Vaig a per més cel·lo. Este apega quan vol, com un soci de Govern».', lines: [
        { speaker: 'Nico', text: 'He apegat quaranta cartells. Al costat del de Fox hi havia un cavall de veres, en doble fila. Li n’he apegat un també. No ha protestat. Primer suport.' },
        { speaker: 'Nico', text: 'Per cert, la Reme diu que vota a qui li aconseguisca cita amb el cardiòleg abans de Nadal. Què li dic?', choices: [
          { text: 'La veritat: que això no s’arregla en un mes, però ho lluitarem.', memory: 'nicoTruth', response: 'Li ho dic. Posarà la cara que posen les senyores quan senten la veritat: pena i respecte, a parts iguals. El vot, ja ho vorem.' },
          { text: 'Digues-li que sí. Cita en una setmana.', memory: 'nicoPromise', response: 'Li promets en una setmana el que la llista d’espera tarda mig any. Al desembre, la Reme t’ho recorda. Amb la gaiata.' },
          { text: 'Que vinga a l’assemblea del portal i ens ho conte a tots.', memory: 'nicoAssembly', response: 'Bona idea. Els del bloc porten anys queixant-se cadascú al seu replà. Junts són una junta de veïns: una investidura, però amb derrama.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemàtiques
  cinematics: {
    intro: {
      banner: ['CAPÍTOL 1', 'Pues me presento'],
      tv: { headline: 'ELECCIONS!', ticker: 'ÚLTIMA HORA · DISSOLUCIÓ DE LES CORTS · COMPAREIXENÇA SENSE PREGUNTES' },
      subs: [
        [null, 'Diumenge, 23:47. «Un vídeo més i ho deixe».'],
        ['Presentadora (TV)', 'Última hora: el Govern dissol les Corts i convoca generals. La presidenta compareix sense preguntes: «les respostes ja estan al web».'],
        ['Presentadora (TV)', 'Els partits de sempre ja graven vídeos en mànegues de camisa. Un ha arribat a cavall. Continuarem informant. O no.'],
        [null, 'BZZZ. Quaranta-tres missatges. «I si ens presentem?». «jajaja». «No, de veres».'],
        ['Tú', 'Eleccions? Una altra vegada? …A vore què diu el grup.'],
      ],
      toast: 'El mòbil no para de vibrar. Està a la tauleta, al costat del sofà.',
    },
    plaza: {
      banner: ['EL BARRI', 'Baixar al carrer'],
      subs: [
        [null, 'La plaça: forn, bar, un banc al sol i més opinions per metre quadrat que un plató.'],
        ['Marisa', 'Mira, el del partit nou! Vine, que t’he de contar una cosa.'],
        ['Paco', 'Si has de salvar el barri, que siga després del café. I el café es paga, que no és una mesura.'],
      ],
    },
    hq: {
      banner: ['CAPÍTOL 2', 'La seu és el meu menjador'],
      subs: [
        [null, 'La seu: un menjador, una taula plegable i dos endolls. Un funciona. L’altre, «en tramitació».'],
        ['Lola', 'Benvinguts a la seu. El sofà és la sala de premsa; la nevera, la tresoreria. Auditada.'],
        ['Dani', 'He posat al wifi «Gabinet». Ja tenim estructura.'],
        ['Nico', 'Ordre del dia: u, cadires. Dos, qui porta gel. Tres, Espanya.'],
      ],
    },
    hall: {
      banner: ['CAPÍTOL 5', 'El debat del saló'],
      subs: [
        [null, 'Saló multiús. Hui: debat. Demà: zumba. A ull, la diferència és xicoteta.'],
        ['moderator', 'Bona nit. Uns quants faristols, un cronòmetre i una gerra d’aigua que ningú obrirà. Primer bloc: habitatge.'],
        ['tech', 'Vinc amb sentit comú. I amb paciència. Sobretot amb paciència: fa anys que esperem que ens toque.'],
        ['populist', 'Davant de l’onada reaccionària, avancem. En la direcció que toque esta nit.'],
      ],
    },
    victory: {
      banner: ['NIT ELECTORAL', 'Victòria!'],
      verdict: 'SUPERA EL 48!',
      subs: [
        ['Periodista', 'Amb el cent per cent escrutat, tots els partits diuen que han guanyat. Per una vegada, un té raó.'],
        ['Tú', 'Hem… guanyat? Sense argumentari?'],
        ['Ana', 'Discurs! Però curtet, que Marisa obri a les cinc!'],
      ],
    },
    defeat: {
      verdict: 'NO ARRIBA AL 48',
      subs: [
        ['Periodista', '…i la candidatura del barri es queda fora. Tots els altres, això sí, asseguren que han guanyat.'],
        ['Tú', 'Dani diu que és «un resultat que ens permet continuar construint».'],
        ['Berto', 'Marisa ja ho ha traduït: «heu perdut, rei». Escolta, la pròxima et vote. Si m’ho recordes.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantalles de campanya
  flow: {
    hq: {
      eyebrow: 'CAPÍTOL 2 · LA SEU ÉS EL MEU MENJADOR', title: 'Comité de direcció: tres persones i un sofà.',
      intro: state => `Argumentari de les 7:00: «Prioritzar eixos estratègics». Resposta de Marisa al grup: «Trieu una cosa». Hi ha temps per a una prioritat de veres; la resta, al grup, on moren les idees.${state.memories.nicoAssembly ? ' Nico ja ha apegat al portal un avís d’assemblea.' : ''}`,
      choices: {
        accounts: { title: 'Lola revisa cada cost', flavor: 'Pressupost a la vista, fins al tiquet del cel·lo. Ni una línia d’«altres despeses». Menys temps per a xarxes' },
        street: { title: 'Nico organitza porta a porta', flavor: 'Replà per replà, amb l’excusa de la derrama de l’ascensor. Sense tauleta ni enquesta: amb timbre' },
        content: { title: 'Dani munta un xicotet gabinet', flavor: 'Anell de llum, croma de llençol verd i una paret amb la paraula RELAT en pòstits' },
        tenants: { title: 'Assemblea de veïns al portal', flavor: 'Baixa gent que no es parlava des d’allò de les humitats. Ernesto, el del pis tancat, també. Ningú arreplega les cadires' },
      },
    },
    video: {
      eyebrow: 'CAPÍTOL 4 · FES-HO VIRAL', title: 'La marca està posada. Falta el missatge.',
      intro: state => { const m = state.memories; return `Argumentari de les 7:00: «To proper, missatge clar». Marisa: «Parla com parles». Dani calcula tres segons abans que passen el dit. L’abast obri portes; la gent distingix atenció de suport.${m.daniNoFilter ? ' Hui, sense filtre.' : m.daniTrend ? ' Dani ja ha triat la cançó. No preguntes.' : ''}`; },
      choices: {
        explain: { title: 'Explicar la proposta i el que costa', flavor: 'Un minut, pla fix i una pissarra de Lola amb la lletra menuda en gran' },
        chairs: { title: 'El ball de les cadires de Paco', flavor: 'Coreografia amb cadires deixades. Ningú sap què proposes; tot el món sap que caus en el segon onze' },
        neighbor: { title: 'Deixar parlar Marisa', flavor: 'Ella parla de la calor, del local que li han apujat i de la cita de sa mare. Tu subjectes el mòbil i calles' },
        debunk: { title: 'Desmuntar el bulo del dia', flavor: 'Un canal de Se Acabó La Siesta diu que vols prohibir les terrasses. Ho desmentixes amb el pla sencer, que és l’arma secreta' },
      },
    },
    crisis: {
      eyebrow: 'CAPÍTOL 5 · CRISI',
      title: (state, ctx) => ctx.contradiction ? 'El teu «tot per a tots» ha arribat abans que la premsa.' : 'Un vídeo retallat ha arribat abans que la veritat.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Algú ha penjat el moment en què ho prometies tot alhora. Música de tràiler, títol en majúscules i un rètol: «MARISA HO TRADUÏX». Ella no ha sigut. Però ho subscriu.'
        : 'Circula un clip de nou segons tallat just abans que explicares el cost. Sobrevivo el compartix amb «Això és el que hi ha darrere». Paciente, amb «Sense comentaris». Que és un comentari.'}${state.memories.nicoPromise ? ' I la Reme ha cridat: continua sense cita.' : ''} Previsió actual: <b>${ctx.forecast.score}/100</b>. Se’n necessiten ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Donar la cara: reconéixer l’error i corregir-lo', flavor: 'Vídeo sense música i sense «s’ha tret de context». Amb preguntes, que ja és quasi un escàndol' },
        team: { title: 'Publicar costos i responsables', flavor: 'Lola penja els comptes; Nico, qui fa què. Avorrit, comprovable i difícil de retallar' },
        distract: { title: 'Sortejar una fregidora d’aire', flavor: 'Per a participar: seguir el compte, mencionar tres amics i oblidar el tema. En els manuals, «marcar agenda pròpia»' },
        blame: { title: 'Culpar la màquina del fang', flavor: 'Bots, algoritme i «les clavegueres». Funciona amb els teus. Els altres reconeixen el truc: l’usen tots els partits' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTOL 5 · EL DEBAT', title: 'Tres rivals, una moderadora i una gerra sense obrir.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `A un costat, ${populist.name}, del ${populist.party}, amb dos argumentaris: el del matí i el de la vesprada. A l’altre, ${tech.name}, del ${tech.party}, que promet derogar coses que no anomena. Al fons, ${hard?.name || 'Covadonga del Muro'}, de Fox, que ha intentat entrar a cavall. ${moderator}: «A què renuncia el seu programa?».`,
      choices: {
        tradeoff: { title: 'Defendre la renúncia concreta', flavor: (state, { rivals }) => `Dius què perds i a qui molestes. ${rivals.tech.name} demana «una dada». Li la dones. L’apunta per a derogar-la` },
        attack: { title: (state, { rivals }) => `Traure-li l’hemeroteca a ${rivals.populist.name}`, flavor: 'Li llegixes el que va dir fa dues campanyes. Aplaudiment fàcil, titular fàcil, zero propostes. Ella: «Rectificar és de savis»' },
        manage: { title: 'Donar torns i desmuntar xifres amb calma', flavor: (state, { rivals }) => `${rivals.tech.name} promet abaixar impostos «a partir del segon any, si l’herència ho permet». Preguntes de quin any. Silenci. Aigua` },
        promise: { title: 'Prometre topar el lloguer a la meitat «per decret»', flavor: (state, { rivals }) => `El públic aplaudix. ${rivals.populist.name} et mira amb enveja professional. ${rivals.moderator}: «Queda dit»` },
      },
    },
    finalPrep: {
      eyebrow: 'CAPÍTOL 6 · ÚLTIMA VOLTA', title: 'Encara queda marge.',
      intro: (state, ctx) => `Previsió: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'per damunt' : 'per davall'} del llindar). Queden dos dies. El sondeig oficial vos dona «al voltant de zero»; sempre l’encerta a favor de qui l’encarrega. Argumentari: «Mobilitzar el vot útil». Marisa: «Que vaja la gent». Només hi ha temps per a una cosa ben feta.`,
      choices: {
        listen: { title: 'Visitar els qui encara dubten', flavor: state => `La parada del bus, la cua del centre de salut i la senyora de la bossa, que ja coneix el que li la va furtar: coincidixen cada mes al jutjat${state.memories.nicoAssembly || state.memories.nicoInvite ? '. L’assemblea del portal et demana que tornes' : ''}. Escoltes més del que parles` },
        receipts: { title: 'Publicar el pressupost definitiu', flavor: 'Lola l’imprimix en A3: «la transparència també és mida de lletra». Sense annexos que isquen a l’agost' },
        volunteers: { title: 'Ordenar voluntaris i col·legis', flavor: state => `Nico repartix torns, entrepans i un mapa de col·legis dibuixat en un tovalló${state.memories.pacoLucia ? '. Lucía, la cambrera de Paco, s’apunta d’interventora' : ''}. Sense autobusos de simpatitzants: amb el de línia` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTOL 6 · L’ÚLTIM MÍTING', title: 'Una frase abans de la jornada de reflexió.',
      intro: 'Cadires plegables, un globus que es desinfla i una periodista del diari local amb cara de tercer míting hui. En els altres tancaments hi ha autobusos i banderes; ací, el del butà. Consolida el que has aprés o torna a prometre-ho tot.',
      choices: {
        account: {
          title: state => ({
            shade: '“Hi haurà ombra i hi haurà menys cotxes. Açò triem, açò costa i ací respondrem.”',
            parking: '“El barri podrà treballar, encara que este estiu continue sense arbres. Açò triem i ací respondrem.”',
            festival: '“Hi haurà cultura i hi haurà soroll pactat. Açò triem, açò costa i ací respondrem.”',
            housing: '“Hi haurà més pisos perquè els construirem, no perquè els anunciem. Tardarà. I ací respondrem.”',
          }[state.proposal] || '“Açò triem, açò costa i ací respondrem.”'),
          flavor: 'Ho dius sense papers. Marisa obri la llibreta i, per primera vegada, no apunta res',
        },
        viral: { title: '“Menys embussos i més gaspatxo!”', flavor: 'Dani ho emet en directe. Es corea. Ningú sap què vol dir. A les dotze ja ho han copiat tres partits' },
        everything: { title: '“Demà hi haurà de tot per a tots, per decret.”', flavor: (state, { rivals }) => `Aplaudiment enorme. Lola es tapa la cara amb el pressupost. ${rivals.populist.name} t’escriu: «En parlem?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finals
  endings: {
    victory: {
      eyebrow: 'NIT ELECTORAL · VICTÒRIA', title: 'Hi ha més cadires que persones.',
      text: state => `Marisa aplaudix una vegada. Lola pregunta qui ha guardat les factures. Paciente i Sobrevivo ja han cridat dues vegades: «Què oferiu?». A les 7:00 arriba l’últim argumentari de Dani: «Hem guanyat». Marisa contesta: «Això ho entenc». ${{
        shade: 'Demà comença el difícil: explicar-li a la furgoneta del nebot on aparca.',
        parking: 'Demà comença el difícil: el primer agost sense arbres amb el teu nom a la placa.',
        festival: 'Demà comença el difícil: la primera reunió amb els del primer, que ja t’han portat taps.',
        housing: 'Demà comença el difícil: la primera llicència. Ernesto pregunta si pot llogar el tercer abans que acabe la legislatura.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NIT ELECTORAL · DERROTA', title: 'Un resultat que ens permet continuar construint.',
      reasons: {
        support: 'Va faltar suport directe: el barri et va veure més al mòbil que al replà.',
        credibility: 'Les contradiccions van pesar: a la cua del forn no hi ha hemeroteca, però hi ha memòria.',
        organization: 'L’equip va arribar desordenat: un col·legi sense interventor i un altre amb tres.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijocs
  minigames: {
    viral: {
      eyebrow: 'MINIJOC · FES-HO VIRAL', title: 'Gravant a la marca.', goWord: 'Acció!',
      lanes: ['Salutació', 'Amunt!', 'Palmes', 'No consta'],
      takes: {
        explain: 'Pissarra de Lola, pla fix i cada gest subratlla un cost.',
        chairs: 'El ball de les cadires. Paco mira amb els braços plegats.',
        neighbor: 'Marisa parla de la calor; tu, darrere, marques el ritme sense que es note. Es nota.',
        debunk: 'Desmuntes el bulo amb gestos clars: açò no, açò sí, açò costa.',
      },
      intro: (state, ctx) => `Mòbil al trípode, veïns mirant i Dani comptant. ${ctx.take} Fes cada posat quan la seua icona arribe al cercle. El ritme suma abast, no vots.`,
      titles: { great: 'Viral! Sumandos ja t’ha oferit ser un pètal.', ok: 'Es compartix en tres grups de WhatsApp. Un és el de ta mare.', bad: 'Quaranta visualitzacions. Dani en diu «impacte qualitatiu».' },
      texts: { ok: 'Dani ja posa subtítols en groc. La presa val: l’abast obri portes, però els vots es guanyen al portal.', bad: 'T’has perdut entre la salutació i les palmes. Repetix la presa: de moment, «no consta».' },
    },
    duel: {
      eyebrow: 'MINIJOC · DUEL DE RÈPLIQUES', title: 'Cinc preguntes, un cronòmetre.',
      intro: (state, ctx) => `${ctx.rounds} rèpliques. Tria la resposta que defén alguna cosa concreta i n’assumix el cost abans que s’acabe el temps. A mitjan ronda, algú t’interromprà: demana la paraula.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'A qui aparca en doble fila i a dues taules de la terrassa de Paco. Ombra a canvi de cotxes, dit clar.',
          parking: 'Al banc al sol: este estiu continuarà sense arbres. Triem que el barri puga treballar.',
          festival: 'Als del primer, dues nits per setmana. Amb horari pactat i taps de regal, literalment.',
          housing: 'A la plaça, que continua sense ombra, i a la nostra paciència: construir tarda més que una legislatura. I ens diran «els dels propietaris».',
        }[state.proposal];
        return [
          { topic: 'Habitatge', role: 'populist', claim: 'Gràcies a la nostra llei, a les zones tensionades el lloguer s’ha estabilitzat. Els pisos que falten els amaga l’especulació.',
            options: ['Si està «estabilitzat», per què el tercer porta un any tancat? Topar no fa pisos. Construir sí, encara que tarde més que un titular.', 'Doncs nosaltres el topem a la meitat! I el pa!', 'Vosté porta una xapa de colors. Ho sap tot el barri.'], correct: 0 },
          { topic: 'Dades', role: 'tech', claim: 'Segons un informe que no he portat, la seua proposta enfonsarà el barri. Ho diu esta gràfica. La de la fletxa roja.',
            options: ['I segons el meu, el seu gràfic és un bulo. Empat tècnic.', 'Bé, les dades són relatives. Com les enquestes.', 'Ensenye la font. La nostra: el pressupost de Lola, pàgina dos, amb foto del banc a les cinc de la vesprada.'], correct: 2 },
          { topic: 'La seua proposta', role: 'moderator', claim: 'Pregunta directa: a qui perjudica la seua proposta? Minut d’or. Bé, deu segons de bronze.',
            options: ['A ningú. És una proposta transversal, sense perdedors, com un anunci de colònia.', cost || 'A algú segur. Ho direm amb nom i cognoms quan ho sapiem.', 'Als de sempre, que ja saben qui són.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'La promesa', role: 'populist', claim: 'Vosté li va prometre a una fornera ombra, aparcament i un pis per al seu nebot! Això és populisme. I ho dic amb coneixement de causa.',
                options: ['És veritat. Em vaig equivocar en prometre-ho tot; després vam triar una cosa i vam explicar el que costa.', 'S’ha tret de context. El context era jo prometent-ho tot.', 'Vosté també ho promet tot. Empat.'], correct: 0 }
            : { topic: 'Sanitat', role: 'tech', claim: 'I la sanitat? O només li importa la seua plaça? Nosaltres gestionarem. Molt. Amb gestió.',
                options: ['Promet que demà no hi ha llistes d’espera. Paraula.', 'Ens importa. Per això no prometem el que no gestionem: portarem la cita de la Reme al ple, amb nom i data.', 'Ho derogarem tot, com vosté. Ja vorem què.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: 'Perdone! Això és de la màquina del fang. Ho dic sense haver-ho sentit sencer.',
        tech: 'Si em permet… com deia este matí un periòdic… ara el llig sencer…',
        moderator: 'Li queden deu segons. Nou. Queda dit.',
        fallback: 'Perdone, perdone!',
      },
      floor: 'Deixe’m acabar, que açò no és una roda de premsa.',
      floorBabble: 'Deixe’m acabar',
      reactions: {
        timeout: 'S’ha acabat el temps. Queda dit. Bloc següent.',
        quick: 'Resposta concreta i en temps. Inusual. Prenc nota.',
        slow: 'Concreta, encara que justeta de temps.',
        wrong: 'Gràcies per donar-me la raó. Ho posaré a l’argumentari.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} assentix. I no diu «queda dit».`, mid: 'Has aguantat el tipus. Sense xuleta.', low: 'Demà els rivals diran que han guanyat. Hui, amb motiu.' },
      text: 'L’estratègia que vas triar marca el debat; les rèpliques decidixen si et creuen.',
    },
    chairs: {
      eyebrow: 'MINIJOC · SIS CADIRES', title: 'Préstec, no subvenció.',
      intro: (state, ctx) => `Per a l’última assemblea calen les sis cadires de Paco, escampades pel barri. Passa per damunt d’una per a agafar-la i porta-la al rogle. Una a una: «l’esquena també vota», diu Nico. Tens ${ctx.time} segons.`,
      hints: {
        start: 'Passa per damunt d’una cadira per a agafar-la.',
        carry: 'Ara, al rogle groc.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. A per la següent.`,
        full: 'Rogle complet!',
      },
      titles: { all: 'Sis cadires al rogle. Paco, conforme.', mid: 'Mig rogle. La resta, de peu i opinant.', low: 'Paco arreplega les cadires ell mateix. I ho comenta.' },
      texts: { all: 'Nico apunta el temps al tovalló. Organitzar és açò: que hi haja lloc quan arriba la gent.', other: 'Les que falten continuen per la plaça. Repetix: ningú ha vist res, llevat de Paco.' },
    },
    rally: {
      eyebrow: 'MINIJOC · L’ÚLTIM MÍTING', title: 'Que no se t’escape la sala.', goWord: 'Parla!', lane: 'Remata la frase',
      intro: 'Cada frase té un remat. Polsa quan la paraula arribe al cercle: el públic aplaudix i l’atenció puja. Si falles, algú mira el mòbil. O pitjor: xiula.',
      phrases: state => {
        const own = {
          shade: ['Este estiu, la plaça tindrà', 'OMBRA'], parking: ['Qui treballa en este barri podrà', 'DESCARREGAR'],
          festival: ['Els xavals tindran local i la plaça,', 'CULTURA'], housing: ['Els pisos no s’anuncien: es', 'CONSTRUÏXEN'],
        }[state.proposal] || ['Una cosa ben feta, per a', 'COMENÇAR'];
        return [
          ['Bona nit. Gràcies per vindre sense autobús i amb', 'CADIRA'],
          ['No vinc amb argumentari: vinc amb', 'UNA COSA'],
          own,
          ['I sí: té un cost. L’hem posat per', 'ESCRIT'],
          ['Sense observatori, sense comissió i sense', 'LOGO'],
          ['Ningú ací vos ha dit que açò es pague', 'A SOLES'],
          ['Si no complim, ja sabeu on és el', 'FORN'],
          ['Esta nit Marisa no té res a', 'TRADUIR'],
          ['Diumenge no vos demane fe: vos demane que', 'VOTEU'],
          ['A qui vulgueu. Però que no decidisca el', 'SOFÀ'],
          ['Gràcies, barri. I ara, les cadires, a', 'PACO'],
          ['Doncs sí, em', 'PRESENTE!'],
        ];
      },
      titles: { great: 'La sala dreta. Els que tenen cadira, també.', ok: 'Aplaudiments sincers i algun badall.', bad: 'S’ha sentit un mòbil. Era l’argumentari.' },
      text: 'El públic recordarà com ho vas dir; la decisió que has pres decidix què recorda.',
    },
  },
};
