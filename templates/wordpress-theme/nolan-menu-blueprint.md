# Nolan-Menu WordPress Blueprint

Implement the header in `header.php` and the behavior in `src/js/main.js`, compiled to `assets/js/bundle.js`.

Required structure:

```text
header.nolan-site-header
  a.nolan-brand -> home_url('/')
  nav.nolan-primary-nav
    button[data-menu-item="services"]
    button[data-menu-item="about"]
    a -> /work/
    button[data-menu-item="blog"]
  a.nolan-header-cta -> /contact/
  button.nolan-mobile-toggle
  div.nolan-menu-backdrop
  div[data-menu-dropdown="services"]
  div[data-menu-dropdown="about"]
  div[data-menu-dropdown="blog"]
  div.nolan-mobile-drawer
```

Behavior requirements:

- Update `aria-expanded` on trigger buttons.
- Hide closed panels from assistive technology.
- Close on outside click and Escape.
- Lock body scroll while a panel or mobile drawer is open.
- Keep only one panel open at a time.
- Use hover and keyboard focus to switch left-rail content.
- Avoid JavaScript errors if a panel is absent on a template.
