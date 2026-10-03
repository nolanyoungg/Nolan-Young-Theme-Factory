# Clay & Still customization

Edit palette tokens in `src/scss/abstracts/_variables.scss` and mirror editor colours in `theme.json`. The palette is warm ivory (#f7f3eb), dusty peach (#e5c3b1), deep cocoa (#392a23), and muted olive (#62654b). Typography uses local Georgia and system sans-serif fonts.

The homepage sequence is declared in `front-page.php`. Each chapter has a focused template part. Page compositions live in `page-templates/`; the native page-slug files simply load those templates. Shared photo metadata, collection concepts, navigation labels, and complete journal notes live in `inc/helpers.php`.

The header uses a compact native details disclosure and a separate mobile drawer. The footer is a studio colophon with navigation and photo credits. There are no widget or subscription dependencies.

Respect the image manifest. Do not infer material specifications, product availability, or studio authorship from stock photography. Replace illustrative material copy only with verified details for real work.

Inquiry fields are demonstration controls. A real submission service belongs in a separately selected plugin or service with an accurate privacy policy. Do not change the demo notice to a delivery confirmation without implementing and verifying delivery.

Run `npm run build` after SCSS or JavaScript edits. Check narrow screens at 390px, navigation with the keyboard, reduced-motion preferences, and operation without JavaScript. This documentation describes intended behaviour, not a certification or a record of visual testing.

