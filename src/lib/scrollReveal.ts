// src/lib/scrollReveal.ts
//
// Reemplaza el ScrollManager/GhostManager de Mercedes (motor LERP a
// medida) por algo mucho más simple a propósito: un solo
// IntersectionObserver que agrega .is-visible a los elementos
// [data-reveal]. KM no necesita física de scroll ni transiciones
// cinematográficas — necesita cargar rápido y no distraer del
// WhatsApp/formulario. Ver Hallazgo 5 de la auditoría.
//
// Un elemento puede pedir una clase distinta con
// data-reveal-class="otra-clase" (p.ej. una animación SVG que ya trae
// su propio nombre de clase, como .is-active en flow-china-latam.svg)
// — se agrega ESA clase en vez de .is-visible, mismo disparo único.
export function initScrollReveal(): void {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const revealClass = (el: Element) => el.getAttribute('data-reveal-class') || 'is-visible';

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add(revealClass(el)));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(revealClass(entry.target));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
