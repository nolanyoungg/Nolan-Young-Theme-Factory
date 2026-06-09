(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const submenuParents = nav ? nav.querySelectorAll('.menu-item-has-children') : [];

  if (toggle && nav) {
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
      const open = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!open);
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
})();
