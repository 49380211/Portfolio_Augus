(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vw = () => window.innerWidth, vh = () => window.innerHeight;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad2 = n => String(n).padStart(2, '0');
  const mob = () => vw() < 820;
  const INK = '#121613', PAPER = '#FAFAF8', ACC = '#FF611A';
  gsap.registerPlugin(ScrollTrigger);
  // aparición al entrar en pantalla (IntersectionObserver: funciona también dentro de visores que no scrollean la ventana)
  const onView = (el, cb, th) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { io.disconnect(); cb(); } }); }, { threshold: th || .12 });
    io.observe(el);
  };

  /* ---------- scroll suave ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = sel => { const el = document.querySelector(sel); if (!el) return; lenis ? lenis.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  document.querySelectorAll('[data-to]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); closeSheet(); scrollTo(a.dataset.to); }));

  /* ---------- dibujos de línea ---------- */
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
  const V = {
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
      html: () => '<div class="v-cdm"><div class="brw"><div class="bar"><i></i><i></i><i></i><span>cdm · centro de medicina</span></div><img src="cdm/s-hero.jpg" alt="Portada del sitio de CDM Centro de Medicina" loading="lazy"></div></div>',
      run(root) { gsap.fromTo(root.querySelector('.brw'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: .3 }); return null; }
    },
    pc: { html: () => '<div class="v-pc"><svg viewBox="130 120 390 490" class="pcSvg"></svg></div>', run(root, big) { if (big && window.__iso) return window.__iso(root.querySelector('svg')); return null; } }
  };

  /* ---------- proyectos (fuente: informe + adenda) ---------- */
  const P = [
    { id: 'bd', name: 'BuildData', cat: 'Producto', year: '2026', team: 'Equipo de 3', ctx: 'Proyecto final TIC', role: 'Planificación, producto y UX', card: 'dash', vis: 'pipe',
      line: '«Menos información perdida. Más control. Mejores decisiones.»',
      rows: [['Problema', 'En las obras, avances, faltantes y demoras se pierden entre grupos de WhatsApp, audios y fotos.'],
             ['Idea', 'Usar WhatsApp como entrada y ordenar cada mensaje en tareas, alertas y un dashboard por obra.'],
             ['Mi parte', 'Planificación del proyecto, diseño del producto y experiencia de usuario: flujos, dashboard, cronograma, identidad visual y presentación.'],
             ['Recorrido', 'Participé en todas las etapas: desde identificar la necesidad hasta diseñar una solución funcional.'],
             ['Equipo', 'Proyecto final TIC 2026, de a tres. Backend: Facundo Jarma.'],
             ['Estado', 'Demo en octubre de 2026; varias funciones siguen en desarrollo. El flujo de arriba es la propuesta.']],
      tags: 'Figma · Notion · Sprints' },
    { id: 'ro', name: 'Rolling On', cat: 'Juego 3D', year: '4.º año', team: 'Grupal', ctx: 'TIC · Blender + Unity', role: 'Modelado 3D: auto y cactus', card: 'road', vis: 'road',
      line: 'Manejar por una ruta infinita: relajación, viaje, música y amistad, en low-poly.',
      rows: [['Mi parte', 'Modelé en Blender un Porsche 911 de 1967, con interior. Más de un mes, completando lo que el tutorial no cubría.'],
             ['Problema', 'Al pasarlo a Unity aparecieron caras invertidas y superficies rotas: corregí la geometría, cerré huecos y usé Solidify.'],
             ['Texturas', 'Pesaban demasiado; las cambié por una paleta liviana, acorde al low-poly.'],
             ['Cactus', 'La idea y los bocetos fueron del equipo; el modelado y el Texture Paint, míos.']],
      tags: 'Blender · Unity · Texture Paint' },
    { id: 'sq', name: 'SqueakyJS', cat: 'Edtech', year: '3.º año', team: 'Proyecto académico', ctx: 'TIC', role: 'Lecciones, ejercicios y mascota', card: 'lesson', vis: 'lesson',
      line: 'Una web para aprender JavaScript jugando, con una mascota que acompaña.',
      rows: [['Lección', 'Teoría y práctica: opción única, selección múltiple, arrastrar y soltar y dos ejercicios de escribir código.'],
             ['Squeaky', 'La mascota hace el aprendizaje más cercano y acompaña el progreso.'],
             ['Producto', 'Relato de problema a solución y un Business Model Canvas, pensando en jóvenes y emprendedores.'],
             ['Estado', 'Proyecto académico de 3.º año. Retos y logros quedaron como propuesta.']],
      tags: 'UX · JavaScript · Business Model Canvas' },
    { id: 'cdm', name: 'CDM · Centro de Medicina', cat: 'Web + identidad', year: 'En curso', team: 'Centro médico', ctx: 'CABA', role: 'Diseño web, marca y desarrollo', card: 'cdm', vis: 'cdm',
      link: 'https://claude.ai/artifact/Xv43fkoKFFTck52aGmh32S',
      gallery: [['b', 'cdm/s-nos.jpg', 'Nosotros: tarjetas que se apilan al scrollear'], ['b', 'cdm/s-tx.jpg', 'Tratamientos por categoría'], ['duo', 'cdm/s-turno.jpg', 'Pedido de turno paso a paso', 'cdm/m-hero.jpg']],
      line: 'Sitio web para un centro de ginecología, prevención y estética no quirúrgica en CABA.',
      rows: [['Concepto', '«La claraboya»: el atrio del edificio ocupa toda la pantalla y, al scrollear, se cierra en el arco de la marca. Imagen grande, poco texto, mucho aire.'],
             ['Marca', 'Isotipo CDM y una paleta cálida de papel, nude, rosa y terracota. Tipografías Jost y Montserrat.'],
             ['Sitio', 'Tarjetas que se apilan, un manifiesto que se completa palabra por palabra, tratamientos por categoría, novedades en carrusel y pedido de turno paso a paso, con calendario.'],
             ['Giro', 'Nació como «Centro de la Mujer» y pasó a «Centro de Medicina», para un público más amplio.'],
             ['Estado', 'En desarrollo.']],
      tags: 'Diseño web · Identidad · GSAP' },
    { id: 'pc', name: 'Armar una PC', cat: 'Hardware', year: 'Personal', team: 'Interés', ctx: 'Hardware', role: 'Selección y armado', card: 'pc', vis: 'pc',
      line: 'Desarmar para entender cómo se arma.',
      rows: [['Qué', 'Elegir y compatibilizar CPU, GPU, refrigeración, memoria, fuente y almacenamiento.'],
             ['Por qué', 'Entender cada pieza para que el conjunto funcione.']],
      tags: 'Interés personal' }
  ];

  /* ---------- despiece de la PC (fuente común) ---------- */
  (function () {
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
  const parts = [
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
  const exOf = p => ({ x: (p.ex[0] - p.ex[1]) * .866 * S, y: (p.ex[0] + p.ex[1]) * .5 * S - p.ex[2] * S });
  partEls.forEach((el, i) => gsap.set(el, exOf(parts[i])));
  const piecesEl = document.getElementById('pieces'), stateEl = document.getElementById('state');


    const src = iso.innerHTML;
    window.__isoStatic = svg => { svg.innerHTML = src; svg.querySelectorAll('.part').forEach(p => { p.removeAttribute('transform'); p.removeAttribute('style'); p.removeAttribute('data-svg-origin'); }); svg.querySelectorAll('.lbl, #stamp').forEach(n => n.remove()); svg.querySelectorAll('[id]').forEach(n => n.removeAttribute('id')); svg.querySelectorAll('text').forEach(n => n.setAttribute('font-size', '22')); };
    window.__iso = svg => {
      svg.setAttribute('viewBox', '0 0 700 640'); svg.innerHTML = src; svg.querySelectorAll('#stamp').forEach(n => n.remove());
      svg.querySelectorAll('.lbl text').forEach(n => { n.setAttribute('font-size', '20'); });
      const els = [...svg.querySelectorAll('.part')];
      els.forEach((el, i) => gsap.set(el, exOf(parts[i])));
      gsap.fromTo(svg.querySelectorAll('.ln'), { attr: { 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 1.2, ease: 'power2.inOut', stagger: .004, delay: .3 });
      els.forEach((el, i) => gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'expo.inOut', delay: 1.6 + i * .12 }));
      els.forEach(el => gsap.to(el.querySelector('.lbl'), { opacity: 0, duration: .3, delay: 1.7 }));
      return null;
    };
  })();

  /* ---------- mail: copia la dirección y abre el correo si se puede ---------- */
  const toast = document.getElementById('toast'); let toastT;
  const say = html => { toast.innerHTML = html; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 2600); };
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const mail = a.getAttribute('href').slice(7);
    const ok = () => say('<b>✓</b> Copiado: ' + mail);
    try { navigator.clipboard.writeText(mail).then(ok, () => say('Escribime a <b>' + mail + '</b>')); } catch (er) { say('Escribime a <b>' + mail + '</b>'); }
    try { window.open(a.href, '_blank', 'noopener'); } catch (er) {}
    if (a.classList.contains('hb')) gsap.fromTo(a.querySelectorAll('span'), { yPercent: 0 }, { yPercent: -18, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1, stagger: .03 });
  }));

  /* ---------- frases grandes: cada palabra pasa de gris claro a tinta según cuánto bajaste ---------- */
  const DARK = [];
  document.querySelectorAll('.intro .big, .about .big').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/(<[^>]+>)|([^\s<]+)/g, (m, tag, w) => tag ? tag : '<span class="wd">' + w + '</span>');
    const ws = [...el.querySelectorAll('.wd')];
    const KEY = ['organización', 'análisis', 'entender', 'ordenarlas'];
    ws.forEach(w => { const k = w.textContent.toLowerCase().replace(/[^a-záéíóúñ]/g, ''); w.dataset.base = KEY.includes(k) ? 'acc' : (w.closest('em') ? 'muted' : 'ink'); });
    DARK.push({ el, ws, last: -1 });
  });
  const mix = (a, b, k) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',') + ')';
  const C_LIGHT = [205, 207, 202], C_INK = [18, 22, 19], C_MUTED = [139, 142, 137], C_ACC = [255, 97, 26];
  function darkFrame() {
    const H = vh();
    DARK.forEach(d => {
      const r = d.el.getBoundingClientRect();
      const p = reduce ? 1 : clamp((H * .88 - r.top) / (r.height + H * .38), 0, 1);
      if (Math.abs(p - d.last) < .002) return; d.last = p;
      const N = d.ws.length, span = 3;
      d.ws.forEach((w, i) => { const k = clamp((p * (N + span) - i) / span, 0, 1); w.style.color = mix(C_LIGHT, w.dataset.base === 'acc' ? C_ACC : w.dataset.base === 'muted' ? C_MUTED : C_INK, k); });
    });
  }

  /* ---------- carrusel ---------- */
  const track = document.getElementById('track');
  P.forEach((p, i) => {
    const a = document.createElement('article'); a.className = 'proj';
    a.innerHTML = '<button class="vis" aria-label="Abrir ' + p.name + '">' + V[p.card].html() + '</button><div class="meta"><span>' + (i + 1) + '</span><span class="nm"><b>' + p.name + '</b> <span>(' + p.cat + ')</span></span><span>' + p.year + '<br><span class="gray">' + p.team + '</span></span><span class="rl"><span>Rol</span>' + p.role + '</span></div>';
    track.appendChild(a); p.el = a;
    const vis = a.querySelector('.vis');
    if (p.card === 'pc') window.__isoStatic(vis.querySelector('svg'));
    else if (p.card !== 'dash') onView(a, () => V[p.card].run(vis), .2);
    vis.addEventListener('click', e => { if (drag.moved) { e.preventDefault(); return; } openCase(i, e); });
  });
  const drag = { on: false, x: 0, sx: 0, cur: 0, tgt: 0, v: 0, moved: false, min: 0 };
  const bounds = () => { drag.min = Math.min(0, vw() - track.scrollWidth); if (window.sizeWorkRef) window.sizeWorkRef(); };
  bounds(); window.addEventListener('resize', bounds);
  window.addEventListener('pointermove', e => { pm.x = e.clientX; pm.y = e.clientY; }, { passive: true });
  const work = document.getElementById('proyectos');
  function sizeWork() { const dist = Math.max(0, track.scrollWidth - vw()); work.style.height = (vh() + dist * 1.15) + 'px'; }
  sizeWork(); window.sizeWorkRef = sizeWork; window.addEventListener('resize', sizeWork); window.addEventListener('load', sizeWork);

  /* ---------- cinta ---------- */
  const mq = document.getElementById('marq');
  const unit = '<span class="title">Tecnología <i>·</i> Producto <i>·</i> Procesos <i>·</i></span>';
  mq.innerHTML = unit.repeat(4);
  let mqx = 0, mqv = 0;

  /* ---------- pastilla de arrastre ---------- */
  const pill = document.getElementById('pill'); const pm = { x: vw() / 2, y: vh() / 2 }, pp = { x: 0, y: 0, s: 0 };
  let overTrack = false, overVis = false;
  track.addEventListener('pointerenter', () => { overTrack = true; }); track.addEventListener('pointerleave', () => { overTrack = false; });
  track.addEventListener('pointerover', e => { overVis = !!e.target.closest('.vis'); });

  const hero = document.querySelector('.hero');

  /* ---------- caso de estudio ---------- */
  const sheet = document.getElementById('sheet'), sVis = document.getElementById('sVis');
  let openI = -1, run = null, origin = [50, 50];
  function openCase(i, e, src) {
    const p = P[i]; openI = i; p.src = src || null;
    document.getElementById('sNum').textContent = pad2(i + 1) + ' / ' + pad2(P.length) + ' — ' + p.cat;
    document.getElementById('sTitle').innerHTML = p.name.split(' ').map(w => '<span class="wd">' + w.split('').map(c => '<span class="c">' + c + '</span>').join('') + '</span>').join(' ');
    document.getElementById('sLine').textContent = p.line;
    document.getElementById('sFacts').innerHTML = '<div><span>Año</span>' + p.year + '</div><div><span>Contexto</span>' + p.team + ' · ' + p.ctx + '</div><div><span>Rol</span>' + p.role + '</div>';
    document.getElementById('sRows').innerHTML = p.rows.map(r => '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>').join('');
    document.getElementById('sTags').innerHTML = p.tags + (p.link ? '<a class="s-link" href="' + p.link + '" target="_blank" rel="noopener">Ver el sitio ↗</a>' : '');
    sVis.innerHTML = V[p.vis].html();
    const brw = (src, cap) => '<figure style="margin:0"><div class="brw"><div class="bar"><i></i><i></i><i></i><span>cdm · centro de medicina</span></div><img src="' + src + '" alt="' + cap + '" loading="lazy"></div><figcaption>' + cap + '</figcaption></figure>';
    document.getElementById('sGal').innerHTML = (p.gallery || []).map(g => g[0] === 'duo' ? '<div class="duo">' + brw(g[1], g[2]) + '<figure style="margin:0"><div class="phone"><img src="' + g[3] + '" alt="El sitio en el celular" loading="lazy"></div><figcaption style="text-align:center">En el celular</figcaption></figure></div>' : brw(g[1], g[2])).join('');
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
  function closeSheet(scrolled) {
    if (openI < 0) return; const i = openI; openI = -1;
    const r = (P[i].src || P[i].el.querySelector('.vis')).getBoundingClientRect();
    gsap.to(sheet.querySelector('.in'), { y: scrolled === true ? -vh() * .12 : 0, opacity: .3, duration: reduce ? 0 : 1, ease: 'expo.inOut' });
    gsap.to(sheet, { clipPath: 'inset(' + r.top + 'px ' + (vw() - r.right) + 'px ' + (vh() - r.bottom) + 'px ' + r.left + 'px)', duration: reduce ? 0 : 1, ease: 'expo.inOut',
      onComplete: () => { gsap.set(sheet, { visibility: 'hidden' }); gsap.set(sheet.querySelector('.in'), { clearProps: 'all' }); if (run && run.kill) run.kill(); run = null; sVis.innerHTML = ''; EX.acc = 0; EX.closing = false; } });
    document.body.classList.remove('lock'); if (lenis) lenis.start();
    P[i].el.querySelector('.vis').focus({ preventScroll: true });
  }
  document.getElementById('sClose').addEventListener('click', () => closeSheet());
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  const EX = { acc: 0, t: 0, closing: false };
  const atBottom = () => sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 4;
  function exitPush(d, ev) {
    if (openI < 0 || EX.closing) return;
    if (d > 0 && atBottom()) { if (ev && ev.cancelable) ev.preventDefault(); EX.acc = Math.min(520, EX.acc + Math.min(d, 90)); }
    else if (d < 0) EX.acc = Math.max(0, EX.acc + d * 2);
    EX.t = performance.now();
    if (EX.acc >= 520) { EX.closing = true; closeSheet(true); }
  }
  sheet.addEventListener('wheel', e => exitPush(e.deltaY, e), { passive: false });
  let sy0 = null;
  sheet.addEventListener('touchstart', e => { sy0 = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchmove', e => { if (sy0 === null) return; const y = e.touches[0].clientY; exitPush((sy0 - y) * 2.2); sy0 = y; }, { passive: true });

  /* ---------- lápiz ---------- */
  const pencil = document.getElementById('pencil');
  const pen = { x: vw() * .7, y: -200, a: -40, s: .55, vx: 0, vy: 0, va: 0 };
  const penShadow = document.getElementById('penShadow'), heroH1 = document.querySelector('.hero h1');
  let lastY = 0, sv = 0;

  /* ---------- bucle ---------- */
  const t0 = performance.now();
  gsap.ticker.add(() => {
    const now = performance.now(), t = (now - t0) / 1000;
    const sy = lenis ? lenis.scroll : window.scrollY; sv = lerp(sv, sy - lastY, .2); lastY = sy;

    // carrusel con inercia y leve inclinación según la velocidad
    // carrusel: la posición sale de cuánto bajaste dentro de la sección
    const wr = work.getBoundingClientRect(), wp = clamp(-wr.top / Math.max(1, wr.height - vh()), 0, 1);
    const prev = drag.cur; drag.cur = lerp(drag.cur, wp * Math.min(0, vw() - track.scrollWidth), reduce ? 1 : .14); drag.v = drag.cur - prev;
    document.getElementById('workBar').style.transform = 'scaleX(' + wp.toFixed(3) + ')';
    const wc = 'workCount', ci = Math.min(P.length, Math.round(wp * (P.length - 1)) + 1); const wce = document.getElementById(wc); if (wce.dataset.v != ci) { wce.dataset.v = ci; wce.textContent = pad2(ci) + ' / ' + pad2(P.length); }
    track.style.transform = 'translate3d(' + drag.cur.toFixed(1) + 'px,0,0)';
    const sk = clamp(drag.v * .12, -3, 3);
    P.forEach(p => { p.el.querySelector('.vis').style.transform = 'skewX(' + (-sk).toFixed(2) + 'deg) scale(' + (1 - Math.min(Math.abs(drag.v) * .002, .04)).toFixed(3) + ')'; });

    // cinta: avanza sola y se acelera con el scroll
    mqv = lerp(mqv, 1 + Math.abs(sv) * .35, .1); mqx -= mqv * (reduce ? 0 : 1);
    const uw = mq.firstChild.offsetWidth; if (uw && -mqx > uw) mqx += uw;
    mq.style.transform = 'translate3d(' + mqx.toFixed(1) + 'px,0,0)';

    darkFrame();

    // pastilla
    const showPill = overTrack && overVis && openI < 0;
    pp.x = lerp(pp.x, pm.x, .25); pp.y = lerp(pp.y, pm.y, .25); pp.s = lerp(pp.s, showPill ? 1 : 0, .18);
    pill.textContent = 'Abrir';
    pill.style.transform = 'translate(' + pp.x.toFixed(1) + 'px,' + pp.y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + pp.s.toFixed(3) + ')';


    // tarjetas de "Cómo trabajo": la de atrás se achica y oscurece cuando la tapa la siguiente
    pcards.forEach((c, k) => { const nx = pcards[k + 1]; if (!nx) return; const r = c.getBoundingClientRect(), n = nx.getBoundingClientRect();
      const o = clamp((r.bottom - n.top) / r.height, 0, 1); c.style.transform = 'scale(' + (1 - o * .06).toFixed(4) + ')'; c.lastChild.style.opacity = (o * .35).toFixed(3); });

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

    // barra de salida del caso
    if (openI >= 0) { if (!EX.closing && now - EX.t > 260) EX.acc *= .9; document.getElementById('exitBar').style.transform = 'scaleX(' + (EX.acc / 520).toFixed(3) + ')'; if (!EX.closing) sheet.querySelector('.in').style.transform = 'translate3d(0,' + (-EX.acc / 520 * 60).toFixed(1) + 'px,0)'; }
  });

  /* ---------- apariciones al scrollear ---------- */
  function reveals() {
    gsap.utils.toArray('.intro .body p, .work h2, .about .cols > div, .about .cv h3, .about .cv .r, .foot .row > *').forEach(el => {
      gsap.set(el, { y: 40, opacity: 0 }); onView(el, () => gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }));
    });
    gsap.set('.proj', { x: 120, opacity: 0 }); onView(document.getElementById('track'), () => gsap.to('.proj', { x: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: .08 }));
    gsap.set('.foot .hb span', { yPercent: 100, opacity: 0 }); onView(document.querySelector('.foot'), () => gsap.to('.foot .hb span', { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .04 }), .05);
    // la cartelita: las letras se acomodan solas, como en un tablero
  }

  /* ---------- arranque ---------- */
  /* ---------- portada: lápices y tarjetas ---------- */
  // lápices parados como pasto: distintos largos, colores del portfolio, levemente inclinados
  function pencilField(svg, seed) {
    let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const cols = [['#FF611A', '#D9520F'], ['#1C201D', '#000'], ['#E8E2D2', '#CFC7B2'], ['#8B8E89', '#6E716C'], ['#FF611A', '#D9520F'], ['#F4F4F1', '#D8D9D3']];
    let html = '';
    const n = 13;
    for (let k = 0; k < n; k++) {
      const x = 14 + k * (290 / n) + rnd() * 16, h = 110 + rnd() * 190 * (1 - k / n * .55), w = 11 + rnd() * 4, a = -12 + rnd() * 24 - k * .6, c = cols[Math.floor(rnd() * cols.length)];
      const top = 320 - h, tip = w * 1.7;
      html += '<g transform="rotate(' + a.toFixed(1) + ' ' + x.toFixed(1) + ' 320)"><g class="pc">'
        + '<rect x="' + (x - w / 2).toFixed(1) + '" y="' + (top + tip).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (h - tip + 4).toFixed(1) + '" fill="' + c[0] + '" stroke="rgba(18,22,19,.25)" stroke-width=".6"/>'
        + '<rect x="' + (x - w / 2).toFixed(1) + '" y="' + (top + tip).toFixed(1) + '" width="' + (w * .32).toFixed(1) + '" height="' + (h - tip + 4).toFixed(1) + '" fill="#fff" opacity=".18"/>'
        + '<rect x="' + (x + w * .16).toFixed(1) + '" y="' + (top + tip).toFixed(1) + '" width="' + (w * .34).toFixed(1) + '" height="' + (h - tip + 4).toFixed(1) + '" fill="' + c[1] + '" opacity=".35"/>'
        + '<polygon points="' + (x - w / 2).toFixed(1) + ',' + (top + tip).toFixed(1) + ' ' + (x + w / 2).toFixed(1) + ',' + (top + tip).toFixed(1) + ' ' + x.toFixed(1) + ',' + top.toFixed(1) + '" fill="#E6CDA4" stroke="rgba(18,22,19,.25)" stroke-width=".6"/>'
        + '<polygon points="' + (x - w * .17).toFixed(1) + ',' + (top + tip * .34).toFixed(1) + ' ' + (x + w * .17).toFixed(1) + ',' + (top + tip * .34).toFixed(1) + ' ' + x.toFixed(1) + ',' + top.toFixed(1) + '" fill="#232522"/>'
        + '</g></g>';
    }
    svg.innerHTML = html;
    return [...svg.querySelectorAll('.pc')];
  }
  const fieldL = [], fieldR = [], pics = [];
  const pcards = [...document.querySelectorAll('.pcard')];
  pcards.forEach(c => { const s = document.createElement('i'); s.className = 'shade'; c.appendChild(s); });

  /* ---------- entrada ---------- */
  function split() { document.querySelectorAll('.hero h1 .l').forEach((l, k) => { const s = l.textContent; l.innerHTML = s.split('').map((c, j) => '<span class="c' + (k === 1 && j === s.length - 1 ? ' o' : '') + '">' + c + '</span>').join(''); }); }
  function sway(els) { els.forEach(el => gsap.to(el, { transformOrigin: '50% 100%', rotate: gsap.utils.random(-3, 3), duration: gsap.utils.random(2.2, 3.6), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: gsap.utils.random(0, 1) })); }
  function settle() {
    document.body.classList.remove('loading');
    reveals(); ScrollTrigger.refresh(); bounds();
    if (lenis) lenis.start();
  }
  function intro() {
    split();
    const h1 = heroH1;
    if (reduce) { h1.style.visibility = 'visible'; gsap.set(pencil, { opacity: 1 }); settle(); return; }
    gsap.set([...fieldL, ...fieldR], { yPercent: 105 });
    gsap.set(pics, { yPercent: 140, rotate: i => (i % 2 ? 5 : -5) });
    gsap.set(h1, { scale: mob() ? 1.45 : 1.75, transformOrigin: '50% 55%' });
    h1.style.visibility = 'visible';
    const tl = gsap.timeline({ onComplete: settle });
    tl.fromTo('.hero h1 .c', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .02 }, .05)
      .to(h1, { scale: 1, duration: 1.25, ease: 'expo.inOut' }, .35)
      .fromTo('.hdr > *', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .06 }, 1.25)
      .fromTo('.hero .tag', { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2)' }, 1.3)
      .fromTo('.hero .sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, 1.38)
      // los lápices brotan desde abajo, de afuera hacia el centro, y quedan meciéndose
      .to(fieldL, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .045 }, 1.4)
      .to([...fieldR].reverse(), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .045 }, 1.45)
      .add(() => sway([...fieldL, ...fieldR]), 2.3)
      // las tarjetas suben una por una, inclinadas
      .to(pics, { yPercent: 0, rotate: i => (i % 2 ? 2.5 : -2.5), duration: 1, ease: 'back.out(1.4)', stagger: .09 }, 1.6)
      // el lápiz grande cae y se apoya sobre el nombre
      .add(() => { pen.y = -300; pen.a = -40; pen.vx = pen.vy = pen.va = 0; gsap.to(pencil, { opacity: 1, duration: .3 }); }, 1.75);
  }
  if (lenis) lenis.stop();
  Promise.race([Promise.all([document.fonts.load('800 100px "Archivo"'), document.fonts.load('500 20px "Hanken Grotesk"')]).catch(() => {}), new Promise(r => setTimeout(r, 2500))]).then(intro);
})();
