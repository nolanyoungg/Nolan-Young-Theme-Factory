# Form & Field accessibility

The source includes a skip link, semantic landmarks, one primary heading per page, visible keyboard focus, descriptive photo alternatives and decorative icons with empty alternatives. Links use the same browsing frame.

The mobile navigation button controls the inline navigation and updates its expanded state. Opening moves focus to the first link. Escape closes an open capability disclosure first, then the drawer, restoring focus to its control. Without JavaScript, navigation stays available in the page flow. This is a nonmodal drawer, so focus is not trapped.

Capability menus and FAQs use native details/summary elements. Hidden mobile navigation does not remain in the keyboard order. Forms have visible labels, native validation and an announced local-demo result. The check control is disabled when JavaScript is unavailable; entries are never transmitted or stored by the theme.

Intersection effects only move already-visible content. Reduced-motion preferences remove transitions, animation and smooth scrolling. No essential text relies on a reveal animation.

Mobile styles explicitly constrain the heading, header controls, photos, form fields and footer columns. Footer links wrap and its columns stack. Keyboard, zoom, contrast and assistive-technology checks on the final running site remain necessary; these implementation notes are not an accessibility certification.
