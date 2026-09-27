// src/content.config.ts
//
// Content Collections de Astro 5. Mismo espíritu que data/*.ts en el
// proyecto de Mercedes (contenido tipado, sin CMS), pero con schema
// de Zod: si falta un campo obligatorio, el build falla en vez de
// romperse en producción.
//
// i18n: las colecciones que se consumen en páginas reales (`servicios`,
// `pages*`, `ui`, `faqs`) organizan sus archivos en subcarpetas
// `es/`/`en/` — el loader `glob({ pattern: '**/*.json' })` ya matchea
// subcarpetas sin cambios, así que el `id` que genera pasa a incluir
// el locale como prefijo (p.ej. "es/01-logistica-integral"). Los
// consumidores filtran con `entry.id.startsWith(`${locale}/`)`.
//
// `proceso` y `testimonios` NO se tocaron en esta migración: ningún
// componente en uso las lee hoy (solo los organismos huérfanos
// ProcessSection/ServicesSection, fuera de alcance) — se quedan tal
// cual, sin carpeta de locale, para no traducir contenido que nadie
// renderiza.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/servicios' }),
  schema: z.object({
    orden: z.number(),
    titulo: z.string(),
    subtitulo: z.string().optional(),
    badge: z.string().optional(),
    descripcion: z.string(),
    queHacemos: z.array(z.string()).optional(),
    beneficios: z.array(z.object({ titulo: z.string(), descripcion: z.string() })).optional(),
    etapas: z.array(z.object({ paso: z.string(), detalle: z.string() })).optional(),
    specs: z.record(z.string()).optional(),
    pendiente: z.string().optional(),
    icono: z.string(),
  }),
});

const proceso = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/proceso' }),
  schema: z.object({
    orden: z.number(),
    paso: z.string(),
    descripcion: z.string(),
  }),
});

const testimonios = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonios' }),
  schema: z.object({
    nombre: z.string(),
    empresa: z.string(),
    cita: z.string(),
    fotoUrl: z.string().optional(),
    // Obliga a declarar explícitamente que hay permiso del cliente
    // antes de publicar — ver Hallazgo 2 de la auditoría (testimonios
    // de ejemplo sin reemplazar). Un testimonio con consentimiento
    // en `false` no debería listarse en la página.
    consentimiento: z.boolean(),
  }),
});

// ---------- i18n: strings globales (nav, footer, whatsapp, formulario) ----------
const ui = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/ui' }),
  schema: z.object({
    skipLink: z.string(),
    logoAriaLabel: z.string(),
    localeSwitcherAriaLabel: z.string(),
    nav: z.object({
      items: z.array(z.object({ href: z.string(), label: z.string(), exact: z.boolean() })),
      ctaLabel: z.string(),
      navAriaLabel: z.string(),
      openMenuLabel: z.string(),
      closeMenuLabel: z.string(),
    }),
    footer: z.object({
      servicios: z.object({
        heading: z.string(),
        links: z.array(z.object({ href: z.string(), label: z.string() })),
      }),
      empresa: z.object({
        heading: z.string(),
        links: z.array(z.object({ href: z.string(), label: z.string() })),
      }),
      contacto: z.object({
        heading: z.string(),
        email: z.string(),
        phone: z.string(),
        phoneHref: z.string(),
        whatsappHref: z.string(),
        whatsappLabel: z.string(),
        location: z.string(),
      }),
      redes: z.object({
        heading: z.string(),
        linkedinHref: z.string(),
        linkedinLabel: z.string(),
        instagramHref: z.string(),
        instagramLabel: z.string(),
      }),
      destacado: z.object({
        heading: z.string(),
        text: z.string(),
        ctaLabel: z.string(),
        ctaHref: z.string(),
      }),
      legal: z.object({
        empresaLine: z.string(),
        rightsLine: z.string(),
      }),
    }),
    whatsapp: z.object({
      defaultMessage: z.string(),
      defaultLabel: z.string(),
      fabMessage: z.string(),
      fabTooltipTitle: z.string(),
      fabTooltipSub: z.string(),
      fabAriaLabel: z.string(),
    }),
    contactForm: z.object({
      labels: z.object({
        nombre: z.string(),
        whatsapp: z.string(),
        producto: z.string(),
        cantidad: z.string(),
        mensaje: z.string(),
        honeypot: z.string(),
      }),
      placeholders: z.object({
        nombre: z.string(),
        whatsapp: z.string(),
        producto: z.string(),
        cantidad: z.string(),
        mensaje: z.string(),
      }),
      submitLabel: z.string(),
      sendingLabel: z.string(),
      validationError: z.string(),
      successMessage: z.string(),
      errorMessage: z.string(),
    }),
    serviceDetail: z.object({
      eyebrowFallbackPrefix: z.string(),
      primaryActionLabel: z.string(),
      secondaryActionLabel: z.string(),
      scopeTag: z.string(),
      scopeTitle: z.string(),
      specsTitle: z.string(),
      deliverablesTitle: z.string(),
      benefitsTitle: z.string(),
      benefitsLead: z.string(),
      stagesTag: z.string(),
      stagesTitle: z.string(),
      stagesLead: z.string(),
      quoteTag: z.string(),
      quoteTitlePrefix: z.string(),
      quoteLead: z.string(),
      whatsappMessagePrefix: z.string(),
      whatsappLabel: z.string(),
      prevLabel: z.string(),
      nextLabel: z.string(),
      navAriaLabel: z.string(),
    }),
  }),
});

