You are running one targeted repair stage for a generated WordPress theme.

Target folder:
wp-content/themes/010_nolan_young_theme_premium_test010/

Return complete replacement file blocks only for the target files listed below.
Do not write any other file paths.

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

## 02. Style / CSS Requirements

Organize the theme like a serious, modern WordPress product rather than a quick demonstration. The codebase must use predictable folders, reusable template parts, consistent SCSS architecture, shared design tokens, and component-level styling.

Do not scatter one-off CSS rules across PHP templates. Do not place large style blocks directly inside template files. Do not use inline styles unless a value must be generated dynamically and cannot be represented through a class or CSS custom property.

### CSS Architecture

Use `src/scss/main.scss` as the single SCSS entry point.

The SCSS source must use the exact directory and file structure defined in the Required Theme Structure. Do not rename, relocate, or replace the required SCSS files.

The architecture must separate global settings, reusable tools, foundational styles, components, layout systems, and page-specific styles.

`src/scss/main.scss` must load the required partials in a deliberate dependency order so variables, mixins, and functions are available before dependent styles are compiled.

Use CSS custom properties for global colors, spacing, typography, border radii, shadows, content widths, header heights, and transition values.

Use mobile-first responsive styles. Avoid unnecessary breakpoint duplication. Prevent horizontal overflow at all supported viewport sizes.

Use component-scoped class names and avoid fragile selectors based on deep nesting.

Do not place large CSS blocks inside PHP templates.

Do not create alternate compiled stylesheets. The only required compiled stylesheet is:

```text
assets/css/bundle.css
```

### Button Classes

| Class | Purpose |
|---|---|
| `.btn` | Shared base class for all button and button-like link styles |
| `.btn-primary` | Primary action with the strongest visual emphasis |
| `.btn-secondary` | Secondary action with a quieter visual treatment |
| `.btn-header-cta` | Header-specific Contact Us CTA |
| `.btn-small` | Compact button variation |
| `.btn-full` | Full-width button variation |
| `.btn-text` | Text-forward action with minimal chrome |

Every button variation must support default, hover, focus-visible, active, and disabled states.

Buttons must maintain adequate contrast, readable labels, consistent padding, and a minimum usable touch target.

### Content Requirements

Write complete, original, business-specific content throughout the theme.

Do not use Lorem ipsum, placeholder paragraphs, copied third-party text, fake legal claims, fabricated client names, fabricated review ratings, or statements that imply real endorsements when none were supplied.

Do not leave visible filler such as `x1`, `x2`, `Example Service`, `Sample Project`, `Coming Soon`, or similar temporary labels in the finished theme.

When business-specific facts are not supplied, write neutral content that does not invent addresses, awards, client counts, years in business, certifications, or other unverifiable details.

### Accessibility and Motion

All interactive states must include visible keyboard focus styling.

Animations must be restrained, purposeful, and respectful of `prefers-reduced-motion`.

Color must not be the only method used to communicate state, validation, selection, success, or failure.

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

All form submissions, administrative actions, exports, status changes, and deletion operations must use nonces and capability checks.

Never trust request data directly.

Sanitize values before storage and escape values at output.

Do not commit API keys, passwords, access tokens, private keys, local machine paths, or environment-specific secrets.

## 04. Color System

Use the following palette consistently throughout the theme.

| Purpose | Color |
|---|---|
| Main background | `#ffffff` |
| Secondary background | `#f4f7fb` |
| Dark background | `#101827` |
| Primary brand | `#2563eb` |
| Secondary brand | `#14b8a6` |
| Accent | `#f97316` |
| Primary text | `#111827` |
| Muted text | `#64748b` |
| Border and divider | `#e2e8f0` |

### Primary Button Colors

The primary button background must be `#2563eb`, and the text must be `#ffffff`.

On hover, the background must become `#1d4ed8`, while the text remains `#ffffff`.

