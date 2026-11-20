/* Dibujos de línea y visuales de cada proyecto (SVG + GSAP). */
import { gsap } from 'gsap';
import { INK, PAPER, ACC, reduce } from './utils.js';
import { isoAnimated, isoReady } from './iso.js';
import { imgTag } from './images.js';

const L = (x1, y1, x2, y2, c, w) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || INK) + '" stroke-width="' + (w || 1.2) + '" stroke-linecap="round"/>';
const R = (x, y, w, h, f, c, r) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r == null ? 3 : r) + '" fill="' + (f || 'none') + '" stroke="' + (c || INK) + '" stroke-width="1"/>';
const wheel = cx => '<g class="wh"><circle cx="' + cx + '" cy="96" r="18" fill="' + INK + '"/><circle cx="' + cx + '" cy="96" r="9" fill="' + PAPER + '"/>' + [0, 2.094, 4.189].map(a => L(cx, 96, (cx + 8 * Math.cos(a)).toFixed(1), (96 + 8 * Math.sin(a)).toFixed(1), INK, 2)).join('') + '</g>';
const carSVG = () => '<svg viewBox="0 0 300 114.5"><g transform="translate(302 0) scale(-1 1)" stroke="' + INK + '" stroke-linejoin="round">'
  + '<polygon points="20,96 22,77 36,68 70,64 98,58 118,40 146,30 180,29 210,36 236,52 262,60 278,70 282,92 276,96" fill="' + PAPER + '" stroke-width="1.5"/>'
  + '<polygon points="108,57 124,43 150,35 180,34 206,40 226,53" fill="#D9DAD4" stroke-width="1.2"/>'
  + '<g fill="none" stroke-width=".8" opacity=".55"><polyline points="36,68 70,74 98,58"/><polyline points="70,74 150,57 236,52"/><polyline points="150,57 160,94"/><polyline points="236,52 250,74 278,70"/><polyline points="250,74 262,94"/><line x1="166" y1="34" x2="168" y2="55"/></g>'
  + '<circle cx="32" cy="74" r="4" fill="' + PAPER + '" stroke-width="1"/><rect x="266" y="83" width="13" height="5" fill="' + ACC + '" stroke="none"/></g>'
  + wheel(80) + wheel(224) + '</svg>';
const dashSVG = () => '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">' + '<rect width="320" height="200" fill="#FAFAF8"/>' + R(0, 0, 58, 200, '#F0F0EC', 'none', 0)
  + '<circle cx="16" cy="18" r="6" fill="' + INK + '"/>' + [44, 60, 76, 92, 108].map((y, i) => L(12, y, i ? 44 : 48, y, i === 1 ? ACC : '#9C9F9A', i === 1 ? 2 : 1.2)).join('')
  + L(70, 18, 150, 18, INK, 2) + L(70, 28, 120, 28, '#B8BAB5')
  + [0, 1, 2].map(i => R(70 + i * 82, 40, 74, 44, '#fff', '#DADBD6', 4) + '<circle cx="' + (81 + i * 82) + '" cy="52" r="4" fill="' + (i === 2 ? ACC : '#121613') + '"/>' + L(79 + i * 82, 70, 122 + i * 82, 70, '#121613', 2) + L(79 + i * 82, 77, 108 + i * 82, 77, '#B8BAB5')).join('')
  + R(70, 94, 120, 94, '#fff', '#DADBD6', 4) + [30, 46, 24, 56, 40, 50].map((h, i) => R(80 + i * 17, 176 - h, 10, h, i === 3 ? ACC : '#121613', 'none', 1)).join('')
  + R(198, 94, 110, 94, '#fff', '#DADBD6', 4) + [[206, 106, 60], [222, 122, 52], [212, 138, 44], [236, 154, 54], [228, 170, 38]].map((g, i) => R(g[0], g[1], g[2], 8, i === 2 ? ACC : '#121613', 'none', 2)).join('') + '</svg>';

