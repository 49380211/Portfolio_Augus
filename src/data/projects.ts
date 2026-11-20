/* Proyectos. Agregar uno es sumar un objeto a este array: el carrusel, el contador
   y el caso de estudio se arman solos desde acá.

   card = visual de la tarjeta del carrusel · vis = visual del caso de estudio.
   Las claves válidas son las del objeto V en src/scripts/visuals.js. */

/** Visuales disponibles (ver el objeto V en src/scripts/visuals.js). */
export type VisualKey = 'dash' | 'pipe' | 'road' | 'lesson' | 'cdm' | 'pc';

/** Una captura a lo ancho, o una captura + el sitio en el celular. */
export type GalleryItem =
  | ['b', src: string, caption: string]
  | ['duo', src: string, caption: string, phoneSrc: string];

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
  /** Las rutas son claves de src/data/cdm.ts. */
  gallery?: GalleryItem[];

  /* Los asigna el JS en runtime, no hay que escribirlos acá. */
  /** La <article> de la tarjeta, que crea work-carousel.js. */
  el?: HTMLElement;
  /** Desde dónde se abrió el caso, para la animación de apertura. */
  src?: DOMRect | null;
}

export const P: Project[] = [
  { id: 'bd', name: 'BuildData', cat: 'Producto', year: '2026', team: 'Equipo de 3', ctx: 'Proyecto final TIC', role: 'Planificación, producto y UX', card: 'dash', vis: 'pipe',
    line: '«Menos información perdida. Más control. Mejores decisiones.»',
    rows: [['Problema', 'En las obras, avances, faltantes y demoras se pierden entre grupos de WhatsApp, audios y fotos.'],
           ['Idea', 'Usar WhatsApp como entrada y ordenar cada mensaje en tareas, alertas y un dashboard por obra.'],
           ['Mi parte', 'Planificación del proyecto, diseño del producto y experiencia de usuario: flujos, dashboard, cronograma, identidad visual y presentación.'],
           ['Recorrido', 'Participé en todas las etapas: desde identificar la necesidad hasta diseñar una solución funcional.'],
           ['Equipo', 'Proyecto final TIC 2026, de a tres. Backend: Facundo Jarma.'],
           ['Estado', 'Demo en octubre de 2026; varias funciones siguen en desarrollo. El flujo de arriba es la propuesta.']],
    tags: 'Figma · Notion · Sprints' },
  { id: 'ro', name: 'Rolling On', cat: 'Juego 3D', year: '4.º año', team: 'Grupal', ctx: 'TIC · Blender + Unity', role: 'Modelado 3D: auto y cactus', card: 'road', vis: 'road',
    line: 'Manejar por una ruta infinita: relajación, viaje, música y amistad, en low-poly.',
    rows: [['Mi parte', 'Modelé en Blender un Porsche 911 de 1967, con interior. Más de un mes, completando lo que el tutorial no cubría.'],
           ['Problema', 'Al pasarlo a Unity aparecieron caras invertidas y superficies rotas: corregí la geometría, cerré huecos y usé Solidify.'],
           ['Texturas', 'Pesaban demasiado; las cambié por una paleta liviana, acorde al low-poly.'],
           ['Cactus', 'La idea y los bocetos fueron del equipo; el modelado y el Texture Paint, míos.']],
    tags: 'Blender · Unity · Texture Paint' },
  { id: 'sq', name: 'SqueakyJS', cat: 'Edtech', year: '3.º año', team: 'Proyecto académico', ctx: 'TIC', role: 'Lecciones, ejercicios y mascota', card: 'lesson', vis: 'lesson',
    line: 'Una web para aprender JavaScript jugando, con una mascota que acompaña.',
    rows: [['Lección', 'Teoría y práctica: opción única, selección múltiple, arrastrar y soltar y dos ejercicios de escribir código.'],
           ['Squeaky', 'La mascota hace el aprendizaje más cercano y acompaña el progreso.'],
           ['Producto', 'Relato de problema a solución y un Business Model Canvas, pensando en jóvenes y emprendedores.'],
           ['Estado', 'Proyecto académico de 3.º año. Retos y logros quedaron como propuesta.']],
    tags: 'UX · JavaScript · Business Model Canvas' },
  { id: 'cdm', name: 'CDM · Centro de Medicina', cat: 'Web + identidad', year: 'En curso', team: 'Centro médico', ctx: 'CABA', role: 'Diseño web, marca y desarrollo', card: 'cdm', vis: 'cdm',
    link: 'https://claude.ai/artifact/Xv43fkoKFFTck52aGmh32S',
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
