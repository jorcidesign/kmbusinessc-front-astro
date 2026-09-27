// src/lib/scrollReveal.ts
//
// IntersectionObserver que agrega .is-visible (o data-reveal-class) a los elementos
// [data-reveal].
// Diseñado con compatibilidad robusta para Safari iOS / WebKit:
// 1. Evita rootMargin con porcentaje negativo (-10%), incompatible con dynamic URL bars en iOS.
// 2. Si el target es un SVG (SVGSVGElement), observa su contenedor HTMLElement padre
//    para evitar el bug de WebKit (Bug 204318) donde SVGSVGElement no dispara intersección.
// 3. Incluye salvaguarda por timeout para nunca dejar contenido oculto si JS/Observer falla.
export function initScrollReveal(): void {
  const targets = document.querySelectorAll<HTMLElement | SVGElement>('[data-reveal]');
  if (!targets.length) return;

  const revealClass = (el: Element) => el.getAttribute('data-reveal-class') || 'is-visible';

  // Si no hay soporte para IntersectionObserver o el usuario prefiere movimiento reducido
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => {
      el.classList.add(revealClass(el));
      const wrapper = el.closest('.illustration-wrapper');
      if (wrapper) wrapper.classList.add(revealClass(el));
    });
    return;
  }

  // Mapa para rastrear qué targets corresponden a qué elemento observado (útil para SVGs)
  const observedMap = new Map<Element, Element[]>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const associatedTargets = observedMap.get(entry.target) || [entry.target];
          associatedTargets.forEach((t) => {
            t.classList.add(revealClass(t));
          });
          entry.target.classList.add(revealClass(entry.target));
          observer.unobserve(entry.target);
          observedMap.delete(entry.target);
        }
      });
    },
    // Margen seguro en px (evita fallos de cálculo con porcentajes en WebKit/iOS)
    { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => {
    // En WebKit/Safari iOS, observar SVGSVGElement directamente falla.
    // Si el elemento es SVG, observamos su contenedor HTMLElement padre.
    const isSvg = el instanceof SVGElement || el.tagName.toLowerCase() === 'svg';
    const observeEl: Element = isSvg
      ? (el.closest('.illustration-wrapper') || el.parentElement || el)
      : el;

    const currentList = observedMap.get(observeEl) || [];
    currentList.push(el);
    observedMap.set(observeEl, currentList);

    observer.observe(observeEl);
  });

  // Salvaguarda: si después de 4 segundos algún elemento no se reveló (ej. scroll edge cases), mostrarlo
  setTimeout(() => {
    targets.forEach((el) => {
      if (!el.classList.contains(revealClass(el))) {
        el.classList.add(revealClass(el));
      }
    });
  }, 4000);
}

