# NOLAN-YOUNG Theme for Northstar Websites

## Theme Overview

This WordPress theme is designed specifically for Northstar Websites, a modern website development company focused on delivering high-quality WordPress solutions. The theme features a clean, professional design with a strong emphasis on usability and accessibility.

### Primary Features
- Responsive header with services navigation dropdowns.
- Mobile-friendly menu drawer.
- Polished homepage with multiple sections showcasing services, process, work, testimonials, and contact options.
- About Us, Services, Work, Blog, Contact, and Policy pages.
- Integrated forms for contact inquiries and service requests.
- Newsletter signup functionality.
- Strong typography, color system, and accessibility focus.

### Required Structure

```
013_nolan_young_theme_master_template_prompt_filler_template_1/
 assets/
    icons/
       README.md
    images/
       hero/
       portfolio/
       texture/
    css/
       bundle.css
    js/
        bundle.js
 build/
    webpack.config.js
 inc/
    enqueue.php
    other-modules.php
 src/
    scss/
       _variables.scss
       _mixins.scss
       _base.scss
       _components.scss
       _layout.scss
       main.scss
    js/
        main.js
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
 page-templates/
    template-about-us.php
    template-services.php
    template-single-service.php
    template-work.php
    template-blog.php
    template-contact.php
    template-policy.php
 blocks/
    README.md
 docs/
    getting-started.md
    customization.md
 accessibility/
    README.md
 front-page.php
 header.php
 footer.php
 style.css
 functions.php
```

## Installation

1. **Download and Upload:**
   - Download the theme files.
   - Upload to your `wp-content/themes/` directory.

2. **Activate Theme:**
   - Go to WordPress dashboard > Appearance > Themes.
   - Click "Activate" on Northstar Websites Theme.

3. **Assign Homepage:**
   - Go to Settings > Reading.
   - Set "Front page displays" to a static page and select the desired homepage template.

4. **Configure Menus:**
   - Go to Appearance > Menus.
   - Create menus for Primary Navigation and Footer Navigation.
   - Assign them in their respective menu locations.

5. **Set Logo:**
   - Go to Customizer > Site Identity.
   - Upload and set the logo as per design guidelines.

6. **Prepare Required Pages:**
   - Create pages for About Us, Services, Work, Blog, Contact, and Policy using the provided templates.

7. **Complete Initial Setup:**
   - Use the WordPress admin panel to add content, configure settings, and customize the theme according to your needs.

## Build Requirements

### Supported Node.js Version
- Node.js 14.x or later is recommended for compatibility with Webpack and other dependencies.

### Dependency Installation
```bash
npm install
```

### npm Commands
- **Development Mode:**
  ```bash
  npm run dev
  ```
  - Compiles SCSS and JS, generates source maps.
  - Runs in watch mode for active development.

- **Production Build:**
  ```bash
  npm run build
  ```
  - Compiles SCSS and JS in production mode, minifies output.

### Source Entry Points
- SCSS entry point:
  ```
  src/scss/main.scss
  ```

- JavaScript entry point:
  ```
  src/js/main.js
  ```

### Exact Compiled Outputs
- CSS bundle:
  ```
  assets/css/bundle.css
  ```

- JS bundle:
  ```
  assets/js/bundle.js
  ```

## Features

### Header Panels
- **Services, About, Blog:** Dropdown panels with detailed content.
- **Sticky State:** Header transitions on scroll.
- **Body Scroll Locking:** Prevents page scrolling when a dropdown is open.

### Mobile Drawer
- **Hamburger Menu:** Opens on the right side of the header.
- **Accordions for Services, About, Blog:** Nested navigation within the drawer.

### Work Filtering
- **Filterable Portfolio Grid:** Allows users to filter featured work by categories (Strategy, Design, Development, Integration, Support, Results).

### Forms
- **Contact Form:** Captures general inquiry details.
- **Single Service Form:** Automatically identifies the related service being viewed.
- **Form Storage and Management:** Admin panel for viewing, exporting, and deleting submissions.

### Newsletter Management
- **Signup Form:** Collects email addresses (and optional names).
- **Subscriber Status Tracking:** Active and Unsubscribed states.
- **Admin Panel for Subscribers:** Filtering, exporting, emailing summaries to site owners.

### Responsive Layouts
- **Desktop Layout:** Multi-column design with balanced sections.
- **Tablet Layout:** Fewer columns while maintaining hierarchy.
- **Mobile Layout:** Clean single-column layout ensuring readability and accessibility.

### Accessibility Behavior
- **Keyboard Navigation:** Supports tab navigation, focus states, and accessible dropdown interactions.
- **Reduced Motion Support:** Animations are respectful of user preferences.
- **Contrast and Semantic Landmarks:** Ensures high contrast between text and background for all users.
- **Form Validation:** Clear error messages and inline validation for form fields.

