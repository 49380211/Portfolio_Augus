/* Scroll suave con Lenis. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { reduce } from './utils.js';

export let lenis = null;

export function initScroll() {
  if (!reduce) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  }
}

export const scrollTo = sel => { const el = document.querySelector(sel); if (!el) return; lenis ? lenis.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };

/* los enlaces del nav cierran el caso de estudio antes de bajar: el cierre lo inyecta main.js para no acoplar los módulos */
export function initNavLinks(closeSheet) {
  document.querySelectorAll('[data-to]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); closeSheet(); scrollTo(a.dataset.to); }));
}
