# Nolan Young Theme Template 01

A production-oriented **classic WordPress theme** for WordPress 7.0 that combines the PHP template hierarchy with modern WordPress features such as `theme.json` version 3, block patterns, editor styles, registered block styles, accessible navigation, and a standards-based webpack build.

This document is the authoritative operating manual for the theme. It explains what the theme owns, what it deliberately does not own, how WordPress loads it, how the source and compiled assets are organized, how the webpack pipeline works, which commands are safe to run, how to package a release, and which checks must pass before deployment.

## Repository authority and sources of truth

This Git repository is the authoritative development source. The production theme ZIP and any copy installed on WordPress are generated deployment artifacts; they must never replace the repository as the master copy.

The repository is intentionally organized with the theme files at the repository root. The GitHub repository name may differ from the runtime theme slug, but the runtime identity remains `nolan-young-theme-template-01` unless a deliberate, versioned migration changes the theme name, text domain, package name, generated ZIP name, and related integration contracts together.

The source hierarchy is strict:

- PHP templates, `inc/`, `template-parts/`, `patterns/`, and `theme.json` are maintained runtime source.
- `src/scss/` is the maintained source for CSS.
- `src/js/` is the maintained source for JavaScript.
- `assets/css/` and `assets/js/` contain committed generated runtime assets. They are reviewed and deployed, but never edited manually.
- `package.json` defines the supported npm interface.
- `package-lock.json` is the locked Node dependency graph.
- `webpack.config.js` defines the asset pipeline.
- `build/` contains repository automation helpers; it is not the compiled-output directory.
- `README.md` is the operating manual.
- `CHANGELOG.md` records released changes.
- `dist/` contains local release output and is ignored by Git.
- The `nolan-young-core` plugin is a separate project and remains the authority for persistent/business functionality.

The required change flow is:

```text
Git source
→ edit maintained PHP/src files
→ run a development watcher
→ run npm run build last
→ review generated assets and WordPress behavior
→ commit source plus generated assets
→ run npm run package
→ deploy the generated dist ZIP
```

Repository automation under `.github/` validates the production build and PHP syntax on pushes and pull requests. `CONTRIBUTING.md` defines the contribution contract, and `SECURITY.md` defines security-reporting expectations.

---

## Table of contents

