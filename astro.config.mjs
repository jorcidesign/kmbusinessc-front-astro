// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kmbusinessc.pe',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) =>
        page !== 'https://kmbusinessc.pe/about/' &&
        page !== 'https://kmbusinessc.pe/',
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
        },
      },
    }),
  ],
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

