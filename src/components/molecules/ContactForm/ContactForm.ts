// src/components/molecules/ContactForm/ContactForm.ts
//
// Lógica de UI del formulario: lee el DOM, valida en el cliente,
// delega el envío real a services/contactService.ts, y dispara el
// evento de analítica solo cuando el envío fue exitoso (ver
// src/lib/analytics.ts y el plan de medición del Excel de cotización).
import { submitContactForm } from '@services/contactService';
import { trackEvent } from '@lib/analytics';

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form || form.dataset.contactFormInitialized === 'true') return;
  form.dataset.contactFormInitialized = 'true';

  const statusEl = form.querySelector('[data-form-status]') as HTMLElement;
  const submitLabel = form.querySelector('[data-submit-label]') as HTMLElement;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  // Track micro-conversión: primer contacto con el formulario
  form.addEventListener(
    'focusin',
    () => {
      if (!form.dataset.formStarted) {
        form.dataset.formStarted = 'true';
        trackEvent('form_start', { event_category: 'lead_engagement' });
      }
    },
    { once: true }
  );

  // Strings traducibles (ES/EN) inyectadas por ContactForm.astro vía
  // data-* — este script es JS puro y no puede leer astro:content.
  const idleLabel = form.dataset.idleLabel || 'Enviar solicitud';
  const sendingLabel = form.dataset.sendingLabel || 'Enviando...';
  const validationError = form.dataset.validationError || 'Completa nombre, WhatsApp y producto.';
  const successMessage = form.dataset.successMessage || '¡Listo! Te contactaremos pronto. También puedes escribirnos directo por WhatsApp.';
  const errorMessage = form.dataset.errorMessage || 'No pudimos enviar tu mensaje. Escríbenos directo por WhatsApp, por favor.';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: si el campo trampa tiene valor, es casi seguro un bot.
    // Se corta en silencio, sin marcar error para no darle pistas.
    const honeypot = (form.elements.namedItem('sitio-web') as HTMLInputElement)?.value;
    if (honeypot) return;

    const formData = new FormData(form);
    const payload = {
      nombre: String(formData.get('nombre') || '').trim(),
      whatsapp: String(formData.get('whatsapp') || '').trim(),
      producto: String(formData.get('producto') || '').trim(),
      cantidad: String(formData.get('cantidad') || '').trim(),
      mensaje: String(formData.get('mensaje') || '').trim(),
    };

    if (!payload.nombre || !payload.whatsapp || !payload.producto) {
      setStatus(validationError, 'error');
      return;
    }

    setLoading(true);
    try {
      const ok = await submitContactForm(payload);
      if (ok) {
        setStatus(successMessage, 'success');
        trackEvent('form_submit', { producto: payload.producto });
        form.reset();
      } else {
        setStatus(errorMessage, 'error');
      }
    } catch {
      setStatus(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading: boolean): void {
    submitBtn.disabled = isLoading;
    submitLabel.textContent = isLoading ? sendingLabel : idleLabel;
  }

  function setStatus(message: string, state: 'success' | 'error'): void {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  }
}
