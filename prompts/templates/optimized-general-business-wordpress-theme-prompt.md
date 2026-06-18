## 01. Business Identity

### Business Name

Use the business name supplied with the project when one is available.

When no business name is supplied, create an original, professional name appropriate for a modern service-based business.

The generated name must be distinctive, readable, suitable for WordPress, and free from copied third-party branding.

### Business Logo

Use the supplied business logo when one is available.

When no logo is supplied, create an original text-based wordmark and a simple supporting mark that can be implemented as a local, accessible SVG.

The logo must remain clear in the header, footer, mobile navigation, favicon, and compact interface placements.

The logo must not copy or imitate an existing company, agency, product, or trademarked visual identity.

### Business Slogan

Use the supplied slogan when one is available.

When no slogan is supplied, create one concise and original slogan that communicates the business value clearly without making unverifiable claims.

### Business Field

The theme must support a professional service-based business.

The generated content should present the company’s services, process, experience, work, resources, contact options, and calls to action in a coherent and adaptable way.

The theme must work for both consumer-facing and business-to-business services without making the site feel divided or inconsistent.

## 02. Style / CSS Requirements

Organize the theme like a serious, modern WordPress product rather than a quick demonstration. The codebase must use predictable folders, reusable template parts, consistent SCSS architecture, shared design tokens, and component-level styling.

Do not scatter one-off CSS rules across PHP templates. Do not place large style blocks directly inside template files. Do not use inline styles unless a value must be generated dynamically and cannot be represented through a class or CSS custom property.

### CSS Architecture

Use `src/scss/main.scss` as the main SCSS entry point.

Organize the SCSS source into clear concerns such as settings, tools, generic styles, elements, objects, components, utilities, and page-specific modules. The exact folder names may vary, but the architecture must remain predictable and documented.

Use CSS custom properties for global colors, spacing, typography, border radii, shadows, content widths, header heights, and transition values.

Use mobile-first responsive styles. Avoid unnecessary breakpoint duplication. Prevent horizontal overflow at all supported viewport sizes.

Use component-scoped class names and avoid styling elements through fragile selectors based on nesting depth.

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

Create the following Webpack configuration file:

```text
build/webpack.config.js
```

The Webpack configuration must compile:

```text
src/js/main.js
```

into:

```text
assets/js/theme.js
```

It must also compile:

```text
src/scss/main.scss
```

into:

```text
assets/css/theme.css
```

Create a valid `package.json` containing these working commands:

```text
npm run dev
npm run build
```

The `npm run dev` command must compile JavaScript and SCSS, generate source maps where appropriate, report compilation errors clearly, produce development-friendly output, and support watch mode for active development.

The `npm run build` command must compile JavaScript and SCSS, minify production assets, produce the exact files enqueued by WordPress, omit unnecessary development output, and exit with a non-zero status when compilation fails.

The build system must use valid paths, include every required dependency, avoid references to missing loaders or files, produce deterministic output, keep source files separate from compiled files, and avoid external runtime CDN dependencies.

The WordPress theme must enqueue these exact compiled files:

```text
assets/css/theme.css
assets/js/theme.js
```

The theme may use `theme.json` for WordPress editor settings, design tokens, colors, spacing, typography, and layout support. Build commands belong in `package.json`, not `theme.json`.

### Core WordPress Theme Requirements

The theme must contain the standard WordPress files required for installation and operation.

At minimum, the completed theme must include:

```text
style.css
functions.php
index.php
header.php
footer.php
front-page.php or an assigned homepage page template
single.php
page.php
archive.php
search.php
404.php
comments.php
screenshot.png
```

Register appropriate theme support for the document title, post thumbnails, custom logo, HTML5 markup, responsive embeds, wide alignment, editor styles, and navigation menus.

Register separate menu locations for the primary navigation and footer navigation.

Use WordPress APIs for asset loading, template inclusion, menu rendering, URLs, titles, images, excerpts, pagination, and site information.

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

All form submissions, administrative actions, exports, status updates, and delete operations must use nonces and capability checks.

Never trust request data directly. Sanitize values before storage and escape values at output.

Do not commit API keys, passwords, access tokens, private keys, local machine paths, or environment-specific secrets.

### Static Preview

Create a static preview at:

```text
docs/index.html
```

The static preview must represent the completed theme accurately enough to review the visual system, homepage structure, header behavior, footer layout, and responsive navigation.

