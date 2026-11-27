/* Imágenes de los proyectos. Toma solas todas las fotos de src/assets/<carpeta>/ y
   las indexa por "<carpeta>/<archivo>" (p. ej. 'bd/dashboard.jpg'), que es la ruta que
   usan projects.ts y visuals.js. Para sumar una foto alcanza con dejarla en la carpeta.
   ProjectImages.astro las pasa por astro:assets en build y publica el mapa de URLs.
   Ojo: toda foto que esté en src/assets/ se procesa y se publica, se use o no. */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{jpg,jpeg,png,webp}', { eager: true });

export const projectImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.replace('../assets/', ''), mod.default])
);
