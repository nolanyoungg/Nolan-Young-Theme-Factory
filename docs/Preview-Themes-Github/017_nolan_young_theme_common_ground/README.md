# Common Ground

A complete static portfolio sample for a fictional independent architecture practice. The design uses warm ivory, forest ink, muted ochre, system serif headings, and system sans-serif body text. No packages or build step are required.

## Pages

- `index.html` and `homepage_preview.html`: identical home experience with editorial photography, a numbered project index, philosophy, services, and inquiry link.
- `about-us_preview.html`: studio principles and a collaborative approach.
- `services_preview.html`: renovations, compact homes, civic interiors, and native FAQs.
- `work_preview.html`: three substantial, clearly fictional design studies with fragment navigation.
- `blog_preview.html`: three complete articles about light, materials, and reuse, with article fragment links.
- `contact_preview.html`: accessible, explicitly labeled demo inquiry form.
- `policy_preview.html`: form, browser storage, hosting, and photography policy.
- `single_services_preview.html`: detailed renovation scope, process, example, and FAQs.

## Assets and provenance

The approved provenance record is `assets/images/asset-manifest.json`. The supplied photographs are `assets/images/hero/editorial-hero.jpg` by Pierre Châtel-Innocenti and `assets/images/portfolio/editorial-detail.jpg` by Annie Spratt, from Unsplash under the supplied Unsplash License. They are architectural references and never represented as photographs of the fictional projects. No additional images or remote resources are used. The small brand symbol is original inline interface SVG. Prepared `sample.json`, supplied photographs, icons, and the asset manifest are preserved.

## Interactions and accessibility

Shared styling is in `assets/css/site.css`; progressive enhancement is in `assets/js/site.js`. All site links are relative and stay inside the current iframe. The brand links to `index.html`; the footer Home link exposes the equivalent `homepage_preview.html`. The footer consistently links every page role, including privacy and renovation details.

Without JavaScript, navigation remains visible and native FAQ disclosures and fragment links work. With JavaScript, the mobile menu opens with a button, reports its state with `aria-expanded`, follows normal keyboard tab order, and closes on Escape with focus returned to the button. Pointer clicks outside and navigation selection also close it. Focus indicators, skip links, semantic headings, labeled fields, and reduced-motion support are included.

The inquiry form uses browser validation and displays an accessible local confirmation. Its preview button is a non-submit button and starts disabled until the script attaches. The script also intercepts form submission. Fields have no submission names. No fetch, email, storage, analytics, or external submission is connected. The form remains filled for editing after confirmation; browser history may restore values. Without JavaScript, a message explains that the interactive preview is unavailable. Use invented details only.

## Content and limitations

`content.json` records the identity, page plan, fictional projects, journal topics, imagery usage, and interactions. Contact details use `example.test`; there is no real address, inbox, studio, or appointment service. No awards, testimonials, or built-project claims are made.

The sample is designed with responsive layouts for desktop and mobile. Validation, browser review, screenshots, reports, and gallery updates are owned by the parent runner and were not run during this generation pass. No build, package, publication, or WordPress conversion is part of this sample.