The preview must use local compiled assets and local images. It must not depend on external runtime CDNs.


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

## 07. Header

### Header Layout

Create a three-part desktop header with the logo on the left, the primary navigation centered, and the Contact Us CTA on the right.

The logo must link to the homepage at `/`.

The desktop primary navigation items must appear in this exact order:

```text
Services
About
Work
Blog
```

Services must be a button trigger that opens the Services `nolan-menu` panel.

About must be a button trigger that opens the About `nolan-menu` panel.

Blog must be a button trigger that opens the Blog `nolan-menu` panel.

Work must be a direct link to `/work/`.

The primary navigation must remain readable, balanced, and visually calm.

The desktop CTA text must be `Contact Us`.

The desktop CTA URL must be `/contact/`.

The CTA must use the `.btn` and `.btn-header-cta` classes. It should be the strongest action in the header without overpowering the logo or navigation.

The same Contact Us CTA must appear as a full-width action in the mobile drawer.

### Navigation Panel Content Requirements

#### Services `nolan-menu` Panel

The Services panel must use these six left-rail labels:

```text
Strategy & Consulting
Custom Solutions
Implementation
Integrations
Optimization
Ongoing Support
```

Each Services rail item must control a corresponding right-side content section.

Every right-side Services section must include a local visual asset, premium title, concise editorial description, three to five useful service details, and a link to the corresponding service page.

#### About `nolan-menu` Panel

The About panel must use these three left-rail labels:

```text
Our Story
Our Approach
Our Team
```

Each About rail item must control a corresponding right-side content section.

Every right-side About section must include a local visual asset, headline, concise supporting copy, a short values or feature group, and a CTA linking to the relevant About page section.

#### Blog `nolan-menu` Panel

The Blog panel must use a grid containing at least four blog cards.

Each card must include a local visual asset, category or tag, title, excerpt, and link to its corresponding blog post.

The cards must feel editorial, useful, and relevant to the business and its audience. Do not use generic filler posts.

The Blog panel must not use the left-rail interaction.

### Dropdown/Navigation Panel Requirements and Behavior

The dropdown panels must never be transparent. Every panel must use a solid, readable background with a stable z-index above all normal page content.

The sticky header must transition into a scrolled variant after the user scrolls down the page.

In the default state, the header should use slightly taller vertical padding to create a more open and airy appearance.

In the scrolled state, the header should use slightly tighter vertical padding, a solid warm background, and a crisp border.

The transition between default and scrolled states must not cause layout shift.

Each dropdown panel must remain correctly positioned beneath the header in both states.

The Services, About, and Blog buttons in the primary navigation control the opening and closing of their corresponding `nolan-menu` panels.

Clicking an inactive Services, About, or Blog trigger must open its corresponding dropdown panel.

Clicking the currently active trigger must close its open dropdown panel.

Clicking a different trigger while another panel is open must close the current panel and open the newly selected panel.

Only one top-level dropdown panel may be open at a time.

Clicking outside the open panel must close it.

Pressing Escape must close the open panel.

When a panel is open, a full-page backdrop must appear and body scrolling must be locked.

Body scrolling must be restored when the panel closes.

Each top-level dropdown panel may use a dynamic height based on its content. Within an open Services or About panel, the right-side content area must maintain a stable minimum height so rail changes do not cause distracting layout jumps.

The Services and About panels must use a two-column layout consisting of a left rail of category buttons and a right-side area containing corresponding content sections.

After the Services or About panel is open, hovering over a left-rail item must update the corresponding content shown on the right.

Keyboard-focusing a left-rail item through Tab navigation must also update the corresponding right-side content.

Hovering over or focusing a rail item controls only the content inside the already-open panel. It must not open or close the top-level panel.

Only one right-side content section may be visible at a time.

The rail hover and keyboard-focus interaction is a required signature feature of the Services and About panels.

The Blog panel must open and close through its primary navigation trigger, but its internal content must use the required blog-card grid.

The `aria-expanded` value of every primary navigation trigger must update accurately.

Use `aria-controls` to associate each trigger with its panel.

Closed panels must be hidden visually and from assistive technology.

All interactive controls must include strong `:focus-visible` states.

The dropdown system must not create keyboard traps.

### Required Data Attributes

Use the following relationships exactly:

