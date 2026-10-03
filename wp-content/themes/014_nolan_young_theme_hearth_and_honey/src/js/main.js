import '../scss/main.scss';

// Inline navigation expands in normal document flow; content works without JS.
const toggle = document.querySelector('.menu-toggle');
const drawer = document.querySelector('#mobile-menu');
const smallScreen = window.matchMedia('(max-width: 900px)');
const peek = document.querySelector('.peek-toggle');
const feature = document.querySelector('#menu-feature');
function closeFeature(returnFocus = false) {
  if (!peek || !feature) return;
  feature.hidden = true;
  peek.setAttribute('aria-expanded', 'false');
  if (returnFocus) peek.focus();
}
function closeMenu(returnFocus = false) {
  if (!toggle || !drawer) return;
  drawer.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  if (returnFocus) toggle.focus();
}
if (toggle && drawer) {
  const syncNavigation = () => {
    toggle.hidden = !smallScreen.matches;
    closeMenu();
    closeFeature();
  };
  syncNavigation();
  smallScreen.addEventListener('change', syncNavigation);
  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    drawer.hidden = !opening;
  });
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
}
if (peek && feature) {
  peek.hidden = false;
  peek.addEventListener('click', () => {
    const opening = peek.getAttribute('aria-expanded') !== 'true';
    peek.setAttribute('aria-expanded', String(opening));
    feature.hidden = !opening;
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.menu-peek')) closeFeature();
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.menu-peek')) closeFeature();
  });
}
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (toggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  else if (peek?.getAttribute('aria-expanded') === 'true') closeFeature(true);
});
document.querySelectorAll('[data-demo-button]').forEach(button => {
  button.addEventListener('click', () => {
    button.closest('[data-demo-inquiry]').querySelector('.form-feedback').textContent =
      'Thanks for exploring our bakery demo. Nothing was sent or saved, and no order or reservation was made.';
  });
});
// The reveal is a small movement only: no content is ever made transparent.
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-arriving');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.story-section, .special-card, .process-grid article').forEach(item => observer.observe(item));
}