1. [Project status](#project-status)
2. [Theme classification](#theme-classification)
3. [Requirements](#requirements)
4. [Production installation](#production-installation)
5. [Source-development setup](#source-development-setup)
6. [Architecture boundaries](#architecture-boundaries)
7. [High-level request flow](#high-level-request-flow)
8. [Complete directory guide](#complete-directory-guide)
9. [Root WordPress files](#root-wordpress-files)
10. [PHP bootstrap and modules](#php-bootstrap-and-modules)
11. [Template hierarchy](#template-hierarchy)
12. [Page templates](#page-templates)
13. [Template parts](#template-parts)
14. [Companion plugin integration](#companion-plugin-integration)
15. [Primary navigation and mega menus](#primary-navigation-and-mega-menus)
16. [Front-page composition](#front-page-composition)
17. [`theme.json` design system](#themejson-design-system)
18. [SCSS architecture](#scss-architecture)
19. [JavaScript architecture](#javascript-architecture)
20. [Webpack and build system](#webpack-and-build-system)
21. [NPM commands](#npm-commands)
22. [Generated asset metadata](#generated-asset-metadata)
23. [WordPress asset enqueueing](#wordpress-asset-enqueueing)
24. [Editor styles](#editor-styles)
25. [Block patterns and block styles](#block-patterns-and-block-styles)
26. [Customizer settings](#customizer-settings)
27. [Internationalization](#internationalization)
28. [Security requirements](#security-requirements)
29. [Accessibility requirements](#accessibility-requirements)
30. [PHP coding standards](#php-coding-standards)
31. [Testing and validation](#testing-and-validation)
32. [Local debugging](#local-debugging)
33. [Release and packaging workflow](#release-and-packaging-workflow)
34. [Production ZIP contents](#production-zip-contents)
35. [Common development workflows](#common-development-workflows)
36. [Troubleshooting](#troubleshooting)
37. [Non-negotiable maintenance rules](#non-negotiable-maintenance-rules)
38. [Official WordPress references](#official-wordpress-references)

---

## Project status

| Property | Value |
|---|---|
| Theme name | Nolan Young Theme Template 01 |
| Theme slug | `nolan-young-theme-template-01` |
| Current version | `1.2.1` |
| Theme type | Classic PHP theme with `theme.json` |
| Minimum WordPress | WordPress 7.0 |
| Tested WordPress | WordPress 7.0 |
| Minimum PHP | PHP 7.4 |
| Text domain | `nolan-young-theme-template-01` |
| Node.js for source development | Node.js 18.12 or newer |
| npm for source development | npm 8.19.2 or newer |
| JavaScript/CSS build | `@wordpress/scripts` and webpack |
| Companion plugin | `nolan-young-core` |
| License | GPL-2.0-or-later |

The WordPress and PHP values above must match the metadata in `style.css`. The npm package version must also match the theme version. `npm run validate` checks these relationships.

---

## Theme classification

This is a **classic theme**, not a full block theme.

A classic theme primarily uses PHP template files such as:

```text
front-page.php
home.php
page.php
single.php
archive.php
404.php
```

The theme also uses modern WordPress functionality:

- `theme.json` version 3 for global settings and styles.
- Block editor styles through `add_editor_style()`.
- Theme patterns stored in `/patterns`.
- Registered block style variations.
- Core enqueue APIs for CSS and JavaScript.
- A webpack build based on the WordPress-maintained `@wordpress/scripts` package.

The presence of `theme.json` does not convert the project into a block theme. The PHP template hierarchy remains the request-rendering system.

---

## Requirements

### Runtime requirements

The installed production theme requires:

- WordPress 7.0 or newer.
- PHP 7.4 or newer.
- A web server supported by WordPress.
- A normal WordPress database connection.
- The `nolan-young-core` companion plugin when Service content, contact forms, newsletter forms, access rules, or privacy integrations are required.

Visitors do **not** need Node.js, npm, Composer, webpack, or the source directory. Those tools are for development only.

### Development requirements

To edit SCSS or JavaScript source, install:

- Node.js 18.12 or newer.
- npm 8.19.2 or newer.
- Git.
- A local WordPress 7.0 development site.
- PHP 7.4 or newer for syntax checks.
- Composer when running PHP_CodeSniffer locally.

Recommended development tools:

- Local, wp-env, Docker, or another isolated WordPress development environment.
- Visual Studio Code.
- Theme Check.
- WordPress Theme Unit Test data.
- A mail-capture plugin for testing plugin-generated email.
- Browser developer tools.

### Confirm installed versions

```bash
node --version
npm --version
php --version
git --version
```

The project declares its supported Node and npm versions in `package.json` under `engines`.

---

## Production installation

Use the installable production ZIP, not the source ZIP.

### Install the companion plugin first

1. Sign in to WordPress Admin.
2. Go to **Plugins → Add Plugin → Upload Plugin**.
3. Upload `nolan-young-core.zip`.
4. Select **Install Now**.
5. Activate **Nolan Young Core**.

### Install the theme

1. Go to **Appearance → Themes → Add New → Upload Theme**.
2. Upload `nolan-young-theme-template-01.zip`.
3. Select **Install Now**.
4. Activate **Nolan Young Theme Template 01**.
5. Clear page, object, browser, CDN, and host-level caches.

### Complete initial WordPress configuration

After activation:

1. Go to **Settings → Reading**.
2. Assign a static front page if the site uses one.
3. Assign a Posts page if the site uses the blog index.
4. Go to **Appearance → Menus** or the applicable WordPress navigation interface.
5. Confirm that a menu is assigned to **Primary Navigation**.
6. Confirm that the order is Services, About, Work, Blog unless the project requires a deliberate change.
7. Configure the site logo through **Appearance → Customize → Site Identity**.
8. Create a Contact page at `/contact/` or update the header CTA URL in code.
9. Configure the footer menu and footer widget area if used.
10. Confirm permalinks under **Settings → Permalinks**.

---

## Source-development setup

The source package includes development files that are intentionally omitted from the production ZIP.

### First-time setup

Open a terminal in the theme root—the directory that contains `package.json`:

```text
wp-content/themes/nolan-young-theme-template-01/
```

Install the exact dependency tree from `package-lock.json`:

```bash
npm ci
```

Use `npm ci` for normal development and CI. It installs the locked versions and fails when `package.json` and `package-lock.json` disagree.

Use `npm install` only when intentionally adding, removing, or updating dependencies. Any dependency change must include the resulting `package-lock.json` change in the same commit.

### Windows PowerShell example

```powershell
Set-Location "C:\Users\NolanYoung\Local Sites\cvc\app\public\wp-content\themes\nolan-young-theme-template-01"
npm ci
npm run build
```

### macOS or Linux example

```bash
cd /path/to/wordpress/wp-content/themes/nolan-young-theme-template-01
npm ci
npm run build
```

### Verify the checkout

```bash
npm run build
```

A clean checkout is not ready for review until the final build gate passes. `npm test` is available as an alias for the same gate.

---

## Architecture boundaries

The most important architectural rule is:

> The theme owns presentation. The companion plugin owns persistent application functionality.

### The theme may own

- PHP template hierarchy files.
- HTML structure and semantic landmarks.
- Frontend CSS and JavaScript.
- Theme-specific image assets.
- Navigation presentation and accessible dropdown behavior.
- `theme.json` settings and styles.
- Block patterns.
- Block style variations.
- Registered navigation locations.
- Registered widget areas.
- Theme supports.
- Presentation-only Customizer settings.
- Templates for content types registered by a plugin.
- Presentation integrations with the companion plugin.

### The theme must not own

- Custom post type registration.
- Custom taxonomy registration.
- Contact-form submission processing.
- Newsletter subscription processing.
- Email delivery.
- Persistent inquiry records.
- Authentication or authorization rules.
- REST endpoints for application functionality.
- Database tables.
- API credentials.
- Payment processing.
- Business data that must survive a theme change.

### Companion plugin responsibility

The `nolan-young-core` plugin owns functionality that must remain available when the active theme changes, including:

- The `ny_service` post type.
- The `ny_service_category` taxonomy.
- Contact form processing.
- Newsletter form processing.
- Stored inquiry/subscription records.
- Access-control rules and 403 status handling.
- WordPress personal-data export and erasure integrations.

The theme may render plugin data, but it must not duplicate the plugin’s application logic.

---

## High-level request flow

A typical frontend request follows this sequence:

1. WordPress boots core.
2. Active plugins load, including `nolan-young-core`.
3. WordPress loads this theme’s `functions.php`.
4. `functions.php` loads the focused modules under `/inc`.
5. Hooks register theme support, menus, widget areas, assets, block styles, and presentation filters.
6. WordPress resolves the request through the template hierarchy.
7. The selected root template calls `get_header()`.
8. `header.php` renders the site header and WordPress-managed primary navigation.
9. The root template loads focused template parts.
10. WordPress runs the Loop for the current query where applicable.
11. The template calls `get_footer()`.
12. Enqueued assets are printed through `wp_head()` and `wp_footer()`.
13. JavaScript progressively enhances navigation, mega menus, and accordions.

Templates must not manually load CSS or JavaScript with hardcoded `<link>` or `<script>` tags.

---

## Complete directory guide

```text
nolan-young-theme-template-01/
├── accessibility/
│   └── README.md
├── assets/
│   ├── css/
│   │   ├── bundle-rtl.css
│   │   ├── bundle.asset.php
│   │   ├── bundle.css
│   │   ├── editor-rtl.css
│   │   ├── editor.asset.php
│   │   └── editor.css
│   ├── icons/
│   │   ├── arrow-right.svg
│   │   ├── icon1.svg
│   │   └── README.md
│   ├── images/
│   │   ├── hero/
│   │   │   └── README.md
│   │   ├── navigation/
│   │   │   ├── about-us.svg
│   │   │   ├── blog-placeholder.svg
│   │   │   ├── careers.svg
│   │   │   ├── future-work.svg
│   │   │   ├── meet-the-team.svg
│   │   │   ├── service-1.svg
│   │   │   ├── service-2.svg
│   │   │   ├── service-3.svg
│   │   │   └── service-4.svg
│   │   ├── portfolio/
│   │   │   └── README.md
│   │   └── texture/
│   │       └── README.md
│   └── js/
│       ├── bundle.asset.php
│       └── bundle.js
├── build/
│   ├── clean.js
│   ├── dev.js
│   ├── package-theme.js
│   └── validate.js
├── docs/
│   ├── accessibility.md
│   ├── architecture.md
│   ├── customization.md
│   ├── getting-started.md
│   └── release-process.md
├── inc/
│   ├── integrations/
│   │   └── nolan-young-core.php
│   ├── block-styles.php
│   ├── customizer.php
│   ├── editor.php
│   ├── enqueue.php
│   ├── navigation.php
│   ├── setup.php
│   ├── template-functions.php
│   └── template-tags.php
├── languages/
│   └── nolan-young-theme-template-01.pot
├── page-templates/
│   ├── template-about-us.php
│   ├── template-blog-landing.php
│   ├── template-blog.php
│   ├── template-contact.php
│   ├── template-policy.php
│   ├── template-service-detail.php
│   ├── template-services.php
│   ├── template-single-service.php
│   └── template-work.php
├── patterns/
│   ├── call-to-action.php
│   ├── featured-work.php
│   ├── hero.php
│   ├── services-grid.php
│   └── testimonials.php
├── src/
│   ├── js/
│   │   ├── components/
│   │   │   ├── accordion.js
│   │   │   ├── mega-menu.js
│   │   │   └── navigation.js
│   │   ├── utilities/
│   │   │   └── dom.js
│   │   └── main.js
│   └── scss/
│       ├── abstracts/
│       │   ├── _functions.scss
│       │   ├── _mixins.scss
│       │   └── _variables.scss
│       ├── base/
│       │   ├── _accessibility.scss
│       │   ├── _form-elements.scss
│       │   ├── _newsletter.scss
│       │   ├── _reset.scss
│       │   └── _typography.scss
│       ├── components/
│       │   ├── _accordion.scss
│       │   ├── _badges.scss
│       │   ├── _before-after.scss
│       │   ├── _buttons.scss
│       │   ├── _cards.scss
│       │   ├── _carousel.scss
│       │   ├── _form-components.scss
│       │   ├── _mega-menu.scss
│       │   └── _portfolio-filter.scss
│       ├── layout/
│       │   ├── _container.scss
│       │   ├── _footer.scss
│       │   ├── _grid.scss
│       │   ├── _header.scss
│       │   └── _sections.scss
│       ├── pages/
│       │   ├── _about-us.scss
│       │   ├── _blog.scss
│       │   ├── _contact.scss
│       │   ├── _error.scss
│       │   ├── _homepage.scss
│       │   ├── _policy.scss
│       │   ├── _search.scss
│       │   ├── _service-detail.scss
│       │   ├── _services.scss
│       │   └── _work.scss
│       ├── editor.scss
│       └── main.scss
├── template-parts/
│   ├── content/
│   │   ├── content-none.php
│   │   ├── content-page.php
│   │   ├── content-policy.php
│   │   ├── content-post.php
│   │   ├── content-search.php
│   │   ├── content-single.php
│   │   └── content.php
│   ├── errors/
│   │   └── content-403.php
│   ├── footer/
│   │   └── footer-widgets.php
│   ├── front-page/
│   │   ├── content-all-services.php
│   │   ├── content-blog-preview.php
│   │   ├── content-featured-work.php
│   │   ├── content-process.php
│   │   ├── content-service-highlight.php
│   │   ├── content-single-service-highlight.php
│   │   ├── content-style-pillars.php
│   │   └── content-testimonials.php
│   ├── global/
│   │   ├── content-brand-statement.php
│   │   ├── content-cta-banner.php
│   │   └── content-hero.php
│   └── header/
│       ├── mega-menu-blog.php
│       ├── mega-menu-featured.php
│       ├── mobile-navigation.php
│       ├── primary-navigation.php
│       └── site-branding.php
├── tests/
│   ├── bootstrap.php
│   ├── test-assets.php
│   ├── test-required-files.php
│   └── test-theme-setup.php
├── .editorconfig
├── .gitignore
├── 404.php
├── archive-ny_service.php
├── archive.php
├── CHANGELOG.md
├── comments.php
├── composer.json
├── FILE-MANIFEST.txt
├── footer.php
├── front-page.php
├── functions.php
├── header.php
├── home.php
├── index.php
├── LICENSE.txt
├── package-lock.json
├── package.json
├── page.php
├── phpcs.xml.dist
├── phpunit.xml.dist
├── privacy-policy.php
├── README.md
├── screenshot.png
├── search.php
├── searchform.php
├── single-ny_service.php
├── single.php
├── singular.php
├── style.css
├── taxonomy-ny_service_category.php
├── theme.json
└── webpack.config.js
```

### Source versus runtime directories

| Location | Purpose | Edit directly? | Included in production ZIP? |
|---|---|---:|---:|
| `src/js/` | JavaScript source modules | Yes | No |
| `src/scss/` | SCSS source partials | Yes | No |
| `assets/js/` | Compiled browser JavaScript | No | Yes |
| `assets/css/` | Compiled browser CSS | No | Yes |
| `assets/images/` | Runtime images | Yes | Yes |
| `assets/icons/` | Runtime icons | Yes | Yes |
| `build/` | Node helper scripts | Yes | No |
| `webpack.config.js` | Webpack configuration | Yes | No |
| `node_modules/` | Installed development dependencies | Never | No |
| `dist/` | Locally generated release ZIP | Never manually | No |

---

## Root WordPress files

### `style.css`

WordPress reads the comment header in `style.css` to register the theme. This file must remain in the theme root.

It defines:

- Theme name.
- Theme version.
- Minimum WordPress version.
- Tested WordPress version.
- Minimum PHP version.
- License.
- Text domain.
- Theme tags.

The theme’s frontend stylesheet is not authored in `style.css`; it is compiled to `assets/css/bundle.css` and enqueued through WordPress.

### `functions.php`

`functions.php` is a bootstrap file only. It loads focused modules from `/inc` using `get_theme_file_path()` and `require_once`.

Do not add large implementations directly to `functions.php`.

### `theme.json`

`theme.json` is the global design-system authority for supported WordPress settings and block/global styles.

### `screenshot.png`

The screenshot is exactly 1200×900 pixels and appears in **Appearance → Themes**.

### `CHANGELOG.md`

Every release must add a dated entry explaining meaningful user-facing, architectural, build, security, or compatibility changes.

### `LICENSE.txt`

The project is licensed under GPL version 2 or later.

### `FILE-MANIFEST.txt`

Lists every tracked source/runtime file expected in the source package, excluding local dependency and release-output directories such as `node_modules/`, `vendor/`, and `dist/`. Regenerate it whenever files are added, removed, or renamed.

### `phpunit.xml.dist`

Defines the WordPress PHPUnit test suite and points PHPUnit to `tests/bootstrap.php`. Local machine-specific paths belong in environment variables, not in this committed configuration.

---

## PHP bootstrap and modules

`functions.php` loads these modules in order:

```php
'/inc/setup.php',
'/inc/navigation.php',
'/inc/enqueue.php',
'/inc/editor.php',
'/inc/template-tags.php',
'/inc/template-functions.php',
'/inc/customizer.php',
'/inc/block-styles.php',
'/inc/integrations/nolan-young-core.php',
```

### `inc/setup.php`

Owns theme initialization:

- Loads the theme text domain.
- Registers supported WordPress features.
- Enables editor styles.
- Registers HTML5 markup support.
- Registers custom-logo support.
- Registers Primary and Footer menu locations.
- Registers the card image size.
- Sets compatibility content width.
- Registers the footer widget area.
- Creates and assigns the default primary menu only when no primary menu is assigned.

The default menu is stored by WordPress and remains editable by administrators.

### `inc/navigation.php`

Owns presentation data and server-rendered markup for the Services, About, and Blog mega menus.

It does not process requests or store business data.

### `inc/enqueue.php`

Owns frontend asset registration and enqueueing.

It reads webpack-generated `*.asset.php` files and passes their dependencies and content-derived versions to WordPress.

### `inc/editor.php`

Adds the theme-specific editor body class used by editor presentation styles.

### `inc/template-tags.php`

Contains reusable display functions such as:

- Post date output.
- Post author output.
- Entry-footer metadata.
- Archive pagination.

### `inc/template-functions.php`

Contains presentation hooks and filters such as:

- Body classes.
- Pingback header output.
- Navigation link attributes.
- Safe primary-menu fallback output.

### `inc/customizer.php`

Registers presentation-only front-page text settings.

### `inc/block-styles.php`

Registers theme block styles and pattern categories.

### `inc/integrations/nolan-young-core.php`

Adds theme presentation classes to companion-plugin output. It does not process forms.

---

## Template hierarchy

WordPress selects root templates according to the standard classic-theme hierarchy.

| Template | Responsibility |
|---|---|
| `front-page.php` | Site front page whenever this file is applicable |
| `home.php` | Posts index, including the page selected as the Posts page |
| `single.php` | Individual standard posts |
| `page.php` | Standard pages |
| `singular.php` | Shared singular fallback |
| `archive.php` | Date, author, category, tag, and general archives |
| `search.php` | Search-results requests |
| `404.php` | Not-found requests |
| `privacy-policy.php` | The page assigned as the WordPress Privacy Policy page |
| `index.php` | Final fallback when no more-specific template exists |
| `single-ny_service.php` | Individual Service content from the companion plugin |
| `archive-ny_service.php` | Service archive from the companion plugin |
| `taxonomy-ny_service_category.php` | Service-category taxonomy archive |

### Controller responsibility

Root templates may:

- Call `get_header()` and `get_footer()`.
- Enter the WordPress Loop.
- Load template parts.
- Call pagination or comments functions.
- Prepare small amounts of presentation data.

Root templates must not:

- Process form submissions.
- Send email.
- Register post types.
- Change authorization.
- Store business data.
- Include credentials.

### Important front-page/blog distinction

```text
front-page.php = site front page
home.php       = posts index
```

A selectable Blog page template does not replace `home.php` for the WordPress Posts page.

---

## Page templates

Selectable templates are stored in `/page-templates`.

Current templates include:

- About Us.
- Services.
- Service Detail.
- Work.
- Blog Landing.
- Contact.
- Policy.

Some compatibility templates remain for previous assignments. Do not delete or rename an assigned page template without migrating the affected pages first; WordPress stores the template filename in post metadata.

Every selectable page template must include a valid `Template Name` header and must remain presentation-only.

---

## Template parts

Template parts are reusable presentation fragments grouped by responsibility.

### `template-parts/content/`

Contains reusable post, page, search, empty-state, and policy output.

### `template-parts/global/`

Contains site-wide marketing sections such as:

- Hero.
- Brand statement.
- CTA banner.

### `template-parts/front-page/`

Contains the ordered front-page sections.

### `template-parts/header/`

Contains:

- Site branding.
- Primary navigation.
- Mobile-navigation extension point.
- Services/About featured mega menu.
- Latest-post Blog mega menu.

### `template-parts/errors/`

Contains visual error content. The companion plugin remains responsible for setting a genuine 403 response status and deciding whether access is forbidden.

### Template-part rules

Template parts may:

- Render escaped HTML.
- Use WordPress template tags.
- Receive data through the `$args` argument of `get_template_part()`.
- Load other narrowly focused template parts.

Template parts must not:

- Register hooks.
- Inspect raw request data.
- Process submissions.
- Write to the database.
- Send email.
- Perform authentication or authorization.

---

## Companion plugin integration

The theme is designed to work with `nolan-young-core` while remaining activatable without it.

### Features supplied by the plugin

- Service content model.
- Service taxonomy.
- Contact form shortcode.
- Newsletter form shortcode.
- Form submission processing.
- Inquiry/subscriber records.
- Access-control rules.
- Privacy export/erasure support.

### Shortcodes

```text
[nolan_young_contact_form]
[nolan_young_newsletter_form]
```

### Theme integration

The theme uses the plugin filter:

```php
ny_core_form_classes
```

The theme adds its presentation class without taking ownership of processing.

### Safe degradation

When the plugin is inactive:

- The theme still activates.
- Standard pages, posts, archives, navigation, patterns, and editor styles remain available.
- Service templates have no matching registered post type.
- Plugin shortcodes no longer render plugin forms.

---

## Primary navigation and mega menus

### WordPress-managed menu location

The primary navigation is registered as:

```text
primary
```

Its admin label is:

```text
Primary Navigation
```

The menu remains a normal WordPress menu. Administrators can add, remove, rename, or reorder items.

### Default order

When the theme activates and no primary menu is assigned, the theme creates/assigns a default menu with:

1. Services
2. About
3. Work
4. Blog

The header layout is:

```text
[ Site logo ] [ Centered WordPress primary menu ] [ Contact CTA ]
```

### Mega-menu association

Services, About, and Blog can be recognized from their title, slug, or URL. For a stable explicit association, assign these menu-item CSS classes in WordPress:

```text
nytt01-mega-services
nytt01-mega-about
nytt01-mega-blog
```

Using the explicit class is recommended if the visible item label will be renamed.

To expose the **CSS Classes** field in the classic Menus screen:

1. Open **Appearance → Menus**.
2. Open **Screen Options**.
3. Enable **CSS Classes**.
4. Expand the applicable menu item.
5. Add the appropriate class.

### Mega-menu behavior

- Opens by clicking the top-level trigger.
- Only one mega menu remains open at a time.
- Clicking outside closes the open menu.
- Moving focus outside closes the open menu.
- Selecting a link closes the menu.
- `Escape` closes the menu and restores trigger focus.
- `ArrowDown` opens a trigger and moves focus into its panel.
- Reduced-motion preferences disable delayed animation behavior.
- The active/open trigger retains the active color state.
- Mobile navigation stacks the dropdown content vertically.

### Services and About structure

Desktop featured mega menus use:

```text
[ Options list: 35% ] [ Dynamic feature panel: 65% ]
```

The feature panel is on the right and contains:

- Dynamic image.
- Dynamic title.
- Dynamic description.
- Related sub-links for the active item.
- Main exploration link.

The option list is on the left. Hover, focus, and selection update the feature panel.

### Services data

Default Services items are defined by:

```php
nytt01_get_services_mega_menu_items()
```

They can be changed with:

```php
nytt01_services_mega_menu_items
```

### About data

Default About items are defined by:

```php
nytt01_get_about_mega_menu_items()
```

They can be changed with:

```php
nytt01_about_mega_menu_items
```

### Filter example

Add customization in a companion/site plugin rather than editing generated output:

```php
add_filter(
    'nytt01_services_mega_menu_items',
    function ( $items ) {
        $items[0]['title']       = 'Web Development';
        $items[0]['description'] = 'Production WordPress development and integration work.';
        $items[0]['url']         = home_url( '/services/web-development/' );

        return $items;
    }
);
```

Validate the final array shape. Each item expects:

```php
array(
    'title'       => 'Visible title',
    'description' => 'Short description',
    'image'       => 'https://example.com/image.jpg',
    'url'         => 'https://example.com/destination/',
    'subitems'    => array(
        array(
            'label' => 'Related link',
            'url'   => 'https://example.com/destination/#section',
        ),
    ),
)
```

### Blog dropdown

The Blog mega menu automatically queries up to four recent published posts.

Each card may display:

- Featured image.
- Title.
- Excerpt.
- Publish date.
- Read-more link.

The grid adapts to one, two, three, or four posts and does not reserve empty columns. A bundled placeholder is used when a post has no featured image.

### Do not hardcode the navigation HTML

Do not replace the WordPress menu with a static list in `header.php`. The menu must remain managed through WordPress and rendered through `wp_nav_menu()`.

---

## Front-page composition

`front-page.php` assembles sections in this exact order:

1. Hero.
2. Brand statement.
3. Featured work.
4. All services.
5. Service highlight.
6. Process.
7. Style pillars.
8. Testimonials.
9. Blog preview.
10. CTA banner.

Each section is a template part. This keeps the controller small and makes section-level changes surgical.

When changing a section:

1. Edit its template part.
2. Edit the corresponding SCSS source partial.
3. Rebuild assets.
4. Test the section independently.
5. Test the full front page for regressions.

Do not move application logic into a front-page template part.

---

## `theme.json` design system

The theme uses:

```json
{
  "$schema": "https://schemas.wp.org/wp/7.0/theme.json",
  "version": 3
}
```

### `theme.json` owns

- Content width.
- Wide width.
- Editor color palette.
- Typography presets.
- Spacing presets.
- Border controls.
- Shadow presets.
- Default global text/background values.
- Default heading, link, button, image, and quote styles.
- Which editor design controls are available.

### SCSS owns

- Component layouts.
- Header and mega-menu layout.
- Responsive behavior.
- State classes.
- Interaction animation.
- Complex selectors.
- Third-party/plugin presentation.
- Browser-specific adjustments.

### Avoid duplicate design authorities

Do not define conflicting global values in:

- `theme.json`.
- `_variables.scss`.
- Customizer settings.
- Inline CSS.
- JavaScript.

Where a value must be available to custom theme components, the SCSS token should remain synchronized with the corresponding `theme.json` preset.

---

## SCSS architecture

SCSS source lives under:

```text
src/scss/
```

### Entry points

```text
src/scss/main.scss
src/scss/editor.scss
```

`main.scss` compiles to:

```text
assets/css/bundle.css
```

`editor.scss` compiles to:

```text
assets/css/editor.css
```

### Partial groups

#### `abstracts/`

Contains project design-token and reusable-source foundations.

#### `base/`

Contains low-specificity global element rules:

- Reset.
- Typography.
- Accessibility utilities.
- Form elements.
- Newsletter base presentation.

#### `layout/`

Contains large structural rules:

- Container.
- Grid.
- Header.
- Footer.
- Sections.

#### `components/`

Contains reusable UI components:

- Buttons.
- Cards.
- Forms.
- Mega menus.
- Badges.
- Accordions.
- Carousels.
- Portfolio filters.
- Before/after components.

#### `pages/`

Contains page-specific composition rules:

- Homepage.
- Contact.
- About.
- Services.
- Service detail.
- Work.
- Blog.
- Search.
- Error pages.
- Policy pages.

### SCSS editing rule

Never edit these generated files directly:

```text
assets/css/bundle.css
assets/css/editor.css
```

Any direct change will be overwritten by the next build.

---

## JavaScript architecture

JavaScript source lives under:

```text
src/js/
```

### Entry point

```text
src/js/main.js
```

Webpack compiles it to:

```text
assets/js/bundle.js
```

### Modules

#### `utilities/dom.js`

Provides DOM-ready utilities.

#### `components/navigation.js`

Controls the responsive primary navigation toggle.

#### `components/mega-menu.js`

Controls:

- Opening and closing mega menus.
- Single-open-menu enforcement.
- Outside-click dismissal.
- Focus-out dismissal.
- Escape-key handling.
- Trigger state through `aria-expanded`.
- Dynamic Services/About feature-panel updates.
- Related-link updates.
- Arrow-key movement between feature options.
- Reduced-motion behavior.
- Image preloading.

#### `components/accordion.js`

Controls accessible accordion expansion states.

### Progressive enhancement

Server-rendered PHP provides meaningful markup and links. JavaScript adds interaction rather than being used to generate the entire site shell.

### JavaScript editing rule

Never edit:

```text
assets/js/bundle.js
```

Edit the module under `src/js/`, then run a build.

---

## Webpack and build system

The project uses the WordPress-maintained `@wordpress/scripts` package, which is built on webpack. A project-level `webpack.config.js` extends the WordPress default configuration.

### Important directory distinction

There are three different concepts:

```text
/build                 Node helper scripts for this repository
webpack.config.js      Root webpack configuration
/assets                Compiled runtime output used by WordPress
```

The `/build` directory is **not** the compiled frontend output directory.

Compiled browser files go to `/assets` because the PHP theme enqueues them from that location.

### Webpack entry points

The root `webpack.config.js` defines:

```text
src/js/main.js       → assets/js/bundle.js
src/scss/main.scss   → assets/css/bundle.css
src/scss/editor.scss → assets/css/editor.css
```

### WordPress default webpack configuration

The config imports:

```js
@wordpress/scripts/config/webpack.config
```

This retains WordPress-maintained defaults for production/development modes, JavaScript transpilation, Sass handling, optimization, and asset dependency extraction.

### Empty-script removal

CSS entries can otherwise generate empty JavaScript files. The config uses:

```text
webpack-remove-empty-scripts
```

This removes those empty CSS-entry JavaScript artifacts after WordPress asset metadata is generated.

### Why `output.clean` is disabled

Webpack outputs into `/assets`, which also contains manually maintained images and icons. Global output cleaning could delete those runtime files.

Instead, `npm run clean` removes only known generated CSS, JavaScript, and metadata files.

### Build helper scripts

#### `build/clean.js`

Deletes only generated files:

```text
assets/css/bundle.css
assets/css/bundle-rtl.css
assets/css/bundle.asset.php
assets/css/editor.css
assets/css/editor-rtl.css
assets/css/editor.asset.php
assets/js/bundle.js
assets/js/bundle.asset.php
```

It does not delete images or icons.

#### `build/dev.js`

Starts a cross-platform production-mode webpack watcher for `npm run dev`. It sets `NODE_ENV` to production before loading the WordPress webpack defaults, emits minified watched assets, reports compilation warnings/errors, and closes cleanly on `Ctrl + C`.

#### `build/validate.js`

Checks:

- Required files, including `build/dev.js`.
- Non-empty compiled assets.
- `theme.json` version and WordPress 7.0 schema.
- Version consistency between `package.json` and `style.css`.
- Required npm command definitions and the direct webpack dependency used by `npm run dev`.
- WordPress/PHP metadata.
- 1200×900 PNG screenshot.
- Webpack asset metadata.
- Absence of theme-owned post type/taxonomy registration.
- Absence of unsupported root-level `403.php`.

#### `build/package-theme.js`

Creates a production ZIP in:

```text
dist/nolan-young-theme-template-01.zip
```

It uses an explicit runtime allowlist so source/development files are excluded.

---

## NPM commands

Run every npm command from the theme root—the directory containing `package.json`, `package-lock.json`, `webpack.config.js`, `/src`, `/assets`, and `/build`.

The command contract is intentional:

| Command | Primary purpose | Watches files | Minifies output | Runs lint | Runs structural validation | Use for final release |
|---|---|---:|---:|---:|---:|---:|
| `npm run start` | Fast WordPress development watcher | Yes | No | No | No | No |
| `npm run dev:fast` | Alias for `npm run start` | Yes | No | No | No | No |
| `npm run dev` | Minified local-development watcher | Yes | Yes | Once before watching | No | No |
| `npm run check` | Review maintained source and current generated structure | No | No build | Yes | Yes | Supporting check |
| `npm run build` | Final clean production build and automated npm gate | No | Yes | Yes | Yes | **Yes—run last** |
| `npm test` | Standard npm alias for the final build gate | No | Yes | Yes | Yes | Yes |
| `npm run package` | Rebuild, validate, and create the installable ZIP | No | Yes | Yes | Yes | Final packaging |

### Command-selection rule

Use the commands in this order during normal work:

1. Run `npm ci` after cloning, pulling dependency changes, or changing computers.
2. Use `npm run start` when you need the fastest readable development builds and source-friendly debugging.
3. Use `npm run dev` when you specifically want every watched rebuild to resemble production output and remain minified.
4. Stop either watcher with `Ctrl + C`.
5. Run `npm run build` after development is complete. This must be the final asset command before review or packaging.
6. Inspect the site and generated diff after the build succeeds.
7. Run `npm run package` only after the final build and staging review are acceptable.

A watcher is never proof that a release is ready. A watcher remains open, performs incremental rebuilds, and does not represent a clean final build from a known state. `npm run build` deliberately exits after recreating and checking the production assets.

### `npm ci`

Installs the exact dependency versions recorded in `package-lock.json`:

```bash
npm ci
```

Use it after:

- Cloning the repository.
- Pulling dependency changes.
- Switching development computers.
- Preparing a CI or release environment.
- Deleting `node_modules` to verify a clean dependency installation.

Do not commit `node_modules`. Do not replace `npm ci` with `npm install` during routine setup. Use `npm install` only when intentionally modifying dependencies, and commit the resulting `package.json` and `package-lock.json` changes together.

### `npm run start`

Starts the standard WordPress development watcher:

```bash
npm run start
```

This invokes:

```text
wp-scripts start
```

It:

- Compiles the JavaScript and SCSS entry points.
- Watches `/src` for changes.
- Rebuilds automatically after a saved source change.
- Produces development-oriented, non-minified output that is easier to inspect.
- Reports webpack compilation errors in the terminal.
- Continues running until stopped with `Ctrl + C`.

This is the preferred command for debugging because WordPress documents `start` as the incremental development build. It is not the final production command.

### `npm run dev:fast`

Provides an explicit alias for the standard fast watcher:

```bash
npm run dev:fast
```

It calls `npm run start`. Use it when a developer wants the purpose to be obvious from the command name while retaining the official `wp-scripts start` behavior.

### `npm run dev`

Starts the project's minified production-mode watcher:

```bash
npm run dev
```

It performs these steps in order:

1. Runs `npm run clean` to remove only known generated assets.
2. Runs the complete lint gate once.
3. Starts the repository production watcher from `build/dev.js`, which loads the root webpack configuration in production mode.
4. Rebuilds automatically whenever maintained JavaScript or SCSS source changes.
5. Emits minified production-style CSS and JavaScript during the watch session.
6. Regenerates the adjacent WordPress `*.asset.php` dependency/version metadata.

Equivalent command chain:

```text
npm run clean
npm run lint
node build/dev.js
```

Use `npm run dev` when local testing specifically requires minified output—for example, when checking production-like asset size, compressed selector behavior, or cache-version changes while iterating.

Important limitations:

- Lint runs once before watch mode starts; it does not rerun after every edit.
- Structural validation is not run after every incremental rebuild.
- Browser, accessibility, PHP, and WordPress runtime tests are not automatic.
- Production-mode watch builds may be slower and harder to debug than `npm run start`.
- Stop the watcher before running `npm run build`.

### `npm run clean`

Removes only the generated files explicitly listed in `build/clean.js`:

```bash
npm run clean
```

It removes generated frontend CSS, RTL CSS, editor CSS, JavaScript, and `*.asset.php` metadata. It does not remove source code, images, icons, PHP templates, documentation, or configuration files.

Use it when:

- A generated file appears stale.
- An entry point changed.
- A build mismatch is under investigation.
- Verifying that the production build can recreate every required artifact.

### `npm run build:assets`

Runs only the WordPress production compiler:

```bash
npm run build:assets
```

It invokes:

```text
wp-scripts build
```

This compiles and optimizes assets but intentionally skips the project's clean, lint, and structural-validation gates. It exists for focused troubleshooting and CI composition. Do not use it as the final release command.

### `npm run build`

Creates and checks the final production-ready asset set:

```bash
npm run build
```

This is the authoritative final npm command for the theme. Run it **after all local development is complete and after every watcher has been stopped**.

It performs these stages in strict order:

1. **Clean** — removes every known generated asset so stale files cannot survive.
2. **Lint** — checks maintained browser JavaScript, Node helper scripts, and SCSS against the configured standards.
3. **Production compile** — runs `wp-scripts build`, enabling optimized/minified production output.
4. **Structural validation** — verifies required files, WordPress 7.0 metadata, theme/package version alignment, asset metadata, screenshot dimensions, architecture boundaries, and the npm command contract.
5. **Exit** — returns a failing status if any stage fails; otherwise exits successfully for review or packaging.

Equivalent command chain:

```text
npm run clean
npm run lint
npm run build:assets
npm run validate
```

Expected generated output includes:

```text
assets/css/bundle.css
assets/css/bundle-rtl.css
assets/css/bundle.asset.php
assets/css/editor.css
assets/css/editor-rtl.css
assets/css/editor.asset.php
assets/js/bundle.js
assets/js/bundle.asset.php
```

After the command succeeds:

1. Review the terminal output for warnings.
2. Review `git diff` or `git status --short` for unexpected generated changes.
3. Test the local WordPress site with `WP_DEBUG` enabled.
4. Check the header, mega menus, pages, archives, responsive layout, keyboard controls, and editor styles.
5. Do not edit the generated files manually. Correct source files and rerun the build instead.

### `npm run check`

Runs linting and structural validation without rebuilding assets:

```bash
npm run check
```

Use it for a quick review when generated assets already exist and no SCSS/JavaScript source changed. Because it does not compile from scratch, it cannot replace `npm run build` for a release.

### `npm run lint:js`

Runs the WordPress JavaScript lint configuration against maintained browser modules and `webpack.config.js`:

```bash
npm run lint:js
```

### `npm run lint:css`

Runs the WordPress style lint configuration against all SCSS source files:

```bash
npm run lint:css
```

### `npm run lint:node`

Uses Node's syntax checker on the repository helper scripts:

```bash
npm run lint:node
```

It verifies that these files parse before a release task uses them:

```text
build/clean.js
build/dev.js
build/package-theme.js
build/validate.js
```

### `npm run lint`

Runs the complete maintained-source lint gate:

```bash
npm run lint
```

It performs:

1. WordPress JavaScript linting.
2. Node helper-script syntax checks.
3. WordPress SCSS/style linting.

### `npm run format`

Runs the WordPress formatter over maintained browser JavaScript, SCSS, and the root webpack configuration:

```bash
npm run format
```

Formatting can modify many files. Run it only in a clean or understood working tree, then inspect the complete diff. Formatting is not a substitute for review or linting.

### `npm run validate`

Runs the project-specific structural validator:

```bash
npm run validate
```

The validator checks, among other things:

- Required runtime, source, build, test, and documentation files.
- Non-empty compiled CSS and JavaScript.
- Valid `package.json` and `theme.json` data.
- `theme.json` version 3 and the WordPress 7.0 schema.
- Theme version alignment between `style.css` and `package.json`.
- Required npm command definitions.
- The direct webpack dependency required by `npm run dev`.
- The exact 1200×900 PNG screenshot.
- The absence of custom post type/taxonomy registration in the theme.
- The absence of an unsupported root-level `403.php`.
- The presence and shape of generated WordPress asset metadata.

It is not a replacement for PHP_CodeSniffer, PHPUnit, Theme Check, browser testing, accessibility review, or a clean staging installation.

### `npm test`

Runs the standard npm test alias:

```bash
npm test
```

For this repository, it delegates to `npm run build`. This makes the default npm test command enforce the same clean, linted, optimized, validated production gate instead of maintaining a second competing sequence.

### `npm run package`

Rebuilds through the final production gate and creates an installable theme ZIP:

```bash
npm run package
```

It performs:

1. `npm run build`.
2. `node build/package-theme.js`.
3. Runtime-file allowlist packaging.
4. One-root-folder ZIP creation.

Output:

```text
dist/nolan-young-theme-template-01.zip
```

The ZIP must contain exactly one top-level directory:

```text
nolan-young-theme-template-01/
```

`npm run package` deliberately rebuilds before packaging. Even so, the produced ZIP must still be installed and tested on a clean WordPress 7.0 staging site before production approval.

---

## Generated asset metadata

The WordPress webpack dependency-extraction tooling generates `*.asset.php` files adjacent to built assets.

Example shape:

```php
<?php
return array(
    'dependencies' => array(),
    'version'      => 'content-hash',
);
```

These files allow PHP to enqueue the exact dependencies and a build-derived cache version.

Current metadata files:

```text
assets/css/bundle.asset.php
assets/css/editor.asset.php
assets/js/bundle.asset.php
```

Do not manually edit them. They are regenerated by webpack.

---

## WordPress asset enqueueing

Frontend assets are loaded in `inc/enqueue.php` through:

```php
wp_enqueue_style()
wp_enqueue_script()
```

The implementation:

1. Loads the applicable `*.asset.php` metadata.
2. Validates the dependency array.
3. Uses the generated version.
4. Falls back to `filemtime()` or the theme version only when metadata is unavailable.
5. Loads JavaScript in the footer with the `defer` strategy.
6. Loads WordPress `comment-reply` only when threaded comments require it.

Do not hardcode asset URLs in templates.

Use:

```php
get_theme_file_uri()
get_theme_file_path()
```

rather than concatenating theme paths manually.

---

## Editor styles

The theme enables editor styles in `inc/setup.php`:

```php
add_theme_support( 'editor-styles' );
add_editor_style( 'assets/css/editor.css' );
```

The editor stylesheet is intentionally separate from the full frontend bundle. This prevents frontend-only behavior such as sticky headers, navigation overlays, and fixed widgets from interfering with editor controls.

When adding typography or reusable content components, evaluate whether corresponding editor styles are required.

---

## Block patterns and block styles

### Patterns

Pattern files live in:

```text
patterns/
```

Current patterns include:

- Hero.
- Featured work.
- Services grid.
- Testimonials.
- Call to action.

WordPress automatically discovers correctly headed pattern files in this directory.

Pattern rules:

- Keep output translatable.
- Escape dynamic PHP values.
- Use valid block markup.
- Reference theme assets with WordPress functions.
- Do not process requests.

### Block styles

The theme registers custom styles for:

```text
core/group  → nytt01-card
core/button → nytt01-outline
```

The registration lives in `inc/block-styles.php`; presentation lives in source SCSS.

---

## Customizer settings

The theme registers a **Front Page Presentation** section for:

- Hero eyebrow.
- Hero heading.
- Hero description.

These are presentation-oriented theme modifications. They are sanitized with `sanitize_text_field()`.

Do not use the Customizer module to store:

- API keys.
- Submission records.
- Product data.
- Service records.
- Authentication settings.
- Business-critical configuration that must survive a theme switch.

---

## Internationalization

The text domain is:

```text
nolan-young-theme-template-01
```

It must match the theme slug and remain consistent in every translation call.

Translation files live under:

```text
languages/
```

The POT template is:

```text
languages/nolan-young-theme-template-01.pot
```

### Translation functions

Use the correct function for the output context:

```php
__( 'Text', 'nolan-young-theme-template-01' );
_e( 'Text', 'nolan-young-theme-template-01' );
esc_html__( 'Text', 'nolan-young-theme-template-01' );
esc_html_e( 'Text', 'nolan-young-theme-template-01' );
esc_attr__( 'Text', 'nolan-young-theme-template-01' );
esc_attr_e( 'Text', 'nolan-young-theme-template-01' );
```

Add translator comments immediately before formatted translation strings.

### POT regeneration

With WP-CLI and the i18n command available:

```bash
wp i18n make-pot . languages/nolan-young-theme-template-01.pot \
  --domain=nolan-young-theme-template-01 \
  --exclude=node_modules,vendor,dist,tests
```

Review the generated file before committing it.

---

## Security requirements

### Escape late

Escape dynamic values at output:

```php
echo esc_html( $text );
echo esc_attr( $attribute );
echo esc_url( $url );
echo wp_kses_post( $trusted_formatted_content );
```

### Sanitize input

Use context-appropriate sanitization for theme settings:

```php
sanitize_text_field()
sanitize_email()
sanitize_key()
absint()
esc_url_raw()
```

### No request processing in the theme

The theme must not directly process:

```text
$_POST
$_GET
$_REQUEST
uploaded files
newsletter subscriptions
contact submissions
```

Those responsibilities belong in the companion plugin.

### No secrets

Never commit:

- Passwords.
- API keys.
- Access tokens.
- SMTP credentials.
- Private signing keys.
- Database credentials.
- `.env` files.

### WordPress APIs first

Use WordPress APIs instead of direct database access whenever possible. Any unavoidable SQL must use prepared statements in the plugin layer, not presentation templates.

---

## Accessibility requirements

WCAG 2.2 Level AA is the internal release target.

### Required behaviors

- Keyboard-accessible navigation.
- Visible focus indication.
- Skip-to-content link.
- Logical heading hierarchy.
- Semantic landmarks.
- Properly labeled form fields.
- Understandable validation errors.
- Accessible menu trigger state through `aria-expanded` and `aria-controls`.
- Escape-key dismissal for open overlays/dropdowns.
- Focus restoration after dismissal.
- No hover-only functionality.
- Reduced-motion support.
- Sufficient text and control contrast.
- No keyboard traps.

### Mega-menu keyboard behavior

- `Enter` or `Space`: activate the focused button through native button behavior.
- `ArrowDown` on a top-level trigger: open and move focus into the panel.
- Arrow keys in featured options: move between options.
- `Home`: move to the first option.
- `End`: move to the last option.
- `Escape`: close and return focus to the trigger.

### Accessibility testing is manual and automated

Automated checks are useful but cannot prove full accessibility. Every release needs manual keyboard and screen-reader review.

---

## PHP coding standards

Development configuration lives in:

```text
composer.json
phpcs.xml.dist
phpunit.xml.dist
```

The ruleset includes:

- WordPress.
- WordPress Extra.
- WordPress Docs.
- PHPCompatibilityWP.
- PHP 7.4+ compatibility.
- WordPress 7.0 minimum compatibility.
- The project text domain.

### Install Composer dependencies

```bash
composer install
```

### Check PHP

```bash
composer lint:php
```

### Automatically fix safe formatting issues

```bash
composer fix:php
```

Review every automatic fix. Do not assume an automated fixer understands architectural intent.

### Run the WordPress PHPUnit suite

The source repository contains WordPress-aware PHPUnit tests under `/tests` and a root `phpunit.xml.dist` configuration.

The test bootstrap expects the official WordPress test library. Point `WP_TESTS_DIR` to that library before running.

macOS/Linux:

```bash
export WP_TESTS_DIR=/path/to/wordpress-tests-lib
composer test:php
```

PowerShell:

```powershell
$env:WP_TESTS_DIR = 'C:\path\to\wordpress-tests-lib'
composer test:php
```

Current tests verify:

- Production-critical files exist.
- Frontend CSS and JavaScript handles enqueue successfully.
- Required theme supports are registered.
- Primary and Footer navigation locations are registered.

These tests do not replace browser, keyboard, screen-reader, Theme Check, or Theme Unit Test content testing.

### Basic syntax check without Composer

macOS/Linux:

```bash
find . -name "*.php" \
  -not -path "./vendor/*" \
  -not -path "./node_modules/*" \
  -print0 | xargs -0 -n1 php -l
```

PowerShell:

```powershell
Get-ChildItem -Recurse -Filter *.php |
    Where-Object { $_.FullName -notmatch '\\(vendor|node_modules)\\' } |
    ForEach-Object { php -l $_.FullName }
```

---

## Testing and validation

No single command proves that a WordPress theme is production-ready.

### Test directory

The `/tests` directory contains source-level WordPress PHPUnit coverage:

| File | Responsibility |
|---|---|
| `tests/bootstrap.php` | Locates the WordPress test library, registers the theme directory, switches to this theme, and boots WordPress tests |
| `tests/test-required-files.php` | Verifies production-critical templates, compiled assets, RTL assets, metadata files, and navigation artwork exist |
| `tests/test-theme-setup.php` | Verifies required theme supports and registered menu locations |
| `tests/test-assets.php` | Verifies the frontend style and script handles enqueue through WordPress |

`phpunit.xml.dist` points PHPUnit at this bootstrap and test suite. The environment variable `WP_TESTS_DIR` must reference an installed WordPress test library.

### Required automated checks

```bash
npm ci
npm run build
composer install
composer lint:php
composer test:php
```

`npm run build` is the final npm gate. It cleans, lints, creates optimized assets, validates the theme structure, and exits. `npm test` is an equivalent alias.

### Required WordPress checks

- Activate on WordPress 7.0.
- Enable `WP_DEBUG` in local/staging.
- Run Theme Check.
- Import WordPress Theme Unit Test data.
- Test minimum supported PHP.
- Test the production PHP version.
- Test with the companion plugin active and inactive.
- Test install/upgrade from the production ZIP.

### Required functional scenarios

- Front page.
- Posts index.
- Standard page.
- Standard post.
- Category/tag/date/author archive.
- Search with results.
- Search without results.
- 404 page.
- Privacy Policy page.
- Service single/archive/taxonomy when plugin is active.
- Comments disabled.
- Comments enabled.
- Threaded comments.
- Pagination.
- Long titles.
- Missing featured images.
- One to four Blog mega-menu posts.
- Empty Blog mega menu.
- Primary navigation with renamed labels.
- Primary navigation with explicit mega-menu CSS classes.
- Mobile menu.
- Keyboard-only navigation.
- Reduced-motion mode.

### Build reproducibility test

```bash
npm run build
git status --short
npm run build
git status --short
```

Because `npm run build` begins with a clean step and ends with validation, each invocation must recreate the same production artifacts. A second final build must not create unexplained differences.

---

## Local debugging

Enable development debugging in the local or staging `wp-config.php`:

```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', true );
define( 'SCRIPT_DEBUG', true );
```

Do not enable visible debugging on production.

Review:

```text
wp-content/debug.log
```

Before release, submit forms, exercise navigation, open archives, and review the log for:

- Notices.
- Warnings.
- Deprecated calls.
- Fatal errors.
- Translation warnings.
- Undefined indexes or variables.

The form-processing incident fixed in `nolan-young-core` 1.0.1 is an example of why submission-path testing under `WP_DEBUG` is mandatory.

---

## Release and packaging workflow

### 1. Start from a clean branch

```bash
git status
```

Do not package unreviewed unrelated changes.

### 2. Install locked dependencies

```bash
npm ci
```

### 3. Update versions

Keep these synchronized:

- `style.css` `Version`.
- `package.json` `version`.
- `CHANGELOG.md` release heading.

### 4. Update documentation

Update this README when changing:

- File structure.
- NPM commands.
- Build behavior.
- Templates.
- Filters.
- Menu behavior.
- Requirements.
- Packaging rules.

### 5. Stop all watchers and run the final production build

Stop `npm run start`, `npm run dev:fast`, or `npm run dev` with `Ctrl + C`, then run:

```bash
npm run build
```

This is the last asset-generation command before manual review. It performs a clean, source linting, optimized compilation, and structural validation.

### 6. Run PHP standards

```bash
composer lint:php
```

### 7. Run WordPress staging checks

- Theme Check.
- Theme Unit Test data.
- `WP_DEBUG` review.
- Keyboard review.
- Responsive review.
- Plugin integration review.

### 8. Create the ZIP

After the final build and staging review are acceptable:

```bash
npm run package
```

The package command reruns the same final build gate before creating the archive so a stale asset cannot be packaged.

### 9. Inspect the ZIP

The archive must contain exactly:

```text
nolan-young-theme-template-01/
```

as its one top-level directory.

### 10. Install the ZIP on a clean staging site

Never approve a package solely because the source checkout works.

### 11. Record checksums

Generate a SHA-256 checksum for distributed artifacts.

PowerShell:

```powershell
Get-FileHash .\dist\nolan-young-theme-template-01.zip -Algorithm SHA256
```

macOS/Linux:

```bash
sha256sum dist/nolan-young-theme-template-01.zip
```

---

## Production ZIP contents

The packaging script includes runtime files only.

### Included

- Root PHP templates.
- `style.css`.
- `functions.php`.
- `theme.json`.
- `screenshot.png`.
- `README.md`.
- `CHANGELOG.md`.
- `LICENSE.txt`.
- `/inc`.
- `/template-parts`.
- `/page-templates`.
- `/patterns`.
- `/languages`.
- Compiled `/assets`.

### Excluded

- `node_modules/`.
- `vendor/`.
- `.git/`.
- `src/`.
- `build/`.
- `tests/`.
- `docs/`.
- `webpack.config.js`.
- `package.json`.
- `package-lock.json`.
- `composer.json`.
- `phpcs.xml.dist`.
- `dist/`.
- IDE configuration.
- Debug logs.
- Environment files.

### Why source files are excluded

The installed site needs compiled browser assets, not the development toolchain. Excluding development files produces a smaller, clearer deployment artifact and avoids shipping unnecessary dependencies or configuration.

---

## Common development workflows

### Change a PHP template only

```bash
# Edit the PHP template.
php -l path/to/file.php
composer lint:php
npm run validate
```

A CSS/JS rebuild is not required unless source assets also changed.

### Change SCSS

For fast, readable development output:

```bash
npm run start
# Edit src/scss/... files.
# Stop watch mode with Ctrl+C.
npm run build
```

For minified production-style output during local iteration, use `npm run dev` instead of `npm run start`. Always stop the watcher and run `npm run build` last.

### Change JavaScript

```bash
npm run start
# Or use: npm run dev
# Edit src/js/... files.
# Test keyboard and pointer behavior.
# Stop watch mode with Ctrl+C.
npm run build
```

Use `npm run start` for easier debugging and `npm run dev` when you specifically need minified watched output. The final production build remains mandatory in both cases.

### Change the mega-menu data

For reusable/site-specific content, use the documented PHP filters in a companion/site plugin. If changing theme defaults:

1. Edit `inc/navigation.php`.
2. Keep all labels translatable.
3. Sanitize/escape URLs and output.
4. Test one to four Blog posts.
5. Test keyboard behavior.
6. Run PHP and npm checks.

### Add a SCSS component

1. Create `src/scss/components/_component-name.scss`.
2. Import it from `src/scss/main.scss` in the correct layer/order.
3. Add editor styles only if content authors need them in the editor.
4. Stop any watcher and run `npm run build`.

### Add a JavaScript component

1. Create a focused module under `src/js/components/`.
2. Export one initialization function.
3. Import it from `src/js/main.js`.
4. Initialize it inside the DOM-ready callback.
5. Ensure the page remains usable if JavaScript fails.
6. Stop any watcher and run `npm run build`.

### Add a page template

1. Create the file under `/page-templates`.
2. Add a valid `Template Name` header.
3. Use standard `get_header()`, Loop, template-part, and `get_footer()` patterns.
4. Do not process requests.
5. Add corresponding source SCSS only when necessary.
6. Document it here.

### Add a custom post type template

The plugin must register the post type. The theme may add recognized templates such as:

```text
single-{post-type}.php
archive-{post-type}.php
taxonomy-{taxonomy}.php
```

Do not register the content type in the theme.

---

## Troubleshooting

### `npm` is not recognized

Install a supported Node.js release, close/reopen the terminal, then verify:

```bash
node --version
npm --version
```

### `npm ci` says the lockfile is out of sync

The dependency manifest was changed without updating the lockfile.

On the branch that intentionally changes dependencies:

```bash
npm install
```

Review and commit both `package.json` and `package-lock.json`.

Do not casually delete the lockfile.

### The build cannot resolve `@wordpress/scripts`

Dependencies are missing or the command is being run outside the theme root.

```bash
npm ci
```

Then verify that the current directory contains `package.json`.

### Styles changed in source but not on the site

1. Confirm the edit was under `src/scss`, not `assets/css`.
2. Run `npm run build`.
3. Confirm `assets/css/bundle.css` changed.
4. Clear WordPress/host/CDN/browser caches.
5. Inspect the enqueued stylesheet URL/version.

### JavaScript changed in source but behavior did not change

1. Run `npm run build`.
2. Confirm `assets/js/bundle.js` changed.
3. Clear caches.
4. Check the browser console.
5. Verify markup still contains the required `data-nytt01-*` attributes.

### The mega menu does not attach to a renamed menu item

Add the explicit CSS class:

```text
nytt01-mega-services
nytt01-mega-about
nytt01-mega-blog
```

### The Blog mega menu is empty

Confirm that published Posts exist. Drafts, private posts, and custom post types do not populate the latest-post cards.

### The Blog card has a placeholder image

Assign a featured image to the post.

### The Contact button is incorrect

The header CTA currently targets:

```text
/contact/
```

Create that page or deliberately update the URL in the header implementation.

### Editor styles are missing

1. Run `npm run build`.
2. Confirm `assets/css/editor.css` exists.
3. Confirm `add_theme_support( 'editor-styles' )` runs before `add_editor_style()`.
4. Clear the editor/browser cache.

### `npm run package` fails validation

Run the individual stages:

```bash
npm run lint:js
npm run lint:node
npm run lint:css
npm run build
```

Fix the first failing stage rather than bypassing it.

### A form causes a fatal error

Form processing belongs to `nolan-young-core`, not this theme.

1. Confirm the plugin version is current.
2. Enable local `WP_DEBUG`.
3. Review `wp-content/debug.log`.
4. Reproduce with a mail logger enabled.
5. Test the plugin submission handler directly.

Do not move the form handler into the theme as a workaround.

---

## Non-negotiable maintenance rules

1. **The theme owns presentation only.**
2. **Persistent/business functionality remains in plugins.**
3. **`functions.php` remains a bootstrap file.**
4. **Use the WordPress template hierarchy rather than invented root templates.**
5. **Do not add a root-level `403.php`.**
6. **Do not register custom post types or taxonomies in the theme.**
7. **Do not process forms in the theme.**
8. **Do not hardcode the primary menu in `header.php`.**
9. **Keep the Primary Navigation WordPress-managed.**
10. **Edit SCSS and JavaScript only under `/src`.**
11. **Never manually patch generated files under `/assets/css` or `/assets/js`.**
12. **Use `theme.json` as the WordPress design-system authority.**
13. **Load assets through WordPress enqueue APIs.**
14. **Use generated asset metadata for dependencies and versions.**
15. **Prefix public identifiers with `nytt01_` or `nytt01-` as appropriate.**
16. **Use the exact text domain `nolan-young-theme-template-01`.**
17. **Escape dynamic output at the point of output.**
18. **Sanitize theme-controlled input.**
19. **Never commit credentials or secrets.**
20. **Preserve keyboard navigation and reduced-motion behavior.**
21. **Keep the screenshot exactly 1200×900.**
22. **Keep `style.css`, `package.json`, and `CHANGELOG.md` versions synchronized.**
23. **Stop every watcher and run `npm run build` as the final asset command before review or packaging.**
24. **Run PHP_CodeSniffer before release.**
25. **Test with `WP_DEBUG` on local/staging.**
26. **Test the installable ZIP on a clean WordPress site.**
27. **Ship exactly one top-level theme directory in the ZIP.**
28. **Update this README whenever architecture or commands change.**

---

## Official WordPress references

The architecture and practices in this project are based on the official WordPress developer documentation:

- Theme Handbook: https://developer.wordpress.org/themes/
- Classic themes: https://developer.wordpress.org/themes/classic-themes/
- Theme structure: https://developer.wordpress.org/themes/core-concepts/theme-structure/
- Main stylesheet: https://developer.wordpress.org/themes/core-concepts/main-stylesheet/
- Custom functionality: https://developer.wordpress.org/themes/core-concepts/custom-functionality/
- Including assets: https://developer.wordpress.org/themes/core-concepts/including-assets/
- Build process: https://developer.wordpress.org/themes/advanced-topics/build-process/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- `theme.json`: https://developer.wordpress.org/themes/global-settings-and-styles/introduction-to-theme-json/
- Patterns: https://developer.wordpress.org/themes/patterns/
- Internationalization: https://developer.wordpress.org/themes/advanced-topics/internationalization/
- Security: https://developer.wordpress.org/themes/advanced-topics/security/
- Accessibility: https://developer.wordpress.org/themes/functionality/accessibility/
- Debugging: https://developer.wordpress.org/themes/advanced-topics/debugging/
- Testing: https://developer.wordpress.org/themes/releasing-your-theme/testing/
- WordPress Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/
- PHP Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
- JavaScript Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/
- CSS Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/

---

## Final release principle

A successful build is not the same as a production-ready release.

A production release requires all of the following:

```text
source review
+ WordPress standards review
+ clean dependency installation
+ linting
+ production build
+ structural validation
+ PHP standards checks
+ WordPress runtime testing
+ accessibility testing
+ clean ZIP installation testing
```

If any part of that chain fails, the release is not approved.
