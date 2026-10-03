import '../scss/main.scss';

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const mobile = window.matchMedia('(max-width: 850px)');
if (toggle && navigation) {
  toggle.hidden = false;
  navigation.classList.add('nav-enhanced');
  const closeMenu = (returnFocus = false) => {
    navigation.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('focusin', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  mobile.addEventListener('change', () => closeMenu());
}

const roomNote = document.querySelector('.room-disclosure');
if (roomNote) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && roomNote.open) {
      roomNote.open = false;
      roomNote.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!roomNote.contains(event.target)) roomNote.open = false;
  });
  document.addEventListener('focusin', (event) => {
    if (!roomNote.contains(event.target)) roomNote.open = false;
  });
}

const normalizePath = (path) => path.replace(/\/+$/, '') || '/';
document.querySelectorAll('.site-navigation a').forEach((link) => {
  if (normalizePath(new URL(link.href).pathname) === normalizePath(window.location.pathname)) {
    link.setAttribute('aria-current', 'page');
  }
});

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  const preview = () => {
    if (!form.reportValidity()) return;
    form.querySelector('[data-form-status]').textContent =
      'Your sample inquiry is complete. This is only a preview: nothing was sent, stored, or booked.';
  };
  form.addEventListener('submit', (event) => { event.preventDefault(); preview(); });
  form.querySelector('[data-demo-submit]').addEventListener('click', preview);
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!motionPreference.matches) entry.target.classList.add('motion-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.ticket-row, .story-copy, .gig-poster, .session-feature').forEach((element) => observer.observe(element));
}
