// Datos con texto · Aranés (oc-aranes): feed de unratito (src/data/feed.js) y móvil (src/data/phoneNews.js), por id.
// Secciones: feed: { hint, videos: { <id>: {…} } } · phone: { apps, notifications: { <id>: {…} }, policies: { <id>: {…} }, poll, policyHeadline }.
// Lo que falte cae en: ca → es. Ver src/i18n/README.md.

// Copias locales de las utilidades de src/data/phoneNews.js (no se exportan allí; importar index.js sería circular).
const tag = (party = '') => party.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '');
const lower = (text = '') => (text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '') : '');
const fmt = n => (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');

const ECO = "Er Èco deth Barri";
const MARISA = "Marisa (merceria)";
const ENCARNI = "Encarni (1èr A)";

export default {
  feed: {
    hint: {
      swipe: "Passa eth dit",
      keys: "Ròda, arrossegar, S o Espaci",
      end: "Non i a mès vidèos. Sonque açò.",
    },
    videos: {
      trend: {
        caption: "Tresau dia assajant eth trend. Era mia mair a entrat dus còps a cercar era fregadora e ja se sap eth balh mielhor que jo.",
        tags: ["trend", "balhet", "assag47", "entatu"],
        sound: "son originau · Hèsta Major Remix (version codina)",
        sticker: "POV: eth balh demane 40 m² e eth pis ne a 38",
        likes: "1,2 M",
        comments: "8.431",
        shares: "22,9 mil",
        alt: "Ua gojata damb coa de shivau balhe un trend dauant d'un anèth de lum en ua codina minuscula, damb era fregadora dera sua mair ath hons.",
      },
      abuelo: {
        caption: "Eth mèn pairbon s'a assabentat qu'eth toboggan dera piscina municipau ei gratis entàs jubilats. Pòrte 37 baishades. Non a deishat eth diari.",
        tags: ["pairbon", "piscinamunicipau", "jubilacionactiva", "caucetesdambsandalies"],
        sound: "son originau · Pasdoble deth chiringuito",
        sticker: "Baishada n.º 37. Ne s'a despientat.",
        likes: "3,4 M",
        comments: "41,7 mil",
        shares: "210 mil",
        alt: "Un senhor gran damb lunetes de solei, mostacha e caucetes damb sandàlies baishe per un toboggan gigant sus un flotador en tot léger eth diari damb tota era serietat, e cau ena piscina.",
      },
      sixseven: {
        caption: "Era mestra de matematiques didec «dubritz eth libre ena pagina 67» e perdec era classe entà tostemp. Ei atau dempús de dimars.",
        tags: ["67", "sixseven", "classedemates", "perdonmestra"],
        sound: "son originau · six seven (sped up)",
        likes: "6,7 M",
        comments: "67 mil",
        shares: "67 mil",
        alt: "Un gojat damb era gòrra de revés hè eth gèst deth «6 7» pujant e baishant es mans damb es palmes entà naut dauant d'ua pissarra que ditz «pag. 67».",
      },
      news: {
        tag: "DARRÈRA ORA",
        title: ["Arriben", "eleccions."],
        body: "Eth Govèrn dissòlv es Corts e convòque eleccions generaus. Es partits de tota era vida ja son enregistrant vidèos en manjas de camisa.",
        caption: "Comentari destacat · @maripuri_63: «Un aute còp? S'encara è ena bóstia era propaganda des darrères».",
        tags: ["eleccions", "darreraora", "unautecop"],
        sound: "son originau · Sintonia d'urgéncia",
        likes: "48,2 mil",
        comments: "3.104",
        shares: "9.870",
        aside: "Pòrtes vint minuts de «un mès e ac deishi». E ara açò.",
        cta: "«Donc jo è ua proposta»",
        alt: "Nauèla de darrèra ora: er edifici deth Congrès damb ua urna a on queden sòbres. Eth Govèrn dissòlv es Corts e convòque eleccions generaus.",
      },
    },
  },

  phone: {
    apps: {
      press: { label: ECO },
      social: { label: "unratito" },
      group: { label: "Açò va de bon" },
      neighbors: { label: "Vesins Portau 3" },
    },
    notifications: {
      // ---------------------------------------------------------------- abans de tot
      'start-news': { from: ECO, title: "Eleccions generaus: eth barri torne a votar",
        text: "Dissòltes es Corts. En mercat se debat qué ei pejor: ua auta campanha o eth prètz des ueus. Guanhe era campanha, per pòc." },
      'start-dani': { text: "Auetz vist çò des eleccions? Quauqu'un d'aguest grup s'aurie de presentar. Jo non, qu'è quate trabalhs e cap damb contracte." },

      // ---------------------------------------------------------------- capítol 1
      'phone-lola': { text: "Acabi de léger «pues me presento». Di-me qu'ei ua broma. È dubèrt ua huelha de calcul per se non ac ei." },
      'call-lola-treasury': { text: "Estat des compdes: 43 euros, un bon de pizzeria e ua factura de cada causa. Se gessem enes nauèles, que sigue per avorrits." },
      'call-lola-strategy': { text: "È hèt un DAFO. Feblesses: nosati. Menaces: tanben nosati. Fortalesses: è retoladors." },
      'call-nico': { text: state => state.team?.nico?.job === 'Actos' ? "Prumèr acte confirmat: trapar un acte. Dusau acte: cadières." : "Mapa deth barri damb chinchetes, hèt. Sobre ua chincheta e arrés non sap de quin portau ei." },
      'register-press': { from: ECO, title: (s, { party }) => `Neish «${party}»`,
        text: (s, { party }) => `Registrat un partit nau en barri. Ena finestreta demanèren se «${party}» ère ua associacion de vesins. Responsa deth fondador: «Tecnicament, tanben».` },
      'register-tech': { text: (s, { rivals, party }) => `Benvenguts, «${party}». Quan volgatz gestionar quauquarren mès gran qu'un portau, vos passi un grafic. Puge. Ei bon. #${tag(rivals.tech.party)}` },
      'leave-neighbors': { from: ENCARNI, text: "Avís: eth deth dusau a baishat damb carpeta e cara d'anar a hèr un discors. O se presente a quauquarren o ven enciclopèdies." },

      // ---------------------------------------------------------------- capítol 2 · era plaça
      'neighbor-listened': { from: MARISA, text: "È dit ena fruteria que i a un qu'escote abans de parlar. S'an arrit, peró an apuntat eth tòn nom." },
      'neighbor-both': { from: MARISA, text: "Me conden que prometeres ombra e aparcament ath còp. Paco demane se tanben li pòs prométer un cambrèr." },
      'neighbor-spectacle': { text: "Candidat hènt eth show ena plaça: 34 visualizacions, 30 dera sua mair. Es autes quate, dera mair de Dani. #barri" },
      'program-press': { from: ECO, title: (s, { party }) => `«${party}» causís ua proposta (sonque ua)`,
        text: (s, { proposal }) => proposal ? `«${proposal.title}». Çò que coste, dit per eri madeishi: ${lower(proposal.compromise)}. Ei eth prumèr còp que quauqu'un ac conde abans de votar.` : "Proposta presentada. Còst inclós, causa estranha." },
      'program-populist': { text: (s, { rivals }) => `Çò que propòse eth partit nau ja ac auíem propausat nosati. E eth contrari, tanben. Rectificar ei de savis. #${tag(rivals.populist.party)}` },
      'speech-coherent': { from: ECO, title: "Un discors damb letra petita… legida en votz nauta",
        text: "Ena plaça didec qué costaue era sua proposta e a qui molèste. Un vesin aplaudic. Dempús guardèc ath torn, per se ère eth solet. Non ac ère." },
      'speech-everything': { text: "«De tot entà toti!» Clip virau. Comentari destacat: «E qui ac pague?». Responsa damb mès likes: «Eth tòn cosin»." },
      'speech-mixed': { text: "Discors ena plaça: comencèc damb ua proposta e acabèc damb ua auta. Es deth bar an hèt ua travèssa entà endevinar era tresau." },
      'aftermath-dani': { text: s => s.reach >= 15 ? "Estadistiques: mos a vist un hèish de gent. Dues persones an entenut era proposta. Ei un començament." : "Estadistiques d'abast: era tua tia, era mia tia e un bot que ven lunetes de solei. Cau anar a cercar mès ties." },

      // ---------------------------------------------------------------- capítol 3 · era sètz
      'hq-accounts': { text: "Compdes publicats ena pòrta deth salon. Un senhor les a legides senceres. Ère eth deth butà, peró compde." },
      'hq-street': { text: "Plan de carrèr: cada portau, un timbre. Cada timbre, un senhor que ja votèc en 1982 e t'ac conde." },
      'hq-content': { text: "Calendari de continguts prèst: diluns proposta, dimars mème, dimèrcles demanar perdon peth mème." },
      'hq-tenants': { from: "Assemblada deth Portau 5", text: "Gràcies per vier ara reunion de lhogatèrs. Ès eth prumèr candidat que se demore enquia eth torn de precs e questions." },

      // ---------------------------------------------------------------- capítol 4 · vidèo
      'video-explain': { text: "Vidèo qu'explique ua proposta damb chifres e sense musica epica. Er algoritme non sap qué hèr-ne e lo mòstre per se de cas." },
      'video-chairs': { text: "Balh des cadières: tendéncia numèro un deth barri. Era proposta non i gesse, peró es cadières gessen polidíssimes." },
      'video-neighbor': { from: MARISA, text: "M'an aturat tres persones peth carrèr peth vidèo. Ua entà votar-te e dues entà que les hèsqui un orlet." },
      'video-debunk': { from: ECO, title: "Un candidat desmentís ua messorga damb… dades",
        text: "Eth montatge didie que volie proibir es terrasses. Eth vidèo de responsa dure un minut e non crida. Se comente coma ua raretat." },
      'video-viral-score': { text: "Eth ritme deth vidèo, clavat. Era mia mair l'a compartit en quate grops e un ère eth dera parròquia." },

      // ---------------------------------------------------------------- capítol 5 · crisi
      'crisis-admit': { from: ECO, title: "Un politic reconeish ua error. Es expèrts demanen calma",
        text: "Admetec que s'auie equivocat e expliquèc com ac arrange. Es tertulians non auien preparada aguesta opcion e an agut d'improvisar." },
      'crisis-team': { text: "Conferéncia de premsa d'equip: cadun a dit çò sòn e per un còp didíem çò madeish. Ac è apuntat per se non se repetís." },
      'crisis-distract': { text: "Arrés ja non parle dera contradiccion. Tot eth mon parle deth can damb lunetes deth vidèo nau. Mission complida, non?" },
      'crisis-blame': { from: "Paco (bar)", text: "Dides qu'era colpa ei der algoritme e des de tota era vida. Aciu en bar, es de tota era vida èm nosati, que conste." },

      // ---------------------------------------------------------------- capítol 5 · debat
      'debate-tradeoff': { from: ECO, title: "Eth debat, en ua frasa: «açò coste açò»",
        text: (s, { rivals }) => `${rivals.tech.name} demanèc «ua dada». Li la balhèren. Hònts deth sòn partit confirmen que l'estúdien entà derogar-la.` },
      'debate-attack': { text: (s, { rivals }) => `Patac a ${rivals.populist.name} damb era emerotèca. Aplaudiments, mèmes e ne ua proposta. Eth barri s'ac passèc de mèrvelha.` },
      'debate-manage': { from: ECO, title: "«De quin an?»: era question que deishèc mut eth salon",
        text: (s, { rivals }) => `${rivals.tech.name} prometec baishar impòsts «a compdar deth dusau an». Li demanèren de quin an. Demanèc aigua.` },
      'debate-promise': { text: (s, { rivals }) => `Prométer eth lhoguèr ara mitat «per decret». ${rivals.populist.name} ja a demanat eth numèro de qui t'escriu es discors.` },
      'debate-duel': { text: "Es replicas deth debat, de dètz. Era mia mairbona ditz que non t'as metut nerviós. Era mia mairbona tanpòc, e ac a vist sancer." },

      // ---------------------------------------------------------------- capítol 6 · darrèra vòuta e miting
      'prep-poll': { from: ECO, title: "Sondatge deth barri: se ressarre",
        text: (s, { poll }) => poll?.player ? (poll.winning ? `Er institut Eth Tòn Cosin Demoscòpia situe «${poll.player.party}» per dauant de ${poll.leader.party}. Marge d'error: eth que calgue.` : `${poll.leader.party} seguís per dauant; «${poll.player.party}» se demore a ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} punts. Indecisi: es de tota era vida, mès que jamès.`) : "Sondatge publicat. Indecisi: es de tota era vida." },
      'prep-listen': { from: MARISA, text: "Era dera parada deth bus ditz qu'ès eth solet que li a demanat peth bus en lòc de peth vòt. Anarà a votar. Peth bus." },
      'prep-receipts': { text: "Pressupòst en A3 penjat ena plaça. Ua senhora l'a legit damb lunetes de près e a dit «açò òc». Non sai quina part." },
      'prep-volunteers': { text: "Voluntaris per collègi: cubèrts. Entrepans: cubèrts. Eth mapa dera servieta: damb ua taca d'òli a on va eth collègi 3." },
      'final-account': { from: ECO, title: "Barrament de campanha sense autocars",
        text: "Cadières plegables, un glòbus punchat e un discors que repetie era madeisha proposta deth prumèr dia. En campanha, açò ei quasi ua excentricitat." },
      'final-viral': { text: "Eth remat deth miting ja a remix. Arrés non sap de qué anaue eth miting, peró eth remix dure tres ores." },
      'final-everything': { text: "«De tot entà toti, per decret». M'è cubèrt era cara damb eth pressupòst. Literaument. È tinta en nas." },
      reflection: { from: ENCARNI, text: "Jornada de reflexion. Recòrd: non se pòt hèr campanha en grup. Dit açò, deman toti a votar ath deth dusau." },
      'election-won': { from: ECO, title: (s, { party }) => `«${party}» guanhe en barri`,
        text: "Nèt d'escrutini damb cadières plegables. Es rivaus ja an anonciat que «hèn autocritica», qu'ena sua lengua vò díder cambiar eth logo." },
      'election-lost': { from: ECO, title: "Nèt electorau: eth barri s'ac pense",
        text: "Eth partit nau non i arribe aguest còp. Eth sòn equip cuelh es cadières e anoncie que se presente as següentes. Ac diden de bon. Paco ja a apartat es cadières." },
    },
    policies: {
      'tech-derogar': { topic: "Programa", text: "Derogar «tot çò d'abans». Çò que meteràn dempús se presentarà en ua fasa posteriora." },
      'tech-rent': { topic: "Lhoguèr", text: "Trèir es plafons ath lhoguèr entà qu'«eth mercat se calme solet». Mentre se calme, ua comission." },
      'tech-tourism': { topic: "Torisme", text: "Licéncies d'abitatge turistic per finestreta unica. Dubrís un dia ar an e cau demanar cita entara cita." },
      'tech-health': { topic: "Santat", text: "Acabar damb es listes d'espèra en tot cambiar-les eth nom: ara son «itineraris de paciéncia»." },
      'tech-taxes': { topic: "Impòsts", text: "Baishar impòsts a compdar deth dusau an, se er eretatge ac permet. Er an non s'especifique." },
      'tech-jobs': { topic: "Ocupacion", text: "Plan d'ocupacion joena: practiques non remunerades ena madeisha campanha, damb certificat de «gestion»." },
      'pop-observatory': { topic: "Abitatge", text: "Un observatòri deth lhoguèr entà observar, damb fòrça detalh, com seguís pujant." },
      'pop-transport': { topic: "Transpòrt", text: "Trens de rodalia gratis entà tot eth mon, pagats per «es de naut». Encara non an dit qui son." },
      'pop-rent': { topic: "Lhoguèr", text: "Plafonar eth lhoguèr ara mitat. Se non gesse, plafonar eth plafon. Se tanpòc, un observatòri deth plafon." },
      'pop-health': { topic: "Santat", text: "Un ministèri per cada lista d'espèra. Era lista de ministèris tanben aurà lista d'espèra." },
      'pop-pensions': { topic: "Còst dera vida", text: "Pujar pensions e salaris e baishar toti es impòsts ath còp. Era calculadora ei en talhèr." },
      'pop-uturn': { topic: "Programa", text: "Defensar eth contrari de çò que didec en debat, qu'ara ei just çò qu'eth barri a de besonh." },
      'hard-roundabout': { topic: "Urbanisme", text: "Reconquistar era ròtla deth poligòn, que hè ans qu'ei ocupada per unes òbres." },
      'hard-kiosks': { topic: "Despensa", text: "Barrar toti es chiringuitos publics, sauf eth dera platja, qu'ei tradicion e a terrassa." },
      'hard-heat': { topic: "Calor", text: "Contra era calor, sen comun: negar-la per decret e regalar ventalhs damb bandèra." },
      'hard-horse': { topic: "Seguretat", text: "Un shivau per barri. Eth pinsu, que lo paguen es ajuntaments «sense complèxes»." },
      'hard-housing': { topic: "Abitatge", text: "«Era solucion ar abitatge ei maridar-se abans». A on viu era parelha s'explicarà un aute dia." },
      'hard-agenda': { topic: "Programa", text: "Derogar era Agenda 2030 sense auer-la legida, per se de cas. E eth calendari 2031, ja que i èm." },
    },
    poll: {
      pollster: "Eth Tòn Cosin Demoscòpia",
      method: "Enquèsta deth barri: 400 entrevistes ena coa deth pan. Marge d'error: eth que calgue.",
      noParty: "Encara non as partit registrat. Ena coa deth pan non te demanen per tu.",
      undecided: "Indecisi",
      threshold: "Lindau entà guanhar",
    },
    policyHeadline: (rival, policy) => `${rival.party} propòse (${policy.topic.toLowerCase()})`,
  },
};
