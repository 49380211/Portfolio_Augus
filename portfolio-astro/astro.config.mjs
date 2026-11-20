// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    build: {
      // sin esto, el minificador reescribe (max-width:820px) como (width<=820px),
      // sintaxis que Safari <16.4 y Chrome <104 no entienden: se rompería todo el mobile.
      cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'],
    },
  },
});
