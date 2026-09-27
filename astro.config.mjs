// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://kmbusinessc.pe',
  output: 'static',
  adapter: vercel(),
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // El usuario pidió que el español también muestre su prefijo
      // en la URL (/es/... y /en/...), no ocultar el idioma default.
      prefixDefaultLocale: true,
    },
  },
});
