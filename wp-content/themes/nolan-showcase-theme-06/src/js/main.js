(function () {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const submenuParents = nav ? nav.querySelectorAll('.menu-item-has-children') : [];

  if (nav && toggle) {
    const closeSubmenus = () => {
      submenuParents.forEach((item) => item.classList.remove('is-open'));
      nav.querySelectorAll('.menu-item-has-children > a[aria-expanded="true"]').forEach((trigger) => {
        trigger.setAttribute('aria-expanded', 'false');
      });
    };

    const setExpanded = (expanded) => {
      toggle.setAttribute('aria-expanded', String(expanded));
      nav.classList.toggle('is-open', expanded);
      if (!expanded) {
        closeSubmenus();
      }
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });

    nav.addEventListener('click', (event) => {
      const trigger = event.target instanceof Element ? event.target.closest('.menu-item-has-children > a') : null;
      if (!trigger) {
        if (event.target instanceof HTMLAnchorElement && window.innerWidth < 860) {
          setExpanded(false);
        }
        return;
      }

      const parentItem = trigger.parentElement;
      if (!parentItem) {
        return;
      }

      event.preventDefault();
      const open = !parentItem.classList.contains('is-open');
      submenuParents.forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove('is-open');
          const siblingTrigger = item.querySelector(':scope > a');
          if (siblingTrigger) {
            siblingTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });
      parentItem.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && event.target !== toggle) {
        setExpanded(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setExpanded(false);
        toggle.focus();
      }
    });
  }

  const cards = document.querySelectorAll('.work-card, .service-card, .testimonial-card, .blog-card, .pillar-card, .process-step');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach((card) => card.classList.add('is-visible'));
  }

  const forms = document.querySelectorAll('.contact-form, .newsletter-form');
  forms.forEach((form) => {
    form.addEventListener('submit', () => {
      form.classList.add('is-submitting');
    });
  });
})();
