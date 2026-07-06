# Accessibility

ForgeCart Studio includes visible focus states, semantic landmarks, keyboard-operable menu panels, mobile accordions, accessible filtering controls, and server-side validation for public forms. Closed dropdowns, drawers, accordions, and filter results use `hidden` so inactive controls are not left in the keyboard order.

The desktop header supports click toggles, Escape closing, outside-click closing, backdrop closing, body-scroll locking, and accurate `aria-expanded` updates. Services and About rail controls update internal panel content on hover and keyboard focus without opening or closing the parent dropdown.

Motion is restrained and covered by `prefers-reduced-motion`. Color is paired with labels, text, or state changes for validation and filtering feedback. Form labels are explicit, required fields are validated on the client and server, and policy templates render WordPress-managed content without inventing legal copy.
