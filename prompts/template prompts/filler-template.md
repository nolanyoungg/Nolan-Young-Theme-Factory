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


# 02. Functionality ==============================================================================================================================================================================

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


# 07. Color System ===============================================================================================================================================================================

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
  



# 03. Visual Design Direction ====================================================================================================================================================================


# 08. Typography Direction =======================================================================================================================================================================

## Heading Style
    [FILL IN HEADING STYLE HERE] - Clean SaaS-style headings

### Body Text Style

    [FILL IN BODY TEXT STYLE HERE] - Highly readable modern sans-serif

    Use safe local/system font stacks. Do not depend on external Fonts if we will need to update or have any maintence. Font should be stress free.

# 04. Header ==================================================================================================================================================================================

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



## 05. Footer  ==================================================================================================================================================================================

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

## 9.5 Newsletter =================================================================================================================================================================================

  ### Required NewsLetter

  Marketying email list

  ### Required Newsletter Functionaily 
  Simialr to the forms, we must be able to become a admin in our wp-admin panel in the back end called "Newsletter" in there should be the list of user thats signed up for the newsletter. it m
  must also keep track of who has signed up, the status is they are still signed up and have not un subcribed. 

  should also be able to export this list via csv email to wp-admin / site owner


## 10. template-parts to fill in/build out ========================================================================================================================================================

template-parts/
### content-page.php

### content-single.php

### content-none.php

### content-policy.php

### content-search.php  

### content-hero.php

### content-brand-statement.php

### content-featured-work.php

### content-all-services.php

### content-single-service-highlight.php

### content-process.php

### content-style-pillars.php

### content-testimonials.php

### content-blog-preview.php

### content-cta-banner.php

### content-footer-widgets.php



## 11. page-templates to fill in/build out ========================================================================================================================================================

page-templates/ please make in this order! 
### template-homepage.php
#### Homepage:
Build a complete, finished photography homepage with at least 14 polished sections:

1. Fullscreen photographic hero
   - Large real/local hero image
   - Cinematic headline
   - Supporting copy
   - Two CTAs
   - Small trust/stat row
   - Editorial overlay treatment

2. Featured work strip
   - Horizontal image-forward preview
   - Real/local photos
   - Links to Work page

3. Brand statement section
   - Studio philosophy
   - Strong editorial typography
   - Portrait/studio image pairing

4. Services overview
   - At least 6 service cards
   - Each card uses a fitting real/local photo
   - Clear CTA per service

5. Signature experience section
   - Explain inquiry, planning, session, editing, gallery delivery

6. Featured gallery / masonry section
   - Real/local image grid
   - Filter interaction using vanilla JS
   - Categories: Portraits, Weddings, Brand, Product, Family, Events

7. Featured story / case study section
   - One detailed shoot story
   - Large photos
   - Pull quote
   - Outcome/experience details

8. Before/after or editing style section
   - Use a before/after slider or editing process visual
   - Must be photography-specific

9. Packages / session options
   - Three polished cards
   - Portrait, Brand, Wedding/Event or similar

10. Product/brand photography feature
   - Real/local product or business imagery
   - Useful business-focused copy

11. Wedding/engagement feature
   - Real/local couple/event imagery
   - Emotional but professional copy

12. Testimonials/proof
   - At least 4 believable testimonials
   - Small stats/review row

13. Blog preview
   - At least 4 helpful planning guides

14. FAQ section
   - At least 7 useful booking/session questions
   - Accessible accordion behavior

15. Final booking CTA
   - Strong conversion copy
   - Contact CTA
   - Secondary CTA to view work page template
### template-services.php
### template-single-service.php
### template-about-us.php
### template-work.php
### template-blog.php
### template-contact.php
### template-policy.php


    




## 12. Images =====================================================================================================================================================================================

use svg in where needed and also put them in the proper file location : assets/ and find the proper place or folder.

use onyl real photos, use copywrite free, free to use, no issues or anything like that! 


## 13. README REQUIREMENTS ========================================================================================================================================================================

Create README.md with:
- Theme overview
- Folder structure
- Features
- Page templates
- Header behavior
- Static preview notes
- Accessibility notes

## 14. Definition of done... ======================================================================================================================================================================

VALIDATION CHECKLIST

Before finishing, verify:

- assets/css/theme.css exists and is non-trivial.
- assets/js/theme.js exists and is non-trivial.
- Header layout is logo, menu, Get a Quote CTA button.
- Desktop dropdown panels open and close.
- Dropdown panels are solid and readable.
- Dropdown panels have correct z-index.
- Mobile menu opens and closes.
- Mobile menu background is solid and readable.
- All nav links work.
- No PHP syntax errors.
- No JavaScript console errors.
- No copied third-party branding, text, images, or direct site recreation.


The theme  should do basic WordPress theme checks, such as:

make sure the theme has the basic WordPress files it needs,
make sure PHP files pass PHP lint,
make sure style.css has a valid WordPress theme header,
make sure functions.php loads correctly,
make sure asset paths are sane,
make sure there are no obvious missing includes,
make sure there are no hardcoded absolute local machine paths,
make sure no API keys or secrets were committed,
make sure the theme folder is self-contained,
make sure the theme does not reference CDN assets,
make sure the generated theme did not modify files outside its allowed folder.
