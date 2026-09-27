# Contexto del proyecto — KM Business Consulting SAC

Este archivo es memoria de proyecto para retomar el trabajo sin tener
que releer todo el hilo de la conversación original. No confundir con
la memoria de Claude (esa es de Jorge; esta es del repo).

## Quién es la clienta

**Kattya Mejía**, CEO de KM Business Consulting SAC. Pidió explícitamente
que la página nueva **inicie con su foto** — quiere marca personal, no
solo la marca KM.

## Brief de marca (respuestas escritas de Kattya, 23 de septiembre)

Kattya llenó la ficha técnica que le pedimos en la llamada. Esto es lo
más cercano a una fuente primaria que tenemos — de aquí en adelante,
todo el copy nuevo debe partir de sus palabras, no de las nuestras.

- **A qué se dedica (versión completa, más precisa que lo dicho en la
  llamada):** "Logística Integral, búsqueda y verificación de
  proveedores confiables, inspección de fábricas en China y fletes
  marítimos FCL desde Asia hacia Latinoamérica." Conectar empresas con
  oportunidades comerciales y soluciones logísticas confiables.
- **Valores:** confianza, integridad, valores y principios sólidos.
  Relaciones duraderas basadas en transparencia.
- **Visión de crecimiento:** posicionamiento internacional en
  **América y Europa** (más amplio que "Latinoamérica" — ver nota
  abajo).
- **Cómo quiere que la perciban:** íntegra, con principios sólidos,
  honesta, responsable, apasionada. A la empresa: visión
  internacional, confianza, profesionalismo, compromiso.
- **Diferenciador (en sus palabras):** "Nuestra extraordinaria
  atención al cliente... No buscamos concretar una operación, sino
  construir relaciones de confianza a largo plazo."
- **Público objetivo — dato que cambia el tono:** **"importadores
  frecuentes"**, no principiantes. No es gente que necesita que le
  expliquen qué es importar; es gente que ya importa y busca un socio
  más confiable y cercano que el que tiene. El copy debe hablarle de
  igual a igual, no en modo tutorial (así se ve, por ejemplo,
  ProBusiness con su "curso de importación" — ver el análisis del
  moodboard: eso es exactamente el tono que NO aplica aquí).
- **Emoción a generar:** confianza, tranquilidad, satisfacción —
  "sentir que están en buenas manos."
- **Tono de comunicación:** **emocional, cercano y profesional** — no
  solo corporativo-frío, tampoco informal suelto. Los tres a la vez.
- **Sobre su marca personal (cita casi lista para usar en la sección
  "¿Quién está detrás de KM?"):** "Quiero ser reconocida, ante todo,
  por ser un buen ser humano, una persona íntegra que trabaja con
  amor, pasión y propósito... El verdadero éxito no solo se mide por
  los resultados que alcanzamos, sino por la confianza que generamos,
  las relaciones que construimos y el impacto positivo que dejamos en
  los demás."

### Una discrepancia a confirmar con ella, no a resolver por nuestra cuenta

En la llamada telefónica mencionó carga "por contenedor completo **o
consolidado**" y que su equipo en China conecta con otros países
además de China. En este brief escrito solo menciona **"fletes
marítimos FCL"**, sin mencionar LCL/consolidado. Puede ser una
omisión al escribir rápido, o puede ser que quiera enfocar el mensaje
solo en FCL. No lo decidimos nosotros — se le pregunta directo antes
de fijar el copy de servicios.

## De dónde viene este proyecto

El sitio anterior estaba en Wix (`kmbusinessc.pe`), publicado del
13 de febrero al 4 de septiembre de 2026, cuando se bajó el Home y se
dejó una página de "en renovación". Se hizo una auditoría completa
(documento Word, "Auditoría del sitio web") y una cotización (Excel,
"Cotización KM Business Consulting") — ambos entregados a Kattya.
Este repo es la ejecución de esa propuesta.

## Los 3 problemas principales que este sitio tiene que resolver

