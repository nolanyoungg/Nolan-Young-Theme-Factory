'use strict';
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
if (menuButton && navigation) {
  const closeMenu = (restoreFocus = false) => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu +';
    if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.textContent = opening ? 'Close −' : 'Menu +';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());
}
const inquiryForm = document.querySelector('#inquiry-form');
if (inquiryForm) {
  const button = inquiryForm.querySelector('button');
  const status = document.querySelector('#form-status');
  button.disabled = false;
  const showDemoFeedback = () => {
    if (!inquiryForm.reportValidity()) return;
    status.textContent = 'Your example inquiry is ready. This is a demo: nothing has been sent or saved. In a real project conversation, we would begin with your space, priorities, and budget. You can change the details and try again.';
    status.focus();
  };
  button.addEventListener('click', showDemoFeedback);
  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    showDemoFeedback();
  });
  inquiryForm.addEventListener('input', () => { status.textContent = ''; });
}
