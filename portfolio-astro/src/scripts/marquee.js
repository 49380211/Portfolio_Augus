/* Cinta de texto: avanza sola y se acelera con el scroll. */
import { lerp, reduce } from './utils.js';

let mq = null, mqx = 0, mqv = 0;

export function initMarquee() {
  mq = document.getElementById('marq');
  const unit = '<span class="title">Tecnología <i>·</i> Producto <i>·</i> Procesos <i>·</i></span>';
  mq.innerHTML = unit.repeat(4);
}

export function updateMarquee(f) {
  mqv = lerp(mqv, 1 + Math.abs(f.sv) * .35, .1); mqx -= mqv * (reduce ? 0 : 1);
  const uw = mq.firstChild.offsetWidth; if (uw && -mqx > uw) mqx += uw;
  mq.style.transform = 'translate3d(' + mqx.toFixed(1) + 'px,0,0)';
}
