// Restrained site-wide motion powered by Anime.js. Content remains visible without JS.
(() => {
  if (!window.anime || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { animate, stagger } = window.anime;
  if (typeof animate !== 'function') return;

  const run = (targets, options = {}) => {
    const elements = typeof targets === 'string' ? [...document.querySelectorAll(targets)] : [...targets];
    if (!elements.length) return;
    animate(elements, { opacity: [0, 1], y: [22, 0], duration: 740, ease: 'out(3)', ...options });
  };

  // Opening scene: copy arrives in reading order while the photograph settles.
  run('.header > a:first-child, .header nav > *, .header .menu, .header-cta', { y: [-10, 0], delay: stagger(65), duration: 600 });
  run('.hero-copy > *', { delay: stagger(95), duration: 850 });
  const heroImage = document.querySelector('#hero-image');
  if (heroImage) animate(heroImage, { scale: [1.055, 1], duration: 1500, ease: 'out(3)' });

  // Reveal section copy, cards and controls when each enters the viewport.
  const selectors = [
    '.solutions-intro', '.solution-item', '.timeline-intro', '.timeline-cta',
    '#why .section-top > *', '.reasons article', '.calc-heading > *',
    '.solar-form', '.calc-results > *', '.brands .eyebrow', '.brand-window',
    '#visit > div', '#visit > form', '.path-hero-copy', '.path-hero-image',
    '.path-details article', '.path-contact', '.path-solar-cta',
    '.legal > .eyebrow', '.legal > h1', '.legal-lead', '.legal section', 'footer'
  ];
  const items = [...document.querySelectorAll(selectors.join(','))];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        run([entry.target], { duration: 680 });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    items.forEach(item => observer.observe(item));
  } else {
    items.forEach(item => run([item]));
  }

  // Small responses make the main interactive elements feel connected to the motion system.
  document.querySelectorAll('.button > span, .calc-link > span, .timeline-cta > span').forEach(arrow => {
    const parent = arrow.parentElement;
    parent.addEventListener('pointerenter', () => animate(arrow, { x: 5, duration: 230, ease: 'out(3)' }));
    parent.addEventListener('pointerleave', () => animate(arrow, { x: 0, duration: 230, ease: 'out(3)' }));
  });
  document.querySelectorAll('.reasons article').forEach(card => {
    const icon = card.querySelector('svg');
    if (!icon) return;
    card.addEventListener('pointerenter', () => animate(icon, { scale: 1.13, rotate: 7, duration: 300, ease: 'out(3)' }));
    card.addEventListener('pointerleave', () => animate(icon, { scale: 1, rotate: 0, duration: 300, ease: 'out(3)' }));
  });
  document.querySelectorAll('.brand-set img').forEach(logo => {
    logo.addEventListener('pointerenter', () => animate(logo, { scale: 1.06, duration: 260, ease: 'out(3)' }));
    logo.addEventListener('pointerleave', () => animate(logo, { scale: 1, duration: 260, ease: 'out(3)' }));
  });
  document.querySelectorAll('.solution-item').forEach(item => item.addEventListener('toggle', () => {
    if (item.open) run([item.querySelector('.solution-detail')], { y: [-8, 0], duration: 320 });
  }));
  document.querySelectorAll('[role="tab"]').forEach(tab => tab.addEventListener('click', () => {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel && !panel.hidden) run([panel], { y: [10, 0], duration: 330 });
  }));
  const calculator = document.getElementById('solar-form');
  if (calculator) calculator.addEventListener('submit', () => run(document.querySelectorAll('.calc-results > *'), { y: [8, 0], delay: stagger(70), duration: 390 }));
})();
