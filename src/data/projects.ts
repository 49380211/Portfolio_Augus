/* Proyectos. Agregar uno es sumar un objeto a este array: el carrusel, el contador
   y el caso de estudio se arman solos desde acá.

   card = visual de la tarjeta del carrusel · vis = visual del caso de estudio.
   Las claves válidas son las del objeto V en src/scripts/visuals.js. */

/** Visuales disponibles (ver el objeto V en src/scripts/visuals.js). */
export type VisualKey = 'bdweb' | 'pipe' | 'road' | 'lesson' | 'cdm' | 'pc';

/** Piezas de la galería del caso de estudio. Las rutas son claves de src/data/images.ts
    ("<carpeta de src/assets>/<archivo>"). */
export type GalleryItem =
  /** Subtítulo que separa bloques de la galería. */
  | ['h', text: string]
  /** Captura en ventana de navegador; 'wide' la pone a todo el ancho. */
  | ['b', src: string, caption: string, size?: 'wide']
  /** Captura + el sitio en el celular. */
  | ['duo', src: string, caption: string, phoneSrc: string]
  /** Foto suelta con fecha en negrita al pie (p. ej. avances en Blender). */
  | ['shot', src: string, date: string, caption: string]
  /** Grilla de personajes: [ruta, nombre] por cada uno. */
  | ['chars', [src: string, label: string][]];

export interface Project {
  id: string;
  name: string;
  /** Categoría, como se muestra entre paréntesis en la tarjeta. */
  cat: string;
  year: string;
  team: string;
  /** Contexto: se muestra junto a team en el caso de estudio. */
  ctx: string;
  role: string;
  card: VisualKey;
  vis: VisualKey;
  /** La frase grande del caso de estudio. */
  line: string;
  /** Filas del caso: [título, texto]. */
  rows: [string, string][];
  /** Herramientas, separadas por " · ". */
  tags: string;
  /** Si está, aparece el enlace "Ver el sitio ↗". */
  link?: string;
  /** Texto de la barra de dirección en las capturas 'b' y 'duo'. */
  bar?: string;
  gallery?: GalleryItem[];

  /* Los asigna el JS en runtime, no hay que escribirlos acá. */
  /** La <article> de la tarjeta, que crea work-carousel.js. */
  el?: HTMLElement;
  /** Desde dónde se abrió el caso, para la animación de apertura. */
  src?: DOMRect | null;
}