```html
<button data-menu-item="services" aria-controls="services-menu">
<div id="services-menu" data-menu-dropdown="services">

<button data-menu-item="about" aria-controls="about-menu">
<div id="about-menu" data-menu-dropdown="about">

<button data-menu-item="blog" aria-controls="blog-menu">
<div id="blog-menu" data-menu-dropdown="blog">
```

Inside the Services and About panels, use real button elements for the rail controls:

```html
<button data-rail-item="<key>">
<section data-rail-content="<key>">
```

The key on each rail button must match the key on its corresponding content section.

### Mobile Header

Create a dedicated mobile drawer rather than stacking the desktop navigation panels into the page.

The mobile header must place the logo on the left and the hamburger button on the right.

The drawer must include an accessible open button, dedicated close button, solid background, backdrop, backdrop-click closing, outside-click closing, Escape-key closing, accurate `aria-expanded` state management, body-scroll locking, and a full-width Contact Us CTA linking to `/contact/`.

The drawer must not create horizontal overflow or keyboard traps.

The mobile experience must be as polished and intentional as the desktop header.

### Mobile Accordions

Use mobile navigation accordions for Services, About, and Blog.

Use direct mobile links for Work and Contact Us.

The About accordion must include a real link to the generated About page.

The Blog accordion must include a real link to the Blog archive.

Closed accordion panels must be hidden visually and from assistive technology.

Links inside closed accordions must not remain reachable through keyboard navigation.

## 08. Footer

Create a polished, full-width footer that feels intentional, premium, and visually consistent with the overall business design system.

The footer must include a large CTA band, brand statement, Services column, Company column, Blog column, Contact block, and bottom legal row.

The complete footer must use strong spacing, clear visual hierarchy, readable typography, and a fully responsive layout.

### CTA Band

Place a large CTA band at the top of the footer.

The band must include a strong business-focused headline, concise supporting copy, a primary Contact Us CTA, and an optional secondary link to the Work page.

The CTA band must feel visually distinct from the main footer without appearing disconnected from the site.

Use generous spacing, clear contrast, and responsive alignment.

### Brand Statement

Include the business logo or wordmark and a concise brand statement.

The brand statement should explain the company’s purpose and approach without inventing awards, years of experience, client counts, locations, or other facts that were not supplied.

The footer logo must link to `/`.

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

### Contact Block

Create a dedicated Contact block using only contact information supplied in the project requirements or configured in WordPress.

Email addresses must use `mailto:` links.

Phone numbers must use `tel:` links.

The contact-page link must point to `/contact/`.

When an address, phone number, or email address has not been supplied, omit that detail rather than inventing it.

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

Create and fully implement the following template parts:

