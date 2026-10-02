# AGENTS.md — KM Business Consulting SAC

Guía para cualquier agente (Claude Code u otro) o desarrollador que
retome este repo. Léelo entero antes de tocar código — la mitad de
las reglas de abajo existen porque ya se rompieron una vez en el
sitio anterior (Wix) y están documentadas en la auditoría del
proyecto (ver `PROJECT_CONTEXT.md`).

## Stack

- **Astro 5** (`output` por defecto, es decir estático) + TypeScript estricto.
- **CSS vanilla** con Custom Properties como design tokens — sin
  Tailwind, sin CSS-in-JS, sin preprocesador. Es una decisión, no un
  olvido: todo el sistema de diseño vive en `src/styles/tokens/`.
- **Vercel** (`@astrojs/vercel`) como adapter para CI/CD, solo para la
  única ruta dinámica del sitio (`src/pages/api/contacto.ts`). El resto
  es HTML estático.
- Cero frameworks de UI (React/Vue/Svelte). Las islas interactivas
  (formulario, futuro menú móvil) son TypeScript vanilla, con el
  mismo criterio del proyecto hermano `mercedes-portfolio`: lógica
  compleja en un `.ts` aparte del `.astro`, no todo en un
  `<script>` inline.

## Comandos

```bash
npm install
npm run dev       # servidor local con HMR
npm run check     # astro check — valida tipos y props de Content Collections
npm run build     # astro check + astro build
npm run preview   # sirve el build de producción localmente
```

Antes de cualquier PR o entrega: `npm run build` tiene que pasar sin
errores. `astro check` valida también los props de los `.astro`, no
solo TypeScript puro.

## Estructura y dónde va cada cosa

```
src/
├── components/
│   ├── atoms/        # no conocen datos de negocio; reciben todo por props
│   ├── molecules/     # agrupan átomos; pueden tener lógica de UI simple
│   └── organisms/     # arman secciones completas; leen Content Collections
├── layouts/           # BaseLayout — SEO real (server-rendered), Header, Footer
├── pages/              # rutas por archivo; pages/api/ = únicas rutas dinámicas
├── content/            # datos tipados (servicios, proceso, testimonios)
├── content.config.ts   # schemas Zod de lo de arriba — NO se salta
├── styles/tokens/       # ÚNICO lugar con valores de diseño (color, tipografía, spacing...)
├── services/           # llamadas fetch desde el cliente (ej. contactService.ts)
├── lib/                 # utilidades puras (analytics.ts, scrollReveal.ts)
└── assets/              # imágenes que SÍ pasan por el optimizador de Astro
```

Regla dura: un átomo o una molécula nunca importa directamente de
`src/content/`. Solo los organismos leen `getCollection()` y pasan los
datos hacia abajo por props. Así un átomo/molécula se puede reusar en
cualquier contexto sin arrastrar el acoplamiento a Content Collections.

## Convención de nombres (heredada de mercedes-portfolio)

BEM con prefijo por nivel atómico: `a-` átomos, `m-` moléculas,
`o-` organismos. Ejemplo: `.o-hero-personal__title--accent`.

## Reglas de diseño (no negociables)

1. **Ningún color, tamaño de fuente, espaciado o curva de animación
   se escribe a mano dentro de un componente.** Todo sale de
   `src/styles/tokens/*.css`. Si necesitas un valor que no existe,
   se agrega como token nuevo, no como número suelto en el `.astro`.
2. **Los tokens de color y tipografía son la identidad final**,
   entregada por el diseñador (paleta `#ffffff #3fb3e4 #000000
   #9cbecd #555557 #e7edf0` + tipografía Poppins). Viven SOLO en
   `tokens/colors.css` y `tokens/typography.css` (más `base/fonts.css`
   para los `@font-face`) — si un futuro cambio de paleta/fuente
   obliga a tocar algo más, es señal de que ese componente rompió la
   regla 1. (Los archivos `_colors.css`/`_typography.css` con prefijo
   `_` son un sistema de tokens anterior, ya no se importan desde
   `main.css` — no editarlos, son código muerto.)
3. **Nada de motion por motion.** Un solo patrón de reveal al hacer
   scroll (`data-reveal`, ver `src/lib/scrollReveal.ts`), hover en
   botones/tarjetas, y ya. Nada de físicas de scroll, cursores
   personalizados ni WebGL — eso tenía sentido en un portfolio
   editorial (`mercedes-portfolio`), no en un sitio B2B donde el 83%
   del tráfico es celular y el objetivo es que alguien escriba por
   WhatsApp rápido.

   **Excepción puntual:** el hero del home (`HeroKattya.astro` +
   `src/lib/heroKattyaScroll.ts`) liga `opacity`/`transform` a una
   custom property (`--p`, 0→1) calculada en scroll/resize, a pedido
   explícito de Kattya para el efecto de dos titulares con su foto.
   No es scroll-jacking ni un motor de física: es la misma idea de
   `scrollReveal.ts` pero continua en vez de on/off. Reglas que sigue
   cumpliendo igual que el resto del sitio: sin JS o con
   `prefers-reduced-motion: reduce` se ve el estado final completo (no
   hay contenido oculto que dependa del script), y no se replica este
   patrón en otro componente sin repasar esta nota primero.
4. **`prefers-reduced-motion` siempre respetado** (ya resuelto a
   nivel global en `main.css`, no lo dupliques por componente).

## Reglas de contenido (por qué existen)

- **Ningún testimonio se publica sin `consentimiento: true`** en su
  JSON (ver el schema en `content.config.ts` y el README de
  `src/content/testimonios/`). El sitio anterior tenía 3 testimonios
  de plantilla en inglés con nombre falso — no se repite.
