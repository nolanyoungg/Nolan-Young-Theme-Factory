## 01. Business Identity

### Business Name

For this theme, use `Brightlane Commerce Engineering`.

### Business Logo

Create an original local SVG interface mark only for the logo and hamburger/menu details. The mark should feel like a clean lane/route symbol combined with a code cursor. Do not use the WordPress, Shopify, WooCommerce, or third-party brand logos.

### Business Slogan

Senior WordPress and Shopify engineering for stores, service brands, and growth teams that need the site to work harder.

### Business Field

Brightlane Commerce Engineering is a senior web development agency focused on custom WordPress themes, Shopify storefronts, WooCommerce and Shopify migration planning, conversion-focused homepage systems, performance repair, accessibility improvements, analytics instrumentation, CRM/email/platform integrations, and retained launch-support sprints.

## 02. Style / CSS Requirements

Work entirely within the existing theme structure and SCSS framework. The theme skeleton, folder organization, design tokens, reusable components, page partials, and build system are already established and must be used as provided.

Add all styling to the appropriate existing SCSS files. For example, homepage-specific styling belongs in _homepage.scss, while reusable elements should be styled within their corresponding component partials.

Do not place <style> blocks inside PHP files. Do not scatter CSS declarations throughout templates. Do not use inline styles unless a value must be generated dynamically and cannot reasonably be handled through the existing classes or CSS custom properties.

Do not create a new styling architecture, reorganize the existing SCSS structure, or manually modify compiled CSS files. Fill in and extend the existing stylesheets while preserving the established framework.


### Theme ID

```text
/*
Author: Nolan Young
Author URI: https://shibey.com
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 8.0
License: GNU General Public License v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Tags: custom-logo, custom-menu, featured-images, threaded-comments, translation-ready, blog, portfolio, one-column, two-columns
*/

```


  
### CSS Architecture

Use mobile-first responsive styles or add styles specifcally for mobile to optimze the look. 

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

Every button variation must support default, hover, focus-visible, active, and disabled states.

Buttons must maintain adequate contrast, readable labels, consistent padding, and a minimum usable touch target.

### Content Requirements

Write complete, original, business-specific content throughout the theme.

Do not use Lorem ipsum, placeholder paragraphs, copied third-party text, fake legal claims, or statements that imply real endorsements when none were supplied.

### Accessibility

All interactive states must include visible keyboard focus styling.

Color should not be the only method used to communicate state, validation, selection, success, or failure.


## 03. Functionality

### Webpack Build Requirements

The Webpack configuration is at this exact path:

```text
build/webpack.config.js
```

The Webpack configuration compiles:

```text
src/js/main.js
```

into:

```text
assets/js/bundle.js
```

The Webpack configuration compiles:

```text
src/scss/main.scss
```

into:

```text
assets/css/bundle.css
```

The generated filenames must be exactly `bundle.js` and `bundle.css`.

Do not generate or enqueue `theme.js`, `theme.css`, `main.js`, `main.css`, or alternate production bundle names.

Ensure of a valid `package.json` and committed `package-lock.json`.

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

The theme may use `theme.json` for WordPress editor settings, design tokens, colors, spacing, typography, and layout support. Build commands belong in `package.json`, not `theme.json`.

### WordPress Asset Enqueue Requirements

Place all enqueue logic in:

```text
inc/enqueue.php
```

That loads file from `functions.php`.

WordPress must enqueue these exact compiled files:

```text
assets/css/bundle.css
assets/js/bundle.js
```

Use `get_theme_file_uri()` or another appropriate WordPress theme-path function.

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

Use the following palette consistently throughout the theme, and also add to it where you feel the need to.

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

Avoid a generic template appearance, crowded layouts, inconsistent component styling.

The visual system must support services, company information, case studies, resources, process explanations, proof, and conversion sections without making the site feel fragmented.

Use asymmetrical editorial layouts where appropriate, but maintain predictable reading order and accessible responsive behavior.

Cards should use consistent spacing, image treatment, border styling, and hover behavior.

Work, case-study, and resource sections should prioritize useful content while preserving readable summaries, categories, metadata, and links.

