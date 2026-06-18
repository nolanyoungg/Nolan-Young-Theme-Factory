# 01. Business Identity 

## Business Name
  -

## Business Logo
  -

## Business Solgan
  -

## Business Field
  -


# 02  Style / CSS Requirements ===================================================================================================================================================================


Organize the theme like a serious, modern WordPress product theme, not a quick demo. The structure should feel similar in discipline to a polished premium theme or modern SaaS build: predictable folders, reusable template parts, consistent CSS architecture, and no one-off styling scattered everywhere.

## Button classes:

- .btn
- .btn-primary
- .btn-secondary
- .btn-header-cta
- .btn-smball
- .btn-full
- .btn-text



## CONTENT REQUIREMENTS

Write complete original content.

Do not use:
- Lorem ipsum
- Placeholder paragraphs
- Copied third-party text
- Fake legal claims
- Fake client names that imply real endorsements


# 03. Functionality ==============================================================================================================================================================================

## Webpack Build Requirements

    Create the following Webpack configuration file:
    
    build/webpack.config.js
    
    The Webpack configuration must compile:
    
    src/js/main.js
    
    into:
    
    assets/js/bundle.js
    
    It must also compile:
    
    src/scss/main.scss
    
    into:
    
    assets/css/bundle.css
    
    Create a valid package.json containing working development and production commands:
    
    npm run dev
    npm run build
    
    The npm run dev command should compile JavaScript and SCSS, 
    generate source maps where appropriate, 
    produce development-friendly output, 
    report compilation errors clearly, 
    and support active development or watch mode.
    
    The npm run build command should compile JavaScript and SCSS, 
    minify production assets, 
    produce the exact files enqueued by WordPress, 
    avoid unnecessary development output, 
    and exit with an error when compilation fails.
    
    The build system must use valid paths, 
    include all required dependencies, 
    avoid references to missing files or loaders, 
    produce deterministic output, 
    avoid external CDN dependencies, 
    and keep source files separate from compiled files.
    
    The theme may use theme.json for WordPress design settings, editor settings, spacing, colors, 
    typography, and layout support. Build commands belong in package.json, not theme.json.


  ##  WORDPRESS SECURITY REQUIREMENTS

    Use proper WordPress functions and escaping, including where appropriate:
    
    esc_html()
    esc_attr()
    esc_url()
    wp_kses_post()
    the_permalink()
    the_title_attribute()
    body_class()
    post_class()
    wp_head()
    wp_footer()
    language_attributes()


# 04. Color System ===============================================================================================================================================================================

## main colors
    Main Background Color
    #ffffff
    Secondary Background Color
    #f4f7fb
    Dark Background Color
    #101827
    Primary Brand Color
    #2563eb
    Secondary Brand Color
    #14b8a6
    Accent Color
    #f97316
    Primary Text Color
    #111827
    Muted Text Color
    #64748b
    Border and Divider Color
    #e2e8f0
    Primary Button Colors
    
    The primary button background should be #2563eb, and its text should be #ffffff.
    
    On hover, the background should become #1d4ed8, while the text remains #ffffff.
    
    Secondary Button Colors
    
    The secondary button background should be #ffffff, its text should be #111827, and its border should be #cbd5e1.
    
    On hover, the background should become #f4f7fb, while the text remains #111827.
    
    Additional Color Rules
    
    Use dark navy sections sparingly for technical proof, system diagrams, metrics, case-study results, and final CTA areas.
    
    Use teal accents for successful workflows, connected systems, completed automation steps, positive results, and integration states.
    
    Use orange only for small highlights, alerts, priority indicators, or high-priority CTA accents.
    
    Do not allow accent colors to reduce readability or violate contrast requirements.
    
    Maintain consistent colors across buttons, cards, forms, links, icons, navigation, focus indicators, validation states, CTA sections, dashboard visuals, and system diagrams.
  



# 05. Visual Design Direction ====================================================================================================================================================================


# 06. Typography Direction =======================================================================================================================================================================

## Heading Style
    [FILL IN HEADING STYLE HERE] - Clean SaaS-style headings

### Body Text Style

    [FILL IN BODY TEXT STYLE HERE] - Highly readable modern sans-serif

    Use safe local/system font stacks. Do not depend on external Fonts if we will need to update or have any maintence. Font should be stress free.

# 07. Header ==================================================================================================================================================================================

## Header Layout
  
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


## Navigation Panel Content Requirements
  
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


## Dropdown/navigation panel requirements & behavior:
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

 ## Required data attributes:
    - button[data-menu-item="services"] controls div[data-menu-dropdown="services"]
    - button[data-menu-item="about"] controls div[data-menu-dropdown="about"]
    - button[data-menu-item="blog"] controls div[data-menu-dropdown="blog"]

## Inside the Services and About panels:
    - left rail buttons: button[data-rail-item="<key>"]
    - right sections: section[data-rail-content="<key>"]
    - Only one corresponding right-side section may be visible at a time.



## Mobile Header

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



## 08. Footer  ==================================================================================================================================================================================

Create a polished, full-width footer that feels intentional, premium, and visually consistent with the rest of the website.

