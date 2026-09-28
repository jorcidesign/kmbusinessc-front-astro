// src/lib/analytics.ts
//
// Helper delgado sobre dataLayer (GTM). Los nombres de evento son
// exactamente los del plan de medición acordado:
// - form_submit (conversión principal)
// - form_start (micro-conversión)
// - click_whatsapp (conversión secundaria)
// - click_email / click_phone (conversión secundaria)
// - cta_click (interacción)
// - switch_language (UX)
// - scroll_depth (50%, 75%, 90%)
//
// Importante (cumplimiento PII/GA4):
// NUNCA mandar aquí nombre, teléfono, correo o contenido del mensaje.
// Solo datos no sensibles como el tipo de producto o ubicación del botón.
type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    __analyticsInitialized?: boolean;
  }
}

export function trackEvent(eventName: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

export function initAnalyticsListeners(): void {
  if (typeof window === 'undefined' || window.__analyticsInitialized) return;
  window.__analyticsInitialized = true;

  // 1. Delegación de clics globales para enlaces clave
  document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement | HTMLButtonElement>('a, button');
    if (!target) return;

    const href = (target as HTMLAnchorElement).href || '';
    const text = (target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);

    // WhatsApp
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      const location = target.closest('[data-track-location]')?.getAttribute('data-track-location') ||
        (target.closest('.whatsapp-fab') ? 'floating_fab' :
         target.closest('header') ? 'header' :
         target.closest('footer') ? 'footer' : 'body');
      trackEvent('click_whatsapp', { location });
      return;
    }

    // Correo (mailto)
    if (href.startsWith('mailto:')) {
      const location = target.closest('footer') ? 'footer' : 'contact_channel';
      trackEvent('click_email', { location });
      return;
    }

    // Teléfono (tel)
    if (href.startsWith('tel:')) {
      const location = target.closest('footer') ? 'footer' : 'contact_channel';
      trackEvent('click_phone', { location });
      return;
    }

    // Cambio de idioma (ES / EN)
    if (target.classList.contains('locale-switch__link') || target.closest('.locale-switch')) {
      const currentPath = window.location.pathname;
      const fromLang = currentPath.startsWith('/en') ? 'en' : 'es';
      const toLang = fromLang === 'es' ? 'en' : 'es';
      trackEvent('switch_language', { from_lang: fromLang, to_lang: toLang });
      return;
    }

    // Botones CTA principales
    if (target.classList.contains('btn') || target.classList.contains('cta-btn') || target.hasAttribute('data-cta')) {
      const location = target.closest('header') ? 'header' :
        target.closest('.hero-section') ? 'hero' :
        target.closest('footer') ? 'footer' : 'body';
      trackEvent('cta_click', {
        cta_text: text,
        cta_destination: href || 'action',
        location,
      });
    }
  }, { passive: true });

  // 2. Medición de scroll depth (50%, 75%, 90%)
  const scrollThresholds = [50, 75, 90];
  const triggeredThresholds = new Set<number>();

  const checkScrollDepth = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrolledPct = Math.round((window.scrollY / docHeight) * 100);

    for (const threshold of scrollThresholds) {
      if (scrolledPct >= threshold && !triggeredThresholds.has(threshold)) {
        triggeredThresholds.add(threshold);
        trackEvent('scroll_depth', {
          percent: threshold,
          page_path: window.location.pathname,
        });
      }
    }

    if (triggeredThresholds.size === scrollThresholds.length) {
      window.removeEventListener('scroll', throttledScroll);
    }
  };

  let scrollTicking = false;
  const throttledScroll = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        checkScrollDepth();
        scrollTicking = false;
      });
    }
  };

  window.addEventListener('scroll', throttledScroll, { passive: true });
}

