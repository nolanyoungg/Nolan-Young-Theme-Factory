import '../scss/main.scss';

document.documentElement.classList.add('has-template-js');

const body = document.body;
const header = document.querySelector('[data-site-header]');
const backdrop = document.querySelector('[data-menu-backdrop]');
const triggers = [...document.querySelectorAll('[data-menu-item]')];
const dropdowns = [...document.querySelectorAll('[data-menu-dropdown]')];
const drawer = document.querySelector('[data-mobile-drawer]');
const openDrawer = document.querySelector('[data-mobile-menu-open]');
const closeDrawer = document.querySelector('[data-mobile-menu-close]');
const allModalControls = () => [...triggers, openDrawer, closeDrawer].filter(Boolean);

let activeMenu = null;

const lockScroll = (locked) => body.classList.toggle('is-scroll-locked', locked);

const setBackdrop = (visible) => {
  if (backdrop) backdrop.hidden = !visible;
};

const closeMenus = () => {
  activeMenu = null;
  triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  dropdowns.forEach((dropdown) => {
    dropdown.hidden = true;
    dropdown.setAttribute('aria-hidden', 'true');
  });
  setBackdrop(drawer && !drawer.hidden);
  if (!drawer || drawer.hidden) {
    lockScroll(false);
  }
};

const activateRail = (button) => {
  const panel = button.closest('[data-menu-dropdown]');
  if (!panel) return;
  const key = button.dataset.railItem;
  panel.querySelectorAll('[data-rail-item]').forEach((item) => item.classList.toggle('is-active', item === button));
  panel.querySelectorAll('[data-rail-content]').forEach((content) => {
    const active = content.dataset.railContent === key;
    content.hidden = !active;
    content.classList.toggle('is-active', active);
    content.setAttribute('aria-hidden', String(!active));
  });
};

const openMenu = (key) => {
  closeMenus();
  const trigger = document.querySelector(`[data-menu-item="${key}"]`);
  const dropdown = document.querySelector(`[data-menu-dropdown="${key}"]`);
  if (!trigger || !dropdown) return;
  activeMenu = key;
  trigger.setAttribute('aria-expanded', 'true');
  dropdown.hidden = false;
  dropdown.setAttribute('aria-hidden', 'false');
  setBackdrop(true);
  lockScroll(true);
  const firstRail = dropdown.querySelector('[data-rail-item]');
  if (firstRail) activateRail(firstRail);
};

triggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const key = trigger.dataset.menuItem;
    if (activeMenu === key) {
      closeMenus();
      return;
    }
    openMenu(key);
  });
});

document.querySelectorAll('[data-rail-item]').forEach((button) => {
  button.addEventListener('mouseenter', () => activateRail(button));
  button.addEventListener('focus', () => activateRail(button));
});

const closeMobile = () => {
  if (!drawer) return;
  drawer.hidden = true;
  drawer.setAttribute('aria-hidden', 'true');
  openDrawer?.setAttribute('aria-expanded', 'false');
  if (!activeMenu) {
    setBackdrop(false);
    lockScroll(false);
  }
};

const openMobile = () => {
  if (!drawer) return;
  closeMenus();
  drawer.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  openDrawer?.setAttribute('aria-expanded', 'true');
  setBackdrop(true);
  lockScroll(true);
  closeDrawer?.focus();
};

openDrawer?.addEventListener('click', openMobile);
closeDrawer?.addEventListener('click', closeMobile);
backdrop?.addEventListener('click', () => {
  closeMenus();
  closeMobile();
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (!target.closest('.site-header') && !target.closest('.mobile-drawer')) {
    closeMenus();
    if (drawer && !drawer.hidden) closeMobile();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenus();
    if (drawer && !drawer.hidden) closeMobile();
  }
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 16);
}, { passive: true });

document.querySelectorAll('.mobile-accordion > button, .accordion-item > button').forEach((button) => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    if (content) content.hidden = expanded;
  });
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const controls = button.closest('[data-filter-controls]');
    const grid = document.querySelector('[data-filter-grid]');
    const filter = button.dataset.filter;
    controls?.querySelectorAll('[data-filter]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    grid?.querySelectorAll('[data-category]').forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
    });
  });
});

document.querySelectorAll('[data-enhanced-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    const requiredFields = [...form.querySelectorAll('[required]')];
    const invalid = requiredFields.find((field) => !field.value.trim() || (field.type === 'email' && !field.validity.valid));
    form.querySelectorAll('.field-error').forEach((node) => node.remove());
    if (invalid) {
      event.preventDefault();
      const message = document.createElement('p');
      message.className = 'field-error';
      message.textContent = invalid.type === 'email' ? 'Enter a valid email address.' : 'Complete this required field.';
      invalid.insertAdjacentElement('afterend', message);
      invalid.focus();
    }
  });
});

closeMenus();
