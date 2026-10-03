# Customize Ridge & River

The design tokens live in src/scss/abstracts/_variables.scss. Pine #193b31, parchment #f3efe4 and rust #a4432b form the palette. System sans-serif type is paired with compact monospace trail labels.

The homepage is assembled from six edited template parts: hero, featured-work (walk ledger), style-pillars (difficulty), brand-statement (ethos), process (packing) and cta-banner (inquiry and FAQ). File names are implementation details; their content belongs to the outfitter.

Shared navigation, photograph rendering, decorative marks and sample walks live in inc/helpers.php. The static inquiry lives in inc/forms.php. It deliberately has no data endpoint or named submission fields.

Edit the seven named page templates for the curated inner pages. Normal page-slug wrapper files select those templates using WordPress's template hierarchy. Do not add a custom routing layer.

Keep the mobile navigation breakpoint at 1000px aligned in JavaScript and SCSS. Mobile hero geometry is explicitly overridden at 700px. Content remains visible without JavaScript; the mobile navigation expands into an ordinary list.

The approved photograph is reused with different crops, always as illustrative stock. Only prepared files in the approved asset manifest are used. The three local marks retain their prepared paths with the field-guide palette.

Run `npm run build` after source changes. Check keyboard navigation, reduced motion, long content and the 390px layout when evaluating the site.