export const P: Project[] = [
  { id: 'bd', name: 'BuildData', cat: 'Producto', year: '2026', team: 'Equipo de 3', ctx: 'Proyecto final TIC', role: 'Planificación, producto y UX', card: 'bdweb', vis: 'pipe',
    link: 'https://builddata.com.ar', bar: 'builddata.com.ar',
    line: '«Menos información perdida. Más control. Mejores decisiones.»',
    rows: [['Problema', 'En las obras, avances, faltantes y demoras se pierden entre grupos de WhatsApp, audios y fotos.'],
           ['Idea', 'Usar WhatsApp como entrada y ordenar cada mensaje en tareas, alertas y un dashboard por obra.'],
           ['Mi parte', 'Planificación del proyecto, diseño del producto y experiencia de usuario: flujos, dashboard, cronograma, identidad visual y presentación.'],
           ['Recorrido', 'Participé en todas las etapas: desde identificar la necesidad hasta diseñar una solución funcional.'],
           ['Equipo', 'Proyecto final TIC 2026, de a tres. Backend: Facundo Jarma.'],
           ['Estado', 'Demo en octubre de 2026. El sitio ya está en builddata.com.ar y varias funciones siguen en desarrollo.']],
    gallery: [['h', 'BuildData hoy, en builddata.com.ar'],
              ['b', 'bd/dashboard.jpg', 'El dashboard de una obra: lo que requiere atención, las tareas del día y las próximas entregas.', 'wide'],
              ['b', 'bd/inicio.jpg', 'Inicio: todas las obras, con su avance y sus alertas.'],
              ['b', 'bd/landing.jpg', 'La landing: el problema y la solución, en una frase.']],
    tags: 'Figma · Notion · Sprints' },
  { id: 'ro', name: 'Rolling On', cat: 'Juego 3D', year: '4.º año', team: 'Grupal', ctx: 'TIC · Blender + Unity', role: 'Modelado 3D: auto y cactus', card: 'road', vis: 'road',
    line: 'Manejar por una ruta infinita: relajación, viaje, música y amistad, en low-poly.',
    rows: [['Mi parte', 'Modelé en Blender un Porsche 911 de 1967, con interior. Más de un mes, completando lo que el tutorial no cubría.'],
           ['Problema', 'Al pasarlo a Unity aparecieron caras invertidas y superficies rotas: corregí la geometría, cerré huecos y usé Solidify.'],
           ['Texturas', 'Pesaban demasiado; las cambié por una paleta liviana, acorde al low-poly.'],
           ['Cactus', 'La idea y los bocetos fueron del equipo; el modelado y el Texture Paint, míos.']],
    gallery: [['h', 'El proceso en Blender, de julio a septiembre de 2025'],
              ['shot', 'rolling/01-14-07-primeros-volumenes.jpg', '14/7', 'Primeros volúmenes, con espejo para modelar una sola mitad.'],
              ['shot', 'rolling/02-19-07-forma.jpg', '19/7', 'Aparece la forma: capó, techo y ventanas.'],
              ['shot', 'rolling/03-10-08-carroceria.jpg', '10/8', 'Carrocería con faros y guardabarros.'],
              ['shot', 'rolling/04-14-08-arcos-y-puertas.jpg', '14/8', 'Arcos de las ruedas y líneas de las puertas.'],
              ['shot', 'rolling/05-19-08-ruedas-y-espejos.jpg', '19/8', 'Ruedas, llantas y espejos: el modelo completo, sin color.'],
              ['shot', 'rolling/06-20-08-primeros-materiales.jpg', '20/8', 'Primeros materiales: pintura, vidrio y cromo. Muy pesados para Unity.'],
              ['shot', 'rolling/07-09-09-version-final-e-interior.jpg', '9/9', 'La versión final: paleta liviana, y el interior armado aparte.'],
              ['shot', 'rolling/08-10-09-personaje.jpg', '10/9', 'El personaje del juego, modelado sobre una imagen de referencia (a la derecha).']],
    tags: 'Blender · Unity · Texture Paint' },
  { id: 'sq', name: 'SqueakyJS', cat: 'Edtech', year: '3.º año', team: 'Proyecto académico', ctx: 'TIC', role: 'Lecciones, ejercicios y mascota', card: 'lesson', vis: 'lesson',
    line: 'Una web para aprender JavaScript jugando, con una mascota que acompaña.',
    rows: [['Lección', 'Teoría y práctica: opción única, selección múltiple, arrastrar y soltar y dos ejercicios de escribir código.'],
           ['Squeaky', 'La mascota hace el aprendizaje más cercano y acompaña el progreso.'],
           ['Producto', 'Relato de problema a solución y un Business Model Canvas, pensando en jóvenes y emprendedores.'],
           ['Estado', 'Proyecto académico de 3.º año. Retos y logros quedaron como propuesta.']],
    gallery: [['h', 'Squeaky, la mascota, y sus expresiones'],
              ['chars', [['squeaky/01-contento.jpg', 'Contento'], ['squeaky/02-enojado.jpg', 'Enojado'], ['squeaky/03-triste.jpg', 'Triste'],
                         ['squeaky/04-dormido.jpg', 'Dormido'], ['squeaky/05-con-anteojos.jpg', 'Con anteojos'], ['squeaky/06-con-lupa.jpg', 'Con lupa'],
                         ['squeaky/07-pintando.jpg', 'Pintando'], ['squeaky/08-gorra-js.jpg', 'Con gorra de JS'], ['squeaky/09-gorra-verde.jpg', 'Con gorra verde']]]],
    tags: 'UX · JavaScript · Business Model Canvas' },
  { id: 'cdm', name: 'CDM · Centro de Medicina', cat: 'Web + identidad', year: 'En curso', team: 'Centro médico', ctx: 'CABA', role: 'Diseño web, marca y desarrollo', card: 'cdm', vis: 'cdm',
    link: 'https://claude.ai/artifact/Xv43fkoKFFTck52aGmh32S', bar: 'cdm · centro de medicina',
    gallery: [['b', 'cdm/s-nos.jpg', 'Nosotros: tarjetas que se apilan al scrollear'], ['b', 'cdm/s-tx.jpg', 'Tratamientos por categoría'], ['duo', 'cdm/s-turno.jpg', 'Pedido de turno paso a paso', 'cdm/m-hero.jpg']],
    line: 'Sitio web para un centro de ginecología, prevención y estética no quirúrgica en CABA.',
    rows: [['Concepto', '«La claraboya»: el atrio del edificio ocupa toda la pantalla y, al scrollear, se cierra en el arco de la marca. Imagen grande, poco texto, mucho aire.'],
           ['Marca', 'Isotipo CDM y una paleta cálida de papel, nude, rosa y terracota. Tipografías Jost y Montserrat.'],
           ['Sitio', 'Tarjetas que se apilan, un manifiesto que se completa palabra por palabra, tratamientos por categoría, novedades en carrusel y pedido de turno paso a paso, con calendario.'],
           ['Giro', 'Nació como «Centro de la Mujer» y pasó a «Centro de Medicina», para un público más amplio.'],
           ['Estado', 'En desarrollo.']],
    tags: 'Diseño web · Identidad · GSAP' },
  { id: 'pc', name: 'Armar una PC', cat: 'Hardware', year: 'Personal', team: 'Interés', ctx: 'Hardware', role: 'Selección y armado', card: 'pc', vis: 'pc',
    line: 'Desarmar para entender cómo se arma.',
    rows: [['Qué', 'Elegir y compatibilizar CPU, GPU, refrigeración, memoria, fuente y almacenamiento.'],
           ['Por qué', 'Entender cada pieza para que el conjunto funcione.']],
    tags: 'Interés personal' }
];
