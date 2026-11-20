/* Tarjetas de "Cómo trabajo": la de atrás se achica y oscurece cuando la tapa la siguiente. */
import { clamp } from './utils.js';

let pcards = [];

export function initProcessCards() {
  pcards = [...document.querySelectorAll('.pcard')];
  pcards.forEach(c => { const s = document.createElement('i'); s.className = 'shade'; c.appendChild(s); });
}

export function updateProcessCards() {
  pcards.forEach((c, k) => { const nx = pcards[k + 1]; if (!nx) return; const r = c.getBoundingClientRect(), n = nx.getBoundingClientRect();
    const o = clamp((r.bottom - n.top) / r.height, 0, 1); c.style.transform = 'scale(' + (1 - o * .06).toFixed(4) + ')'; c.lastChild.style.opacity = (o * .35).toFixed(3); });
}