The focus-visible state must remain highly visible and must not rely on the hover state alone.

### Secondary Button Colors

The secondary button background must be `#ffffff`, the text must be `#111827`, and the border must be `#cbd5e1`.

On hover, the background must become `#f4f7fb`, while the text remains `#111827`.

### Additional Color Rules

Use the dark navy background sparingly for proof sections, process explanations, metrics, case studies, final CTA areas, and other high-emphasis content.

Use teal accents for successful form states, completed steps, selected filters, active states, and subtle visual confirmation.

Use orange only for small highlights, priority indicators, warnings, or high-priority CTA accents.

Do not allow accent colors to reduce readability or violate contrast requirements.

Maintain consistent color usage across buttons, cards, forms, links, icons, navigation, focus indicators, validation states, CTA sections, content filters, status indicators, and data visualizations.

Expose the color system through CSS custom properties so components do not duplicate raw color values unnecessarily.

## 05. Visual Design Direction

Create a premium, modern, content-forward business website.

The design must feel polished, clear, credible, and intentional. It should balance strong visual presentation with direct information architecture and conversion-focused calls to action.

Use generous spacing, strong typographic hierarchy, carefully controlled content widths, reusable cards, clear sections, and restrained decorative treatments.

Avoid a generic template appearance, crowded layouts, excessive gradients, unnecessary visual effects, inconsistent component styling, and animation that distracts from the content.

The visual system must support services, company information, case studies, resources, process explanations, proof, and conversion sections without making the site feel fragmented.

Use asymmetrical editorial layouts where appropriate, but maintain predictable reading order and accessible responsive behavior.

Cards should use consistent spacing, image treatment, border styling, and hover behavior.

Work, case-study, and resource sections should prioritize useful content while preserving readable summaries, categories, metadata, and links.

The site must feel complete at every breakpoint. Mobile layouts must be intentionally designed rather than appearing as compressed desktop layouts.

Interactive elements should feel refined and responsive without becoming distracting.

Every page must use a consistent relationship between visual media, headings, supporting text, metadata, and CTAs.

## 06. Typography Direction

### Heading Style

Use clean, editorial headings with strong scale, controlled line breaks, and a premium professional character.

Headings should feel distinctive while remaining readable, restrained, and appropriate for a modern service-based business.

Use fluid sizing with `clamp()` where appropriate.

Avoid oversized headings that overflow or create awkward single-word lines on smaller screens.

### Body Text Style

Use a highly readable modern sans-serif style for body copy, navigation, forms, captions, metadata, and supporting content.

Use a safe local and system font stack. Do not depend on externally hosted fonts.

A suitable base stack is:

```css
font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
```

Use a comfortable body line height and keep long-form text within a readable line length.

Use font weight, spacing, and size to establish hierarchy rather than relying only on color.

Typography must remain readable over visual media, dark sections, cards, overlays, and mobile navigation.

Avoid extremely thin font weights for essential information.

## 07. Header =====================================

### Header Layout
  
    Logo left, nav center, CTA right
    
    - Structure (left -> center -> right):
      1) Logo block (left)
         - Clicking logo goes to / (home).
      2) Primary nav (center)
         - Desktop nav items must be exactly:
           - Services
           - About
           - Work
           - Blog
         - Services is a button trigger that opens the `nolan-menu` panel for services.
         - About is a button trigger that opens the `nolan-menu` panel for about us content.
         - Blog is a button trigger that opens the `nolan-menu` panel for blog.
         - Work is a direct link to /work/.
         - Keep the primary nav readable, balanced, and visually calm.
      3) CTA area (right)
         - Primary CTA button text: Contact Us.
         - Primary CTA URL: /contact/.
         - CTA must be visible on desktop.
         - CTA should use .btn .btn-header-cta and feel like the strongest header action without overpowering the nav.
         - CTA should be available in the mobile drawer as a full-width button.