// ---------- i18n: FAQ (reemplaza el default hardcodeado de FAQSection) ----------
const faqs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: z.object({
    orden: z.number(),
    categoria: z.string(),
    preguntas: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })),
  }),
});

// ---------- i18n: copy por página (una entrada = un idioma completo) ----------
const pageHome = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages/home' }),
  schema: z.object({
    seo: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({
      heading: z.string(),
      titleFade: z.string(),
      titleRiseLines: z.tuple([z.string(), z.string()]),
      lead: z.string(),
      ctaLabel: z.string(),
      imageAlt: z.string(),
    }),
    manifiesto: z.object({
      tag: z.string(),
      title: z.string(),
      quote: z.string(),
      authorName: z.string(),
      authorRole: z.string(),
      ctaLabel: z.string(),
    }),
    splitServices: z.object({
      cell1: z.object({ title: z.string(), text: z.string(), ctaLabel: z.string() }),
      cell2: z.object({ title: z.string(), text: z.string(), ctaLabel: z.string() }),
    }),
    ruledGrid: z.object({
      title: z.string(),
      lead: z.string(),
      items: z.array(z.object({ title: z.string(), description: z.string() })),
    }),
    stats: z.object({
      items: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    contactHome: z.object({
      tag: z.string(),
      title: z.string(),
      lead: z.string(),
      whatsappLabel: z.string(),
    }),
    faq: z.object({
      title: z.string(),
      lead: z.string(),
    }),
    marqueeText: z.string(),
  }),
});

const pageNosotros = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages/nosotros' }),
  schema: z.object({
    seo: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({
      eyebrow: z.string(),
      title: z.string(),
      lead: z.string(),
      primaryActionLabel: z.string(),
      secondaryActionLabel: z.string(),
    }),
    profileCard: z.object({
      badge: z.string(),
      name: z.string(),
      role: z.string(),
      imagePlaceholder: z.string(),
      imageAlt: z.string(),
      creds: z.array(z.string()),
    }),
    manifiesto: z.object({
      tag: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
      whatsappMessage: z.string(),
      whatsappLabel: z.string(),
    }),
    principios: z.object({
      title: z.string(),
      lead: z.string(),
      items: z.array(z.object({ title: z.string(), description: z.string() })),
    }),
    contactSection: z.object({
      tag: z.string(),
      title: z.string(),
      lead: z.string(),
      whatsappLabel: z.string(),
    }),
  }),
});

const pageContacto = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages/contacto' }),
  schema: z.object({
    seo: z.object({ title: z.string(), description: z.string() }),
    header: z.object({ tag: z.string(), title: z.string(), lead: z.string() }),
    channels: z.object({
      whatsapp: z.object({
        tag: z.string(),
        description: z.string(),
        whatsappMessage: z.string(),
        buttonLabel: z.string(),
      }),
      email: z.object({
        tag: z.string(),
        description: z.string(),
        buttonLabel: z.string(),
      }),
      office: z.object({
        tag: z.string(),
        title: z.string(),
        description: z.string(),
        hours: z.string(),
      }),
    }),
    form: z.object({
      tag: z.string(),
      title: z.string(),
      lead: z.string(),
      trustPoints: z.array(z.string()),
    }),
    faqHeader: z.object({ title: z.string(), lead: z.string() }),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
});

const pageServiciosIndex = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages/servicios-index' }),
  schema: z.object({
    seo: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({
      eyebrow: z.string(),
      title: z.string(),
      lead: z.string(),
      primaryActionLabel: z.string(),
      secondaryActionLabel: z.string(),
      imageAlt: z.string(),
    }),
    catalog: z.object({
      title: z.string(),
      lead: z.string(),
      specsCtaLabel: z.string(),
      moduleFallbackPrefix: z.string(),
    }),
    process: z.object({
      tag: z.string(),
      title: z.string(),
      lead: z.string(),
      ctaLabel: z.string(),
      steps: z.array(z.object({ label: z.string(), description: z.string() })),
    }),
    closingCta: z.object({ title: z.string(), lead: z.string(), ctaLabel: z.string() }),
  }),
});

export const collections = {
  servicios,
  proceso,
  testimonios,
  ui,
  faqs,
  pageHome,
  pageNosotros,
  pageContacto,
  pageServiciosIndex,
};
