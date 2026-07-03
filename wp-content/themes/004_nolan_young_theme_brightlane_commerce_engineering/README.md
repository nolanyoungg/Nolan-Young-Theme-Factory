# Brightlane Commerce Engineering WordPress Theme

Brightlane Commerce Engineering is a custom WordPress theme for a senior WordPress and Shopify engineering agency. It presents custom theme development, Shopify and WooCommerce planning, redesigns, integrations, performance repair, accessibility improvements, analytics instrumentation, retained launch support, case-study previews, contact forms, and newsletter signup.

The homepage is implemented in `front-page.php`. Root templates handle standard WordPress views, `inc/` contains theme setup, assets, forms, newsletter, helpers, custom post types, and policy routing, `assets/` stores compiled bundles and local media, `src/` stores JavaScript and SCSS sources, `template-parts/` stores reusable sections, `page-templates/` stores assignable page templates, `blocks/` is reserved documentation, `build/` contains Webpack, `docs/` contains setup guidance, and `accessibility/` documents interaction behavior.

## Installation

Install and activate the theme in WordPress. Create pages for Home, About, Services, Work, Blog, Contact, and Privacy Policy, then assign the provided templates where appropriate. Set Home as the static front page, configure Primary and Footer menus, set the custom logo if desired, and review policy content in WordPress before publishing it.

## Build Requirements

Use Node.js 18 or newer. Run `npm install`, `npm run dev` for watched development builds with source maps, and `npm run build` for minified production output. Source entry points are `src/js/main.js` and `src/scss/main.scss`; the required compiled files are exactly `assets/css/bundle.css` and `assets/js/bundle.js`. Do not rename the production bundles.

## Features

The theme includes sticky desktop header panels, Services and About rail hover/focus behavior, a Blog card panel, a dedicated mobile drawer with accordions, accessible work filtering, FAQ accordions, contact and single-service inquiry forms, private admin submission storage, newsletter subscriber management, responsive footer columns, CTA bands, and policy-page routing.

## Page Templates

The assignable page templates are About Us, Services, Single Service, Work, Blog, Contact, and Policy. The homepage is intentionally built through the root `front-page.php` file rather than an additional homepage template.

## Header Behavior

Services, About, and Blog open on primary-navigation click and update `aria-expanded`. Services and About expose internal rail buttons that update the right-side panel on hover and keyboard focus. The sticky header tightens after scroll, a backdrop appears while menus or the mobile drawer are open, body scroll is locked, outside click and Escape close overlays, and closed content uses `hidden`.

## Accessibility Notes

Keyboard operation, focus visibility, reduced motion, contrast, semantic landmarks, form validation, accordions, filtering, and hidden-content behavior are summarized in `accessibility/README.md`.

## Images And Licensing

Approved stock photos are listed in `assets/images/asset-manifest.json` with Unsplash source URLs and license notes. Hero images live in `assets/images/hero/`, work and supporting content images live in `assets/images/portfolio/`, texture assets live in `assets/images/texture/`, and original local SVG interface marks live in `assets/icons/`.

## Forms And Newsletter

Contact and service inquiries are stored privately in the WordPress admin `Forms` menu and can be exported by authorized administrators. Newsletter subscribers are managed in the `Newsletter` menu with active and unsubscribed status. Notifications use the configured administrator email; email failure does not block storage.

## Supporting Documentation

See `docs/getting-started.md`, `docs/customization.md`, `assets/icons/README.md`, `blocks/README.md`, and `accessibility/README.md`.

## Changelog And License

Release notes are maintained in `CHANGELOG.md`. License information is in `LICENSE.txt`.

## Known Limitations

The newsletter system manages subscribers only and does not send bulk marketing campaigns. Policy pages render WordPress-managed content and do not supply legal text.
