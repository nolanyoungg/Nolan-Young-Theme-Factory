# Northstar Websites WordPress Theme

Northstar Websites is a modern service-business WordPress theme for website design, build, support, work examples, resources, contact forms, and newsletter signup.

The homepage is implemented in `front-page.php`. Page templates live in `page-templates/`; reusable sections live in `template-parts/`; PHP modules live in `inc/`; source assets live in `src/`; compiled bundles are `assets/css/bundle.css` and `assets/js/bundle.js`.

## Installation

Activate the theme in WordPress, create Home, About, Services, Work, Blog, Contact, Privacy Policy, and Terms pages, assign the matching templates, set Home as the static front page, configure Primary and Footer menus, and add a custom logo if desired.

## Build

Use Node.js 18 or newer. Run `npm install`, `npm run dev` for watched development builds, and `npm run build` for minified production output. The required bundle names must remain `assets/css/bundle.css` and `assets/js/bundle.js`.

## Features

The theme includes desktop menu panels with rail hover/focus behavior, a mobile drawer with accordions, portfolio filtering, FAQ accordions, contact and service inquiry forms, private admin submission storage, newsletter subscriber management, responsive footer widgets, and policy-page routing.

## Accessibility

Keyboard operation, focus visibility, reduced motion, contrast, form validation, hidden-content behavior, and semantic landmarks are summarized in `accessibility/README.md`.

## Images And Licensing

All current visual assets are original local SVG interface graphics stored in `assets/images/hero/`, `assets/images/portfolio/`, `assets/images/texture/`, and `assets/icons/`. No external runtime images, CDN fonts, API keys, or third-party logos are required.

## Known Limitations

The theme manages newsletter subscribers but does not send bulk marketing campaigns. Policy pages render WordPress-managed content and do not provide legal text.
