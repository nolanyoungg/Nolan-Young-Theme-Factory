# Clay & Still

A fictional independent ceramics studio with an editorial WordPress theme. Dusty peach, warm ivory, deep cocoa and muted olive frame two approved stock photographs. System serif and sans-serif fonts keep every runtime asset local.

## Pages

Create standard WordPress Pages with the following slugs. The corresponding page-slug templates are selected automatically; the named templates can also be assigned in the editor.

| Destination | Template |
| --- | --- |
| / | front-page.php |
| /about/ | Our Studio |
| /services/ | Workshops and Commissions |
| /work/ | The Collection |
| /blog/ | Studio Journal |
| /contact/ | Visit and Inquire |
| /privacy-policy/ | Privacy Note |
| /services/featured/ | Intro to Handbuilding |

Create Featured as a child of Services. The theme does not insert database content or add rewrite rules. The sample journal works as either a standard page or the posts page. Posts and arbitrary pages retain standard WordPress fallbacks.

## Build

Run `npm run build` to compile SCSS and JavaScript into assets/css/bundle.css and assets/js/bundle.js. Use `npm run dev` for local source work. No new dependencies are required.

## Content and interaction

Six homepage sections introduce the collection, selected forms, making process, workshop, journal and visit inquiry. Navigation has a native details disclosure and an enhanced mobile menu with Escape support. Content remains visible without JavaScript. Inquiry forms only review local sample input; they send no email and store no entries.

## Photography

The asset manifest records the approved files and provenance. White vessels: Tom Crew, https://unsplash.com/@tomcrewceramics. Red vase: 五玄土 ORIENTO, https://unsplash.com/@oriento. Both are illustrative stock photographs, not studio products or commissioned work. Credit links also appear in the footer. There is no checkout, claimed stock availability, live booking calendar or physical location.

See docs/customization.md and accessibility/README.md for maintenance notes.
