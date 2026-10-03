# Clay & Still accessibility

The theme provides a skip link, semantic landmarks, descriptive image alternatives, visible focus outlines, labelled inquiry controls, and native FAQ disclosures.

The mobile menu is a nonmodal disclosure in document flow. Its button exposes `aria-expanded` and `aria-controls`; opening focuses the first navigation link. Escape closes it and returns focus to the button. Tab can leave normally, closing the drawer without a focus trap. Resizing to desktop closes the drawer. Desktop workshop navigation uses native details and summary, with Escape and focus-away closing added in JavaScript.

Without JavaScript, a navigation fallback is present and essential page content stays visible. FAQ details and the desktop disclosure continue to work natively. Reveal effects animate already visible content and are disabled for reduced-motion preferences.

At widths below 700px, grids stack, hero typography has an explicit mobile size, buttons wrap or stack, and footer columns lose desktop spans. Long content and contact links can wrap. The header changes to wordmark and hamburger below 900px.

Inquiry controls require a name, valid-format email, and message before showing an accessible status notice. They do not transmit data; the notice states that nothing was sent, stored, or booked. With JavaScript disabled, a static note explains this limitation.

Recommended deployment checks: keyboard order and focus return, 390px and 200% zoom layouts, readable contrast, screen-reader announcement of disclosure state and form status, and reduced-motion behaviour. These checks remain distinct from the theme build and PHP syntax validation.

