/* Despiece isométrico del gabinete: fuente común para la tarjeta del carrusel y el caso de estudio. */
import { gsap } from 'gsap';

let src = null, parts = null, exOf = null;
export let isoReady = false;

export function initIso() {
  /* ---------- plano isométrico del gabinete ---------- */
  const iso = document.getElementById('iso');
  const S = .55, OX = 280, OY = 390;
  const P = (x, y, z) => [OX + (x - y) * .866 * S, OY + (x + y) * .5 * S - z * S];
  const pts = a => a.map(q => P(q[0], q[1], q[2]).map(n => n.toFixed(1)).join(',')).join(' ');
  const poly = (a, fill, stroke, w) => '<polygon class="ln" pathLength="1" points="' + pts(a) + '" fill="' + fill + '" stroke="' + (stroke || '#1C1C1B') + '" stroke-width="' + (w || 1.2) + '" stroke-linejoin="round"/>';
  const line = (a, stroke, w) => '<polyline class="ln" pathLength="1" points="' + pts(a) + '" fill="none" stroke="' + (stroke || '#1C1C1B') + '" stroke-width="' + (w || 1) + '" stroke-linecap="round"/>';
  const box = (x0, x1, y0, y1, z0, z1, c) => { c = c || ['#F7F6F3', '#ECEBE7', '#DCDAD5'];
    return poly([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]], c[0]) + poly([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]], c[1]) + poly([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]], c[2]); };
  const circ = (f, n) => Array.from({ length: (n || 28) + 1 }, (_, i) => f(i / (n || 28) * Math.PI * 2));
  const fan = (pt, r, stroke) => poly(circ(t => pt(r * Math.cos(t), r * Math.sin(t))), 'none', stroke, 1.1)
    + poly(circ(t => pt(r * .3 * Math.cos(t), r * .3 * Math.sin(t)), 16), 'none', stroke, 1)
    + [0, 2.1, 4.2].map(a => line([pt(r * .3 * Math.cos(a), r * .3 * Math.sin(a)), pt(r * .9 * Math.cos(a + .7), r * .9 * Math.sin(a + .7))], stroke, .9)).join('');
  const fanY = (xc, y, zc, r, s) => fan((u, v) => [xc + u, y, zc + v], r, s);
  const fanX = (x, yc, zc, r, s) => fan((u, v) => [x, yc + u, zc + v], r, s);
  const D = 440, W = 220, H = 460;
  const dimY = W + 60;
  let html = line([[0,dimY,0],[D,dimY,0]], '#7E7D78', .9) + line([[0,dimY-10,0],[0,dimY+10,0]], '#7E7D78', .9) + line([[D,dimY-10,0],[D,dimY+10,0]], '#7E7D78', .9);
  const dl = P(D / 2, dimY + 26, 0);
  html += '<text x="' + dl[0].toFixed(1) + '" y="' + dl[1].toFixed(1) + '" text-anchor="middle" font-family="Caveat, cursive" font-size="22" fill="#45453F">440 mm</text>';
  html += '<g>' + poly([[0,0,0],[D,0,0],[D,0,H],[0,0,H]], '#DCDAD5') + poly([[0,0,0],[0,W,0],[0,W,H],[0,0,H]], '#E4E2DD') + poly([[0,0,0],[D,0,0],[D,W,0],[0,W,0]], '#D2D0CA')
    + [60, 90, 120].map(z => line([[40,0,H-z],[120,0,H-z]], '#7E7D78', 1)).join('') + '</g>';
  parts = [
    { name: 'fuente', ex: [0, 120, -140], c: [110,110,52], lab: [-90, 60], svg: box(20,200,20,200,8,96) + fanY(110,200,52,30) },
    { name: 'placa madre', ex: [0, 0, 190], c: [285,12,290], lab: [150, -40], svg: box(150,420,8,16,140,440,['#EFEEEA','#E2E0DB','#CFCDC8']) + box(370,380,16,30,300,410) + box(386,396,16,30,300,410) + box(260,320,16,22,330,390,['#F7F6F3','#D9D7D2','#CFCDC8']) },
    { name: 'cooler cpu', ex: [0, 170, 110], c: [290,60,340], lab: [-160, -110], svg: box(250,330,22,96,300,380) + fanY(290,96,340,32) },
    { name: 'placa de video', ex: [0, 230, -30], c: [280,86,222], lab: [-110, 40], svg: box(150,410,22,150,200,244,['#F7F6F3','#2A2A2A','#3A3A38']) + fanY(220,150,222,16,'#F3F2EE') + fanY(330,150,222,16,'#F3F2EE') + line([[160,150,206],[400,150,206]], '#FF611A', 2) },
    { name: 'frente · 3 fans', ex: [190, 0, 0], c: [448,110,230], lab: [0, 150], svg: box(440,456,10,210,10,450,['#F3F2EE','#E6E5E1','#ECEBE7']) + fanX(456,110,110,60) + fanX(456,110,230,60,'#FF611A') + fanX(456,110,350,60) },
    { name: 'vidrio templado', ex: [0, 330, 0], c: [220,W+5,230], lab: [0, -200], svg: poly([[0,W,H],[D,W,H],[D,W+5,H],[0,W+5,H]], '#F3F2EE') + poly([[0,W+5,0],[D,W+5,0],[D,W+5,H],[0,W+5,H]], 'rgba(26,26,25,0.035)') + line([[50,W+5,300],[180,W+5,440]], 'rgba(26,26,25,0.28)', 2.5) + line([[90,W+5,250],[250,W+5,430]], 'rgba(26,26,25,0.18)', 1.5) }
  ];
  const shellOuter = '<g>' + poly([[0,0,H],[D,0,H],[D,W,H],[0,W,H]], '#F3F2EE') + poly([[D,0,0],[D,W,0],[D,W,H],[D,0,H]], '#E6E5E1')
    + [40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map(x => line([[x,30,H],[x,190,H]], '#BDBBB6', .8)).join('') + '</g>';
  const partHtml = p => {
    const a = P(p.c[0], p.c[1], p.c[2]), b = [a[0] + p.lab[0], a[1] + p.lab[1]];
    const anchor = p.lab[0] < 0 ? 'end' : (p.lab[0] > 0 ? 'start' : 'middle');
    const tx = b[0] + (p.lab[0] < 0 ? -6 : p.lab[0] > 0 ? 6 : 0), ty = b[1] + (p.lab[1] < 0 ? -6 : 18);
    return '<g class="part"><g class="body">' + p.svg + '</g><g class="lbl"><line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="#7E7D78" stroke-width=".8" stroke-dasharray="3 3"/><circle cx="' + a[0].toFixed(1) + '" cy="' + a[1].toFixed(1) + '" r="3" fill="#FF611A"/><text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" text-anchor="' + anchor + '">' + p.name + '</text></g></g>';
  };
  html += parts.slice(0, 4).map(partHtml).join('') + shellOuter + parts.slice(4).map(partHtml).join('');
  html += '<g id="stamp" opacity="0"><circle cx="620" cy="560" r="34" fill="none" stroke="#FF611A" stroke-width="2"/><circle cx="620" cy="560" r="26" fill="none" stroke="#FF611A" stroke-width="1" stroke-dasharray="3 3"/><text x="620" y="566" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="14" fill="#FF611A">ok</text></g>';
  iso.innerHTML = html;
  const partEls = [...iso.querySelectorAll('.part')];
  exOf = p => ({ x: (p.ex[0] - p.ex[1]) * .866 * S, y: (p.ex[0] + p.ex[1]) * .5 * S - p.ex[2] * S });
  partEls.forEach((el, i) => gsap.set(el, exOf(parts[i])));
  src = iso.innerHTML;
  isoReady = true;
}

