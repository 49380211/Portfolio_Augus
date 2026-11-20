/* Frases grandes: cada palabra pasa de gris claro a tinta según cuánto bajaste. */
import { vh, clamp, reduce } from './utils.js';

const DARK = [];
const mix = (a, b, k) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',') + ')';
const C_LIGHT = [205, 207, 202], C_INK = [18, 22, 19], C_MUTED = [139, 142, 137], C_ACC = [255, 97, 26];

export function initWords() {
  document.querySelectorAll('.intro .big, .about .big').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/(<[^>]+>)|([^\s<]+)/g, (m, tag, w) => tag ? tag : '<span class="wd">' + w + '</span>');
    const ws = [...el.querySelectorAll('.wd')];
    const KEY = ['organización', 'análisis', 'entender', 'ordenarlas'];
    ws.forEach(w => { const k = w.textContent.toLowerCase().replace(/[^a-záéíóúñ]/g, ''); w.dataset.base = KEY.includes(k) ? 'acc' : (w.closest('em') ? 'muted' : 'ink'); });
    DARK.push({ el, ws, last: -1 });
  });
}

export function darkFrame() {
  const H = vh();
  DARK.forEach(d => {
    const r = d.el.getBoundingClientRect();
    const p = reduce ? 1 : clamp((H * .88 - r.top) / (r.height + H * .38), 0, 1);
    if (Math.abs(p - d.last) < .002) return; d.last = p;
    const N = d.ws.length, span = 3;
    d.ws.forEach((w, i) => { const k = clamp((p * (N + span) - i) / span, 0, 1); w.style.color = mix(C_LIGHT, w.dataset.base === 'acc' ? C_ACC : w.dataset.base === 'muted' ? C_MUTED : C_INK, k); });
  });
}
