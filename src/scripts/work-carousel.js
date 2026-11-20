/* Carrusel de proyectos: avanza con el scroll vertical mientras la sección queda fija. */
import { vw, vh, clamp, lerp, pad2, reduce, onView } from './utils.js';
import { P } from '../data/projects';
import { V } from './visuals.js';
import { isoStatic } from './iso.js';

export const drag = { on: false, x: 0, sx: 0, cur: 0, tgt: 0, v: 0, moved: false, min: 0 };
export let track = null;
let work = null, sizeWorkRef = null;

/* el click abre el caso de estudio: la función la inyecta main.js */
export function initWork(openCase) {
  track = document.getElementById('track');
  P.forEach((p, i) => {
    const a = document.createElement('article'); a.className = 'proj';
    a.innerHTML = '<button class="vis" aria-label="Abrir ' + p.name + '">' + V[p.card].html() + '</button><div class="meta"><span>' + (i + 1) + '</span><span class="nm"><b>' + p.name + '</b> <span>(' + p.cat + ')</span></span><span>' + p.year + '<br><span class="gray">' + p.team + '</span></span><span class="rl"><span>Rol</span>' + p.role + '</span></div>';
    track.appendChild(a); p.el = a;
    const vis = a.querySelector('.vis');
    if (p.card === 'pc') isoStatic(vis.querySelector('svg'));
    else if (p.card !== 'dash') onView(a, () => V[p.card].run(vis), .2);
    vis.addEventListener('click', e => { if (drag.moved) { e.preventDefault(); return; } openCase(i, e); });
  });
  bounds(); window.addEventListener('resize', bounds);
  work = document.getElementById('proyectos');
  sizeWork(); sizeWorkRef = sizeWork; window.addEventListener('resize', sizeWork); window.addEventListener('load', sizeWork);
}

export const bounds = () => { drag.min = Math.min(0, vw() - track.scrollWidth); if (sizeWorkRef) sizeWorkRef(); };
function sizeWork() { const dist = Math.max(0, track.scrollWidth - vw()); work.style.height = (vh() + dist * 1.15) + 'px'; }

export function updateWork() {
  // carrusel con inercia y leve inclinación según la velocidad
  // carrusel: la posición sale de cuánto bajaste dentro de la sección
  const wr = work.getBoundingClientRect(), wp = clamp(-wr.top / Math.max(1, wr.height - vh()), 0, 1);
  const prev = drag.cur; drag.cur = lerp(drag.cur, wp * Math.min(0, vw() - track.scrollWidth), reduce ? 1 : .14); drag.v = drag.cur - prev;
  document.getElementById('workBar').style.transform = 'scaleX(' + wp.toFixed(3) + ')';
  const wc = 'workCount', ci = Math.min(P.length, Math.round(wp * (P.length - 1)) + 1); const wce = document.getElementById(wc); if (wce.dataset.v != ci) { wce.dataset.v = ci; wce.textContent = pad2(ci) + ' / ' + pad2(P.length); }
  track.style.transform = 'translate3d(' + drag.cur.toFixed(1) + 'px,0,0)';
  const sk = clamp(drag.v * .12, -3, 3);
  P.forEach(p => { p.el.querySelector('.vis').style.transform = 'skewX(' + (-sk).toFixed(2) + 'deg) scale(' + (1 - Math.min(Math.abs(drag.v) * .002, .04)).toFixed(3) + ')'; });
}
