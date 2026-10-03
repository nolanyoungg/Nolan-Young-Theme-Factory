import '../scss/main.scss';

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#trail-navigation');
const mobile = window.matchMedia('(max-width: 1000px)');

if (header && toggle && navigation) {
  header.classList.add('nav-ready');
  toggle.hidden = false;
  const setOpen = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.screen-reader-text').textContent = open ? 'Close navigation' : 'Open navigation';
    navigation.classList.toggle('is-open', open);
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!header.contains(document.activeElement)) setOpen(false);
    });
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusWasInNavigation = navigation.contains(document.activeElement);
    setOpen(false, mobile.matches && focusWasInNavigation);
  });
}

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => event.preventDefault());
  form.querySelector('[data-demo-submit]').addEventListener('click', () => {
    if (!form.reportValidity()) return;
    form.querySelector('.form-result').textContent = 'Thanks for trying the sample inquiry. Nothing was sent or saved, and no walk has been booked.';
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-animate]').forEach((element) => observer.observe(element));
}
