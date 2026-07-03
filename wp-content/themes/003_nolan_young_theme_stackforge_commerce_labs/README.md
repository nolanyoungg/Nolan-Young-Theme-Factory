# Stackforge Commerce Labs WordPress Theme

Stackforge Commerce Labs is a premium WordPress and Shopify service-business theme for engineering-led agencies and operators. It includes a sticky header with dropdown panels, a mobile drawer, service and work templates, private inquiry storage, newsletter signup management, and a conversion-focused homepage.

The homepage is implemented in `front-page.php`. Page templates live in `page-templates/`; reusable sections live in `template-parts/`; PHP modules live in `inc/`; source assets live in `src/`; compiled bundles are `assets/css/bundle.css` and `assets/js/bundle.js`.

## Structure

- `functions.php`: loads the theme modules.
- `inc/`: setup, enqueueing, helpers, forms, newsletter, and routing.
- `assets/`: compiled bundles plus local SVG and raster assets.
- `src/`: SCSS and JavaScript source.
- `template-parts/`: reusable content sections.
- `page-templates/`: named WordPress page templates.
- `blocks/`: block-related documentation.
- `build/`: webpack configuration.
- `docs/`: setup and customization notes.
- `accessibility/`: behavior and keyboard guidance.

## Installation

1. Install the theme in WordPress and activate it.
2. Create and assign the Home, About, Services, Work, Blog, Contact, Privacy Policy, and Terms pages.
3. Set Home as the static front page.
4. Configure the Primary and Footer navigation menus.
5. Set the custom logo if desired.
6. Run the build process if you need to regenerate the compiled assets.

## Build

Use Node.js 18 or newer.

```bash
npm install
npm run dev
npm run build
```

The required compiled outputs are:

- `assets/css/bundle.css`
- `assets/js/bundle.js`

Do not rename those bundle files.

## Features

- Sticky desktop header with Services, About, and Blog dropdown panels.
- Dedicated mobile drawer with accordion sections and scroll locking.
- Homepage sections for hero, work, brand statement, services, process, filtering, case studies, comparison, packages, proof, blog preview, FAQ, and CTA.
- Public contact and single-service forms with private storage.
- Newsletter signup, subscriber administration, CSV export, and secure unsubscribe support.
- Responsive footer with CTA band, brand statement, link columns, contact block, and legal row.

## Page Templates

- `page-templates/template-about-us.php`
- `page-templates/template-services.php`
- `page-templates/template-single-service.php`
- `page-templates/template-work.php`
- `page-templates/template-blog.php`
- `page-templates/template-contact.php`
- `page-templates/template-policy.php`

The homepage is always handled by `front-page.php`.

## Header Behavior

- Services, About, and Blog buttons toggle their own dropdown panels.
- Only one desktop panel is open at a time.
- Clicking outside, pressing Escape, or clicking the active trigger closes the panel.
- Open panels show a backdrop and lock body scrolling.
- The Services and About panels use left-rail hover and keyboard focus to swap right-side content.
- The Blog panel shows a card grid instead of rail-controlled content.
- The mobile drawer is separate from the desktop panel system and uses accordions for Services, About, and Blog.

## Accessibility

See `accessibility/README.md` for keyboard, focus, reduced-motion, and hidden-content behavior. Interactive controls use visible focus states, closed drawers are removed from the tab order, and forms use server-side validation.

## Images And Licensing

All current visuals are local assets from the approved inventory. The theme uses:

- `assets/images/hero/`
- `assets/images/portfolio/`
- `assets/images/texture/`
- `assets/icons/`

No external runtime image CDN is required.

## Forms and Newsletter

Form submissions are stored privately in WordPress and are visible to administrators through the Forms admin menu. Newsletter subscribers are stored privately and can be exported from the Newsletter admin menu. Both systems use nonces, sanitization, and honeypot protection.

## Supporting Documentation

- `docs/getting-started.md`
- `docs/customization.md`
- `assets/icons/README.md`
- `blocks/README.md`
- `accessibility/README.md`

## Changelog and License

- `CHANGELOG.md` tracks release notes.
- `LICENSE.txt` contains the project license text.

## Known Limitations

The newsletter system manages subscribers only and does not send bulk campaigns. Policy pages render WordPress-managed content rather than generating legal text.