The footer must include a large booking CTA band, brand statement, Services column, Company column, Blog column, Contact block, and bottom legal row.

The complete footer must use strong spacing, clear visual hierarchy, readable typography, and a fully responsive layout.

  Services Column
  
  Create a Services column containing links to the primary service pages generated for the website.
  
  The Services heading must be visually distinct from the links below it.
  
  Each service link must point to a real generated destination.
  
  Do not include placeholder links or links to pages that do not exist.
  
  Company Column
  
  Create a Company column containing links to the primary company-related pages.
  
  This section should provide clear access to important pages such as About, Work, Contact, or other relevant company destinations generated for the website.
  
  Each link must point to its real generated page destination.
  
  Blog Column
  
  Create a Blog column that provides access to the Blog archive and relevant blog content.
  The Blog heading should clearly identify the section.
  Blog links must point to real generated blog destinations.
  The column may include the main Blog archive link and selected recent or featured posts when those posts are available.
  Do not use generic filler links.
  
  Contact Block
  
  Create a dedicated Contact block containing the company’s available contact information.
  The Contact block should support the primary contact action and make it easy for users to reach the company.
  Any displayed email address, phone number, business location, or contact-page link must use the real information supplied elsewhere in the website requirements.
  Contact details should be interactive where appropriate.
  
  Email addresses should use mailto: links.
  Phone numbers should use tel: links.
  The Contact block should remain readable and accessible on smaller screens.
  Footer Navigation and Link Behavior
  All footer links must use clear and descriptive labels.
  Links must include strong hover and :focus-visible states.
  
  External links must be handled appropriately and should clearly behave as external destinations when applicable.
  
  The footer must not contain broken links, placeholder destinations, or links to pages that were not generated.
  
  Bottom Legal Row
  
  Create a bottom legal row beneath the main footer content.
  
  The legal row should include the copyright notice and links to any generated legal pages.
  
  The current year should be generated dynamically rather than written as a fixed value.
  
  The bottom row should be visually separated from the main footer using spacing, a border, or another subtle design treatment.
  
  Legal links must remain readable and accessible across all screen sizes.
  
  Responsive Footer Behavior
  
  The footer must be fully responsive.
  
  On desktop, the footer should use a balanced multi-column layout.
  
  On tablet, the columns may reorganize into fewer columns while maintaining clear spacing and hierarchy.
  
  On mobile, the footer content should stack into a clean single-column layout.
  
  The booking CTA, navigation columns, contact information, and legal row must remain readable and easy to interact with on smaller screens.
  
  The responsive layout must not create horizontal overflow.
  
  Accessibility and Visual Quality
  
  The footer must use semantic footer markup and appropriate navigation landmarks.
  
  Text and links must maintain sufficient contrast against the footer background.
  
  All interactive elements must support keyboard navigation.
  
  Visible focus states must be clear and consistent.
  
  The footer should use generous spacing, polished typography, consistent alignment, and restrained decorative styling.
  
  The final design must feel complete and intentional rather than like a basic collection of footer links.

## 09. Forms ==================================================================================================================================================================================

  ### Required Forms

  -Contact - feilds: name,email, phone, comment box
  -Single-Service - Feilds: name,email, phone, comment box

  ### Require Form Functionaily

  forms must become viewable in wp-admin bar called ""forms"", when logged into the back end, when you click that admin bar you should be able to see the differnt forms and there responses.
  must also be able to export these forms via csv and in an email to the wp-admin / site owners email. must be able to select all forms, a single forms, more than one form etc. 

## 10 Newsletter =================================================================================================================================================================================

  ### Required NewsLetter

  Marketying email list

  ### Required Newsletter Functionaily 
  Simialr to the forms, we must be able to become a admin in our wp-admin panel in the back end called "Newsletter" in there should be the list of user thats signed up for the newsletter. it m
  must also keep track of who has signed up, the status is they are still signed up and have not un subcribed. 

  should also be able to export this list via csv email to wp-admin / site owner


# 11. template-parts to fill in/build out ========================================================================================================================================================

template-parts/
  ## content-page.php
      ### 
      smsmkfme
      fefe
      ffefe
  
  ## content-single.php
  
  ## content-none.php
  
  ## content-policy.php
  
  ## content-search.php  
  
  ## content-hero.php
  
  ## content-brand-statement.php
  
  ## content-featured-work.php
  
  ## content-all-services.php
  
  ## content-single-service-highlight.php
  
  ## content-process.php
  
  ## content-style-pillars.php
  
  ## content-testimonials.php
  
  ## content-blog-preview.php
  
  ## content-cta-banner.php
  
  ## content-footer-widgets.php



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

Build a complete, finished photography homepage with fifteen polished sections.

#### Homepage Section 01: Fullscreen Photographic Hero

Use a large local hero image, cinematic headline, supporting copy, two CTAs, a compact trust or service-summary row, and a restrained editorial overlay.

#### Homepage Section 02: Featured Work Strip

Create a horizontal image-forward portfolio preview using local images and links to the Work page.

#### Homepage Section 03: Brand Statement

