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
// `proceso` pasó a tener locale (es/en) a partir del rollout del mapa
// maestro SEO: la Home activa por primera vez el bloque "Cómo
// trabajamos" leyendo esta colección, así que ya no puede quedarse sin
// traducir. `testimonios` sigue sin tocar: sigue sin componente en uso.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  // Astro's glob loader usa `data.slug` como id de la entrada si el
  // campo existe (ver generateIdDefault en astro/dist/content/loaders/
  // glob.js) — eso pisaba el id basado en ruta de archivo que el resto
  // del proyecto usa para filtrar por locale (`entry.id.startsWith
  // ('es/')`), y como `slug` no lleva el prefijo de locale, es/ y en/
  // colisionaban en un solo id y la colección quedaba vacía al
  // filtrar. `generateId` explícito restaura el id basado en ruta
  // (igual que el resto de colecciones) y deja `slug` como campo de
  // datos normal, no especial.
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/servicios',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z.object({
    orden: z.number(),
    // Mismo valor en es/ y en/ (los slugs no se traducen) — reemplaza
    // los 4 mapas de slug que antes vivían hardcodeados en
    // [slug].astro (es/en) y en los templates de índice/detalle.
    slug: z.string(),
    titulo: z.string(),
    subtitulo: z.string().optional(),
    badge: z.string().optional(),
    descripcion: z.string(),

    // SEO Title / Meta Description / H1 son campos independientes a
    // propósito (ver documento SEO maestro): no deben construirse
    // automáticamente a partir de `titulo` ni de `descripcion`.
    seoTitle: z.string(),
    metaDescription: z.string(),
    h1: z.string(),
    keywordPrincipal: z.string(),
    keywordsSecundarias: z.array(z.string()).default([]),
    heroIntro: z.string(),
    ctaPrincipal: z.object({ label: z.string(), href: z.string().optional() }),
    ctaSecundario: z.object({ label: z.string(), href: z.string().optional() }).optional(),

    // Reemplaza queHacemos + beneficios + etapas: el copy real del doc
    // SEO es una secuencia de H2 con prosa o con sub-puntos titulados,
    // no tres arrays de forma fija distinta.
    secciones: z.array(z.object({
      h2: z.string(),
      cuerpo: z.string().optional(),
      items: z.array(z.object({ titulo: z.string(), texto: z.string() })).optional(),
    })).default([]),

    faqs: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })).default([]),
    serviciosRelacionados: z.array(z.string()).default([]), // slugs
    resumenBullets: z.array(z.string()).optional(), // preview corto para tarjetas (hub/home)

    specs: z.record(z.string()).optional(),
    // Antes era un string único; pasa a array porque dos servicios
    // (inspección de fábricas, flete marítimo) necesitan varios puntos
    // de advertencia distintos. Se renderiza en ServicioDetalleTemplate.
    pendiente: z.array(z.string()).optional(),
    heroImage: z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number(),
      height: z.number(),
    }).optional(),
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
        empresa: z.string(),
        correo: z.string(),
        producto: z.string(),
        servicio: z.string(),
        cantidad: z.string(),
        mensaje: z.string(),
        honeypot: z.string(),
      }),
      placeholders: z.object({
        nombre: z.string(),
        whatsapp: z.string(),
        empresa: z.string(),
        correo: z.string(),
        producto: z.string(),
        cantidad: z.string(),
        mensaje: z.string(),
      }),
      // "Servicio de interés": soporta el select nuevo, pero el doc es
      // explícito en que los campos definitivos del formulario deben
      // validarse antes de producción — no se marca como obligatorio.
      servicioOptionsLabel: z.string().optional(),
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
      specsTitle: z.string(),
      // `secciones`, `faqs` y `serviciosRelacionados` ahora vienen del
      // contenido de cada servicio (content.config.ts); este bloque
      // solo da los rótulos fijos de cada sub-sección de la página.
      pendienteLabel: z.string(),
      faqsTitle: z.string(),
      relatedTitle: z.string(),
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
    // Reemplaza `splitServices` (2 celdas con copy fija): las 5
    // tarjetas de servicio ahora se leen directo de la colección
    // `servicios`, esto solo da el título/lead de la intro del bloque.
    servicesIntro: z.object({
      title: z.string(),
      lead: z.string(),
    }),
    ruledGrid: z.object({
      title: z.string(),
      lead: z.string(),
      items: z.array(z.object({ title: z.string(), description: z.string() })),
    }),
    // Bloque "Cómo trabajamos": solo el título — los 4 pasos en sí
    // vienen de la colección `proceso`, no de este JSON de página.
    comoTrabajamos: z.object({
      title: z.string(),
    }),
    // `stats` (cifras "10+"/"100%"/"FCL") se eliminó: el documento SEO
    // prohíbe publicar cifras de la empresa sin confirmación de
    // Kattya. Su contenido queda cubierto por `ruledGrid` + el nuevo
    // bloque "Cómo trabajamos" (colección `proceso`).
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
