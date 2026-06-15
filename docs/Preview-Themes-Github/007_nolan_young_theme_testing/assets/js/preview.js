document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  let lastScrollTop = window.pageYOffset;
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset;
    if (scrollTop > lastScrollTop) {
      header.classList.remove('sticky');
    } else {
      header.classList.add('sticky');
    }
    lastScrollTop = scrollTop;
  });
});
