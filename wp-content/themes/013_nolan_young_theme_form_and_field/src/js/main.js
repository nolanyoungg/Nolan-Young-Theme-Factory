import '../scss/main.scss';

// Navigation stays available without JavaScript; enhancement makes a compact drawer.
const header = document.querySelector('[data-header]');
const toggle = header?.querySelector('.menu-toggle');
const navigation = header?.querySelector('.primary-navigation');
const disclosure = header?.querySelector('.practice-disclosure');
const mobile = window.matchMedia('(max-width: 800px)');

if (header && toggle && navigation) {
  const label = toggle.querySelector('[data-menu-label]');
  const closeMenu = (restoreFocus = false) => {
    header.classList.remove('menu-is-open');
    toggle.setAttribute('aria-expanded', 'false');
    label.textContent = 'Open navigation';
    if (disclosure) disclosure.open = false;
    if (restoreFocus) toggle.focus();
  };
  header.classList.add('is-enhanced');
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('menu-is-open', !expanded);
    toggle.setAttribute('aria-expanded', String(!expanded));
    label.textContent = expanded ? 'Open navigation' : 'Close navigation';
    if (!expanded) navigation.querySelector('a')?.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (disclosure?.open) {
      disclosure.open = false;
      disclosure.querySelector('summary').focus();
    } else if (header.classList.contains('menu-is-open')) {
      closeMenu(true);
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      if (disclosure) disclosure.open = false;
      if (mobile.matches) closeMenu();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && mobile.matches) closeMenu();
  });
  mobile.addEventListener('change', () => {
    const focusWasInMenu = navigation.contains(document.activeElement);
    closeMenu();
    if (mobile.matches && focusWasInMenu) toggle.focus();
  });
  const currentPath = window.location.pathname.replace(/\/$/, '');
  navigation.querySelectorAll('a').forEach((link) => {
    const destination = new URL(link.href);
    if (!destination.hash && destination.pathname.replace(/\/$/, '') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Content is always visible. The observer only adds a small movement as it enters view.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-seen');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  const button = form.querySelector('[data-demo-submit]');
  const status = form.querySelector('[data-form-status]');
  form.addEventListener('submit', (event) => event.preventDefault());
  button.disabled = false;
  button.addEventListener('click', () => {
    status.textContent = '';
    if (!form.reportValidity()) return;
    status.textContent = 'Your sample inquiry is ready to discuss. This is a demonstration: nothing was sent or stored. You can keep exploring the studio.';
  });
  form.addEventListener('input', () => { status.textContent = ''; });
});
