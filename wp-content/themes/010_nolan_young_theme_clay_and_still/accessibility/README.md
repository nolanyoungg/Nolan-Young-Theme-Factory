# Clay & Still accessibility notes

The theme provides a skip link, visible focus rings, semantic landmarks, labelled form fields and meaningful alternatives for the two illustrative photographs. Decorative line marks have empty alternatives.

The desktop workshop disclosure uses native details/summary. The mobile menu is an inline disclosure, not a modal: Tab follows normal document order. Its button reflects the expanded state, Escape closes it and returns focus, and changing to desktop closes it. Without JavaScript the mobile links remain visible.

FAQ content uses native details elements. Essential content is visible before JavaScript runs. Optional arrival animations and hover transitions respect prefers-reduced-motion.

The demo review control checks required fields using browser validation and announces the outcome through a status region. It does not send or save a message. Input fields deliberately have no transmission names.

Mobile styles explicitly constrain the hero, stack inquiry fields and footer columns, and allow navigation labels to wrap. Browser testing at 390px, keyboard testing and a screen-reader review are still required before a production release; this document is not an accessibility certification.
