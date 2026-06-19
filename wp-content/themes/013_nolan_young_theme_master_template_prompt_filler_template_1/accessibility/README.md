# Accessibility

This document outlines the accessibility features and considerations implemented in the `013_nolan_young_theme_master_template_prompt_filler_template_1` theme.

## Keyboard Navigation
- **Primary Navigation**: The main navigation is accessible via keyboard, with focus management ensuring a logical tab order. Pressing Tab moves focus through menu items; Space or Enter opens the selected panel.
- **Dropdown Panels**: Inside Services and About panels, left rail buttons can be navigated using the Arrow keys to change selection and update the corresponding right-side content area.
- **Blog Panel**: The blog grid is fully keyboard accessible, allowing users to navigate through posts using Tab and interact with them via Space or Enter.

## Focus States
- **Visible Focus Indicators**: All interactive elements (buttons, links) have visible focus states that remain distinct from hover styles, ensuring keyboard users can easily track focus location.

## Screen Reader Support
- **ARIA Roles and States**: The theme uses ARIA roles to define interactive components. For example, the header navigation buttons use `aria-controls` to indicate which dropdown panel they control, and the panels themselves use `aria-expanded` to show their current open/closed state.
- **Semantic HTML**: The theme employs semantic HTML5 elements like `<nav>`, `<header>`, `<footer>`, and `<main>` to enhance screen reader navigation and comprehension.

## Reduced Motion
- **CSS Custom Properties**: The theme utilizes CSS custom properties for animations, allowing users with `prefers-reduced-motion` set in their system preferences to opt out of animations. Animations are smoothly disabled or reduced in intensity.

## Color Contrast and Text Readability
- **Sufficient Contrast**: All text has sufficient contrast against its background to meet WCAG accessibility standards, ensuring readability for users with visual impairments.
- **Readable Typography**: The theme uses a modern sans-serif font stack (`Avenir Next`, `Segoe UI`, Helvetica, Arial, sans-serif) with appropriate line heights and sizes for clear reading across various devices.

## Interactive Element States
- **Button Variations**: The theme supports multiple button variations (primary, secondary, header-specific CTA, small, full, text-forward), each with distinct visual states for default, hover, focus-visible, active, and disabled conditions. These states ensure that buttons remain interactive and accessible.

## Forms
- **Clear Labels**: All form fields have clear labels associated using the `<label>` element, ensuring screen readers can correctly associate field names with their corresponding input controls.
- **Inline Validation and Error Messages**: The forms include inline validation messages to provide feedback on user input. Errors are clearly marked with ARIA attributes to assist screen reader users.
- **Nonces and Security**: Forms use nonces for security, preventing CSRF attacks, and all form submissions undergo server-side validation and sanitization before processing.

## Additional Considerations
- **Responsive Layouts**: The theme's layout adjusts seamlessly across devices, ensuring that content remains accessible and usable on various screen sizes without creating horizontal overflow or requiring users to scroll horizontally.
- **No External Dependencies**: The theme does not rely on external CDN scripts or assets, maintaining a secure and self-contained environment for accessibility features.
