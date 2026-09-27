# KM Business Consulting — sitio web

Sitio en Astro para KM Business Consulting SAC (importación desde
China por contenedor). Reemplaza el sitio anterior en Wix.

Antes de tocar nada, lee **`AGENTS.md`** (convenciones técnicas) y
**`PROJECT_CONTEXT.md`** (contexto de negocio, qué está pendiente y de
quién depende).

## Arranque rápido

```bash
npm install
cp .env.example .env   # y completar los valores — ver AGENTS.md
npm run dev
```

## Stack

Astro 5 + TypeScript + CSS vanilla con design tokens. Sin frameworks
de UI. Adapter de Cloudflare solo para el endpoint del formulario.
