# Static Preview Template

Generated previews live under `docs/themes/NNN_nolan_young_theme_description/`.

Required files:

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
- local raster images in `assets/images/`

`index.html` should link to `homepage_preview.html` and may act as the preview landing page. Each preview page must use the same header, footer, class names, section order, copy style, image assets, buttons, and cards as the matching WordPress template.

The static header must link between all preview files:

- logo to `homepage_preview.html`
- Services to `services_preview.html`
- About to `about-us_preview.html`
- Work to `work_preview.html`
- Blog to `blog_preview.html`
- Contact CTA to `contact_preview.html`
- service detail links to `single_services_preview.html`

Keep previews local-only. Do not use CDNs, remote images, remote fonts, hotlinks, or placeholder image boxes.
