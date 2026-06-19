# NOLAN-YOUNG Theme for Northstar Websites

This WordPress theme is designed for a modern website development company named Northstar Websites. The theme features a clean and professional design, focusing on usability and accessibility. It includes advanced navigation, a responsive layout, a custom form system, and comprehensive documentation.

## Required Structure
- `assets/`: Contains compiled CSS, JavaScript, images, and icons.
- `inc/`: Holds PHP modules for theme functionality.
- `src/`: Source files for SCSS and JavaScript.
- `template-parts/`: Reusable template components.
- `page-templates/`: Custom page templates.
- `blocks/`: Documentation for custom Gutenberg blocks.
- `build/`: Webpack configuration and build scripts.
- `docs/`: Additional documentation, including getting started guides.
- `accessibility/`: Accessibility guidelines and support.

## Installation
1. Install Node.js as specified in the Build Requirements section.
2. Clone or download this theme to your WordPress installation's themes directory.
3. Activate the theme from the WordPress admin panel.
4. Assign a static front page under Settings > Reading.
5. Configure navigation menus under Appearance > Menus.
6. Set the site logo under Appearance > Customize > Site Identity.
7. Prepare required pages (About, Services, Work, Blog, Contact) with appropriate content and assign templates as needed.

## Build Requirements
- Supported Node.js version: [Node.js version]
- Install dependencies: `npm install`
- Development build: `npm run dev`
- Production build: `npm run build`
- Compiled outputs:
  - `assets/css/bundle.css`
  - `assets/js/bundle.js`

## Features
- Header with responsive navigation and dropdown panels for Services, About, and Blog.
- Mobile drawer menu with accordions for Services, About, and Blog.
- Work filtering using categories.
- Forms for Contact and Single Service inquiries.
- Newsletter signup system.
- Responsive layouts across desktop, tablet, and mobile devices.
- Accessibility support including keyboard navigation and screen reader compatibility.
- Footer with CTA band, brand statement, services, company information, blog links, contact details, and legal information.

## Page Templates
- `front-page.php`: Implements the homepage with 15 polished sections.
- `template-about-us.php`: Complete About page.
- `template-services.php`: Complete Services page.
- `template-single-service.php`: Reusable service-detail template.
- `template-work.php`: Work archive page.
- `template-blog.php`: Blog archive page.
- `template-contact.php`: Contact page with inquiry form and response information.
- `template-policy.php`: Policy page layout.

## Header Behavior
- Primary navigation click behavior opens corresponding dropdown panels.
- Internal rail hover and focus behavior updates right-side content without opening/closing the panel.
- Sticky header changes appearance on scroll.
- Body-scroll locking when a dropdown or mobile menu is open.
- Backdrop shows when a panel is open, clicking outside closes it, pressing Escape also closes it.
- ARIA state management for accessibility.
- Mobile accordion behavior with proper keyboard and screen reader support.

## Accessibility Notes
- Keyboard operation: Supports Tab navigation and :focus-visible states.
- Reduced motion: Adheres to prefers-reduced-motion settings.
- Contrast: Ensures sufficient contrast ratios for readability.
- Semantic landmarks: Uses appropriate HTML5 tags and ARIA roles.
- Form validation: Includes client-side and server-side validation with clear feedback.
- Accordions: Closed answers are hidden from assistive technology.
- Content filtering: Supports keyboard navigation within filterable components.
- Hidden-content behavior: Ensures all interactive elements are accessible.

## Images and Licensing
- `assets/images/hero/`: Contains hero banners and major visuals.
- `assets/images/portfolio/`: Work, case-study, service, article, and supporting content images.
- `assets/images/texture/`: Background textures and decorative raster assets.
- `assets/icons/`: Local SVG interface icons and marks.

## Forms and Newsletter
- Form submissions appear in the WordPress admin under a 'Forms' menu.
- Newsletter subscribers are managed through a 'Newsletter' menu, showing email, optional name, signup date, status, and unsubscribe date.
- Submissions can be exported as CSV files from the admin panel.
- Exported data is properly escaped for correct formatting.
- Unsubscribe mechanism uses unique tokens to manage subscription statuses securely.

## Supporting Documentation
- `docs/getting-started.md`: Guidance for setting up and using the theme.
- `docs/customization.md`: Instructions for customizing the theme's appearance and behavior.
- `assets/icons/README.md`: Conventions and permitted icon sources for icons.
- `blocks/README.md`: Documentation for custom Gutenberg blocks.
- `accessibility/README.md`: Accessibility guidelines and support.

## Changelog and License
- `CHANGELOG.md` contains meaningful release entries with details about changes in each version.
- `LICENSE.txt` includes the applicable project license.

## Known Limitations
- None at this time.
