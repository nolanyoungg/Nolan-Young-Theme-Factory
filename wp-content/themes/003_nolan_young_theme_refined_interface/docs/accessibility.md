# Accessibility release checks

Target WCAG 2.2 AA. Test keyboard navigation, skip link, visible focus, heading order, landmarks, menu expansion state, form labels and errors, color contrast, zoom/reflow, reduced motion, and screen-reader announcements. Automated checks supplement but do not replace manual testing.

The primary mega menus use disclosure buttons with `aria-expanded` and `aria-controls`. Verify Enter, Space, Arrow Down, Escape, outside-click dismissal, visible focus, tab order, reduced-motion behavior, and that only one disclosure is expanded at a time.
