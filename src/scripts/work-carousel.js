/* Carrusel de proyectos: avanza con el scroll vertical mientras la sección queda fija. */
import { vw, vh, clamp, lerp, pad2, reduce, onView } from './utils.js';
import { P } from '../data/projects';
import { V } from './visuals.js';
import { isoStatic } from './iso.js';

/* posición actual del carrusel y cuánto se movió en el último frame (para la inclinación) */
const pos = { cur: 0, v: 0 };
export let track = null;
let work = null;

/* el click abre el caso de estudio: la función la inyecta main.js */
export function initWork(openCase) {
  track = document.getElementById('track');
  P.forEach((p, i) => {
    const a = document.createElement('article'); a.className = 'proj';
    a.innerHTML = '<button class="vis" aria-label="Abrir ' + p.name + '">' + V[p.card].html() + '</button><div class="meta"><span>' + (i + 1) + '</span><span class="nm"><b>' + p.name + '</b> <span>(' + p.cat + ')</span></span><span>' + p.year + '<br><span class="gray">' + p.team + '</span></span><span class="rl"><span>Rol</span>' + p.role + '</span></div>';
    track.appendChild(a); p.el = a;
    const vis = a.querySelector('.vis');
    if (p.card === 'pc') isoStatic(vis.querySelector('svg'));
    else onView(a, () => V[p.card].run(vis), .2);
    vis.addEventListener('click', e => openCase(i, e));
  });
  work = document.getElementById('proyectos');
  bounds(); window.addEventListener('resize', bounds); window.addEventListener('load', bounds);
}

/* el alto de la sección define cuánto hay que bajar para recorrer todo el carrusel */
export const bounds = () => { const dist = Math.max(0, track.scrollWidth - vw()); work.style.height = (vh() + dist * 1.15) + 'px'; };

export function updateWork() {
  // la posición sale de cuánto bajaste dentro de la sección; la inclinación, de la velocidad
  const wr = work.getBoundingClientRect(), wp = clamp(-wr.top / Math.max(1, wr.height - vh()), 0, 1);
  const prev = pos.cur; pos.cur = lerp(pos.cur, wp * Math.min(0, vw() - track.scrollWidth), reduce ? 1 : .14); pos.v = pos.cur - prev;
  document.getElementById('workBar').style.transform = 'scaleX(' + wp.toFixed(3) + ')';
  const ci = Math.min(P.length, Math.round(wp * (P.length - 1)) + 1), wce = document.getElementById('workCount');
  if (wce.dataset.v != ci) { wce.dataset.v = ci; wce.textContent = pad2(ci) + ' / ' + pad2(P.length); }
  track.style.transform = 'translate3d(' + pos.cur.toFixed(1) + 'px,0,0)';
  const sk = clamp(pos.v * .12, -3, 3);
  P.forEach(p => { p.el.querySelector('.vis').style.transform = 'skewX(' + (-sk).toFixed(2) + 'deg) scale(' + (1 - Math.min(Math.abs(pos.v) * .002, .04)).toFixed(3) + ')'; });
}
