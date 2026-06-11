(() => {
  const body = document.body;
  const triggers = Array.from(document.querySelectorAll('[data-menu-item]'));
  const dropdowns = Array.from(document.querySelectorAll('[data-menu-dropdown]'));
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');
  function closeMenus() {
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    dropdowns.forEach((dropdown) => { dropdown.hidden = true; });
    if (backdrop) backdrop.hidden = true;
    body.classList.remove('nolan-menu-open');
  }
  function openMenu(name) {
    closeMenus();
    const trigger = document.querySelector('[data-menu-item="' + name + '"]');
    const dropdown = document.querySelector('[data-menu-dropdown="' + name + '"]');
    if (!trigger || !dropdown) return;
    trigger.setAttribute('aria-expanded', 'true');
    dropdown.hidden = false;
    if (backdrop) backdrop.hidden = false;
    body.classList.add('nolan-menu-open');
  }
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenus() : openMenu(trigger.dataset.menuItem);
    });
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nolan-site-header') && !event.target.closest('.nolan-menu-dropdown')) closeMenus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      if (mobileDrawer) mobileDrawer.hidden = true;
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
  if (backdrop) backdrop.addEventListener('click', closeMenus);
  Array.from(document.querySelectorAll('[data-rail-item]')).forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.nolan-menu-panel');
      if (!panel) return;
      panel.querySelectorAll('[data-rail-item]').forEach((item) => item.setAttribute('aria-expanded', String(item === button)));
      panel.querySelectorAll('[data-rail-content]').forEach((content) => {
        content.hidden = content.dataset.railContent !== button.dataset.railItem;
      });
    });
  });
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!open));
      mobileDrawer.hidden = open;
      body.classList.toggle('nolan-menu-open', !open);
    });
  }
})();

