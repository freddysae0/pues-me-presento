// Feed de «unratito» (la app de vídeos del móvil, misión 'phone').
// Contenido declarativo: los guionistas pueden reescribir textos, contadores y orden sin tocar la lógica
// (src/ui/phoneFeed.js) ni el dibujo (src/ui/feedArt.js).
//
// Campos de cada vídeo:
//   id        identificador estable (lo usan las pruebas y las capturas)
//   art       ilustración animada de src/ui/feedArt.js: 'dance' | 'grandpa' | 'sixseven' | 'news'
//   loop      bucle de audio sintetizado de src/audio/feedLoops.js: 'pop' | 'pasodoble' | 'trap' | 'news'
//   duration  segundos que tarda la barra de progreso en dar la vuelta (el vídeo hace loop)
//   user      @usuario sin la arroba · avatar: color del círculo del perfil
//   caption   descripción · tags: hashtags sin '#' · sound: línea de «sonido original»
//   sticker   texto pegado sobre el vídeo (opcional)
//   likes / comments / shares: contadores ya formateados (texto libre)
//   alt       descripción para lectores de pantalla
// La noticia (news: true) va SIEMPRE la última: no se puede pasar de ella y su botón completa la misión.
// Texto pensado para el humor del juego: referencias españolas, sin marcas reales.

export const feedHint = {
  swipe: 'Desliza',
  keys: 'Rueda, arrastrar, S o Espacio',
  end: 'No hay más vídeos. Solo esto.',
};

export const feed = [
  {
    id: 'trend',
    art: 'dance',
    loop: 'pop',
    duration: 7,
    user: 'lucia.baila',
    avatar: '#ff7eb6',
    caption: 'Tercer día ensayando el trend. Mi madre ha entrado dos veces a por la fregona y ya se sabe los pasos mejor que yo.',
    tags: ['trend', 'bailecito', 'ensayo47', 'parati'],
    sound: 'sonido original · Verbena Remix (versión cocina)',
    sticker: 'POV: el baile pide 40 m² y el piso tiene 38',
    likes: '1,2 M',
    comments: '8.431',
    shares: '22,9 mil',
    alt: 'Una chica con coleta baila un trend delante de un aro de luz en una cocina diminuta, con la fregona de su madre al fondo.',
  },
  {
    id: 'abuelo',
    art: 'grandpa',
    loop: 'pasodoble',
    duration: 6,
    user: 'abuelo.emilio84',
    avatar: '#58b8f0',
    caption: 'Mi abuelo se ha enterado de que el tobogán de la piscina municipal es gratis para jubilados. Lleva 37 bajadas. No ha soltado el periódico.',
    tags: ['abuelo', 'piscinamunicipal', 'jubilacionactiva', 'calcetinesconsandalias'],
    sound: 'sonido original · Pasodoble del chiringuito',
    sticker: 'Bajada n.º 37. Ni se ha despeinado.',
    likes: '3,4 M',
    comments: '41,7 mil',
    shares: '210 mil',
    alt: 'Un señor mayor con gafas de sol, bigote y calcetines con sandalias baja por un tobogán gigante en un flotador leyendo el periódico con total seriedad, y cae a la piscina.',
  },
  {
    id: 'sixseven',
    art: 'sixseven',
    loop: 'trap',
    duration: 5,
    user: 'mateo_2b',
    avatar: '#8f6bff',
    caption: 'La profe de mates dijo «abrid el libro por la página 67» y perdió la clase para siempre. Lleva así desde el martes.',
    tags: ['67', 'sixseven', 'clasedemates', 'perdonprofe'],
    sound: 'sonido original · six seven (sped up)',
    likes: '6,7 M',
    comments: '67 mil',
    shares: '67 mil',
    alt: 'Un chaval con la gorra del revés hace el gesto del «6 7» subiendo y bajando las manos con las palmas hacia arriba delante de una pizarra que pone «pág. 67».',
  },
  {
    id: 'news',
    news: true,
    art: 'news',
    loop: 'news',
    duration: 8,
    user: 'noticias_al_minuto',
    avatar: '#ff6b4f',
    tag: 'ÚLTIMA HORA',
    title: ['Se vienen', 'elecciones.'],
    body: 'El Gobierno disuelve las Cortes y convoca elecciones generales. Los partidos de siempre ya están grabando vídeos en mangas de camisa.',
    caption: 'Comentario destacado · @maripuri_63: «¿Otra vez? Si aún tengo en el buzón la propaganda de las últimas».',
    tags: ['elecciones', 'ultimahora', 'otravez'],
    sound: 'sonido original · Sintonía de urgencia',
    likes: '48,2 mil',
    comments: '3.104',
    shares: '9.870',
    aside: 'Llevas veinte minutos de «uno más y lo dejo». Y ahora esto.',
    cta: '«Pues yo tengo una propuesta»',
    alt: 'Noticia de última hora: el edificio del Congreso con una urna a la que caen sobres. El Gobierno disuelve las Cortes y convoca elecciones generales.',
  },
];
