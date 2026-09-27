// src/lib/analytics.ts
//
// Helper delgado sobre dataLayer (GTM). Los nombres de evento son
// exactamente los del plan de medición que ya se acordó (hoja "Plan
// de medición" de la cotización): cta_click, click_whatsapp,
// click_email, click_phone, form_start, form_submit, scroll_50/75/90,
// section_view.
//
// Importante (ver Hallazgo sobre PII/GA4 de la conversación con Renzo):
// NUNCA mandar aquí nombre, teléfono, correo o el contenido del
// mensaje. Solo datos no sensibles como el tipo de producto.
type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export function trackEvent(eventName: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}
