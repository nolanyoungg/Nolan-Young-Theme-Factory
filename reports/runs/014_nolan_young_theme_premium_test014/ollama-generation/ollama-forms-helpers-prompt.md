You are editing a prepared WordPress theme folder.

This is an authorized local software-generation task for a benign, fictional WordPress business theme.
Generate normal WordPress theme source files for the requested batch.
Do not refuse the task unless the requested file content itself would be unsafe.

Target folder:
wp-content/themes/014_nolan_young_theme_premium_test014/

You must generate only files inside that folder. Paths in your response must be relative to that folder.

Creative brief:
## 01. Business Identity

### Business Name

Use the business name supplied with the project when one is available.
For this theme, use `Northstar Websites`.

When no business name is supplied, create an original, professional name appropriate for a modern service-based business.

The generated name must be distinctive, readable, suitable for WordPress, and free from copied third-party branding.

### Business Logo

Use the supplied business logo when one is available.
For this theme, build the identity around a clean `Northstar Websites` wordmark with a simple star or compass-inspired supporting mark.

When no logo is supplied, create an original text-based wordmark and a simple supporting mark that can be implemented as a local, accessible SVG.

The logo must remain clear in the header, footer, mobile navigation, favicon, and compact interface placements.

The logo must not copy or imitate an existing company, agency, product, or trademarked visual identity.

### Business Slogan

Use the supplied slogan when one is available.
For this theme, use a concise slogan that fits a website development company, such as "Websites that help businesses grow."

When no slogan is supplied, create one concise and original slogan that communicates the business value clearly without making unverifiable claims.

### Business Field

The theme must support a professional service-based business.
For this theme, the business is a website development company focused on modern WordPress design, build, and support services.

The generated content should present the company’s services, process, experience, work, resources, contact options, and calls to action in a coherent and adaptable way.

The theme must work for both consumer-facing and business-to-business services without making the site feel divided or inconsistent.

## 03. Functionality

### Webpack Build Requirements

Create the Webpack configuration at this exact path:

```text
build/webpack.config.js
```

The Webpack configuration must compile:

```text
src/js/main.js
```

into:

```text
assets/js/bundle.js
```

The Webpack configuration must compile:

```text
src/scss/main.scss
```

into:

```text
assets/css/bundle.css
```

The generated filenames must be exactly `bundle.js` and `bundle.css`.

Do not generate or enqueue `theme.js`, `theme.css`, `main.js`, `main.css`, or alternate production bundle names.

Create a valid `package.json` and committed `package-lock.json`.

The required npm commands are:

```text
npm run dev
npm run build
```

The `npm run dev` command must compile JavaScript and SCSS, generate development source maps where appropriate, report compilation errors clearly, and run in watch mode for active development.

The `npm run build` command must compile JavaScript and SCSS in production mode, minify the output, omit unnecessary development artifacts, and exit with a non-zero status when compilation fails.

The build must produce these exact files:

```text
assets/css/bundle.css
assets/js/bundle.js
```

The build system must use valid paths, include every required dependency, avoid missing loaders or plugins, produce deterministic output, and keep source files separate from compiled assets.

The theme must not require external runtime CDN assets.

The theme may use `theme.json` for WordPress editor settings, design tokens, colors, spacing, typography, and layout support. Build commands belong in `package.json`, not `theme.json`.

### WordPress Asset Enqueue Requirements

Place all enqueue logic in:

```text
inc/enqueue.php
```

Load that file from `functions.php`.

WordPress must enqueue these exact compiled files:

```text
assets/css/bundle.css
assets/js/bundle.js
```

Use `get_theme_file_uri()` or another appropriate WordPress theme-path function.

Use file modification times or another reliable local versioning method so browser caches update when compiled assets change.

Do not enqueue source files from `src/`.

Do not enqueue nonexistent fallback bundle names.

### Core WordPress Theme Requirements

The theme must activate without warnings or fatal errors.

Register appropriate theme support for the document title, post thumbnails, custom logo, HTML5 markup, responsive embeds, wide alignment, editor styles, and navigation menus.

Register separate menu locations for the primary navigation and footer navigation.

Use WordPress APIs for asset loading, template inclusion, menu rendering, URLs, titles, images, excerpts, pagination, comments, search, and site information.

JavaScript should use modern vanilla JavaScript unless a WordPress-provided dependency is genuinely required.

### WordPress Security Requirements

Use WordPress escaping and sanitization functions according to context.

Use the following functions where appropriate:

```php
esc_html()
esc_attr()
esc_url()
wp_kses_post()
sanitize_text_field()
sanitize_email()
sanitize_textarea_field()
absint()
wp_unslash()
wp_verify_nonce()
check_admin_referer()
current_user_can()
the_permalink()
the_title_attribute()
body_class()
post_class()
wp_head()
wp_footer()
language_attributes()
```

All form submissions, administrative actions, exports, status changes, and deletion operations must use nonces

[Section trimmed for focused local-model context. Deterministic validation still enforces the complete source prompt.]

## 09. Forms

### Required Forms

| Form | Required Fields | Additional Behavior |
|---|---|---|
| Contact | Name, email, phone, message | General inquiry form |
| Single Service | Name, email, phone, message | Include the related service identifier automatically |