Present the studio philosophy through strong editorial typography and a portrait or studio image pairing.

#### Homepage Section 04: Services Overview

Present at least six photography service cards using appropriate local images and clear links to the corresponding service pages.

#### Homepage Section 05: Signature Experience

Explain the complete client experience from inquiry and planning through the session, editing, and gallery delivery.

#### Homepage Section 06: Featured Gallery

Create a local masonry or editorial image grid with a vanilla-JavaScript filter.

Use these categories:

```text
Portraits
Weddings
Brand
Product
Family
Events
```

The filter must support mouse, touch, and keyboard interaction.

#### Homepage Section 07: Featured Story

Present one detailed photography story or case study using large images, an editorial narrative, a pull quote only when supplied, and clear experience or outcome details.

#### Homepage Section 08: Editing Style

Use a photography-specific before-and-after control or editing-process visual.

The control must be accessible and usable without requiring precise pointer movement.

#### Homepage Section 09: Packages and Session Options

Create three polished package cards representing Portrait, Brand, and Wedding or Event options.

Do not invent prices when pricing was not supplied.

#### Homepage Section 10: Product and Brand Photography

Use local product or business imagery with practical business-focused content.

#### Homepage Section 11: Wedding and Engagement Photography

Use local couple or event imagery with emotionally engaging but professional content.

#### Homepage Section 12: Testimonials and Proof

Use real testimonial content only when it was supplied.

Do not invent client names, quotations, ratings, companies, or endorsements.

When testimonials are unavailable, present a non-testimonial proof section using the documented process, portfolio breadth, service guarantees that were actually supplied, or neutral experience highlights.

#### Homepage Section 13: Blog Preview

Show at least four helpful photography planning guides with real generated destinations.

#### Homepage Section 14: FAQ

Include at least seven useful booking and session questions in an accessible accordion.

Closed answers must not remain exposed to assistive technology or keyboard focus.

#### Homepage Section 15: Final Booking CTA

Use strong conversion-focused copy, a primary Contact Us CTA, and a secondary link to the Work page.

### template-services.php

Create a complete Services page with a strong hero, six primary service cards, photography process overview, service comparison guidance, featured work, FAQ, and final Contact Us CTA.

Every service card must link to a real service-detail destination.

### template-single-service.php

Create a reusable service-detail template with a service hero, detailed overview, ideal-client guidance, deliverables, process, image gallery, package or inquiry guidance, related services, FAQ, and the Single Service form.

The form must automatically identify the service being viewed.

### template-about-us.php

Create a complete About page with the studio story, photography philosophy, approach, values, working experience, studio or behind-the-scenes imagery, and a final Contact Us CTA.

Do not invent founder biographies, awards, locations, or history that were not supplied.

### template-work.php

Create an image-forward Work page with portfolio categories, accessible filtering, project or gallery cards, featured stories, and direct links to relevant services.

### template-blog.php

Create a Blog archive page with a featured article, category navigation, article cards, excerpts, pagination, and search access.

Use real generated posts and destinations.

### template-contact.php

Create a complete Contact page with clear inquiry guidance, expected response information that does not make unsupported promises, the Contact form, and any real supplied contact details.

### template-policy.php

Create a readable policy-page layout that renders WordPress-managed policy content.

Do not generate legal promises, guarantees, privacy claims, cookie claims, or terms that were not supplied or reviewed.



## 13. Images

Use real photography rather than filler graphics or empty placeholders.

Use only public-domain, CC0, or properly licensed assets that permit the intended use.

Do not describe an image as copyright-free unless its license actually supports that claim.

Download permitted images into the theme and store them in an appropriate local folder such as:

```text
assets/images/
assets/images/hero/
assets/images/services/
assets/images/portfolio/
assets/images/blog/
assets/images/icons/
assets/images/svg/
```

Do not hotlink runtime images from third-party websites.

Record the source URL, creator when required, license, and download date for every third-party image in `README.md`.

Optimize raster images for web delivery and provide responsive image sizes where appropriate.

Use WebP or modern optimized formats when practical while preserving compatible fallbacks where needed.

Use descriptive filenames rather than generic names such as `image1.jpg`.

Every meaningful image must have appropriate alternative text.

Decorative images must use empty alternative text.

Use SVG where it improves icons, marks, or interface graphics. Store SVG files locally and sanitize them before use.

Do not copy third-party logos, branding, screenshots, portfolio work, or protected photography without appropriate permission.



## 14. README REQUIREMENTS

  Create a complete `README.md`.
    
  ### Theme Overview
    
        Describe the theme’s purpose, photography focus, primary features, and intended WordPress use.
    
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
    
        Document keyboard operation, focus management, reduced motion, contrast, semantic landmarks, form validation, accordions, gallery filtering, and hidden-content behavior.
    
  ### Images and Licensing
    
        List every third-party image source and license.
    
  ### Forms and Newsletter
    
        Explain where submissions and subscribers appear in WordPress, which capabilities are required, how exports work, how notifications work, and how unsubscribe status is managed.
    
  ### Known Limitations
    
        Document any intentional limitations without disguising incomplete functionality as finished work.


## 15. Definition of done

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
