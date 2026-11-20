/* Helpers compartidos. */
export const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const vw = () => window.innerWidth, vh = () => window.innerHeight;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const pad2 = n => String(n).padStart(2, '0');
export const mob = () => vw() < 820;
export const INK = '#121613', PAPER = '#FAFAF8', ACC = '#FF611A';
// aparición al entrar en pantalla (IntersectionObserver: funciona también dentro de visores que no scrollean la ventana)
export const onView = (el, cb, th) => {
  if (!el) return;
  if (!('IntersectionObserver' in window)) { cb(); return; }
  const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { io.disconnect(); cb(); } }); }, { threshold: th || .12 });
  io.observe(el);
};
