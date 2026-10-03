# Clay & Still

A complete fictional ceramics studio, with dusty peach, warm ivory, cocoa, and olive colours; local system typography; offset stock photography; and a six-chapter editorial homepage.

## Pages

Create standard WordPress pages at these paths. Native page-slug templates select the matching composition automatically. The named templates in `page-templates/` may also be assigned manually.

| Destination | Page | Template |
| --- | --- | --- |
| / | Home, selected under Settings → Reading | front-page.php |
| /about/ | Our studio | Our Studio |
| /services/ | Workshops & more | Workshops and Studio Sessions |
| /work/ | The collection | The Collection |
| /blog/ | Journal | Studio Journal |
| /contact/ | Say hello | Studio Inquiry |
| /privacy-policy/ | Privacy | Privacy and This Demo |
| /services/featured/ | Featured, with Services as parent | Introductory Handbuilding |

Use readable permalinks. The theme does not create pages or add rewrite rules. All internal links are ordinary same-frame links. The sample journal includes three complete on-page notes with fragment links. Published posts and archives retain standard fallback templates.

## Editing and building

Curated copy lives in the page templates, template parts, and `inc/helpers.php`. The included page compositions use that sample copy; the generic page and single-post fallbacks render editor content.

Run `npm run build` to compile `src/scss/main.scss` and `src/js/main.js` to `assets/css/bundle.css` and `assets/js/bundle.js`. The prepared dependency set and package name are retained. `npm run dev` is available for a watched development build. Do not edit compiled bundles directly.

## Demo boundaries

Clay & Still is fictional. Collection materials are illustrative concepts, not verified specifications for photographed objects. There are no prices, available stock, live workshop dates, sales, bookings, or payments. Inquiry controls perform browser validation and display a clear demo notice; no data is sent or stored. No inquiry post types, taxonomies, email handlers, newsletter, or administrative submission storage are registered.

## Photography

Only the seeded local photographs are used: white ceramic vessels by **Tom Crew** and a red ceramic vase by **五玄土 ORIENTO**, sourced from Unsplash. Attribution, original pages, and approved licensing metadata are preserved in `assets/images/asset-manifest.json`. These images are illustrative stock and are never presented as Clay & Still work. The footer provides visible linked credits. Small local SVG marks are decorative interface assets.

## Interaction

A native desktop disclosure offers workshop and commission links. The mobile header contains only the wordmark and hamburger; its disclosure drawer supports accurate expanded state, Escape, focus return, and closing when focus leaves. No-JavaScript navigation remains available. Native details elements provide FAQs. Content remains visible before JavaScript and with reduced motion.

The prepared theme metadata and factory provenance files are retained. See `docs/getting-started.md`, `docs/customization.md`, and `accessibility/README.md`.

