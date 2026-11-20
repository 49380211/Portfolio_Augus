/* Hoja del caso de estudio: se abre desde la tarjeta y se cierra scrolleando hasta el final. */
import { gsap } from 'gsap';
import { vw, vh, pad2, reduce } from './utils.js';
import { P } from './projects.js';
import { V } from './visuals.js';
import { lenis } from './scroll.js';
import { imgTag } from './images.js';

let sheet = null, sVis = null;
let openI = -1, run = null, origin = [50, 50];
const EX = { acc: 0, t: 0, closing: false };

export const getOpenI = () => openI;

export function openCase(i, e, src) {
  const p = P[i]; openI = i; p.src = src || null;
  document.getElementById('sNum').textContent = pad2(i + 1) + ' / ' + pad2(P.length) + ' — ' + p.cat;
  document.getElementById('sTitle').innerHTML = p.name.split(' ').map(w => '<span class="wd">' + w.split('').map(c => '<span class="c">' + c + '</span>').join('') + '</span>').join(' ');
  document.getElementById('sLine').textContent = p.line;
  document.getElementById('sFacts').innerHTML = '<div><span>Año</span>' + p.year + '</div><div><span>Contexto</span>' + p.team + ' · ' + p.ctx + '</div><div><span>Rol</span>' + p.role + '</div>';
  document.getElementById('sRows').innerHTML = p.rows.map(r => '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>').join('');
  document.getElementById('sTags').innerHTML = p.tags + (p.link ? '<a class="s-link" href="' + p.link + '" target="_blank" rel="noopener">Ver el sitio ↗</a>' : '');
  sVis.innerHTML = V[p.vis].html();
  const brw = (src, cap) => '<figure style="margin:0"><div class="brw"><div class="bar"><i></i><i></i><i></i><span>cdm · centro de medicina</span></div>' + imgTag(src, cap) + '</div><figcaption>' + cap + '</figcaption></figure>';
  document.getElementById('sGal').innerHTML = (p.gallery || []).map(g => g[0] === 'duo' ? '<div class="duo">' + brw(g[1], g[2]) + '<figure style="margin:0"><div class="phone">' + imgTag(g[3], 'El sitio en el celular') + '</div><figcaption style="text-align:center">En el celular</figcaption></figure></div>' : brw(g[1], g[2])).join('');
  const r = (p.src || p.el.querySelector('.vis')).getBoundingClientRect();
  origin = [(r.left + r.width / 2) / vw() * 100, (r.top + r.height / 2) / vh() * 100];
  if (lenis) lenis.stop(); document.body.classList.add('lock');
  gsap.set(sheet, { visibility: 'visible' }); sheet.scrollTop = 0;
  gsap.fromTo(sheet, { clipPath: 'inset(' + r.top + 'px ' + (vw() - r.right) + 'px ' + (vh() - r.bottom) + 'px ' + r.left + 'px)' }, { clipPath: 'inset(0px 0px 0px 0px)', duration: reduce ? 0 : 1.1, ease: 'expo.inOut' });
  gsap.fromTo('#sTitle .c', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: .025, delay: .5 });
  gsap.fromTo('#sLine, #sFacts > div, .s-vis, #sRows > div, #sTags, #sGal figure', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .05, delay: .65 });
  if (run && run.kill) run.kill();
  run = V[p.vis].run(sVis, true);
  setTimeout(() => document.getElementById('sClose').focus({ preventScroll: true }), 400);
}
export function closeSheet(scrolled) {
  if (openI < 0) return; const i = openI; openI = -1;
  const r = (P[i].src || P[i].el.querySelector('.vis')).getBoundingClientRect();
  gsap.to(sheet.querySelector('.in'), { y: scrolled === true ? -vh() * .12 : 0, opacity: .3, duration: reduce ? 0 : 1, ease: 'expo.inOut' });
  gsap.to(sheet, { clipPath: 'inset(' + r.top + 'px ' + (vw() - r.right) + 'px ' + (vh() - r.bottom) + 'px ' + r.left + 'px)', duration: reduce ? 0 : 1, ease: 'expo.inOut',
    onComplete: () => { gsap.set(sheet, { visibility: 'hidden' }); gsap.set(sheet.querySelector('.in'), { clearProps: 'all' }); if (run && run.kill) run.kill(); run = null; sVis.innerHTML = ''; EX.acc = 0; EX.closing = false; } });
  document.body.classList.remove('lock'); if (lenis) lenis.start();
  P[i].el.querySelector('.vis').focus({ preventScroll: true });
}

const atBottom = () => sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 4;
function exitPush(d, ev) {
  if (openI < 0 || EX.closing) return;
  if (d > 0 && atBottom()) { if (ev && ev.cancelable) ev.preventDefault(); EX.acc = Math.min(520, EX.acc + Math.min(d, 90)); }
  else if (d < 0) EX.acc = Math.max(0, EX.acc + d * 2);
  EX.t = performance.now();
  if (EX.acc >= 520) { EX.closing = true; closeSheet(true); }
}

export function initCaseSheet() {
  sheet = document.getElementById('sheet'); sVis = document.getElementById('sVis');
  document.getElementById('sClose').addEventListener('click', () => closeSheet());
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  sheet.addEventListener('wheel', e => exitPush(e.deltaY, e), { passive: false });
  let sy0 = null;
  sheet.addEventListener('touchstart', e => { sy0 = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchmove', e => { if (sy0 === null) return; const y = e.touches[0].clientY; exitPush((sy0 - y) * 2.2); sy0 = y; }, { passive: true });
}

export function updateExit(f) {
  const { openI, now } = f;
  // barra de salida del caso
  if (openI >= 0) { if (!EX.closing && now - EX.t > 260) EX.acc *= .9; document.getElementById('exitBar').style.transform = 'scaleX(' + (EX.acc / 520).toFixed(3) + ')'; if (!EX.closing) sheet.querySelector('.in').style.transform = 'translate3d(0,' + (-EX.acc / 520 * 60).toFixed(1) + 'px,0)'; }
}
