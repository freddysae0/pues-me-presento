// Datos con texto · Català (ca): feed de unratito (src/data/feed.js) y móvil (src/data/phoneNews.js), por id.
// Secciones: feed: { hint, videos: { <id>: {…} } } · phone: { apps, notifications: { <id>: {…} }, policies: { <id>: {…} }, poll, policyHeadline }.
// Lo que falte queda en español. Ver src/i18n/README.md.

// Mismas utilidades que src/data/phoneNews.js (no se importan para evitar un ciclo de módulos con src/i18n/index.js).
const handle = (name = '') => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const tag = (party = '') => party.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '');
const lower = (text = '') => (text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '') : '');
const fmt = n => (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');

const ECO = 'L’Eco del Barri';
const MARISA = 'Marisa (merceria)';
const CLIPS = '@clips_del_barri';

export default {
  feed: {
    hint: {
      swipe: 'Llisca',
      keys: 'Roda, arrossegar, S o Espai',
      end: 'No hi ha més vídeos. Només això.',
    },
    videos: {
      trend: {
        caption: 'Tercer dia assajant el trend. La meva mare ha entrat dues vegades a buscar la fregona i ja se sap els passos millor que jo.',
        tags: ['trend', 'ballet', 'assaig47', 'perati'],
        sound: 'so original · Revetlla Remix (versió cuina)',
        sticker: 'POV: el ball demana 40 m² i el pis en té 38',
        likes: '1,2 M',
        comments: '8.431',
        shares: '22,9 mil',
        alt: 'Una noia amb cua balla un trend davant d’un anell de llum en una cuina minúscula, amb la fregona de la seva mare al fons.',
      },
      abuelo: {
        user: 'avi.emili84',
        caption: 'El meu avi s’ha assabentat que el tobogan de la piscina municipal és gratis per als jubilats. Porta 37 baixades. No ha deixat anar el diari.',
        tags: ['avi', 'piscinamunicipal', 'jubilacioactiva', 'mitjonsambsandalies'],
        sound: 'so original · Pasdoble del xiringuito',
        sticker: 'Baixada núm. 37. Ni s’ha despentinat.',
        likes: '3,4 M',
        comments: '41,7 mil',
        shares: '210 mil',
        alt: 'Un senyor gran amb ulleres de sol, bigoti i mitjons amb sandàlies baixa per un tobogan gegant en un flotador, llegint el diari amb tota la serietat, i cau a la piscina.',
      },
      sixseven: {
        caption: 'La profe de mates va dir «obriu el llibre per la pàgina 67» i va perdre la classe per sempre. Seguim així des de dimarts.',
        tags: ['67', 'sixseven', 'classedemates', 'perdoprofe'],
        sound: 'so original · six seven (sped up)',
        likes: '6,7 M',
        comments: '67 mil',
        shares: '67 mil',
        alt: 'Un noi amb la gorra del revés fa el gest del «6 7» pujant i baixant les mans amb els palmells cap amunt davant d’una pissarra on diu «pàg. 67».',
      },
      news: {
        tag: 'ÚLTIMA HORA',
        title: ['Ja hi tornem:', 'eleccions.'],
        body: 'El Govern dissol les Corts i convoca eleccions generals. Els partits de sempre ja graven vídeos en mànigues de camisa.',
        caption: 'Comentari destacat · @maripuri_63: «Una altra vegada? Si encara tinc a la bústia la propaganda de les últimes».',
        tags: ['eleccions', 'ultimahora', 'unaaltravegada'],
        sound: 'so original · Sintonia d’urgència',
        likes: '48,2 mil',
        comments: '3.104',
        shares: '9.870',
        aside: 'Portes vint minuts de «un més i ho deixo». I ara això.',
        cta: '«Doncs jo tinc una proposta»',
        alt: 'Notícia d’última hora: l’edifici del Congrés amb una urna on cauen sobres. El Govern dissol les Corts i convoca eleccions generals.',
      },
    },
  },

  phone: {
    apps: {
      press: { label: ECO },
      social: { label: 'unratito' },
      group: { label: 'Això va de debò' },
      neighbors: { label: 'Veïns Portal 3' },
    },

    notifications: {
      // ---------------------------------------------------------------- abans de res
      'start-news': { from: ECO, title: 'Eleccions generals: el barri torna a votar',
        text: 'Dissoltes les Corts. Al mercat es debat què és pitjor: una altra campanya o el preu dels ous. Guanya la campanya per poc.' },
      'start-dani': { text: 'Heu vist això de les eleccions? Algú d’aquest grup s’hauria de presentar. Jo no, que tinc quatre feines i cap amb contracte.' },

      // ---------------------------------------------------------------- capítol 1
      'phone-lola': { text: 'Acabo de llegir «doncs em presento». Digues-me que és broma. He obert un full de càlcul per si no ho és.' },
      'call-lola-treasury': { text: 'Estat de comptes: 43 euros, un val de pizzeria i una factura de cada cosa. Si sortim a les notícies, que sigui per avorrits.' },
      'call-lola-strategy': { text: 'He fet un DAFO. Debilitats: nosaltres. Amenaces: també nosaltres. Fortaleses: tinc retoladors.' },
      'call-nico': { text: state => state.team?.nico?.job === 'Actos' ? 'Primer acte confirmat: trobar un acte. Segon acte: cadires.' : 'Mapa del barri amb xinxetes fet. Sobra una xinxeta i ningú no sap de quin portal és.' },
      'register-press': { from: ECO, title: (s, { party }) => `Neix «${party}»`,
        text: (s, { party }) => `S’ha registrat un partit nou al barri. A la finestreta van preguntar si «${party}» era una associació de veïns. Resposta del fundador: «Tècnicament, també».` },
      'register-tech': { from: (s, { rivals }) => `@${handle(rivals.tech.name)}`,
        text: (s, { rivals, party }) => `Benvinguts, «${party}». Quan vulgueu gestionar alguna cosa més gran que una escala, us passo un gràfic. Puja. És bo. #${tag(rivals.tech.party)}` },
      'leave-neighbors': { from: 'Encarni (1r A)',
        text: 'Avís: el del segon ha baixat amb carpeta i cara d’anar a fer un discurs. O es presenta a alguna cosa o ven enciclopèdies.' },

      // ---------------------------------------------------------------- capítol 2 · la plaça
      'neighbor-listened': { from: MARISA, text: 'He dit a la fruiteria que n’hi ha un que escolta abans de parlar. S’han rigut, però han apuntat el teu nom.' },
      'neighbor-both': { from: MARISA, text: 'Em diuen que vas prometre ombra i aparcament alhora. En Paco pregunta si també li pots prometre un cambrer.' },
      'neighbor-spectacle': { from: '@placa_en_directe', text: 'Candidat fent el numeret a la plaça: 34 visualitzacions, 30 de la seva mare. Les altres quatre, de la mare d’en Dani. #barri' },
      'program-press': { from: ECO, title: (s, { party }) => `«${party}» tria una proposta (només una)`,
        text: (s, { proposal }) => proposal ? `«${proposal.title}». El que costa, dit per ells mateixos: ${lower(proposal.compromise)}. És la primera vegada que algú ho explica abans de votar.` : 'Proposta presentada. Cost inclòs, cosa rara.' },
      'program-populist': { from: (s, { rivals }) => `@${handle(rivals.populist.name)}`,
        text: (s, { rivals }) => `Això que proposa el partit nou ja ho vam proposar nosaltres. I el contrari, també. Rectificar és de savis. #${tag(rivals.populist.party)}` },
      'speech-coherent': { from: ECO, title: 'Un discurs amb lletra petita… llegida en veu alta',
        text: 'A la plaça va dir què costava la seva proposta i a qui molesta. Un veí va aplaudir. Després va mirar al voltant, per si era l’únic. No ho era.' },
      'speech-everything': { from: CLIPS, text: '«De tot per a tothom!» Clip viral. Comentari destacat: «I qui ho paga?». Resposta amb més likes: «El teu cosí».' },
      'speech-mixed': { from: CLIPS, text: 'Discurs a la plaça: va començar amb una proposta i va acabar amb una altra. Els del bar han fet una porra per endevinar la tercera.' },
      'aftermath-dani': { text: s => s.reach >= 15 ? 'Estadístiques: ens ha vist un munt de gent. Dues persones han entès la proposta. És un començament.' : 'Estadístiques d’abast: la teva tieta, la meva tieta i un bot que ven ulleres de sol. Hem d’anar a buscar més tietes.' },

      // ---------------------------------------------------------------- capítol 3 · la seu
      'hq-accounts': { text: 'Comptes publicats a la porta del menjador. Un senyor els ha llegit sencers. Era el del butà, però compta.' },
      'hq-street': { text: 'Pla de carrer: cada portal, un timbre. Cada timbre, un senyor que ja va votar el 1982 i t’ho explica.' },
      'hq-content': { text: 'Calendari de continguts a punt: dilluns proposta, dimarts meme, dimecres demanar perdó pel meme.' },
      'hq-tenants': { from: 'Assemblea del Portal 5', text: 'Gràcies per venir a la reunió de llogaters. Ets el primer candidat que es queda fins al torn de precs i preguntes.' },

      // ---------------------------------------------------------------- capítol 4 · vídeo
      'video-explain': { from: '@unratito_tendencies', text: 'Vídeo explicant una proposta amb xifres i sense música èpica. L’algoritme no sap què fer-ne i l’ensenya per si de cas.' },
      'video-chairs': { from: '@unratito_tendencies', text: 'Ball de les cadires: tendència número u del barri. La proposta no hi surt, però les cadires surten guapíssimes.' },
      'video-neighbor': { from: MARISA, text: 'M’han aturat tres persones pel carrer pel vídeo. Una per votar-te i dues perquè els arregli una vora.' },
      'video-debunk': { from: ECO, title: 'Un candidat desmunta una bola amb… dades',
        text: 'El muntatge deia que volia prohibir les terrasses. El vídeo de resposta dura un minut i no crida. Se’n parla com d’una raresa.' },
      'video-viral-score': { text: 'El ritme del vídeo, clavat. La meva mare l’ha compartit en quatre grups i un era el de la parròquia.' },

      // ---------------------------------------------------------------- capítol 5 · crisi
      'crisis-admit': { from: ECO, title: 'Un polític reconeix un error. Els experts demanen calma',
        text: 'Va admetre que s’havia equivocat i va explicar com ho arregla. Els tertulians no tenien preparada aquesta opció i han hagut d’improvisar.' },
      'crisis-team': { text: 'Roda de premsa d’equip: cadascú ha dit la seva i, per una vegada, dèiem el mateix. Ho tinc apuntat per si no es repeteix.' },
      'crisis-distract': { from: CLIPS, text: 'Ja ningú no parla de la contradicció. Tothom parla del gos amb ulleres del vídeo nou. Missió complerta, no?' },
      'crisis-blame': { from: 'Paco (bar)', text: 'Dius que la culpa és de l’algoritme i dels de sempre. Aquí al bar, els de sempre som nosaltres, que consti.' },

      // ---------------------------------------------------------------- capítol 5 · debat
      'debate-tradeoff': { from: ECO, title: 'El debat, en una frase: «això costa això»',
        text: (s, { rivals }) => `${rivals.tech.name} va demanar «una dada». Li la van donar. Fonts del seu partit confirmen que l’estan estudiant per derogar-la.` },
      'debate-attack': { from: '@debat_en_directe',
        text: (s, { rivals }) => `Repàs a ${rivals.populist.name} amb l’hemeroteca. Aplaudiments, mems i ni una proposta. El barri s’ho va passar d’allò més bé.` },
      'debate-manage': { from: ECO, title: '«De quin any?»: la pregunta que va deixar muda la sala',
        text: (s, { rivals }) => `${rivals.tech.name} va prometre abaixar impostos «a partir del segon any». Li van preguntar de quin any. Va demanar aigua.` },
      'debate-promise': { from: '@debat_en_directe',
        text: (s, { rivals }) => `Prometre el lloguer a la meitat «per decret». ${rivals.populist.name} ja ha demanat el número de qui t’escriu els discursos.` },
      'debate-duel': { text: 'Les rèpliques del debat, de deu. La meva àvia diu que no t’has posat nerviós. La meva àvia tampoc, i l’ha vist sencer.' },

      // ---------------------------------------------------------------- capítol 6 · última volta i míting
      'prep-poll': { from: ECO, title: 'Enquesta del barri: la cosa s’estreny',
        text: (s, { poll }) => poll?.player ? (poll.winning ? `L’institut El Teu Cosí Demoscòpia situa «${poll.player.party}» per davant de ${poll.leader.party}. Marge d’error: el que calgui.` : `${poll.leader.party} continua per davant; «${poll.player.party}» es queda a ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} punts. Indecisos: els de sempre, més que mai.`) : 'Enquesta publicada. Indecisos: els de sempre.' },
      'prep-listen': { from: MARISA, text: 'La de la parada del bus diu que ets l’únic que li ha preguntat per l’autobús en lloc de pel vot. Votarà. Per l’autobús.' },
      'prep-receipts': { text: 'Pressupost en A3 penjat a la plaça. Una senyora l’ha llegit amb ulleres de prop i ha dit «això sí». No sé quina part.' },
      'prep-volunteers': { text: 'Voluntaris per col·legi: coberts. Entrepans: coberts. El mapa del tovalló: amb una taca d’oli just on va el col·legi 3.' },
      'final-account': { from: ECO, title: 'Tancament de campanya sense autocars',
        text: 'Cadires plegables, un globus punxat i un discurs que repetia la mateixa proposta del primer dia. En campanya, això és gairebé una excentricitat.' },
      'final-viral': { from: CLIPS, text: 'El remat del míting ja té remix. Ningú no sap de què anava el míting, però el remix dura tres hores.' },
      'final-everything': { text: '«De tot per a tothom, per decret». M’he tapat la cara amb el pressupost. Literalment. Tinc tinta al nas.' },
      'reflection': { from: 'Encarni (1r A)',
        text: 'Jornada de reflexió. Recordatori: no es pot fer campanya al grup. Dit això, demà tothom a votar el del segon.' },
      'election-won': { from: ECO, title: (s, { party }) => `«${party}» guanya al barri`,
        text: 'Nit de recompte amb cadires plegables. Els rivals ja han anunciat que «fan autocrítica», que en el seu idioma vol dir canviar el logo.' },
      'election-lost': { from: ECO, title: 'Nit electoral: el barri s’ho pensa',
        text: 'El partit nou no hi arriba aquesta vegada. El seu equip recull les cadires i anuncia que es presenta a les properes. Ho diuen de debò. En Paco ja ha apartat les cadires.' },
    },

    policies: {
      'tech-derogar': { topic: 'Programa', text: 'Derogar «tot el que hi havia abans». El que hi posin després es presentarà en una fase posterior.' },
      'tech-rent': { topic: 'Lloguer', text: 'Treure els topalls al lloguer perquè «el mercat es calmi tot sol». Mentre es calma, una comissió.' },
      'tech-tourism': { topic: 'Turisme', text: 'Llicències de pis turístic per finestreta única. Obre un dia a l’any i cal demanar cita per a la cita.' },
      'tech-health': { topic: 'Sanitat', text: 'Acabar amb les llistes d’espera canviant-los el nom: ara són «itineraris de paciència».' },
      'tech-taxes': { topic: 'Impostos', text: 'Abaixar impostos a partir del segon any, si l’herència ho permet. L’any no s’especifica.' },
      'tech-jobs': { topic: 'Ocupació', text: 'Pla d’ocupació juvenil: pràctiques no remunerades a la mateixa campanya, amb certificat de «gestió».' },
      'pop-observatory': { topic: 'Habitatge', text: 'Un observatori del lloguer per observar, amb molt de detall, com continua pujant.' },
      'pop-transport': { topic: 'Transport', text: 'Rodalies gratis per a tothom, pagat pels «de dalt». Encara no han dit qui són.' },
      'pop-rent': { topic: 'Lloguer', text: 'Topar el lloguer a la meitat. Si no surt, topar el topall. Si tampoc, un observatori del topall.' },
      'pop-health': { topic: 'Sanitat', text: 'Un ministeri per cada llista d’espera. La llista de ministeris també tindrà llista d’espera.' },
      'pop-pensions': { topic: 'Cost de la vida', text: 'Apujar pensions i salaris i abaixar tots els impostos alhora. La calculadora és al taller.' },
      'pop-uturn': { topic: 'Programa', text: 'Defensar el contrari del que va dir al debat, que ara resulta que és just el que el barri necessita.' },
      'hard-roundabout': { topic: 'Urbanisme', text: 'Reconquerir la rotonda del polígon, que fa anys que està ocupada per unes obres.' },
      'hard-kiosks': { topic: 'Despesa', text: 'Tancar tots els xiringuitos públics, tret del de la platja, que és tradició i té terrassa.' },
      'hard-heat': { topic: 'Calor', text: 'Contra la calor, sentit comú: negar-la per decret i regalar ventalls amb bandera.' },
      'hard-horse': { topic: 'Seguretat', text: 'Un cavall per barri. El pinso, que el paguin els ajuntaments «sense complexos».' },
      'hard-housing': { topic: 'Habitatge', text: '«La solució a l’habitatge és casar-se abans». On viu la parella s’explicarà un altre dia.' },
      'hard-agenda': { topic: 'Programa', text: 'Derogar l’Agenda 2030 sense haver-la llegit, per si de cas. I el calendari 2031, ja posats.' },
    },

    poll: {
      pollster: 'El Teu Cosí Demoscòpia',
      method: 'Enquesta del barri: 400 entrevistes a la cua del pa. Marge d’error: el que calgui.',
      noParty: 'Encara no tens cap partit registrat. A la cua del pa no et pregunten per tu.',
      undecided: 'Indecisos',
      threshold: 'Llindar per guanyar',
    },

    policyHeadline: (rival, policy) => `${rival.party} proposa (${policy.topic.toLowerCase()})`,
  },
};
