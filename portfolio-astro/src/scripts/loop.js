/* Un solo bucle por frame, en el mismo orden que tenía el script original. */
import { lerp } from './utils.js';
import { lenis } from './scroll.js';
import { updateWork } from './work-carousel.js';
import { updateMarquee } from './marquee.js';
import { darkFrame } from './words.js';
import { updatePill } from './pill.js';
import { updateProcessCards } from './process-cards.js';
import { updatePencil } from './pencil.js';
import { updateExit, getOpenI } from './case-sheet.js';

const t0 = performance.now();
let lastY = 0, sv = 0;

export function startLoop() {
  gsap.ticker.add(() => {
    const now = performance.now(), t = (now - t0) / 1000;
    const sy = lenis ? lenis.scroll : window.scrollY; sv = lerp(sv, sy - lastY, .2); lastY = sy;
    const f = { now, t, sy, sv, openI: getOpenI() };

    updateWork(f);
    updateMarquee(f);
    darkFrame();
    updatePill(f);
    updateProcessCards();
    updatePencil(f);
    updateExit(f);
  });
}