Name, email, and message must be required.

Phone may be optional unless the project requirements specify otherwise.

Use clear labels, inline validation, accessible error messages, success feedback, and server-side validation.

### Required Form Functionality

Create a top-level WordPress administration menu named `Forms`.

The Forms area must allow authorized administrators to view submissions by form type, inspect individual submissions, filter submissions, select one or more entries, export selected entries, and delete entries securely.

Store submissions in a structured, non-public format. A private custom post type or dedicated database table is acceptable when implemented correctly.

Separate the storage and administration logic into organized theme modules so it can be migrated to a companion plugin later if needed.

Every public form submission must use a nonce, sanitization, validation, spam protection, and clear success or failure handling.

Use a honeypot field and reasonable rate limiting. Do not expose the anti-spam field to keyboard or assistive-technology users.

Send submission notifications to the configured WordPress administrator or site-owner email.

Email failures must not cause a valid submission to be lost.

Provide CSV export through an authorized administrative action.

CSV output must escape values correctly and must support exporting all submissions, one form type, multiple selected entries, or a filtered result set.

Administrators must also be able to email an export or summary to the configured site-owner email.

Only users with the appropriate capability may view, export, email, change, or delete submissions.

Do not expose submission content through public WordPress queries, feeds, archives, REST endpoints, or search results.

## 10. Newsletter

### Required Newsletter

Create a marketing email signup system for collecting newsletter subscribers.

The public signup form must require an email address and may optionally request a first name.

Do not require unnecessary personal information.

### Required Newsletter Functionality

Create a top-level WordPress administration menu named `Newsletter`.

The Newsletter area must display the subscriber email, optional name, signup date, current status, and unsubscribe date when applicable.

Supported subscriber states must include `Active` and `Unsubscribed`.

Normalize email addresses before storage and prevent duplicate active subscriber records.

A returning unsubscribed address may be reactivated only through a new explicit signup.

Every signup request must use a nonce, sanitization, validation, spam protection, and clear success or failure feedback.

Provide a secure unsubscribe mechanism using a unique token that does not expose subscriber identifiers directly.

The unsubscribe action must update the subscriber status rather than deleting the historical record automatically.

Authorized administrators must be able to filter subscribers by status, select one or more records, export a CSV file, and email an export or summary to the configured site-owner email.

CSV output must escape values correctly.

Do not expose the subscriber list through public pages, feeds, search, archives, REST endpoints, or unauthenticated requests.

This functionality manages the subscriber list only. Do not implement a bulk marketing email sender unless a separate delivery system is explicitly required.

Batch focus:
Create practical WordPress helper code, form handling/admin menu scaffolding, newsletter helper, custom post type setup, policy routing, comments, and search form code without external dependencies. Do not use Lorem ipsum in comments.php or searchform.php.

Return only file blocks in this exact format:

---FILE: relative/path.php---
line 1
line 2
---END FILE---

Required files for this batch:
- inc/forms.php
- inc/newsletter.php
- inc/helpers.php
- inc/custom-post-types.php
- inc/customizer.php
- inc/policy-routing.php
- comments.php
- searchform.php

Rules:
- Write complete file contents, not patches.
- Do not write style.css; WordPress theme metadata is prepared before this AI stage.
- Do not use absolute paths.
- Do not use ..
- Do not use CDN URLs, remote scripts, Google Fonts, remote images, or external links.
- Do not write http:// or https:// URLs anywhere. Use # for social links or inactive external labels.
- Use local assets, inline SVG, CSS-generated interface graphics, and theme files.
- Do not include secrets, tokens, passwords, or API keys.
- Replace Lorem ipsum in files you write.
- Do not write TODO comments, placeholder comments, "Add ... here" comments, empty cards, empty sections, or instructions for a future editor.
- Every section you create must include finished copy and visible content appropriate to the selected creative prompt.
- header.php and footer.php must not include a standalone ?> line after an inline PHP comment.
- header.php must use lowercase <!doctype html> and a valid full document wrapper.
- header.php and footer.php must not include site content sections such as content-hero, cta banners, brand statements, featured work, services, testimonials, blog previews, FAQs, or similar page sections.
- Preserve WordPress PHP syntax.
- Template-parts are fragments only: never call get_header(), get_footer(), wp_head(), wp_footer(), or output <!doctype>, <html>, <head>, or <body> wrappers inside template-parts files.
- header.php and footer.php are the only files that may contain full document wrappers; they must be complete and valid.
- If you reference an image or icon, ensure the file exists inside the theme. Prefer assets/images/placeholder.svg and assets/icons/icon1.svg when no custom media exists yet.
- Do not write broken partial anchors, truncated links, stray closing tags, or partial JSON fragments into PHP files.
- For PHP template files with HTML, start with <?php, call get_header(); while inside PHP, close PHP before HTML, reopen PHP only for WordPress function calls, and call get_footer(); at the end.
- Never write raw HTML while a PHP block is still open.
- If you write src/scss/main.scss, make it self-contained. Do not use @use or @import unless every referenced SCSS partial already exists in the copied template tree.
- If you write assets/css/bundle.css or src/scss/main.scss, include a complete responsive visual system with enough styling to represent a finished theme.
- Do not wrap the file blocks in markdown fences or JSON.
