// Vanilla JavaScript for menu toggles, rail panels, accordions, filters, scroll state, and reduced-motion friendly interactions

document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navPanel = document.querySelector('.nav-panel');

    menuToggle.addEventListener('click', function() {
        navPanel.classList.toggle('active');
    });

    // Accordion functionality
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        accordion.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // Scroll state
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop){
            // downscroll code
            document.body.classList.add('scrolled-down');
            document.body.classList.remove('scrolled-up');
        } else {
            // upscroll code
            document.body.classList.add('scrolled-up');
            document.body.classList.remove('scrolled-down');
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }, false);

    // Reduced-motion friendly interactions
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll('.animated').forEach(el => {
            el.classList.remove('animated');
        });
    }
});