### Navigation Panel Content Requirements
  
    1) Services `nolan-menu` panel
    - Left rail items (exact labels):
      - x1
      - x2
      - x3
      - x4
      - x5
      - x6
    
    - Right side per rail item MUST include:
      - Local photo
      - Premium title
      - Short editorial description
      - 3 to 5 bullet details
    
    2) About `nolan-menu` panel
    - Left rail items:
      - x1
      - x2
      - x3
    
    - Right side per rail item MUST include:
      - Local photo
      - Headline
      - Values list or short feature list
      - CTA linking to about page
    
    3) Blog `nolan-menu` panel
    - Use a grid of at least 4 blog cards.
    - Each card must include a local photo, tag, title, excerpt, and link to its corresponding blog post.
    - Cards should feel editorial and useful, not generic filler.


### Dropdown/navigation panel requirements & behavior:
    - The sticky header must transition into a "scrolled" variant after the user scrolls down.
    - Each dropdown panel must remain correctly positioned beneath the header in both the default and scrolled states.
    - Right-side panel content updates on left rail hover and keyboard focus
    - On top: slightly taller padding, more airy.
    - Scrolled: slightly tighter padding, solid warm background, crisp border.
    - Must not cause layout shift.
    - Open/close on click - drop down based on main nav items
    - Only one panel open at a time; toggling another closes the current.
    - Clicking the same trigger closes it.
    - Clicking outside closes it.
    - Escape closes it.
    - When open: show full-page backdrop and lock body scroll.
    - Panels must be SOLID and readable.
    - The dropdown panels must never be transparent. Every panel must use a solid, readable background with a stable z-index above all standard page content.
    - The sticky header must transition into a scrolled variant after the user scrolls down the page. In its default state, the header should use slightly taller padding to create a more open and      airy appearance. In its scrolled state, the header should use slightly tighter padding, a solid warm background, and a crisp border.
    - The transition between the default and scrolled header states must not cause layout shift. Each dropdown panel must remain correctly positioned beneath the header in both states.
    - The Services, About, and Blog buttons in the primary navigation control the opening and closing of their corresponding nolan-menu dropdown panels.
    - Clicking the Services, About, or Blog navigation button must open its corresponding dropdown panel.
    - Clicking the currently active navigation button must close its open dropdown panel.
    - Clicking a different navigation button while another dropdown panel is open must close the currently active panel and open the newly selected panel.
    - Only one dropdown panel may be open at a time.
    - Clicking outside the open dropdown panel must close it.
    - Pressing Escape must close the open dropdown panel.
    - When a dropdown panel is open, a full-page backdrop must appear and body scrolling must be locked. Body scrolling must be restored when the panel closes.
    - Each dropdown panel must use a dynamic height based on the amount of content inside the selected panel.
    - The Services and About dropdown panels must use a two-column layout consisting of a left rail containing category buttons and a right-side content area containing the corresponding content       sections.
    - After the Services or About dropdown panel is open, hovering over a left-rail item must update the corresponding content displayed in the right-side content area.
    - Keyboard-focusing a left-rail item through Tab navigation must also update the corresponding right-side content.
    - Hovering over or keyboard-focusing a left-rail item controls only the content displayed inside the already-open dropdown panel. It must not open or close the main dropdown panel.
    - Only one corresponding right-side content section may be visible at a time.
    - The left-rail hover and keyboard-focus interaction is a required signature feature of the Services and About dropdown panels.
    - The Blog dropdown panel must open and close through its primary navigation button, but its internal content must use the required blog-card grid. The Blog panel must not use a left rail or       rail-controlled right-side content.
    - The aria-expanded value of each primary navigation trigger must update accurately when its panel opens or closes.
    - Use aria-controls to connect each primary navigation trigger to its corresponding dropdown panel.
    - Closed dropdown panels must be hidden from assistive technology.
    - All interactive controls must include strong :focus-visible states.
    - The dropdown system must not create keyboard traps.

