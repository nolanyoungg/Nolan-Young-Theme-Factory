# Customizing Clay & Still

The four primary colour tokens live in src/scss/abstracts/_variables.scss and are mirrored in theme.json. The main stylesheet imports only the styles used by this design. Homepage geometry is in pages/_homepage.scss; masthead, footer and shared compositions are in layout.

Edit the six homepage template parts and the seven page templates for copy. Shared photo definitions, navigation and complete sample journal entries live in inc/helpers.php. The inquiry markup lives in inc/forms.php and the review interaction in src/js/main.js.

The provided photos are visual references. Keep their illustrative labels and photographer credits, or replace them only through a separately approved asset workflow. Decorative icons are local line marks, not product imagery.

Use ordinary same-frame links. Keep mobile text wrapping and the single-column footer rules intact. After changing styles or scripts, run `npm run build`.

Before making this a real business site, replace the fictional identity copy, supply verified venue and product information, and connect any actual inquiry or booking service through an appropriate plugin. Update the privacy notice to describe that service. The theme has no custom content types or submission storage.