- **Ninguna cifra de credencial** (años de experiencia, número de
  clientes) se publica sin que Kattya la haya confirmado. Ver el
  flag `MOSTRAR_150_CLIENTES` en `AboutKattya.astro` como ejemplo del
  patrón: agregar el dato pero mantenerlo apagado hasta confirmar.
- Cualquier texto marcado `PENDIENTE` o `BORRADOR` en el código no es
  contenido final — no se despliega a producción sin que Renzo lo
  revise primero.

## SEO — por qué el layout es como es

`BaseLayout.astro` imprime `<title>`, `<meta description>` y Open
Graph directamente en el HTML que sirve el servidor/build, no con
JavaScript después de cargar. Esto es intencional: es la corrección
al problema real que tenía el sitio anterior (ver Hallazgo 6 y el
anexo técnico de la auditoría — título genérico "New page", sin
meta description, sin H1). Cualquier página nueva que se agregue
DEBE pasar `title` y `description` como props al `BaseLayout`, nunca
dejarlos en blanco.

## Formulario / integración con Apps Script

El flujo completo (por qué Apps Script + Sheets y no otra cosa, los
límites de cuota, cómo se maqueta el correo) está documentado en el
hilo de la conversación sobre el proyecto — ver el resumen en
`PROJECT_CONTEXT.md`. Resumen rápido para no releer todo:

- El cliente llama a `/api/contacto` (nuestro propio endpoint), nunca
  directo a Apps Script — el token vive solo en el servidor.
- `CONTACT_SCRIPT_URL` y `CONTACT_SCRIPT_TOKEN` van en variables de
  entorno, nunca hardcodeadas (ver `.env.example`).
- El evento `form_submit` de analítica se dispara solo en éxito, y
  solo con datos no sensibles (tipo de producto) — nunca nombre,
  teléfono o el mensaje. Ver el comentario en `src/lib/analytics.ts`.

## Content Collections — convenciones del rollout del mapa maestro SEO

- **`servicios`** creció de 4 a 5 entradas (slugs con `-china`/`-fcl`
  donde aplica, ver `src/content/servicios/{es,en}/`) y su schema
  consolidó `queHacemos`/`beneficios`/`etapas` en un único
  `secciones: [{h2, cuerpo?, items?}]` — modela mejor la estructura
  real del documento SEO (H2 + prosa o sub-puntos titulados) que tres
  arrays de forma fija. `pendiente` pasó de `string` a `string[]` (dos
  servicios necesitan varios puntos de advertencia). Nuevos campos
  obligatorios: `slug`, `seoTitle`, `metaDescription`, `h1`,
  `heroIntro`, `ctaPrincipal`; nuevos opcionales: `keywordsSecundarias`,
  `ctaSecundario`, `faqs`, `serviciosRelacionados`, `resumenBullets`,
  `heroImage`.
- **`slug` en el schema de `servicios` es el id de ruta** —
  `getStaticPaths` en `src/pages/{es,en}/servicios/[slug].astro` lo lee
  directo del contenido, ya no hay mapas hardcodeados por archivo.
  Agregar un servicio nuevo es solo JSON, cero cambios de código.
  ⚠️ **Trampa de Astro a tener presente**: el `glob()` loader usa
  `data.slug` como id de la entrada SI el campo existe (ver
  `generateIdDefault` en `astro/dist/content/loaders/glob.js`), lo que
  pisa el id basado en ruta de archivo que el resto del proyecto usa
  para filtrar por locale (`entry.id.startsWith('es/')`) — sin el
  `generateId` explícito que tiene la colección `servicios` en
  `content.config.ts`, es/ y en/ colisionan en un mismo id y la
  colección queda silenciosamente vacía al filtrar (sin error de
  build, sin warning — las páginas simplemente no se generan). Si se
  agrega un campo `slug` a OTRA colección en el futuro, replicar el
  mismo `generateId`.
- **`proceso`** pasó a tener locale (`es/`/`en/`, mismo patrón que
  `servicios`/`faqs`) — antes existía pero ningún componente en uso la
  leía; ahora alimenta el bloque "Cómo trabajamos" de la Home.
- **Patrón "pendiente"**: siempre con los tokens `--color-warning`,
  `--color-warning-bg`, `--color-warning-text` de `tokens/colors.css`
  (namespace `--color-*`, no el `--c-*` legacy de `_colors.css`) —
  nunca hex hardcodeado. Ver el bloque de aviso en
  `ServicioDetalleTemplate.astro`, justo después del Hero de cada
  servicio.
- **SEO Title / Meta Description son el texto final, completo**, no un
  fragmento que `BaseLayout` complete — `<title>`/`og:title` ya no le
  concatenan " | KM Business Consulting" al `title` prop (lo hacían
  antes; duplicaba la marca en cualquier página cuyo `seoTitle` ya la
  trajera incluida, como ahora pasa en las 9 URLs del mapa SEO). Cada
  `seoTitle`/`seo.title` debe ser ya el string final a publicar.
- **`/en/*.json` de las colecciones tocadas en este rollout
  (`servicios`, `proceso`, `faqs`, `pages/*`) son copia literal del
  español**, no traducción — instrucción explícita del encargo para no
  inventar copy en inglés antes de aprobar el español. Ver los
  `README.md` de cada carpeta de contenido antes de traducir.

## Qué falta y quién lo destraba

Ver la sección "Pendientes" de `PROJECT_CONTEXT.md` para la lista
completa con responsable de cada uno (Kattya / Renzo / diseñador /
Jorge).
