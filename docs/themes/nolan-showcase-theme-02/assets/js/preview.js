(() => {
  const body = document.body;
  const triggers = Array.from(document.querySelectorAll('[data-menu-item]'));
  const panels = Array.from(document.querySelectorAll('[data-menu-dropdown]'));
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');
  let active = null;

  const setRail = (scope, key) => {
    scope.querySelectorAll('[data-rail-item]').forEach((item) => {
      const on = item.dataset.railItem === key;
      item.classList.toggle('is-active', on);
      item.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    scope.querySelectorAll('[data-rail-content]').forEach((content) => {
      const on = content.dataset.railContent === key;
      content.hidden = !on;
      content.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
        if (on) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', '-1');
      });
    });
  };

  const closePanels = () => {
    active = null;
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    panels.forEach((panel) => { panel.hidden = true; panel.setAttribute('aria-hidden', 'true'); });
    body.classList.remove('nolan-menu-open');
    if (backdrop) backdrop.hidden = true;
  };

  const openPanel = (key) => {
    closePanels();
    active = key;
    const trigger = triggers.find((item) => item.dataset.menuItem === key);
    const panel = panels.find((item) => item.dataset.menuDropdown === key);
    if (!trigger || !panel) return;
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    body.classList.add('nolan-menu-open');
    if (backdrop) backdrop.hidden = false;
    const firstRail = panel.querySelector('[data-rail-item]');
    if (firstRail) setRail(panel, firstRail.dataset.railItem);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const key = trigger.dataset.menuItem;
      if (active === key) closePanels();
      else openPanel(key);
    });
  });

  panels.forEach((panel) => {
    panel.querySelectorAll('[data-rail-item]').forEach((item) => {
      const update = () => setRail(panel, item.dataset.railItem);
      item.addEventListener('mouseenter', update);
      item.addEventListener('focus', update);
    });
  });

  document.addEventListener('click', (event) => {
    if (!active) return;
    if (event.target.closest('[data-menu-dropdown]') || event.target.closest('[data-menu-item]')) return;
    closePanels();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanels();
      if (mobileDrawer) {
        mobileDrawer.hidden = true;
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nolan-mobile-open');
      }
    }
  });

  if (backdrop) backdrop.addEventListener('click', closePanels);
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      mobileDrawer.hidden = expanded;
      body.classList.toggle('nolan-mobile-open', !expanded);
      if (backdrop) backdrop.hidden = expanded && !active;
    });
  }
})();