The site must feel complete at every breakpoint. Mobile layouts must be intentionally designed rather than appearing as compressed desktop layouts.

Every page must use a consistent relationship between visual media, headings, supporting text, metadata, and CTAs.

## 06. Typography Direction

### Heading Style

Use clean, editorial headings with strong scale, controlled line breaks, and a premium professional character.

Headings should feel distinctive while remaining readable, restrained, and appropriate for a modern service-based business.

Use fluid sizing with `clamp()` where appropriate, ONLY WHERE appropriate!

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
      - WordPress Design
      - Custom Theme Development
      - WooCommerce
      - Website Redesign
      - Integrations & Automation
      - Website Care & Support
    
    - Right side per rail item MUST include:
      - Approved local image from the asset inventory, or an original local illustration when no approved photograph was supplied
      - Premium title
      - Short editorial description
      - 3 to 5 bullet details
    
    2) About `nolan-menu` panel
    - Left rail items:
      - Our Approach
      - What We Value
      - How We Work
    
    - Right side per rail item MUST include:
      - Approved local image from the asset inventory, or an original local illustration when no approved photograph was supplied
      - Headline
      - Values list or short feature list
      - CTA linking to about page
    
    3) Blog `nolan-menu` panel
    - Use a grid of at least 4 blog cards.
    - Each card must include an approved local image from the asset inventory, or an original local illustration when no approved photograph was supplied, plus tag, title, excerpt, and link to its corresponding blog post.
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
    
    <button data-menu-item="blog" aria-controls="blog-menu">
    <div id="blog-menu" data-menu-dropdown="blog">
   ```
    
    Inside the Services and About panels, use real button elements for the rail controls:
    
    ```html
    <button data-rail-item="<key>">
    <section data-rail-content="<key>">
    ```
    
    The key on each rail button must match the key on its corresponding content section.


#### Inside the Services and About panels:
    - left rail buttons: button[data-rail-item="<key>"]
    - right sections: section[data-rail-content="<key>"]
    - Only one corresponding right-side section may be visible at a time.



### Mobile Header

  #### Mobile nav requirements:
    - Dedicated mobile drawer (not a stacked desktop panel).
    - open button, close button, backdrop click close, Escape close, aria-expanded updates.
    - accordion sections for Services / About / Blog; Work + Contact are direct links.
    - solid readable background; no keyboard traps.
    - should be just as impressive as the desktop version
    - Hamburger open button - on right side of mobile header, logo is on the left!
    - Accessible drawer
    - Dedicated close button
    - Backdrop
    - Backdrop-click closing
    - Outside-click closing
    - Escape-key closing
    - Accurate aria-expanded
    - Body scroll locking
    - Solid readable drawer background
    - Full-width Contact Us CTA linking to /contact/
    - No horizontal overflow
    - No keyboard traps
    - Create a dedicated mobile drawer rather than stacking the desktop navigation markup into the page.
  

  


### Mobile Accordions

    Use mobile navigation accordions for:
    Services
    About Us
    Blog
    
    Use direct mobile links for:
    Work
    
    
    The mobile About and Blog navigation items must link to the real generated About page and Blog archive destinations.
    
    Closed mobile accordions must not contain hidden focusable links that remain reachable by keyboard.



## 08. Footer

Create a polished, full-width footer that feels intentional, premium, and visually consistent with the overall business design system.

The footer must include a large CTA band, brand statement, Services column, Company column, Blog column, Contact block, and bottom legal row.

The complete footer must use strong spacing, clear visual hierarchy, readable typography, and a fully responsive layout.

### Services Column

Create a Services column containing list of links to the generated service pages.

The column should include the primary services represented elsewhere in the theme.

Every service link must point to a real generated destination.

Do not include placeholder links or links to pages that do not exist.

### Company Column

Create a Company column containing list of links to important company pages such as About, Work, Blog, and Contact.

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

Each of these template-.... .php files will simply just call template parts we have made above like so: 

```php
<?php
/**
 * Template Name: About Us
 * Template Post Type: page
 *
 * Page template for the /about/ page.
 *
 * This template is intentionally built from focused template parts.
 *
 * @package Nolan_Young_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="primary" class="site-main nolan-about-page">
	<div class="nolan-about-page__inner">
		<?php get_template_part( 'template-parts/content', 'brand-statement' ); ?>
		<?php get_template_part( 'template-parts/content', 'process' ); ?>
		<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
		<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
	</div>
</main>

<?php
get_footer();

```




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

Pre-approved local assets are supplied through the asset inventory at `assets/images/asset-manifest.json`. Select only from that inventory for third-party photos or raster media. Do not invent photo provenance, creators, source URLs, licenses, or download dates.

Models may create original local SVG marks, icons, textures, and illustrations. Do not describe an illustration as a photograph. When no approved photograph exists, use an original local illustration or CSS presentation rather than fake licensing information.

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

Record only asset provenance that appears in the approved asset inventory. Documentation must not invent licensing details.

Optimize raster assets for web delivery and provide responsive sizes where appropriate.

Use WebP or another modern optimized format when practical while preserving compatible fallbacks where needed.

Use descriptive filenames rather than generic names such as `image1.jpg`.

Every meaningful visual asset must have appropriate alternative text.

Decorative assets must use empty alternative text.

Store SVG files locally and sanitize them before use.

Document icon conventions and permitted icon sources in `assets/icons/README.md`.

Do not copy third-party logos, branding, screenshots, protected media, or proprietary visual material without appropriate permission.

## 14. README REQUIREMENTS

Create a complete root `README.md`.

### Theme Overview

Describe the theme’s purpose, business focus, primary features, and intended WordPress use.

### Required Structure

Document the exact required theme structure and explain the responsibility of the root files, `inc/`, `assets/`, `src/`, `template-parts/`, `page-templates/`, `blocks/`, `build/`, `docs/`, and `accessibility/`.

### Installation

Explain how to install and activate the theme, assign the homepage, configure menus, set the logo, prepare required pages, and complete the initial setup.

### Build Requirements

Document the supported Node.js version, dependency installation, `npm run dev`, `npm run build`, source entry points, and exact compiled outputs:

```text
assets/css/bundle.css
assets/js/bundle.js
```

State clearly that the compiled files must use the required bundle names and must not be renamed.

### Features

Document the header panels, mobile drawer, work filtering, forms, newsletter management, responsive layouts, accessibility behavior, footer structure, and policy routing.

### Page Templates

Describe every page template and explain that the homepage is implemented through the root `front-page.php` file.

### Header Behavior

Document primary-navigation click behavior, internal rail hover and focus behavior, sticky-state behavior, body-scroll locking, backdrop behavior, ARIA state management, and mobile accordion behavior.

### Accessibility Notes

Summarize keyboard operation, focus management, reduced motion, contrast, semantic landmarks, form validation, accordions, content filtering, and hidden-content behavior.

Link to:

```text
accessibility/README.md
```

### Images and Licensing

List every third-party asset source and license.

Explain the purposes of `assets/images/hero/`, `assets/images/portfolio/`, `assets/images/texture/`, and `assets/icons/`.

### Forms and Newsletter

Explain where submissions and subscribers appear in WordPress, which capabilities are required, how exports work, how notifications work, and how unsubscribe status is managed.

### Supporting Documentation

Reference and maintain:

```text
docs/getting-started.md
docs/customization.md
assets/icons/README.md
blocks/README.md
accessibility/README.md
```

### Changelog and License

Maintain `CHANGELOG.md` with meaningful release entries.

Include the applicable project license in `LICENSE.txt`.

### Known Limitations

Document intentional limitations without disguising incomplete functionality as finished work.

## 15. Definition of done

### WordPress Theme Checks

Confirm that `assets/css/bundle.css` and `assets/js/bundle.js` are the required compiled production bundle names.

Confirm that every PHP file passes PHP lint.

Confirm that `style.css` contains a valid WordPress theme header.

Confirm that `functions.php` loads without warnings or fatal errors.

Confirm that all asset paths are valid and case-correct.

Confirm that every required include and template part exists.

Confirm that no hardcoded absolute local-machine paths remain.

Confirm that no API keys, credentials, secrets, or environment-specific tokens were committed.

Confirm that the theme folder is self-contained.

Confirm that the theme does not require external API keys ETC assets at runtime.


### Validation Checklist

Before finishing, verify every requirement in this table.
| Area | Completion Requirement |
|---|---|
| Theme foundation | The theme activates without warnings or fatal errors |
| Theme header | `style.css` contains a valid WordPress theme header and correct text domain |
| Bootstrap | `functions.php` loads the required modular files from `inc/` |
| Build configuration | `build/webpack.config.js` exists and uses the correct source and output paths |
| Package files | `package.json` and `package-lock.json` exist and are valid |
| Development build | `npm run dev` compiles successfully and supports watch mode |
| Production build | `npm run build` completes successfully and produces minified production assets |
| Compiled CSS | `assets/css/bundle.css` exists, is non-trivial, and is enqueued by WordPress |
| Compiled JavaScript | `assets/js/bundle.js` exists, is non-trivial, and is enqueued by WordPress |
| Forbidden bundle names | The theme does not depend on alternate production bundle names |
| Source separation | WordPress does not enqueue files directly from `src/` |
| Enqueue module | `inc/enqueue.php` loads the exact compiled bundle files |
| SCSS structure | Every required SCSS partial exists at the specified path and is included through `src/scss/main.scss` |
| JavaScript source | `src/js/main.js` contains the maintained source behavior |
| Root templates | Every required root template, including `front-page.php`, `403.php`, and `searchform.php`, exists |
| Homepage ownership | The homepage is implemented in `front-page.php` and not in an additional homepage page template |
| Inc modules | Every required file in `inc/` exists and contains its assigned responsibility |
| Template parts | Every required file in `template-parts/` exists and is used appropriately |
| Page templates | Every required file in `page-templates/` exists and includes a valid template header |
| Icons | `assets/icons/icon1.svg` and `assets/icons/README.md` exist |
| Images | `assets/images/hero/`, `assets/images/portfolio/`, and `assets/images/texture/` exist |
| Blocks documentation | `blocks/README.md` exists |
| Documentation | `docs/getting-started.md` and `docs/customization.md` exist and are accurate |
| Accessibility documentation | `accessibility/README.md` exists and matches the implemented interactions |
| Header layout | Desktop header uses logo, centered primary navigation, and Contact Us CTA |
| Header panels | Services, About, and Blog panels open and close correctly |
| Header rail interaction | Services and About rail hover and keyboard focus update only the internal right-side content |
| Blog panel | Blog uses a blog-card grid and does not use the rail interaction |
| Header accessibility | ARIA state, focus-visible styling, Escape closing, outside-click closing, backdrop, and scroll locking work correctly |
| Mobile header | Logo is left, hamburger is right, drawer opens and closes, and the background remains solid |
| Mobile accordions | Services, About, and Blog accordions are keyboard accessible and hide closed links from focus |
| Navigation | Every desktop, mobile, footer, service, blog, and CTA link points to a real destination |
| Footer | CTA band, brand statement, Services, Company, Blog, Contact, and legal areas are complete |
| Forms | Contact and Single Service forms validate, store, notify, display in wp-admin, and export correctly |
| Newsletter | Signup, duplicate prevention, status tracking, secure unsubscribe, administration, and export work correctly |
| Homepage | All fifteen homepage sections are complete and responsive |
| Responsive behavior | No page creates unintended horizontal overflow |
| Accessibility | Keyboard navigation, focus states, reduced motion, semantic markup, contrast, and hidden-content behavior are verified |
| PHP quality | Every PHP file passes PHP lint |
| JavaScript quality | Browser testing shows no JavaScript console errors |
| Security | Nonces, capability checks, sanitization, validation, and context-appropriate escaping are present |
| Secrets | No API keys, credentials, tokens, private keys, or local absolute paths are committed |
| Runtime dependencies | No external runtime CDN assets are required |
| Originality | No copied third-party branding, text, protected assets, or direct site recreation is included |
| Scope safety | The generated theme does not modify files outside its allowed theme folder |
| Documentation | `README.md`, `CHANGELOG.md`, `LICENSE.txt`, and all required supporting documentation are complete |
