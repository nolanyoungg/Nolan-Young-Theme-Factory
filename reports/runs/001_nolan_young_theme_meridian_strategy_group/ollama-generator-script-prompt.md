# Ollama Builder Recovery Prompt

You are a local code generator. Do not apologize. Do not explain limitations.

Output exactly one file block and nothing else:

---FILE: reports/runs/001_nolan_young_theme_meridian_strategy_group/ollama-create-theme.js---
<complete Node.js script>
---END FILE---

The script will be run from the repository root with:

node reports/runs/001_nolan_young_theme_meridian_strategy_group/ollama-create-theme.js

The script must create a complete generated WordPress theme and matching static preview for:

Theme slug: 001_nolan_young_theme_meridian_strategy_group
Brand: Meridian Strategy Group
Business: high-end operations and compliance consulting firm for growing healthcare, wellness, and professional-services organizations.
Tone: precise, calm, senior, specific, premium.

Critical constraints:
- Do not use any network calls.
- Do not use npm packages.
- Use only Node built-ins: fs, path, zlib.
- Do not use eval, system calls, shell execution, child_process, or remote URLs.
- Create real files directly with fs.
- Create real local PNG image files using a small pure-JS PNG writer with zlib deflate and CRC32.
- PNGs must be colored, industry-specific abstract/professional raster images, not gray placeholders.
- Use ASCII text only in generated source files.
- No lorem ipsum, TODO, placeholder, sample service, coming soon, dummy content, or remote assets.

The script must create all required WordPress theme files under:
wp-content/themes/001_nolan_young_theme_meridian_strategy_group/

Required root files:
style.css, functions.php, theme.json, screenshot.png, README.md, .editorconfig, .gitignore, header.php, footer.php, front-page.php, index.php, page.php, single.php, archive.php, search.php, searchform.php, 404.php, 403.php, comments.php, package.json, package-lock.json, LICENSE.txt, CHANGELOG.md

Required inc files:
inc/setup.php, inc/enqueue.php, inc/template-tags.php, inc/helpers.php, inc/custom-post-types.php, inc/customizer.php, inc/forms.php, inc/newsletter.php, inc/policy-routing.php

Required assets:
assets/css/bundle.css
assets/js/bundle.js
assets/icons/icon1.svg
assets/icons/README.md
at least 6 PNG images split across assets/images/hero, assets/images/portfolio, assets/images/texture

Required src files:
src/js/main.js
src/scss/main.scss
src/scss/abstracts/_variables.scss
src/scss/abstracts/_mixins.scss
src/scss/abstracts/_functions.scss
src/scss/base/_reset.scss
src/scss/base/_typography.scss
src/scss/base/_accessibility.scss
src/scss/base/_forms.scss
src/scss/base/_newsletter.scss
src/scss/components/_buttons.scss
src/scss/components/_cards.scss
src/scss/components/_forms.scss
src/scss/components/_badges.scss
src/scss/components/_accordion.scss
src/scss/components/_carousel.scss
src/scss/components/_portfolio-filter.scss
src/scss/components/_before-after.scss
src/scss/layout/_container.scss
src/scss/layout/_header.scss
src/scss/layout/_footer.scss
src/scss/layout/_grid.scss
src/scss/layout/_sections.scss
src/scss/pages/_homepage.scss
src/scss/pages/_contact.scss
src/scss/pages/_about-us.scss
src/scss/pages/_services.scss
src/scss/pages/_work.scss
src/scss/pages/_blog.scss
src/scss/pages/_policy.scss

