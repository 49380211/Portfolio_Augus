/* Resuelve las rutas de cdm/ a las URLs que astro:assets generó en build.
   El mapa lo publica CdmImages.astro en un <script type="application/json">. */
let map = null;

const load = () => {
  if (map) return map;
  map = {};
  try { const el = document.getElementById('cdm-images'); if (el) map = JSON.parse(el.textContent); } catch (e) {}
  return map;
};

/* <img> con las dimensiones reales, para que no salte el layout mientras carga */
export const imgTag = (path, alt) => {
  const m = load()[path] || { src: path };
  const dim = m.width ? ' width="' + m.width + '" height="' + m.height + '"' : '';
  return '<img src="' + m.src + '" alt="' + alt + '"' + dim + ' loading="lazy">';
};
