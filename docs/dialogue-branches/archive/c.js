// Rama C del guion · «Campaña en la era del scroll».
// Sobrescribe todo el texto de actual.js (léase su cabecera: esquema, funciones (state, ctx) y restricciones).
// Objetos se fusionan clave a clave; arrays y funciones se reemplazan enteros.
// Validar: npm.cmd test (tests/script.test.js). Probar: menú principal → Guion, o ?guion=c.
// Running gag de la rama: los audios de la tía Puri (bulos del grupo familiar), con pago en la noche electoral.

export const meta = {
  label: 'C · Campaña en la era del scroll',
  pitch: 'La política de siempre en formato vertical: bulos de la familia, trends y promesas de nueve segundos, mientras la panadería pincha la burbuja.',
};

const PROPOSAL_COST = {
  shade: 'A quien aparca en doble fila y a dos mesas de la terraza de Paco. Sombra a cambio de coches, dicho claro.',
  parking: 'Al banco al sol: otro verano sin árboles. Elegimos que el barrio pueda trabajar.',
  festival: 'A los del primero, dos noches por semana. Horario pactado y tapones de regalo. Literalmente.',
  housing: 'A quien vive frente al solar: dos años de grúas y polvo. Y a quien se mete en casa ajena: se acabó esperar años.',
};

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: 'Fermín Aguardo', party: 'Partido Paciente' },
    populist: { name: 'Nuria Giro', party: 'Partido Sobrevivo Otra Elección' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Maite Escaleta',
  },

  // Tercer atril del debate (lo conecta el coordinador; el merge tolera claves nuevas).
  foxDebate: {
    hallLine: 'Sin complejos: he dejado el caballo en doble fila. Si me multan, es ideología.',
    interruption: '¡Sorry, sorry! Eso es ideología. Se lo digo en inglés, que es como hablamos los patriotas.',
    round: {
      topic: 'Reincidencia', role: 'hard',
      claim: 'Al que roba el móvil del bar lo detienen y a la hora está otra vez en la barra. ¿Hará algo o abrirá un observatorio, como los de la rosa?',
      options: [
        'Sí: juzgados con medios, para que el reincidente no salga por la misma puerta por la que entró. Sin caballo y sin observatorio.',
        '¡Mano dura, muro y caballería! ¡Make la plaza Great Again!',
        'Eso es un discurso de odio y no pienso contestar.',
      ],
      correct: 0,
    },
    reactions: {
      win: 'Hmm. Eso lo iba a decir yo. Pero a caballo.',
      lose: 'Ahí lo tienen: vecindario cobarde.',
      timeout: 'Mientras usted piensa, la España que madruga ya se ha ido a dormir.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'UNA CAMPAÑA EN VERTICAL',
    tagline: 'La política de siempre, en vídeos de nueve segundos. Y una panadera sin datos móviles que lo ve todo.',
  },

  chapters: ['Pues me presento', 'La sede es mi salón', 'La plaza no tiene algoritmo', 'Hazlo viral', 'Eso no fue lo que prometiste', 'El último mitin'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'Uno más y lo dejo', objective: 'El móvil vibra en la mesita, junto al sofá. Pulsa E. Es solo un vídeo. Seguro.' },
    call: { title: 'Cámaras apagadas', objective: 'Usa el portátil de la mesa para llamar a tus amigos. Que enciendan la cámara.' },
    register: { title: 'Nombre de usuario disponible', objective: 'Ve a la carpeta del escritorio y registra el partido antes de que alguien te quite el nombre.' },
    leave: { title: 'Tocar césped', objective: 'Sal por la puerta verde y baja a la plaza. Hay luz natural. No te asustes.' },
    neighbor: { title: 'Comentarios en persona', objective: 'Habla con Marisa, en la panadería. Paco, en la terraza del bar, también comenta. Sin moderación.' },
    program: { title: 'Un programa no es un hilo', objective: 'Elige tu primera propuesta en el tablón de la plaza. Solo cabe una.' },
    speech: { title: 'Primer directo sin filtro', objective: 'Sube al atril y da tu primer discurso. Aquí nadie puede pasar al siguiente vídeo.' },
    aftermath: { title: 'Reseñas de la cola del pan', objective: 'Vuelve con Marisa para leer las reseñas. Las de verdad.' },
    hqBrief: { title: 'La sede es mi salón', objective: 'Reúne al equipo en la mesa de campaña. Lola, Dani y Nico también quieren hablar contigo, cada uno en su pestaña.' },
    video: { title: 'Hazlo viral', objective: 'Graba un vídeo en la marca junto a la panadería. Tienes tres segundos antes de que deslicen.' },
    crisis: { title: 'Eso no fue así: está recortado', objective: 'Afronta la crisis en el tablón. Antes, quizá convenga oír al equipo y no a los comentarios.' },
    debate: { title: 'El debate del salón', objective: 'Entra en el debate. Tres atriles, uno vacío y un chaval retransmitiéndolo desde el pasillo.' },
    finalPrep: { title: 'Última vuelta, sin cobertura', objective: 'Elige en el mapa dónde concentrar el último esfuerzo. En persona, a poder ser.' },
    finalSpeech: { title: 'El último mitin', objective: 'Cierra la campaña ante el público. El de carne y hueso.' },
    election: { title: 'La noche de las sillas', objective: 'Consulta el resultado. El oficial, no la encuesta del canal de Kevin Lupa.' },
    complete: { title: 'Campaña completada', objective: 'La campaña ha terminado. Puedes volver a activar las notificaciones.' },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: 'Árboles, no un observatorio del calor', cost: '2 de presupuesto', benefit: 'Árboles grandes, toldos, una fuente que funcione y el bajo vacío de la esquina como sala fresca para mayores. Sin mesa de estudio previa: se planta en otoño.', compromise: 'Adiós a varias plazas de aparcamiento, la terraza de Paco pierde dos mesas y el sobrino de Marisa sigue descargando en doble fila.' },
    parking: { title: 'Que el barrio pueda trabajar', cost: '2 de presupuesto', benefit: 'Carga y descarga con horario claro, plazas rotatorias para el comercio y una sola ventanilla para abrir negocio. Una licencia, no una gincana.', compromise: 'Más coches en la plaza y otro verano a pleno sol. El banco seguirá hirviendo en agosto y saldrá en algún vídeo de «el banco más caliente de España».' },
    festival: { title: 'Escenario en la plaza, no en la pantalla', cost: '2 de presupuesto', benefit: 'Escenario para grupos del barrio, cine de verano y un local de ensayo: que los chavales tengan un plan que no sea ver a otros chavales hacer planes.', compromise: 'Ruido dos noches por semana y los del primero, con tapones. La sombra y la carga y descarga, para otra legislatura.' },
    housing: { title: 'Grúas, no carteles', cost: '2 de presupuesto', benefit: 'Licencia para el solar de la esquina en meses, no en años; suelo para obra nueva; y desalojo rápido si alguien se mete en tu casa. Más pisos, y el precio baja sin decreto.', compromise: 'Dos años de grúas y polvo, el solar del botellón desaparece y a alguien el edificio nuevo le tapa la vista. La sombra, en el plano.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'Nota de la comunidad con piernas', line: 'Gestoría de día; de noche desmiento los bulos del grupo de mi familia. Te llevo las cuentas. Pero cada promesa con fuente. «Me lo ha dicho un amigo» no es fuente.', choices: [
      { label: 'Tesorería. Y derecho a ponerme notas de contexto.', reply: 'Hecho. Primera nota: «pedido de croquetas» no es «gasto de representación». Contexto añadido por los lectores.' },
      { label: 'Estrategia. Que alguien piense más allá del próximo vídeo.', reply: 'Plan a cuatro años. En internet eso es la Edad Media. En Hacienda, anteayer.' },
    ] },
    dani: { role: 'Vive en el algoritmo, paga alquiler fuera', line: 'Llevo las redes de una clínica dental, un gimnasio y un señor que vende colchones en directo. Literal: he hecho viral un colchón. Un candidato no puede ser más difícil.', choices: [
      { label: 'Comunicación. Sin bots ni seguidores comprados.', reply: 'Orgánico. Primeros seguidores: mi madre, su cuenta de recetas y la del perro. El perro ya tiene más interacción que la cuenta de Centrifugados.' },
      { label: 'Portavoz. Das mejor en vertical que yo.', reply: '¿Yo, a cámara? Vale. Pero si me hacen un recorte, que me pillen con buena luz.' },
    ] },
    nico: { role: 'Administrador del grupo del portal', line: 'Turnos en un almacén y administrador del grupo del portal: ciento doce vecinos, cero silenciados. Si sobreviví a la derrama del ascensor, sobrevivo a una campaña.', choices: [
      { label: 'Organización. Tú mueves gente sin algoritmo.', reply: 'Hecho. Mi algoritmo es bajar la basura a la misma hora que la Reme. Más alcance que cualquier anuncio.' },
      { label: 'Actos. Que la gente vaya a algo que no sea un directo.', reply: 'Tengo un megáfono, cuarenta metros de alargador y la llave del cuarto de las bicis. En California eso sería una startup con ronda de inversión.' },
    ] },
  },

  call: {
    title: 'Videollamada: tres cámaras apagadas',
    you: 'Ha visto un vídeo',
    next: 'Vale. Siguiente cuadradito',
    done: 'Pues ya somos partido. Lo pongo en el grupo del portal, que allí se enteran antes que en el BOE.',
    doneBabble: 'Pues ya somos partido.',
    finish: 'Nos vemos en la plaza. En persona. Sí, en persona.',
  },

  register: {
    eyebrow: 'FUNDACIÓN · TRÁMITE EN LÍNEA',
    title: 'Un nombre de usuario para la papeleta.',
    stamp: 'PENDIENTE DE VERIFICAR',
    intro: 'Tres campos, sin certificado digital y sin cita previa. En la vida real te pedirían un formulario para poder pedir el formulario.',
    defaultName: 'Vecinos Sin Filtro',
    defaultSlogan: 'Menos hilos, más hechos.',
    submit: 'Publicar candidatura',
    toast: 'REGISTRADO. Ya tenéis más afiliados que Centrifugados. Sois cuatro.',
  },

  program: {
    eyebrow: 'PROGRAMA · PRESUPUESTO: 2 CRÉDITOS',
    title: 'Un programa no es un hilo.',
    intro: 'Solo cabe una propuesta. Elegir es dejar a alguien del barrio esperando, y el barrio no hace scroll: se acuerda.',
    promisedBothNote: 'Marisa apuntó lo que prometiste: sombra, aparcamiento y piso para su sobrino. Ninguna opción paga todo eso: −6 de credibilidad al concretar.',
    toast: (state, ctx) => `Programa fijado: ${ctx.proposal.title}. Ahora, explícalo sin subtítulos.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ['Esto no se puede pasar con el dedo.', '¿Qué vas a defender?', 'Cierre. Sin «enlace en la bio».'],
    parts: {
      opening: { title: '01 / Romper el hielo', prompt: 'Siete personas. Dos esperan el autobús, una ha bajado a por el pan y un chaval te graba en vertical por si te caes.', options: {
        listen: 'Antes de hablar, vengo a escuchar. Con los comentarios abiertos.',
        joke: 'Tranquilos: esto dura menos que un anuncio que no se puede saltar.',
        grand: '¡Hoy empieza una nueva era! ¡Activad la campanita de la historia!',
      } },
      argument: { title: '02 / Decir algo concreto', prompt: 'Toca defender lo del tablón. Marisa se cruza de brazos, que es su forma de darle a «guardar».', options: {
        shade: 'Árboles y sombra para los mayores, aunque perdamos aparcamiento. Árboles: no un observatorio del calor.',
        parking: 'Que quien trabaja pueda descargar y abrir negocio sin gincana, aunque la plaza siga sin árboles.',
        festival: 'Cultura y un local para los chavales, con horario pactado. Que el plan del viernes no sea una pantalla.',
        housing: 'Que se construya: suelo, licencias en meses y la ley de tu lado si te ocupan la casa. Tardará, y habrá grúas.',
        everything: '¡Árboles, aparcamiento, festivales y un piso por cabeza, gratis y para el lunes! ¡Dale a seguir!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'Marisa mira el reloj. El de pared, no el del móvil. Es peor.', options: {
        accountable: 'Si no lo cumplimos, venid a decírnoslo aquí. En persona. Sin cuenta anónima.',
        chant: '¡Seis, siete! ¡Seis, siete!',
        forever: 'Y ahora abro hilo. Uno de veintisiete…',
      } },
    },
    timing: { eyebrow: '04 / DARLE EL GOLPE FINAL', title: 'Ahora. Sin mirar la pantalla.', button: '¡Y por eso me presento!' },
    result: {
      eyebrow: 'COMENTARIOS EN PERSONA',
      goodTitle: 'Aplauso en directo. Sin enlatar.',
      badTitle: 'Hasta las palomas han hecho scroll.',
      coherent: 'Has defendido tu propuesta y dicho lo que cuesta. La gente sabe qué ofreces, que ya es más que un titular.',
      incoherent: 'Tu discurso no coincide con el programa. Alguien ya lo tiene grabado, y los recortes se hacen solos.',
      fine: 'El alcance mide atención, no votos. Un millón de visualizaciones nunca ha comprado una barra de pan.',
      button: 'Bajar del atril',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: '¿Tú eres el del partido nuevo? Me lo ha dicho la Reme, que lo ha leído en el grupo del portal. Yo no tengo grupos: tengo mostrador. Aquí los comentarios se hacen a la cara y sin faltas.' },
      { speaker: 'Marisa', text: 'Mi sobrino reparte en furgoneta y no tiene dónde parar. Treinta y cuatro años, en su cuarto de pequeño. Y en el tercero ya no vive nadie: viven maletas. ¿Por dónde empiezas?', choices: [
        { text: 'Por escucharte. ¿Qué te quita el sueño a ti?', memory: 'listened', response: 'El calor. Mi madre espera al especialista sentada al sol, y yo con ella. No te pido un vídeo: te pido un árbol. Los árboles no se hacen virales, pero dan sombra.' },
        { text: 'Por todo: sombra, aparcamiento y un piso para tu sobrino.', memory: 'promisedBoth', response: 'Apuntado en el papel de envolver. Eso, cariño, no tiene botón de editar ni de «se ha malinterpretado».' },
        { text: 'Por hacer ruido: un festival que nos ponga en el mapa.', memory: 'spectacle', response: '¿En el mapa? Ya salimos en las webs de pisos turísticos: «barrio auténtico, cinco estrellas». Lo auténtico se fue con el último inquilino.' },
      ] },
      { speaker: 'Marisa', text: 'Ahí tienes el tablón. El dinero da para una cosa. Una. Luego lo cuentas en el atril sin anglicismos, que aquí «engagement» suena a enfermedad de las encías.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Sombra, aparcamiento y piso para mi sobrino. Lo tengo en el papel de las barras. Ese papel ha visto más promesas que un plató.'
        : m.listened ? 'Antes me has escuchado. Parece poca cosa, pero se nota cuando alguien viene con el discurso ya grabado y con subtítulos.'
        : m.spectacle ? 'Lo del festival ya lo sabe todo el barrio. Bueno, el del tercero no, que está en Lisboa alquilando desde una aplicación.'
        : 'Bueno. Ya has bajado del cajón. Te temblaba menos la voz que a los de la tele cuando se les cuelga el autocue.';
      const coherent = {
        shade: 'Has dicho que quitas aparcamiento para poner árboles. Mi sobrino te odiará dos semanas; mi madre te votará. Y sin observatorio: con pala.',
        parking: 'Furgoneta antes que árboles. Mi sobrino te ha puesto un corazoncito; mi madre, una cara de agosto. Tú sabrás cuál de los dos vota más.',
        festival: 'Cultura hasta las doce. Los chavales ya han hecho un grupo; los del primero, otro, y en el suyo no te ponen emojis. Pero lo del ruido lo has dicho a la cara.',
        housing: 'Lo de construir. Habrá grúas y polvo. Pero te lo digo yo, que vendo pan: cuando hay más barras, la barra no sube. Eso no lo arregla un tope.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'No estoy de acuerdo con todo. Pero has dicho qué cuesta y a qué renuncias. Eso en la tele ya no lo dice nadie.')
        : speech.picks?.[1] === 'everything' ? 'Árboles, aparcamiento, festivales y pisos para el lunes. Eso no es un programa, cariño: es un sorteo de influencer. «Comenta y gana».'
        : 'El tablón decía una cosa y tú has dicho otra. Alguien juntará los dos vídeos y les pondrá música de suspense. Lo he visto en la tele mil veces.';
      const closing = m.pacoLucia ? 'Me ha dicho Paco que le has conseguido camarera. Eso no tiene likes, pero tiene nómina. Ahora sí que estás en política. De la buena.'
        : speech.picks?.[2] === 'chant' ? '¿Y lo de «seis, siete»? Mi nieta dice que no significa nada. Como la mitad de los eslóganes de la tele, pero por lo menos es corto.'
        : (speech.reach || 0) >= 12 ? 'Dani dice que tu discurso lo han visto miles. Aquí lo han visto doce, y las doce votan. Los miles, no sé ni si están empadronados.'
        : 'Bueno. Ya tienes partido, equipo y una señora que no sigue tu cuenta, pero te sigue a ti. Ahora sí que estás en política.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Seis sillas. La séptima es la mía, como la contraseña del wifi: no se comparte».' : s.memories.pacoLucia ? 'Paco: «La chica es un fichaje. Sabe más de tortilla que el que la reseña».' : 'Paco: «Lo dicho. Cuánto cuesta. Y si no lo sabes, que no lo sabes».',
      lines: [
        { speaker: 'Paco', text: 'Paco. Bar La Última. Tengo una tele, un wifi que se llama «PagaPrimero» y opiniones de serie. ¿Qué te pongo?', choices: [
          { text: '¿Qué le pedirías tú a un partido nuevo?', memory: 'pacoHeard', response: 'Que diga cuánto cuesta. Y si no lo sabe, «no lo sé». Cuarenta años con la tele puesta y no se lo he oído a nadie. Ni a los tertulianos, que lo saben todo.' },
          { text: '¿Nos prestas sillas para el acto?', memory: 'chairs', response: 'Seis. Contadas. Si en la foto salen siete, es que os la ha retocado el de las redes.' },
          { text: '¿Cómo va el negocio?', memory: 'pacoRent', response: 'Turistas grabando las bravas antes de comérselas. Las bravas tienen más seguidores que yo. Y el casero más que las bravas: me ha subido el local.' },
        ] },
        { speaker: 'Paco', text: 'Mira ese cartel: «Se busca camarero». Lleva desde Semana Santa. Lo puse en internet y solo me escriben bots ofreciéndome criptomonedas.', choices: [
          { text: '¿Has probado a pagar más?', memory: 'pacoWages', response: 'Lo he probado. Sube el café y me cae una estrella: «atraco». Y Sumandos quiere topar el café. Topado el café, ¿con qué pago al camarero? ¿Con likes?' },
          { text: 'Es que los jóvenes ya no quieren trabajar.', memory: 'pacoBlame', response: 'Eso dice mi cuñado en el grupo. Mi sobrina hacía doble turno y no le llegaba ni para la habitación. Ahora sube vídeos de su piso en Dublín. Trabajar, quería.' },
          { text: 'Lucía, la estudiante de la fuente, busca algo para los findes.', memory: 'pacoLucia', response: '¿La de los apuntes en cuatro colores? Que venga. Contrato, horario por escrito y tortilla. Has juntado a dos personas sin aplicación. Eso ya es más que muchos.' },
        ] },
        { speaker: 'Paco', text: 'Ahí viene el chaval que me ha birlado el móvil de la barra tres veces. Lo detienen, lo sueltan y vuelve antes que el atestado. Ya le pongo el café sin preguntar.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'El tablón está ahí, al lado del árbol. Una propuesta, cariño. Esto no es un carrusel de diez fotos.',
        speech: 'Sube ya al cajón, que aquí la gente no tiene botón de pausa. Y guarda el móvil, que con la luz en la cara pareces un fantasma con programa.',
        video: 'Si vas a grabar, ponte a la sombra. Y a mí no me saques de fondo, que no he firmado nada de derechos de imagen.',
        finalPrep: 'Ahora hay quien quiere topar el pan. Si me topan la barra, la hago más pequeña y la llamo «barra social». Eso no sale en el vídeo del ministerio.',
      }[s.mission] || 'Los del Partido Paciente vinieron a prometerme bajar impuestos. Lo mismo que la otra vez. Mi recibo del IBI aún los está esperando.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Estoy cuadrando. Si no me hablas en euros, no te contesto».', lines: [
        { speaker: 'Lola', text: 'La crisis tiene algo bueno: por fin alguien mira mis hojas de cálculo. Con lupa, con mala leche y con captura de pantalla.', choices: [
          { text: 'Publícalas. Todas.', memory: 'lolaBooks', response: 'Hasta el tíquet del celo. Fuente, enlace y sello. Que el mayor escándalo que nos encuentren sea una pizza sin factura.' },
          { text: 'Mejor esperamos a que pase.', memory: 'lolaWait', response: 'En internet nada pasa: se archiva. Y alguien lo desarchiva la semana antes de votar, con música de suspense. Tú verás.' },
        ] },
      ] },
      default: { after: 'Lola: «Pestaña nueva: “Promesas que no vamos a pagar”. Ya tiene más filas que el programa».', lines: [
        { speaker: 'Lola', text: 'He abierto una hoja: «Campaña_FINAL_v3_ahora_sí». Ingresos: el bote del grupo y cuarenta euros que Dani nos debe desde que se mandaban SMS.' },
        { speaker: 'Lola', text: 'Gastos: pizzas, una imprenta y una factura de «estrategia digital» del primo de Dani, que hizo un curso online de cuatro horas. ¿La pago?', choices: [
          { text: 'Ni de broma. Todo con factura y todo publicado.', memory: 'lolaReceipts', response: 'Gracias. Si salimos en las noticias, que sea por aburridos. Un Excel público no tiene ratio, pero tampoco se puede recortar.' },
          { text: 'Págala, que el primo es majo.', memory: 'lolaCousin', response: 'Majo es. Barato, no. Te la apunto en la pestaña «Cosas que saldrán en un hilo sobre nosotros».' },
          { text: 'Oye, Lola… ¿y tú cómo llegas a fin de mes?', memory: 'lolaRent', response: 'Con dos opositores y un ficus. Los estudios del barrio se fueron a alquiler de temporada cuando los toparon. El tope funcionó: ya no queda nada que topar.' },
        ] },
        { speaker: 'Lola', text: 'Venga, a la mesa. La app dice que la pizza llega en veinte minutos. Como las promesas: llegará en cuarenta, fría y con piña.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Llevo cuatro horas contestando. Ya no sé hablar sin emojis».', lines: [
        { speaker: 'Dani', text: 'El recorte va por cincuenta mil visualizaciones. El desmentido, por ochenta. Ochenta y una: acaba de entrar mi madre. Y abajo, cien vecinos de verdad muy enfadados.', choices: [
          { text: 'Contesta a los de verdad, uno a uno.', memory: 'daniReply', response: 'Uno a uno. A los bots no, que no votan. A la gente enfadada sí: si le contestas con nombre, a veces hasta se desenfada.' },
          { text: 'Bloquea a todo el mundo y sube un meme.', memory: 'daniMeme', response: 'Hecho. El meme tiene más comentarios que el problema. Es la técnica del community manager de cualquier ministerio. Funciona. No preguntes a qué precio.' },
        ] },
      ] },
      default: { after: 'Dani: «Estoy editando. Si me hablas, pierdo el corte en el beat».', lines: [
        { speaker: 'Dani', text: 'He estudiado el algoritmo. Funciona un perro, un drama o un político de sesenta años bailando un trend. No tenemos perro y tú aún tienes vergüenza.' },
        { speaker: 'Dani', text: 'Propuesta: te grabo explicando el programa con filtro de piel perfecta y el audio del «seis, siete». Nadie sabe qué significa. Por eso funciona.', choices: [
          { text: 'Sin filtro. Que se vean las ojeras.', memory: 'daniNoFilter', response: 'Valiente. Sin filtro sales con cara de lunes. Y la gente de verdad tiene cara de lunes. Esa gente vota.' },
          { text: 'Con filtro y con el audio de moda.', memory: 'daniTrend', response: 'Literal, así sí. Nadie sabrá qué propones, pero todos sabrán que bailas fatal. En política, eso se llama «cercanía».' },
          { text: '¿Y tú qué tal, con tantos curros?', memory: 'daniJobs', response: 'Tres clientes y ningún contrato. Autónomo: pago la cuota antes de cobrar la factura. Esta campaña es lo único que hago gratis. Y con ganas.' },
        ] },
        { speaker: 'Dani', text: 'Una cosa: si algún día dices «¿qué pasa, jóvenes?» con la gorra al revés, dimito. Y lo anuncio en directo, que es como se dimite ahora.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Estoy en el grupo del portal apagando fuegos. Hay uno que escribe en mayúsculas».', lines: [
        { speaker: 'Nico', text: 'Ha bajado el del tercero, el del piso turístico. Dice que si vamos contra él, nos denuncia. Luego me ha pedido que le reguemos las plantas en agosto.', choices: [
          { text: 'Invítale a la asamblea del portal. Que dé su versión.', memory: 'nicoInvite', response: 'Vale. Igual resulta que él vive de alquiler en otro barrio, donde tampoco se construye nada. Al final todos somos el inquilino de alguien.' },
          { text: 'Ni caso. Es el enemigo.', memory: 'nicoEnemy', response: 'Enemigo, enemigo… Es Ernesto, del cole. Así empieza la polarización: con uno que te debe un balón desde sexto. Bueno, tú mandas.' },
        ] },
      ] },
      default: { after: 'Nico: «Voy a por más celo. Los carteles se despegan antes que los tiktoks».', lines: [
        { speaker: 'Nico', text: 'He pegado cuarenta carteles. Treinta y ocho rectos. Dos en diagonal. Dani dice que en diagonal tienen más engagement.' },
        { speaker: 'Nico', text: 'La Reme dice que vota a quien le consiga cita con el cardiólogo antes de Navidad. Le ha llegado un audio que dice que tú se la consigues. ¿Qué le digo?', choices: [
          { text: 'La verdad: no se arregla en un mes, pero lo pelearemos.', memory: 'nicoTruth', response: 'Se lo digo. Le va a sentar fatal y te va a respetar. Es lo que le pasa a la Reme con todo lo que es verdad, empezando por su médico.' },
          { text: 'Dile que sí. Cita en una semana.', memory: 'nicoPromise', response: 'Se lo digo. Y en diciembre, cuando siga esperando, el audio de siete minutos te lo manda a ti. Con eco de sala de espera.' },
          { text: 'Que venga a la asamblea del portal y nos lo cuente a todos.', memory: 'nicoAssembly', response: 'Buena idea. Cada uno se queja en su grupo y nadie lee el de los demás. Juntarlos en el portal es lo más revolucionario que se puede hacer sin wifi.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ['CAPÍTULO 1', 'Pues me presento'],
      tv: { headline: '¡ELECCIONES!', ticker: 'ÚLTIMA HORA · CONVOCATORIA · FOX LLEGA AL PLATÓ A CABALLO' },
      subs: [
        [null, 'Domingo, 23:47. Llevas cuarenta minutos en unratito. «Uno más y lo dejo».'],
        ['Presentadora (TV)', 'Última hora: el Gobierno disuelve las Cortes y convoca elecciones generales.'],
        ['Presentadora (TV)', 'Los candidatos ya ensayan bailes. El Partido Paciente ha subido su primer vídeo: veinte segundos andando por un polígono.'],
        [null, 'BZZZ. Grupo «Familia (aquí NO se habla de política)»: cuarenta y tres mensajes. La tía Puri ha reenviado un audio «MUY IMPORTANTE».'],
        ['Tú', '¿Elecciones? ¿Otra vez? …Pues igual yo tengo una propuesta. Bueno. A ver qué dice el móvil.'],
      ],
      toast: 'El móvil no para de vibrar. Está en la mesita, junto al sofá. Es la tía Puri. Otra vez.',
    },
    plaza: {
      banner: ['EL BARRIO', 'La plaza no tiene algoritmo'],
      subs: [
        [null, 'La plaza: panadería, bar, un banco al sol y cero cobertura junto a la fuente.'],
        ['Marisa', '¡Anda, el del partido nuevo! Ven, que te tengo que comentar. Y no en los comentarios: aquí.'],
        ['Paco', 'Si vienes a salvar España, que sea después del café. Y el café se paga, que no es una promesa electoral.'],
      ],
    },
    hq: {
      banner: ['CAPÍTULO 2', 'La sede es mi salón'],
      subs: [
        [null, 'La sede: un salón, una mesa plegable, dos enchufes y un aro de luz. Funciona un enchufe.'],
        ['Lola', 'El sofá es la sala de prensa y la nevera, la tesorería. Quien coja una cerveza, va a gastos.'],
        ['Dani', 'He llamado al wifi «SedeOficial_5G». Ya somos institucionales. Y rápidos.'],
        ['Nico', 'Las sillas, prestadas. El aro de luz es de mi prima, que hace directos de uñas.'],
      ],
    },
    hall: {
      banner: ['CAPÍTULO 5', 'El debate del salón'],
      subs: [
        [null, 'Salón multiusos. Hoy, debate. Mañana, zumba. En el pasillo, un chaval lo retransmite con su propia opinión.'],
        ['moderator', 'Buenas noches. Bloques temáticos, cronómetros en pantalla y el atril de Centrifugados, que sigue esperando a su candidato.'],
        ['tech', 'Vengo con sentido común, un periódico subrayado y paciencia. Muchísima paciencia.'],
        ['populist', 'Y yo vengo a defender lo que defendí siempre. Desde el martes.'],
      ],
    },
    victory: {
      banner: ['NOCHE ELECTORAL', '¡Victoria!'],
      verdict: '¡SUPERA EL 48!',
      subs: [
        ['Periodista', 'Conectamos con el salón multiusos. Con todo escrutado, y antes de que Kevin Lupa lo llame fraude en su canal…'],
        ['Tú', '¿Hemos… ganado? ¿Sin bailar?'],
        ['Tía Puri (audio)', 'Hijo, me ha llegado que has ganado. No sé si es bulo. Lo reenvío por si acaso.'],
      ],
    },
    defeat: {
      verdict: 'NO LLEGA AL 48',
      subs: [
        ['Periodista', '…y la candidatura del barrio se queda a las puertas. Muchas visualizaciones, pocas papeletas.'],
        ['Tú', 'Bueno. En unratito íbamos primeros.'],
        ['Tía Puri (audio)', 'Me ha llegado que has perdido. Eso sí me lo creo, que lo dice todo el grupo. Te quiero igual, hijo.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: 'CAPÍTULO 2 · LA SEDE ES MI SALÓN', title: 'Tres personas, una mesa y un aro de luz.',
      intro: state => `El sofá es la sala de prensa y la nevera, la tesorería. Hay tiempo para una prioridad de verdad; el resto va al grupo de WhatsApp, donde las ideas mueren con un pulgar arriba.${state.memories.nicoAssembly ? ' Nico ya ha convocado asamblea en el grupo del portal: cuarenta «ok» y un audio.' : ''}`,
      choices: {
        accounts: { title: 'Lola publica cada coste', flavor: 'Presupuesto abierto hasta el tíquet del celo. Cero bailes y nada que recortar' },
        street: { title: 'Nico organiza puerta a puerta', flavor: 'Rellano por rellano, con la excusa de la derrama del ascensor. El algoritmo más antiguo: llamar al timbre' },
        content: { title: 'Dani monta un estudio', flavor: 'Aro de luz, croma de sábana verde, un micro de corbata que pita y un calendario de contenidos hasta el día de votar' },
        tenants: { title: 'Asamblea de vecinos en el portal', flavor: 'Baja gente que no se hablaba desde lo de las humedades. Salen ideas, quejas y un señor que pide un observatorio. Se le dice que no' },
      },
    },
    video: {
      eyebrow: 'CAPÍTULO 4 · HAZLO VIRAL', title: 'La marca está puesta. Falta decidir qué subir.',
      intro: state => { const m = state.memories; return `Dani calcula que tienes tres segundos antes de que el dedo suba. En ese tiempo, Fox ya ha galopado y Sobrevivo ya ha rectificado. La atención abre puertas; el voto se gana en el portal.${m.daniNoFilter ? ' Hoy, sin filtro.' : m.daniTrend ? ' Dani ya ha elegido el audio. No preguntes.' : ''}`; },
      choices: {
        explain: { title: 'Explicar la propuesta y lo que cuesta', flavor: 'Un minuto, plano fijo y la pizarra de Lola. El vídeo menos visto de la campaña y el más citado' },
        chairs: { title: 'El baile de las sillas de Paco', flavor: 'Nadie sabe qué propones; todo el mundo sabe que te caes en el segundo once. Hay carreras políticas enteras construidas así' },
        neighbor: { title: 'Dejar hablar a Marisa', flavor: 'Ella habla del calor, del local y de la cita de su madre. Tú sujetas el móvil y te callas. Los comentarios piden que se presente ella' },
        debunk: { title: 'Desmontar el bulo del día', flavor: 'Un audio de WhatsApp dice que quieres prohibir las terrazas. Lo desmientes con calma, plano entero y sin música de suspense' },
      },
    },
    crisis: {
      eyebrow: 'CAPÍTULO 5 · CRISIS',
      title: (state, ctx) => ctx.contradiction ? 'Alguien guardó el vídeo en el que lo prometías todo.' : 'Nueve segundos recortados han llegado antes que la verdad.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Una cuenta anónima ha juntado tu «todo para el lunes» con tu programa: música de tráiler, letras amarillas y «MIENTE». Kevin Lupa, de Se Acabó La Siesta, lo comparte: «Solo pregunto».'
        : 'Circula un clip de nueve segundos cortado justo antes de que dijeras lo que cuesta tu propuesta. Kevin Lupa, de Se Acabó La Siesta, lo emite en bucle: «Compártelo antes de que lo borren».'} La tía Puri lo ha reenviado al grupo familiar sin reconocerte.${state.memories.nicoPromise ? ' Y la Reme ha mandado un audio: sigue sin cita.' : ''} Previsión actual: <b>${ctx.forecast.score}/100</b>. Se necesitan ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Dar la cara: reconocer el error y corregirlo', flavor: (state, { rivals }) => `Vídeo sin música, sin filtro y sin «se ha malinterpretado». ${rivals.populist.name} lo llamaría rectificar; tú lo llamas pedir perdón` },
        team: { title: 'Publicar costes y responsables', flavor: 'Lola sube las cuentas; Nico, quién hace qué. Aburrido, comprobable e imposible de recortar a nueve segundos' },
        distract: { title: 'Sortear una freidora de aire', flavor: 'Para participar: seguir la cuenta, mencionar a tres amigos y olvidar el tema. Funciona en todas partes menos en la panadería' },
        blame: { title: 'Culpar a los bots y a la máquina del fango', flavor: 'Funciona con quien ya te seguía. Los demás reconocen la frase: la han oído en todos los telediarios' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTULO 5 · EL DEBATE', title: 'Tres rivales, un atril vacío y un streamer en el pasillo.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `A un lado, ${tech.name}, del ${tech.party}, con un periódico subrayado y la calma de quien espera turno desde hace años. Al centro, ${populist.name}, del ${populist.party}, que defiende con pasión lo que criticaba en marzo.${hard ? ` Al fondo, ${hard.name}, de ${hard.party}, con el caballo en doble fila.` : ''} ${moderator} te mira: «¿A qué renuncia su programa?».`,
      choices: {
        tradeoff: { title: 'Defender la renuncia concreta', flavor: (state, { rivals }) => `Dices qué pierdes y a quién molestas. ${rivals.tech.name} pide «un dato». Se lo das. Lo subraya en su periódico` },
        attack: { title: (state, { rivals }) => `Atacar al ${rivals.tech.party}`, flavor: 'Sacas su vídeo de veinte segundos paseando por un polígono. Aplauso fácil, recorte fácil, cero propuestas' },
        manage: { title: 'Dar turnos y desmontar cifras con calma', flavor: (state, { rivals }) => `Cuando ${rivals.populist.name} presume de que con su tope «no sube ningún alquiler», preguntas cuántos quedan anunciados. Silencio. ${rivals.hard ? `${rivals.hard.name} aplaude, sin que nadie se lo pida` : 'Agua'}` },
        promise: { title: 'Prometer topar el alquiler a la mitad «el primer mes»', flavor: (state, { rivals }) => `El público aplaude. ${rivals.populist.name} te mira con envidia profesional. ${rivals.moderator} levanta una ceja que se oye` },
      },
    },
    finalPrep: {
      eyebrow: 'CAPÍTULO 6 · ÚLTIMA VUELTA', title: 'Dos días y poca batería.',
      intro: (state, ctx) => `Previsión: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'por encima' : 'por debajo'} del umbral). Quedan dos días. En la tele, Fox anuncia otro portazo, Sumandos un Observatorio del Voto Indeciso y Podríamos «papeles y paguita para todo el que llegue», con el «quién paga» en un asterisco diminuto. Solo hay tiempo para una cosa bien hecha.`,
      choices: {
        listen: { title: 'Visitar a quienes aún dudan', flavor: state => `La parada del autobús, la cola del centro de salud y el rellano de la Reme${state.memories.nicoAssembly || state.memories.nicoInvite ? '. La asamblea del portal te pide que vuelvas' : ''}. Escuchas más de lo que hablas y no grabas nada` },
        receipts: { title: 'Publicar el presupuesto definitivo', flavor: 'Lola lo imprime en A3 y lo cuelga en la panadería, que tiene más tráfico que la web. «La transparencia también es tamaño de letra»' },
        volunteers: { title: 'Ordenar voluntarios y colegios', flavor: state => `Nico reparte turnos, bocadillos y un mapa de colegios dibujado en una servilleta${state.memories.pacoLucia ? '. Lucía, la camarera nueva de Paco, se apunta de interventora' : ''}` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTULO 6 · EL ÚLTIMO MITIN', title: 'Una frase antes del silencio electoral.',
      intro: 'Sillas plegables, un globo que se desinfla despacio, una periodista con cara de tercer mitin y Dani con el directo abierto. Puedes cerrar con lo aprendido o volver a prometerlo todo.',
      choices: {
        account: {
          title: state => ({
            shade: '“Habrá árboles y habrá menos coches. Esto elegimos, esto cuesta y aquí responderemos.”',
            parking: '“El barrio podrá trabajar, aunque este verano siga sin árboles. Esto elegimos y aquí responderemos.”',
            festival: '“Habrá cultura y habrá ruido pactado. Esto elegimos, esto cuesta y aquí responderemos.”',
            housing: '“Habrá grúas, polvo y pisos nuevos. Tardará. Costará. Y aquí responderemos.”',
          }[state.proposal] || '“Esto elegimos, esto cuesta y aquí responderemos.”'),
          flavor: 'Lo dices mirando a Marisa. Nadie lo graba. Marisa asiente una vez, que en la panadería equivale a un millón de likes',
        },
        viral: { title: '“¡Seis, siete! ¡Seis, siete!”', flavor: 'Dani lo emite en directo. Se corea. Por primera vez en la campaña, todo el mundo entiende exactamente lo mismo: nada' },
        everything: { title: '“Mañana habrá de todo para todos.”', flavor: (state, { rivals }) => `Aplauso enorme. Lola se tapa la cara con el presupuesto. ${rivals.populist.name} empieza a seguirte` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'NOCHE ELECTORAL · VICTORIA', title: 'Tendencia en el barrio.',
      text: state => `Marisa aplaude una vez. Lola pregunta quién guardó las facturas. Paco apaga la tele a mitad de una tertulia y nadie protesta. El Bloque Bisagra ya ha llamado para preguntar qué tenéis que se pueda pedir. ${{
        shade: 'Mañana empieza lo difícil: plantar los árboles antes de que alguien proponga un observatorio para estudiarlos.',
        parking: 'Mañana empieza lo difícil: el primer agosto sin árboles con tu nombre en la placa.',
        festival: 'Mañana empieza lo difícil: la primera reunión con los del primero, que ya han traído tapones para ti.',
        housing: 'Mañana empieza lo difícil: la primera licencia. Si sale en meses y no en años, será viral sin bailar.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NOCHE ELECTORAL · DERROTA', title: 'Más visualizaciones que votos.',
      reasons: {
        support: 'Faltó apoyo directo: el barrio te vio más en la pantalla que en el portal.',
        credibility: 'Las contradicciones pesaron: alguien juntó tus vídeos y los vídeos no coincidían.',
        organization: 'El equipo llegó desordenado: un colegio sin interventor, otro con tres y el grupo de WhatsApp silenciado.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: 'MINIJUEGO · HAZLO VIRAL', title: 'Grabando en vertical.', goWord: '¡Grabando!',
      lanes: ['Hola, gente', '¡Arriba!', 'Palmas', 'Ni idea'],
      takes: {
        explain: 'Pizarra de Lola, plano fijo; cada gesto subraya un coste.',
        chairs: 'El baile de las sillas de Paco. Paco mira con los brazos cruzados y exige no salir en plano.',
        neighbor: 'Marisa habla; tú marcas el ritmo detrás, discretamente. Ella no sabe que esto es vertical.',
        debunk: 'Desmontas el audio del bulo con gestos claros: esto no, esto sí, esto cuesta.',
      },
      intro: (state, ctx) => `Móvil en el trípode, vecinos mirando y Dani contando hacia atrás. ${ctx.take} Haz cada pose cuando su icono llegue al círculo. El ritmo suma alcance, no votos.`,
      titles: { great: '¡Viral! Kevin Lupa ya dice que eres un montaje.', ok: 'Se comparte en tres grupos de WhatsApp. Uno es el de la familia.', bad: 'Lo ha visto tu madre. Dos veces. En el autobús, con el volumen a tope.' },
      texts: { ok: 'Dani ya pone subtítulos en amarillo. La toma vale: el alcance abre puertas, pero los votos se ganan en el portal.', bad: 'Te has perdido entre el saludo y las palmas. Repite la toma: internet no ha visto nada (todavía).' },
    },
    duel: {
      eyebrow: 'MINIJUEGO · DUELO DE RÉPLICAS', title: 'Cuatro preguntas, un cronómetro y un streamer.',
      intro: (state, ctx) => `${ctx.rounds} réplicas. Elige la respuesta que defiende algo concreto y asume su coste, antes de que se acabe el tiempo. A mitad, alguien te interrumpirá: pide la palabra.`,
      rounds: state => {
        const m = state.memories || {};
        return [
          { topic: 'Vivienda', role: 'populist', claim: 'Nuestro tope funciona: no ha subido ni un alquiler. Tampoco se ha alquilado ninguno, pero los que no existen están baratísimos.',
            options: ['Un tope sin pisos es un escaparate vacío. Hay que construir, y tarda. Prometemos menos y lo firmamos.', '¡Pues yo los topo a cero! ¡Pisos gratis y con terraza!', 'Usted cambia de opinión más que de foto de perfil. Y peor encuadrada.'], correct: 0 },
          { topic: 'Bulos', role: 'tech', claim: 'Como decía esta mañana un periódico, en su plaza ya hay sombra de sobra. Lo pone aquí, en la página de opinión.',
            options: ['Y en la de deportes pone que usted ganó las de antes.', 'Bueno, los datos son relativos, como todo en la vida.', 'Enseñe la fuente. La nuestra: las cuentas de Lola, página dos, y fotos del banco a las cinco de la tarde.'], correct: 2 },
          { topic: 'Su propuesta', role: 'moderator', claim: 'Minuto de oro, versión exprés: ¿a quién perjudica su propuesta? Diez segundos. Empiezan ya.',
            options: ['A nadie. Es una propuesta sin perdedores, como los sorteos de influencer.', PROPOSAL_COST[state.proposal] || 'A alguien seguro. Lo diremos con nombre y apellidos cuando lo sepamos.', 'A los de siempre, que ya saben quiénes son.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'La promesa', role: 'populist', claim: '¡Usted le prometió a una panadera sombra, aparcamiento y un piso para su sobrino! Lo tengo en vídeo. Y esto no es un bulo.',
                options: ['Es verdad. Me equivoqué al prometerlo todo; luego elegí una cosa y expliqué lo que cuesta.', 'Eso es un montaje hecho con inteligencia artificial.', 'Usted también promete. Empate técnico.'], correct: 0 }
            : { topic: 'Sanidad', role: 'tech', claim: '¿Y la sanidad? ¿O a usted solo le importa su plaza con su banquito? Se lo pregunto con sentido común.',
                options: ['Prometo que mañana no hay listas de espera. Lo juro por mis seguidores.', 'Nos importa. Por eso no prometemos lo que no gestionamos: llevaremos el caso de la Reme al pleno, con nombre.', 'De sanidad no hablo sin mi community manager.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: '¡Perdone! Eso es un bulo de la máquina del fango. Lo sé por el tono.',
        tech: 'Si me permite, como decía esta mañana un periódico… un momento, que busco la página…',
        moderator: 'Le quedan pocos segundos. Menos. Queda dicho que ninguno.',
        fallback: '¡Perdone, perdone!',
      },
      floor: 'Déjeme terminar, por favor. Esto no es un directo.',
      floorBabble: 'Déjeme terminar',
      reactions: {
        timeout: 'Se acabó el tiempo. Pasamos de bloque, que la jarra se calienta.',
        quick: 'Respuesta concreta y a tiempo. Queda dicho.',
        slow: 'Concreta, aunque justita de tiempo.',
        wrong: 'Gracias por darme la razón. Lo recorto y lo subo.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} asiente. Dos veces. Queda dicho.`, mid: 'Has aguantado el tipo. Y el ratio.', low: 'Los rivales ya están recortando tus respuestas.' },
      text: 'La estrategia que elegiste marca el debate; las réplicas deciden si se te cree.',
    },
    chairs: {
      eyebrow: 'MINIJUEGO · SEIS SILLAS', title: 'Paco presta las sillas. Tú las cargas.',
      intro: (state, ctx) => `Para la última asamblea en la plaza hacen falta seis sillas, repartidas por todo el barrio. Pasa por encima de una para cogerla y llévala al corro marcado. Una a una: no hay aplicación que te las traiga. Tienes ${ctx.time} segundos.`,
      hints: {
        start: 'Pasa por encima de una silla para cogerla.',
        carry: 'Ahora, al corro amarillo.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. A por la siguiente.`,
        full: '¡Corro completo! Sin gastos de envío.',
      },
      titles: { all: 'Seis sillas, cero excusas.', mid: 'Medio corro. Los demás, de pie y mirando el móvil.', low: 'Paco recoge las sillas él mismo. Y lo comenta en la barra.' },
      texts: { all: 'Nico apunta el tiempo en la servilleta. Organizar es esto: que haya sitio cuando llegue la gente.', other: 'Las que faltan siguen por la plaza. Puedes repetir: nadie lo ha grabado, salvo Paco.' },
    },
    rally: {
      eyebrow: 'MINIJUEGO · EL ÚLTIMO MITIN', title: 'Que no se te vaya la sala al móvil.', goWord: '¡Habla!', lane: 'Remata la frase',
      intro: 'Cada frase tiene un remate. Pulsa cuando la palabra llegue al círculo: el público aplaude y levanta la vista. Si fallas, alguien vuelve al móvil. O peor: te graba.',
      phrases: state => {
        const own = {
          shade: ['Este verano, la plaza tendrá', 'SOMBRA'], parking: ['Quien trabaja en este barrio podrá', 'DESCARGAR'],
          festival: ['Los chavales tendrán un local y la plaza,', 'CULTURA'], housing: ['El solar de la esquina dejará de ser solar: habrá', 'PISOS'],
        }[state.proposal] || ['Una cosa bien hecha, para', 'EMPEZAR'];
        return [
          ['Buenas noches, salón multiusos. Gracias por venir en persona y por traer', 'SILLA'],
          ['No vengo a prometeros la luna. Eso ya lo hace el', 'ALGORITMO'],
          own,
          ['Y sí: tiene un coste. Lo hemos puesto por', 'ESCRITO'],
          ['Lola lo ha calculado, Nico lo ha repartido y Dani lo ha', 'SUBIDO'],
          ['Para hacerlo no hemos creado ni un solo', 'OBSERVATORIO'],
          ['Si no lo cumplimos, ya sabéis dónde está la', 'PANADERÍA'],
          ['Lo que os prometo no cabe en un vídeo de nueve', 'SEGUNDOS'],
          ['El domingo no os pido un like: os pido que', 'VOTÉIS'],
          ['A quien queráis. Pero que no decida el', 'SOFÁ'],
          ['Tía Puri, si me estás oyendo: esto no es un', 'BULO'],
          ['¡Pues me', 'PRESENTO!'],
        ];
      },
      titles: { great: 'La sala en pie. Y ni un móvil en alto.', ok: 'Aplausos sinceros y algún scroll.', bad: 'Se ha oído un vídeo de gatos. Y luego otro.' },
      text: 'El público recordará cómo lo dijiste; lo que decidiste decide qué recuerda.',
    },
  },
};
