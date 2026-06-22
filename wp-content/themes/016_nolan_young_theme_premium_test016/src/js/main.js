// main.js
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const headerHeight = document.querySelector('.header').clientHeight;

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      if (item.classList.contains('has-menu')) {
        this.querySelector('.nolan-menu').classList.toggle('open');
      }
    });
  });

  const menuPanels = document.querySelectorAll('.nolan-menu');

  menuPanels.forEach(panel => {
    panel.addEventListener('mouseleave', function() {
      this.classList.remove('open');
    });
  });

  window.addEventListener('resize', () => {
    navItems.forEach(item => {
      item.style.setProperty('--header-height', `${headerHeight}px`);
    });
  });

  // Additional interactions can be added here
});
