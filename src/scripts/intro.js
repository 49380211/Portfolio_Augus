/* Entrada: el nombre se acomoda, aparecen el encabezado y el subtítulo y cae el lápiz. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mob, reduce } from './utils.js';
import { reveals } from './reveals.js';
import { bounds } from './work-carousel.js';
import { lenis } from './scroll.js';
import { pen, pencil } from './pencil.js';

function split() { document.querySelectorAll('.hero h1 .l').forEach((l, k) => { const s = l.textContent; l.innerHTML = s.split('').map((c, j) => '<span class="c' + (k === 1 && j === s.length - 1 ? ' o' : '') + '">' + c + '</span>').join(''); }); }
function settle() {
  document.body.classList.remove('loading');
  reveals(); ScrollTrigger.refresh(); bounds();
  if (lenis) lenis.start();
}
export function intro() {
  split();
  const h1 = document.querySelector('.hero h1');
  if (reduce) { h1.style.visibility = 'visible'; gsap.set(pencil, { opacity: 1 }); settle(); return; }
  gsap.set(h1, { scale: mob() ? 1.45 : 1.75, transformOrigin: '50% 55%' });
  h1.style.visibility = 'visible';
  const tl = gsap.timeline({ onComplete: settle });
  tl.fromTo('.hero h1 .c', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .02 }, .05)
    .to(h1, { scale: 1, duration: 1.25, ease: 'expo.inOut' }, .35)
    .fromTo('.hdr > *', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .06 }, 1.25)
    .fromTo('.hero .tag', { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2)' }, 1.3)
    .fromTo('.hero .sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, 1.38)
    // el lápiz grande cae y se apoya sobre el nombre
    .add(() => { pen.y = -300; pen.a = -40; pen.vx = pen.vy = pen.va = 0; gsap.to(pencil, { opacity: 1, duration: .3 }); }, 1.75)
    // el scroll se libera a los 2,6 s, igual que antes de sacar los lápices y las tarjetas que nunca se dibujaban
    .add(() => {}, 2.6);
}
