# Blue Hour

A fictional jazz listening room with a five-section poster homepage, piano photography, a weekly sample bill, and a listening-first editorial voice. All programs, event dates, times, and capacity examples are demo content. No real venue or ticket availability is represented.

## Build

Run `npm run build` from this theme to compile local SCSS and JavaScript using the prepared dependencies. No remote fonts, trackers, or runtime libraries are added. The prepared theme metadata and package identity are retained.

## Pages

Create ordinary WordPress pages with these paths. Their standard slug templates select the complete sample compositions automatically; the named page templates can also be selected in the editor.

- Home: / — front-page.php
- The room: /about/
- The sessions: /services/
- Past notes: /work/
- Listening journal: /blog/
- Visit and inquire: /contact/
- Privacy and demo details: /privacy-policy/
- Private listening event: /services/featured/ — create Featured as a child of Services

The journal includes three complete sample essays. WordPress posts still have standard single, archive, and search templates. No custom post types, taxonomies, URL rewrites, or automatic database writes are used.

## Demo form

The sample inquiry only checks completeness in the browser. It sends no email, stores nothing, and books nothing. Use sample data only. Buttons clearly describe the preview. Without JavaScript the notice remains visible and the form cannot submit.

## Photography

Only the two local photographs in assets/images/asset-manifest.json are used. Joshua Hoehne supplied the hero piano photograph; Johannes Plenio supplied the detail piano photograph, both via Unsplash under the recorded Unsplash License. These are illustrative stock, not images of a Blue Hour venue or actual programs. Public credits are in the footer.

## Accessibility

Navigation is keyboard operable, with Escape close and accurate expanded state. Without JavaScript, mobile navigation remains expanded and readable. Native details provide FAQs. Content stays visible before animation and with scripts disabled. Reduced motion disables transitions and entrance motion. Responsive rules explicitly cover 390px layouts; visual verification belongs to the separate evaluation workflow.
