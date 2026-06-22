import '../scss/main.scss';

const html = document.documentElement;
html.classList.add('has-template-js');

const body = document.body;
const header = document.querySelector('.site-header');
const menuRoot = document.querySelector('[data-nolan-menu="root"]');
const toggleButtons = Array.from(document.querySelectorAll('[data-menu-item]'));
const dropdowns = Array.from(document.querySelectorAll('[data-menu-dropdown]'));
const drawerToggle = document.querySelector('[data-mobile-drawer-toggle]');
const drawer = document.querySelector('[data-mobile-drawer]');
const drawerClose = document.querySelector('[data-mobile-drawer-close]');
const drawerBackdrop = document.querySelector('[data-mobile-drawer-backdrop]');
const filterButtons = Array.from(document.querySelectorAll('[data-portfolio-filter]'));
const filterItems = Array.from(document.querySelectorAll('[data-portfolio-item]'));
const accordions = Array.from(document.querySelectorAll('[data-accordion]'));

const lockScroll = (locked) => {
  body.classList.toggle('is-scroll-locked', locked);
};

const setActiveDropdown = (key) => {
  dropdowns.forEach((dropdown) => {
    const isOpen = dropdown.dataset.menuDropdown === key;
    dropdown.hidden = !isOpen;
    dropdown.setAttribute('aria-hidden', String(!isOpen));
  });
  toggleButtons.forEach((button) => {
    const isActive = button.dataset.menuItem === key;
    button.setAttribute('aria-expanded', String(isActive));
    button.classList.toggle('is-active', isActive);
  });
  document.querySelector('.site-backdrop')?.classList.toggle('is-visible', Boolean(key));
  lockScroll(Boolean(key));
};

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.menuItem;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    setActiveDropdown(isExpanded ? '' : key);
  });
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!menuRoot || !target) return;
  if (!menuRoot.contains(target) && !target.closest('.site-backdrop')) {
    setActiveDropdown('');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setActiveDropdown('');
    if (drawer && !drawer.hidden) {
      closeDrawer();
    }
  }
});

const handleScroll = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

const openDrawer = () => {
  if (!drawer) return;
  drawer.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  drawerToggle?.setAttribute('aria-expanded', 'true');
  drawer.classList.add('is-open');
  document.querySelector('.site-backdrop')?.classList.add('is-visible');
  lockScroll(true);
};

const closeDrawer = () => {
  if (!drawer) return;
  drawer.hidden = true;
  drawer.setAttribute('aria-hidden', 'true');
  drawerToggle?.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('is-open');
  lockScroll(false);
  document.querySelector('.site-backdrop')?.classList.remove('is-visible');
};

drawerToggle?.addEventListener('click', () => {
  if (drawer?.hidden !== false) {
    openDrawer();
  } else {
    closeDrawer();
  }
});

drawerClose?.addEventListener('click', closeDrawer);
drawerBackdrop?.addEventListener('click', closeDrawer);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.portfolioFilter;
    filterButtons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    filterItems.forEach((item) => {
      const categories = (item.dataset.portfolioCategories || '').split(/\s+/).filter(Boolean);
      const visible = filter === 'all' || categories.includes(filter);
      item.hidden = !visible;
      item.setAttribute('aria-hidden', String(!visible));
    });
  });
});

accordions.forEach((accordion) => {
  const trigger = accordion.querySelector('[data-accordion-trigger]');
  const panel = accordion.querySelector('[data-accordion-panel]');
  if (!trigger || !panel) return;
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  });
});
