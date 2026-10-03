# Customize Hearth & Honey

The prepared Theme Name, Description, Text Domain, folder slug and npm package name are preserved. Bakery copy lives in `page-templates/`, `template-parts/` and `inc/helpers.php`. Menu names, prices and allergens are sample content and must be checked before real-world use.

The five homepage modules are included by `front-page.php`. Shared colors live in `src/scss/abstracts/_variables.scss`; mirror palette changes in `theme.json`. Typography uses system Georgia and Arial. Header, footer and homepage layout have their own SCSS partials. Run `npm run build` after edits.

Use only the approved local files recorded in `assets/images/asset-manifest.json`. Photography is illustrative stock: retain the captions and footer photographer credits. The two small SVG files in `assets/icons/` are decorative interface marks, not product photographs.

Update the sample address, opening hours and reserved `.example` email consistently in the visit page and footer. The demo button in `src/js/main.js` never transmits or stores field values. A real inquiry integration belongs in an appropriate separate service, along with an accurate privacy disclosure.
