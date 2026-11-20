/* Apariciones al entrar en pantalla. */
import { gsap } from 'gsap';
import { onView } from './utils.js';

export function reveals() {
  gsap.utils.toArray('.intro .body p, .work h2, .about .cols > div, .about .cv h3, .about .cv .r, .foot .row > *').forEach(el => {
    gsap.set(el, { y: 40, opacity: 0 }); onView(el, () => gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }));
  });
  gsap.set('.proj', { x: 120, opacity: 0 }); onView(document.getElementById('track'), () => gsap.to('.proj', { x: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: .08 }));
  gsap.set('.foot .hb span', { yPercent: 100, opacity: 0 }); onView(document.querySelector('.foot'), () => gsap.to('.foot .hb span', { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .04 }), .05);
  // la cartelita: las letras se acomodan solas, como en un tablero
}