### Footer Structure
- **CTA Band:** Prominent call-to-action with a clear message.
- **Brand Statement:** Company purpose and positioning.
- **Services Column:** Links to service pages.
- **Company Column:** Important company information (About, Work, Blog, Contact).
- **Blog Column:** Recent or featured posts from the blog.
- **Contact Block:** Direct contact details and CTA.
- **Bottom Legal Row:** Copyright notice and relevant legal links.

### Policy Routing
- **Policy Pages:** Renders content managed through WordPress without making unsupported promises or claims.

## Page Templates

- **front-page.php:** Implements the complete business homepage with fifteen polished sections.
- **template-about-us.php:** About page with company story, purpose, team information.
- **template-services.php:** Services page showcasing primary services and a FAQ section.
- **template-single-service.php:** Detailed service pages including a contact form.
- **template-work.php:** Work portfolio with project categories and filtering.
- **template-blog.php:** Blog archive page with featured articles and search functionality.
- **template-contact.php:** Contact page with inquiry form and response information.
- **template-policy.php:** Policy page rendering WordPress-managed content.

## Header Behavior

### Primary Navigation Click Behavior
- **Services, About, Blog:** Open corresponding dropdown panels.
- **Work, Blog:** Direct links to respective pages.

### Internal Rail Hover and Focus Behavior
- **Services and About Panels:** Updates right-side content on left-rail hover or keyboard focus without opening/closing the main panel.

### Sticky State Behavior
- **Default Header:** Slightly taller padding for an airy appearance.
- **Scrolled Header:** Tighter padding, solid warm background, crisp border.

### Body Scroll Locking
- **Dropdowns Open:** Prevents page scrolling when a dropdown is open to maintain focus and usability.

### Backdrop Behavior
- **Full-page Backdrop:** Appears when a dropdown or mobile drawer is open.
- **Locks Body Scroll:** Ensures users can navigate the dropdown content without accidentally scrolling the main page.

### ARIA State Management
- **aria-expanded:** Accurately reflects whether a panel is open or closed.
- **aria-controls:** Connects each primary navigation trigger to its corresponding dropdown panel.

### Mobile Accordion Behavior
- **Services, About, Blog Accordions:** Expandable sections within the mobile drawer.
- **Work and Contact Links:** Direct links without accordions for simplicity.

## Accessibility Notes

- **Keyboard Operation:** Supports tab navigation, focus states, and accessible dropdown interactions.
- **Focus Management:** Clear :focus-visible states for all interactive elements.
- **Reduced Motion Support:** Animations are respectful of user preferences.
- **Contrast and Semantic Landmarks:** Ensures high contrast between text and background for all users.
- **Form Validation:** Clear error messages and inline validation for form fields.
- **Accordions:** Closed answers remain hidden from assistive technology or keyboard focus.
- **Content Filtering:** Work filtering is accessible via mouse, touch, and keyboard interaction.

Refer to [accessibility/README.md](accessibility/README.md) for detailed implementation notes.

## Images and Licensing

- **assets/images/hero/**: High-impact visuals for the homepage hero section.
- **assets/images/portfolio/**: Project, work, case-study, service, article, and supporting content visuals.
- **assets/images/texture/**: Restraint background textures and decorative raster assets.
- **assets/icons/**: Local SVG interface icons and marks.

### Third-party Assets
- **Source URL:** [Recorded in `README.md`](assets/icons/README.md)
- **Creator:** Where required, creator information is listed.
- **License:** Clearly stated to ensure compliance with usage rights.
- **Download Date:** Records when assets were added to the theme.

## Forms and Newsletter

### Form Submissions
- **Storage:** Managed in a structured format within WordPress.
- **Admin Panel:** View submissions, filter by form type, export selected entries, delete securely.
- **Email Notifications:** Sends notifications to configured site owners upon successful submission.

### Newsletter Management
- **Signup Form:** Collects email addresses (and optional names).
- **Subscriber Status Tracking:** Active and Unsubscribed states.
- **Secure Unsubscribe Mechanism:** Uses unique tokens without exposing subscriber identifiers directly.
- **Admin Panel for Subscribers:** Filtering, exporting, emailing summaries to site owners.

## Supporting Documentation

- [docs/getting-started.md](docs/getting-started.md): Instructions for setting up the theme.
- [docs/customization.md](docs/customization.md): Guidance on customizing the theme beyond default settings.
- [assets/icons/README.md](assets/icons/README.md): Conventions and permitted icon sources.
- [blocks/README.md](blocks/README.md): Documentation for any Gutenberg blocks used in the theme.
- [accessibility/README.md](accessibility/README.md): Accessibility implementation details.

## Changelog and License

- **CHANGELOG.md:** Maintains meaningful release entries with updates, fixes, and new features.
- **LICENSE.txt:** Includes the applicable project license (MIT).

## Known Limitations

- **Form Spam Protection:** Uses honeypot fields and rate limiting to prevent spam submissions. Further enhancements can be added as needed.
- **Newsletter Bulk Sending:** Does not include a bulk email sender; this requires a separate delivery system.

---
