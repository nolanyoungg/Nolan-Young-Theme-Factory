You are editing a prepared WordPress theme folder.

Target folder:
wp-content/themes/010_nolan_young_theme_premium_test010/

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

Batch focus:
Create reusable homepage and site sections that match the selected creative prompt, including the requested copy, services or offerings, proof, process, work examples, testimonials, FAQ-style content where appropriate, and CTAs. These files are fragments only; do not add get_header(), get_footer(), wp_head(), wp_footer(), <!doctype>, <html>, <head>, or <body> wrappers.

Return only file blocks in this exact format:

---FILE: relative/path.php---
line 1
line 2
---END FILE---

Required files for this batch:
- template-parts/content-hero.php
- template-parts/content-brand-statement.php
- template-parts/content-featured-work.php
- template-parts/content-all-services.php
- template-parts/content-single-service-highlight.php
- template-parts/content-process.php
- template-parts/content-style-pillars.php
- template-parts/content-testimonials.php
- template-parts/content-blog-preview.php
- template-parts/content-cta-banner.php
- template-parts/content-footer-widgets.php

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