#### Required Data Attributes

    Use the following relationships exactly:
    
  ```html
    <button data-menu-item="services" aria-controls="services-menu">
    <div id="services-menu" data-menu-dropdown="services">
    
    <button data-menu-item="about" aria-controls="about-menu">
    <div id="about-menu" data-menu-dropdown="about">
    
    <button data-menu-item="blog" aria

[Section trimmed for focused local-model context. Deterministic validation still enforces the complete source prompt.]

## 08. Footer

Create a polished, full-width footer that feels intentional, premium, and visually consistent with the overall business design system.

The footer must include a large CTA band, brand statement, Services column, Company column, Blog column, Contact block, and bottom legal row.

The complete footer must use strong spacing, clear visual hierarchy, readable typography, and a fully responsive layout.

### Services Column

Create a Services column containing links to the generated service pages.

The column should include the primary services represented elsewhere in the theme.

Every service link must point to a real generated destination.

Do not include placeholder links or links to pages that do not exist.

### Company Column

Create a Company column containing links to important company pages such as About, Work, Blog, and Contact.

Every link must point to its real generated page destination.

### Blog Column

Create a Blog column that provides access to the Blog archive and relevant recent or featured posts.

The Blog heading must be clearly distinguished from the links beneath it.

Do not use generic filler links.

### Footer Navigation and Link Behavior

All footer links must use clear and descriptive labels.

Links must include visible hover and `:focus-visible` states.

External links must be identified and handled appropriately.

The footer must not contain broken links, placeholder destinations, or links to pages that were not generated.

### Bottom Legal Row

Create a bottom legal row beneath the main footer content.

The legal row must include a copyright notice and links to any legal pages that were actually generated.

Generate the current year dynamically rather than hardcoding it.

Visually separate the legal row from the main footer using spacing, a subtle border, or another restrained design treatment.

Do not fabricate legal text. Policy pages must render content supplied or entered through WordPress.

### Responsive Footer Behavior

On desktop, use a balanced multi-column layout.

On tablet, reorganize the content into fewer columns while preserving hierarchy and spacing.

On mobile, stack the footer into a clean single-column layout.

The CTA band, navigation groups, contact information, and legal row must remain readable and easy to interact with.

The footer must not create horizontal overflow.

### Accessibility and Visual Quality

Use semantic `<footer>` markup and appropriate navigation landmarks.

Maintain sufficient contrast between text, links, controls, and the footer background.

All interactive elements must support keyboard navigation.

The finished footer should feel complete and intentional rather than like a basic collection of links.

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

## 11. template-parts to fill in/build out

Create and fully implement these exact template parts:

```text
template-parts/
    content-page.php
    content-single.php
    content-none.php
    content-policy.php
    content-search.php
    content-hero.php
    content-brand-statement.php
    content-featured-work.php
    content-all-services.php
    content-single-service-highlight.php
    content-process.php
    content-style-pillars.php
    content-testimonials.php
    content-blog-preview.php
    content-cta-banner.php
    content-footer-widgets.php
```

| Template Part | Responsibility |
|---|---|
| `content-page.php` | Standard page content |
| `content-single.php` | Standard single-post content |
| `content-none.php` | Empty-result and not-found messaging |
| `content-policy.php` | Policy-page presentation without inventing policy text |
| `content-search.php` | Search-result item layout |
| `content-hero.php` | Reusable high-impact hero |
| `content-brand-statement.php` | Company purpose and positioning |
| `content-featured-work.php` | Featured work, project, or case-study preview |
| `content-all-services.php` | Primary service overview |
| `content-single-service-highlight.php` | Featured service presentation |
| `content-process.php` | Step-by-step company process |
| `content-style-pillars.php` | Brand, service, or experience pillars |
| `content-testimonials.php` | Supplied testimonials or an approved non-testimonial proof fallback |
| `content-blog-preview.php` | Recent or featured articles |
| `content-cta-banner.php` | Reusable contact or conversion CTA |
| `content-footer-widgets.php` | Footer column content |

Every template part must be reusable, escaped correctly, responsive, and free from duplicated page-level markup.

Do not add alternate template parts that duplicate these responsibilities unless the additional file is technically necessary and clearly documented.

## 12. page-templates to fill in/build out

The homepage must be built in the root `front-page.php` file.

Do not create a homepage template under `page-templates/`.

Create the page templates in this exact order:

```text
page-templates/
    template-about-us.php
    template-services.php
    template-single-service.php
    template-work.php
    template-blog.php
    template-contact.php
    template-policy.php
