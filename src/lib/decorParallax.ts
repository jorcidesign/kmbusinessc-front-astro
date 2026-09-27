// src/lib/decorParallax.ts
//
// Parallax de las líneas .decor-field__line-wrap (zigzag celeste del
// bloque "manifiesto" en home/nosotros). Mismo patrón que
// heroKattyaScroll.ts (scroll pasivo + requestAnimationFrame, early
// return en prefers-reduced-motion), pero el desplazamiento de cada
// línea se calcula según la posición de su propia sección en el
// viewport (getBoundingClientRect), no el scrollY absoluto de la
// página — así el efecto es proporcional sin importar qué tan abajo
// esté la sección. El translateY se aplica al wrapper, no a la línea
// rotada, para no pisar el rotate() que ya trae por CSS.
export function initDecorParallax(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = Array.from(
    document.querySelectorAll<HTMLElement>('.decor-field__line-wrap')
  ).map((el) => ({ el, speed: parseFloat(el.dataset.parallaxSpeed || '0.08') }));
  if (!layers.length) return;

  let ticking = false;

  const update = () => {
    layers.forEach(({ el, speed }) => {
      const rect = el.parentElement!.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
