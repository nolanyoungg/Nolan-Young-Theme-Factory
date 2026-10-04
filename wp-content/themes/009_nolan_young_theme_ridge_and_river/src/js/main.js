import '../scss/main.scss';

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const closeMenu = (returnFocus = false) => {
  if (!menu || !toggle) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
};
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu && !menu.hidden) closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('focusin', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  const status = form.querySelector('.form-status');
  const demonstrate = () => {
    if (!form.reportValidity()) return;
    status.textContent = 'Thanks for trying the Ridge & River inquiry. This is a demo: nothing has been sent, saved or booked.';
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    demonstrate();
  });
  form.querySelector('[data-demo-submit]')?.addEventListener('click', demonstrate);
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('just-arrived');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.trail-row, .grade-list article, .checklist > div, .ethos-grid article').forEach((element) => observer.observe(element));
}
