/* Pastilla "Abrir": sigue al cursor cuando está sobre una tarjeta del carrusel. */
import { vw, vh, lerp } from './utils.js';

let pill = null;
const pm = { x: 0, y: 0 }, pp = { x: 0, y: 0, s: 0 };
let overTrack = false, overVis = false;

export function initPill(track) {
  pill = document.getElementById('pill'); pm.x = vw() / 2; pm.y = vh() / 2;
  track.addEventListener('pointerenter', () => { overTrack = true; }); track.addEventListener('pointerleave', () => { overTrack = false; });
  track.addEventListener('pointerover', e => { overVis = !!e.target.closest('.vis'); });
  window.addEventListener('pointermove', e => { pm.x = e.clientX; pm.y = e.clientY; }, { passive: true });
}

export function updatePill(f) {
  const showPill = overTrack && overVis && f.openI < 0;
  pp.x = lerp(pp.x, pm.x, .25); pp.y = lerp(pp.y, pm.y, .25); pp.s = lerp(pp.s, showPill ? 1 : 0, .18);
  pill.textContent = 'Abrir';
  pill.style.transform = 'translate(' + pp.x.toFixed(1) + 'px,' + pp.y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + pp.s.toFixed(3) + ')';
}
