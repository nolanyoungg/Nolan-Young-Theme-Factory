# Atlasframe Digital WordPress Theme

Atlasframe Digital is a premium WordPress systems studio theme for custom WordPress design, theme development, WooCommerce, integrations, website care, useful articles, private form submissions, and newsletter signup.

The homepage is implemented in `front-page.php`. Root templates handle WordPress fallbacks. `inc/` contains setup, enqueueing, helpers, private form storage, newsletter management, custom post types, and policy routing. `assets/` contains compiled bundles, approved images, and local SVG icons. `src/` contains SCSS and JavaScript source. `template-parts/` contains reusable sections. `page-templates/` contains About, Services, Single Service, Work, Blog, Contact, and Policy templates. `blocks/`, `docs/`, and `accessibility/` contain supporting documentation.

## Installation

Install and activate the theme in WordPress. Create Home, About, Services, Work, Blog, Contact, Privacy Policy, and any service-detail pages needed for the navigation. Assign the included page templates, set Home as the static front page, configure Primary and Footer menus, and set a custom logo if desired.

## Build Requirements

Use Node.js 18 or newer. Run `npm install`, `npm run dev` for watched development builds, and `npm run build` for minified production output. Source entries are `src/js/main.js` and `src/scss/main.scss`. The required compiled outputs are `assets/css/bundle.css` and `assets/js/bundle.js`; these bundle names must not be renamed.

## Features

The theme includes desktop header panels with click toggles, Services and About rail hover/focus behavior, a Blog card panel, sticky header state, body-scroll locking, backdrop closing, a dedicated mobile drawer with accordions, portfolio filtering, FAQ accordions, contact and service inquiry forms, private admin submission storage, newsletter subscriber management, responsive footer widgets, and policy-page routing.

## Page Templates

`front-page.php` owns the homepage. Page templates cover About Us, Services, Single Service, Work, Blog, Contact, and Policy pages. Template parts provide reusable heroes, service cards, process, proof fallback, blog previews, CTA banners, footer widgets, policy content, search items, empty states, pages, and single posts.

## Header Behavior

Services, About, and Blog buttons open their matching `nolan-menu` panels. Clicking the active trigger closes it, clicking another trigger swaps panels, outside clicks and Escape close panels, and the backdrop locks page scrolling while open. Services and About rail buttons update internal panel content on hover and keyboard focus without opening or closing the panel. Mobile navigation uses a separate drawer with Services, About Us, and Blog accordions plus direct Work and Contact links.

## Accessibility Notes

Keyboard operation, visible focus, reduced motion, contrast, semantic landmarks, form validation, accordions, filtering, and hidden-content behavior are documented in `accessibility/README.md`.

## Images And Licensing

Approved stock photos are listed in `assets/images/asset-manifest.json` and stored under `assets/images/hero/`, `assets/images/portfolio/`, and `assets/images/texture/`. The manifest records the Unsplash source URLs and license summary supplied by the asset seeding step. Local SVG interface marks live in `assets/icons/`; do not use SVG as replacement photography.

## Forms And Newsletter

Public contact and service forms submit through `admin-post.php`, use nonces, honeypots, sanitization, validation, private storage, and administrator notifications. Authorized administrators can view and export entries under the top-level Forms menu. Newsletter signup stores subscribers privately, prevents duplicate active records, supports Active and Unsubscribed states, and exports through the top-level Newsletter menu.

## Supporting Documentation

See `docs/getting-started.md`, `docs/customization.md`, `assets/icons/README.md`, `blocks/README.md`, and `accessibility/README.md`.

## Changelog And License

Release notes are maintained in `CHANGELOG.md`. The project license is included in `LICENSE.txt`.

## Known Limitations

The theme manages subscriber records but does not send bulk marketing campaigns. Policy pages render WordPress-managed content and do not provide legal terms. Work examples are anonymized project-type cards, not client endorsements.
