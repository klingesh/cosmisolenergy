(() => {
  const carousel = document.querySelector('[data-testimonial-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('.testimonial-track');
  const slides = [...carousel.querySelectorAll('.testimonial-slide')];
  if (slides.length < 2) return;

  const count = carousel.querySelector('[data-testimonial-current]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = Number(carousel.dataset.interval) || 5000;
  let current = 0;
  let timer;
  let inView = false;
  let paused = false;

  function show(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => {
      slide.inert = i !== current;
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    count.textContent = String(current + 1).padStart(2, '0');
  }

  function stop() {
    window.clearInterval(timer);
    timer = undefined;
  }

  function start() {
    stop();
    if (inView && !paused && !document.hidden && !reducedMotion.matches) {
      timer = window.setInterval(() => show(current + 1), interval);
    }
  }

  carousel.querySelector('[data-testimonial-prev]').addEventListener('click', () => { show(current - 1); start(); });
  carousel.querySelector('[data-testimonial-next]').addEventListener('click', () => { show(current + 1); start(); });
  carousel.addEventListener('mouseenter', () => { paused = true; stop(); });
  carousel.addEventListener('mouseleave', () => { paused = false; start(); });
  carousel.addEventListener('focusin', () => { paused = true; stop(); });
  carousel.addEventListener('focusout', event => {
    if (!carousel.contains(event.relatedTarget)) { paused = false; start(); }
  });
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);

  show(0);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      start();
    }, { threshold: 0.25 }).observe(carousel);
  } else {
    inView = true;
    start();
  }
})();
