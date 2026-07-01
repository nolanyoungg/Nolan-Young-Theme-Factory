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

const setLocked = (locked) => body.classList.toggle('is-scroll-locked', locked);

const closeMenus = () => {
  triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  dropdowns.forEach((dropdown) => {
    dropdown.hidden = true;
    dropdown.setAttribute('aria-hidden', 'true');
  });
  if (backdrop && (!drawer || drawer.hidden)) backdrop.hidden = true;
  setLocked(drawer && !drawer.hidden ? true : false);
};

const openMenu = (key) => {
  closeMenus();
  const trigger = document.querySelector(`[data-menu-item="${key}"]`);
  const dropdown = document.querySelector(`[data-menu-dropdown="${key}"]`);
  if (!trigger || !dropdown) return;
  trigger.setAttribute('aria-expanded', 'true');
  dropdown.hidden = false;
  dropdown.setAttribute('aria-hidden', 'false');
  if (backdrop) backdrop.hidden = false;
  setLocked(true);
  const firstRail = dropdown.querySelector('[data-rail-item]');
  if (firstRail) activateRail(firstRail);
};

triggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const key = trigger.dataset.menuItem;
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenus() : openMenu(key);
  });
});

function activateRail(button) {
  const panel = button.closest('[data-menu-dropdown]');
  if (!panel) return;
  const key = button.dataset.railItem;
  panel.querySelectorAll('[data-rail-item]').forEach((item) => item.classList.toggle('is-active', item === button));
  panel.querySelectorAll('[data-rail-content]').forEach((content) => {
    const active = content.dataset.railContent === key;
    content.hidden = !active;
    content.classList.toggle('is-active', active);
  });
}

document.querySelectorAll('[data-rail-item]').forEach((button) => {
  button.addEventListener('mouseenter', () => activateRail(button));
  button.addEventListener('focus', () => activateRail(button));
});

const closeMobile = () => {
  if (!drawer) return;
  drawer.hidden = true;
  openDrawer?.setAttribute('aria-expanded', 'false');
  if (backdrop && dropdowns.every((item) => item.hidden)) backdrop.hidden = true;
  setLocked(false);
};

const openMobile = () => {
  if (!drawer) return;
  closeMenus();
  drawer.hidden = false;
  openDrawer?.setAttribute('aria-expanded', 'true');
  if (backdrop) backdrop.hidden = false;
  setLocked(true);
  closeDrawer?.focus();
};

openDrawer?.addEventListener('click', openMobile);
closeDrawer?.addEventListener('click', closeMobile);
backdrop?.addEventListener('click', () => {
  closeMenus();
  closeMobile();
});

document.addEventListener('click', (event) => {
  const clickedInsideHeader = event.target.closest('.site-header');
  const clickedInsideDrawer = event.target.closest('.mobile-drawer');
  if (!clickedInsideHeader && !clickedInsideDrawer) closeMenus();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenus();
    closeMobile();
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

document.querySelectorAll('.filter-controls [data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const controls = button.closest('.filter-controls');
    const grid = controls?.parentElement?.querySelector('[data-filter-grid]');
    const filter = button.dataset.filter;
    controls.querySelectorAll('[data-filter]').forEach((item) => {
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
    const invalid = [...form.querySelectorAll('[required]')].find((field) => !field.value.trim() || (field.type === 'email' && !field.validity.valid));
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