```text
template-parts/
├── content-page.php
├── content-single.php
├── content-none.php
├── content-policy.php
├── content-search.php
├── content-hero.php
├── content-brand-statement.php
├── content-featured-work.php
├── content-all-services.php
├── content-single-service-highlight.php
├── content-process.php
├── content-style-pillars.php
├── content-testimonials.php
├── content-blog-preview.php
├── content-cta-banner.php
├── content-footer-widgets.php
├── content-showcase.php
├── content-featured-case-study.php
├── content-methodology.php
├── content-packages.php
├── content-business-solutions.php
├── content-client-experience.php
└── content-faq.php
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
| `content-featured-work.php` | Featured work or project preview |
| `content-all-services.php` | Primary service overview |
| `content-single-service-highlight.php` | Featured service presentation |
| `content-process.php` | Step-by-step company process |
| `content-style-pillars.php` | Brand, service, or experience pillars |
| `content-testimonials.php` | Supplied testimonial content or a non-testimonial proof fallback |
| `content-blog-preview.php` | Recent or featured articles |
| `content-cta-banner.php` | Reusable contact or conversion CTA |
| `content-footer-widgets.php` | Footer column content |
| `content-showcase.php` | Filterable work, solution, or resource showcase |
| `content-featured-case-study.php` | Detailed project or client case study |
| `content-methodology.php` | Approach, methodology, or process visualization |
| `content-packages.php` | Service packages or engagement options |
| `content-business-solutions.php` | Business-focused solution feature |
| `content-client-experience.php` | Customer experience or service-delivery feature |
| `content-faq.php` | Accessible FAQ accordion |

Every template part must be reusable, escaped correctly, responsive, and free from duplicated page-level markup.

## 12. page-templates to fill in/build out

Create the page templates in this order:

```text
page-templates/
├── template-homepage.php
├── template-services.php
├── template-single-service.php
├── template-about-us.php
├── template-work.php
├── template-blog.php
├── template-contact.php
└── template-policy.php
```

Every template must include a valid WordPress `Template Name` header where applicable.

### template-homepage.php

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

#### Homepage Section 06: Featured Showcase

Create a local masonry or editorial showcase with a vanilla-JavaScript filter.

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

#### Homepage Section 08: Methodology or Process Visualization

Use an accessible comparison, timeline, process map, or before-and-after business-results presentation.

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

When testimonials are unavailable, present a non-testimonial proof section using the documented process, work examples, supplied metrics, service guarantees that were actually provided, or neutral experience highlights.

#### Homepage Section 13: Blog Preview

Show at least four useful articles, guides, or resources with real generated destinations.

#### Homepage Section 14: FAQ

Include at least seven useful questions about services, process, timelines, communication, project requirements, support, and getting started.

Use an accessible accordion.

Closed answers must not remain exposed to assistive technology or keyboard focus.

#### Homepage Section 15: Final CTA

Use strong conversion-focused copy, a primary Contact Us CTA, and a secondary link to the Work page.

### template-services.php

Create a complete Services page with a strong hero, six primary service cards, process overview, service comparison guidance, featured work, FAQ, and final Contact Us CTA.

Every service card must link to a real service-detail destination.

### template-single-service.php

Create a reusable service-detail template with a service hero, detailed overview, ideal-customer guidance, deliverables, process, supporting visual content, package or inquiry guidance, related services, FAQ, and the Single Service form.

The form must automatically identify the service being viewed.

### template-about-us.php

Create a complete About page with the company story, purpose, approach, values, team or company information, work experience, supporting visual media, and a final Contact Us CTA.

Do not invent founder biographies, awards, locations, certifications, or history that were not supplied.

### template-work.php

Create a content-forward Work page with project categories, accessible filtering, project or case-study cards, featured results, and direct links to relevant services.

### template-blog.php

Create a Blog archive page with a featured article, category navigation, article cards, excerpts, pagination, and search access.

Use real generated posts and destinations.

### template-contact.php

Create a complete Contact page with clear inquiry guidance, expected-response information that does not make unsupported promises, the Contact form, and any real supplied contact details.

### template-policy.php

Create a readable policy-page layout that renders WordPress-managed policy content.

Do not generate legal promises, guarantees, privacy claims, cookie claims, or terms that were not supplied or reviewed.

## 13. Images

Use real, relevant visual media rather than filler graphics or empty placeholders.

Use only public-domain, CC0, or properly licensed assets that permit the intended use.

Do not describe an asset as copyright-free unless its license actually supports that claim.

Download permitted assets into the theme and store them in appropriate local folders such as:

```text
assets/images/
assets/images/hero/
assets/images/services/
assets/images/work/
assets/images/blog/
assets/images/icons/
assets/images/svg/
```

Do not hotlink runtime assets from third-party websites.

Record the source URL, creator when required, license, and download date for every third-party asset in `README.md`.

Optimize raster assets for web delivery and provide responsive sizes where appropriate.

Use WebP or another modern optimized format when practical while preserving compatible fallbacks where needed.

Use descriptive filenames rather than generic names such as `image1.jpg`.

Every meaningful visual asset must have appropriate alternative text.

Decorative assets must use empty alternative text.

Use SVG where it improves icons, marks, diagrams, or interface graphics. Store SVG files locally and sanitize them before use.

Do not copy third-party logos, branding, screenshots, protected media, or proprietary visual material without appropriate permission.

## 14. README REQUIREMENTS

Create a complete `README.md`.

### Theme Overview

Describe the theme’s purpose, business focus, primary features, and intended WordPress use.

### Folder Structure

Document the source folders, compiled asset folders, template parts, page templates, administrative modules, image folders, and static preview.

### Installation

Explain how to install and activate the theme, assign the homepage, configure menus, set the logo, and prepare required pages.

### Build Requirements

Document the supported Node.js version, dependency installation, `npm run dev`, `npm run build`, source entry points, and compiled output paths.

### Features

Document the header panels, mobile drawer, portfolio filtering, forms, newsletter management, responsive layouts, accessibility behavior, and footer structure.

### Page Templates

Describe every page template and how it should be assigned.

### Header Behavior

Document the primary navigation click behavior, internal rail hover and focus behavior, sticky state, body-scroll locking, backdrop, ARIA state management, and mobile accordion behavior.

### Static Preview Notes

Explain how to open and review `docs/index.html`, which interactions are represented, and any WordPress-only behavior that cannot operate in the static preview.

### Accessibility Notes

Document keyboard operation, focus management, reduced motion, contrast, semantic landmarks, form validation, accordions, content filtering, and hidden-content behavior.

### Images and Licensing

List every third-party image source and license.

### Forms and Newsletter

Explain where submissions and subscribers appear in WordPress, which capabilities are required, how exports work, how notifications work, and how unsubscribe status is managed.

### Known Limitations

Document any intentional limitations without disguising incomplete functionality as finished work.


## 15. Definition of done...

### Validation Checklist

Before finishing, verify every requirement in this table.

| Area | Completion Requirement |
|---|---|
| Theme foundation | The theme contains the required WordPress files and activates without fatal errors |
| Theme header | `style.css` contains a valid WordPress theme header and a correct text domain |
| Build system | `npm run dev` and `npm run build` complete successfully |
| Compiled CSS | `assets/css/theme.css` exists, is non-trivial, and is enqueued by WordPress |
| Compiled JavaScript | `assets/js/theme.js` exists, is non-trivial, and is enqueued by WordPress |
| Images | `assets/images/` exists, contains required local assets, and has documented licenses |
| Header layout | Desktop header uses logo, centered primary navigation, and Contact Us CTA |
| Header panels | Services, About, and Blog panels open and close correctly |
| Header rail interaction | Services and About rail hover and keyboard focus update only the internal right-side content |
| Blog panel | Blog uses a blog-card grid and does not use the rail interaction |
| Header accessibility | ARIA state, focus-visible styling, Escape closing, outside-click closing, backdrop, and scroll locking work correctly |
| Mobile header | Logo is left, hamburger is right, drawer opens and closes, and the background remains solid |
| Mobile accordions | Services, About, and Blog accordions are keyboard accessible and hide closed links from focus |
| Navigation | Every desktop, mobile, footer, service, blog, and CTA link points to a real destination |
| Footer | Booking CTA, brand statement, Services, Company, Blog, Contact, and legal areas are complete |
| Forms | Contact and Single Service forms validate, store, notify, display in wp-admin, and export correctly |
| Newsletter | Signup, duplicate prevention, status tracking, secure unsubscribe, administration, and export work correctly |
| Homepage | All fifteen homepage sections are complete and responsive |
| Page templates | Every required page template exists and renders without errors |
| Template parts | Every required template part exists and is used appropriately |
| Static preview | `docs/index.html` exists, loads local assets, and represents the completed visual system |
| Responsive behavior | No page creates unintended horizontal overflow |
| Accessibility | Keyboard navigation, focus states, reduced motion, semantic markup, contrast, and hidden-content behavior are verified |
| PHP quality | Every PHP file passes PHP lint |
| JavaScript quality | Browser testing shows no JavaScript console errors |
| Security | Nonces, capability checks, sanitization, validation, and context-appropriate escaping are present |
| Secrets | No API keys, credentials, tokens, private keys, or local absolute paths are committed |
| External dependencies | No external runtime CDN assets are required |
| Originality | No copied third-party branding, text, protected images, or direct site recreation is included |
| Scope safety | The generated theme does not modify files outside its allowed theme folder |

### Basic WordPress Theme Checks

Confirm that the theme includes the basic WordPress files it requires.

Confirm that every PHP file passes PHP lint.

Confirm that `style.css` contains a valid WordPress theme header.

Confirm that `functions.php` loads without warnings or fatal errors.

Confirm that all asset paths are valid and case-correct.

Confirm that required includes and template parts exist.

Confirm that no hardcoded absolute local-machine paths remain.

Confirm that no API keys, credentials, secrets, or environment-specific tokens were committed.

Confirm that the theme folder is self-contained.

Confirm that the theme does not require external CDN assets at runtime.

Confirm that the generated theme did not modify files outside its allowed folder.

Confirm that every required feature is implemented rather than represented only by static markup.

Confirm that the finished theme is suitable for installation, review, testing, and future maintenance.
