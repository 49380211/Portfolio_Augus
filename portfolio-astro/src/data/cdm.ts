/* Imágenes de CDM. La clave es la misma ruta que ya usaban projects.js y visuals.js;
   CdmImages.astro las pasa por astro:assets en build y publica el mapa de URLs.
   atrio.jpg e isotipo.png están en src/assets/cdm/ pero hoy no se usan en ningún lado,
   así que quedan afuera para no procesarlas al vacío. */
import type { ImageMetadata } from 'astro';

import mHero from '../assets/cdm/m-hero.jpg';
import sHero from '../assets/cdm/s-hero.jpg';
import sNos from '../assets/cdm/s-nos.jpg';
import sTurno from '../assets/cdm/s-turno.jpg';
import sTx from '../assets/cdm/s-tx.jpg';

export const cdmImages: Record<string, ImageMetadata> = {
  'cdm/m-hero.jpg': mHero,
  'cdm/s-hero.jpg': sHero,
  'cdm/s-nos.jpg': sNos,
  'cdm/s-turno.jpg': sTurno,
  'cdm/s-tx.jpg': sTx,
};
