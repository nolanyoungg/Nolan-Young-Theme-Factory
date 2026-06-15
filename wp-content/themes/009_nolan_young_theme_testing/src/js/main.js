(() => {
  const header = document.querySelector('[data-nolan-menu-header]');
  const toggle = document.querySelector('[data-nolan-menu-toggle]');
  const panel = document.querySelector('[data-nolan-menu-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  }
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();