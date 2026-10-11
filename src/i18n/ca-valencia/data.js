// Datos con texto · Valencià (ca-valencia): feed de unratito (src/data/feed.js) y móvil (src/data/phoneNews.js), por id.
// Secciones: feed: { hint, videos: { <id>: {…} } } · phone: { apps, notifications: { <id>: {…} }, policies: { <id>: {…} }, poll, policyHeadline }.
// Lo que falte cae en: ca → es. Ver src/i18n/README.md.
// Nombres de rivales y partidos (Partido Paciente, Partido Sobrevivo…, Fox) se dejan como nombres propios: vienen del guion.

// Mismas utilidades de texto que src/data/phoneNews.js (no se importan para no crear un ciclo de módulos).
const handle = (name = '') => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const tag = (party = '') => party.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '');
const lower = (text = '') => (text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '') : '');
const fmt = n => (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');

export default {
  feed: {
    hint: {
      swipe: 'Llisca',
      keys: 'Roda, arrossegar, S o Espai',
      end: 'No hi ha més vídeos. Només açò.',
    },
    videos: {
      trend: {
        caption: 'Tercer dia assajant el trend. Ma mare ha entrat dues vegades a per la fregona i ja se sap els passos millor que jo.',
        tags: ['trend', 'balleret', 'assaig47', 'pertu'],
        sound: 'so original · Verbena Remix (versió cuina)',
        sticker: 'POV: el ball demana 40 m² i el pis en té 38',
        likes: '1,2 M',
        comments: '8.431',
        shares: '22,9 mil',
        alt: 'Una xica amb cua balla un trend davant d’un anell de llum en una cuina menudeta, amb la fregona de sa mare al fons.',
      },
      abuelo: {
        caption: 'Mon iaio s’ha assabentat que el tobogan de la piscina municipal és gratis per als jubilats. Porta 37 baixades. No ha soltat el periòdic.',
        tags: ['iaio', 'piscinamunicipal', 'jubilacioactiva', 'calcetinsambsandalies'],
        sound: 'so original · Pasdoble del xiringuito',
        sticker: 'Baixada núm. 37. Ni s’ha despentinat.',
        likes: '3,4 M',
        comments: '41,7 mil',
        shares: '210 mil',
        alt: 'Un senyor major amb ulleres de sol, bigot i calcetins amb sandàlies baixa per un tobogan gegant damunt d’un flotador llegint el periòdic amb tota la serietat, i cau a la piscina.',
      },
      sixseven: {
        caption: 'La professora de mates va dir «obriu el llibre per la pàgina 67» i va perdre la classe per a sempre. Estem així des de dimarts.',
        tags: ['67', 'sixseven', 'classedemates', 'perdoprofe'],
        sound: 'so original · six seven (sped up)',
        likes: '6,7 M',
        comments: '67 mil',
        shares: '67 mil',
        alt: 'Un xiquet amb la gorra del revés fa el gest del «6 7» pujant i baixant les mans amb els palmells cap amunt davant d’una pissarra que posa «pàg. 67».',
      },
      news: {
        tag: 'ÚLTIMA HORA',
        title: ['Arriben', 'eleccions.'],
        body: 'El Govern dissol les Corts i convoca eleccions generals. Els partits de sempre ja estan gravant vídeos en mànegues de camisa.',
        caption: 'Comentari destacat · @maripuri_63: «Una altra vegada? Si encara tinc a la bústia la propaganda de les últimes».',
        tags: ['eleccions', 'ultimahora', 'altravegada'],
        sound: 'so original · Sintonia d’urgència',
        likes: '48,2 mil',
        comments: '3.104',
        shares: '9.870',
        aside: 'Portes vint minuts de «un més i ho deixe». I ara açò.',
        cta: '«Doncs jo tinc una proposta»',
        alt: 'Notícia d’última hora: l’edifici del Congrés amb una urna on cauen sobres. El Govern dissol les Corts i convoca eleccions generals.',
      },
    },
  },

  phone: {
    apps: {
      press: { label: 'L’Eco del Barri' },
      social: { label: 'unratito' },
      group: { label: 'Açò va de veres' },
      neighbors: { label: 'Veïns Portal 3' },
    },
    notifications: {
      // ---------------------------------------------------------------- abans de res
      'start-news': { from: 'L’Eco del Barri', title: 'Eleccions generals: el barri torna a votar',
        text: 'Dissoltes les Corts. Al mercat es debat què és pitjor: una altra campanya o el preu dels ous. Guanya la campanya per poc.' },
      'start-dani': { from: 'Dani',
        text: 'Heu vist això de les eleccions? Algú d’este grup s’hauria de presentar. Jo no, que tinc quatre faenes i cap amb contracte.' },

      // ---------------------------------------------------------------- capítol 1
      'phone-lola': { from: 'Lola',
        text: 'Acabe de llegir «pues me presento». Digues-me que és broma. He obert un full de càlcul per si no ho és.' },
      'call-lola-treasury': { from: 'Lola',
        text: 'Estat de comptes: 43 euros, un val de pizzeria i una factura de cada cosa. Si eixim a les notícies, que siga per avorrits.' },
      'call-lola-strategy': { from: 'Lola',
        text: 'He fet un DAFO. Debilitats: nosaltres. Amenaces: també nosaltres. Fortaleses: tinc retoladors.' },
      'call-nico': { from: 'Nico',
        text: state => state.team?.nico?.job === 'Actos' ? 'Primer acte confirmat: trobar un acte. Segon acte: cadires.' : 'Mapa del barri amb xinxetes fet. Sobra una xinxeta i ningú sap de quin portal és.' },
      'register-press': { from: 'L’Eco del Barri', title: (s, { party }) => `Naix «${party}»`,
        text: (s, { party }) => `Registrat un partit nou al barri. A la finestreta van preguntar si «${party}» era una associació de veïns. Resposta del fundador: «Tècnicament, també».` },
      'register-tech': { from: (s, { rivals }) => `@${handle(rivals.tech.name)}`,
        text: (s, { rivals, party }) => `Benvinguts, «${party}». Quan vulgueu gestionar alguna cosa més gran que un portal, vos passe un gràfic. Puja. És bo. #${tag(rivals.tech.party)}` },
      'leave-neighbors': { from: 'Encarni (1rA)',
        text: 'Avís: el del segon ha baixat amb carpeta i cara d’anar a fer un discurs. O es presenta a alguna cosa o ven enciclopèdies.' },

      // ---------------------------------------------------------------- capítol 2 · la plaça
      'neighbor-listened': { from: 'Marisa (merceria)',
        text: 'He dit a la fruiteria que n’hi ha un que escolta abans de parlar. S’han rigut, però han apuntat el teu nom.' },
      'neighbor-both': { from: 'Marisa (merceria)',
        text: 'Em conten que vas prometre ombra i aparcament alhora. Paco pregunta si també li pots prometre un cambrer.' },
      'neighbor-spectacle': { from: '@placa_en_directe',
        text: 'Candidat fent l’espectacle a la plaça: 34 visualitzacions, 30 de sa mare. Les altres quatre, de la mare de Dani. #barri' },
      'program-press': { from: 'L’Eco del Barri', title: (s, { party }) => `«${party}» tria una proposta (només una)`,
        text: (s, { proposal }) => proposal ? `«${proposal.title}». El que costa, dit per ells mateixos: ${lower(proposal.compromise)}. És la primera vegada que algú ho conta abans de votar.` : 'Proposta presentada. Cost inclòs, cosa rara.' },
      'program-populist': { from: (s, { rivals }) => `@${handle(rivals.populist.name)}`,
        text: (s, { rivals }) => `Això que proposa el partit nou ja ho vam proposar nosaltres. I el contrari, també. Rectificar és de savis. #${tag(rivals.populist.party)}` },
      'speech-coherent': { from: 'L’Eco del Barri', title: 'Un discurs amb lletra menuda… llegida en veu alta',
        text: 'A la plaça va dir què costava la seua proposta i a qui molesta. Un veí va aplaudir. Després va mirar al voltant, per si era l’únic. No ho era.' },
      'speech-everything': { from: '@clips_del_barri',
        text: '«De tot per a tots!» Clip viral. Comentari destacat: «I qui ho paga?». Resposta amb més m’agrades: «Ton cosí».' },
      'speech-mixed': { from: '@clips_del_barri',
        text: 'Discurs a la plaça: va començar amb una proposta i va acabar amb una altra. Els del bar han fet una porra per a endevinar la tercera.' },
      'aftermath-dani': { from: 'Dani',
        text: s => s.reach >= 15 ? 'Estadístiques: ens ha vist un grapat de gent. Dos han entés la proposta. És un començament.' : 'Estadístiques d’abast: la teua tia, la meua tia i un bot que ven ulleres de sol. Hem d’anar a per més ties.' },

      // ---------------------------------------------------------------- capítol 3 · la seu
      'hq-accounts': { from: 'Lola',
        text: 'Comptes publicats a la porta del menjador. Un senyor els ha llegit sencers. Era el del butà, però compta.' },
      'hq-street': { from: 'Nico',
        text: 'Pla de carrer: cada portal, un timbre. Cada timbre, un senyor que ja va votar en 1982 i t’ho conta.' },
      'hq-content': { from: 'Dani',
        text: 'Calendari de continguts llest: dilluns proposta, dimarts mem, dimecres demanar perdó pel mem.' },
      'hq-tenants': { from: 'Assemblea del Portal 5',
        text: 'Gràcies per vindre a la reunió de llogaters. Eres el primer candidat que es queda fins al torn de precs i preguntes.' },

      // ---------------------------------------------------------------- capítol 4 · vídeo
      'video-explain': { from: '@unratito_tendencies',
        text: 'Vídeo que explica una proposta amb xifres i sense música èpica. L’algoritme no sap què fer-ne i l’ensenya per si de cas.' },
      'video-chairs': { from: '@unratito_tendencies',
        text: 'Ball de les cadires: tendència número u del barri. La proposta no apareix, però les cadires ixen guapíssimes.' },
      'video-neighbor': { from: 'Marisa (merceria)',
        text: 'M’han parat tres persones pel carrer pel vídeo. Una per a votar-te i dues perquè els arregle un baix.' },
      'video-debunk': { from: 'L’Eco del Barri', title: 'Un candidat desmentix un bulo amb… dades',
        text: 'El muntatge deia que volia prohibir les terrasses. El vídeo de resposta dura un minut i no crida. Es comenta com una raresa.' },
      'video-viral-score': { from: 'Dani',
        text: 'El ritme del vídeo, clavat. Ma mare l’ha compartit en quatre grups i un era el de la parròquia.' },

      // ---------------------------------------------------------------- capítol 5 · crisi
      'crisis-admit': { from: 'L’Eco del Barri', title: 'Un polític reconeix un error. Els experts demanen calma',
        text: 'Va admetre que s’havia equivocat i va explicar com ho arregla. Els tertulians no tenien preparada eixa opció i han hagut d’improvisar.' },
      'crisis-team': { from: 'Lola',
        text: 'Roda de premsa d’equip: cadascú ha dit la seua i, per una vegada, dèiem el mateix. Ho tinc apuntat per si no es repetix.' },
      'crisis-distract': { from: '@clips_del_barri',
        text: 'Ja ningú parla de la contradicció. Tot el món parla del gos amb ulleres del vídeo nou. Missió complida, no?' },
      'crisis-blame': { from: 'Paco (bar)',
        text: 'Dius que la culpa és de l’algoritme i dels de sempre. Ací al bar, els de sempre som nosaltres, que conste.' },

      // ---------------------------------------------------------------- capítol 5 · debat
      'debate-tradeoff': { from: 'L’Eco del Barri', title: 'El debat, en una frase: «açò costa açò»',
        text: (s, { rivals }) => `${rivals.tech.name} va demanar «una dada». Li la van donar. Fonts del seu partit confirmen que l’estan estudiant per a derogar-la.` },
      'debate-attack': { from: '@debat_en_directe',
        text: (s, { rivals }) => `Zas a ${rivals.populist.name} amb l’hemeroteca. Aplaudiments, mems i ni una proposta. El barri s’ho va passar d’allò més bé.` },
      'debate-manage': { from: 'L’Eco del Barri', title: '«De quin any?»: la pregunta que va deixar mut el saló',
        text: (s, { rivals }) => `${rivals.tech.name} va prometre abaixar impostos «a partir del segon any». Li van preguntar de quin any. Va demanar aigua.` },
      'debate-promise': { from: '@debat_en_directe',
        text: (s, { rivals }) => `Prometre el lloguer a la meitat «per decret». ${rivals.populist.name} ja ha demanat el número del que t’escriu els discursos.` },
      'debate-duel': { from: 'Nico',
        text: 'Les rèpliques del debat, de deu. Ma iaia diu que no t’has posat nerviós. Ma iaia tampoc, i l’ha vist sencer.' },

      // ---------------------------------------------------------------- capítol 6 · última volta i míting
      'prep-poll': { from: 'L’Eco del Barri', title: 'Sondeig del barri: s’estreny',
        text: (s, { poll }) => poll?.player ? (poll.winning ? `L’institut Ton Cosí Demoscòpia situa «${poll.player.party}» per davant de ${poll.leader.party}. Marge d’error: el que calga.` : `${poll.leader.party} continua per davant; «${poll.player.party}» es queda a ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} punts. Indecisos: els de sempre, més que mai.`) : 'Sondeig publicat. Indecisos: els de sempre.' },
      'prep-listen': { from: 'Marisa (merceria)',
        text: 'La de la parada del bus diu que eres l’únic que li ha preguntat per l’autobús en compte de pel vot. Votarà. Per l’autobús.' },
      'prep-receipts': { from: 'Lola',
        text: 'Pressupost en A3 penjat a la plaça. Una senyora l’ha llegit amb les ulleres de prop i ha dit «açò sí». No sé quina part.' },
      'prep-volunteers': { from: 'Nico',
        text: 'Voluntaris per col·legi: coberts. Entrepans: coberts. El mapa del tovalló: amb una taca d’oli on va el col·legi 3.' },
      'final-account': { from: 'L’Eco del Barri', title: 'Tancament de campanya sense autobusos',
        text: 'Cadires plegables, un globus punxat i un discurs que repetia la mateixa proposta del primer dia. En campanya, això és quasi una excentricitat.' },
      'final-viral': { from: '@clips_del_barri',
        text: 'El remat del míting ja té remix. Ningú sap de què anava el míting, però el remix dura tres hores.' },
      'final-everything': { from: 'Lola',
        text: '«De tot per a tots, per decret». M’he tapat la cara amb el pressupost. Literalment. Tinc tinta al nas.' },
      reflection: { from: 'Encarni (1rA)',
        text: 'Jornada de reflexió. Recordatori: no es pot fer campanya al grup. Dit això, demà tots a votar el del segon.' },
      'election-won': { from: 'L’Eco del Barri', title: (s, { party }) => `«${party}» guanya al barri`,
        text: 'Nit de recompte amb cadires plegables. Els rivals ja han anunciat que «fan autocrítica», que en el seu idioma vol dir canviar el logo.' },
      'election-lost': { from: 'L’Eco del Barri', title: 'Nit electoral: el barri s’ho pensa',
        text: 'El partit nou no arriba esta vegada. El seu equip arreplega les cadires i anuncia que es presenta a les pròximes. Ho diuen de veres. Paco ja ha apartat les cadires.' },
    },

    policies: {
      // tech
      'tech-derogar': { topic: 'Programa', text: 'Derogar «tot l’anterior». El que posen després es presentarà en una fase posterior.' },
      'tech-rent': { topic: 'Lloguer', text: 'Llevar els topalls al lloguer perquè «el mercat es calme a soles». Mentres es calma, una comissió.' },
      'tech-tourism': { topic: 'Turisme', text: 'Llicències de pis turístic per finestreta única. Obri un dia a l’any i cal demanar cita per a la cita.' },
      'tech-health': { topic: 'Sanitat', text: 'Acabar amb les llistes d’espera canviant-los el nom: ara són «itineraris de paciència».' },
      'tech-taxes': { topic: 'Impostos', text: 'Abaixar impostos a partir del segon any, si l’herència ho permet. L’any no s’especifica.' },
      'tech-jobs': { topic: 'Ocupació', text: 'Pla d’ocupació jove: pràctiques no remunerades en la mateixa campanya, amb certificat de «gestió».' },
      // populist
      'pop-observatory': { topic: 'Habitatge', text: 'Un observatori del lloguer per a observar, amb molt de detall, com continua pujant.' },
      'pop-transport': { topic: 'Transport', text: 'Rodalia gratis per a tot el món, pagat pels «de dalt». Encara no han dit qui són.' },
      'pop-rent': { topic: 'Lloguer', text: 'Topar el lloguer a la meitat. Si no ix, topar el topall. Si tampoc, un observatori del topall.' },
      'pop-health': { topic: 'Sanitat', text: 'Un ministeri per cada llista d’espera. La llista de ministeris també tindrà llista d’espera.' },
      'pop-pensions': { topic: 'Cost de la vida', text: 'Pujar pensions i salaris i abaixar tots els impostos alhora. La calculadora està al taller.' },
      'pop-uturn': { topic: 'Programa', text: 'Defendre el contrari del que va dir en el debat, que ara és just el que el barri necessita.' },
      // hard
      'hard-roundabout': { topic: 'Urbanisme', text: 'Reconquerir la rotonda del polígon, que porta anys ocupada per unes obres.' },
      'hard-kiosks': { topic: 'Despesa', text: 'Tancar tots els xiringuitos públics, llevat del de la platja, que és tradició i té terrassa.' },
      'hard-heat': { topic: 'Calor', text: 'Contra la calor, sentit comú: negar-la per decret i regalar ventalls amb bandera.' },
      'hard-horse': { topic: 'Seguretat', text: 'Un cavall per barri. El pinso, que el paguen els ajuntaments «sense complexos».' },
      'hard-housing': { topic: 'Habitatge', text: '«La solució a l’habitatge és casar-se abans». On viu la parella s’explicarà un altre dia.' },
      'hard-agenda': { topic: 'Programa', text: 'Derogar l’Agenda 2030 sense haver-la llegida, per si de cas. I el calendari 2031, ja posats.' },
    },

    poll: {
      pollster: 'Ton Cosí Demoscòpia',
      method: 'Enquesta del barri: 400 entrevistes a la cua del forn. Marge d’error: el que calga.',
      noParty: 'Encara no tens partit registrat. A la cua del forn no et pregunten per tu.',
      undecided: 'Indecisos',
      threshold: 'Llindar per a guanyar',
    },

    policyHeadline: (rival, policy) => `${rival.party} proposa (${policy.topic.toLowerCase()})`,
  },
};