Required template parts:
template-parts/content-page.php
template-parts/content-single.php
template-parts/content-none.php
template-parts/content-policy.php
template-parts/content-search.php
template-parts/content-hero.php
template-parts/content-brand-statement.php
template-parts/content-featured-work.php
template-parts/content-all-services.php
template-parts/content-single-service-highlight.php
template-parts/content-process.php
template-parts/content-style-pillars.php
template-parts/content-testimonials.php
template-parts/content-blog-preview.php
template-parts/content-cta-banner.php
template-parts/content-footer-widgets.php
template-parts/content-home-hero.php
template-parts/content-home-services.php
template-parts/content-home-work.php
template-parts/content-home-process.php
template-parts/content-home-testimonials.php
template-parts/content-home-cta.php
template-parts/content-services.php
template-parts/content-about.php
template-parts/content-work.php
template-parts/content-contact.php
template-parts/content-blog.php
template-parts/content-single-service.php

Required page templates:
page-templates/template-about-us.php
page-templates/template-services.php
page-templates/template-single-service.php
page-templates/template-work.php
page-templates/template-blog.php
page-templates/template-contact.php
page-templates/template-policy.php

Other required files:
blocks/README.md
build/webpack.config.js
docs/getting-started.md
docs/customization.md
accessibility/README.md

The script must also create the static preview under:
docs/themes/001_nolan_young_theme_meridian_strategy_group/

Required preview files:
index.html
homepage_preview.html
services_preview.html
about-us_preview.html
contact_preview.html
single_services_preview.html
blog_preview.html
work_preview.html
assets/css/preview.css
assets/js/preview.js
assets/images/README.md
at least 6 local PNG images copied or generated into assets/images/
README.md

Preview header links:
- Logo links to homepage_preview.html
- Services links to services_preview.html
- About links to about-us_preview.html
- Work links to work_preview.html
- Blog links to blog_preview.html
- Contact Us CTA links to contact_preview.html
- Service detail links to single_services_preview.html

Nolan-menu header must appear in WordPress and every preview page:
- Desktop layout: logo, Services, About, Work, Blog, Contact Us CTA.
- Contact must not be a primary nav item.
- Include:
  <button data-menu-item="services" aria-controls="nolan-menu-services" aria-expanded="false">
  <div data-menu-dropdown="services" id="nolan-menu-services" hidden>
  <button data-menu-item="about" aria-controls="nolan-menu-about" aria-expanded="false">
  <div data-menu-dropdown="about" id="nolan-menu-about" hidden>
  <button data-menu-item="blog" aria-controls="nolan-menu-blog" aria-expanded="false">
  <div data-menu-dropdown="blog" id="nolan-menu-blog" hidden>
  rail buttons with data-rail-item
  rail sections with data-rail-content

JavaScript behavior in both bundle.js and preview.js:
- Only one panel open at a time.
- Same trigger toggles closed.
- Outside click closes.
- Escape closes.
- Backdrop appears.
- Body class locks scroll.
- aria-expanded updates.
- hidden attribute updates.
- Rail hover and focus update visible rail content.

Use a no-dependency build system:
- package.json build script should run: node build/webpack.config.js
- build/webpack.config.js should copy src/js/main.js to assets/js/bundle.js and src/scss/main.scss to assets/css/bundle.css, or write already-built files.
- package-lock.json must be valid minimal lockfile.

Update docs/index.html to include a card linking to themes/001_nolan_young_theme_meridian_strategy_group/homepage_preview.html.

Make the site premium and complete:
- Home: hero, services, work/proof, trust metrics, process, testimonials/proof, resources, CTA, footer.
- Services: all four services with specific copy.
- Single Service: Operating Model Design page.
- About: positioning, principles, leadership style, credibility.
- Work: 3 case studies with outcomes.
- Blog: 3 resource articles.
- Contact: consultation form markup, contact details, fit criteria.

PHP:
- All PHP must pass php -l.
- Use get_header(), get_footer(), get_template_part().
- Enqueue assets with wp_enqueue_style and wp_enqueue_script using filemtime.
- Escape dynamic WordPress output with esc_html, esc_url, esc_attr, wp_kses_post where needed.
- Avoid unsafe functions.

Remember: output only the single file block for the Node script.
