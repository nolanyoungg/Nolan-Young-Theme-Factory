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

#### Homepage Section 13: Blog Previ

[Section trimmed for focused local-model context. Deterministic validation still enforces the complete source prompt.]

Batch focus:
Create page templates and standard WordPress templates with unique page intent for about, services, individual services, work/case studies, resources, contact, policy, search, archive, and not-found states. Preserve deterministic fallback templates copied from the source template unless they are listed for this batch. These are full page templates, so keep their document wrapper logic in the theme root files, not in template-parts.

Return only file blocks in this exact format:

---FILE: relative/path.php---
line 1
line 2
---END FILE---

Required files for this batch:
- page-templates/template-about-us.php
- page-templates/template-services.php
- page-templates/template-single-service.php
- page-templates/template-work.php
- page-templates/template-blog.php
- page-templates/template-contact.php
- page-templates/template-policy.php
- page.php
- single.php
- archive.php
- search.php
- 404.php

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