```

Every file in `page-templates/` must include a valid WordPress `Template Name` header.

### front-page.php

Build a complete, finished business homepage with fifteen polished sections.

#### Homepage Section 01: High-Impact Hero

Use a strong local visual asset, clear headline, supporting copy, two CTAs, a compact trust or service-summary row, and a restrained visual treatment.

#### Homepage Section 02: Featured Work Strip

Create a horizontal preview of featured work, projects, solutions, or results using local visual assets and links to the Work page.

#### Homepage Section 03: Brand Statement

Present the company purpose, positioning, and value through strong editorial typography and a supporting visual pairing.

#### Homepage Section 04: Services Overview

Present at least six service cards using appropriate local visual assets and clear links to the corresponding service pages.

#### Homepage Section 05: Signature Process

Explain the complete customer journey from inquiry and discovery through planning, delivery, support, and follow-up.

#### Homepage Section 06: Featured Work Filter

Create an accessible featured-work layout using the styles from:

```text
src/scss/components/_portfolio-filter.scss
```

Use a vanilla-JavaScript filter controlled from:

```text
src/js/main.js
```

Use these categories:

```text
Strategy
Design
Development
Integration
Support
Results
```

The filter must support mouse, touch, and keyboard interaction.

#### Homepage Section 07: Featured Case Study

Present one detailed project or client case study using strong visual media, an editorial narrative, a quotation only when supplied, and clear challenge, solution, and outcome details.

#### Homepage Section 08: Before-and-After or Comparison Feature

Use the styles from:

```text
src/scss/components/_before-after.scss
```

Implement an accessible comparison, transformation, process, or results presentation.

The interaction must remain usable without requiring precise pointer movement.

#### Homepage Section 09: Packages and Engagement Options

Create three polished option cards representing clear service levels, project types, or engagement models.

Do not invent prices when pricing was not supplied.

#### Homepage Section 10: Business Solutions Feature

Present a focused solution area using local visual media and practical business-focused content.

#### Homepage Section 11: Customer Experience Feature

Explain what customers can expect before, during, and after working with the company.

Use professional, useful, and non-generic content.

#### Homepage Section 12: Testimonials and Proof

Use real testimonial content only when it was supplied.

Do not invent client names, quotations, ratings, companies, or endorsements.

When testimonials are unavailable, use an approved non-testimonial proof section based on supplied work, documented process, real metrics, or neutral experience highlights.

#### Homepage Section 13: Blog Preview

Show at least four useful articles, guides, or resources with real generated destinations.

#### Homepage Section 14: FAQ

Include at least seven useful questions about services, process, timelines, communication, project requirements, support, and getting started.

Use an accessible accordion styled through:

```text
src/scss/components/_accordion.scss
```

Closed answers must not remain exposed to assistive technology or keyboard focus.

#### Homepage Section 15: Final CTA

Use strong conversion-focused copy, a primary Contact Us CTA, and a secondary link to the Work page.

### template-about-us.php

Create a complete About page with the company story, purpose, approach, values, team or company information, experience, supporting visual media, and a final Contact Us CTA.

Do not invent founder biographies, awards, locations, certifications, or history that were not supplied.

### template-services.php

Create a complete Services page with a strong hero, six primary service cards, process overview, service-comparison guidance, featured work, FAQ, and final Contact Us CTA.

Every service card must link to a real service-detail destination.

### template-single-service.php

Create a reusable service-detail template with a service hero, detailed overview, ideal-customer guidance, deliverables, process, supporting visual content, package or inquiry guidance, related services, FAQ, and the Single Service form.

The form must automatically identify the service being viewed.

### template-work.php

Create a content-forward Work page with project categories, accessible filtering, project or case-study cards, featured results, and direct links to relevant services.

### template-blog.php

Create a Blog archive page with a featured article, category navigation, article cards, excerpts, pagination, and search access.

Use real generated posts and destinations.

### template-contact.php

Create a complete Contact page with clear inquiry guidance, response information that does not make unsupported promises, the Contact form, and any real supplied contact details.

### template-policy.php

Create a readable policy-page layout that renders WordPress-managed policy content.

Do not generate legal promises, guarantees, privacy claims, cookie claims, or terms that were not supplied or reviewed.

## 13. Images

Use real, relevant visual media rather than filler graphics or empty placeholders.

Use only public-domain, CC0, or properly licensed assets that permit the intended use.

Do not describe an asset as copyright-free unless its license actually supports that claim.

Store local visual assets only within the required asset structure:

```text
assets/
    icons/
        icon1.svg
        README.md
    images/
        hero/
        portfolio/
        texture/
