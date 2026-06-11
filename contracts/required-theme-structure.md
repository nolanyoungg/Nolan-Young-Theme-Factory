# Required Theme Structure

Every generated classic WordPress theme must include at least the minimum structure below. Extra files are allowed when they support the prompt and live in the correct folder.

Required root files:

- `style.css`
- `functions.php`
- `theme.json`
- `screenshot.png`
- `README.md`
- `.editorconfig`
- `.gitignore`
- `header.php`
- `footer.php`
- `front-page.php`
- `index.php`
- `page.php`
- `single.php`
- `archive.php`
- `search.php`
- `searchform.php`
- `404.php`
- `403.php`
- `comments.php`
- `package.json`
- `package-lock.json`
- `LICENSE.txt`
- `CHANGELOG.md`

Required `inc/` files:

- `inc/setup.php`
- `inc/enqueue.php`
- `inc/template-tags.php`
- `inc/helpers.php`
- `inc/custom-post-types.php`
- `inc/customizer.php`
- `inc/forms.php`
- `inc/newsletter.php`
- `inc/policy-routing.php`

Required `assets/` structure:

- `assets/css/bundle.css`
- `assets/js/bundle.js`
- `assets/icons/icon1.svg`
- `assets/icons/README.md`
- `assets/images/hero/`
- `assets/images/portfolio/`
- `assets/images/texture/`

Required `src/` structure:

- `src/js/main.js`
- `src/scss/main.scss`
- `src/scss/abstracts/_variables.scss`
- `src/scss/abstracts/_mixins.scss`
- `src/scss/abstracts/_functions.scss`
- `src/scss/base/_reset.scss`
- `src/scss/base/_typography.scss`
- `src/scss/base/_accessibility.scss`
- `src/scss/base/_forms.scss`
- `src/scss/base/_newsletter.scss`
- `src/scss/components/_buttons.scss`
- `src/scss/components/_cards.scss`
- `src/scss/components/_forms.scss`
- `src/scss/components/_badges.scss`
- `src/scss/components/_accordion.scss`
- `src/scss/components/_carousel.scss`
- `src/scss/components/_portfolio-filter.scss`
- `src/scss/components/_before-after.scss`
- `src/scss/layout/_container.scss`
- `src/scss/layout/_header.scss`
- `src/scss/layout/_footer.scss`
- `src/scss/layout/_grid.scss`
- `src/scss/layout/_sections.scss`
- `src/scss/pages/_homepage.scss`
- `src/scss/pages/_contact.scss`
- `src/scss/pages/_about-us.scss`
- `src/scss/pages/_services.scss`
- `src/scss/pages/_work.scss`
- `src/scss/pages/_blog.scss`
- `src/scss/pages/_policy.scss`

Required `template-parts/` files:

- `template-parts/content-page.php`
- `template-parts/content-single.php`
- `template-parts/content-none.php`
- `template-parts/content-policy.php`
- `template-parts/content-search.php`
- `template-parts/content-hero.php`
- `template-parts/content-brand-statement.php`
- `template-parts/content-featured-work.php`
- `template-parts/content-all-services.php`
- `template-parts/content-single-service-highlight.php`
- `template-parts/content-process.php`
- `template-parts/content-style-pillars.php`
- `template-parts/content-testimonials.php`
- `template-parts/content-blog-preview.php`
- `template-parts/content-cta-banner.php`
- `template-parts/content-footer-widgets.php`

Required `page-templates/` files:

- `page-templates/template-about-us.php`
- `page-templates/template-services.php`
- `page-templates/template-single-service.php`
- `page-templates/template-work.php`
- `page-templates/template-blog.php`
- `page-templates/template-contact.php`
- `page-templates/template-policy.php`

Required supporting files:

- `blocks/README.md`
- `build/webpack.config.js`
- `docs/getting-started.md`
- `docs/customization.md`
- `accessibility/README.md`

Extra files must be placed in the correct area:

- Extra WordPress page templates belong in `page-templates/`.
- Extra reusable PHP sections belong in `template-parts/`.
- Extra PHP helpers belong in `inc/`.
- Extra styles belong in `src/scss/` and must compile into `assets/css/bundle.css`.
- Extra JavaScript belongs in `src/js/` and must compile into `assets/js/bundle.js`.
- Extra theme images belong in `assets/images/`.

Required files must not be removed, renamed, or moved.
