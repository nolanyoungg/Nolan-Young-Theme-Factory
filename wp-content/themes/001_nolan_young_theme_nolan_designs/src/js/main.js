import '../scss/main.scss';

const root = document.documentElement;
root.classList.add('has-template-js');

const header = document.querySelector('[data-header]');
const backdrop = document.querySelector('[data-backdrop]');
const panelTriggers = [...document.querySelectorAll('[data-menu-item]')];
const panels = [...document.querySelectorAll('[data-menu-dropdown]')];
let activeMenu = null;

const lockScroll = (locked) => {
  document.body.classList.toggle('is-locked', locked);
};

const closeMenus = () => {
  activeMenu = null;
  panelTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  panels.forEach((panel) => panel.hidden = true);
  if (backdrop) backdrop.hidden = true;
  lockScroll(false);
};

const openMenu = (name) => {
  closeMenus();
  activeMenu = name;
  const trigger = document.querySelector(`[data-menu-item="${name}"]`);
  const panel = document.querySelector(`[data-menu-dropdown="${name}"]`);
  if (trigger && panel) {
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    if (backdrop) backdrop.hidden = false;
    lockScroll(true);
  }
};

panelTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const name = trigger.getAttribute('data-menu-item');
    if (activeMenu === name) {
      closeMenus();
      return;
    }
    openMenu(name);
  });
});

backdrop?.addEventListener('click', closeMenus);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenus();
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-header]')) closeMenus();
});

const rails = [...document.querySelectorAll('[data-rail-item]')];
rails.forEach((rail) => {
  const key = rail.getAttribute('data-rail-item');
  const section = document.querySelector(`[data-rail-content="${key}"]`);
  const panel = rail.closest('[data-menu-dropdown]');
  const show = () => {
    if (!panel || !section) return;
    panel.querySelectorAll('[data-rail-content]').forEach((item) => item.hidden = true);
    section.hidden = false;
  };
  rail.addEventListener('mouseenter', show);
  rail.addEventListener('focus', show);
});

document.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const target = trigger.getAttribute('data-accordion-trigger');
    const panel = document.querySelector(`[data-accordion-panel="${target}"]`);
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.hidden = expanded;
  });
});

const mobileOpen = document.querySelector('[data-mobile-open]');
const mobileClose = document.querySelector('[data-mobile-close]');
const mobileDrawer = document.querySelector('[data-mobile-drawer]');
mobileOpen?.addEventListener('click', () => {
  mobileDrawer.hidden = false;
  mobileOpen.setAttribute('aria-expanded', 'true');
  lockScroll(true);
});
mobileClose?.addEventListener('click', () => {
  mobileDrawer.hidden = true;
  mobileOpen.setAttribute('aria-expanded', 'false');
  lockScroll(false);
});

if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

document.querySelectorAll('[data-filter]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter-button]');
  const items = group.querySelectorAll('[data-filter-item]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter-button');
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    items.forEach((item) => {
      item.hidden = filter !== 'all' && item.getAttribute('data-category') !== filter;
    });
  }));
});
