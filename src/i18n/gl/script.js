// Guion · Galego (gl). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte queda en español.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
// Adaptación: galego normativo con rexistro coloquial nos diálogos. O «cariño» de Marisa pasa a «meu rei»;
// o «primo» de Dani é o «curmán»; o canal bulista «Se Acabó La Siesta» é «Acabouse a Sesta».

export default {
  // ------------------------------------------------------------------------------------------------ rivais
  rivals: {
    tech: { name: 'Fermín Agardo', party: 'Partido Paciente' },
    populist: { name: 'Nuria Giro', party: 'Partido Sobrevivo Outra Elección' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Maite Escaleta',
  },

  foxDebate: {
    hallLine: 'Deixei o cabalo en dobre fila. Se mo levan, é ideoloxía.',
    interruption: 'Excuse me! Sen complexos: ou déixame falar ou érgome e marcho. Teño práctica saíndo de gobernos.',
    round: {
      topic: 'Seguridade', role: 'hard',
      claim: 'Ao que lle rouba o bolso á señora da parada detivérono once veces. Once. E o Goberno, en vez de xuíces, abre un observatorio. Vostede que faría?',
      options: [
        'Que reincidir non saia de balde: xuízo rápido e que non saia pola mesma porta o mesmo día. E xuíces, que custan cartos. Dicímolo.',
        'Man dura! E un cabalo por barrio!',
        'Falemos das causas. Das once.',
      ],
      correct: 0,
    },
    reactions: {
      right: 'Home. Iso non é de dereitiña covarde. Por esta vez.',
      wrong: 'Ve? Sen complexos pénsase máis rápido. Préstolle o cabalo.',
      timeout: 'Mentres vostede pensa, a España que madruga xa se deitou.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'ELECCIÓNS XERAIS · ARGUMENTARIO INCLUÍDO',
    tagline: 'Os demais partidos teñen asesores. Ti tes unha panadeira que traduce.',
  },

  chapters: ['Pois preséntome', 'A sede é o meu salón', 'Baixar á rúa', 'Faino viral', 'Sacouse de contexto', 'O último mitin'],

  // ------------------------------------------------------------------------------------------------ misións
  missions: {
    phone: { title: 'Comparecencia no sofá', objective: 'Achégate ao móbil, xunto ao sofá. Preme E.' },
    call: { title: 'Rolda de consultas', objective: 'Usa o portátil da mesa para chamar aos teus amigos.' },
    register: { title: 'Constituídos para todos os efectos', objective: 'Vai ao cartafol do escritorio e rexistra o partido.' },
    leave: { title: 'Toma de contacto coa realidade', objective: 'Sae pola porta verde para baixar á praza.' },
    neighbor: { title: 'Proceso de escoita (de verdade)', objective: 'Fala con Marisa, xunto ao toldo da panadaría. Paco, na terraza do bar, tamén ten cousas que contar.' },
    program: { title: 'Non cabe todo nun decreto', objective: 'Escolle a túa primeira proposta no taboleiro da praza.' },
    speech: { title: 'Primeira comparecencia, con público', objective: 'Sube ao punto do atril e dá o teu primeiro discurso.' },
    aftermath: { title: 'A cola do pan fai a análise', objective: 'Volve onda Marisa para saber que se comenta na cola do pan.' },
    hqBrief: { title: 'A sede é o meu salón', objective: 'Xunta o equipo na mesa de campaña. Lola, Dani e Nico tamén queren falar contigo.' },
    video: { title: 'Faino viral (con mensaxe, se pode ser)', objective: 'Grava un vídeo na marca xunto á panadaría.' },
    crisis: { title: 'Iso non foi exactamente o que dixen', objective: 'Enfronta a crise no taboleiro. Antes, quizais conveña oír o equipo.' },
    debate: { title: 'O debate do salón', objective: 'Entra no debate cos rivais.' },
    finalPrep: { title: 'Última volta ao barrio', objective: 'Escolle no mapa onde concentrar o último esforzo.' },
    finalSpeech: { title: 'O último mitin, sen autobuses', objective: 'Pecha a campaña diante do público.' },
    election: { title: 'A noite das cadeiras', objective: 'Consulta o resultado electoral.' },
    complete: { title: 'Campaña completada', objective: 'A campaña rematou.' },
  },

  travel: {
    hqBrief: { title: 'Desprazamento institucional', objective: 'A sede está no baixo do portal do lado do bar de Paco. Vai á porta e preme E.', prompt: 'Portal · Entrar na sede', loading: 'ENTRANDO NA SEDE…', sign: 'SEDE' },
    video: { title: 'Saír aos medios (á praza)', objective: 'Para gravar fai falla luz e veciños. Sae pola porta da sede e baixa á praza.', prompt: 'Porta · Baixar á praza', loading: 'BAIXANDO Á PRAZA…', sign: 'PRAZA' },
    crisis: { title: 'Reunión de urxencia, con tupper', objective: 'Algo arde no grupo da sede. Volve polo portal xunto ao bar.', prompt: 'Portal · Volver á sede', loading: 'SUBINDO Á SEDE A TODA PRESA…', sign: 'SEDE' },
    debate: { title: 'Traslado ao salón multiusos', objective: 'Sae pola porta da sede. No salón multiusos xa montaron os atrís.', prompt: 'Porta · Ir ao salón multiusos', loading: 'CAMIÑO DO SALÓN MULTIUSOS…', sign: 'SALÓN' },
    finalPrep: { title: 'Pisar territorio', objective: 'Sae do salón pola porta dobre. Queda unha semana e gáñase na rúa.', prompt: 'Porta · Volver á praza', loading: 'VOLVENDO AO BARRIO…', sign: 'PRAZA' },
    finalSpeech: { title: 'Transporte público, coma o votante medio', objective: 'Vai á parada xunto ao quiosco e colle o 27 ata o salón multiusos.', prompt: 'Parada · Coller o 27 ao salón', loading: 'O 27 CHEGA. TARDE, PERO CHEGA…', sign: 'BUS 27' },
  },

  // ------------------------------------------------------------------------------------------------ propostas
  proposals: {
    shade: { title: 'Sombra antes ca un observatorio da calor', cost: '2 de orzamento', benefit: 'Árbores, toldos, unha fonte que funcione e o baixo baleiro da esquina como sala fresca para maiores. Sen plan director: con xardineiro.', compromise: 'Pérdense prazas de aparcamento, a terraza de Paco encolle dúas mesas e o sobriño de Marisa volve á dobre fila.' },
    parking: { title: 'Que o barrio poida traballar', cost: '2 de orzamento', benefit: 'Carga e descarga con horario, prazas rotatorias para o comercio, aparcabicis para repartidores e licenzas de terraza en días, non en trimestres.', compromise: 'Máis coches na praza e outro agosto a pleno sol. O banco seguirá fervendo.' },
    festival: { title: 'Cultura despois das oito', cost: '2 de orzamento', benefit: 'Escenario para grupos do barrio, cine de verán e un local de ensaio que xestiona a asociación veciñal, non unha fundación con logo.', compromise: 'Ruído dúas noites por semana; os do primeiro, con tapóns. A sombra e a carga e descarga, ao caixón.' },
    housing: { title: 'Que o terceiro volva ter veciños', cost: '2 de orzamento', benefit: 'Licenzas en semanas, construír no soar da esquina e que alugar un piso pechado non dea medo.', compromise: 'Construír tarda máis ca anunciar un teito. Non sae no telexornal, chamaranche «o dos caseiros» e a praza segue sen sombra.' },
  },

  // ------------------------------------------------------------------------------------------------ videochamada
  friends: {
    lola: { role: 'Le o BOE por gusto', line: 'Traballo nunha xestoría e leo o BOE no autobús, coma quen le novela negra: o morto sempre está na disposición adicional. Lévoche as contas.', choices: [
      { label: 'Tesouraría. Ti decides cando é non.', reply: 'Acepto. Primeira norma: aquí nada «se financia con crecemento». Finánciase con cartos, que é máis aburrido, pero existe.' },
      { label: 'Estratexia. Que alguén lea a letra pequena.', reply: 'Feito. A letra pequena é onde os gobernos agochan o importante. A grande é para o cartel.' },
    ] },
    dani: { role: 'Fala en fío', line: 'Fago vídeos para unha clínica dental e un ximnasio. Lin todos os fíos de «exasesor de campaña» que existen. Vós poñede as ideas; eu fágovos o relato.', choices: [
      { label: 'Comunicación. Relato si, fume non.', reply: 'Trato. Cada mañá ás 7:00, argumentario no grupo. Curto, claro e sen a palabra «resiliencia». Bo, case sen.' },
      { label: 'Voceiro. Terás que contestar preguntas.', reply: 'Roldas de prensa con preguntas? Iso xa non o fai ninguén. Vale: seremos vintage.' },
    ] },
    nico: { role: 'Coñece todo o portal', line: 'Fago quendas nun almacén e coñezo todo o portal. Eu mobilizo. Pero se alguén di «transversal» nunha reunión, baixo por pebidas.', choices: [
      { label: 'Organización. Ti pos os horarios.', reply: 'Feito. Reunións de vinte minutos. Se dura máis, é que alguén está lendo un argumentario.' },
      { label: 'Actos. Precisamos a túa voz de megáfono.', reply: 'Cando tocou o Gordo no bar, baixou a rúa enteira en zapatillas. Dáme un motivo así e énchoche a praza.' },
    ] },
  },

  call: {
    title: 'Rolda de consultas. Por videochamada.',
    you: 'Tivo unha idea',
    next: 'Seguinte valente',
    done: 'Xa temos equipo. Dani creou o grupo «Argumentario 7:00». E, sen querer, meteu a Marisa, a da panadaría.',
    doneBabble: 'Xa temos equipo.',
    finish: 'Baixar á praza',
  },

  register: {
    eyebrow: 'FUNDACIÓN · XANELA ÚNICA',
    title: 'Un nome para a papeleta.',
    stamp: 'PENDENTE DE EMENDA',
    intro: 'Tres campos. Nin certificado dixital, nin cita previa, nin anexo III. Se isto é un soño, que non esperte ninguén do Ministerio.',
    defaultName: 'A Xente do Banco',
    defaultSlogan: 'Unha cousa ben feita, para comezar.',
    submit: 'Rexistrar candidatura',
    toast: 'REXISTRADO. Resolto en cero días hábiles. Ninguén na xanela sabe como pasou.',
  },

  program: {
    eyebrow: 'PROGRAMA · ORZAMENTO: 2 CRÉDITOS',
    title: 'Priorizar: escoller, pero con gravata.',
    intro: 'Só cabe unha proposta. As demais non se «calendarizan» nin se «pospoñen a unha segunda fase»: quedan sen facer. O barrio sabe distinguir.',
    promisedBothNote: 'Marisa lembra que prometiches sombra, aparcamento e piso para o seu sobriño. Ningunha opción paga todo iso. −6 de credibilidade ao concretar.',
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Agora, a explicalo no atril. Con preguntas.`,
  },

  // ------------------------------------------------------------------------------------------------ primeiro discurso
  speech: {
    headings: ['Bo. Pois aquí estamos.', 'Que vas defender?', 'A última frase conta.'],
    parts: {
      opening: { title: '01 / Romper o xeo', prompt: 'Sete persoas. Dúas agardan o bus, unha baixou polo pan e outra estache gravando por se dis «resiliencia».', options: {
        listen: 'Antes de falar, vin escoitar. De verdade, non en «proceso de escoita».',
        joke: 'Serei breve. Dígoo como político, así que poñédevos cómodos.',
        grand: 'Hoxe iniciamos unha folla de ruta transversal cara a un novo horizonte de país!',
      } },
      argument: { title: '02 / Dicir algo concreto', prompt: 'Agora toca defender o que cravaches no taboleiro. Marisa xa sacou a libreta.', options: {
        shade: 'Sombra e un sitio fresco para os maiores, aínda que perdamos aparcamento. Sen plan director: con árbores.',
        parking: 'Que quen traballa poida descargar, aínda que a praza siga sen árbores este verán.',
        festival: 'Cultura e un local para os rapaces, con horario de ruído pactado e por escrito.',
        housing: 'Máis pisos: solo, licenzas rápidas e que alugar non dea medo. Non baixa o luns; baixa construíndo.',
        everything: 'Árbores, aparcamento, festivais e un piso para cada quen, de balde e nun decreto o luns!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'Marisa mira o reloxo. É un reloxo que viu moitas campañas.', options: {
        accountable: 'Se non o cumprimos, preguntádenolo aquí. E contestaremos, que xa é novidade.',
        chant: 'Menos atasco e máis gazpacho!',
        forever: 'Para concluír, e en aras da brevidade, os meus seguintes vinte e sete eixos…',
      } },
    },
    timing: { eyebrow: '04 / DARLLE O GOLPE FINAL', title: 'Agora. Con convicción.', button: 'E por iso, preséntome!' },
    result: {
      eyebrow: 'O BARRIO ESCOITOU',
      goodTitle: 'Un aplauso. Sen claque.',
      badTitle: 'Aplauso de cortesía. Na tele, «boa acollida».',
      coherent: 'Defendiches a túa proposta e dixeches o que custa. En política iso ten un nome raro: dicir a verdade.',
      incoherent: 'O teu discurso non coincide co programa. Na tele chámanlle «matizar». Na cola do pan, outra cousa.',
      fine: 'O alcance mide atención, non votos. As consecuencias dependen do que dixeches.',
      button: 'Baixar do atril',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: 'Ti es o do partido novo? Chegoume o voso argumentario: Dani meteume no grupo sen querer. Léoo ás cinco, coa primeira fornada.' },
      { speaker: 'Marisa', text: 'O meu sobriño reparte e non ten onde parar. Trinta e catro anos, no seu cuarto de neno. E o terceiro leva pechado desde o da lei. Por onde comezas?', choices: [
        { text: 'Por escoitarte. Que é o que che quita o sono?', memory: 'listened', response: 'A min? A paciencia. A cita da miña nai é para dentro de meses, e a espera, ao sol.' },
        { text: 'Por todo: sombra, aparcamento e un piso para o teu sobriño.', memory: 'promisedBoth', response: 'Iso na tele chámase «paquete integral de medidas». Aquí, «xa veremos». Apúntoo na libreta.' },
        { text: 'Por facer ruído: un festival que nos poña no mapa.', memory: 'spectacle', response: 'No mapa? Se saímos en todas as webs de pisos turísticos: «auténtico barrio enxebre». O único enxebre que queda son eu, e pecho ás dúas.' },
      ] },
      { speaker: 'Marisa', text: 'Aí tes o taboleiro. Dá para unha cousa. Unha. E no atril, nada de «poñer en valor» nin «folla de ruta». Se o dis, tíroche unha barra de pan.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Prometíchesme sombra, aparcamento e piso para o meu sobriño. Tres cousas e ningunha data. Páxina doce da libreta.'
        : m.listened ? 'Antes escoitáchesme. Parece pouco, pero os que veñen co discurso plastificado non erguen a vista do papel.'
        : m.spectacle ? 'O do festival oíuno todo o barrio. Os do primeiro xa preguntan se os tapóns van no programa ou nun real decreto.'
        : 'Xa baixaches do caixón. Tremíanche as pernas menos ca ao do ano pasado. E o do ano pasado traía autobús de simpatizantes.';
      const coherent = {
        shade: 'Dixeches que quitas coches para pór sombra. O meu sobriño xa non che fala; a miña nai xa te defende. Escolliches. Xa era hora.',
        parking: 'Escolliches a furgoneta antes ca as árbores. O meu sobriño convídate a unha cervexa. Eu, en agosto, mándoche a miña nai a agardar o bus ao teu salón.',
        festival: 'Cultura ata as doce e ruído con horario. Polo menos non lle chamaches «dinamización do espazo público».',
        housing: 'Dixeches «construír» e «tarda». Nun atril iso non se oe: óese «teito» e «xa». O meu sobriño di que é a primeira vez que lle explican por que non hai pisos.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'Non estou de acordo en todo. Pero dixeches o que custa. Iso, nun atril, é case exótico.')
        : speech.picks?.[1] === 'everything' ? 'Árbores, aparcamento, festivais e pisos por decreto. Meu rei, iso non é un programa: é un decreto ómnibus.'
        : 'O taboleiro dicía unha cousa e ti outra. Na tele chámanlle «matizar». Aquí, «cambiar de idea entre o pan e o autobús».';
      const closing = m.pacoLucia ? 'Díxome Paco que lle conseguiches camareira. Iso non sae en ningún argumentario. Sae na cola do pan, que é onde se vota.'
        : (speech.reach || 0) >= 12 ? 'Dani di que o vídeo o viron milleiros. Aquí vírono doce persoas. E as doce están empadroadas. Ti verás a quen lle falas.'
        : 'Bo. Xa tes partido, equipo e unha señora vixiándote. Agora si que estás en política.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Seis cadeiras. A sétima é miña e non entra na negociación».' : s.memories.pacoLucia ? 'Paco: «A rapaza xa sabe máis de tortilla ca min. Non llo digas».' : 'Paco: «Mira, dígoche unha cousa: canto custa. E se non o sabes, que non o sabes».',
      lines: [
        { speaker: 'Paco', text: 'Paco, bar A Última. Aquí péchanse máis pactos ca no Congreso, e todos se pagan a escote. Que che poño?', choices: [
          { text: 'Que lle pedirías ti a un partido novo?', memory: 'pacoHeard', response: 'Mira, dígoche unha cousa: que diga canto custa. E se non o sabe, «non o sei». Na tele nunca o oín. Sería tendencia, que di a miña sobriña.' },
          { text: 'Préstasnos cadeiras para o acto?', memory: 'chairs', response: 'Seis. É un préstamo, non unha subvención: volven ao seu sitio e volven limpas.' },
          { text: 'Como vai o negocio?', memory: 'pacoRent', response: 'Subíronme o local, a luz e o café. Agora un na tele quere poñerlle teito ao prezo do café. Pois poñerei «café de tempada». Coma cos pisos.' },
        ] },
        { speaker: 'Paco', text: 'E mira ese cartel: «Búscase camareiro». Leva colgado desde Semana Santa. Xa ten máis antigüidade ca a miña cafeteira.', choices: [
          { text: 'Probaches a pagar máis?', memory: 'pacoWages', response: 'Si. Subo o café dez céntimos e cáeme unha opinión dunha estrela: «roubo». Se mo subise Facenda, chamaríase «redistribuír».' },
          { text: 'É que os mozos xa non queren traballar.', memory: 'pacoBlame', response: 'Iso dicía eu, ata que veu un con tres currículos e unha pregunta: «e onde vivo?». Co que pago, no almacén das cadeiras. Non volveu.' },
          { text: 'Lucía, a estudante da fonte, busca algo para as fins de semana.', memory: 'pacoLucia', response: 'A dos apuntamentos en catro cores? Que veña. Contrato por escrito e tortilla da casa. Xuntaches dúas persoas sen crear unha mesa de diálogo. Iso é novo.' },
        ] },
        { speaker: 'Paco', text: 'E agora perdoa, que a mesa do fondo pide sangría ás once da mañá. Eses teñen un programa claro e cúmpreno.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'O taboleiro, ao lado da árbore. Unha proposta. Se cravas dúas xa é un «paquete de medidas», e os paquetes, meu rei, sempre os paga alguén.',
        speech: 'Sube xa ao caixón, que arrefría o pan e arrefría a xente. E nada de «poñer en valor».',
        video: 'O argumentario de hoxe pon «ton próximo». Máis próximo? Se te vexo desde o forno.',
        crisis: 'O vídeo chegoume polo grupo da parroquia, o do ximnasio e o da miña cuñada. Cando chega á miña cuñada, meu rei, xa é oficial.',
        debate: 'Esta noite, debate. Se che oio «a maioría social», tíroche unha barra de pan desde a bancada.',
        finalPrep: 'Última volta. Pasa pola parada do bus: a xente que agarda ten tempo e ten queixas. Escoita, que eles xa levan un anaco falando.',
      }[s.mission] || 'Eu aquí, coa miña libreta. Ti ao teu, que te estou mirando.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Sigo co BOE de hoxe. Disposición derradeira sétima. Morreu o mordomo».', lines: [
        { speaker: 'Lola', text: 'Mentres vos pelexades co vídeo, lin o BOE. Un decreto mete pensións e cambio de hora no mesmo paquete. O noso é máis pequeno: mírannos as contas con lupa.', choices: [
          { text: 'Publícaas. Todas.', memory: 'lolaBooks', response: 'Ata o tíquet do celo. Se nos pillan, que sexa nun redondeo de sete céntimos. E en documento á parte, non metido entre as pensións.' },
          { text: 'Mellor agardamos a que pase.', memory: 'lolaWait', response: 'Iso nun ministerio chámase «non consta». As crises non pasan: arquívanse. E alguén as desarquiva a semana antes de votar.' },
        ] },
      ] },
      default: { after: 'Lola: «Lapela nova: “Cousas que non imos pagar”. Doce filas. Ningunha di “finánciase soa”».', lines: [
        { speaker: 'Lola', text: 'Abrín a folla «Campaña_DEFINITIVA_v3». Ingresos: o bote do grupo e corenta euros que nos debe Dani. El chámalle «débeda histórica».' },
        { speaker: 'Lola', text: 'Gastos: pizzas, imprenta e unha factura de «consultoría de relato» asinada polo curmán de Dani. Págoa?', choices: [
          { text: 'Nin de broma. Todo con factura e todo publicado.', memory: 'lolaReceipts', response: 'Grazas. Se saímos nas noticias, que sexa por aburridos. Transparencia de verdade, non un portal que cae o día que o buscas.' },
          { text: 'Págaa, que o curmán é maio.', memory: 'lolaCousin', response: 'Maio é. Apúntocha na lapela «Adxudicacións a dedo, versión barrio». Xa verás que ben queda nun fío.' },
          { text: 'Oe, Lola… e ti como chegas a fin de mes?', memory: 'lolaRent', response: 'Comparto piso con dous opositores. Estudan leis que cambian antes do exame. Eu pago e eles resúmenme o BOE. Por iso estou aquí, vale?' },
        ] },
        { speaker: 'Lola', text: 'Veña, á mesa. Pedido: barbacoa e catro queixos. A de piña propúxoa Dani, pero non superou o trámite de audiencia.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Levo tres versións do comunicado. As tres comezan por “Ante as informacións aparecidas”».', lines: [
        { speaker: 'Dani', text: 'Catrocentos comentarios: douscentos bots, cen da miña nai defendéndote e cen de xente real moi anoxada. O clip subiuno unha canle de Acabouse a Sesta.', choices: [
          { text: 'Contesta aos de verdade, un a un.', memory: 'daniReply', response: 'Un a un. Sen «lamentamos que se puidese malinterpretar». Pásame café. Se me ves escribir «relato», quítame o móbil.' },
          { text: 'Bloquea a todo o mundo e sube un meme.', memory: 'daniMeme', response: 'Feito. Agora o meme ten máis comentarios ca o problema. Os asesores chámanlle «cambiar o marco». A miña avoa, «botar balóns fóra».' },
        ] },
      ] },
      default: { after: 'Dani: «Estou co argumentario de mañá. Levo dúas horas dubidando entre “apostar por” e “seguir apostando por”».', lines: [
        { speaker: 'Dani', text: 'Mañá sae o teu primeiro argumentario. Léoche: «Fronte ao ruído, barrio. Fronte ao relato, feitos. Fronte a…». Vale, quedoume un pouco frontista.' },
        { speaker: 'Dani', text: 'Gravote explicando o programa. Formato oficial, en mangas de camisa paseando por un polígono, ou con filtro e a canción de moda?', choices: [
          { text: 'Sen filtro e sen polígono. Que se vexan as olleiras.', memory: 'daniNoFilter', response: 'Valente. As olleiras son o único auténtico que queda en internet. Poucos likes, pero de xente que existe.' },
          { text: 'Con filtro e coa canción de moda.', memory: 'daniTrend', response: 'Así me gusta. Mañá ninguén saberá que propós, pero todo o mundo saberá que bailas coma un ministro nunha verbena.' },
          { text: 'E ti que tal, con tantos choios?', memory: 'daniJobs', response: 'Tres clientes e a miña nai preguntando cando me fan fixo descontinuo, que a ela sóalle a fixo. Isto é o único que fago de balde. E o único que me apetece.' },
        ] },
        { speaker: 'Dani', text: 'Unha cousa: o argumentario escríboo eu, pero corríxeo Marisa. Non sei como entrou no grupo. Xa non me atrevo a botala.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Estou montando cadeiras. Unha prégase soa. Esa non vota».', lines: [
        { speaker: 'Nico', text: 'Baixou Ernesto, o do terceiro. Ten o piso pechado desde o do teito e di que o vídeo lle chama especulador. Despois pediume que lle regue as plantas.', choices: [
          { text: 'Convídao á asemblea do portal. Que dea a súa versión.', memory: 'nicoInvite', response: 'Vale. Di que alugaría se soubese que o recupera. É dicir: el ten un piso, o sobriño de Marisa non, e no medio hai unha lei. Que cousas.' },
          { text: 'Nin caso. É o inimigo.', memory: 'nicoEnemy', response: 'Inimigo? É Ernesto, do colexio. Débolle un balón desde sexto. Dani chámalle «gran tenedor» no argumentario. Ten un piso. Herdado.' },
        ] },
      ] },
      default: { after: 'Nico: «Vou por máis celo. Este pega cando quere, coma un socio de Goberno».', lines: [
        { speaker: 'Nico', text: 'Peguei corenta carteis. Xunto ao de Fox había un cabalo de verdade, en dobre fila. Pegueille un tamén. Non protestou. Primeiro apoio.' },
        { speaker: 'Nico', text: 'Por certo, a Reme di que vota a quen lle consiga cita co cardiólogo antes de Nadal. Que lle digo?', choices: [
          { text: 'A verdade: que iso non se arranxa nun mes, pero imos pelexalo.', memory: 'nicoTruth', response: 'Dígollo. Porá a cara que poñen as señoras cando oen a verdade: pena e respecto, a partes iguais. O voto, xa veremos.' },
          { text: 'Dille que si. Cita nunha semana.', memory: 'nicoPromise', response: 'Prométeslle nunha semana o que a lista de espera tarda medio ano. En decembro, a Reme lémbracho. Co bastón.' },
          { text: 'Que veña á asemblea do portal e nolo conte a todos.', memory: 'nicoAssembly', response: 'Boa idea. Os do bloque levan anos queixándose cada un no seu relanzo. Xuntos son unha xunta de veciños: unha investidura, pero con derrama.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ['CAPÍTULO 1', 'Pois preséntome'],
      tv: { headline: 'ELECCIÓNS!', ticker: 'ÚLTIMA HORA · DISOLUCIÓN DAS CORTES · COMPARECENCIA SEN PREGUNTAS' },
      subs: [
        [null, 'Domingo, 23:47. «Un vídeo máis e déixoo».'],
        ['Presentadora (TV)', 'Última hora: o Goberno disolve as Cortes e convoca xerais. A presidenta comparece sen preguntas: «as respostas xa están na web».'],
        ['Presentadora (TV)', 'Os partidos de sempre xa gravan vídeos en mangas de camisa. Un chegou a cabalo. Seguiremos informando. Ou non.'],
        [null, 'BZZZ. Corenta e tres mensaxes. «E se nos presentamos?». «hahaha». «Non, en serio».'],
        ['Tú', 'Eleccións? Outra vez? …A ver que di o grupo.'],
      ],
      toast: 'O móbil non para de vibrar. Está na mesiña, xunto ao sofá.',
    },
    plaza: {
      banner: ['O BARRIO', 'Baixar á rúa'],
      subs: [
        [null, 'A praza: panadaría, bar, un banco ao sol e máis opinións por metro cadrado ca un plató.'],
        ['Marisa', 'Mira ti, o do partido novo! Ven, que teño que contarche.'],
        ['Paco', 'Se vas salvar o barrio, que sexa despois do café. E o café págase, que non é unha medida.'],
      ],
    },
    hq: {
      banner: ['CAPÍTULO 2', 'A sede é o meu salón'],
      subs: [
        [null, 'A sede: un salón, unha mesa pregable e dous enchufes. Un funciona. O outro, «en tramitación».'],
        ['Lola', 'Benvidos á sede. O sofá é a sala de prensa; a neveira, a tesouraría. Auditada.'],
        ['Dani', 'Chameille á wifi «Gabinete». Xa temos estrutura.'],
        ['Nico', 'Orde do día: un, cadeiras. Dous, quen trae xeo. Tres, España.'],
      ],
    },
    hall: {
      banner: ['CAPÍTULO 5', 'O debate do salón'],
      subs: [
        [null, 'Salón multiusos. Hoxe: debate. Mañá: zumba. A ollo, a diferenza é pequena.'],
        ['moderator', 'Boas noites. Varios atrís, un cronómetro e unha xerra de auga que ninguén vai abrir. Primeiro bloque: vivenda.'],
        ['tech', 'Veño con sentido común. E con paciencia. Sobre todo con paciencia: levamos anos agardando a que nos toque.'],
        ['populist', 'Fronte á onda reaccionaria, avanzamos. Na dirección que toque esta noite.'],
      ],
    },
    victory: {
      banner: ['NOITE ELECTORAL', 'Vitoria!'],
      verdict: 'SUPERA O 48!',
      subs: [
        ['Periodista', 'Co cen por cen escrutado, todos os partidos din que gañaron. Por unha vez, un ten razón.'],
        ['Tú', 'Gañamos…? Sen argumentario?'],
        ['Ana', 'Discurso! Pero curtiño, que Marisa abre ás cinco!'],
      ],
    },
    defeat: {
      verdict: 'NON CHEGA AO 48',
      subs: [
        ['Periodista', '…e a candidatura do barrio queda fóra. Todos os demais, iso si, aseguran que gañaron.'],
        ['Tú', 'Dani di que é «un resultado que nos permite seguir construíndo».'],
        ['Berto', 'Marisa xa o traduciu: «perdestes, meu rei». Oe, a próxima vótote. Se mo lembras.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: 'CAPÍTULO 2 · A SEDE É O MEU SALÓN', title: 'Comité de dirección: tres persoas e un sofá.',
      intro: state => `Argumentario das 7:00: «Priorizar eixos estratéxicos». Resposta de Marisa no grupo: «Escollede unha cousa». Hai tempo para unha prioridade de verdade; o resto, ao grupo, onde morren as ideas.${state.memories.nicoAssembly ? ' Nico xa pegou no portal un aviso de asemblea.' : ''}`,
      choices: {
        accounts: { title: 'Lola revisa cada custo', flavor: 'Orzamento á vista, ata o tíquet do celo. Nin unha liña de «outros gastos». Menos tempo para redes' },
        street: { title: 'Nico organiza porta a porta', flavor: 'Relanzo por relanzo, coa escusa da derrama do ascensor. Sen tablet nin enquisa: con timbre' },
        content: { title: 'Dani monta un pequeno gabinete', flavor: 'Aro de luz, croma de saba verde e unha parede coa palabra RELATO en pósits' },
        tenants: { title: 'Asemblea de veciños no portal', flavor: 'Baixa xente que non se falaba desde o das humidades. Ernesto, o do piso pechado, tamén. Ninguén recolle as cadeiras' },
      },
    },
    video: {
      eyebrow: 'CAPÍTULO 4 · FAINO VIRAL', title: 'A marca está posta. Falta a mensaxe.',
      intro: state => { const m = state.memories; return `Argumentario das 7:00: «Ton próximo, mensaxe clara». Marisa: «Fala como falas». Dani calcula tres segundos antes de que pasen o dedo. O alcance abre portas; a xente distingue atención de apoio.${m.daniNoFilter ? ' Hoxe, sen filtro.' : m.daniTrend ? ' Dani xa escolleu a canción. Non preguntes.' : ''}`; },
      choices: {
        explain: { title: 'Explicar a proposta e o que custa', flavor: 'Un minuto, plano fixo e un encerado de Lola coa letra pequena en grande' },
        chairs: { title: 'O baile das cadeiras de Paco', flavor: 'Coreografía con cadeiras prestadas. Ninguén sabe que propós; todo o mundo sabe que caes no segundo once' },
        neighbor: { title: 'Deixar falar a Marisa', flavor: 'Ela fala da calor, do local que lle subiron e da cita da súa nai. Ti suxeitas o móbil e calas' },
        debunk: { title: 'Desmontar o bulo do día', flavor: 'Unha canle de Acabouse a Sesta di que queres prohibir as terrazas. Desméntelo co plano enteiro, que é a arma secreta' },
      },
    },
    crisis: {
      eyebrow: 'CAPÍTULO 5 · CRISE',
      title: (state, ctx) => ctx.contradiction ? 'O teu «todo para todos» chegou antes ca a prensa.' : 'Un vídeo recortado chegou antes ca a verdade.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Alguén subiu o momento en que o prometías todo á vez. Música de tráiler, título en maiúsculas e un rótulo: «MARISA TRADÚCEO». Ela non foi. Pero subscríbeo.'
        : 'Circula un clip de nove segundos cortado xusto antes de que explicases o custo. Sobrevivo compárteo con «Isto é o que hai detrás». Paciente, con «Sen comentarios». Que é un comentario.'}${state.memories.nicoPromise ? ' E a Reme chamou: segue sen cita.' : ''} Previsión actual: <b>${ctx.forecast.score}/100</b>. Precísanse ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Dar a cara: recoñecer o erro e corrixilo', flavor: 'Vídeo sen música e sen «sacouse de contexto». Con preguntas, que xa é case escándalo' },
        team: { title: 'Publicar custos e responsables', flavor: 'Lola sobe as contas; Nico, quen fai que. Aburrido, comprobable e difícil de recortar' },
        distract: { title: 'Sortear unha fritideira de aire', flavor: 'Para participar: seguir a conta, mencionar tres amigos e esquecer o tema. Nos manuais, «marcar axenda propia»' },
        blame: { title: 'Culpar a máquina da lama', flavor: 'Bots, algoritmo e «as cloacas». Funciona cos teus. Os demais recoñecen o truco: úsano todos os partidos' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTULO 5 · O DEBATE', title: 'Tres rivais, unha moderadora e unha xerra sen abrir.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `Nun lado, ${populist.name}, do ${populist.party}, con dous argumentarios: o da mañá e o da tarde. No outro, ${tech.name}, do ${tech.party}, que promete derrogar cousas que non nomea. Ao fondo, ${hard?.name || 'Covadonga del Muro'}, de Fox, que intentou entrar a cabalo. ${moderator}: «A que renuncia o seu programa?».`,
      choices: {
        tradeoff: { title: 'Defender a renuncia concreta', flavor: (state, { rivals }) => `Dis que perdes e a quen molestas. ${rivals.tech.name} pide «un dato». Dásllo. Apúntao para derrogalo` },
        attack: { title: (state, { rivals }) => `Sacarlle a hemeroteca a ${rivals.populist.name}`, flavor: 'Lesle en voz alta o que dixo hai dúas campañas. Aplauso fácil, titular fácil, cero propostas. Ela: «Rectificar é de sabios»' },
        manage: { title: 'Dar quendas e desmontar cifras con calma', flavor: (state, { rivals }) => `${rivals.tech.name} promete baixar impostos «a partir do segundo ano, se a herdanza o permite». Preguntas de que ano. Silencio. Auga` },
        promise: { title: 'Prometer baixar o aluguer á metade «por decreto»', flavor: (state, { rivals }) => `O público aplaude. ${rivals.populist.name} mírate con envexa profesional. ${rivals.moderator}: «Queda dito»` },
      },
    },
    finalPrep: {
      eyebrow: 'CAPÍTULO 6 · ÚLTIMA VOLTA', title: 'Aínda queda marxe.',
      intro: (state, ctx) => `Previsión: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'por riba' : 'por debaixo'} do limiar). Quedan dous días. A sondaxe oficial dávos «arredor de cero»; acerta sempre a favor de quen a encarga. Argumentario: «Mobilizar o voto útil». Marisa: «Que vaia a xente». Só hai tempo para unha cousa ben feita.`,
      choices: {
        listen: { title: 'Visitar a quen aínda dubida', flavor: state => `A parada do bus, a cola do centro de saúde e a señora do bolso, que xa coñece o que llo roubou: coinciden cada mes no xulgado${state.memories.nicoAssembly || state.memories.nicoInvite ? '. A asemblea do portal pídeche que volvas' : ''}. Escoitas máis do que falas` },
        receipts: { title: 'Publicar o orzamento definitivo', flavor: 'Lola imprímeo en A3: «a transparencia tamén é tamaño de letra». Sen anexos que saian en agosto' },
        volunteers: { title: 'Ordenar voluntarios e colexios', flavor: state => `Nico reparte quendas, bocadillos e un mapa de colexios debuxado nunha servilleta${state.memories.pacoLucia ? '. Lucía, a camareira de Paco, apúntase de interventora' : ''}. Sen autobuses de simpatizantes: co de liña` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTULO 6 · O ÚLTIMO MITIN', title: 'Unha frase antes da xornada de reflexión.',
      intro: 'Cadeiras pregables, un globo que se desincha e unha xornalista do diario local con cara de terceiro mitin hoxe. Nos outros peches hai autobuses e bandeiras; aquí, o do butano. Consolida o aprendido ou volve prometelo todo.',
      choices: {
        account: {
          title: state => ({
            shade: '“Haberá sombra e haberá menos coches. Isto escollemos, isto custa e aquí responderemos.”',
            parking: '“O barrio poderá traballar, aínda que este verán siga sen árbores. Isto escollemos e aquí responderemos.”',
            festival: '“Haberá cultura e haberá ruído pactado. Isto escollemos, isto custa e aquí responderemos.”',
            housing: '“Haberá máis pisos porque os construiremos, non porque os anunciemos. Tardará. E aquí responderemos.”',
          }[state.proposal] || '“Isto escollemos, isto custa e aquí responderemos.”'),
          flavor: 'Dislo sen papeis. Marisa abre a libreta e, por primeira vez, non apunta nada',
        },
        viral: { title: '“Menos atasco e máis gazpacho!”', flavor: 'Dani emíteo en directo. Corease. Ninguén sabe que significa. Ás doce xa o copiaron tres partidos' },
        everything: { title: '“Mañá haberá de todo para todos, por decreto.”', flavor: (state, { rivals }) => `Aplauso enorme. Lola tápase a cara co orzamento. ${rivals.populist.name} escríbeche: «Falamos?»` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finais
  endings: {
    victory: {
      eyebrow: 'NOITE ELECTORAL · VITORIA', title: 'Hai máis cadeiras ca persoas.',
      text: state => `Marisa aplaude unha vez. Lola pregunta quen gardou as facturas. Paciente e Sobrevivo xa chamaron dúas veces: «Que ofrecedes?». Ás 7:00 chega o último argumentario de Dani: «Gañamos». Marisa contesta: «Isto enténdoo». ${{
        shade: 'Mañá comeza o difícil: explicarlle á furgoneta do sobriño onde aparca.',
        parking: 'Mañá comeza o difícil: o primeiro agosto sen árbores co teu nome na placa.',
        festival: 'Mañá comeza o difícil: a primeira reunión cos do primeiro, que xa trouxeron tapóns para ti.',
        housing: 'Mañá comeza o difícil: a primeira licenza. Ernesto pregunta se pode alugar o terceiro antes de que remate a lexislatura.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NOITE ELECTORAL · DERROTA', title: 'Un resultado que nos permite seguir construíndo.',
      reasons: {
        support: 'Faltou apoio directo: o barrio viute máis no móbil ca no relanzo.',
        credibility: 'As contradicións pesaron: na cola do pan non hai hemeroteca, pero hai memoria.',
        organization: 'O equipo chegou desordenado: un colexio sen interventor e outro con tres.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minixogos
  minigames: {
    viral: {
      eyebrow: 'MINIXOGO · FAINO VIRAL', title: 'Gravando na marca.', goWord: 'Acción!',
      lanes: ['Saúdo', 'Arriba!', 'Palmas', 'Non consta'],
      takes: {
        explain: 'Encerado de Lola, plano fixo e cada xesto subliña un custo.',
        chairs: 'O baile das cadeiras. Paco mira cos brazos cruzados.',
        neighbor: 'Marisa fala da calor; ti, detrás, marcas o ritmo sen que se note. Nótase.',
        debunk: 'Desmontas o bulo con xestos claros: isto non, isto si, isto custa.',
      },
      intro: (state, ctx) => `Móbil no trípode, veciños mirando e Dani contando. ${ctx.take} Fai cada pose cando a súa icona chegue ao círculo. O ritmo suma alcance, non votos.`,
      titles: { great: 'Viral! Sumandos xa che ofreceu ser un pétalo.', ok: 'Compártese en tres grupos de WhatsApp. Un é o da túa nai.', bad: 'Corenta visualizacións. Dani chámalle «impacto cualitativo».' },
      texts: { ok: 'Dani xa pon subtítulos en amarelo. A toma vale: o alcance abre portas, pero os votos gáñanse no portal.', bad: 'Perdícheste entre o saúdo e as palmas. Repite a toma: polo de agora, «non consta».' },
    },
    duel: {
      eyebrow: 'MINIXOGO · DUELO DE RÉPLICAS', title: 'Cinco preguntas, un cronómetro.',
      intro: (state, ctx) => `${ctx.rounds} réplicas. Escolle a resposta que defende algo concreto e asume o seu custo antes de que se acabe o tempo. Á metade, alguén te interromperá: pide a palabra.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'A quen aparca en dobre fila e a dúas mesas da terraza de Paco. Sombra a cambio de coches, dito claro.',
          parking: 'Ao banco ao sol: este verán seguirá sen árbores. Escollemos que o barrio poida traballar.',
          festival: 'Aos do primeiro, dúas noites por semana. Con horario pactado e tapóns de agasallo, literalmente.',
          housing: 'Á praza, que segue sen sombra, e á nosa paciencia: construír tarda máis ca unha lexislatura. E chamarannos «os dos caseiros».',
        }[state.proposal];
        return [
          { topic: 'Vivenda', role: 'populist', claim: 'Grazas á nosa lei, nas zonas tensionadas o aluguer estabilizouse. Os pisos que faltan agóchaos a especulación.',
            options: ['Se está «estabilizado», por que o terceiro leva un ano pechado? Poñer teito non fai pisos. Construír si, aínda que tarde máis ca un titular.', 'Pois nós poñémoslle teito á metade! E ao pan!', 'Vostede leva unha chapa de cores. Sábeo todo o barrio.'], correct: 0 },
          { topic: 'Datos', role: 'tech', claim: 'Segundo un informe que non trouxen, a súa proposta afundirá o barrio. Dio esta gráfica. A da frecha vermella.',
            options: ['E segundo o meu, a súa gráfica é un bulo. Empate técnico.', 'Bo, os datos son relativos. Coma as enquisas.', 'Amose a fonte. A nosa: o orzamento de Lola, páxina dous, con foto do banco ás cinco da tarde.'], correct: 2 },
          { topic: 'A súa proposta', role: 'moderator', claim: 'Pregunta directa: a quen prexudica a súa proposta? Minuto de ouro. Bo, dez segundos de bronce.',
            options: ['A ninguén. É unha proposta transversal, sen perdedores, coma un anuncio de colonia.', cost || 'A alguén seguro. Dirémolo con nome e apelidos cando o saibamos.', 'Aos de sempre, que xa saben quen son.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'A promesa', role: 'populist', claim: 'Vostede prometeulle a unha panadeira sombra, aparcamento e un piso para o seu sobriño! Iso é populismo. E dígoo con coñecemento de causa.',
                options: ['É verdade. Equivoqueime ao prometelo todo; despois escollemos unha cousa e explicamos o que custa.', 'Sacouse de contexto. O contexto era eu prometéndoo todo.', 'Vostede tamén o promete todo. Empate.'], correct: 0 }
            : { topic: 'Sanidade', role: 'tech', claim: 'E a sanidade? Ou só lle importa a súa praza? Nós xestionaremos. Moito. Con xestión.',
                options: ['Prometo que mañá non hai listas de espera. Palabra.', 'Impórtanos. Por iso non prometemos o que non xestionamos: levaremos a cita da Reme ao pleno, con nome e data.', 'Derrogarémolo todo, coma vostede. Xa veremos que.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: 'Perdoe! Iso é da máquina da lama. Dígoo sen oílo enteiro.',
        tech: 'Se me permite… como dicía esta mañá un xornal… léollo enteiro…',
        moderator: 'Quédanlle dez segundos. Nove. Queda dito.',
        fallback: 'Perdoe, perdoe!',
      },
      floor: 'Déixeme rematar, que isto non é unha rolda de prensa.',
      floorBabble: 'Déixeme rematar',
      reactions: {
        timeout: 'Acabouse o tempo. Queda dito. Seguinte bloque.',
        quick: 'Resposta concreta e en tempo. Inusual. Tomo nota.',
        slow: 'Concreta, aínda que xustiña de tempo.',
        wrong: 'Grazas por darme a razón. Poñereino no argumentario.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} asente. E non di «queda dito».`, mid: 'Aguantaches o tipo. Sen chuleta.', low: 'Mañá os rivais dirán que gañaron. Hoxe, con motivo.' },
      text: 'A estratexia que escolliches marca o debate; as réplicas deciden se te cren.',
    },
    chairs: {
      eyebrow: 'MINIXOGO · SEIS CADEIRAS', title: 'Préstamo, non subvención.',
      intro: (state, ctx) => `Para a última asemblea fan falla as seis cadeiras de Paco, repartidas polo barrio. Pasa por riba dunha para collela e lévaa ao corro. Unha a unha: «as costas tamén votan», di Nico. Tes ${ctx.time} segundos.`,
      hints: {
        start: 'Pasa por riba dunha cadeira para collela.',
        carry: 'Agora, ao corro amarelo.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. Á seguinte.`,
        full: 'Corro completo!',
      },
      titles: { all: 'Seis cadeiras no corro. Paco, conforme.', mid: 'Medio corro. O resto, de pé e opinando.', low: 'Paco recolle as cadeiras el mesmo. E coméntao.' },
      texts: { all: 'Nico apunta o tempo na servilleta. Organizar é isto: que haxa sitio cando chega a xente.', other: 'As que faltan seguen pola praza. Repite: ninguén viu nada, agás Paco.' },
    },
    rally: {
      eyebrow: 'MINIXOGO · O ÚLTIMO MITIN', title: 'Que non se che vaia a sala.', goWord: 'Fala!', lane: 'Remata a frase',
      intro: 'Cada frase ten un remate. Preme cando a palabra chegue ao círculo: o público aplaude e a atención sobe. Se fallas, alguén mira o móbil. Ou peor: asubía.',
      phrases: state => {
        const own = {
          shade: ['Este verán, a praza terá', 'SOMBRA'], parking: ['Quen traballa neste barrio poderá', 'DESCARGAR'],
          festival: ['Os rapaces terán local e a praza,', 'CULTURA'], housing: ['Os pisos non se anuncian:', 'CONSTRÚENSE'],
        }[state.proposal] || ['Unha cousa ben feita, para', 'COMEZAR'];
        return [
          ['Boas noites. Grazas por vir sen autobús e con', 'CADEIRA'],
          ['Non veño con argumentario: veño con', 'UNHA COUSA'],
          own,
          ['E si: ten un custo. Puxémolo por', 'ESCRITO'],
          ['Sen observatorio, sen comisión e sen', 'LOGO'],
          ['Ninguén aquí vos dixo que isto se pague', 'SÓ'],
          ['Se non cumprimos, xa sabedes onde está a', 'PANADARÍA'],
          ['Esta noite Marisa non ten nada que', 'TRADUCIR'],
          ['O domingo non vos pido fe: pídovos que', 'VOTEDES'],
          ['A quen queirades. Pero que non decida o', 'SOFÁ'],
          ['Grazas, barrio. E agora, as cadeiras, para', 'PACO'],
          ['Así que, veciñanza, pois eu', 'PRESÉNTOME!'],
        ];
      },
      titles: { great: 'A sala en pé. Os que teñen cadeira, tamén.', ok: 'Aplausos sinceros e algún bocexo.', bad: 'Oíuse un móbil. Era o argumentario.' },
      text: 'O público lembrará como o dixeches; a decisión que tomaches decide que lembra.',
    },
  },
};
