// src/pages/api/contacto.ts
//
// Única página del sitio que NO es estática. Recibe el formulario,
// lo reenvía a Google Apps Script (Sheets + correo, gratis — ver la
// conversación sobre costos de terceros) y responde al cliente.
// Requiere CONTACT_SCRIPT_URL y CONTACT_SCRIPT_TOKEN en variables de
// entorno (ver .env.example) — NUNCA hardcodear el token aquí.
import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactPayload {
  nombre: string;
  whatsapp: string;
  // Campos nuevos, opcionales (ver documento SEO maestro): el set
  // definitivo del formulario todavía debe validarse antes de
  // producción. El Apps Script que recibe este POST (cuenta de
  // Kattya, fuera de este repo) también necesita que sus columnas se
  // actualicen para no descartarlos en silencio — coordinación fuera
  // de código, ver resumen de la implementación.
  empresa?: string;
  correo?: string;
  producto: string;
  servicio?: string;
  cantidad: string;
  mensaje: string;
}

function isValidPayload(body: unknown): body is ContactPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.nombre === 'string' && b.nombre.trim().length > 0 &&
    typeof b.whatsapp === 'string' && b.whatsapp.trim().length > 0 &&
    typeof b.producto === 'string' && b.producto.trim().length > 0
  );
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'JSON inválido' }), { status: 400 });
  }

  if (!isValidPayload(body)) {
    return new Response(JSON.stringify({ ok: false, error: 'Faltan campos obligatorios' }), { status: 400 });
  }

  const scriptUrl = import.meta.env.CONTACT_SCRIPT_URL;
  const scriptToken = import.meta.env.CONTACT_SCRIPT_TOKEN;

  if (!scriptUrl || !scriptToken) {
    // Falta configurar el .env — no truena el sitio, pero avisa claro en logs.
    console.error('[api/contacto] Faltan CONTACT_SCRIPT_URL o CONTACT_SCRIPT_TOKEN en el entorno.');
    return new Response(JSON.stringify({ ok: false, error: 'Formulario no configurado todavía' }), { status: 500 });
  }

  const params = new URLSearchParams({
    token: scriptToken,
    nombre: body.nombre,
    whatsapp: body.whatsapp,
    empresa: body.empresa ?? '',
    correo: body.correo ?? '',
    producto: body.producto,
    servicio: body.servicio ?? '',
    cantidad: body.cantidad ?? '',
    mensaje: body.mensaje ?? '',
  });

  try {
    const scriptResponse = await fetch(scriptUrl, { method: 'POST', body: params });
    // Apps Script como Web App responde con una redirección al terminar;
    // con fetch del lado servidor eso se sigue automáticamente, así que
    // basta con comprobar que la respuesta final sea 200 o venga como
    // redirección exitosa. Ver el hilo de arriba sobre esta integración.
    if (!scriptResponse.ok) {
      throw new Error(`Apps Script respondió ${scriptResponse.status}`);
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error('[api/contacto] Error llamando a Apps Script:', error);
    // Respaldo: si el registro en Sheets falla, al menos no perder el
    // contacto en silencio (ver conversación: "fallos silenciosos en
    // picos"). TODO cuando se configure: reintentar o notificar por
    // otro canal aquí mismo.
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo registrar el contacto' }), { status: 502 });
  }
};