1. **No había forma fácil de contactar.** Sin formulario, sin WhatsApp
   tocable. → Resuelto con `ContactForm` + `WhatsAppButton` (ver
   Hallazgo 1 de la auditoría).
2. **Los testimonios eran de plantilla** (texto en inglés repetido,
   "James Morrison / Global Distribution Inc.", fotos rotas). →
   `src/content/testimonios/` empieza vacío a propósito. No se llena
   sin permiso explícito de cada cliente.
3. **Casi no llegaba tráfico y no se podía medir nada.** Wix Analytics
   mostró 126 sesiones / 26 visitantes únicos en ~7 meses, 83% desde
   celular, solo 12 sesiones desde Google. → GTM + GA4 con el plan de
   medición ya definido (ver más abajo).

## Estado de los accesos (a la fecha de este commit)

- ✅ Acceso al editor de Wix conseguido, historial revisado.
- ✅ Sitio verificado en Google Search Console y Bing (en Wix) — HAY
  que migrar esa verificación por DNS (TXT), no perderla.
- ⬜ Dominio: falta confirmar registrador, titular y fecha de
  renovación de `kmbusinessc.pe`.
- ⬜ Correo `kattya@kmbusinessc.pe`: falta confirmar proveedor actual
  y sus registros MX/SPF/DKIM/DMARC, ANTES de tocar cualquier DNS.
- ⬜ Plan de Wix: falta costo y fecha de renovación (para cancelarlo a
  tiempo y no pagar doble).

## Diseño — estado real al momento de crear este scaffold

**El diseñador todavía no ha entregado nada** (logo refinado, paleta,
tipografía). Por eso:

- Los tokens de color y tipografía (`src/styles/tokens/`) usan valores
  puente: el azul que ya tenía el sitio en Wix (`#189cdc`) y Poppins
  (la tipografía que ya usaban). Esto es a propósito — permite avanzar
  la arquitectura sin que el resultado visual final dependa de
  refactorizar componentes después. Cuando el diseñador entregue, el
  cambio se hace solo en esos archivos.
- El logo (`src/components/atoms/Logo/Logo.astro`) es un placeholder
  de texto, no el isotipo real. El logo actual del sitio Wix era un
  PNG de 4641×1360px, no vectorial — se necesita el `.svg` definitivo.
- Las fotos de Kattya (Hero y sección "¿Quién está detrás de KM?") son
  bloques placeholder con aspect-ratio reservado. Falta confirmar si
  se usa una foto existente o se coordina una sesión nueva.

**No construir nada visualmente "final"** (paleta definitiva,
composición hero muy elaborada) hasta que el diseñador entregue — el
riesgo es hacer doble trabajo. Lo que SÍ tiene sentido avanzar ahora:
arquitectura, contenido tipado, formulario, medición, SEO técnico.

## Contenido — qué es real y qué es borrador

