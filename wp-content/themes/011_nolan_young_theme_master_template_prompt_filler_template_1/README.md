# Northstar Websites Theme

Northstar Websites is a WordPress theme for service businesses that need a clear, content-forward site with practical inquiry flows, reusable sections, and local assets.

## Structure

- `inc/` - theme setup, helpers, forms, newsletter, and routing.
- `src/` - source JavaScript and SCSS.
- `assets/` - compiled bundles, local images, and SVG icons.
- `template-parts/` - reusable content sections.
- `page-templates/` - page-specific layouts.
- `build/` - Webpack configuration.
- `docs/` - setup and customization notes.
- `accessibility/` - interaction and accessibility notes.

## Build

- `npm run dev`
- `npm run build`

The compiled outputs are:

- `assets/css/bundle.css`
- `assets/js/bundle.js`

## Notes

The homepage is built in `front-page.php`, and forms/newsletter data are stored privately in WordPress admin areas.
