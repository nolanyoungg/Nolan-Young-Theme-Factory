# Hearth & Honey accessibility

Implemented: semantic header, nav, main and footer landmarks; one page heading; visible keyboard focus; skip link; image alternatives; native FAQ details; labeled demo controls; reduced-motion support; content visible without JavaScript.

The mobile menu expands in normal document flow, so it is not a modal and does not trap focus. Its button maintains `aria-expanded` and an Open/Close label. Escape closes the menu and returns focus to the button. The desktop bake feature is button-operated, closes on Escape or outside interaction, and removes closed contents from tab order. Without JavaScript, links remain accessible and enhancement controls stay hidden.

Manual review before real deployment: keyboard all links and details; test menu open/close/Escape at mobile width; check 390px layout and 200% zoom; confirm menu and footer text wrapping; enable reduced motion; disable JavaScript; review image alternatives; activate the inquiry demo and verify that no network request is sent. These are review steps, not a claim of completed browser testing or certification.