Migrado literal del sitio anterior (no inventado):
- El proceso de 4 pasos ("Nos cuentas qué necesitas" → "Buscamos y
  gestionamos el producto ideal" → "Coordinamos la operación por
  contenedor" → "Estaremos contigo hasta la entrega").
- Los datos de contacto (correo, teléfono) — a confirmar si siguen
  vigentes.

Tomado casi textual del brief de marca del 23 de septiembre (ver
sección de arriba) — esto ya NO es borrador nuestro, son sus palabras:
- La cita de "¿Quién está detrás de KM?" sobre su marca personal.
- El diferenciador ("no buscamos concretar una operación, sino
  construir relaciones de confianza a largo plazo").
- Las 4 líneas de servicio reales (logística integral, búsqueda y
  verificación de proveedores, inspección de fábricas, flete
  marítimo). **Estructura de `src/content/servicios/` ya actualizada
  para reflejar esto** — antes tenía 5 tarjetas de "parámetros para
  cotizar" (tipo de producto, volumen, etc.) copiadas del sitio Wix
  viejo; ahora son sus 4 servicios reales. Ver nota de la discrepancia
  FCL/LCL arriba antes de dar esto por cerrado.

Borrador todavía, pendiente de que **Renzo** lo pase por su
investigación de palabras clave (línea D2/9 de la cotización) — pero
ya grounded en el brief, no inventado desde cero:
- El titular y subtítulo del Hero.
- La sección "¿Quiénes somos?".

Sigue faltando (esto el brief de marca NO lo cubre — es un brief de
posicionamiento, no de datos operativos):
- Categorías de producto concretas que importa.
- Plazos típicos (producción + tránsito).
- Pedido mínimo o si trabaja con carga consolidada además de FCL
  (ligado a la discrepancia de arriba).

## Plan de medición (para cuando Renzo configure GTM)

Eventos ya acordados, con los nombres exactos a usar en el contenedor:

| Evento | Cuándo | Parámetros | Conversión |
|---|---|---|---|
| `cta_click` | clic en cualquier botón "Contáctanos" | `location` | No |
| `click_whatsapp` | clic en botón/enlace de WhatsApp | `location` | Sí |
| `click_email` / `click_phone` | clic en correo/teléfono del footer | `location` | Secundaria |
| `form_start` | primer campo del formulario tocado | — | No |
| `form_submit` | envío exitoso del formulario | `producto` (nunca nombre/teléfono/mensaje) | Sí (principal) |
| `scroll_50/75/90` | scroll hasta ese % | `percent` | No |
| `section_view` | una sección clave queda visible | `section_name` | No |

El helper `trackEvent()` en `src/lib/analytics.ts` ya está listo para
recibirlos; falta que el contenedor GTM exista (`PUBLIC_GTM_ID` en
`.env`) y que Renzo configure las conversiones en GA4.

## Formulario → Sheets + correo (por qué así, no con EmailJS u otro)

Decisión tomada en la conversación del proyecto: Google Apps Script
(gratis) recibe el POST desde `src/pages/api/contacto.ts`, agrega una
fila a un Google Sheet Y manda el correo a Kattya en la misma función
(`MailApp`, también gratis, sin depender de EmailJS). El script debe
vivir en la cuenta de Google de **Kattya**, no en la de Jorge, para
que ella sea dueña de sus propios contactos.

Cuotas de Apps Script (para que nadie se asuste sin motivo): 100
destinatarios de correo al día en cuenta gmail.com — muy por encima de
lo que un formulario de contacto de esta escala va a necesitar.

Pendiente: Jorge crea el script en la cuenta de Kattya, copia la URL
`/exec` y el token a `.env`, y lo prueba en punta a punta.

## WhatsApp — qué se cotizó y qué no

Se cobra el **botón `wa.me`** (click-to-chat), que es gratis para
cualquier número. La API de WhatsApp de Meta (reenvío automático,
plantillas, costo por mensaje) quedó como **opcional**, no incluida
por defecto — ver la hoja de cotización. No confundir los dos en
ninguna conversación con Kattya.

## Pendientes, con responsable

| Pendiente | Responsable |
|---|---|
| Logo vectorial, paleta y tipografía definitivas | Diseñador |
| Foto de Kattya (Hero + sección "quién está detrás") | Kattya |
| Confirmar FCL solo, o FCL + consolidado/LCL (ver discrepancia arriba) | Kattya |
| Categorías de producto, plazos, pedido mínimo reales | Kattya |
| Confirmar cifra "150+ clientes" antes de activar el badge | Kattya |
| Testimonios reales con permiso | Kattya |
| ~~Brief de marca / posicionamiento~~ | ✅ Recibido 23 sep |
| Pasar el copy grounded en el brief por investigación de palabras clave | Renzo |
| Contenedor GTM + conversiones GA4 | Renzo |
| Confirmar registrador/titular del dominio y proveedor de correo | Kattya / Jorge |
| Crear el Apps Script en la cuenta de Kattya y probarlo | Jorge |
| Definir si el hosting Cloudflare queda a nombre de Kattya | Jorge |
| Asset `public/og-default.jpg` (imagen para compartir en redes) | Jorge + diseñador |
