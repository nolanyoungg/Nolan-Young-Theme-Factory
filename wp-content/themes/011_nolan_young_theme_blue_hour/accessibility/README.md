# Blue Hour accessibility notes

- A visible-on-focus skip link targets the main content.
- The mobile menu uses a named button, aria-controls, and accurate aria-expanded state. Escape closes it and returns focus. It is an inline disclosure, so it does not trap focus.
- All navigation links remain available when JavaScript is disabled.
- The desktop listening note and FAQs use native details/summary.
- Inquiry fields have visible, associated labels. Required fields use browser validation; a live status explicitly says that nothing was sent, stored, or booked.
- Entrance motion only translates content already visible. Reduced-motion preferences disable animation and transitions.
- Mobile typography, grids, controls, and footer columns have explicit small-screen rules. No remote fonts or autoplay media are used.
- Stock photographs have descriptive alternatives; decorative CSS marks do not add spoken noise.

These are implementation notes, not a claim of formal accessibility certification. Browser, keyboard, zoom, and assistive-technology evaluation should accompany deployment.
