# ForgeCart Studio WordPress Theme

ForgeCart Studio is a premium WordPress theme for a studio that builds WordPress sites, Shopify stores, WooCommerce projects, migrations, conversion-focused pages, and ongoing site care. The theme presents ForgeCart as one coherent content and commerce partner for small businesses, service brands, creators, and ecommerce teams.

## Structure

Root templates include `front-page.php`, `index.php`, `page.php`, `single.php`, `archive.php`, `search.php`, `404.php`, `403.php`, and `searchform.php`. Modular PHP lives in `inc/`; reusable sections live in `template-parts/`; page templates live in `page-templates/`; source JavaScript and SCSS live in `src/`; compiled runtime assets live in `assets/`; block notes live in `blocks/`; setup notes live in `docs/`; accessibility notes live in `accessibility/`; build configuration lives in `build/`.

## Installation

Install and activate the theme, create Home, About, Services, Work, Blog, Contact, Privacy Policy, and Terms pages as needed, assign the matching page templates, set Home as the static front page, configure Primary and Footer menus, and set a custom logo if desired. The homepage is implemented only in root `front-page.php`.

## Build

Use Node.js 18 or newer. Run `npm install`, `npm run dev` for watched development builds with source maps, and `npm run build` for minified production output. The required compiled files are `assets/css/bundle.css` and `assets/js/bundle.js`; do not rename them.

## Features

The theme includes a sticky logo/nav/CTA header, Services and About dropdown panels with left-rail hover and keyboard-focus content switching, a Blog dropdown card grid, a dedicated mobile drawer with accordions, accessible work filtering, FAQ accordions, contact and service inquiry forms, private Forms administration, Newsletter subscriber management, CSV exports, responsive footer columns, and WordPress-managed policy routing.

## Header Behavior

Services, About, and Blog open on click, update `aria-expanded`, close on repeat click, outside click, backdrop click, or Escape, and lock body scrolling while open. Services and About rail buttons update only the visible right-side panel content on hover or keyboard focus. The mobile drawer uses separate accordion content so closed links are not keyboard reachable.

## Accessibility

Keyboard operation, focus visibility, reduced motion, semantic landmarks, form validation, filtering, accordions, and hidden-content behavior are documented in `accessibility/README.md`.

## Images And Licensing

Seeded stock photos live in `assets/images/hero/`, `assets/images/portfolio/`, and `assets/images/texture/`. The manifest at `assets/images/asset-manifest.json` records Unsplash source URLs and license notes. Local SVG marks live in `assets/icons/`; SVG is used for interface identity only.

## Forms And Newsletter

Contact and service forms use nonces, sanitization, validation, a honeypot field, private custom post type storage, admin notifications, and CSV export from the Forms admin menu. Newsletter signup stores normalized emails privately, prevents duplicate active records, tracks Active and Unsubscribed states, and exports from the Newsletter admin menu. Bulk campaign sending is intentionally not included.

## Supporting Documentation

See `docs/getting-started.md`, `docs/customization.md`, `assets/icons/README.md`, `blocks/README.md`, and `accessibility/README.md`.

## Known Limitations

Policy pages render WordPress-managed policy content and do not provide legal text. The theme manages inquiries and subscribers but is not a CRM, email marketing platform, or official Shopify partner certification system.
