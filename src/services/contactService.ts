// src/services/contactService.ts
//
// Capa de servicios, mismo rol que en Mercedes (services/ContactService.ts):
// aísla el "cómo" se envían los datos de la lógica de UI del formulario.
// Este servicio corre en el NAVEGADOR y llama a nuestro propio endpoint
// (/api/contacto), nunca directo a Apps Script — así el token secreto
// nunca viaja al cliente. Ver src/pages/api/contacto.ts.
export interface ContactPayload {
  nombre: string;
  whatsapp: string;
  // Campos nuevos, opcionales (ver documento SEO maestro): el set
  // definitivo del formulario todavía debe validarse antes de
  // producción — no asumir que esta lista ya es la final.
  empresa?: string;
  correo?: string;
  producto: string;
  servicio?: string;
  cantidad: string;
  mensaje: string;
}

export async function submitContactForm(payload: ContactPayload): Promise<boolean> {
  try {
    const response = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error('[contactService] Error de red:', error);
    return false;
  }
}
