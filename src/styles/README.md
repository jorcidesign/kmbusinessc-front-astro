# Sistema de diseño

Identidad final entregada por el diseñador: negro sobre blanco con un
único azul de acento (`#3fb3e4`), reglas finas que estructuran la página
como un plano técnico, ilustración isométrica y profundidad por capas
apiladas (nunca sombras difusas). Los tokens de color/tipografía viven
solo en `tokens/colors.css` y `tokens/typography.css` — un cambio de
paleta o fuente no debería tocar nada más (ver `AGENTS.md`).

## Estructura

```
styles/
├── main.css              ← punto de entrada (importa todo en capas)
├── tokens/               ← variables: color, tipografía, espaciado, layout,
│                           bordes, elevación, movimiento, z-index
├── base/                 ← fuentes, reset, root, tipografía de elementos,
│                           accesibilidad
├── layout/               ← container, section, grid, stack/cluster/switcher
├── components/           ← 23 componentes (navbar, hero, ruled-grid, footer…)
├── animations/           ← keyframes y movimiento orquestado
├── utilities/            ← spacing, text, display, surface
└── dist/                 ← versión compilada en un solo archivo
```

## Uso

Desarrollo: `<link rel="stylesheet" href="styles/main.css">`
Producción: `<link rel="stylesheet" href="styles/dist/design-system.min.css">`

Para regenerar `dist/` tras editar:

```
npx lightningcss --bundle --minify styles/main.css -o styles/dist/design-system.min.css
```

## Capas (@layer)

`tokens → base → layout → components → animations → utilities`

Una capa posterior siempre gana, sin importar la especificidad. Por eso las
utilidades no necesitan `!important`. El CSS de tu proyecto escrito fuera de
capas gana sobre todo el sistema.

## Convenciones

- **BEM**: `.bloque`, `.bloque__elemento`, `.bloque--modificador`.
- **Los modificadores solo cambian variables** (`--btn-bg`, `--ruled-cols`,
  `--section-bg`…), nunca reescriben reglas. Así no hay choques.
- **Los componentes solo usan tokens semánticos** (`--color-text`,
  `--color-border`), nunca primitivos (`--navy-900`). Para cambiar de tema,
  se redefinen los semánticos.
- **Ojo con variables compuestas**: `--rule` se resuelve donde se declara.
  Si cambias `--color-border` en un contexto (ej. fondo oscuro), redefine
  también `--rule` / `--rule-hairline` ahí (ver `.section--inverse`).

## Breakpoints (desktop-first)

| Nombre | Media query | Qué pasa |
|---|---|---|
| xl | `min-width: 1440px` | más aire interno |
| tablet | `max-width: 991px` | layouts de 2 columnas se apilan, grillas de 4 → 2 |
| mobile | `max-width: 767px` | menú hamburguesa, 1 columna, reglas verticales → horizontales |
| small | `max-width: 479px` | grillas → 1 columna, botones a ancho completo |

Tipografía y espaciados son fluidos (`clamp()`): escalan sin saltos entre
breakpoints.

## Componentes

| Archivo | Clases principales |
|---|---|
| button | `.btn` `--outline` `--inverse` `--outline-inverse` `--ghost` `--sm` `--lg` `--wide` `--block` `--round` `--square` `--arrow` |
| link | `.link` `.link--underline` `.link-icon` |
| navbar | `.navbar` `__brand` `__menu` `__link` `__cta` `__toggle` (JS: `aria-expanded` + `data-open`) |
| hero | `.hero--center` `.hero--split` `__title` `__lead` `__actions` `__media` |
| section-header | `.section-header` `--center` `--split` `--spaced` |
| split | `.split` `--3` `__cell` `__media` + `.service` |
| ruled-grid | `.ruled-grid--2..5` `--surface` + `.feature` `--strong` `--compact` `--center` |
| card | `.card` `--interactive` `--stacked` · `.stacked` (capas para imágenes) |
| cta-box | `.cta-box` `__inner` `__body` `__action` `--stacked` |
| media-overlay | `.media-overlay` + `.overlay-card` `--frosted` |
| steps | `.steps` `__item` `__marker` `__label` |
| stats | `.stats` `.stat__value` `.stat__label` |
| testimonial | `.testimonial` `__viewport` `__slide` `__quote` `__cite` |
| browser-frame | `.browser` `__bar` `__dot` `__screen` |
| video | `.video` `__play` |
| logo-strip | `.logo-strip` `--mono` |
| social-card | `.social-grid` `.social-card` · `.bubble` |
| accordion | `.faq` `.accordion` (usa `<details>`, sin JS) |
| form | `.form` `.field` `.input` `.textarea` `.select` `.check` `.input-group--inverse` |
| contact | `.contact` `__heading` `__divider` `__form` |
| marquee | `.marquee` `--reverse` `--logos` `__track` `__item--outline` |
| footer | `.footer` `__grid` `__column--wide` `__heading` `__links` `__bottom` |
| decor | `.decor` `.decor-line--mint/amber/coral/sky` (posición por variables) |

## Movimiento

Un solo momento coreografiado por página: la entrada del hero con `.intro`
y `style="--i:0,1,2"`. `[data-reveal]` usa scroll-driven animations nativas
cuando existen y, si no, simplemente muestra el contenido. Todo se desactiva
con `prefers-reduced-motion`.

## Fuente

Poppins, autohospedada en `public/fonts/poppins/*.woff2` (licencia OFL,
ver `OFL.txt` en esa carpeta) — 8 pesos (100→900, sin 800) sin
itálicas, que es lo único que usa la escala de `tokens/typography.css`.
