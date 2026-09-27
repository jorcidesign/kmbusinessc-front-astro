// src/lib/heroKattyaScroll.ts
//
// Controla el desvanecimiento y desenfoque progresivo de .h1.hero-first
// ("Deja de improvisar.") al iniciar el scroll hacia abajo.
// El resto de elementos (.hero-portrait sticky, .h1.accent y .hero-subtitle-block)
// se comportan mediante flujo normal de CSS con position: sticky y z-index: 50.
export function initHeroKattyaScroll(): void {
  const section = document.querySelector<HTMLElement>('[data-hero-kattya]');
  if (!section) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroFirst = section.querySelector<HTMLElement>('.hero-first');
  if (!heroFirst) return;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  let ticking = false;

  const update = () => {
    // En pantallas móviles y tablets (<= 991px), no aplicar fade/blur para mantener visibilidad constante
    if (window.innerWidth <= 991) {
      heroFirst.style.opacity = '';
      heroFirst.style.filter = '';
      ticking = false;
      return;
    }

    // En escritorio, heroFirst se desvanece y desenfoca al avanzar el scroll
    const scrolledPx = Math.max(0, window.scrollY);
    const fadeDistance = 320;
    const progress = clamp(scrolledPx / fadeDistance, 0, 1);

    heroFirst.style.opacity = String(1 - progress);
    heroFirst.style.filter = `blur(${progress * 0.24}em)`;

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
