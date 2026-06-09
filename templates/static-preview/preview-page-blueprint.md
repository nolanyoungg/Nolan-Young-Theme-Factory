# Static Preview Page Blueprint

Use this structure for every required preview page:

```text
doctype/html/head
  local preview.css
body
  sticky nolan-site-header
    logo -> homepage_preview.html
    Services button/link -> services_preview.html
    About button/link -> about-us_preview.html
    Work link -> work_preview.html
    Blog button/link -> blog_preview.html
    Contact Us CTA -> contact_preview.html
    Nolan-menu dropdown panels for services, about, blog
    mobile drawer with local links
  main page-specific content
    same section order and class names as the matching WordPress template
    local images from assets/images/
  footer
  local preview.js
```

Required Nolan-menu attributes:

```html
<button data-menu-item="services" aria-controls="preview-menu-services" aria-expanded="false"></button>
<div data-menu-dropdown="services" id="preview-menu-services" hidden></div>
<button data-rail-item="overview"></button>
<section data-rail-content="overview"></section>
```

Use matching `data-rail-item` and `data-rail-content` keys inside each dropdown.