/* ---------- visuales (se usan en el carrusel y en el caso) ---------- */
export const V = {
  dash: { html: () => '<div class="v-dash"><div class="laptop"><div class="scr"><div>' + dashSVG() + '</div></div><div class="base"></div></div></div>', run() {} },
  pipe: {
    html: () => {
      const n = [['WhatsApp', 'texto · audio · foto'], ['Ordena', 'por tipo y obra'], ['Alerta', 'demoras · faltantes'], ['Dashboard', 'estado de la obra']];
      const Q = [[70, 90], [210, 205], [390, 205], [530, 90]];
      let s = '<div class="v-pipe"><svg viewBox="0 0 600 300" role="img" aria-label="Flujo propuesto: mensajes de WhatsApp que se ordenan, generan alertas y llegan al dashboard"><path class="pp" d="M70 90 C 170 90 130 205 210 205 L 390 205 C 470 205 430 90 530 90" fill="none" stroke="#B8BAB5" stroke-width="1.5" stroke-dasharray="4 5"/>';
      Q.forEach((p, k) => {
        s += '<g class="node"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="34" fill="' + (k === 3 ? INK : '#fff') + '" stroke="' + INK + '" stroke-width="1.2"/>';
        if (k === 0) s += '<path d="M' + (p[0] - 13) + ' ' + (p[1] - 9) + ' h26 a4 4 0 0 1 4 4 v13 a4 4 0 0 1 -4 4 h-16 l-8 7 v-7 h-2 a4 4 0 0 1 -4 -4 v-13 a4 4 0 0 1 4 -4z" fill="none" stroke="' + INK + '" stroke-width="1.5"/>';
        if (k === 1) s += [-8, 0, 8].map((dy, j) => L(p[0] - 13, p[1] + dy, p[0] + 13 - j * 6, p[1] + dy, INK, 1.8)).join('');
        if (k === 2) s += '<path d="M' + p[0] + ' ' + (p[1] - 15) + ' l15 26 h-30z" fill="none" stroke="' + ACC + '" stroke-width="1.8" stroke-linejoin="round"/>' + L(p[0], p[1] - 5, p[0], p[1] + 3, ACC, 1.8);
        if (k === 3) s += [16, 22, 10].map((h, j) => '<rect x="' + (p[0] - 14 + j * 10) + '" y="' + (p[1] + 8 - h) + '" width="7" height="' + h + '" rx="1" fill="' + (j === 1 ? ACC : PAPER) + '"/>').join('');
        const ty = p[1] + (k === 0 || k === 3 ? -70 : 62);
        s += '<text x="' + p[0] + '" y="' + ty + '" text-anchor="middle">' + n[k][0] + '</text><text class="k" x="' + p[0] + '" y="' + (ty + 18) + '" text-anchor="middle">' + n[k][1] + '</text></g>';
      });
      return s + '<circle class="ppDot" r="6" fill="' + ACC + '"/></svg></div>';
    },
    run(root) {
      const path = root.querySelector('.pp'), dot = root.querySelector('.ppDot'), Lp = path.getTotalLength(), q = { v: 0 };
      gsap.fromTo(root.querySelectorAll('.node'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .15, delay: .4 });
      return gsap.fromTo(q, { v: 0 }, { v: 1, duration: 3.2, ease: 'none', repeat: -1, delay: .8, onUpdate: () => { const p = path.getPointAtLength(q.v * Lp); dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); } });
    }
  },
  road: {
    html: () => '<div class="v-road"><svg class="hills" viewBox="0 0 1200 110" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,110 80,55 160,85 260,25 360,75 440,45 520,90 600,110 680,55 760,85 860,25 960,75 1040,45 1120,90 1200,110" fill="none" stroke="#A9ABA6" stroke-width="1.2"/></svg><div class="ground"></div><div class="dash"></div><div class="car" role="img" aria-label="Porsche 911 de 1967, low-poly">' + carSVG() + '</div><div class="steps"><span>Modelar</span><span>Corregir mallas</span><span>Texturas livianas</span><b>Unity</b></div></div>',
    run(root) { const car = root.querySelector('.car'); gsap.fromTo(car, { xPercent: -150 }, { xPercent: 0, duration: 1.6, ease: 'expo.out', delay: .3 }); return reduce ? null : gsap.to(car, { y: -2, duration: .25, yoyo: true, repeat: -1, ease: 'sine.inOut' }); }
  },
  lesson: {
    html: () => '<div class="v-lesson"><div class="card"><div class="bar"><i></i></div><div class="kind"></div><div class="q"></div><div class="body"></div></div></div>',
    run(root) {
      const LS = [
        { k: 'Teoría', q: 'Una variable guarda un valor para usarlo después.', b: '<div class="code"><em>let</em> nombre = "Squeaky";</div>' },
        { k: 'Opción única', q: '¿Qué muestra un mensaje en la consola?', b: '<div class="opts"><span>alert()</span><span data-ok>console.log()</span><span>print()</span></div>' },
        { k: 'Arrastrar y soltar', q: 'Ordená las piezas de la función.', b: '<div class="opts"><span>function saludar() {</span><span>  return "hola";</span><span>}</span></div>' },
        { k: 'Escribir código', q: 'Mostrá "hola, squeaky" en la consola.', b: '<div class="code" data-code></div>' }
      ];
      const bar = root.querySelector('.bar i'), kind = root.querySelector('.kind'), q = root.querySelector('.q'), body = root.querySelector('.body');
      const tl = gsap.timeline({ repeat: -1, delay: .4 });
      LS.forEach((s, k) => {
        tl.add(() => { kind.textContent = (k + 1) + ' / 4 · ' + s.k; q.textContent = s.q; body.innerHTML = s.b; gsap.fromTo([q, body], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, stagger: .08 }); })
          .to(bar, { width: ((k + 1) / 4 * 100) + '%', duration: .6, ease: 'power2.out' });
        if (k === 1) tl.add(() => { const o = body.querySelector('[data-ok]'); if (o) o.classList.add('ok'); }, '+=1.1');
        if (k === 2) tl.add(() => { const sp = body.querySelectorAll('span'); gsap.fromTo(sp[1], { x: 50 }, { x: 0, duration: .7, ease: 'expo.out' }); }, '+=.9');
        if (k === 3) { const code = 'console.log("hola, squeaky");', c = { n: 0 };
          tl.to(c, { n: code.length, duration: 1.6, ease: 'none', onUpdate: () => { const el = body.querySelector('[data-code]'); if (el) el.innerHTML = code.slice(0, Math.round(c.n)).replace('console', '<em>console</em>') + '<u></u>'; } }, '+=.3')
            .add(() => { const el = body.querySelector('[data-code]'); if (el) el.innerHTML += '\n<span style="color:#9C9F9A">› hola, squeaky</span>'; }, '+=.3'); }
        tl.to({}, { duration: 1.6 });
      });
      tl.set(bar, { width: 0 });
      return tl;
    }
  },
  cdm: {
    html: () => '<div class="v-cdm"><div class="brw"><div class="bar"><i></i><i></i><i></i><span>cdm · centro de medicina</span></div>' + imgTag('cdm/s-hero.jpg', 'Portada del sitio de CDM Centro de Medicina') + '</div></div>',
    run(root) { gsap.fromTo(root.querySelector('.brw'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: .3 }); return null; }
  },
  pc: { html: () => '<div class="v-pc"><svg viewBox="130 120 390 490" class="pcSvg"></svg></div>', run(root, big) { if (big && isoReady) return isoAnimated(root.querySelector('svg')); return null; } }
};

