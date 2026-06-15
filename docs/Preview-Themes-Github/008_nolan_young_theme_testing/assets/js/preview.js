// JavaScript for header interactions and scroll animations
document.addEventListener('DOMContentLoaded', function() {
  // Sticky header functionality
  var header = document.querySelector('.site-header');
  window.onscroll = function() {
    if (window.pageYOffset > 100) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  };
});