export const isoStatic = svg => { svg.innerHTML = src; svg.querySelectorAll('.part').forEach(p => { p.removeAttribute('transform'); p.removeAttribute('style'); p.removeAttribute('data-svg-origin'); }); svg.querySelectorAll('.lbl, #stamp').forEach(n => n.remove()); svg.querySelectorAll('[id]').forEach(n => n.removeAttribute('id')); svg.querySelectorAll('text').forEach(n => n.setAttribute('font-size', '22')); };
export const isoAnimated = svg => {
    svg.setAttribute('viewBox', '0 0 700 640'); svg.innerHTML = src; svg.querySelectorAll('#stamp').forEach(n => n.remove());
    svg.querySelectorAll('.lbl text').forEach(n => { n.setAttribute('font-size', '20'); });
    const els = [...svg.querySelectorAll('.part')];
    els.forEach((el, i) => gsap.set(el, exOf(parts[i])));
    gsap.fromTo(svg.querySelectorAll('.ln'), { attr: { 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 1.2, ease: 'power2.inOut', stagger: .004, delay: .3 });
    els.forEach((el, i) => gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'expo.inOut', delay: 1.6 + i * .12 }));
    els.forEach(el => gsap.to(el.querySelector('.lbl'), { opacity: 0, duration: .3, delay: 1.7 }));
    return null;
  };
