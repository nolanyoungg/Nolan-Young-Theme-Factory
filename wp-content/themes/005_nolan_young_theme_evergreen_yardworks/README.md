# Evergreen Yardworks WordPress Theme

Evergreen Yardworks is a warm, photo-led WordPress theme for residential lawn care, landscaping maintenance, seasonal cleanup, recurring property plans, and estimate requests.

The homepage is implemented in `front-page.php`. Page templates live in `page-templates/`; reusable sections live in `template-parts/`; PHP modules live in `inc/`; source assets live in `src/`; compiled bundles are `assets/css/bundle.css` and `assets/js/bundle.js`.

## Installation

Activate the theme in WordPress, create Home, About, Services, Work, Blog, Contact, Privacy Policy, and Terms pages, assign the matching templates, set Home as the static front page, configure Primary and Footer menus, and add a custom logo if desired.

## Build

Use Node.js 18 or newer. Run `npm install`, `npm run dev` for watched development builds, and `npm run build` for minified production output. The required bundle names must remain `assets/css/bundle.css` and `assets/js/bundle.js`.

## Features

The theme includes desktop service and plan panels with rail hover/focus behavior, a mobile drawer with accordions, service selectors, seasonal tabs, portfolio filtering, FAQ accordions, estimate request forms, private admin submission storage, seasonal reminder signup management, responsive footer widgets, and policy-page routing.

## Accessibility

Keyboard operation, focus visibility, reduced motion, contrast, form validation, hidden-content behavior, and semantic landmarks are summarized in `accessibility/README.md`.

## Images And Licensing

Seeded stock photos are stored in `assets/images/hero/`, `assets/images/portfolio/`, and `assets/images/texture/` and documented in `assets/images/asset-manifest.json`. Local SVG files in `assets/icons/` are interface marks only. No external runtime images, CDN fonts, API keys, or third-party logos are required.

## Known Limitations

The theme manages seasonal reminder subscribers but does not send bulk campaigns. Policy pages render WordPress-managed content and do not provide legal text.

