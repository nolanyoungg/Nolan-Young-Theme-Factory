import '../scss/main.scss';

const doc = document;
const body = doc.body;

const lockScroll = (locked) => {
  body.classList.toggle('is-scroll-locked', locked);
};

const setActiveRail = (container, key) => {
  if (!container) return;
  container.querySelectorAll('[data-rail-item]').forEach((button) => {
    const isActive = button.dataset.railItem === key;
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  container.querySelectorAll('[data-rail-content]').forEach((panel) => {
    panel.hidden = panel.dataset.railContent !== key;
  });
};

doc.querySelectorAll('[data-menu-item]').forEach((trigger) => {
  const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    doc.querySelectorAll('[data-menu-item]').forEach((other) => {
      const otherPanel = doc.getElementById(other.getAttribute('aria-controls'));
      other.setAttribute('aria-expanded', 'false');
      otherPanel?.setAttribute('hidden', '');
    });
    if (isOpen) {
      panel?.setAttribute('hidden', '');
      lockScroll(false);
      return;
    }
    trigger.setAttribute('aria-expanded', 'true');
    panel?.removeAttribute('hidden');
    lockScroll(true);
    const firstRail = panel?.querySelector('[data-rail-item]');
    firstRail?.focus();
  });
});

doc.querySelectorAll('[data-menu-dropdown]').forEach((panel) => {
  const firstRail = panel.querySelector('[data-rail-item]');
  const defaultKey = firstRail?.dataset.railItem;
  if (defaultKey) setActiveRail(panel, defaultKey);
  panel.querySelectorAll('[data-rail-item]').forEach((rail) => {
    const update = () => setActiveRail(panel, rail.dataset.railItem);
    rail.addEventListener('mouseenter', update);
    rail.addEventListener('focus', update);
  });
});

doc.querySelectorAll('[data-mobile-accordion]').forEach((item) => {
  const button = item.querySelector('[data-mobile-accordion-trigger]');
  const panel = item.querySelector('[data-mobile-accordion-panel]');
  button?.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
});

const header = doc.querySelector('.site-header');
const scrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', scrolled, { passive: true });
scrolled();

doc.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    doc.querySelectorAll('[data-menu-item]').forEach((trigger) => {
      const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
      trigger.setAttribute('aria-expanded', 'false');
      panel?.setAttribute('hidden', '');
    });
    lockScroll(false);
  }
});

doc.documentElement.classList.add('has-template-js');
