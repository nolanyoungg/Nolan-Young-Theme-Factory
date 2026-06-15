(() => {
  const toggle = document.querySelector('[data-nolan-menu-toggle]');
  const panel = document.querySelector('[data-nolan-menu-panel]');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.toggleAttribute('data-open', !expanded);
  });
})();
