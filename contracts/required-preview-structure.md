# Required Preview Structure

Each theme preview must live at `docs/themes/NNN_nolan_young_theme_description/` and include:

- `index.html`
- `homepage_preview.html`
- `services_preview.html`
- `about-us_preview.html`
- `contact_preview.html`
- `single_services_preview.html`
- `blog_preview.html`
- `work_preview.html`
- `assets/css/preview.css`
- `assets/js/preview.js`
- `assets/images/README.md`
- `README.md`

`index.html` should redirect or link clearly to `homepage_preview.html`.

Every preview page must:

- use the same header, footer, class names, section order, and visual system as the matching WordPress template
- include local CSS and JS references
- use local image assets only
- include a clickable header that links between all seven preview files
- include the Nolan-menu data attributes required by `contracts/nolan-menu-header.md`
- avoid placeholder, filler, remote, CDN, or hotlinked content

The preview must be local-only, representative, and linked from `docs/index.html`.


