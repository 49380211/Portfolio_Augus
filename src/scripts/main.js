/* Punto de entrada: arranca cada módulo en el mismo orden que el script original. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScroll, initNavLinks, lenis } from './scroll.js';
import { initIso } from './iso.js';
import { initCopy } from './copy.js';
import { initWords } from './words.js';
import { initWork, track } from './work-carousel.js';
import { initPill } from './pill.js';
import { initMarquee } from './marquee.js';
import { initProcessCards } from './process-cards.js';
import { initCaseSheet, openCase, closeSheet } from './case-sheet.js';
import { initPencil } from './pencil.js';
import { startLoop } from './loop.js';
import { intro } from './intro.js';

gsap.registerPlugin(ScrollTrigger);

initScroll();
initNavLinks(closeSheet);
initIso();            // antes del carrusel: la tarjeta de la PC clona este SVG
initCopy();
initWords();
initWork(openCase);
initPill(track);
initMarquee();
initCaseSheet();
initPencil();
initProcessCards();
startLoop();

if (lenis) lenis.stop();
Promise.race([Promise.all([document.fonts.load('800 100px "Archivo"'), document.fonts.load('500 20px "Hanken Grotesk"')]).catch(() => {}), new Promise(r => setTimeout(r, 2500))]).then(intro);
