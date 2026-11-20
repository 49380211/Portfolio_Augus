/* Lápiz: grande y apoyado sobre el nombre; al scrollear se levanta, gira y queda de pie contra el borde derecho. */
import { vw, vh, clamp, lerp, mob, reduce } from './utils.js';

export const pen = { x: vw() * .7, y: -200, a: -40, s: .55, vx: 0, vy: 0, va: 0 };
export let pencil = null;
let penShadow = null, heroH1 = null, hero = null;

export function initPencil() {
  pencil = document.getElementById('pencil');
  penShadow = document.getElementById('penShadow');
  heroH1 = document.querySelector('.hero h1');
  hero = document.querySelector('.hero');
}

export function updatePencil(f) {
  const { openI, sy, sv, t } = f;
  // lápiz (como el teclado de midlife): grande y quieto, apoyado sobre el nombre; al scrollear se levanta,
  // gira y queda de pie contra el borde derecho, acompañando el resto de la página
  const hr = hero.getBoundingClientRect(), h1r = heroH1.getBoundingClientRect();
  let tx, ty, ta, ts, lift;
  const big = mob() ? vw() * .82 / 560 : clamp(vw() * .5 / 560, .6, 1.4);
  if (openI >= 0) { tx = vw() - (mob() ? 110 : 170); ty = 52; ta = 186; ts = mob() ? .3 : .42; lift = 30; }
  else {
    const h = clamp(-hr.top / (hr.height * .8), 0, 1), e = h * h * (3 - 2 * h), arc = Math.sin(Math.PI * e);
    // apoyado a lo largo de todo el nombre: la punta antes de la A y la goma pasando la H
    const a0 = mob() ? -9 : -6, ca = Math.cos(a0 * Math.PI / 180), sa = Math.sin(-a0 * Math.PI / 180);
    const s0 = (h1r.width * 1.02) / 560 / ca, len0 = 560 * s0;
    const x0 = h1r.left - h1r.width * .015, y0 = h1r.top + h1r.height * .52 + len0 * sa / 2;
    const x1 = vw() - (mob() ? 24 : 48), y1 = vh() * .9, a1 = -84;
    const max = document.documentElement.scrollHeight - vh(), prog = clamp(sy / Math.max(1, max), 0, 1);
    tx = lerp(x0, x1, e) - arc * vw() * .1; ty = lerp(y0, y1 - prog * vh() * .06, e) - arc * vh() * .08;
    ta = lerp(a0, a1, e) - arc * 22; ts = lerp(s0, big * (mob() ? .62 : .8), e) * (1 + arc * .08);
    lift = lerp(12, 54, e) + arc * 40;
    ty += Math.sin(t * 1.1) * (1.5 + e * 4); ta += (Math.sin(t * .7) * .8 + clamp(sv * .3, -8, 8)) * (.3 + e * .7);
  }
  if (reduce) { pen.x = tx; pen.y = ty; pen.a = ta; pen.s = ts; }
  pen.vx = pen.vx * .7 + (tx - pen.x) * .12; pen.vy = pen.vy * .7 + (ty - pen.y) * .12;
  pen.x += pen.vx; pen.y += pen.vy;
  pen.va = pen.va * .7 + ((((ta - pen.a + 540) % 360) - 180)) * .1; pen.a += pen.va;
  pen.s += (ts - pen.s) * .12;
  pen.l = lerp(pen.l || 12, lift, .12);
  pencil.style.transform = 'translate3d(' + pen.x.toFixed(1) + 'px,' + pen.y.toFixed(1) + 'px,0) rotate(' + pen.a.toFixed(2) + 'deg) scale(' + pen.s.toFixed(3) + ',' + (pen.s * .6).toFixed(3) + ')';
  penShadow.style.transform = 'translate3d(' + (pen.x + pen.l * .45).toFixed(1) + 'px,' + (pen.y + pen.l).toFixed(1) + 'px,0) rotate(' + pen.a.toFixed(2) + 'deg) scale(' + pen.s.toFixed(3) + ',' + (pen.s * .6 * (1 + pen.l / 60)).toFixed(3) + ')';
  penShadow.style.opacity = (pencil.style.opacity === '' ? 0 : +getComputedStyle(pencil).opacity) * clamp(1.15 - pen.l / 140, .35, 1);
}
