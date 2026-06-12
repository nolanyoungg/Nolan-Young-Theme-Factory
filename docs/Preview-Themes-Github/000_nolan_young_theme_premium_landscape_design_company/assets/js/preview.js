(() => {
  const body = document.body;
  const header = document.querySelector('[data-site-header]');
  const triggers = Array.from(document.querySelectorAll('[data-menu-item]'));
  const dropdowns = Array.from(document.querySelectorAll('[data-menu-dropdown]'));
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');

  function closeMenus() {
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    dropdowns.forEach((dropdown) => dropdown.hidden = true);
    if (backdrop) backdrop.hidden = true;
    body.classList.remove('nolan-menu-open');
  }

  function openMenu(key) {
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', String(trigger.dataset.menuItem === key)));
    dropdowns.forEach((dropdown) => dropdown.hidden = dropdown.dataset.menuDropdown !== key);
    if (backdrop) backdrop.hidden = false;
    body.classList.add('nolan-menu-open');
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const key = trigger.dataset.menuItem;
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenus() : openMenu(key);
    });
  });

  document.addEventListener('click', (event) => {
    if (header && !header.contains(event.target) && !event.target.closest('[data-menu-dropdown]')) {
      closeMenus();
      closeMobile();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      closeMobile();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenus);
  }

  function closeMobile() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('nolan-menu-open');
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileDrawer.hidden = expanded;
      mobileToggle.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('nolan-menu-open', !expanded);
    });
  }

  document.querySelectorAll('[data-rail-item]').forEach((railButton) => {
    railButton.addEventListener('mouseenter', () => activateRail(railButton));
    railButton.addEventListener('focus', () => activateRail(railButton));
    railButton.addEventListener('click', () => activateRail(railButton));
  });

  function activateRail(button) {
    const panel = button.closest('[data-menu-dropdown]');
    if (!panel) return;
    const key = button.dataset.railItem;
    panel.querySelectorAll('[data-rail-item]').forEach((item) => {
      item.setAttribute('aria-expanded', String(item === button));
    });
    panel.querySelectorAll('[data-rail-content]').forEach((content) => {
      content.hidden = content.dataset.railContent !== key;
    });
  }
})();
