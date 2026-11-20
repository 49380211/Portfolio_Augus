/* Entrada: el nombre se acomoda, brotan los lápices de las esquinas y suben las tarjetas. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mob, reduce } from './utils.js';
import { reveals } from './reveals.js';
import { bounds } from './work-carousel.js';
import { lenis } from './scroll.js';
import { pen, pencil } from './pencil.js';

// nota: hoy no se usa — el HTML no tiene .pencils ni .pics, así que fieldL/fieldR/pics quedan vacíos (igual que en el original)
function pencilField(svg, seed) {
  let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const cols = [['#FF611A', '#D9520F'], ['#1C201D', '#000'], ['#E8E2D2', '#CFC7B2'], ['#8B8E89', '#6E716C'], ['#FF611A', '#D9520F'], ['#F4F4F1', '#D8D9D3']];
  let html = '';
  const n = 13;
  for (let k = 0; k < n; k++) {
    const x = 14 + k * (290 / n) + rnd() * 16, h = 110 + rnd() * 190 * (1 - k / n * .55), w = 11 + rnd() * 4, a = -12 + rnd() * 24 - k * .6, c = cols[Math.floor(rnd() * cols.length)];
    const top = 320 - h, tip = w * 1.7;
    html += '<g transform="rotate(' + a.toFixed(1) + ' ' + x.toFixed(1) + ' 320)"><g class="pc">'
      + '<rect x="' + (x - w / 2).toFixed(1) + '" y="' + (top + tip).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (h - tip + 4).toFixed(1) + '" fill="' + c[0] + '" stroke="rgba(18,22,19,.25)" stroke-width=".6"/>'
      + '<rect x="' + (x - w / 2).toFixed(1) + '" y="' + (top + tip).toFixed(1) + '" width="' + (w * .32).toFixed(1) + '" height="' + (h - tip + 4).toFixed(1) + '" fill="#fff" opacity=".18"/>'
      + '<rect x="' + (x + w * .16).toFixed(1) + '" y="' + (top + tip).toFixed(1) + '" width="' + (w * .34).toFixed(1) + '" height="' + (h - tip + 4).toFixed(1) + '" fill="' + c[1] + '" opacity=".35"/>'
      + '<polygon points="' + (x - w / 2).toFixed(1) + ',' + (top + tip).toFixed(1) + ' ' + (x + w / 2).toFixed(1) + ',' + (top + tip).toFixed(1) + ' ' + x.toFixed(1) + ',' + top.toFixed(1) + '" fill="#E6CDA4" stroke="rgba(18,22,19,.25)" stroke-width=".6"/>'
      + '<polygon points="' + (x - w * .17).toFixed(1) + ',' + (top + tip * .34).toFixed(1) + ' ' + (x + w * .17).toFixed(1) + ',' + (top + tip * .34).toFixed(1) + ' ' + x.toFixed(1) + ',' + top.toFixed(1) + '" fill="#232522"/>'
      + '</g></g>';
  }
  svg.innerHTML = html;
  return [...svg.querySelectorAll('.pc')];
}
const fieldL = [], fieldR = [], pics = [];

function split() { document.querySelectorAll('.hero h1 .l').forEach((l, k) => { const s = l.textContent; l.innerHTML = s.split('').map((c, j) => '<span class="c' + (k === 1 && j === s.length - 1 ? ' o' : '') + '">' + c + '</span>').join(''); }); }
function sway(els) { els.forEach(el => gsap.to(el, { transformOrigin: '50% 100%', rotate: gsap.utils.random(-3, 3), duration: gsap.utils.random(2.2, 3.6), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: gsap.utils.random(0, 1) })); }
function settle() {
  document.body.classList.remove('loading');
  reveals(); ScrollTrigger.refresh(); bounds();
  if (lenis) lenis.start();
}
export function intro() {
  split();
  const h1 = document.querySelector('.hero h1');
  if (reduce) { h1.style.visibility = 'visible'; gsap.set(pencil, { opacity: 1 }); settle(); return; }
  gsap.set([...fieldL, ...fieldR], { yPercent: 105 });
  gsap.set(pics, { yPercent: 140, rotate: i => (i % 2 ? 5 : -5) });
  gsap.set(h1, { scale: mob() ? 1.45 : 1.75, transformOrigin: '50% 55%' });
  h1.style.visibility = 'visible';
  const tl = gsap.timeline({ onComplete: settle });
  tl.fromTo('.hero h1 .c', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .02 }, .05)
    .to(h1, { scale: 1, duration: 1.25, ease: 'expo.inOut' }, .35)
    .fromTo('.hdr > *', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .06 }, 1.25)
    .fromTo('.hero .tag', { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2)' }, 1.3)
    .fromTo('.hero .sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, 1.38)
    // los lápices brotan desde abajo, de afuera hacia el centro, y quedan meciéndose
    .to(fieldL, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .045 }, 1.4)
    .to([...fieldR].reverse(), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .045 }, 1.45)
    .add(() => sway([...fieldL, ...fieldR]), 2.3)
    // las tarjetas suben una por una, inclinadas
    .to(pics, { yPercent: 0, rotate: i => (i % 2 ? 2.5 : -2.5), duration: 1, ease: 'back.out(1.4)', stagger: .09 }, 1.6)
    // el lápiz grande cae y se apoya sobre el nombre
    .add(() => { pen.y = -300; pen.a = -40; pen.vx = pen.vy = pen.va = 0; gsap.to(pencil, { opacity: 1, duration: .3 }); }, 1.75);
}
