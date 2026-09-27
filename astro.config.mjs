// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://kmbusinessc.pe',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
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
