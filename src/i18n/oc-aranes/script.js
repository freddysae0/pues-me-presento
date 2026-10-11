// Guion · Aranés (oc-aranes). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte cae en: ca → es.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
// Traduce el guion efectivo (actual + b, «Sátira de argumentario»). Running gags: er argumentari des 7:00, era libreta
// de Marisa, es sies cadières de Paco, eth gaspatxo, «Ja ei dit» (era moderadora). Marisa dice «beròi» (cariño).
export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: "Fermín Aguardo", party: "Partit Pacient" },
    populist: { name: "Nuria Giro", party: "Partit Supervivent d'Ua Auta Eleccion" },
    hard: { name: "Covadonga del Muro", party: "Fox" },
    moderator: "Maite Escaleta",
  },

  foxDebate: {
    hallLine: "È deishat eth shivau en dobla fila. Se me meten ua multa, ei ideologia.",
    interruption: "Excuse me! Sense complèxes: o me deishatz parlar o me lhèvi e me'n vau. Ja è practica en gésser de govèrns.",
    round: {
      topic: "Seguretat", role: "hard",
      claim: "Ath que pane eth sac ara senhora dera parada l'an detengut onze còps. Onze. E eth Govèrn, en lòc de jutges, dubrís un observatòri. Qué haríetz vos?",
      options: [
        "Que tornar a panar non sigue gratis: judici rapid e que non gesque pera madeisha pòrta eth madeish dia. E jutges, que còsten diners. Ac didem clar.",
        "Man dura! E un shivau per barri!",
        "Parlem des causes. Des onze.",
      ],
      correct: 0,
    },
    reactions: {
      right: "Òme. Açò non ei de dreta covarda. Per aguest còp.",
      wrong: "Ac vedetz? Sense complèxes se pense mès rapid. Vos prèsti eth shivau.",
      timeout: "Mentre vos pensatz, era Espanha que se lhève d'ora ja s'a anat a dormir.",
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: "ELECCIONS GENERAUS · ARGUMENTARI INCLÓS",
    tagline: "Es auti partits an assessors. Tu as ua hornèra que tradusís.",
  },

  chapters: ["Pues me presento", "Era sètz ei eth mèn salon", "Baishar ath carrèr", "Hè-ac virau", "Ac an trèt de contèxte", "Eth darrèr miting"],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: "Comparecéncia en sofà", objective: "Apròpa-te ath mobil, ath costat deth sofà. Quicha E." },
    call: { title: "Ronda de consultes", objective: "Emplega eth portatil dera taula entà cridar as tòns amics." },
    register: { title: "Constituïts a toti es efèctes", objective: "Vè ena carpeta deth burèu e registra eth partit." },
    leave: { title: "Presa de contacte damb era realitat", objective: "Vè-te'n pera pòrta verda e baisha ara plaça." },
    neighbor: { title: "Procès d'escota (de vertat)", objective: "Parla damb Marisa, ath costat deth tendau deth hòrn. Paco, ena terrassa deth bar, tanben a causes a condar." },
    program: { title: "Tot non i cap en un decret", objective: "Causís era tua prumèra proposta en taulèr dera plaça." },
    speech: { title: "Prumèra comparecéncia, damb public", objective: "Puja en punt der atril e hè eth tòn prumèr discors." },
    aftermath: { title: "Era coa deth pan hè era analisi", objective: "Torna damb Marisa entà saber qué se ditz ena coa deth pan." },
    hqBrief: { title: "Era sètz ei eth mèn salon", objective: "Amassa er equip ena taula de campanha. Lola, Dani e Nico tanben vòlen parlar damb tu." },
    video: { title: "Hè-ac virau (damb messatge, se pòt èster)", objective: "Enregistra un vidèo ena marca ath costat deth hòrn." },
    crisis: { title: "Açò non ei exactament çò que didí", objective: "Hè cara ara crisi en taulèr. Abans, valerà era pena escotar er equip." },
    debate: { title: "Eth debat dera sala", objective: "Entra en debat damb es rivaus." },
    finalPrep: { title: "Darrèra vòuta peth barri", objective: "Causís en mapa a on concentrar eth darrèr esfòrç." },
    finalSpeech: { title: "Eth darrèr miting, sense autocars", objective: "Barra era campanha dauant deth public." },
    election: { title: "Era nèt des cadières", objective: "Consulta eth resultat electorau." },
    complete: { title: "Campanha completada", objective: "Era campanha s'a acabat." },
  },

  travel: {
    hqBrief: { title: "Desplaçament institucionau", objective: "Era sètz ei ena planta baisha deth portau dera vòra deth bar de Paco. Vè ena pòrta e quicha E.", prompt: "Portau · Entrar ena sètz", loading: "ENTRANT ENA SÈTZ…", sign: "SÈTZ" },
    video: { title: "Gésser as mèdis (ara plaça)", objective: "Entà enregistrar cau lum e vesins. Vè-te'n pera pòrta dera sètz e baisha ara plaça.", prompt: "Pòrta · Baishar ara plaça", loading: "BAISHANT ARA PLAÇA…", sign: "PLAÇA" },
    crisis: { title: "Reunion d'urgéncia, damb tupper", objective: "Quauquarren crame en grup dera sètz. Torna peth portau ath costat deth bar.", prompt: "Portau · Tornar ena sètz", loading: "PUJANT ENA SÈTZ A TOTA PRÈSSA…", sign: "SÈTZ" },
    debate: { title: "Trasfèrt ara sala polivalenta", objective: "Vè-te'n pera pòrta dera sètz. Ena sala polivalenta ja an montat es atrils.", prompt: "Pòrta · Anar ena sala polivalenta", loading: "CAP ARA SALA POLIVALENTA…", sign: "SALA" },
    finalPrep: { title: "Caucigar territòri", objective: "Vè-te'n dera sala pera pòrta dobla. Demore ua setmana e se guanhe en carrèr.", prompt: "Pòrta · Tornar ara plaça", loading: "TORNANT ATH BARRI…", sign: "PLAÇA" },
    finalSpeech: { title: "Transpòrt public, coma eth votant mejan", objective: "Vè ena parada ath costat deth quiòsc e pren eth 27 enquia era sala polivalenta.", prompt: "Parada · Préner eth 27 entara sala", loading: "ETH 27 ARRIBE. TARD, PERÒ ARRIBE…", sign: "BUS 27" },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: "Ombra abans qu'un observatòri dera calor", cost: "2 de pressupòst", benefit: "Arbes, tendaus, ua hont que foncione e eth baish vuet deth canton coma sala fresca entàs grans. Sense plan director: damb jardinèr.", compromise: "Se pèrden places d'aparcament, era terrassa de Paco pèrd dues taules e eth nebot de Marisa torne ara dobla fila." },
    parking: { title: "Qu'eth barri pogue trabalhar", cost: "2 de pressupòst", benefit: "Carga e descarga damb orari, places rotatòries entath comèrç, aparcabicicletes entàs repartidors e licéncies de terrassa en dies, non en trimèstres.", compromise: "Mès cotxes ena plaça e un aute agost en plen solei. Eth banc seguirà bolhent." },
    festival: { title: "Cultura dempús des ueit", cost: "2 de pressupòst", benefit: "Escenari entàs grops deth barri, cinèma d'estiu e un locau d'assag que gestione era associacion de vesins, non ua fondacion damb logo.", compromise: "Bronit dues nets per setmana; es deth prumèr, damb tapons. Era ombra e era carga e descarga, ath calaish." },
    housing: { title: "Qu'eth tresau tòrne a auer vesins", cost: "2 de pressupòst", benefit: "Licéncies en setmanes, bastir en solar deth canton e que lhogar un pis barrat non hèsque pòur.", compromise: "Bastir tarde mès qu'anonciar un plafon. Non gesse en telediari, te diràn «eth des proprietaris» e era plaça seguís sense ombra." },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: "Lieg eth BOE per gust", line: "Trabalhi en ua gestoria. En metro, BOE, coma qui lieg ua novèla nera: eth mòrt tostemp ei ena disposicion addicionau. Te pòrti es compdes.", choices: [
      { label: "Tresoreria. Tu decidisses quan ei que non.", reply: "Accèpti. Prumèra nòrma: aciu arren «se finance damb creishement». Se finance damb diners, qu'ei mès avorrit, peró existís." },
      { label: "Estrategia. Era letra petita, entà tu.", reply: "Hèt. Era letra petita ei a on es govèrns amaguen çò important. Era grana ei entath cartèl." },
    ] },
    dani: { role: "Parle en fils", line: "Hèsqui vidèos entà ua clinica dentau e un gimnàs. M'è legit toti es fils de «ex-assessor de campanha» qu'existissen. Vosati metetz es idèes; jo vos hèsqui eth relat.", choices: [
      { label: "Comunicacion. Relat òc, hum non.", reply: "Tracte. Cada maitin as 7:00, argumentari en grup. Cort, clar e sense era paraula «resiliéncia». Bon, quasi sense." },
      { label: "Pòrtavotz. Te calerà respóner questions.", reply: "Conferéncies de premsa damb questions? Açò ja non ac hè arrés. Va: seram vintage." },
    ] },
    nico: { role: "Coneish a tot eth portau", line: "Hèsqui tòrns en un magasèm e coneishi a tot eth portau. Jo mobilizi. Peró se quauqu'un ditz «transversau» en ua reunion, baishi a crompar pipes.", choices: [
      { label: "Organizacion. Tu metes es oraris.", reply: "Hèt. Reunions de vint minuts. Se dure mès, ei que quauqu'un lieg un argumentari." },
      { label: "Actes. Mos cau era tua votz de megafòn.", reply: "Quan toquèc era loteria de Nadau en bar, baishèc tot eth carrèr en pantofles. Dà-me un motiu atau e t'empli era plaça." },
    ] },
  },

  call: {
    title: "Ronda de consultes. Per videocridada.",
    you: "A agut ua idèa",
    next: "Eth valent que vie",
    done: "Ja auem equip. Dani a creat eth grup «Argumentari 7:00». E, sense voler, i a metut a Marisa, era deth hòrn.",
    doneBabble: "Ja auem equip.",
    finish: "Baishar ara plaça",
  },

  register: {
    eyebrow: "FONDACION · FINESTRETA UNICA",
    title: "Un nom entara papereta.",
    stamp: "PENDENT D'ESMENAR",
    intro: "Tres camps. Ne certificat digitau, ne cita prèvia, ne annèx III. S'açò ei un sòmi, que non se desvelhe arrés deth Ministèri.",
    defaultName: "Era Gent deth Banc",
    defaultSlogan: "Ua causa plan hèta, entà començar.",
    submit: "Registrar candidatura",
    toast: "REGISTRAT. Resolut en zèro dies abils. Arrés ena finestreta non sap com a passat.",
  },

  program: {
    eyebrow: "PROGRAMA · PRESSUPÒST: 2 CRÈDITS",
    title: "Prioritizar: causir, peró damb corbata.",
    intro: "Sonque i cap ua proposta. Es autes non se «calendarizen» ne se «remeten a ua dusau fasa»: se demoren sense hèr. Eth barri ac sap destriar.",
    promisedBothNote: "Marisa se brembe que prometeres ombra, aparcament e pis entath sòn nebot. Cap opcion non pague tot açò. −6 de credibilitat en concretar.",
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Ara, a explicar-ac en atril. Damb questions.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ["Bon. Donc aciu èm.", "Qué vas a defensar?", "Era darrèra frasa compde."],
    parts: {
      opening: { title: "01 / Trincar eth gèu", prompt: "Sèt persones. Dues demoren eth bus, ua a baishat a cercar pan e ua auta t'enregistre per se dides «resiliéncia».", options: {
        listen: "Abans de parlar, è vengut a escotar. De vertat, non en «procès d'escota».",
        joke: "Serè brèu. Ac ditz un politic: metetz-vos comòdes.",
        grand: "Uei encetam ua huelha de rota transversau cap a un nau orizon de país!",
      } },
      argument: { title: "02 / Díder quauquarren concrèt", prompt: "Ara cau defensar çò qu'as clavat en taulèr. Marisa ja a trèt era libreta.", options: {
        shade: "Ombra e un lòc fresc entàs grans, encara que perdam aparcament. Sense plan director: damb arbes.",
        parking: "Que qui trabalhe pogue descargar, encara qu'aguest estiu era plaça seguisque sense arbes.",
        festival: "Cultura e un locau entara mainada, damb orari de bronit pactat e per escrit.",
        housing: "Mès abitatges: sòl, licéncies rapides e que lhogar non hèsque pòur. Eth prètz non baishe eth diluns; baishe en tot bastir.",
        everything: "Arbes, aparcament, festivaus e un pis entà cadun, gratis e en un decret eth diluns!",
      } },
      close: { title: "03 / Saber acabar", prompt: "Marisa guarde eth relòtge. Ei un relòtge qu'a vist fòrça campanhes.", options: {
        accountable: "Se non ac complim, mos ac demanatz aciu. E responeram, qu'ei ja ua nauetat.",
        chant: "Mens embotelhatge e mès gaspatxo!",
        forever: "Entà concludir, e en nom dera brevetat, es mèns vint-e-sèt axes següents…",
      } },
    },
    timing: { eyebrow: "04 / DAR ETH CÒP FINAU", title: "Ara. Damb conviccion.", button: "E per açò me presenti!" },
    result: {
      eyebrow: "ETH BARRI A ESCOTAT",
      goodTitle: "Un aplaudiment. Sense claca.",
      badTitle: "Aplaudiment de cortesia. Ena tele, «bona acuelhuda».",
      coherent: "As defensat era tua proposta e as dit çò que coste. En politica açò a un nom estranh: díder era vertat.",
      incoherent: "Eth tòn discors non coincidís damb eth programa. Ena tele ne diden «matisar». Ena coa deth pan, ua auta causa.",
      fine: "Er abast mesure atencion, non vòts. Es consequéncies depenen de çò qu'as dit.",
      button: "Baishar der atril",
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: "Marisa", text: "Tu ès eth deth partit nau? M'a arribat eth vòste argumentari: Dani m'a metut en grup sense voler. Lo legi as cinc, damb era prumèra hornada." },
      { speaker: "Marisa", text: "Eth mèn nebot hè repartiments e non a a on parar. Trenta-quate ans, en sòn quarto de petit. E eth tresau ei barrat dempús de çò dera lei. Per a on comences?", choices: [
        { text: "Per escotar-te. Qué ei çò que non te dèishe dormir?", memory: "listened", response: "A jo? Era paciéncia. Era cita dera mia mair ei entà d'aciu a mesi, e era demora, ath solei." },
        { text: "Per tot: ombra, aparcament e un pis entath tòn nebot.", memory: "promisedBoth", response: "Açò ena tele se ditz «paquet integrau de mesures». Aciu, «ja se veirà». Ac apunti ena libreta." },
        { text: "Per hèr bronit: un festivau que mos mete en mapa.", memory: "spectacle", response: "En mapa? Se gessem en totes es webs d'abitatges turistics: «autentic barri de tota era vida». Çò unic de tota era vida que demore sò jo, e barri as dues." },
      ] },
      { speaker: "Marisa", text: "Aquiu as eth taulèr. Balhe entà ua causa. Ua. E en atril, arren de «méter en valor» ne «huelha de rota». Se ac dides, te lanci ua barra de pan." },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? "Me prometeres ombra, aparcament e pis entath mèn nebot. Tres causes e cap data. Pagina dotze dera libreta."
        : m.listened ? "Abans m'as escotat. Semble pòc, peró es que vien damb eth discors plastificat non lhèven es uelhs deth papèr."
        : m.spectacle ? "Çò deth festivau ac a entenut tot eth barri. Es deth prumèr ja demanen s'es tapons van en programa o en un decret reiau."
        : "Ja as baishat dera caisha. Te tremolavan es cames mens qu'ath der an passat. E eth der an passat amiaue un autocar de simpatizants.";
      const coherent = {
        shade: "As dit que lhèves cotxes entà méter ombra. Eth mèn nebot ja non te parle; era mia mair ja te defen. As causit. Ja ère ora.",
        parking: "As causit era furgoneta abans qu'es arbes. Eth mèn nebot te convide a ua cervesa. Jo, en agost, t'envii a mia mair a demorar eth bus en tòn salon.",
        festival: "Cultura enquia mieja nèt e bronit damb orari. Mens mau que non ac as aperat «dinamizacion der espaci public».",
        housing: "As dit «bastir» e «tarde». En un atril açò non se sent: se sent «plafon» e «ja». Eth mèn nebot ditz qu'ei eth prumèr còp que l'expliquen perqué non i a abitatges.",
      }[state.proposal];
      const result = speech.coherent ? (coherent || "Non sò d'acòrd en tot. Peró as dit çò que coste. Açò, en un atril, ei quasi exotic.")
        : speech.picks?.[1] === "everything" ? "Arbes, aparcament, festivaus e abitatges per decret. Beròi, açò non ei un programa: ei un decret òmnibus."
        : "Eth taulèr didie ua causa e tu ua auta. Ena tele ne diden «matisar». Aciu, «cambiar d'idèa entre eth pan e er autobús».";
      const closing = m.pacoLucia ? "M'a dit Paco que li as trapat ua cambrèra. Açò non gesse en cap argumentari. Gesse ena coa deth pan, qu'ei a on se vòte."
        : (speech.reach || 0) >= 12 ? "Dani ditz qu'eth vidèo l'an vist milèrs. Aciu l'an vist dotze. E es dotze son empadronats. Tu veiràs a qui parles."
        : "Bon. Ja as partit, equip e ua senhora que te vigile. Ara òc qu'ès en politica.";
      return [{ speaker: "Marisa", text: memory }, { speaker: "Marisa", text: result }, { speaker: "Marisa", text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? "Paco: «Sies cadières. Era setau ei era mia e non entre ena negociacion»." : s.memories.pacoLucia ? "Paco: «Era gojata ja sap mès de truita que jo. Non l'ac digues»." : "Paco: «Guarda, te dirè ua causa: quant coste. E se non ac sabes, que non ac sabes».",
      lines: [
        { speaker: "Paco", text: "Paco, bar Era Darrèra. Aciu se barren mès pactes qu'en Congrès, e toti se paguen a escòt. Qué prenes?", choices: [
          { text: "Qué li demanaries tu a un partit nau?", memory: "pacoHeard", response: "Guarda, te dirè ua causa: que digue quant coste. E se non ac sap, «non ac sai». Ena tele non ac è entenut jamès. Serie tendéncia, que ditz era mia nebota." },
          { text: "Mos prèstes cadières entar acte?", memory: "chairs", response: "Sies. Ei un prèst, non ua subvencion: tornen ath sòn lòc e tornen nètes." },
          { text: "Com va eth negòci?", memory: "pacoRent", response: "M'an apujat eth locau, era lum e eth cafè. Ara un dera tele vò limitar eth prètz deth cafè. Donc meterè «cafè de temporada». Coma damb es lhoguèrs de temporada." },
        ] },
        { speaker: "Paco", text: "E guarda aqueth cartèl: «Se cerque cambrèr». Ei penjat dempús de Setmana Santa. Ja a mès antiguitat qu'era mia cafetèra.", choices: [
          { text: "As provat de pagar mès?", memory: "pacoWages", response: "Òc. Apugi eth cafè dètz centims e me cau ua ressenha: «atracament». S'ac hesse Hisenda, se diderie «redistribuïr»." },
          { text: "Ei que es joeni ja non vòlen trabalhar.", memory: "pacoBlame", response: "Açò didia jo, enquia que venguec un damb tres curriculums e ua question: «e a on dormi?». Damb çò que pagui, en magasèm des cadières. Non tornèc." },
          { text: "Lucía, era estudianta dera hont, cerque quauquarren entàs caps de setmana.", memory: "pacoLucia", response: "Era des apunts en quate colors? Que vengue. Contracte per escrit e truita dera casa. As amassat dues persones sense crear ua taula de dialòg. Açò ei nau." },
        ] },
        { speaker: "Paco", text: "E ara perdona, qu'era taula deth hons demane sangria as onze deth maitin. Aqueri an un programa clar e lo complissen." },
      ],
    },

    marisa: s => {
      const text = {
        program: "Eth taulèr, ath costat der arbe. Ua proposta. Se ne clavas dues ja ei un «paquet de mesures», e es paquets, beròi, tostemp les pague quauqu'un.",
        speech: "Puja ja ena caisha, que se refrede eth pan e se refrede era gent. E arren de «méter en valor».",
        video: "Er argumentari d'uei ditz «ton pròche». Mès pròche? Se te vedi dera pòrta deth hòrn.",
        crisis: "Eth vidèo m'a arribat peth grup dera parròquia, eth deth gimnàs e eth dera mia cunhada. Quan arribe ara mia cunhada, beròi, ja ei oficiau.",
        debate: "Aguesta nèt, debat. Se t'enteni «era majoria sociau», te lanci ua barra de pan dera grada.",
        finalPrep: "Darrèra vòuta. Passa pera parada deth bus: era gent que demore a temps e a queishes. Escota, qu'eri ja hè ua estona que parlen.",
      }[s.mission] || "Jo aciu, damb era mia libreta. Tu a çò tòn, que t'è er uelh dessús.";
      return [{ speaker: "Marisa", text }];
    },

    lola: {
      crisis: { after: "Lola: «Seguisqui damb eth BOE d'uei. Disposicion finau setau. A mòrt eth majordòm».", lines: [
        { speaker: "Lola", text: "Mentre vos baralhatz damb eth vidèo, è legit eth BOE. Un decret mete pensions e cambi d'ora en madeish paquet. Çò nòste ei mès petit: mos guarden es compdes damb lupa.", choices: [
          { text: "Publica-les. Totes.", memory: "lolaBooks", response: "Enquia eth tiquet deth cèlo. Se mos atrapen, que sigue en un arredonit de sèt centims. E en document a part, non metut entre es pensions." },
          { text: "Mès val demorar que passe.", memory: "lolaWait", response: "Açò en un ministèri se ditz «non consta». Es crisis non passen: s'archiven. E quauqu'un les desarchive era setmana abans de votar." },
        ] },
      ] },
      default: { after: "Lola: «Pestanha naua: “Causes que non pagaram”. Dotze files. Cap non ditz “se finance soleta”».", lines: [
        { speaker: "Lola", text: "È dubèrt era huelha «Campanha_DEFINITIVA_v3». Entrades: eth pòt deth grup e quaranta euros que mos deu Dani. Eth ne ditz «deute istoric»." },
        { speaker: "Lola", text: "Despenes: pizzes, estampa e ua factura de «consultoria de relat» signada peth cosin de Dani. La pagui?", choices: [
          { text: "Ne de broma. Tot damb factura e tot publicat.", memory: "lolaReceipts", response: "Gràcies. Se gessem enes nauèles, que sigue per avorrits. Transparéncia de vertat, non un portau que cau eth dia que lo cerques." },
          { text: "Paga-la, qu'eth cosin ei brave.", memory: "lolaCousin", response: "Brave ac ei. Te l'apunti ena pestanha «Adjudicacions a dit, version barri». Ja veiràs com quede de ben en un fil." },
          { text: "Ei, Lola… e tu com arribes a fin de mes?", memory: "lolaRent", response: "Compartisqui pis damb dus opositors. Estúdien leis que cambien abans der examen. Jo pagui e eri me resumissen eth BOE. Per açò sò aciu, d'acòrd?" },
        ] },
        { speaker: "Lola", text: "Va, ara taula. Comanda: barbacoa e quate formatges. Era d'ananàs la propausèc Dani, peró non a passat eth tramit d'audiéncia." },
      ] },
    },

    dani: {
      crisis: { after: "Dani: «Pòrti tres versions deth comunicat. Totes tres comencen per “Dauant des informacions aparegudes”».", lines: [
        { speaker: "Dani", text: "Quate-cents comentaris: dus-cents bots, cent dera mia mair defenent-te e cent de gent reau fòrça enfadada. Eth clip l'a pujat un canau de S'a Acabat era Sièsta.", choices: [
          { text: "Respon as de vertat, un per un.", memory: "daniReply", response: "Un per un. Sense «planhem que s'age podut interpretar mau». Passa-me cafè. Se me ves escríuer «relat», lheva-me eth mobil." },
          { text: "Bloca a tot eth mon e puja un mème.", memory: "daniMeme", response: "Hèt. Ara eth mème a mès comentaris qu'eth problèma. Es assessors ne diden «cambiar eth marc». Era mia mairbona, «hèr eth sord»." },
        ] },
      ] },
      default: { after: "Dani: «Sò damb er argumentari de deman. Hè dues ores que dubti entre “apostar per” e “contunhar apostant per”».", lines: [
        { speaker: "Dani", text: "Deman gesse eth tòn prumèr argumentari. Te lo legi: «Dauant deth bronit, barri. Dauant deth relat, hèts. Dauant de…». Bon, m'a gessut un shinhau frentista." },
        { speaker: "Dani", text: "T'enregistri en tot explicar eth programa. Format oficiau, en manjas de camisa passejant per un poligòn, o damb filtre e era cançon de mòda?", choices: [
          { text: "Sense filtre e sense poligòn. Que se vegen es ulhères.", memory: "daniNoFilter", response: "Valent. Es ulhères son çò unic autentic que demore en internet. Pòcs likes, peró de gent qu'existís." },
          { text: "Damb filtre e damb era cançon de mòda.", memory: "daniTrend", response: "Atau m'agrade. Deman arrés sabrà qué propòses, peró tot eth mon saberà que dances coma un ministre ena hèsta deth vilatge." },
          { text: "E tu, qué tau, damb tanti trabalhs?", memory: "daniJobs", response: "Tres clients e era mia mair demanant quan me hèn fix discontinu, qu'a era li sone a fix. Açò ei çò unic que hèsqui gratis. E çò unic que m'agrade de vertat." },
        ] },
        { speaker: "Dani", text: "Ua causa: er argumentari l'escrivi jo, peró lo corregís Marisa. Non sai com entrèc en grup. Ja non gausi trèir-la." },
      ] },
    },

    nico: {
      crisis: { after: "Nico: «Sò montant cadières. Ua se plegue soleta. Aquera non vòte».", lines: [
        { speaker: "Nico", text: "A baishat Ernesto, eth deth tresau. A eth pis barrat dempús de çò deth plafon e ditz qu'eth vidèo lo tracte d'especulador. Dempús m'a demanat se li arròsi es plantes.", choices: [
          { text: "Convida-lo ara assemblada deth portau. Que digue era sua version.", memory: "nicoInvite", response: "Va. Ditz que lhogarie se sabesse que lo recupère. Ei a díder: eth a un pis, eth nebot de Marisa non, e ath miei i a ua lei. Qué causes." },
          { text: "Ne cas. Ei er enemic.", memory: "nicoEnemy", response: "Enemic? Ei Ernesto, deth collègi. Li dèui un balon dempús de sisau. Dani l'apère «gran tenedor» en argumentari. A un pis. Eretat." },
        ] },
      ] },
      default: { after: "Nico: «Vau a cercar mès cèlo. Aguest pègue quan vò, coma un sòci de Govèrn».", lines: [
        { speaker: "Nico", text: "È pegat quaranta cartèls. Ath costat deth de Fox i auie un shivau de vertat, en dobla fila. Li è pegat un tanben. Non a protestat. Prumèr supòrt." },
        { speaker: "Nico", text: "Per cert, era Reme ditz que vòte a qui li trape cita damb eth cardiològ abans de Nadau. Qué li didi?", choices: [
          { text: "Era vertat: qu'açò non s'arrange en un mes, peró que lutaram.", memory: "nicoTruth", response: "Ja l'ac dirè. Meterà era cara que meten es senhores quan entenen era vertat: pena e respècte, a parts parières. Eth vòt, ja se veirà." },
          { text: "Di-li que òc. Cita en ua setmana.", memory: "nicoPromise", response: "Li prometes en ua setmana çò qu'era lista d'espèra tarde mieg an. En deseme, era Reme te l'ac brembarà. Damb eth baston." },
          { text: "Que vengue ara assemblada deth portau e mos ac conde a toti.", memory: "nicoAssembly", response: "Bona idèa. Es deth bloc hè ans que se queishen cadun en sòn replà. Amassa son ua junta de vesins: ua investidura, peró damb derrama." },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ["CAPÍTOL 1", "Pues me presento"],
      tv: { headline: "ELECCIONS!", ticker: "DARRÈRA ORA · DISSOLUCION DES CORTS · COMPARECÉNCIA SENSE QUESTIONS" },
      subs: [
        [null, "Dimenge, 23:47. «Un vidèo mès e ac deishi»."],
        ["Presentadora (TV)", "Darrèra ora: eth Govèrn dissòlv es Corts e convòque generaus. Era presidenta compareish sense questions: «es responses ja son ena web»."],
        ["Presentadora (TV)", "Es partits de tota era vida ja enregistren vidèos en manjas de camisa. Un a arribat a shivau. Seguiram informant. O non."],
        [null, "BZZZ. Quaranta-tres messatges. «E se mos presentam?». «hahaha». «Non, de bon»."],
        ["Tú", "Eleccions? Un aute còp? …A veir qué ditz eth grup."],
      ],
      toast: "Eth mobil non dèishe de vibrar. Ei ena tauleta, ath costat deth sofà.",
    },
    plaza: {
      banner: ["ETH BARRI", "Baishar ath carrèr"],
      subs: [
        [null, "Era plaça: hòrn, bar, un banc ath solei e mès opinions per mètre carrat qu'un platèu de television."],
        ["Marisa", "Ei, eth deth partit nau! Vien, que t'è de condar ua causa."],
        ["Paco", "Se vas a sauvar eth barri, que sigue dempús deth cafè. E eth cafè se pague, que non ei ua mesura."],
      ],
    },
    hq: {
      banner: ["CAPÍTOL 2", "Era sètz ei eth mèn salon"],
      subs: [
        [null, "Era sètz: un salon, ua taula plegabla e dues prises. Ua fonccione. Era auta, «en tramitacion»."],
        ["Lola", "Benvenguts ena sètz. Eth sofà ei era sala de premsa; eth frigorific, era tresoreria. Auditada."],
        ["Dani", "È aperat eth wifi «Gabinet». Ja auem estructura."],
        ["Nico", "Orde deth dia: un, cadières. Dus, qui pòrte gèu. Tres, Espanha."],
      ],
    },
    hall: {
      banner: ["CAPÍTOL 5", "Eth debat dera sala"],
      subs: [
        [null, "Sala polivalenta. Uei: debat. Deman: zumba. A uelh, era diferéncia ei petita."],
        ["moderator", "Bona nèt. Uns quanti atrils, un cronomètre e ua gèrra d'aigua qu'arrés non dubrirà. Prumèr blòc: abitatge."],
        ["tech", "Vengui damb sen comun. E damb paciéncia. Sustot damb paciéncia: hè ans que demoram que mos tòque."],
        ["populist", "Dauant dera onda reaccionària, avançam. Ena direccion que tòque aguesta nèt."],
      ],
    },
    victory: {
      banner: ["NÈT ELECTORAU", "Victòria!"],
      verdict: "PASSE ETH 48!",
      subs: [
        ["Periodista", "Damb eth cent per cent escrutat, toti es partits diden qu'an guanhat. Per un còp, un a rason."],
        ["Tú", "Auem… guanhat? Sense argumentari?"],
        ["Ana", "Discors! Peró cortet, que Marisa dubrís as cinc!"],
      ],
    },
    defeat: {
      verdict: "NON ARRIBE ATH 48",
      subs: [
        ["Periodista", "…e era candidatura deth barri se demore dehòra. Toti es auti, açò òc, asseguren qu'an guanhat."],
        ["Tú", "Dani ditz qu'ei «un resultat que mos permet contunhar bastint»."],
        ["Berto", "Marisa ja ac a tradusit: «as perdut, beròi». Ei, eth còp que vie te voti. Se me ac brembes."],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: "CAPÍTOL 2 · ERA SÈTZ EI ETH MÈN SALON", title: "Comitat de direccion: tres persones e un sofà.",
      intro: state => `Argumentari des 7:00: «Prioritizar axes estrategics». Responsa de Marisa en grup: «Causitz ua causa». I a temps entà ua prioritat de vertat; çò de mès, ath grup, a on mòren es idèes.${state.memories.nicoAssembly ? " Nico ja a pegat en portau un avís d'assemblada." : ""}`,
      choices: {
        accounts: { title: "Lola revise cada còst", flavor: "Pressupòst ara vista, enquia eth tiquet deth cèlo. Ne ua linha d'«auti despenes». Mens temps entàs rets" },
        street: { title: "Nico organize pòrta a pòrta", flavor: "Replà per replà, damb era excusa dera derrama der ascensor. Sense tauleta ne enquèsta: damb timbre" },
        content: { title: "Dani monte un petit gabinet", flavor: "Anèth de lum, croma de lençò verd e ua paret damb era paraula RELAT en pòstits" },
        tenants: { title: "Assemblada de vesins en portau", flavor: "Baishe gent que non se parlaue dempús de çò des umitats. Ernesto, eth deth pis barrat, tanben. Arrés non cuelh es cadières" },
      },
    },
    video: {
      eyebrow: "CAPÍTOL 4 · HÈ-AC VIRAU", title: "Era marca ei metuda. Manque eth messatge.",
      intro: state => { const m = state.memories; return `Argumentari des 7:00: «Ton pròche, messatge clar». Marisa: «Parla coma parles». Dani calcule tres segons abans que passen eth dit. Er abast dubrís pòrtes; era gent destrie atencion de supòrt.${m.daniNoFilter ? " Uei, sense filtre." : m.daniTrend ? " Dani ja a causit era cançon. Non demanes." : ""}`; },
      choices: {
        explain: { title: "Explicar era proposta e çò que coste", flavor: "Un minut, pla fix e ua pissarra de Lola damb era letra petita en gran" },
        chairs: { title: "Eth balh des cadières de Paco", flavor: "Coreografia damb cadières prestades. Arrés non sap qué propòses; tot eth mon sap que cades en segon onze" },
        neighbor: { title: "Deishar parlar a Marisa", flavor: "Era parle dera calor, deth locau que li an apujat e dera cita dera sua mair. Tu agantes eth mobil e te cales" },
        debunk: { title: "Desmontar era messorga deth dia", flavor: "Un canau de S'a Acabat era Sièsta ditz que vòs proibir es terrasses. Ac desmentisses damb eth pla sancer, qu'ei era arma secreta" },
      },
    },
    crisis: {
      eyebrow: "CAPÍTOL 5 · CRISI",
      title: (state, ctx) => ctx.contradiction ? "Eth tòn «tot entà toti» a arribat abans qu'era premsa." : "Un vidèo retalhat a arribat abans qu'era vertat.",
      intro: (state, ctx) => `${ctx.contradiction
        ? "Quauqu'un a pujat eth moment que ac prometies tot a còp. Musica de trailer, títol en majuscules e un rètol: «MARISA AC TRADUSÍS». Era non ac a hèt. Peró ac sotasigne."
        : "Circule un clip de nau segons talhat just abans qu'expliquèsses eth còst. Supervivent lo compartís damb «Açò ei çò qu'i a darrèr». Pacient, damb «Sense comentaris». Qu'ei un comentari."}${state.memories.nicoPromise ? " E era Reme a cridat: seguís sense cita." : ""} Prevision actuau: <b>${ctx.forecast.score}/100</b>. Ne cau ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: "Hèr cara: reconéisher era error e corregir-la", flavor: "Vidèo sense musica e sense «s'a trèt de contèxte». Damb questions, qu'ei ja quasi un escandau" },
        team: { title: "Publicar còsts e responsables", flavor: "Lola puje es compdes; Nico, qui hè qué. Avorrit, verificable e dificil de retalhar" },
        distract: { title: "Sortejar ua fregidora d'aire", flavor: "Entà participar: seguir eth compde, mencionar a tres amics e desbrembar eth tèma. Enes manuaus, «marcar agenda pròpria»" },
        blame: { title: "Encolpar ara maquina dera hanga", flavor: "Bots, algoritme e «es claveguères». Fonccione damb es tòns. Es auti coneishen eth truc: l'emplegan toti es partits" },
      },
    },
    debate: {
      eyebrow: "CAPÍTOL 5 · ETH DEBAT", title: "Tres rivaus, ua moderadora e ua gèrra sense dubrir.",
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `D'un costat, ${populist.name}, de ${populist.party}, damb dus argumentaris: eth deth maitin e eth dera tarde. Der aute, ${tech.name}, de ${tech.party}, que promet derogar causes que non nomente. Ath hons, ${hard?.name || "Covadonga del Muro"}, de Fox, qu'a provat d'entrar a shivau. ${moderator}: «A qué renóncie eth vòste programa?».`,
      choices: {
        tradeoff: { title: "Defensar era renóncia concrèta", flavor: (state, { rivals }) => `Dides çò que pèrdes e a qui molestes. ${rivals.tech.name} demane «ua dada». Li la das. L'apunte entà derogar-la` },
        attack: { title: (state, { rivals }) => `Trèir-li era emerotèca a ${rivals.populist.name}`, flavor: "Li lieges çò que didec hè dues campanhes. Aplaudiment aisit, titular aisit, zèro propostes. Era: «Rectificar ei de savis»" },
        manage: { title: "Dar tòrns e desmontar chifres damb calma", flavor: (state, { rivals }) => `${rivals.tech.name} promet baishar impòsts «a compdar deth dusau an, se er eretatge ac permet». Li demanes de quin an. Silenci. Aigua` },
        promise: { title: "Prométer limitar eth lhoguèr ara mitat «per decret»", flavor: (state, { rivals }) => `Eth public aplaudís. ${rivals.populist.name} te guarde damb enveja professionau. ${rivals.moderator}: «Ja ei dit»` },
      },
    },
    finalPrep: {
      eyebrow: "CAPÍTOL 6 · DARRÈRA VÒUTA", title: "Encara i a marge.",
      intro: (state, ctx) => `Prevision: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? "per dessús" : "per dejós"} deth lindau). Demoren dus dies. Eth sondatge oficiau vos da «ath torn de zèro»; tostemp l'endevine a favor de qui lo comane. Argumentari: «Mobilizar eth vòt util». Marisa: «Que i vague era gent». Sonque i a temps entà ua causa plan hèta.`,
      choices: {
        listen: { title: "Visitar as que encara dobten", flavor: state => `Era parada deth bus, era coa deth centre de santat e era senhora deth sac, que ja coneish ath que li panèc: se tròben cada mes en jutjat${state.memories.nicoAssembly || state.memories.nicoInvite ? ". Era assemblada deth portau te demane que tòrnes" : ""}. Escotes mès que non parles` },
        receipts: { title: "Publicar eth pressupòst definitiu", flavor: "Lola lo imprimís en A3: «era transparéncia tanben ei tamanh de letra». Sense annèxes que gesquen en agost" },
        volunteers: { title: "Ordenar voluntaris e collègis", flavor: state => `Nico repartís tòrns, entrepans e un mapa de collègis dessenhat en ua servieta${state.memories.pacoLucia ? ". Lucía, era cambrèra de Paco, s'apunte coma interventora" : ""}. Sense autocars de simpatizants: damb eth de linha` },
      },
    },
    finalSpeech: {
      eyebrow: "CAPÍTOL 6 · ETH DARRÈR MITING", title: "Ua frasa abans dera jornada de reflexion.",
      intro: "Cadières plegables, un glòbus que se desonfle e ua periodista deth diari locau damb cara de tresau miting deth dia. Enes auti barraments de campanha i a autocars e bandères; aciu, eth deth butà. Consolida çò aprés o torna a prométer-ac tot.",
      choices: {
        account: {
          title: state => ({
            shade: "“I aurà ombra e i aurà mens cotxes. Açò causim, açò coste e aciu responeram.”",
            parking: "“Eth barri poderà trabalhar, encara qu'aguest estiu seguisque sense arbes. Açò causim e aciu responeram.”",
            festival: "“I aurà cultura e i aurà bronit pactat. Açò causim, açò coste e aciu responeram.”",
            housing: "“I aurà mès abitatges perqué les bastiram, non perqué les anoncièm. Tarderà. E aciu responeram.”",
          }[state.proposal] || "“Açò causim, açò coste e aciu responeram.”"),
          flavor: "Ac dides sense papèrs. Marisa dubrís era libreta e, per prumèr còp, non apunte arren",
        },
        viral: { title: "“Mens embotelhatge e mès gaspatxo!”", flavor: "Dani ac emet en dirècte. Tot eth mon ac cride. Arrés non sap qué vò díder. A mieja nèt ja l'an copiat tres partits" },
        everything: { title: "“Deman i aurà de tot entà toti, per decret.”", flavor: (state, { rivals }) => `Aplaudiment enorme. Lola se cuebre era cara damb eth pressupòst. ${rivals.populist.name} t'escriu: «En parlam?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: "NÈT ELECTORAU · VICTÒRIA", title: "I a mès cadières que persones.",
      text: state => `Marisa aplaudís un còp. Lola demane qui a guardat es factures. Pacient e Supervivent ja an cridat dus còps: «Qué aufritz?». As 7:00 arribe eth darrèr argumentari de Dani: «Auem guanhat». Marisa respon: «Açò ac enteni». ${{
        shade: "Deman comence çò dificil: explicar-li ara furgoneta deth nebot a on pòt aparcar.",
        parking: "Deman comence çò dificil: eth prumèr agost sense arbes damb eth tòn nom ena placa.",
        festival: "Deman comence çò dificil: era prumèra reunion damb es deth prumèr, que ja t'an portat tapons.",
        housing: "Deman comence çò dificil: era prumèra licéncia. Ernesto demane se pòt lhogar eth tresau abans que s'acabe era legislatura.",
      }[state.proposal] || ""}`.trim(),
    },
    defeat: {
      eyebrow: "NÈT ELECTORAU · DERRÒTA", title: "Un resultat que mos permet contunhar bastint.",
      reasons: {
        support: "Manquèc supòrt dirècte: eth barri te vedec mès en mobil qu'en replà.",
        credibility: "Es contradiccions pesèren: ena coa deth pan non i a emerotèca, peró i a memòria.",
        organization: "Er equip arribèc desordenat: un collègi sense interventor e un aute damb tres.",
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: "MINIJÒC · HÈ-AC VIRAU", title: "Enregistrant ena marca.", goWord: "Accion!",
      lanes: ["Salutacion", "Amont!", "Palmes", "Non consta"],
      takes: {
        explain: "Pissarra de Lola, pla fix e cada gèst subratlhe un còst.",
        chairs: "Eth balh des cadières. Paco guarde, serios, sense díder arren.",
        neighbor: "Marisa parle dera calor; tu, darrèr, marques eth ritme sense que se note. Se note.",
        debunk: "Desmontes era messorga damb gèsts clars: açò non, açò òc, açò coste.",
      },
      intro: (state, ctx) => `Mobil en trepè, vesins guardant e Dani comptant. ${ctx.take} Hè cada postura quan era sua icòna arribe ath cercle. Eth ritme suma abast, non vòts.`,
      titles: { great: "Virau! Es Sumands ja t'an ofrit èster un petal.", ok: "Se compartís en tres grops de WhatsApp. Un ei eth dera tua mair.", bad: "Quaranta visualizacions. Dani ne ditz «impacte qualitatiu»." },
      texts: { ok: "Dani ja i mete subtítols en jaune. Era presa vau: er abast dubrís pòrtes, peró es vòts se guanhen en portau.", bad: "T'as perdut entre era salutacion e es palmes. Torna a enregistrar: per ara, «non consta»." },
    },
    duel: {
      eyebrow: "MINIJÒC · DUEL DE REPLICAS", title: "Cinc questions, un cronomètre.",
      intro: (state, ctx) => `${ctx.rounds} replicas. Causís era responsa que defen quauquarren concrèt e n'assumís eth còst abans que s'acabe eth temps. A mieges, quauqu'un t'interromperà: demana era paraula.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: "A qui aparque en dobla fila e a dues taules dera terrassa de Paco. Ombra a cambi de cotxes, dit clar.",
          parking: "Ath banc ath solei: aguest estiu seguirà sense arbes. Causim qu'eth barri pogue trabalhar.",
          festival: "As deth prumèr, dues nets per setmana. Damb orari pactat e tapons de regal, literaument.",
          housing: "Ara plaça, que seguís sense ombra, e ara nòsta paciéncia: bastir tarde mès qu'ua legislatura. E mos diràn «es des proprietaris».",
        }[state.proposal];
        return [
          { topic: "Abitatge", role: "populist", claim: "Gràcies ara nòsta lei, enes zònes tensionades eth lhoguèr s'a estabilizat. Es abitatges que manquen les amague era especulacion.",
            options: ["S'ei «estabilizat», perqué eth tresau ei barrat hè un an? Limitar non hè abitatges. Bastir òc, encara que tarde mès qu'un titular.", "Donc nosati lo limitam ara mitat! E eth pan tanben!", "Vos portatz ua insinha de colors. Ac sap tot eth barri."], correct: 0 },
          { topic: "Dades", role: "tech", claim: "Segon un informe que non è portat, era vòsta proposta enfonsarà eth barri. Ac ditz aguest grafic. Eth dera flècha ròia.",
            options: ["E segon eth mèn, eth vòste grafic ei ua messorga. Empat tecnic.", "Bon, es dades son relatives. Coma es enquèstes.", "Mostratz era hont. Era nòsta: eth pressupòst de Lola, pagina dus, damb fòto deth banc as cinc dera tarde."], correct: 2 },
          { topic: "Era vòsta proposta", role: "moderator", claim: "Question dirècta: a qui perjudique era vòsta proposta? Minut d'òr. Bon, dètz segons de bronze.",
            options: ["A arrés. Ei ua proposta transversau, sense perdents, coma un anonci de colònia.", cost || "A quauqu'un, segur. Ac diram damb nom e cognòm quan ac sapiam.", "As de tota era vida, que ja saben qui son."], correct: 1 },
          m.promisedBoth
            ? { topic: "Era promesa", role: "populist", claim: "Vos prometéretz a ua hornèra ombra, aparcament e un pis entath sòn nebot! Açò ei populisme. E ac didi damb coneishença de causa.",
                options: ["Ei vertat. M'è equivocat en prométer-ac tot; dempús auem causit ua causa e auem explicat çò que coste.", "S'a trèt de contèxte. Eth contèxte ère jo prometent-ac tot.", "Vos tanben ac prometetz tot. Empat."], correct: 0 }
            : { topic: "Santat", role: "tech", claim: "E era santat? O sonque vos interèsse era vòsta plaça? Nosati gestionaram. Fòrça. Damb gestion.",
                options: ["Prometi que deman non i a listes d'espèra. Paraula.", "Mos interèsse. Per açò non prometem çò que non gestionam: amiaram era cita dera Reme ath plen, damb nom e data.", "Ac derogaram tot, coma vos. Ja veiram qué."], correct: 1 },
        ];
      },
      interruptions: {
        populist: "Perdonatz! Açò ei dera maquina dera hanga. Ac didi sense auer-ac entenut sancer.",
        tech: "Se me permetetz… coma didie aguest maitin un diari… vos lo legi sancer…",
        moderator: "Vos demoren dètz segons. Nau. Ja ei dit.",
        fallback: "Perdonatz, perdonatz!",
      },
      floor: "Deishatz-me acabar, qu'açò non ei ua conferéncia de premsa.",
      floorBabble: "Deishatz-me acabar",
      reactions: {
        timeout: "S'a acabat eth temps. Ja ei dit. Blòc següent.",
        quick: "Responsa concrèta e a temps. Insolit. Apuntat.",
        slow: "Concrèta, encara que justeta de temps.",
        wrong: "Gràcies per dar-me era rason. Ac meterè en argumentari.",
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} ditz que òc damb eth cap. E non ditz «ja ei dit».`, mid: "As aguantat eth tipe. Sense apunts amagats.", low: "Deman es rivaus diràn qu'an guanhat. Uei, damb motiu." },
      text: "Era estrategia que causires marque eth debat; es replicas decidissen se te creden.",
    },
    chairs: {
      eyebrow: "MINIJÒC · SIES CADIÈRES", title: "Prèst, non subvencion.",
      intro: (state, ctx) => `Entara darrèra assemblada calen es sies cadières de Paco, escampilhades peth barri. Passa per dessús d'ua entà agantar-la e amia-la ath cercle. Ua per ua: «era esquia tanben vòte», ditz Nico. As ${ctx.time} segons.`,
      hints: {
        start: "Passa per dessús d'ua cadièra entà agantar-la.",
        carry: "Ara, ath cercle jaune.",
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. A per era següenta.`,
        full: "Cercle complet!",
      },
      titles: { all: "Sies cadières en cercle. Paco, d'acòrd.", mid: "Mieg cercle. Era rèsta, de pè e opinant.", low: "Paco cuelh es cadières eth madeish. E ac comente." },
      texts: { all: "Nico apunte eth temps ena servieta. Organizar ei açò: qu'i age lòc quan arribe era gent.", other: "Es que manquen son encara pera plaça. Torna-i: arrés non a vist arren, sauf Paco." },
    },
    rally: {
      eyebrow: "MINIJÒC · ETH DARRÈR MITING", title: "Que non se t'escape era sala.", goWord: "Parla!", lane: "Remata era frasa",
      intro: "Cada frasa a un remat. Quicha quan era paraula arribe ath cercle: eth public aplaudís e era atencion puge. Se falhes, quauqu'un guarde eth mobil. O pejor: shiule.",
      phrases: state => {
        const own = {
          shade: ["Aguest estiu, era plaça aurà", "OMBRA"], parking: ["Qui trabalhe en aguest barri poderà", "DESCARGAR"],
          festival: ["Era mainada aurà locau e era plaça,", "CULTURA"], housing: ["Es abitatges non s'anoncien: se", "BASTISSEN"],
        }[state.proposal] || ["Ua causa plan hèta, entà", "COMENÇAR"];
        return [
          ["Bona nèt. Gràcies per vier sense autocar e damb", "CADIÈRA"],
          ["Non vengui damb argumentari: vengui damb", "UA CAUSA"],
          own,
          ["E òc: a un còst. L'auem metut per", "ESCRIT"],
          ["Sense observatòri, sense comission e sense", "LOGO"],
          ["Arrés aciu vos a dit qu'açò se pague", "SOLET"],
          ["Se non complim, ja sabetz a on ei eth", "HÒRN"],
          ["Aguesta nèt Marisa non a arren que", "TRADUSIR"],
          ["Dimenge non vos demani fe: vos demani que", "VOTETZ"],
          ["A qui volgatz. Peró que non decidisque eth", "SOFÀ"],
          ["Gràcies, barri. E ara, es cadières, a", "PACO"],
          ["E per açò, me", "PRESENTI!"],
        ];
      },
      titles: { great: "Era sala en pè. Es qu'an cadièra, tanben.", ok: "Aplaudiments sincèrs e bèth badalh.", bad: "S'a entenut un mobil. Ère er argumentari." },
      text: "Eth public se brembarà de com ac dideres; era decision qu'as presa decidís de qué se brembe.",
    },
  },
};
