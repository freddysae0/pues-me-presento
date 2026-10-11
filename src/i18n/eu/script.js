// Guion · Euskara (eu). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte queda en español.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
//
// Notas de adaptación: los nombres propios (personas, partidos rivales, Fox, Se Acabó La Siesta) se mantienen.
// Para no tener que declinar nombres interpolados (ergativo, dativo…), las funciones usan «Nombre: «…»» o
// «Nombre hautagaiak». «Queda dicho» de la moderadora → «Esanda dago». El argumentario → «argudiategia».

const PROPOSAL_DEFAULT = 'Gauza bat ondo egina, hasteko.';

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  // Nombres y partidos rivales: se mantienen los del español (también salen en src/data/parties.js).

  foxDebate: {
    hallLine: 'Zaldia bigarren ilaran utzi dut. Eramaten badute, ideologia da.',
    interruption: 'Excuse me! Konplexurik gabe: edo hitz egiten uzten didazu, edo altxatu eta banoa. Gobernuetatik irteten praktika handia daukat.',
    round: {
      topic: 'Segurtasuna', role: 'hard',
      claim: 'Geltokiko andreari poltsa lapurtzen dionak hamaika atxiloketa ditu. Hamaika. Eta Gobernuak, epaileen ordez, behatoki bat ireki du. Zuk zer egingo zenuke?',
      options: [
        'Errepikatzea ez dadila doan atera: epaiketa azkarra, eta egun berean ate beretik ez irtetea. Eta epaileak, dirua kostatzen dutenak. Esaten dugu.',
        'Esku gogorra! Eta zaldi bat auzo bakoitzeko!',
        'Hitz egin dezagun arrazoiez. Hamaikez.',
      ],
      correct: 0,
    },
    reactions: {
      right: 'Hara. Hori ez da eskuindar koldar batena. Oraingoan behintzat.',
      wrong: 'Ikusten? Konplexurik gabe azkarrago pentsatzen da. Zaldia utziko dizut.',
      timeout: 'Zu pentsatzen zauden bitartean, goiz jaikitzen den Espainia oheratu da jada.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'HAUTESKUNDE OROKORRAK · ARGUDIATEGIA BARNE',
    tagline: 'Beste alderdiek aholkulariak dituzte. Zuk, itzultzaile lanetan dabilen okin bat.',
  },

  chapters: ['Pues me presento', 'Egoitza nire egongela da', 'Kalera jaitsi', 'Biral bihurtu', 'Testuingurutik atera da', 'Azken mitina'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'Agerraldia sofatik', objective: 'Hurbildu mugikorrera, sofaren ondoan. Sakatu E.' },
    call: { title: 'Kontsulta-txanda', objective: 'Erabili mahaiko ordenagailua lagunei deitzeko.' },
    register: { title: 'Ondorio guztietarako eratuta', objective: 'Joan idazmahaiko karpetara eta erregistratu alderdia.' },
    leave: { title: 'Errealitatearekin lehen harremana', objective: 'Irten ate berdetik plazara jaisteko.' },
    neighbor: { title: 'Entzute-prozesua (benetan)', objective: 'Hitz egin Marisarekin, okindegiko toldoaren ondoan. Pacok ere, tabernako terrazan, baditu gauzak kontatzeko.' },
    program: { title: 'Dena ez da dekretu batean sartzen', objective: 'Aukeratu zure lehen proposamena plazako iragarki-taulan.' },
    speech: { title: 'Lehen agerraldia, publikoarekin', objective: 'Igo faristolaren puntura eta eman zure lehen hitzaldia.' },
    aftermath: { title: 'Ogi-ilarak egiten du analisia', objective: 'Itzuli Marisarengana ogi-ilaran zer esaten den jakiteko.' },
    hqBrief: { title: 'Egoitza nire egongela da', objective: 'Bildu taldea kanpaina-mahaian. Lolak, Danik eta Nicok ere zurekin hitz egin nahi dute.' },
    video: { title: 'Biral bihurtu (mezuarekin, ahal bada)', objective: 'Grabatu bideo bat okindegiaren ondoko markan.' },
    crisis: { title: 'Ez nuen zehazki hori esan', objective: 'Egin aurre krisiari iragarki-taulan. Aurretik, agian, komeni da taldea entzutea.' },
    debate: { title: 'Aretoko eztabaida', objective: 'Sartu eztabaidan aurkariekin.' },
    finalPrep: { title: 'Auzoari azken itzulia', objective: 'Aukeratu mapan non bildu azken ahalegina.' },
    finalSpeech: { title: 'Azken mitina, autobusik gabe', objective: 'Itxi kanpaina publikoaren aurrean.' },
    election: { title: 'Aulkien gaua', objective: 'Begiratu hauteskundeen emaitza.' },
    complete: { title: 'Kanpaina osatuta', objective: 'Kanpaina amaitu da.' },
  },

  travel: {
    hqBrief: { title: 'Lekualdatze instituzionala', objective: 'Egoitza Pacoren tabernaren ondoko atariko behean dago. Joan atera eta sakatu E.', prompt: 'Ataria · Egoitzan sartu', loading: 'EGOITZAN SARTZEN…', sign: 'EGOITZA' },
    video: { title: 'Hedabideetara atera (plazara)', objective: 'Grabatzeko argia eta auzokideak behar dira. Irten egoitzako atetik eta jaitsi plazara.', prompt: 'Atea · Plazara jaitsi', loading: 'PLAZARA JAISTEN…', sign: 'PLAZA' },
    crisis: { title: 'Premiazko bilera, tupperrarekin', objective: 'Zerbait sutan dago egoitzako taldean. Itzuli tabernaren ondoko ataritik.', prompt: 'Ataria · Egoitzara itzuli', loading: 'EGOITZARA IGOTZEN, PRESAKA…', sign: 'EGOITZA' },
    debate: { title: 'Erabilera anitzeko aretora lekualdatzea', objective: 'Irten egoitzako atetik. Erabilera anitzeko aretoan faristolak muntatuta daude jada.', prompt: 'Atea · Erabilera anitzeko aretora joan', loading: 'ERABILERA ANITZEKO ARETORANTZ…', sign: 'ARETOA' },
    finalPrep: { title: 'Lurraldea zapaldu', objective: 'Irten aretotik ate bikoitzetik. Aste bat falta da, eta kalean irabazten da.', prompt: 'Atea · Plazara itzuli', loading: 'AUZORA ITZULTZEN…', sign: 'PLAZA' },
    finalSpeech: { title: 'Garraio publikoa, batez besteko hautesleak bezala', objective: 'Joan kioskoaren ondoko geltokira eta hartu 27a erabilera anitzeko aretoraino.', prompt: 'Geltokia · 27a hartu aretora', loading: '27A BADATOR. BERANDU, BAINA BADATOR…', sign: '27 BUSA' },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: 'Itzala, beroaren behatoki baten aurretik', cost: '2 kreditu', benefit: 'Zuhaitzak, toldoak, dabilen iturri bat eta izkinako behe hutsa adinekoentzako gela fresko gisa. Plan zuzentzailerik gabe: lorazain batekin.', compromise: 'Aparkaleku batzuk galtzen dira, Pacoren terrazak bi mahai gutxiago ditu eta Marisaren ilobak furgoneta bigarren ilaran uzten du berriro.' },
    parking: { title: 'Auzoak lan egin ahal izan dezala', cost: '2 kreditu', benefit: 'Ordutegidun zamalan-gunea, merkataritzarako txandakako aparkalekuak, banatzaileentzako bizikleta-aparkalekuak eta terraza-lizentziak egunetan, ez hiruhilekotan.', compromise: 'Auto gehiago plazan eta beste abuztu bat eguzki betean. Bankuak irakiten jarraituko du.' },
    festival: { title: 'Kultura zortzietatik aurrera', cost: '2 kreditu', benefit: 'Auzoko taldeentzako agertokia, udako zinema eta entsegu-lokal bat, auzo-elkarteak kudeatua, ez logodun fundazio batek.', compromise: 'Zarata astean bi gauetan; lehen solairukoak, belarri-tapoiekin. Itzala eta zamalanak, tiraderara.' },
    housing: { title: 'Hirugarrenak bizilagunak izan ditzala berriro', cost: '2 kreditu', benefit: 'Lizentziak astetan, izkinako orubean eraikitzea eta itxitako pisu bat alokatzeak beldurrik ez ematea.', compromise: 'Eraikitzeak muga bat iragartzeak baino gehiago irauten du. Ez da albistegian ateratzen, «etxejabeena» deituko dizute eta plazak itzalik gabe jarraitzen du.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'BOE-a gustura irakurtzen du', line: 'Gestoria batean lan egiten dut eta BOE-a metroan irakurtzen dut, eleberri beltza balitz bezala: hildakoa beti xedapen gehigarrian dago. Nik eramango dizkizut kontuak.', choices: [
      { label: 'Diruzaintza. Zuk erabakitzen duzu noiz den ezetz.', reply: 'Onartzen dut. Lehen araua: hemen ezer ez da «hazkundearekin finantzatzen». Diruarekin finantzatzen da: aspergarriagoa da, baina existitzen da.' },
      { label: 'Estrategia. Norbaitek irakur dezala letra txikia.', reply: 'Eginda. Letra txikian ezkutatzen dute gobernuek garrantzitsuena. Letra handia kartelerako da.' },
    ] },
    dani: { role: 'Hari bidez hitz egiten du', line: 'Hortz-klinika batentzat eta gimnasio batentzat egiten ditut bideoak. «Kanpaina-aholkulari ohi» guztien hariak irakurri ditut. Zuek jarri ideiak; nik kontakizuna egingo dizuet.', choices: [
      { label: 'Komunikazioa. Kontakizuna bai, kea ez.', reply: 'Tratua. Goizero 7:00etan, argudiategia taldean. Laburra, argia eta «erresilientzia» hitzik gabe. Beno, ia gabe.' },
      { label: 'Bozeramailea. Galderei erantzun beharko diezu.', reply: 'Galderadun prentsaurrekoak? Hori jada inork ez du egiten. Ados: vintage izango gara.' },
    ] },
    nico: { role: 'Atari osoa ezagutzen du', line: 'Biltegi batean txandaka egiten dut lan eta atari osoa ezagutzen dut. Nik mobilizatzen dut. Baina bilera batean norbaitek «zeharkakoa» esaten badu, pipak erostera jaisten naiz.', choices: [
      { label: 'Antolakuntza. Zuk jartzen dituzu ordutegiak.', reply: 'Eginda. Hogei minutuko bilerak. Gehiago irauten badu, norbait argudiategi bat irakurtzen ari delako da.' },
      { label: 'Ekitaldiak. Zure megafono-ahotsa behar dugu.', reply: 'Gabonetako loteria tabernan tokatu zenean, kale osoa jaitsi zen zapatilekin. Emadazu horrelako arrazoi bat eta plaza beteko dizut.' },
    ] },
  },

  call: {
    title: 'Kontsulta-txanda. Bideodeiz.',
    you: 'Ideia bat izan du',
    next: 'Hurrengo ausarta',
    done: 'Badugu taldea. Danik «Argudiategia 7:00» taldea sortu du. Eta, nahi gabe, Marisa okina sartu du.',
    doneBabble: 'Badugu taldea.',
    finish: 'Plazara jaitsi',
  },

  register: {
    eyebrow: 'SORRERA · LEIHATILA BAKARRA',
    title: 'Izen bat boto-txartelerako.',
    stamp: 'ZUZENTZEKO ZAIN',
    intro: 'Hiru eremu. Ez ziurtagiri digitalik, ez aurretiko hitzordurik, ez III. eranskinik. Amets bat bada hau, ez dadila Ministerioko inor esnatu.',
    defaultName: 'Bankuko Jendea',
    defaultSlogan: PROPOSAL_DEFAULT,
    submit: 'Hautagaitza erregistratu',
    toast: 'ERREGISTRATUTA. Zero egun baliodunetan ebatzia. Leihatilan inork ez daki nola gertatu den.',
  },

  program: {
    eyebrow: 'PROGRAMA · AURREKONTUA: 2 KREDITU',
    title: 'Lehenetsi: aukeratzea, baina gorbatarekin.',
    intro: 'Proposamen bakarra sartzen da. Besteak ez dira «egutegiratzen», ezta «bigarren fase batera atzeratzen» ere: egin gabe geratzen dira. Auzoak badaki bereizten.',
    promisedBothNote: 'Marisak gogoan du itzala, aparkalekua eta ilobarentzako pisua agindu zenizkiola. Aukera batek ere ez du hori guztia ordaintzen. −6 sinesgarritasun zehaztean.',
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Orain, faristolan azaltzeko txanda. Galderekin.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ['Beno. Hemen gaude, ba.', 'Zer defendatuko duzu?', 'Azken esaldiak balio du.'],
    parts: {
      opening: { title: '01 / Izotza hautsi', prompt: 'Zazpi lagun. Bi busaren zain, bat ogia erostera jaitsi da eta beste bat grabatzen ari da, «erresilientzia» esango duzulakoan.', options: {
        listen: 'Hitz egin aurretik, entzutera etorri naiz. Benetan, ez «entzute-prozesu» batean.',
        joke: 'Laburra izango naiz. Politikari gisa diot, beraz, jar zaitezte eroso.',
        grand: 'Gaur herrialde-zerumuga berri baterako bide-orri zeharkako bati ekiten diogu!',
      } },
      argument: { title: '02 / Zerbait zehatza esan', prompt: 'Orain iragarki-taulan iltzatu duzuna defendatzeko txanda da. Marisak koadernoa atera du jada.', options: {
        shade: 'Itzala eta leku fresko bat adinekoentzat, aparkalekua galdu arren. Plan zuzentzailerik gabe: zuhaitzekin.',
        parking: 'Lan egiten duenak zamalanak egin ahal izan ditzala, plazak uda honetan zuhaitzik gabe jarraitu arren.',
        festival: 'Kultura eta lokal bat gazteentzat, zarata-ordutegi adostuarekin eta idatziz.',
        housing: 'Pisu gehiago: lurzorua, lizentzia azkarrak eta alokatzeak beldurrik ez ematea. Ez da astelehenean jaitsiko; eraikiz jaitsiko da.',
        everything: 'Zuhaitzak, aparkalekua, jaialdiak eta pisu bana denontzat, doan eta dekretu bidez astelehenerako!',
      } },
      close: { title: '03 / Bukatzen jakin', prompt: 'Marisak erlojuari begiratzen dio. Kanpaina asko ikusi dituen erlojua da.', options: {
        accountable: 'Betetzen ez badugu, hementxe galdetu iezaguzue. Eta erantzun egingo dugu, hori bera ere berritasuna baita.',
        chant: 'Kotxe gutxiago eta gazpatxo gehiago!',
        forever: 'Amaitzeko, eta laburtasunaren mesedetan, nire hurrengo hogeita zazpi ardatzak…',
      } },
    },
    timing: { eyebrow: '04 / AZKEN KOLPEA EMAN', title: 'Orain. Sinesmenez.', button: 'Eta horregatik aurkezten naiz!' },
    result: {
      eyebrow: 'AUZOAK ENTZUN DU',
      goodTitle: 'Txalo bat. Klakarik gabe.',
      badTitle: 'Adeitasunezko txaloa. Telebistan, «harrera ona».',
      coherent: 'Zure proposamena defendatu duzu eta zer kostatzen duen esan duzu. Politikan horrek izen arraro bat du: egia esatea.',
      incoherent: 'Zure hitzaldia ez dator bat programarekin. Telebistan «ñabartzea» deitzen diote. Ogi-ilaran, beste zerbait.',
      fine: 'Irismenak arreta neurtzen du, ez botoak. Ondorioak esan duzunaren araberakoak dira.',
      button: 'Faristolatik jaitsi',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: 'Zu zara alderdi berrikoa? Zuen argudiategia iristen zait: Danik taldean sartu ninduen, nahi gabe. Bostetan irakurtzen dut, lehen labealdiarekin batera.' },
      { speaker: 'Marisa', text: 'Nire iloba banatzailea da eta ez dauka non gelditu. Hogeita hamalau urte, txikitako logelan. Eta hirugarrena itxita dago legearena gertatu zenetik. Nondik hasiko zara?', choices: [
        { text: 'Zu entzutetik. Zerk kentzen dizu loa?', memory: 'listened', response: 'Niri? Pazientzia faltak. Amaren hitzordua hilabete batzuk barru da, eta itxaronaldia, eguzkitan.' },
        { text: 'Denetik: itzala, aparkalekua eta pisu bat zure ilobarentzat.', memory: 'promisedBoth', response: 'Telebistan horri «neurri-pakete integrala» esaten diote. Hemen, «ikusiko dugu». Koadernoan idatziko dut.' },
        { text: 'Zarata eginez: mapan jarriko gaituen jaialdi bat.', memory: 'spectacle', response: 'Mapan? Turismo-pisuen web guztietan agertzen gara jada: «benetako auzo jatorra». Hemen geratzen den jator bakarra ni naiz, eta ordu bietan ixten dut.' },
      ] },
      { speaker: 'Marisa', text: 'Hor duzu iragarki-taula. Gauza baterako ematen du. Bat. Eta faristolan, ezer ez «balioan jarri» edo «bide-orri». Esaten baduzu, ogi-barra bat jaurtiko dizut.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Itzala, aparkalekua eta pisua agindu zenizkidan ilobarentzat. Hiru gauza eta data bakar bat ere ez. Koadernoaren hamabigarren orrialdea.'
        : m.listened ? 'Lehen entzun egin nauzu. Gutxi dirudi, baina hitzaldia plastifikatuta dakartenek ez dute begirada paperetik altxatzen.'
        : m.spectacle ? 'Jaialdiarena auzo osoak entzun du. Lehen solairukoak galdezka ari dira jada belarri-tapoiak programan doazen ala errege-dekretu batean.'
        : 'Kaxatik jaitsi zara jada. Iazkoari baino gutxiago dardaratzen zitzaizkizun hankak. Eta iazkoak jarraitzaileen autobusa ekarri zuen.';
      const coherent = {
        shade: 'Itzala jartzeko autoak kentzen dituzula esan duzu. Ilobak ez dizu hitzik egiten; amak defendatu egiten zaitu jada. Aukeratu duzu. Bazen garaia.',
        parking: 'Furgoneta aukeratu duzu zuhaitzen aurretik. Ilobak kaña bat gonbidatzen zaitu. Nik, abuztuan, ama bidaliko dizut zure egongelara, busaren zain egotera.',
        festival: 'Kultura hamabiak arte eta zarata ordutegiarekin. Behintzat ez diozu «espazio publikoaren dinamizazioa» deitu.',
        housing: '«Eraiki» eta «luze joko du» esan duzu. Faristola batean hori ez da entzuten: «muga» eta «orain» entzuten dira. Ilobak dio lehen aldia dela norbaitek azaltzen diola zergatik ez dagoen pisurik.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'Ez nago ados guztiarekin. Baina esan duzu zer kostatzen den. Hori, faristola batean, ia exotikoa da.')
        : speech.picks?.[1] === 'everything' ? 'Zuhaitzak, aparkalekua, jaialdiak eta pisuak dekretuz. Laztana, hori ez da programa bat: dekretu omnibus bat da.'
        : 'Taulak gauza bat zioen eta zuk beste bat. Telebistan «ñabartzea» deitzen diote. Hemen, «ogiaren eta autobusaren artean iritziz aldatzea».';
      const closing = m.pacoLucia ? 'Pacok esan dit zerbitzari bat lortu diozula. Hori ez da inongo argudiategitan ateratzen. Ogi-ilaran ateratzen da, eta han bozkatzen da.'
        : (speech.reach || 0) >= 12 ? 'Danik dio bideoa milaka lagunek ikusi dutela. Hemen hamabik ikusi dute. Eta hamabiak erroldatuta daude. Zuk ikusi norekin hitz egiten duzun.'
        : 'Beno. Badituzu alderdia, taldea eta zuri begira dagoen andre bat. Orain bai, politikan zaude.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Sei aulki. Zazpigarrena nirea da eta ez dago negoziazioan».' : s.memories.pacoLucia ? 'Paco: «Neskak nik baino gehiago daki tortillaz jada. Ez esan inori».' : 'Paco: «Begira, gauza bat esango dizut: zenbat kostatzen den. Eta ez badakizu, ez dakizula».',
      lines: [
        { speaker: 'Paco', text: 'Paco, La Última taberna. Hemen Kongresuan baino itun gehiago ixten dira, eta denak erdi bana ordainduta. Zer jarriko dizut?', choices: [
          { text: 'Zer eskatuko zenioke zuk alderdi berri bati?', memory: 'pacoHeard', response: 'Begira, gauza bat esango dizut: esan dezala zenbat kostatzen den. Eta ez badaki, «ez dakit». Telebistan ez dut inoiz entzun. Trending izango litzateke, ilobak dioen bezala.' },
          { text: 'Aulkiak utziko dizkiguzu ekitaldirako?', memory: 'chairs', response: 'Sei. Mailegua da, ez dirulaguntza: bere lekura itzultzen dira, eta garbi itzultzen dira.' },
          { text: 'Zer moduz negozioa?', memory: 'pacoRent', response: 'Lokala igo didate, argia eta kafea. Orain telebistako batek kafearen prezioari muga jarri nahi dio. Ba «denboraldiko kafea» jarriko dut. Pisuekin bezala.' },
        ] },
        { speaker: 'Paco', text: 'Eta begira kartel hori: «Zerbitzaria behar da». Aste Santutik dago zintzilik. Nire kafe-makinak baino antzinatasun handiagoa du jada.', choices: [
          { text: 'Gehiago ordaintzen saiatu zara?', memory: 'pacoWages', response: 'Bai. Kafea hamar zentimo igo, eta iruzkin bat: «lapurreta». Ogasunak igoko balu, «birbanaketa» deituko litzateke.' },
          { text: 'Gazteek ez dute lan egin nahi, ba.', memory: 'pacoBlame', response: 'Hori nioen nik, hiru curriculum eta galdera bat zekartzan bat etorri zen arte: «eta non biziko naiz?». Nik ordaintzen dudanarekin, aulkien biltegian. Ez zen itzuli.' },
          { text: 'Lucía, iturriko ikaslea, asteburuetarako zerbait bilatzen ari da.', memory: 'pacoLucia', response: 'Lau koloretako apunteduna? Etor dadila. Kontratua idatziz eta etxeko tortilla. Bi pertsona elkartu dituzu elkarrizketa-mahairik sortu gabe. Hori berria da.' },
        ] },
        { speaker: 'Paco', text: 'Eta orain barkatu, hondoko mahaiak sangria eskatzen du goizeko hamaiketan. Horiek programa argia dute, eta bete egiten dute.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'Iragarki-taula, zuhaitzaren ondoan. Proposamen bat. Bi iltzatzen badituzu «neurri-pakete» bat da jada, eta paketeak, laztana, beti norbaitek ordaintzen ditu.',
        speech: 'Igo kaxara behingoz, ogia hozten ari da eta jendea ere bai. Eta ezer ez «balioan jarri».',
        video: 'Gaurko argudiategiak «tonu hurbila» dio. Hurbilago? Labetik ikusten zaitut eta.',
        crisis: 'Bideoa parrokiako taldetik iritsi zait, gimnasiokotik eta koinatarenetik. Koinatarengana iristen denean, laztana, ofiziala da.',
        debate: 'Gaur gauean, eztabaida. «Gehiengo soziala» esaten entzuten badizut, ogi-barra bat jaurtiko dizut harmailatik.',
        finalPrep: 'Azken itzulia. Pasa zaitez busaren geltokitik: zain dagoen jendeak denbora du eta kexak ditu. Entzun, haiek aspalditik daude hizketan.',
      }[s.mission] || 'Ni hemen, nire koadernoarekin. Zu zeurera, begira nago eta.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Gaurko BOE-arekin nabil. Zazpigarren azken xedapena. Etxezaina izan da».', lines: [
        { speaker: 'Lola', text: 'Zuek bideoarekin borrokan, eta ni BOE-a irakurtzen. Dekretu batek pentsioak eta ordu-aldaketa pakete berean sartzen ditu. Gurea txikiagoa da: kontuak lupaz begiratzen dizkigute.', choices: [
          { text: 'Argitaratu. Guztiak.', memory: 'lolaBooks', response: 'Zeloaren tiketa barne. Harrapatzen bagaituzte, zazpi zentimoko biribiltze batean izan dadila. Eta dokumentu bereizian, ez pentsioen artean sartuta.' },
          { text: 'Hobe da pasatu arte itxarotea.', memory: 'lolaWait', response: 'Ministerio batean horri «ez dago jasota» esaten zaio. Krisiak ez dira pasatzen: artxibatu egiten dira. Eta norbaitek desartxibatzen ditu bozkatu aurreko astean.' },
        ] },
      ] },
      default: { after: 'Lola: «Fitxa berria: “Ordainduko ez ditugun gauzak”. Hamabi errenkada. Batek ere ez du “bere kabuz finantzatzen da” esaten».', lines: [
        { speaker: 'Lola', text: 'Orria ireki dut: «Kanpaina_BEHINBETIKOA_v3». Sarrerak: taldeko poltsa eta Danik zor dizkigun berrogei euro. Berak «zor historikoa» deitzen dio.' },
        { speaker: 'Lola', text: 'Gastuak: pizzak, inprenta eta «kontakizun-aholkularitza» faktura bat, Daniren lehengusuak sinatua. Ordainduko dut?', choices: [
          { text: 'Ezta txantxetan ere. Dena fakturarekin eta dena argitaratuta.', memory: 'lolaReceipts', response: 'Eskerrik asko. Albistegietan ateratzen bagara, aspergarriak izateagatik izan dadila. Benetako gardentasuna, ez bilatzen duzun egunean erortzen den ataria.' },
          { text: 'Ordaindu, lehengusua jatorra da eta.', memory: 'lolaCousin', response: 'Jatorra bada. «Hatzez esleitutakoak, auzoko bertsioa» fitxan idatziko dizut. Ikusiko duzu zein ondo geratzen den hari batean.' },
          { text: 'Aizu, Lola… eta zu nola iristen zara hilabete bukaerara?', memory: 'lolaRent', response: 'Bi oposiziogilerekin partekatzen dut pisua. Azterketaren aurretik aldatzen diren legeak ikasten dituzte. Nik ordaindu eta haiek BOE-a laburtzen didate. Horregatik nago hemen, ados?' },
        ] },
        { speaker: 'Lola', text: 'Tira, mahaira. Eskaria: barbakoa eta lau gazta. Anana-duna Danik proposatu zuen, baina ez du entzunaldi-izapidea gainditu.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Oharraren hiru bertsio daramatzat. Hirurak “Agertutako informazioen aurrean” hasten dira».', lines: [
        { speaker: 'Dani', text: 'Laurehun iruzkin: berrehun bot, ehun nire amarenak zu defendatzen eta ehun benetako jende oso haserre. Klipa Se Acabó La Siesta kanal batek igo du.', choices: [
          { text: 'Erantzun benetakoei, banan-banan.', memory: 'daniReply', response: 'Banan-banan. «Gaizki ulertu izana deitoratzen dugu» gabe. Pasa kafea. «Kontakizuna» idazten ikusten banauzu, kendu mugikorra.' },
          { text: 'Blokeatu mundu guztia eta igo meme bat.', memory: 'daniMeme', response: 'Eginda. Orain memeak arazoak baino iruzkin gehiago ditu. Aholkulariek «markoa aldatzea» deitzen diote. Amonak, «hankak hartzea».' },
        ] },
      ] },
      default: { after: 'Dani: «Biharko argudiategiarekin nabil. Bi ordu daramatzat “apustu egin” eta “apustu egiten jarraitu” artean zalantzan».', lines: [
        { speaker: 'Dani', text: 'Bihar aterako da zure lehen argudiategia. Irakurriko dizut: «Zarataren aurrean, auzoa. Kontakizunaren aurrean, egitateak. … aurrean». Ados, fronte gehiegi ireki ditut.' },
        { speaker: 'Dani', text: 'Programa azaltzen grabatuko zaitut. Formatu ofiziala, alkandora-mahuketan poligono batean paseatzen, edo iragazkiarekin eta modako abestiarekin?', choices: [
          { text: 'Iragazkirik eta poligonorik gabe. Ikus daitezela begi-zuloak.', memory: 'daniNoFilter', response: 'Ausarta. Begi-zuloak dira interneten geratzen den benetako gauza bakarra. Like gutxi, baina existitzen den jendearenak.' },
          { text: 'Iragazkiarekin eta modako abestiarekin.', memory: 'daniTrend', response: 'Horrela gustatzen zait. Bihar inork ez du jakingo zer proposatzen duzun, baina denek jakingo dute herriko jaietan ministro batek bezala dantzatzen duzula.' },
          { text: 'Eta zu zer moduz, hainbeste lanekin?', memory: 'daniJobs', response: 'Hiru bezero, eta ama galdezka noiz egingo naute finko eten, «finko» hitza entzun eta pozik. Hau doan egiten dudan gauza bakarra da. Eta gogoz egiten dudan bakarra.' },
        ] },
        { speaker: 'Dani', text: 'Gauza bat: argudiategia nik idazten dut, baina Marisak zuzentzen du. Ez dakit nola sartu zen taldean. Jada ez naiz ausartzen kanpora botatzera.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Aulkiak muntatzen nabil. Bat bere kabuz tolesten da. Horrek ez du bozkatzen».', lines: [
        { speaker: 'Nico', text: 'Ernesto jaitsi da, hirugarrenekoa. Pisua itxita dauka mugarena gertatu zenetik, eta dio bideoak espekulatzaile deitzen diola. Gero landareak ureztatzeko eskatu dit.', choices: [
          { text: 'Gonbidatu atariko batzarrera. Eman dezala bere bertsioa.', memory: 'nicoInvite', response: 'Ados. Dio alokatuko lukeela, berreskuratuko lukeela jakingo balu. Hau da: berak pisu bat du, Marisaren ilobak ez, eta erdian lege bat dago. Hara.' },
          { text: 'Ez egin kasurik. Etsaia da.', memory: 'nicoEnemy', response: 'Etsaia? Ernesto da, eskolakoa. Baloi bat zor diot seigarren mailatik. Danik «etxejabe handia» deitzen dio argudiategian. Pisu bat du. Herentziaz.' },
        ] },
      ] },
      default: { after: 'Nico: «Zelo gehiagoren bila noa. Honek nahi duenean itsasten du, Gobernuko bazkide batek bezala».', lines: [
        { speaker: 'Nico', text: 'Berrogei kartel itsatsi ditut. Foxenaren ondoan benetako zaldi bat zegoen, bigarren ilaran. Hari ere bat itsatsi diot. Ez du protestatu. Lehen babesa.' },
        { speaker: 'Nico', text: 'Bide batez, Remek dio Gabonak baino lehen kardiologoarekin hitzordua lortzen dionari emango diola botoa. Zer esango diot?', choices: [
          { text: 'Egia: hori ez dela hilabete batean konpontzen, baina borrokatuko dugula.', memory: 'nicoTruth', response: 'Esango diot. Andreek egia entzutean jartzen duten aurpegia jarriko du: pena eta errespetua, erdi eta erdi. Botoa, ikusiko dugu.' },
          { text: 'Esan baietz. Hitzordua astebetean.', memory: 'nicoPromise', response: 'Itxaron-zerrendak urte erdian egiten duena astebetean agintzen diozu. Abenduan, Remek gogoraraziko dizu. Makilarekin.' },
          { text: 'Etor dadila atariko batzarrera eta guztioi konta diezagula.', memory: 'nicoAssembly', response: 'Ideia ona. Blokekoak urteak daramatzate bakoitza bere eskailburuan kexatzen. Elkarrekin, auzokideen batzarra dira: inbestidura bat, baina igogailuaren derramarekin.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ['1. KAPITULUA', 'Pues me presento'],
      tv: { headline: 'HAUTESKUNDEAK!', ticker: 'AZKEN ORDUA · GORTEAK DESEGINDA · GALDERARIK GABEKO AGERRALDIA' },
      subs: [
        [null, 'Igandea, 23:47. «Bideo bat gehiago eta utzi egingo diot».'],
        ['Aurkezlea (TB)', 'Azken ordua: Gorteak desegin eta hauteskundeak deitu dituzte. Presidenteak galderarik gabe: «erantzunak webean daude».'],
        ['Aurkezlea (TB)', 'Betiko alderdiak alkandora-mahuketan grabatzen ari dira jada. Bat zaldiz iritsi da. Informatzen jarraituko dugu. Edo ez.'],
        [null, 'BZZZ. Berrogeita hiru mezu. «Eta aurkezten bagara?». «jajaja». «Ez, serio».'],
        ['Tú', 'Hauteskundeak? Berriro? …Ea zer dioen taldeak.'],
      ],
      toast: 'Mugikorrak ez dio bibratzeari uzten. Mahaitxoan dago, sofaren ondoan.',
    },
    plaza: {
      banner: ['AUZOA', 'Kalera jaitsi'],
      subs: [
        [null, 'Plaza: okindegia, taberna, banku bat eguzkitan eta telebista-plato batek baino iritzi gehiago metro karratuko.'],
        ['Marisa', 'Begira, alderdi berrikoa! Zatoz hona, gauza bat kontatu behar dizut.'],
        ['Paco', 'Auzoa salbatzera bazoaz, izan dadila kafearen ondoren. Eta kafea ordaindu egiten da, ez da neurri bat.'],
      ],
    },
    hq: {
      banner: ['2. KAPITULUA', 'Egoitza nire egongela da'],
      subs: [
        [null, 'Egoitza: egongela bat, mahai tolesgarri bat eta bi entxufe. Batek funtzionatzen du. Besteak, «izapidetzen».'],
        ['Lola', 'Ongi etorri egoitzara. Sofa prentsa-aretoa da; hozkailua, diruzaintza. Auditatua.'],
        ['Dani', 'Wifiari «Kabinetea» jarri diot izena. Badugu egitura.'],
        ['Nico', 'Gai-zerrenda: bat, aulkiak. Bi, nork ekarriko duen izotza. Hiru, mundua.'],
      ],
    },
    hall: {
      banner: ['5. KAPITULUA', 'Aretoko eztabaida'],
      subs: [
        [null, 'Erabilera anitzeko aretoa. Gaur: eztabaida. Bihar: zumba. Begi-bistan, alde txikia.'],
        ['moderator', 'Gabon. Hainbat faristola, kronometro bat eta inork irekiko ez duen ur-pitxer bat. Lehen blokea: etxebizitza.'],
        ['tech', 'Zentzu onarekin nator. Eta pazientziarekin. Batez ere pazientziarekin: urteak daramatzagu gure txandaren zain.'],
        ['populist', 'Olatu erreakzionarioaren aurrean, aurrera goaz. Gaur gauean tokatzen den norabidean.'],
      ],
    },
    victory: {
      banner: ['HAUTESKUNDE-GAUA', 'Garaipena!'],
      verdict: '48 GAINDITU DU!',
      subs: [
        ['Kazetaria', 'Ehuneko ehuna zenbatuta, alderdi guztiek diote irabazi dutela. Behingoz, batek arrazoi du.'],
        ['Tú', 'Irabazi… dugu? Argudiategirik gabe?'],
        ['Ana', 'Hitzaldia! Baina laburra, Marisak bostetan irekitzen du eta!'],
      ],
    },
    defeat: {
      verdict: 'EZ DA 48RA IRISTEN',
      subs: [
        ['Kazetaria', '…eta auzoko hautagaitza kanpoan geratu da. Beste guztiek, hori bai, irabazi dutela diote.'],
        ['Tú', 'Danik dio «eraikitzen jarraitzeko aukera ematen digun emaitza» dela.'],
        ['Berto', 'Marisak itzuli du jada: «galdu duzue, laztana». Aizu, hurrengoan botoa emango dizut. Gogorarazten badidazu.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: '2. KAPITULUA · EGOITZA NIRE EGONGELA DA', title: 'Zuzendaritza-batzordea: hiru lagun eta sofa bat.',
      intro: state => `7:00etako argudiategia: «Ardatz estrategikoak lehenetsi». Marisaren erantzuna taldean: «Aukeratu gauza bat». Benetako lehentasun baterako denbora dago; gainerakoa, taldera, ideiak hiltzera joaten diren lekura.${state.memories.nicoAssembly ? ' Nicok batzar-oharra itsatsi du jada atarian.' : ''}`,
      choices: {
        accounts: { title: 'Lolak kostu bakoitza berrikusten du', flavor: 'Aurrekontua agerian, zeloaren tiketa barne. «Beste gastu batzuk» lerro bakar bat ere ez. Sareetarako denbora gutxiago' },
        street: { title: 'Nicok atez ateko kanpaina antolatzen du', flavor: 'Eskailburuz eskailburu, igogailuaren derramaren aitzakiarekin. Tabletarik eta inkestarik gabe: txirrinarekin' },
        content: { title: 'Danik kabinete txiki bat muntatzen du', flavor: 'Argi-uztaia, maindire berdezko kroma eta KONTAKIZUNA hitza post-itez idatzita duen horma bat' },
        tenants: { title: 'Auzokideen batzarra atarian', flavor: 'Hezetasunena gertatu zenetik elkarri hitzik egiten ez zioten bizilagunak jaisten dira. Ernesto ere bai, pisu itxiduna. Inork ez ditu aulkiak jasotzen' },
      },
    },
    video: {
      eyebrow: '4. KAPITULUA · BIRAL BIHURTU', title: 'Marka jarrita dago. Mezua falta da.',
      intro: state => { const m = state.memories; return `7:00etako argudiategia: «Tonu hurbila, mezu argia». Marisa: «Hitz egin zuk hitz egiten duzun bezala». Danik hiru segundo kalkulatzen ditu jendeak hatza irristatu aurretik. Irismenak ateak irekitzen ditu; jendeak badaki arreta eta babesa bereizten.${m.daniNoFilter ? ' Gaur, iragazkirik gabe.' : m.daniTrend ? ' Danik abestia aukeratu du jada. Ez galdetu.' : ''}`; },
      choices: {
        explain: { title: 'Proposamena eta zer kostatzen duen azaldu', flavor: 'Minutu bat, plano finkoa eta Lolaren arbela, letra txikia letra handiz' },
        chairs: { title: 'Pacoren aulkien dantza', flavor: 'Koreografia aulki mailegatuekin. Inork ez daki zer proposatzen duzun; denek dakite hamaikagarren segundoan erortzen zarela' },
        neighbor: { title: 'Marisari hitz egiten utzi', flavor: 'Beroaz hitz egiten du, igo dioten lokalaz eta amaren hitzorduaz. Zuk mugikorrari eusten diozu eta isilik zaude' },
        debunk: { title: 'Eguneko gezurra desmuntatu', flavor: 'Se Acabó La Siesta kanal batek dio terrazak debekatu nahi dituzula. Plano osoarekin gezurtatzen duzu, hori baita arma sekretua' },
      },
    },
    crisis: {
      eyebrow: '5. KAPITULUA · KRISIA',
      title: (state, ctx) => ctx.contradiction ? 'Zure «dena denontzat» prentsa baino lehenago iritsi da.' : 'Bideo moztu bat egia baino lehenago iritsi da.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Norbaitek igo du dena aldi berean agintzen zenuen unea. Trailer-musika, izenburua maiuskulaz eta errotulu bat: «MARISAK ITZULTZEN DU». Ez da bera izan. Baina sinatuko luke.'
        : 'Bederatzi segundoko klip bat dabil, zure proposamenaren kostua azaldu baino lehentxeago moztua. Sobrevivok «Hau dago atzean» esanez partekatu du. Pacientek, «Iruzkinik ez». Hori ere iruzkin bat da.'}${state.memories.nicoPromise ? ' Eta Remek deitu du: oraindik hitzordurik gabe.' : ''} Uneko aurreikuspena: <b>${ctx.forecast.score}/100</b>. ${ctx.forecast.threshold} behar dira.`,
      choices: {
        admit: { title: 'Aurpegia eman: akatsa onartu eta zuzendu', flavor: 'Musikarik gabeko bideoa, «testuingurutik atera da» gabe. Galderekin, eta hori ia eskandalua da' },
        team: { title: 'Kostuak eta arduradunak argitaratu', flavor: 'Lolak kontuak igotzen ditu; Nicok, nork zer egiten duen. Aspergarria, egiaztagarria eta mozten zaila' },
        distract: { title: 'Aire-frijigailu bat zozketatu', flavor: 'Parte hartzeko: kontua jarraitu, hiru lagun aipatu eta gaia ahaztu. Eskuliburuetan, «agenda propioa markatzea»' },
        blame: { title: 'Errua lokatz-makinari bota', flavor: 'Bot-ak, algoritmoa eta «estoldak». Zureekin funtzionatzen du. Besteek tranpa ezagutzen dute: alderdi guztiek erabiltzen dute' },
      },
    },
    debate: {
      eyebrow: '5. KAPITULUA · EZTABAIDA', title: 'Hiru aurkari, moderatzaile bat eta ireki gabeko pitxer bat.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `Alde batean, ${populist.name} (${populist.party}), bi argudiategirekin: goizekoa eta arratsaldekoa. Bestean, ${tech.name} (${tech.party}), izendatzen ez dituen gauzak indargabetzeko prest. Atzean, ${hard?.name || 'Covadonga del Muro'} (Fox), zaldi gainean sartzen saiatu dena. ${moderator}: «Zeri egiten dio uko zure programak?».`,
      choices: {
        tradeoff: { title: 'Uko zehatza defendatu', flavor: (state, { rivals }) => `Zer galtzen duzun eta nor gogaitzen duzun esaten duzu. ${rivals.tech.name}: «Datu bat, mesedez». Ematen diozu. Indargabetzeko idatzi du` },
        attack: { title: (state, { rivals }) => `${rivals.populist.name} hemerotekarekin harrapatu`, flavor: 'Duela bi kanpaina esan zuena irakurtzen diozu. Txalo erraza, titular erraza, zero proposamen. Bera: «Zuzentzea jakintsuen kontua da»' },
        manage: { title: 'Txandak eman eta zifrak lasai desmuntatu', flavor: (state, { rivals }) => `${rivals.tech.name}: «Zergak jaitsiko ditugu bigarren urtetik aurrera, herentziak uzten badu». Zein urtetatik galdetzen duzu. Isilunea. Ura` },
        promise: { title: 'Alokairua erdira mugatzea agindu, «dekretuz»', flavor: (state, { rivals }) => `Publikoak txalo egiten du. ${rivals.populist.name}, inbidia profesionalez begira. ${rivals.moderator}: «Esanda dago»` },
      },
    },
    finalPrep: {
      eyebrow: '6. KAPITULUA · AZKEN ITZULIA', title: 'Oraindik badago tartea.',
      intro: (state, ctx) => `Aurreikuspena: <b>${ctx.forecast.score}/100</b> (langaren ${ctx.forecast.winning ? 'gainetik' : 'azpitik'}). Bi egun falta dira. Inkesta ofizialak «zeroaren inguruan» ematen dizue; beti asmatzen du enkargatzen duenaren alde. Argudiategia: «Boto baliagarria mobilizatu». Marisa: «Joan dadila jendea». Gauza bat ondo egiteko denbora bakarrik dago.`,
      choices: {
        listen: { title: 'Oraindik zalantzan daudenak bisitatu', flavor: state => `Busaren geltokia, osasun-zentroko ilara eta poltsako andrea, poltsa lapurtu ziona ezagutzen duena jada: hilero egiten dute topo epaitegian${state.memories.nicoAssembly || state.memories.nicoInvite ? '. Atariko batzarrak itzultzeko eskatzen dizu' : ''}. Hitz egin baino gehiago entzuten duzu` },
        receipts: { title: 'Behin betiko aurrekontua argitaratu', flavor: 'Lolak A3an inprimatzen du: «gardentasuna letra-tamaina ere bada». Abuztuan agertzen diren eranskinik gabe' },
        volunteers: { title: 'Boluntarioak eta hauteslekuak antolatu', flavor: state => `Nicok txandak, ogitartekoak eta ezpainzapi batean marraztutako hauteslekuen mapa banatzen ditu${state.memories.pacoLucia ? '. Lucía, Pacoren zerbitzaria, interbentore gisa apuntatu da' : ''}. Jarraitzaileen autobusik gabe: linea-autobusarekin` },
      },
    },
    finalSpeech: {
      eyebrow: '6. KAPITULUA · AZKEN MITINA', title: 'Esaldi bat hausnarketa-egunaren aurretik.',
      intro: 'Aulki tolesgarriak, husten ari den puxika bat eta tokiko egunkariko kazetari bat, gaurko hirugarren mitinaren aurpegiarekin. Beste itxieretan autobusak eta banderak daude; hemen, butanoaren saltzailea. Ikasitakoa sendotu edo berriro dena agindu.',
      choices: {
        account: {
          title: state => ({
            shade: '“Itzala egongo da eta auto gutxiago. Hau aukeratzen dugu, honek hau kostatzen du eta hemen emango ditugu azalpenak.”',
            parking: '“Auzoak lan egin ahal izango du, uda honetan zuhaitzik gabe jarraitu arren. Hau aukeratzen dugu eta hemen emango ditugu azalpenak.”',
            festival: '“Kultura egongo da, eta zarata adostua. Hau aukeratzen dugu, honek hau kostatzen du eta hemen emango ditugu azalpenak.”',
            housing: '“Pisu gehiago egongo dira, eraiki egingo ditugulako, ez iragarri. Luze joko du. Eta hemen emango ditugu azalpenak.”',
          }[state.proposal] || '“Hau aukeratzen dugu, honek hau kostatzen du eta hemen emango ditugu azalpenak.”'),
          flavor: 'Paperik gabe esaten duzu. Marisak koadernoa irekitzen du eta, lehen aldiz, ez du ezer idazten',
        },
        viral: { title: '“Kotxe gutxiago eta gazpatxo gehiago!”', flavor: 'Danik zuzenean ematen du. Denek batera oihukatzen dute. Inork ez daki zer esan nahi duen. Hamabietarako hiru alderdik kopiatu dute' },
        everything: { title: '“Bihar denetarik egongo da denontzat, dekretuz.”', flavor: (state, { rivals }) => `Txalo izugarria. Lolak aurpegia estaltzen du aurrekontuarekin. Mezu bat iristen zaizu. ${rivals.populist.name}: «Hitz egingo dugu?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'HAUTESKUNDE-GAUA · GARAIPENA', title: 'Jendea baino aulki gehiago dago.',
      text: state => `Marisak behin egiten du txalo. Lolak galdetzen du nork gorde dituen fakturak. Paciente eta Sobrevivo alderdiek bi aldiz deitu dute jada: «Zer eskaintzen duzue?». 7:00etan iristen da Daniren azken argudiategia: «Irabazi dugu». Marisaren erantzuna: «Hau ulertzen dut». ${{
        shade: 'Bihar hasten da zailena: ilobaren furgonetari azaltzea non aparkatu.',
        parking: 'Bihar hasten da zailena: zuhaitzik gabeko lehen abuztua, zure izena plakan duela.',
        festival: 'Bihar hasten da zailena: lehen solairukoekin lehen bilera; belarri-tapoiak ekarri dizkizute jada.',
        housing: 'Bihar hasten da zailena: lehen lizentzia. Ernestok galdetzen du ea hirugarrena alokatu dezakeen legegintzaldia amaitu baino lehen.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'HAUTESKUNDE-GAUA · PORROTA', title: 'Eraikitzen jarraitzeko aukera ematen digun emaitza.',
      reasons: {
        support: 'Zuzeneko babesa falta izan zen: auzoak gehiago ikusi zintuen mugikorrean eskailburuan baino.',
        credibility: 'Kontraesanek pisu handia izan zuten: ogi-ilaran ez dago hemerotekarik, baina memoria badago.',
        organization: 'Taldea nahasian iritsi zen: hautesleku bat interbentorerik gabe eta beste bat hirurekin.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: 'MINIJOKOA · BIRAL BIHURTU', title: 'Markan grabatzen.', goWord: 'Akzioa!',
      lanes: ['Agurra', 'Gora!', 'Txaloak', 'Ez dago jasota'],
      takes: {
        explain: 'Lolaren arbela, plano finkoa, eta keinu bakoitzak kostu bat azpimarratzen du.',
        chairs: 'Aulkien dantza. Paco besoak gurutzatuta begira.',
        neighbor: 'Marisak beroaz hitz egiten du; zuk, atzean, erritmoa markatzen duzu, nabaritu gabe. Nabaritzen da.',
        debunk: 'Gezurra desmuntatzen duzu keinu argiekin: hau ez, hau bai, honek kostatzen du.',
      },
      intro: (state, ctx) => `Mugikorra tripodean, auzokideak begira eta Dani zenbatzen. ${ctx.take} Egin jarrera bakoitza bere ikonoa zirkulura iristen denean. Erritmoak irismena gehitzen du, ez botoak.`,
      titles: { great: 'Biral! Sumandosek petalo izatea eskaini dizu jada.', ok: 'Hiru WhatsApp taldetan partekatu da. Bat zure amarena da.', bad: 'Berrogei ikustaldi. Danik «eragin kualitatiboa» deitzen dio.' },
      texts: { ok: 'Danik azpitituluak horiz jartzen ditu jada. Hartualdiak balio du: irismenak ateak irekitzen ditu, baina botoak atarian irabazten dira.', bad: 'Agurraren eta txaloen artean galdu zara. Errepikatu hartualdia: oraingoz, «ez dago jasota».' },
    },
    duel: {
      eyebrow: 'MINIJOKOA · ERANTZUN-DUELUA', title: 'Bost galdera, kronometro bat.',
      intro: (state, ctx) => `${ctx.rounds} erantzun. Aukeratu zerbait zehatza defendatzen duen eta bere kostua onartzen duen erantzuna, denbora amaitu baino lehen. Erdian, norbaitek etengo zaitu: eskatu hitza.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'Bigarren ilaran aparkatzen dutenei eta Pacoren terrazako bi mahairi. Itzala autoen truke, argi esanda.',
          parking: 'Eguzkitako bankuari: uda honetan zuhaitzik gabe jarraituko du. Auzoak lan egin ahal izatea aukeratzen dugu.',
          festival: 'Lehen solairukoei, astean bi gauetan. Ordutegi adostuarekin eta belarri-tapoiak opari, hitzez hitz.',
          housing: 'Plazari, itzalik gabe jarraitzen baitu, eta gure pazientziari: eraikitzeak legegintzaldi batek baino gehiago irauten du. Eta «etxejabeenak» deituko digute.',
        }[state.proposal];
        return [
          { topic: 'Etxebizitza', role: 'populist', claim: 'Gure legeari esker, tentsionatutako eremuetan alokairua egonkortu egin da. Falta diren pisuak espekulazioak ezkutatzen ditu.',
            options: ['«Egonkortuta» badago, zergatik darama hirugarrenak urtebete itxita? Mugatzeak ez du pisurik egiten. Eraikitzeak bai, titular batek baino gehiago iraun arren.', 'Ba guk erdira mugatzen dugu! Eta ogia ere bai!', 'Zuk koloretako txapa bat daramazu. Auzo osoak daki.'], correct: 0 },
          { topic: 'Datuak', role: 'tech', claim: 'Ekarri ez dudan txosten baten arabera, zure proposamenak auzoa hondoratuko du. Grafiko honek dio. Gezi gorria duenak.',
            options: ['Eta nirearen arabera, zure grafikoa gezur hutsa da. Berdinketa teknikoa.', 'Beno, datuak erlatiboak dira. Inkestak bezala.', 'Erakutsi iturria. Gurea: Lolaren aurrekontua, bigarren orrialdea, bankuaren argazkiarekin arratsaldeko bostetan.'], correct: 2 },
          { topic: 'Zure proposamena', role: 'moderator', claim: 'Galdera zuzena: nori egiten dio kalte zure proposamenak? Urrezko minutua. Beno, brontzezko hamar segundo.',
            options: ['Inori ez. Zeharkako proposamena da, galtzailerik gabea, kolonia-iragarki bat bezala.', cost || 'Norbaiti, seguru. Izen-abizenekin esango dugu jakiten dugunean.', 'Betikoei, badakite nortzuk diren.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'Promesa', role: 'populist', claim: 'Okin bati itzala, aparkalekua eta ilobarentzako pisua agindu zenizkion! Hori populismoa da. Eta badakit zertaz ari naizen.',
                options: ['Egia da. Oker egin nuen dena agintzean; gero gauza bat aukeratu genuen eta zer kostatzen duen azaltzen dugu.', 'Testuingurutik atera da. Testuingurua ni dena agintzen nengoen.', 'Zuk ere dena agintzen duzu. Berdinketa.'], correct: 0 }
            : { topic: 'Osasuna', role: 'tech', claim: 'Eta osasuna? Ala zure plaza bakarrik axola zaizu? Guk kudeatu egingo dugu. Asko. Kudeaketarekin.',
                options: ['Agintzen dut bihar ez dagoela itxaron-zerrendarik. Hitza.', 'Axola zaigu. Horregatik ez dugu agintzen kudeatzen ez duguna: Remeren hitzordua osoko bilkurara eramango dugu, izen eta datarekin.', 'Dena indargabetuko dugu, zuk bezala. Gero ikusiko dugu zer.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: 'Barkatu! Hori lokatz-makinarena da. Osorik entzun gabe diot.',
        tech: 'Baimena ematen badidazu… gaur goizean egunkari batek zioen bezala… osorik irakurriko dizut…',
        moderator: 'Hamar segundo geratzen zaizkizu. Bederatzi. Esanda dago.',
        fallback: 'Barkatu, barkatu!',
      },
      floor: 'Utz iezadazu bukatzen, hau ez da prentsaurreko bat eta.',
      floorBabble: 'Utz iezadazu bukatzen',
      reactions: {
        timeout: 'Denbora amaitu da. Esanda dago. Hurrengo blokea.',
        quick: 'Erantzun zehatza eta garaiz. Ez ohikoa. Oharra hartzen dut.',
        slow: 'Zehatza, baina denbora justu-justuan.',
        wrong: 'Eskerrik asko arrazoia emateagatik. Argudiategian jarriko dut.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} baiezka ari da. Eta ez du «esanda dago» esan.`, mid: 'Eutsi diozu. Kopiarik gabe.', low: 'Bihar aurkariek irabazi dutela esango dute. Gaur, arrazoiz.' },
      text: 'Aukeratu zenuen estrategiak markatzen du eztabaida; erantzunek erabakitzen dute sinesten zaituzten ala ez.',
    },
    chairs: {
      eyebrow: 'MINIJOKOA · SEI AULKI', title: 'Mailegua, ez dirulaguntza.',
      intro: (state, ctx) => `Azken batzarrerako Pacoren sei aulkiak behar dira, auzoan barreiatuta. Pasa baten gainetik hartzeko eta eraman borobilera. Banan-banan: «bizkarrak ere bozkatzen du», dio Nicok. ${ctx.time} segundo dituzu.`,
      hints: {
        start: 'Pasa aulki baten gainetik hartzeko.',
        carry: 'Orain, borobil horira.',
        progress: (state, ctx) => `${ctx.delivered}/${ctx.total}. Hurrengoaren bila.`,
        full: 'Borobila osatuta!',
      },
      titles: { all: 'Sei aulki borobilean. Paco, ados.', mid: 'Borobil erdia. Gainerakoak, zutik eta iritziak ematen.', low: 'Pacok berak jasotzen ditu aulkiak. Eta komentatu egiten du.' },
      texts: { all: 'Nicok denbora idazten du ezpainzapian. Antolatzea hau da: jendea iristen denean lekua egotea.', other: 'Falta direnak plazan daude oraindik. Errepikatu: inork ez du ezer ikusi, Pacok izan ezik.' },
    },
    rally: {
      eyebrow: 'MINIJOKOA · AZKEN MITINA', title: 'Eutsi aretoari.', goWord: 'Hitz egin!', lane: 'Biribildu esaldia',
      intro: 'Esaldi bakoitzak amaiera bat du. Sakatu hitza zirkulura iristen denean: publikoak txalo egiten du eta arreta igotzen da. Huts egiten baduzu, norbaitek mugikorrari begiratzen dio. Edo okerrago: txistuka hasten da.',
      phrases: state => {
        const own = {
          shade: ['Uda honetan, plazan egongo da', 'ITZALA'], parking: ['Lan egiten duenak izango du non', 'DESKARGATU'],
          festival: ['Gazteek lokala izango dute, eta plazak,', 'KULTURA'], housing: ['Pisuak ez dira iragarri behar, baizik eta', 'ERAIKI'],
        }[state.proposal] || ['Gauza bat ondo egina,', 'HASTEKO'];
        return [
          ['Gabon denoi. Autobusik gabe etorri zarete, eta ekarri duzue', 'AULKIA'],
          ['Ez nator argudiategiarekin: nik dakarkizuedana da', 'GAUZA BAT'],
          own,
          ['Eta bai: badu kostua. Jarri dugu', 'IDATZIZ'],
          ['Behatokirik, batzorderik eta logorik', 'GABE'],
          ['Hemen inork ez dizue esan hau ordaintzen dela', 'BERE KABUZ'],
          ['Betetzen ez badugu, badakizue non dagoen', 'OKINDEGIA'],
          ['Gaur gauean Marisak ez du ezer', 'ITZULTZEKO'],
          ['Igandean ez dizuet fedea eskatzen: joan zaitezte', 'BOZKATZERA'],
          ['Nahi duzuenari. Baina ez dezala erabaki', 'SOFAK'],
          ['Eskerrik asko, auzoa. Eta orain, aulkiak,', 'PACORI'],
          ['Pues me', 'PRESENTO!'],
        ];
      },
      titles: { great: 'Aretoa zutik. Aulkia dutenak ere bai.', ok: 'Txalo zintzoak eta aharrausiren bat.', bad: 'Mugikor bat entzun da. Argudiategia zen.' },
      text: 'Publikoak gogoratuko du nola esan zenuen; hartu duzun erabakiak erabakitzen du zer gogoratzen duen.',
    },
  },
};
