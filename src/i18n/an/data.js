// Datos con texto · Aragonés (an): feed de unratito (src/data/feed.js) y móvil (src/data/phoneNews.js), por id.
// Secciones: feed: { hint, videos: { <id>: {…} } } · phone: { apps, notifications: { <id>: {…} }, policies: { <id>: {…} }, poll, policyHeadline }.
// Lo que falte cae en: es. Ver src/i18n/README.md.
// Los `from` calculados (@usuario de los rivales) no se sobrescriben: se quedan los de src/data/phoneNews.js.

// Mismas utilidades que src/data/phoneNews.js (copiadas aquí para no crear dependencias circulares).
const tag = (party = "") => party.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "");
const lower = (text = "") => (text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, "") : "");
const fmt = n => (Math.round(n * 10) / 10).toFixed(1).replace(".", ",");

export default {
  feed: {
    hint: {
      swipe: "Esvara",
      keys: "Rueda, arrocegar, S u Espacio",
      end: "No bi ha más vídeos. Nomás isto.",
    },
    videos: {
      trend: {
        caption: "Tercer día ensayando o trend. A mía mai ha dentrau dos vegadas a buscar a fregona y ya se sabe os pasos millor que yo.",
        tags: ["trend", "bailet", "ensayo47", "tatu"],
        sound: "son orichinal · Verbena Remix (versión cocina)",
        sticker: "POV: o baile demanda 40 m² y o piso ne tiene 38",
        likes: "1,2 M",
        comments: "8.431",
        shares: "22,9 mil",
        alt: "Una moza con coleta baila un trend debant d'un aro de luz en una cocineta chicota, con a fregona d'a suya mai a lo fondo.",
      },
      abuelo: {
        caption: "O mío yayo s'ha enterau de que o tobogán d'a piscina municipal ye de baldes ta los chubilaus. Leva 37 baixadas. No ha soltau o periódico.",
        tags: ["yayo", "piscinamunicipal", "chubilaciónactiva", "calcetinsconsandalias"],
        sound: "son orichinal · Pasodoble d'o chiringuito",
        sticker: "Baixada n.º 37. Ni s'ha despeinau.",
        likes: "3,4 M",
        comments: "41,7 mil",
        shares: "210 mil",
        alt: "Un sinyor mayor con gafas de sol, bigot y calcetins con sandalias baixa por un tobogán chigant en un flotador leyendo o periódico con tota seriedat, y cai a la piscina.",
      },
      sixseven: {
        caption: "A profe de mates dició «ubritz o libro por a pachina 67» y perdió a clase ta siempre. Leva asinas dende o martz.",
        tags: ["67", "sixseven", "clasedemates", "perdonprofe"],
        sound: "son orichinal · six seven (sped up)",
        likes: "6,7 M",
        comments: "67 mil",
        shares: "67 mil",
        alt: "Un mozet con a gorra d'o revés fa o chesto d'o «6 7» puyando y baixando as mans con as palmas enta alto, debant d'una pizarra que diz «pach. 67».",
      },
      news: {
        tag: "ZAGUERA HORA",
        title: ["Se'n vienen", "eleccions."],
        body: "O Gubierno disuelve as Cortes y convoca eleccions chenerals. Os partius de siempre ya son grabando vídeos en mangas de camisa.",
        caption: "Comentario destacau · @maripuri_63: «¿Atra vegada? Si encara tiengo en o buzón a propaganda d'as zagueras».",
        tags: ["eleccions", "zaguerahora", "atravegada"],
        sound: "son orichinal · Sintonía d'urchencia",
        likes: "48,2 mil",
        comments: "3.104",
        shares: "9.870",
        aside: "Levas vinte minutos de «uno más y lo deixo». Y agora isto.",
        cta: "«Pos yo tiengo una propuesta»",
        alt: "Noticia de zaguera hora: o edificio d'o Congreso con una urna an caen sobres. O Gubierno disuelve as Cortes y convoca eleccions chenerals.",
      },
    },
  },

  phone: {
    apps: {
      press: { label: "O Eco d'o Barrio" },
      social: { label: "unratito" },
      group: { label: "Isto va en serio" },
      neighbors: { label: "Vecinos Portal 3" },
    },
    notifications: {
      // ---------------------------------------------------------------- antes de nada
      "start-news": { from: "O Eco d'o Barrio", title: "Eleccions chenerals: o barrio torna a votar",
        text: "Disueltas as Cortes. En o mercau se debate qué ye pior: unatra campanya u o precio d'os uevos. Gana a campanya por poco." },
      "start-dani": { from: "Dani",
        text: "¿Hez visto lo d'as eleccions? Belún d'iste grupo habría de presentar-se. Yo no, que tiengo cuatro treballos y garra con contrato." },

      // ---------------------------------------------------------------- capítulo 1
      "phone-lola": { from: "Lola",
        text: "Acabo de leyer «pos me presento». Di-me que ye chanza. He ubierto una fuella de cálculo por si no lo ye." },
      "call-lola-treasury": { from: "Lola",
        text: "Estau de cuentas: 43 euros, un vale de pizzería y una factura de cada cosa. Si salimos en as noticias, que siga por aburrius." },
      "call-lola-strategy": { from: "Lola",
        text: "He feito un DAFO. Feblezas: nusatros. Menazas: tamién nusatros. Fortalezas: tiengo retuladors." },
      "call-nico": { from: "Nico",
        text: state => state.team?.nico?.job === "Actos" ? "Primer acto confirmau: trobar un acto. Segundo acto: cadieras." : "Mapa d'o barrio con chinchetas feito. Sobra una chincheta y dengún no sabe de qué portal ye." },
      "register-press": { from: "O Eco d'o Barrio", title: (s, { party }) => `Naixe «${party}»`,
        text: (s, { party }) => `Rechistrau un partiu nuevo en o barrio. En a finestreta preguntoron si «${party}» yera una asociación de vecinos. Respuesta d'o fundador: «Tecnicament, tamién».` },
      "register-tech": {
        text: (s, { rivals, party }) => `Bienvenius, «${party}». Cuan queratz chestionar bella cosa más gran que un portal, tos paso un gráfico. Puya. Ye bueno. #${tag(rivals.tech.party)}` },
      "leave-neighbors": { from: "Encarni (1.ºA)",
        text: "Aviso: o d'o segundo ha baixau con carpeta y cara d'ir a fer un discurso. U se presenta a bella cosa u vende enciclopedias." },

      // ---------------------------------------------------------------- capítulo 2 · la plaza
      "neighbor-listened": { from: "Marisa (mercería)",
        text: "He dito en a fruitería que bi ha uno que escuita antes de charrar. S'han riyiu, pero han apuntau o tuyo nombre." },
      "neighbor-both": { from: "Marisa (mercería)",
        text: "Me cuentan que prometiés solombra y aparcamiento a la vegada. Paco pregunta si tamién le puetz prometer un camarero." },
      "neighbor-spectacle": { from: "@plaza_en_directo",
        text: "Candidato fendo o show en a plaza: 34 visualizacions, 30 d'a suya mai. As atras cuatro, d'a mai de Dani. #barrio" },
      "program-press": { from: "O Eco d'o Barrio", title: (s, { party }) => `«${party}» tría una propuesta (nomás una)`,
        text: (s, { proposal }) => proposal ? `«${proposal.title}». O que cuesta, dito por ells mesmos: ${lower(proposal.compromise)}. Ye a primera vegada que belún lo cuenta antes de votar.` : "Propuesta presentada. Coste incluyiu, cosa rara." },
      "program-populist": {
        text: (s, { rivals }) => `Ixo que propone o partiu nuevo ya lo heba proposau nusatros. Y o contrario, tamién. Rectificar ye de sabios. #${tag(rivals.populist.party)}` },
      "speech-coherent": { from: "O Eco d'o Barrio", title: "Un discurso con letra chicota… leyida en alto",
        text: "En a plaza dició qué costaba a suya propuesta y a qui molesta. Un vecino aplaudió. Dimpués miró arredol, por si yera l'unico. No lo yera." },
      "speech-everything": { from: "@clips_del_barrio",
        text: "«¡De tot ta totz!» Clip viral. Comentario destacau: «¿Y qui lo paga?». Respuesta con más likes: «O tuyo primo»." },
      "speech-mixed": { from: "@clips_del_barrio",
        text: "Discurso en a plaza: encomenzó con una propuesta y remató con unatra. Os d'o bar han feito una porra ta endevinar a tercera." },
      "aftermath-dani": { from: "Dani",
        text: s => s.reach >= 15 ? "Estadísticas: nos ha visto un fotimo de chent. Dos han entendiu a propuesta. Ye un encomienzo." : "Estadísticas d'alcance: a tuya tía, a mía tía y un bot que vende gafas de sol. Bi ha que ir a buscar más tías." },

      // ---------------------------------------------------------------- capítulo 3 · la sede
      "hq-accounts": { from: "Lola",
        text: "Cuentas publicadas en a puerta d'o salón. Un sinyor las ha leyiu enteras. Yera o d'o butano, pero conta." },
      "hq-street": { from: "Nico",
        text: "Plan de carrera: cada portal, un timbre. Cada timbre, un sinyor que ya votó en 1982 y te lo cuenta." },
      "hq-content": { from: "Dani",
        text: "Calandario de contenius listo: luns propuesta, martz meme, miércols demandar perdón por o meme." },
      "hq-tenants": { from: "Asambleya d'o Portal 5",
        text: "Gracias por venir a la reunión d'inquilinos. Yes o primer candidato que se queda dica o turno de pregarias y preguntas." },

      // ---------------------------------------------------------------- capítulo 4 · vídeo
      "video-explain": { from: "@unratito_tendencias",
        text: "Vídeo explicando una propuesta con cifras y sin mosica épica. L'algoritmo no sabe qué fer con ell y l'amuestra por si acaso." },
      "video-chairs": { from: "@unratito_tendencias",
        text: "Baile d'as cadieras: tendencia numero uno d'o barrio. A propuesta no sale, pero as cadieras salen polidisimas." },
      "video-neighbor": { from: "Marisa (mercería)",
        text: "M'han aturau tres personas por a carrera por o vídeo. Una ta votar-te y dos ta que les arregle un baixo." },
      "video-debunk": { from: "O Eco d'o Barrio", title: "Un candidato desmiente un bulo con… datos",
        text: "O montache diciba que quereba prohibir as terrazas. O vídeo de respuesta dura un minuto y no crida. Se comenta como una rareza." },
      "video-viral-score": { from: "Dani",
        text: "O ritmo d'o vídeo, clavau. A mía mai l'ha compartiu en cuatro grupos y uno yera o d'a parroquia." },

      // ---------------------------------------------------------------- capítulo 5 · crisis
      "crisis-admit": { from: "O Eco d'o Barrio", title: "Un político reconoixe un error. Os expertos demandan calma",
        text: "Reconoixió que s'heba equivocau y explicó cómo l'arregla. Os tertulianos no teneban parada ixa opción y han teniu que improvisar." },
      "crisis-team": { from: "Lola",
        text: "Rueda de prensa d'equipo: cadaguno ha dito lo suyo y por una vegada dicíbanos o mesmo. Lo tiengo apuntau por si no se repite." },
      "crisis-distract": { from: "@clips_del_barrio",
        text: "Dengún no charra ya d'a contradicción. Tot o mundo charra d'o can con gafas d'o vídeo nuevo. Misión cumplida, ¿no?" },
      "crisis-blame": { from: "Paco (bar)",
        text: "Dices que a culpa ye de l'algoritmo y d'os de siempre. Aquí en o bar os de siempre somos nusatros, que conste." },

      // ---------------------------------------------------------------- capítulo 5 · debate
      "debate-tradeoff": { from: "O Eco d'o Barrio", title: "O debate, en una frase: «isto cuesta isto»",
        text: (s, { rivals }) => `${rivals.tech.name} demandó «un dato». Se lo dioron. Fuents d'o suyo partiu confirman que lo son estudiando ta derogar-lo.` },
      "debate-attack": { from: "@debate_en_vivo",
        text: (s, { rivals }) => `Zasca a ${rivals.populist.name} con a hemeroteca. Aplausos, memes y ni una propuesta. O barrio s'ha esbafau de risa.` },
      "debate-manage": { from: "O Eco d'o Barrio", title: "«¿De qué anyo?»: a pregunta que deixó mudo a lo salón",
        text: (s, { rivals }) => `${rivals.tech.name} prometió baixar impuestos «a partir d'o segundo anyo». Le preguntoron de qué anyo. Demandó augua.` },
      "debate-promise": { from: "@debate_en_vivo",
        text: (s, { rivals }) => `Prometer l'alquiler a la metat «por decreto». ${rivals.populist.name} ya ha demandau o numero d'o que t'escribe os discursos.` },
      "debate-duel": { from: "Nico",
        text: "As réplicas d'o debate, de diez. A mía yaya diz que no t'has puesto nervioso. A mía yaya tampoco, y lo ha visto entero." },

      // ---------------------------------------------------------------- capítulo 6 · última vuelta y mitin
      "prep-poll": { from: "O Eco d'o Barrio", title: "Sondeo d'o barrio: s'apreta",
        text: (s, { poll }) => poll?.player ? (poll.winning ? `L'instituto O Tuyo Primo Demoscopia mete a «${poll.player.party}» por debant de ${poll.leader.party}. Marguin d'error: o que faiga falta.` : `${poll.leader.party} sigue por debant; «${poll.player.party}» se queda a ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} puntos. Indecisos: os de siempre, más que nunca.`) : "Sondeo publicau. Indecisos: os de siempre." },
      "prep-listen": { from: "Marisa (mercería)",
        text: "A d'a parada d'o bus diz que yes l'unico que le ha preguntau por l'autobús en cuenta de por o voto. Votará. Por l'autobús." },
      "prep-receipts": { from: "Lola",
        text: "Presupuesto en A3 penchau en a plaza. Una sinyora l'ha leyiu con gafas de cerca y ha dito «isto sí». No sé qué parte." },
      "prep-volunteers": { from: "Nico",
        text: "Voluntarios por colechio: cubiertos. Bocadillos: cubiertos. O mapa d'a servilleta: con una taca d'olio an va o colechio 3." },
      "final-account": { from: "O Eco d'o Barrio", title: "Zarre de campanya sin autobuses",
        text: "Cadieras plegables, un globo punchau y un discurso que repetiba a mesma propuesta d'o primer día. En campanya, ixo ye cuasi una excentricidat." },
      "final-viral": { from: "@clips_del_barrio",
        text: "O remate d'o mitin ya tiene remix. Dengún no sabe de qué iba o mitin, pero o remix dura tres horas." },
      "final-everything": { from: "Lola",
        text: "«De tot ta totz, por decreto». M'he tapau a cara con o presupuesto. Literalment. Tiengo tinta en o naso." },
      "reflection": { from: "Encarni (1.ºA)",
        text: "Chornada de reflexión. Recordatorio: no se puede fer campanya en o grupo. Dito isto, manyana totz a votar a lo d'o segundo." },
      "election-won": { from: "O Eco d'o Barrio", title: (s, { party }) => `«${party}» gana en o barrio`,
        text: "Nueit de recuento con cadieras plegables. Os rivals ya han anunciau que «fan autocrítica», que en a suya luenga quiere dicir cambiar o logo." },
      "election-lost": { from: "O Eco d'o Barrio", title: "Nueit electoral: o barrio se lo piensa",
        text: "O partiu nuevo no plega ista vegada. O suyo equipo replega as cadieras y anuncia que se presenta a las siguients. Lo dicen en serio. Paco ya ha apartau as cadieras." },
    },
    policies: {
      "tech-derogar": { topic: "Programa", text: "Derogar «tot l'anterior». O que meten dimpués se presentará en una fase posterior." },
      "tech-rent": { topic: "Alquiler", text: "Quitar os topes a l'alquiler ta que «o mercau se tranquilice solo». Mientres se tranquiliza, una comisión." },
      "tech-tourism": { topic: "Turismo", text: "Licencias de piso turistico por finestreta unica. Ubre un día a l'anyo y cal demandar cita ta la cita." },
      "tech-health": { topic: "Sanidat", text: "Acabar con as listas d'aspera cambiando-les o nombre: agora son «itinerarios de paciencia»." },
      "tech-taxes": { topic: "Impuestos", text: "Baixar impuestos a partir d'o segundo anyo, si a herencia lo permite. L'anyo no s'especifica." },
      "tech-jobs": { topic: "Empleyo", text: "Plan d'empleyo choven: prácticas sin cobrar en a mesma campanya, con certificau de «chestión»." },
      "pop-observatory": { topic: "Vivienda", text: "Un observatorio de l'alquiler ta observar, con muito detalle, cómo sigue puyando." },
      "pop-transport": { topic: "Transporte", text: "Cercanías de baldes ta tot o mundo, pagau por «os d'alto». Encara no han dito qui son." },
      "pop-rent": { topic: "Alquiler", text: "Topar l'alquiler a la metat. Si no sale, topar o tope. Si tampoco, un observatorio d'o tope." },
      "pop-health": { topic: "Sanidat", text: "Un ministerio por cada lista d'aspera. A lista de ministerios tamién tendrá lista d'aspera." },
      "pop-pensions": { topic: "Coste d'a vida", text: "Puyar pensions y salarios y baixar totz os impuestos a la vegada. A calculadora ye en o taller." },
      "pop-uturn": { topic: "Programa", text: "Defender o contrario d'o que dició en o debate, que agora ye chusto o que o barrio necesita." },
      "hard-roundabout": { topic: "Urbanismo", text: "Reconquerir a rotonda d'o polígono, que leva anyos ocupada por unas obras." },
      "hard-kiosks": { topic: "Gasto", text: "Zarrar totz os chiringuitos publicos, fueras d'o d'a playa, que ye tradición y tiene terraza." },
      "hard-heat": { topic: "Calorina", text: "Contra a calorina, sentiu común: negar-la por decreto y regalar abanicos con bandera." },
      "hard-horse": { topic: "Seguranza", text: "Un caballo por barrio. O pienso, que lo paguen os concellos «sin complexos»." },
      "hard-housing": { topic: "Vivienda", text: "«A solución a la vivienda ye casar-se antes». An vive a pareja se explicará atro día." },
      "hard-agenda": { topic: "Programa", text: "Derogar l'Agenda 2030 sin haber-la leyiu, por si acaso. Y o calandario 2031, ya puestos." },
    },
    poll: {
      pollster: "O Tuyo Primo Demoscopia",
      method: "Encuesta d'o barrio: 400 entrevistas en a cola d'o pan. Marguin d'error: o que faiga falta.",
      noParty: "Encara no tiens partiu rechistrau. En a cola d'o pan no preguntan por tu.",
      undecided: "Indecisos",
      threshold: "Branquil ta ganar",
    },
    policyHeadline: (rival, policy) => `${rival.party} propone (${policy.topic.toLowerCase()})`,
  },
};
