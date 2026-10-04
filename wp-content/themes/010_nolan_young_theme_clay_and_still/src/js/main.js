import '../scss/main.scss';

// Enhance the mobile navigation; without JS its links remain available.
const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const mobileQuery = window.matchMedia('(max-width: 760px)');
if (toggle && mobileNav) {
  toggle.hidden = false;
  const setOpen = (open, returnFocus = false) => {
    mobileNav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (returnFocus) toggle.focus();
  };
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });
  mobileQuery.addEventListener('change', () => setOpen(false));
}
const disclosures = document.querySelectorAll('.nav-disclosure');
disclosures.forEach((details) => {
  document.addEventListener('click', (event) => {
    if (!details.contains(event.target)) details.open = false;
  });
  details.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && details.open) {
      details.open = false;
      details.querySelector('summary').focus();
    }
  });
  details.addEventListener('focusout', (event) => {
    if (!details.contains(event.relatedTarget)) details.open = false;
  });
});

// All essential content starts visible; motion is an optional enhancement.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  const review = () => {
    if (!form.reportValidity()) return;
    form.querySelector('.form-status').textContent = 'Your sample note is ready to review. Nothing has been sent or saved, and no place has been booked. Thank you for exploring Clay & Still.';
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    review();
  });
  form.querySelector('[data-demo-check]')?.addEventListener('click', review);
});