```

Use `assets/images/hero/` for hero and major banner visuals.

Use `assets/images/portfolio/` for work, case-study, service, article, and supporting content visuals.

Use `assets/images/texture/` for restrained background textures and decorative raster assets.

Use `assets/icons/` for local SVG interface icons and marks.

Do not create alternate image directories that conflict with this structure.

Do not hotlink runtime assets from third-party websites.

Record the source URL, creator when required, license, and download date for every third-party asset in `README.md`.

Optimize raster assets for web delivery and provide responsive sizes where appropriate.

Use WebP or another modern optimized format when practical while preserving compatible fallbacks where needed.

Use descriptive filenames rather than generic names such as `image1.jpg`.

Every meaningful visual asset must have appropriate alternative text.

Decorative assets must use empty alternative text.

Store SVG files locally and sanitize them before use.

Document icon conventions and permitted icon sources in `assets/icons/README.md`.

Do not copy third-party logos, branding, screenshots, protected media, or proprietary visual material without appropriate permission.

Deterministic findings:
- page-templates/template-about-us.php: Remove unfinished placeholder/runtime copy.
- page-templates/template-services.php: Remove unfinished placeholder/runtime copy.
- page-templates/template-single-service.php: Remove unfinished placeholder/runtime copy.
- src/js/main.js: Remove unfinished placeholder/runtime copy.

Current file contents:
---CURRENT FILE: page-templates/template-about-us.php---
<?php
/*
Template Name: About Us
*/
get_header();
?>

<main class="about-us">
    <section class="hero">
        <h1>About Northstar Websites</h1>
        <p>We are dedicated to helping businesses grow through modern WordPress design, build, and support services.</p>
        <a href="#contact" class="btn btn-primary">Get in Touch</a>
    </section>

    <section class="company-story">
        <h2>Our Story</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>

    <section class="our-values">
        <h2>Our Values</h2>
        <ul>
            <li>Innovation</li>
            <li>Quality</li>
            <li>Client-Centric</li>
            <li>Trustworthiness</li>
        </ul>
    </section>

    <section class="our-team">
        <h2>Our Team</h2>
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </section>

    <section class="experience">
        <h2>Experience</h2>
        <p>We have successfully completed over 100 projects for various industries, helping them reach new heights.</p>
    </section>

    <section class="contact-us">
        <a href="#contact" class="btn btn-primary">Contact Us</a>
    </section>
</main>

<?php
get_footer();
?>

---END CURRENT FILE---

---CURRENT FILE: page-templates/template-services.php---
<?php
/*
Template Name: Services
*/
get_header();
?>

<main class="services">
    <section class="hero">
        <h1>Our Services</h1>
        <p>We offer a range of services to help your business thrive online.</p>
        <a href="#contact" class="btn btn-primary">Get in Touch</a>
    </section>

    <section class="services-overview">
        <div class="service-card">
            <img src="assets/images/service1.svg" alt="Service 1">
            <h2>Web Design</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <a href="#" class="btn btn-secondary">Learn More</a>
        </div>

        <!-- Add more service cards as needed -->
    </section>

    <section class="process-overview">
        <h2>Our Process</h2>
        <p>We take you through a comprehensive journey from discovery to delivery and beyond.</p>
    </section>

    <section class="featured-work">
        <h2>Featured Work</h2>
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </section>

    <section class="faq">
        <h2>Frequently Asked Questions</h2>
        <!-- Add FAQ items here using accordion style -->
    </section>

    <section class="contact-us">
        <a href="#contact" class="btn btn-primary">Contact Us</a>
    </section>
</main>

<?php
get_footer();
?>

---END CURRENT FILE---

---CURRENT FILE: page-templates/template-single-service.php---
<?php
/*
Template Name: Single Service
*/
get_header();
?>

<main class="single-service">
    <section class="hero">
        <h1><?php the_title(); ?></h1>
        <p><?php the_excerpt(); ?></p>
        <a href="#contact" class="btn btn-primary">Get in Touch</a>
    </section>

    <section class="service-overview">
        <?php the_content(); ?>
    </section>

    <section class="ideal-customer">
        <h2>Ideal Customer Profile</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </section>

    <section class="deliverables">
        <h2>Deliverables</h2>
        <ul>
            <li>Item 1</li>
            <!-- Add more deliverables as needed -->
        </ul>
    </section>

    <section class="process">
        <h2>Process</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </section>

    <section class="related-services">
        <h2>Related Services</h2>
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </section>

    <section class="faq">
        <h2>Frequently Asked Questions</h2>
        <!-- Add FAQ items here using accordion style -->
    </section>

    <section class="contact-us">
        <a href="#contact" class="btn btn-primary">Get in Touch</a>
    </section>
</main>

<?php
get_footer();
?>

---END CURRENT FILE---

---CURRENT FILE: src/js/main.js---
// This file is intentionally left empty for now.
// You can add additional JavaScript functionality here if needed.

---END CURRENT FILE---

Format:
---FILE: relative/path.php---
line 1
line 2
---END FILE---

Rules:
- Rewrite complete file contents, not patches.
- Return one file block for each target path that needs content changes.
- Keep every output path exactly one of the target paths listed above.
- Keep output inside wp-content/themes/010_nolan_young_theme_premium_test010/.
- Remove all Lorem ipsum, TODO, FIXME, "Add ... here", and future-editor instructions.
- Use finished copy aligned with the selected creative prompt.
- Preserve valid WordPress PHP syntax for PHP files.
- Do not use http://, https://, CDN scripts, remote images, secrets, tokens, or API keys.
- Do not wrap the file block in markdown fences or JSON.
- Template-parts are fragments only. They must not call get_header(), get_footer(), wp_head(), or wp_footer(), and must not include <!doctype>, <html>, <head>, <body>, </body>, or </html>.
- header.php must be a complete document header with <!doctype html>, <html>, <head>, wp_head(), and the opening <body> tag. It must not include content section template-parts such as content-hero or content-cta-banner.
- footer.php must close the document with wp_footer(), </body>, and </html>. It must not include content section template-parts such as content-brand-statement or content-cta-banner.
- If assets/css/bundle.css or src/scss/main.scss is listed, write a complete responsive visual system for the generated theme. src/scss/main.scss must be self-contained and must not use @use or @import.
- If assets/css/bundle.css is listed, write a stylesheet above 2000 bytes.
