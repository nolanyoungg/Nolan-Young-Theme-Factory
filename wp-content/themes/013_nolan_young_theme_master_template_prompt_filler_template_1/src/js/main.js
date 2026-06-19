document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const body = document.body;
  const menuButtons = Array.from(document.querySelectorAll('[data-menu-item]'));
  const dropdowns = Array.from(document.querySelectorAll('[data-menu-dropdown]'));

  const closeDropdowns = () => {
    dropdowns.forEach((panel) => {
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
    });
    menuButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    body.classList.remove('lock-scroll');
  };

  menuButtons.forEach((button) => {
    const target = button.getAttribute('data-menu-item');
    const panel = target ? document.querySelector(`[data-menu-dropdown="${target}"]`) : null;

    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = !panel.hidden;
      closeDropdowns();
      if (!isOpen) {
        panel.hidden = false;
        panel.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        body.classList.add('lock-scroll');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-menu-item]') && !event.target.closest('[data-menu-dropdown]')) {
      closeDropdowns();
    }
  });

  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDropdowns();
  });

  closeDropdowns();
});
