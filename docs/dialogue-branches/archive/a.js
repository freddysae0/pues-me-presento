// Rama A del guion · «Costumbrismo electoral». Sobrescribe cualquier clave de actual.js; lo que falte cae en actual.
// Lee el encabezado de actual.js: esquema, funciones (state, ctx) y restricciones que comprueban las pruebas.
// Objetos se fusionan clave a clave; arrays y funciones se reemplazan enteros.
// Para validar la rama: npm.cmd test (tests/script.test.js). Para probarla: menú principal → Guion, o ?guion=a.
// Proceso y crítica por iteraciones: docs/dialogue-branches/A.md.

export const meta = { label: 'A · Costumbrismo electoral', pitch: 'La campaña de verdad, vista desde la cola del pan: farolas con cuatro carteles, mesas por sorteo y un sondeo que se hace pidiendo barra.' };

const COST = {
  shade: 'A quien aparca en doble fila y a dos mesas de la terraza de Paco. Sombra a cambio de coches, dicho claro.',
  parking: 'Al banco al sol: otro verano sin árboles. Elegimos que el barrio pueda trabajar.',
  festival: 'A los del primero, dos noches por semana. Horario pactado y tapones de regalo. Literalmente.',
  housing: 'A los del «aquí no se construye» y a quien quería un tope para la foto. Y tarda más de una legislatura.',
};

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: 'Fermín Aguardo', party: 'Partido Paciente' },
    populist: { name: 'Nuria Giro', party: 'Partido Sobrevivo Otra Elección' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Maite Escaleta',
  },

  // Tercer atril del debate (lo conecta el coordinador; el merge tolera la clave). role 'hard' = Fox.
  foxDebate: {
    hallLine: 'Yo he venido a caballo. Ella ha venido con su programa de hace cuatro años, pero al revés.',
    interruption: 'Sorry, pero eso es ideología. Se lo digo sin complejos y en inglés, que es como se dice ahora lo de siempre.',
    round: { topic: 'Seguridad', role: 'hard', claim: 'Al chaval que robó a su panadera lo han soltado cuatro veces. ¿Qué propone usted? ¿Otra fiesta?',
      options: ['Eso es culpa del sistema, no del chaval. Hablemos de las causas.', 'Que reincidir no salga gratis: juicio rápido y pedirlo con nombre en el pleno. Tarda, no cabe en un eslogan y no lleva caballo.', '¡Muro, caballo y Make Barrio Great Again!'], correct: 1 },
    reactions: {
      right: 'Mire usted: un vecinal que dice «juicio rápido» sin subirse al caballo. Me lo apunto.',
      wrong: 'Eso, eso: la culpa es del sistema. Siga así, que me hace usted la campaña.',
      timeout: 'Mientras usted piensa, la España que madruga ya se ha acostado.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'CAMPAÑA ELECTORAL DE BARRIO',
    tagline: 'Una farola con cuatro carteles, las sillas del bar y una panadera que acierta más que el sondeo oficial.',
  },

  chapters: ['Pues me presento', 'La sede es mi salón', 'Bajar a la plaza', 'Hazlo viral', 'Eso no fue lo que dije', 'Antes de la reflexión'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'Un vídeo más y lo dejo', objective: 'El móvil vibra en la mesita, junto al sofá. Pulsa E.' },
    call: { title: 'Convocatoria urgente del grupo', objective: 'Usa el portátil de la mesa para llamar a tus amigos.' },
    register: { title: 'Un nombre para la papeleta', objective: 'Ve a la carpeta del escritorio y registra el partido.' },
    leave: { title: 'A pie de calle', objective: 'Sal por la puerta verde y baja a la plaza.' },
    neighbor: { title: 'El sondeo de la cola del pan', objective: 'Habla con Marisa, junto al toldo de la panadería. Paco, en la terraza del bar, también tiene cosas que contar.' },
    program: { title: 'Una cosa, bien hecha', objective: 'Elige tu primera propuesta en el tablón de la plaza.' },
    speech: { title: 'Subirse al cajón', objective: 'Sube al punto del atril y da tu primer discurso.' },
    aftermath: { title: 'Lo que se comenta en la cola', objective: 'Vuelve con Marisa para saber qué se dice de ti.' },
    hqBrief: { title: 'La sede es mi salón', objective: 'Reúne al equipo en la mesa de campaña. Lola, Dani y Nico también quieren hablar contigo.' },
    video: { title: 'Hazlo viral (en quince segundos)', objective: 'Graba un vídeo en la marca junto a la panadería.' },
    crisis: { title: 'Eso no fue lo que dije', objective: 'Afronta la crisis en el tablón. Antes, quizá convenga oír al equipo.' },
    debate: { title: 'El debate a cinco', objective: 'Entra en el salón multiusos y ocupa tu atril.' },
    finalPrep: { title: 'Última vuelta al barrio', objective: 'Elige en el mapa dónde concentrar el último esfuerzo.' },
    finalSpeech: { title: 'El último mitin antes de la reflexión', objective: 'Cierra la campaña ante el público.' },
    election: { title: 'La noche de las sillas plegables', objective: 'Consulta el escrutinio.' },
    complete: { title: 'Campaña completada', objective: 'Urnas cerradas. Sillas devueltas.' },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: 'Sombra antes que discursos', cost: '2 de presupuesto', benefit: 'Árboles, toldos, una fuente que funcione y el bajo vacío de la esquina como sala fresca para los mayores en las olas de calor.', compromise: 'Se pierden plazas de aparcamiento, la terraza de Paco encoge dos mesas y la furgoneta del sobrino de Marisa tendrá que buscarse la vida.' },
    parking: { title: 'Que el barrio pueda trabajar', cost: '2 de presupuesto', benefit: 'Zona de carga y descarga con horario, plazas rotatorias para el comercio y aparcabicis para repartidores. Sin tasas nuevas.', compromise: 'Más coches en la plaza y otro verano a pleno sol. El banco seguirá hirviendo en agosto.' },
    festival: { title: 'Fiestas todo el año', cost: '2 de presupuesto', benefit: 'Escenario para grupos del barrio, cine de verano y un local de ensayo para que los chavales tengan algo más que el portal.', compromise: 'Ruido dos noches por semana: los del primero, con tapones. La sombra y la carga y descarga, al cajón.' },
    housing: { title: 'Grúas en el solar, llaves en el tercero', cost: '2 de presupuesto', benefit: 'Licencia para el solar de la esquina en meses y no en lustros, y desalojo ágil de okupaciones, para que quien tiene un piso cerrado se atreva a alquilarlo por años.', compromise: 'Ni tope ni titular fácil: una grúa tarda más que un decreto, te caen encima los del «aquí no se construye» y la plaza sigue sin sombra.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'Las cuentas, por escrito', line: 'Trabajo en una gestoría: sé lo que es un plazo del BOE y lo que pesa un recibo. Te llevo las cuentas. Pero si alguien dice «esto se paga solo», cuelgo.', choices: [
      { label: 'Tesorería. Y la última palabra sobre cada euro.', reply: 'Acepto. Primera medida: el pedido de croquetas deja de llamarse «gasto en tejido asociativo».' },
      { label: 'Estrategia. Que alguien piense antes de pegar carteles.', reply: 'Vale. Primera regla estratégica: no prometer nada que no quepa en una hoja de cálculo. Ni en dos.' },
    ] },
    dani: { role: 'Quince segundos de fama', line: 'Hago vídeos para una clínica dental, un gimnasio y un señor de colchones. Sé dejar un mitin en quince segundos. Lo haría gratis. Bueno, gratis menos la cuota de autónomos, que esa no perdona.', choices: [
      { label: 'Comunicación. Sin comprar seguidores.', reply: 'Perfecto. Los primeros serán mi madre y sus tres cuentas. Una es del perro, pero el perro comenta mucho.' },
      { label: 'Portavoz. Te toca dar la cara en el telediario.', reply: '¿Yo, en la tele local, con rótulo y todo? Mi abuela lo va a grabar con el móvil apuntando a la pantalla.' },
    ] },
    nico: { role: 'Conoce a todo el portal', line: 'Turnos rotativos en un almacén y me sé el nombre de todos los perros del barrio. Yo movilizo. Pero las reuniones acaban antes de que cierre la ferretería.', choices: [
      { label: 'Organización. Tú pones horarios y carteles.', reply: 'Hecho. Esta noche, pegada de carteles: cubo, brocha y engrudo. Como antes, que el celo no aguanta una campaña.' },
      { label: 'Actos. Necesitamos tu voz de megáfono.', reply: 'Una vez grité «¿de quién es el Seat?» y bajaron cuatro plantas. Dos no tenían Seat. Eso es poder de convocatoria.' },
    ] },
  },

  call: {
    title: '¿Montamos un partido? ¿En serio?',
    you: 'Ha tenido una idea',
    next: 'Siguiente valiente',
    done: 'Ya tenemos equipo. Solo falta todo lo demás: nombre, carteles y que nos vote alguien que no sea nuestra madre.',
    doneBabble: 'Ya tenemos equipo.',
    finish: 'Nos vemos en la plaza',
  },

  register: {
    eyebrow: 'FUNDACIÓN · REGISTRO DE PARTIDOS',
    title: 'Un nombre para la papeleta.',
    stamp: 'PENDIENTE DE SELLO',
    intro: 'Tres campos y ninguno pide certificado digital. Lola lo revisa dos veces: no se fía de un trámite que se entiende a la primera.',
    defaultName: 'Agrupación Vecinal La Cola del Pan',
    defaultSlogan: 'Una cosa. Bien hecha.',
    submit: 'Registrar candidatura',
    toast: 'REGISTRADO. Ya salís en el BOE, entre una subvención a la trufa y un cese.',
  },

  program: {
    eyebrow: 'PROGRAMA · PRESUPUESTO: 2 CRÉDITOS',
    title: 'Una cosa. La que sea, pero una.',
    intro: 'El presupuesto da para una propuesta. Las demás van al cajón de las promesas, que en este país es el mueble más grande de cualquier casa.',
    promisedBothNote: 'En la cola del pan ya se sabe que prometiste sombra, aparcamiento y piso para el sobrino. Ninguna opción paga todo eso: −6 de credibilidad al concretar.',
    toast: (state, ctx) => `Programa: ${ctx.proposal.title}. Ahora toca explicarlo encima del cajón.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ['Un cajón de fruta y siete vecinos.', 'Lo que vas a defender.', 'Cómo te despides.'],
    parts: {
      opening: { title: '01 / Romper el hielo', prompt: 'Siete personas. Dos esperan el autobús, una ha bajado a por el pan y otra te graba por si te caes.', options: {
        listen: 'Vengo a escuchar. Y luego, si me dejáis, a hablar poco.',
        joke: 'Tranquilos: seré más breve que una legislatura. Que tampoco es decir mucho.',
        grand: '¡Hoy empieza una nueva era para España, para Europa y para la calle de atrás!',
      } },
      argument: { title: '02 / Decir algo concreto', prompt: 'Toca defender lo que has clavado en el tablón. Marisa ha dejado de despachar para oírte.', options: {
        shade: 'Sombra y un sitio fresco para los mayores, aunque perdamos aparcamiento.',
        parking: 'Que quien trabaja pueda descargar, aunque la plaza siga sin árboles.',
        festival: 'Fiestas y un local para los chavales, con horario de ruido pactado.',
        housing: 'Grúas en el solar y llaves en el tercero: más pisos, no más topes. Tardará, y algún vecino dirá que le tapan el sol.',
        everything: '¡Árboles, aparcamiento, fiestas y un piso para cada uno, gratis y para el lunes!',
      } },
      close: { title: '03 / Saber acabar', prompt: 'Marisa mira el reloj de la panadería. Es un reloj con opiniones.', options: {
        accountable: 'Si no lo cumplimos, venid a pedírnoslo aquí. Ya sabéis dónde está la panadería.',
        chant: '¡Este barrio no se calla! …Bueno, a partir de las once, sí.',
        forever: 'Para concluir, y brevemente, mis siguientes veintisiete puntos…',
      } },
    },
    timing: { eyebrow: '04 / DARLE EL GOLPE FINAL', title: 'Ahora. Con convicción.', button: '¡Y por eso me presento!' },
    result: {
      eyebrow: 'EL BARRIO HA ESCUCHADO',
      goodTitle: 'Un aplauso. Y alguien guarda el móvil.',
      badTitle: 'Una paloma se ha ido. No parecía indecisa.',
      coherent: 'Has defendido tu propuesta y dicho lo que cuesta. Aquí eso se oye poco y se recuerda mucho.',
      incoherent: 'Tu discurso no cuadra con tu tablón. Se habla de ti, pero como se habla del vecino que no recoge al perro.',
      fine: 'El alcance mide atención, no votos. Las consecuencias dependen de lo que has dicho.',
      button: 'Bajar del cajón',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: '¿Tú eres el del partido? Mira, aquí el sondeo se hace en la cola: si piden barra, todo sigue igual; si piden integral, quieren cambio. Hoy, todo barras.' },
      { speaker: 'Marisa', text: 'Mi sobrino reparte en furgoneta y no tiene dónde parar. Treinta y cuatro años, en su cuarto de pequeño. Y en el tercero ya no vive nadie: hay una caja de llaves en la puerta. ¿Por dónde empiezas?', choices: [
        { text: 'Por escucharte. ¿Qué te quita el sueño a ti?', memory: 'listened', response: 'Mi madre: especialista para dentro de meses. Y un banco con sombra para esperar sin tener que pedir un café. No es el programa espacial, cariño.' },
        { text: 'Por todo: sombra, aparcamiento y un piso para tu sobrino.', memory: 'promisedBoth', response: 'Todo, ¿eh? Como el de la farola, el del cartel de hace cuatro años. Ya no se le ve la cara, pero la promesa se lee perfecta.' },
        { text: 'Por hacer ruido: unas fiestas que nos pongan en el mapa.', memory: 'spectacle', response: '¿En el mapa? Ya salimos en todas las webs de pisos por días: «barrio auténtico». Lo único auténtico que queda soy yo, y abro a las siete.' },
      ] },
      { speaker: 'Marisa', text: 'Ahí tienes el tablón. Da para una cosa, una. Luego lo cuentas en el cajón, y sin «poner en valor», que aquí lo único que se pone es la masa en el horno.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'Prometiste sombra, aparcamiento y piso. Lo ha oído la cola entera, y la cola tiene mejor memoria que la hemeroteca.'
        : m.listened ? 'Antes me has escuchado. Se nota quién viene con el argumentario aprendido. Tú no traías ni argumentario, y mira, se agradece.'
        : m.spectacle ? 'Lo de las fiestas lo ha oído todo el barrio. Bueno, el del tercero no: vive en otra ciudad y abre la puerta con una aplicación.'
        : 'Ya has bajado del cajón. Te temblaban menos las piernas que al del año pasado, y el del año pasado era el cartero.';
      const coherent = {
        shade: 'Has dicho que quitas coches para poner sombra. Mi sobrino te odiará dos semanas. Mi madre te vota. Por correo, que en agosto no sale.',
        parking: 'Has elegido la furgoneta antes que los árboles. Mi sobrino te convida a una caña. Yo, en agosto, te planto la sombrilla de la playa en la puerta.',
        festival: 'Fiestas con horario y el ruido dicho a la cara. Los del primero se quejarán igual, pero por lo menos no los has engañado.',
        housing: 'Lo del solar y el tercero. No has prometido bajar precios por decreto: has dicho que hay que hacer casas. Fíjate qué rareza, oír eso en un cajón.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'No estoy de acuerdo en todo. Pero has dicho qué cuesta y a qué renuncias. Eso se agradece.')
        : speech.picks?.[1] === 'everything' ? 'Árboles, coches, fiestas y pisos para el lunes. Eso no es un programa, cariño: es la carta a los Reyes. Y aquí todos sabemos quién paga a los Reyes.'
        : 'El tablón decía una cosa y tú has dicho otra. En la tele a eso lo llaman «matizar». En la cola lo llamamos de otra manera.';
      const closing = m.pacoLucia ? 'Y dice Paco que le has buscado camarera. Ya tienes partido, equipo y un voto en la terraza. Ahora, que te reconozcan sin el cartel.'
        : (speech.reach || 0) >= 12 ? 'Dani dice que tu vídeo lo han visto miles. Aquí lo han visto doce, y las doce votan en este colegio. Tú verás a quién le hablas.'
        : 'Venga. Ya estás en política: tienes partido, equipo y una panadera que te mira de reojo.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: «Las sillas, plegadas y contadas. Yo, buscando una excusa para la mesa electoral».'
        : s.memories.pacoLucia ? 'Paco: «Lucía ya tira las cañas mejor que yo. Lo que no consigue es librarme de la mesa, jefe».'
        : 'Paco: «Lo dicho: cuánto cuesta. Y si sabes de una excusa para no ir de vocal, me la apuntas».',
      lines: [
        { speaker: 'Paco', text: 'Paco, bar La Última. Lema de la casa: «una y nos vamos». Treinta años y nadie ha cumplido un programa tan corto. ¿Qué te pongo?', choices: [
          { text: '¿Qué le pedirías tú a un partido nuevo?', memory: 'pacoHeard', response: 'Que diga lo que cuestan las cosas. Y si no lo sabe, «no lo sé». Treinta años con esa tele puesta y no lo he oído ni una vez.' },
          { text: '¿Nos prestas unas sillas para el acto?', memory: 'chairs', response: 'Las plegables. Las mismas que les presté a los de la gaviota y a los de la rosa. Las sillas no votan, jefe: se dejan.' },
          { text: '¿Cómo va el negocio?', memory: 'pacoRent', response: 'Lleno hasta arriba y me queda menos que nunca. Entre local, luz y papeles, el que más gana en este bar no pone cafés: es la ventanilla.' },
        ] },
        { speaker: 'Paco', text: 'Y mira ese cartel: «Se busca camarero». Colgado desde Semana Santa. Ya tiene más antigüedad que la tragaperras.', choices: [
          { text: '¿Has probado a pagar más?', memory: 'pacoWages', response: 'Lo he probado, jefe. Le subo el sueldo y a ella le llega la mitad de la subida. La otra mitad se la queda un socio que no friega.' },
          { text: 'Es que los jóvenes ya no quieren trabajar.', memory: 'pacoBlame', response: 'Eso decía yo. Mi sobrina, la del máster, tira pintas en Dublín. Trabajar quiere. Lo que no quiere es pagar una habitación con el sueldo entero.' },
          { text: 'Lucía, la estudiante de la fuente, busca algo para los findes.', memory: 'pacoLucia', response: '¿La de los apuntes de colores? Que venga. Contrato, horario por escrito y tortilla. Mira: has juntado a dos personas sin crear un observatorio.' },
        ] },
        { speaker: 'Paco', text: 'Y te dejo, que me ha llegado una certificada: vocal de mesa. «Tener un bar» no vale de excusa. Ya lo he preguntado. Dos veces.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'El tablón está ahí. Elige una, cariño. Dos ya es un pacto, y de pactos todavía no sabes.',
        speech: 'Sube al cajón ya, que se enfría el pan y se enfría la gente.',
        video: 'Al chaval que me robó la caja lo han soltado otra vez. Es la cuarta. Ya nos saludamos. Si vas a grabar algo, grábale a él, que sale más que tú.',
        finalPrep: 'Última vuelta, ¿eh? Pásate por la cola de Correos: votan por correo, tienen una hora por delante y quejas para dos.',
      }[s.mission] || 'Yo aquí, con el horno. Tú a lo tuyo, que la cola también vota.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: «Estoy cuadrando. No me hables si no es en euros y con el IVA desglosado».', lines: [
        { speaker: 'Lola', text: 'La crisis tiene algo bueno: por fin alguien lee mis hojas de cálculo. Con lupa y con mala leche. Como Hacienda, pero sin modelo 303.', choices: [
          { text: 'Publícalas. Todas.', memory: 'lolaBooks', response: 'Todas, con tíquets escaneados. Si nos pillan, que sea por un redondeo de siete céntimos. Lo pondré en negrita: siete.' },
          { text: 'Mejor esperamos a que pase.', memory: 'lolaWait', response: 'Las crisis no pasan: se archivan. Y siempre hay alguien que las desarchiva el jueves antes de votar. Te lo dejo por escrito.' },
        ] },
      ] },
      default: { after: 'Lola: «Pestaña nueva: “Promesas que no pagamos”. Lleva doce filas y una fórmula rota».', lines: [
        { speaker: 'Lola', text: 'Hoja de cálculo: «Campaña_DEFINITIVA_v3_ahora_sí». Ingresos: el bote del grupo y cuarenta euros que Dani debe desde una cena que nadie recuerda.' },
        { speaker: 'Lola', text: 'Gastos: pizzas, imprenta y una factura de «estrategia digital» del primo de Dani. Concepto: «abrir una cuenta». ¿La pago?', choices: [
          { text: 'Ni de broma. Todo con factura y todo publicado.', memory: 'lolaReceipts', response: 'Gracias. Si salimos en el telediario, que sea por aburridos. Es lo único que no ha probado ningún partido.' },
          { text: 'Págala, que el primo es majo.', memory: 'lolaCousin', response: 'Majo es. Así empiezan todos los partidos: con un primo majo. Te lo apunto en la pestaña «Titulares de dentro de cuatro años».' },
          { text: 'Oye, ¿y tú cómo llegas a fin de mes?', memory: 'lolaRent', response: 'Con dos opositores y un ficus. Toparon el alquiler y mi casero lo pasó a «temporada»: ahora firmo cada once meses. Por eso estoy aquí.' },
        ] },
        { speaker: 'Lola', text: 'Venga, a la mesa. Y nada de «esto se paga solo». Nada se paga solo: lo pagan siempre los mismos, y suelen estar en esta habitación.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: «Llevo cuatro horas contestando. El móvil me ha preguntado si estoy bien».', lines: [
        { speaker: 'Dani', text: 'Cuatrocientos comentarios. Doscientos bots, cien mi madre con sus tres cuentas y cien gente real muy enfadada. Literal.', choices: [
          { text: 'Contesta a los de verdad, uno a uno.', memory: 'daniReply', response: 'Uno a uno. Esto va a durar más que el escrutinio del Senado. Pásame café y no me mires el tiempo de pantalla.' },
          { text: 'Bloquea a todos y sube un meme.', memory: 'daniMeme', response: 'Hecho. El meme tiene más comentarios que el problema. Los partidos grandes lo llaman «cambiar el marco». Yo lo llamo salir corriendo.' },
        ] },
      ] },
      default: { after: 'Dani: «Estoy montando el corte de quince segundos. Me sobran trece».', lines: [
        { speaker: 'Dani', text: 'He estudiado el telediario. Sale un corte de quince segundos, y cuanto menos dices, más entra. El récord es un ministro diciendo «bueno».' },
        { speaker: 'Dani', text: 'Propuesta: te grabo con el filtro que te quita diez años y un audio en tendencia. ¿Sí o sí?', choices: [
          { text: 'Sin filtro. Que se vean las ojeras.', memory: 'daniNoFilter', response: 'Valiente. Las ojeras son lo último auténtico que queda en internet. Pocos likes, pero de gente que vota.' },
          { text: 'Con filtro y con el audio de moda.', memory: 'daniTrend', response: 'Así me gusta. Mañana nadie sabrá qué propones, pero todos sabrán que bailas fatal. Eso también es posicionamiento.' },
          { text: '¿Y tú qué tal, con tantos curros?', memory: 'daniJobs', response: 'Cuatro clientes y ninguna nómina. Autónomo: pago la cuota antes de cobrar la factura. Esta campaña es lo único que hago gratis y a gusto.' },
        ] },
        { speaker: 'Dani', text: 'Y una norma: nada de «hoja de ruta» ni «a día de hoy». Cada vez que lo dices, alguien se pasa a la abstención. Literal, lo he medido.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: «Estoy en la junta del portal. Media hora con el ascensor y todavía no hemos llegado a lo tuyo».', lines: [
        { speaker: 'Nico', text: 'Ha bajado Ernesto, el del tercero. Dice que si vamos contra él, nos denuncia. Y luego me ha pedido que le riegue las plantas en agosto.', choices: [
          { text: 'Invítale a la junta del portal. Que dé su versión.', memory: 'nicoInvite', response: 'Vale. Dice que alquilaba por años hasta que con lo del tope le salió más a cuenta el turista. Igual es más testigo que enemigo.' },
          { text: 'Ni caso. Es el enemigo.', memory: 'nicoEnemy', response: 'Enemigo… Es Ernesto, del colegio. Le debo un balón desde sexto. Pero bueno, tú mandas, que para eso sales en el cartel.' },
        ] },
      ] },
      default: { after: 'Nico: «Voy a reponer carteles. A uno le han pintado bigote. Por lo menos ya nos reconocen».', lines: [
        { speaker: 'Nico', text: 'Anoche, pegada de carteles. A las doce y un minuto, Fox nos tapó por arriba y Sobrevivo por abajo. Los del Paciente no vinieron: esperan su turno.' },
        { speaker: 'Nico', text: 'La Reme dice que vota a quien le consiga cita con el cardiólogo antes de Navidad. ¿Qué le digo?', choices: [
          { text: 'La verdad: que eso no se arregla en un mes, pero lo pelearemos.', memory: 'nicoTruth', response: 'Se lo digo. La Reme ha visto pasar nueve gobiernos y dos caderas. La verdad la va a apreciar. El voto, ya veremos.' },
          { text: 'Dile que sí. Cita en una semana.', memory: 'nicoPromise', response: 'Se lo digo. Pero la Reme apunta las promesas en el calendario de la farmacia, y en diciembre pasa revista. Con bastón.' },
          { text: 'Que venga a la junta del portal y lo cuente a todos.', memory: 'nicoAssembly', response: 'Hecho. Pongo el aviso al lado del de la derrama del ascensor. Es el único papel del portal que lee todo el mundo.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ['CAPÍTULO 1', 'Pues me presento'],
      tv: { headline: '¡ELECCIONES!', ticker: 'ÚLTIMA HORA · DISUELTAS LAS CORTES · CONVOCATORIA EN EL BOE' },
      subs: [
        [null, 'Domingo, 23:47. «Un vídeo más y lo dejo».'],
        ['Presentadora (TV)', 'Última hora: el Gobierno disuelve las Cortes. Habrá generales en cincuenta y cuatro días, como manda la ley.'],
        ['Presentadora (TV)', 'Los partidos ya graban vídeos en mangas de camisa. El Gobierno, además, crea un observatorio para seguir la convocatoria.'],
        [null, 'BZZZ. Cuarenta y tres mensajes del grupo. El primo de Dani ya ha hecho un meme.'],
        ['Tú', '¿Otra vez elecciones? …Pues, mira. A lo mejor.'],
      ],
      toast: 'El móvil vibra en la mesita, junto al sofá. Con insistencia de grupo familiar.',
    },
    plaza: {
      banner: ['EL BARRIO', 'Bajar a la plaza'],
      subs: [
        [null, 'La plaza: panadería, bar, una farola con cuatro carteles superpuestos y siete opiniones por metro cuadrado.'],
        ['Marisa', '¡Anda, el del tercero que no saluda! Ven, que en la cola ya se habla de ti. Mal, pero se habla.'],
        ['Paco', 'Si vas a salvar el país, empieza por la terraza: tengo dos mesas cojas.'],
      ],
    },
    hq: {
      banner: ['CAPÍTULO 2', 'La sede es mi salón'],
      subs: [
        [null, 'La sede: un salón, una mesa plegable, dos enchufes y un balcón para la noche electoral.'],
        ['Lola', 'Pasa. El sofá es la sala de prensa y la nevera, la tesorería. No abras la tesorería.'],
        ['Dani', 'He llamado al wifi «SedeNacional». A partir de aquí, todo es institucional.'],
        ['Nico', 'El balcón es para salir a celebrar. Antes hay que quitar las pinzas.'],
      ],
    },
    hall: {
      banner: ['CAPÍTULO 5', 'El debate a cinco'],
      subs: [
        [null, 'Salón multiusos. Hoy, debate a cinco: cuatro candidatos y un atril vacío. Mañana, zumba.'],
        ['moderator', 'Buenas noches. Bloques temáticos, dos cronómetros y una jarra de agua que nadie va a abrir.'],
        ['tech', 'Vengo con sentido común, gestión y el periódico de esta mañana. Se lo voy a leer.'],
        ['populist', 'Yo vengo a decir lo mismo que la última vez, pero corregido. Rectificar es de sabios.'],
      ],
    },
    victory: {
      banner: ['NOCHE ELECTORAL', '¡Victoria!'],
      verdict: '¡PASA DEL 48!',
      subs: [
        ['Periodista', 'Con todo escrutado, y antes de que nadie diga que ha ganado él…'],
        ['Tú', '¿Hemos ganado? ¿Nosotros? ¿Salimos al balcón?'],
        ['Ana', '¡Al balcón, pero recoged la ropa tendida, que sale en la tele!'],
      ],
    },
    defeat: {
      verdict: 'NO LLEGA AL 48',
      subs: [
        ['Periodista', '…y la candidatura vecinal se queda fuera. Aunque, como todos esta noche, dirá que ha ganado algo.'],
        ['Tú', 'Hemos ganado… experiencia. Y una mesa plegable.'],
        ['Berto', 'Oye, que la próxima te voto. Si me lo recuerdas. Y si no hay fútbol.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: 'CAPÍTULO 2 · LA SEDE ES MI SALÓN', title: 'Tres amigos, una mesa y un argumentario por escribir.',
      intro: state => `El sofá es la sala de prensa y la nevera, la tesorería. Hay tiempo para una prioridad de verdad; lo demás va al grupo de WhatsApp, donde las ideas se jubilan.${state.memories.nicoAssembly ? ' Nico ya ha pegado el aviso de junta junto al de la derrama del ascensor.' : ''}`,
      choices: {
        accounts: { title: 'Lola cuadra cada euro', flavor: 'Presupuesto a la vista, hasta el tíquet del engrudo. Menos tiempo para redes' },
        street: { title: 'Nico organiza pegada y puerta a puerta', flavor: 'Farola a farola y rellano a rellano, con la excusa de preguntar por la derrama' },
        content: { title: 'Dani monta un estudio en el pasillo', flavor: 'Aro de luz, sábana verde de croma y un micro de corbata que pita' },
        tenants: { title: 'Junta extraordinaria en el portal', flavor: 'Punto único: la campaña. Ruegos y preguntas: dos horas. Baja gente que no se hablaba desde lo de las humedades' },
      },
    },
    video: {
      eyebrow: 'CAPÍTULO 4 · HAZLO VIRAL', title: 'La marca está puesta. Falta decidir qué grabar.',
      intro: state => { const m = state.memories; return `Dani calcula tres segundos antes de que la gente deslice el dedo: menos que un anuncio de seguros. Y avisa: atención no es apoyo, o las elecciones las ganaría un gato.${m.daniNoFilter ? ' Hoy, sin filtro.' : m.daniTrend ? ' Dani ya ha elegido el audio. No preguntes.' : ''}`; },
      choices: {
        explain: { title: 'Explicar la propuesta y lo que cuesta', flavor: 'Un minuto, plano fijo y una pizarra con la letra de Lola' },
        chairs: { title: 'Bailar el trend del momento', flavor: 'Coreografía delante de la farola de los carteles. Nadie sabe qué propones; todo el mundo sabe que tropiezas en el segundo once' },
        neighbor: { title: 'Dejar hablar a Marisa', flavor: 'Habla del calor, del local y de la cita de su madre. Tú sujetas el móvil y te callas' },
        debunk: { title: 'Desmontar el bulo del día', flavor: 'Circula un montaje en el que quieres prohibir las terrazas. Lo desmientes con calma y con el plano entero' },
      },
    },
    crisis: {
      eyebrow: 'CAPÍTULO 5 · CRISIS',
      title: (state, ctx) => ctx.contradiction ? 'La cola del pan ha llegado antes que la prensa.' : 'Te han dejado en nueve segundos.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Alguien ha subido el momento en que lo prometías todo a la vez, con música de tráiler y título en mayúsculas. Marisa sale al fondo, cruzada de brazos.'
        : 'Circula un corte de nueve segundos, justo antes de que explicaras el coste. Parece que prometes lo contrario. Ya lo comentan en tres tertulias.'}${state.memories.nicoPromise ? ' Y la Reme ha llamado: sigue sin cita.' : ''} Previsión actual: <b>${ctx.forecast.score}/100</b>. Se necesitan ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Dar la cara y corregir', flavor: 'Vídeo sin música, sin filtro y sin «se ha sacado de contexto»' },
        team: { title: 'Publicar costes y responsables', flavor: 'Lola sube las cuentas; Nico, quién hace qué. Aburrido, comprobable y difícil de recortar' },
        distract: { title: 'Sortear un jamón entre los seguidores', flavor: 'Para participar: seguir la cuenta, mencionar a tres amigos y olvidar el tema' },
        blame: { title: 'Culpar a la máquina del fango', flavor: 'Bots, algoritmo y «los de siempre». Funciona con los tuyos; los demás reconocen el truco: lo usa todo el arco parlamentario' },
      },
    },
    debate: {
      eyebrow: 'CAPÍTULO 5 · EL DEBATE', title: 'Cinco atriles, un caballo y una jarra sin abrir.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `Cosas del sorteo de atriles: a tu izquierda, ${tech.name} (${tech.party}), con el periódico doblado y la palabra «gestión» subrayada. A tu derecha, ${populist.name} (${populist.party}), que ha rectificado dos veces antes del bloque de vivienda. Más a la derecha, ${hard?.name || 'Covadonga del Muro'} (Fox), con el caballo en doble fila. Al fondo, el atril vacío de Centrifugados.${state.memories.nicoInvite ? ' En tercera fila, Ernesto, el del tercero, con tu chapa puesta.' : ''} ${moderator}: «¿A qué renuncia su programa?».`,
      choices: {
        tradeoff: { title: 'Defender la renuncia concreta', flavor: (state, { rivals }) => `Dices qué pierdes y a quién molestas. ${rivals.tech.name} pide «un dato». Se lo das. Lo busca en el periódico` },
        attack: { title: (state, { rivals }) => `Contestar a ${rivals.populist.name} con un «y tú más»`, flavor: 'Le sacas la hemeroteca. Aplauso fácil, titular fácil y cero propuestas: el debate que juraste no hacer' },
        manage: { title: 'Dar turnos y desmontar cifras con calma', flavor: (state, { rivals }) => `Cuando ${rivals.populist.name} promete «vivienda digna» por cuarta campaña seguida, preguntas cuántas grúas ha visto en el barrio. Silencio. Agua` },
        promise: { title: 'Prometer topar el alquiler a la mitad «el primer mes»', flavor: (state, { rivals }) => `El público aplaude. ${rivals.populist.name} te mira con envidia profesional. Lola, en la grada, cuenta pisos que se pasan a «temporada»` },
      },
    },
    finalPrep: {
      eyebrow: 'CAPÍTULO 6 · ÚLTIMA VUELTA', title: 'Última semana: ya no se pueden publicar encuestas.',
      intro: (state, ctx) => `Previsión: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'por encima' : 'por debajo'} del umbral). Como no se pueden publicar encuestas, Dani lee un digital andorrano que habla del «precio de las peras». En la tele del bar, Podríamos anuncia papeles y ayudas para todo el que llegue, «y que se entere bien todo el mundo»; Fox, un muro sin partida presupuestaria. Paco cambia de canal.`,
      choices: {
        listen: { title: 'Visitar a quienes aún dudan', flavor: state => `La parada del autobús, la cola de Correos del voto por correo y el rellano de la Reme${state.memories.nicoAssembly || state.memories.nicoInvite ? '. La junta del portal te pide que vuelvas' : ''}. Escuchas más de lo que hablas` },
        receipts: { title: 'Publicar el presupuesto definitivo', flavor: 'Lola lo imprime en A3 y letra grande: «la transparencia también es cuerpo de letra»' },
        volunteers: { title: 'Interventores y apoderados para cada mesa', flavor: state => `Nico reparte turnos, bocadillos y un mapa de colegios en una servilleta${state.memories.pacoLucia ? '. Lucía, la camarera nueva, se apunta de interventora' : ''}. Paco pregunta si puede ser interventor siendo vocal. No` },
      },
    },
    finalSpeech: {
      eyebrow: 'CAPÍTULO 6 · EL ÚLTIMO MITIN', title: 'Viernes, 23:59. Luego, jornada de reflexión.',
      intro: 'Sillas plegables, un globo que se desinfla despacio y una periodista local que te pide «algo de quince segundos». Es lo último antes de la reflexión, que en este país se hace por WhatsApp.',
      choices: {
        account: {
          title: state => ({
            shade: '“Habrá sombra y habrá menos coches. Esto elegimos, esto cuesta y aquí responderemos.”',
            parking: '“El barrio podrá trabajar, aunque este verano siga sin árboles. Esto elegimos y aquí responderemos.”',
            festival: '“Habrá fiestas y habrá ruido pactado. Esto elegimos, esto cuesta y aquí responderemos.”',
            housing: '“Habrá grúa en el solar y vecinos en el tercero. Tardará, costará y aquí responderemos.”',
          }[state.proposal] || '“Esto elegimos, esto cuesta y aquí responderemos.”'),
          flavor: 'Lo dices mirando a Marisa. Marisa no aplaude: asiente, que en ella vale el doble',
        },
        viral: { title: '“¡Este barrio no se calla!”', flavor: 'Dani lo emite en directo. Se corea entero, incluida la coletilla de «a partir de las once». La periodista ya tiene sus quince segundos' },
        everything: { title: '“Mañana habrá de todo para todos.”', flavor: 'Aplauso enorme. Lola se tapa la cara con el presupuesto' },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'NOCHE ELECTORAL · VICTORIA', title: 'Al balcón. Con la ropa recogida.',
      text: state => `Marisa aplaude una vez. Lola pregunta quién tiene las facturas. Paco llega del colegio con catorce horas de vocal y el acta firmada: «Una y nos vamos». No se va nadie. ${{
        shade: 'Mañana empieza lo difícil: decirle a la furgoneta del sobrino dónde aparca.',
        parking: 'Mañana empieza lo difícil: el primer agosto sin árboles con tu nombre en la placa.',
        festival: 'Mañana empieza lo difícil: la reunión con los del primero, que ya traen tapones para ti.',
        housing: 'Mañana empieza lo difícil: pedir la licencia del solar. Lola ya ha subrayado el primer plazo en el BOE.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'NOCHE ELECTORAL · DERROTA', title: 'Esta noche todos dicen que han ganado. Menos tú.',
      reasons: {
        support: 'Faltó portal: el barrio te vio más en el móvil que en el rellano.',
        credibility: 'Las contradicciones pesaron: en la cola del pan se recuerda todo, y se comenta más.',
        organization: 'El equipo llegó desordenado: un colegio sin interventor, otro con tres y nadie con bocadillo.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: 'MINIJUEGO · HAZLO VIRAL', title: 'Grabando junto a la farola.', goWord: '¡Acción!',
      lanes: ['Hola, barrio', '¡Arriba!', 'Palmas', 'Ni idea'],
      takes: {
        explain: 'Pizarra de Lola, plano fijo y cada gesto subraya un coste.',
        chairs: 'El trend del momento. Paco mira con los brazos cruzados y el trapo al hombro.',
        neighbor: 'Marisa habla; tú marcas el ritmo detrás, discretamente. Más o menos.',
        debunk: 'Desmontas el bulo gesto a gesto: esto no, esto sí, esto cuesta.',
      },
      intro: (state, ctx) => `Móvil en el trípode, vecinos mirando y Dani contando. ${ctx.take} Haz cada pose cuando su icono llegue al círculo. El ritmo suma alcance, no votos.`,
      titles: { great: '¡Viral! En el código postal, por lo menos.', ok: 'Se comparte en tres grupos familiares.', bad: 'Lo ha visto tu madre. Dos veces. Y te ha llamado.' },
      texts: { ok: 'Dani ya pone subtítulos en amarillo. La toma vale: el alcance abre puertas, pero los votos se ganan en el portal.', bad: 'Te has perdido entre el saludo y las palmas. Repite la toma: el barrio no ha visto nada. Todavía.' },
    },
    duel: {
      eyebrow: 'MINIJUEGO · DUELO DE RÉPLICAS', title: 'Cuatro preguntas, un cronómetro.',
      intro: (state, ctx) => `${ctx.rounds} réplicas. Elige la respuesta que defiende algo concreto y asume su coste antes de que acabe el tiempo. A mitad, alguien te interrumpirá: pide la palabra.`,
      rounds: state => {
        const m = state.memories || {};
        return [
          { topic: 'Vivienda', role: 'populist', claim: 'Nuestro tope funciona: en su barrio el alquiler ya no sube. Lo certifica el observatorio, que está en un piso que antes se alquilaba.',
            options: ['No ha bajado el alquiler: han bajado los carteles de «se alquila». Lo nuestro tarda más, lo reconozco: más casas, no más reglas.', '¡Pues yo lo topo a la mitad y regalo la plaza de garaje!', 'Usted rectifica tanto que no sé con cuál de sus programas hablo.'], correct: 0 },
          { topic: 'Cuentas', role: 'tech', claim: 'Con sentido común: ¿cuánto cuesta lo suyo? Lo nuestro lo diremos en una fase posterior, tras auditar la herencia.',
            options: ['Gestión, gestión y gestión. Y sentido común.', 'Ya saldrá de algún sitio. Siempre sale.', 'Dos créditos de presupuesto: página dos del documento de Lola. Lo que dejamos fuera, en la tres.'], correct: 2 },
          { topic: 'Su propuesta', role: 'moderator', claim: 'Pregunta directa: ¿a quién perjudica su propuesta? Treinta segundos. Bueno, diez.',
            options: ['A nadie. Es una propuesta sin perdedores, como los anuncios de colonia.', COST[state.proposal] || 'A alguien seguro. Lo diremos con nombre y apellidos cuando lo sepamos.', 'A los de siempre, que ya saben quiénes son.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'La cola del pan', role: 'populist', claim: '¡Usted le prometió a una panadera sombra, aparcamiento y un piso! Eso es prometerlo todo. Y lo digo yo, que de eso sé.',
                options: ['Es verdad. Me equivoqué al prometerlo todo; luego elegí una cosa y expliqué lo que cuesta.', 'Eso es un bulo de la máquina del fango.', '¿Y usted? ¡Usted más!'], correct: 0 }
            : { topic: 'Pactos', role: 'tech', claim: 'Pregunta de sentido común: si mañana no le dan los números, ¿con quién pacta? ¿Con nosotros o con ellos?',
                options: ['Con nadie. Jamás. Nunca. Salvo que haga falta.', 'Lo decidirán las bases en una consulta de una tarde.', 'Con quien firme nuestra propuesta por escrito y con plazo. Y lo digo antes de que votéis, no después.'], correct: 2 },
        ];
      },
      interruptions: {
        populist: 'Perdone, que eso lo hemos defendido siempre. Bueno, desde ayer.',
        tech: 'Si me permite, leo un párrafo del periódico de esta mañana… y otro…',
        moderator: 'Le quedan diez segundos. Ocho. Queda dicho.',
        fallback: '¡Perdone, perdone!',
      },
      floor: 'Déjeme terminar, que yo no le he interrumpido.',
      floorBabble: 'Déjeme terminar',
      reactions: {
        timeout: 'Se acabó el tiempo. Pasamos al siguiente bloque, que la jarra se calienta.',
        quick: 'Concreta y a tiempo. Queda dicho.',
        slow: 'Concreta, aunque justa de reloj.',
        wrong: 'Gracias por darme la razón. Lo pondré en el argumentario.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} anota algo. No parece una crítica.`, mid: 'Has aguantado el tipo. Y el cronómetro.', low: 'Los rivales ya tienen corte para el telediario. Es el tuyo.' },
      text: 'La estrategia elegida marca el debate; las réplicas deciden si se te cree.',
    },
    chairs: {
      eyebrow: 'MINIJUEGO · SILLAS PLEGABLES', title: 'Paco presta las sillas. Tú las cargas.',
      intro: (state, ctx) => `Para la última asamblea en la plaza hacen falta seis sillas plegables, repartidas por el barrio. Pasa por encima de una para cogerla y llévala al corro. De una en una: «la espalda también vota», dice Nico. Tienes ${ctx.time} segundos.`,
      hints: {
        start: 'Pasa por encima de una silla para cogerla.',
        carry: 'Ahora, al corro amarillo.',
        progress: (state, ctx) => `${ctx.delivered} de ${ctx.total}. A por la siguiente.`,
        full: '¡Corro completo!',
      },
      titles: { all: 'Corro completo, cero excusas.', mid: 'Medio corro. El resto, de pie, como en los mítines de verdad.', low: 'Paco recoge las sillas él solo. Y te mira.' },
      texts: { all: 'Nico apunta el tiempo en la servilleta del mapa. Organizar es esto: que haya sitio cuando llegue la gente.', other: 'Las que faltan siguen por la plaza. Puedes repetir: nadie ha visto nada, salvo Paco.' },
    },
    rally: {
      eyebrow: 'MINIJUEGO · EL ÚLTIMO MITIN', title: 'Que no se te vaya la sala.', goWord: '¡Habla!', lane: 'Remata la frase',
      intro: 'Cada frase tiene remate. Pulsa cuando la palabra llegue al círculo y el público aplaude; si fallas, alguien mira el móvil. O peor: el reloj.',
      phrases: state => {
        const own = {
          shade: ['Este verano, la plaza tendrá', 'SOMBRA'], parking: ['Quien trabaja en el barrio podrá', 'DESCARGAR'],
          festival: ['Los chavales tendrán local y la plaza,', 'FIESTA'], housing: ['El solar de la esquina tendrá', 'GRÚA'],
        }[state.proposal] || ['Una cosa bien hecha, para', 'EMPEZAR'];
        return [
          ['Buenas noches, salón multiusos. Aquí no ha venido nadie en', 'AUTOBÚS'],
          ['No vengo a prometeros la luna: vengo a prometeros', 'UNA COSA'],
          own,
          ['Y sí, cuesta. Lo hemos puesto por', 'ESCRITO'],
          ['Lola lo ha cuadrado, Nico lo ha repartido y Dani lo ha', 'SUBIDO'],
          ['Aquí nadie ha dicho que esto se pague', 'SOLO'],
          ['Si no lo cumplimos, ya sabéis dónde está la', 'PANADERÍA'],
          ['Mañana, jornada de reflexión: reflexionad, y no por', 'WHATSAPP'],
          ['Si os toca mesa, no busquéis excusa: llevad', 'BOCADILLO'],
          ['El domingo, papeleta al sobre y sobre a la', 'URNA'],
          ['A quien queráis. Pero que no decida el', 'SOFÁ'],
          ['¡Pues me', 'PRESENTO!'],
        ];
      },
      titles: { great: 'La sala en pie. Los que tienen silla, también.', ok: 'Aplausos sinceros y algún bostezo.', bad: 'Ha sonado un móvil. Luego otro. Luego el tuyo.' },
      text: 'El público recordará cómo lo dijiste; la decisión que tomaste decide qué recuerda.',
    },
  },
};
