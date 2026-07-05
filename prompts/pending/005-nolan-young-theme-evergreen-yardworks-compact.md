# Theme 005 Brief: Evergreen Yardworks

## Business Identity

Business name: `Evergreen Yardworks`

Slogan: `Reliable lawn care, thoughtful landscape maintenance, and seasonal property cleanup for homes that need to look cared for all year.`

Business field: residential lawn care and landscaping, including weekly mowing, edging, trimming, lawn health guidance, spring cleanup, fall cleanup, mulch and bed refreshes, pruning, seasonal planting, storm debris cleanup, recurring property maintenance plans, small HOA service, rental-property upkeep, and light commercial grounds care.

Brand personality: local, reliable, tidy, practical, route-minded, friendly, and detail-oriented. Do not sound like a software agency, ecommerce consultant, luxury spa, or national franchise.

## Non-Negotiable Generation Rules

Edit only the prepared theme directory. Do not create previews, ZIPs, reports, branches, commits, or files outside the theme folder.

Preserve the prepared theme slug, package name, text domain, build system, WordPress template structure, and required `npm run build` behavior.

This must be one complete Codex generation pass. Do not leave notes saying work remains. Do not run a second repair pass.

Use the existing SCSS, PHP, JS, template-part, and page-template structure. Do not introduce a new frontend framework. Do not use external runtime CDNs.

## Visual System

Create a warm, photo-led, local property-care website. The final look must be visibly different from prior blue software-agency themes.

Palette:

- Main background: `#ffffff`
- Warm surface: `#f5f1e8`
- Soft outdoor green: `#eef6e8`
- Dark evergreen: `#14251b`
- Primary brand: `#2f6b3f`
- Primary hover: `#245532`
- Secondary moss: `#6f8f3d`
- Warm seasonal accent: `#d99a2b`
- Muted sky support: `#d8edf2`
- Primary text: `#172119`
- Muted text: `#60705f`
- Border: `#d8ddcf`

Primary CTAs must be evergreen/deep leaf green, not blue. The logo must use evergreen, grass, cream, and warm gold tones, not purple, magenta, blue gradients, mountains, code cursors, SaaS symbols, or ecommerce marks.

Use SVG only for local interface marks, hamburger/menu icons, service badges, route/map accents, seasonal icons, and small UI details. Do not use SVG as the main hero, service, work, portfolio, or photo replacement imagery.

Use real seeded stock photos for visible photographic imagery:

- `assets/images/hero/curb-appeal-lawn.jpg`: hero and curb-appeal sections.
- `assets/images/hero/garden-crew-hands.jpg`: process, about, planting, and dropdown panels.
- `assets/images/portfolio/landscape-install.jpg`: bed refreshes, mulch, and landscape improvements.
- `assets/images/portfolio/lawn-maintenance.jpg`: mowing, edging, route maintenance, and plans.
- `assets/images/portfolio/seasonal-planting.jpg`: seasonal cleanup, planting, pruning, and guide content.
- `assets/images/texture/meadow-texture.jpg`: subtle background crops, footer texture, or service-area bands.

## Header And Navigation

Build a complete custom header for a lawn care company:

- Left: Evergreen Yardworks SVG logo mark and brand name.
- Center: Services, Plans, Work, Seasonal Guide, About, Contact.
- Right: `Request an Estimate` CTA.
- Optional small service status strip: `Now scheduling seasonal cleanups` or `Serving residential properties across the metro area`.

Dropdown panels must match this business. The right side of each dropdown must use seeded landscaping photos and Evergreen copy.

Services dropdown:

- Weekly Mowing
- Lawn Health
- Mulch and Bed Refresh
- Spring Cleanup
- Fall Cleanup
- Pruning and Trimming
- Seasonal Planting
- Storm Debris Cleanup

Plans dropdown:

- Weekly Care Plan
- Biweekly Maintenance
- Seasonal Reset
- Garden Bed Refresh
- HOA and Small Commercial

Seasonal Guide dropdown:

- When to Schedule Spring Cleanup
- Mulch Depth Without Smothering Plants
- Why Clean Edges Change the Whole Yard
- Fall Leaf Removal Checklist
- Watering Newly Planted Beds

Mobile drawer must mirror these services and seasonal links with accessible accordions.

## Homepage Flow

Redesign the entire homepage so every section reads as Evergreen Yardworks.

First viewport:

- H1: `Lawn care that makes the whole property feel handled.`
- Supporting copy: reliable mowing, clean edges, bed care, seasonal cleanup, homes, small HOAs, rentals, and light commercial properties.
- CTAs: `Request an Estimate` and `View Services`.
- Service note: `Photos of your property help us estimate faster.`
- Use `curb-appeal-lawn.jpg` as the primary hero image.
- Desktop and mobile must show the full H1, supporting copy, CTAs, and a meaningful portion of the hero photo without clipped text or giant empty zones.
- Mobile must not create horizontal overflow. The H1, copy, buttons, note chips, and hero image must fit within the visible viewport width at 390px. Do not use fixed pixel widths, `max-content`, oversized `ch` widths, wide button rows, or font sizes that push words off the right edge.
- On mobile, stack CTAs if needed, constrain every hero child to `max-width: 100%`, use `overflow-wrap: anywhere` or smaller `clamp()` values where necessary, and keep the H1 readable without clipping. The hero photo should be visible in the first viewport without requiring horizontal scrolling.
- Add explicit mobile CSS for the hero. At `max-width: 760px`, the hero H1 should use a conservative size such as `font-size: clamp(1.8rem, 8.5vw, 2.45rem)`, `line-height: 1.05`, `max-width: 100%`, and `overflow-wrap: break-word`. Set `.hero__copy`, `.hero__grid`, `.button-row`, and service chips to `min-width: 0` and `max-width: 100%`.
- On mobile, stack the primary and secondary hero buttons full-width or otherwise prove they fit within 390px. The top scheduling/status strip must wrap, truncate gracefully, or be hidden on small screens. It must not push horizontally off screen.
- Before finishing, check the first viewport mentally at 390px wide: no clipped words, no clipped CTA labels, no clipped status text, no horizontal scroll, and at least the start of the hero lawn photo visible below the copy.

Homepage sections to include:

1. Quick trust row: recurring plans, one-time cleanups, garden bed refreshes, seasonal scheduling.
2. Service selector with accessible active states and matching photos.
3. Seasonal priority band: spring, summer, fall, winter yard tasks.
4. Maintenance plan comparison: Weekly Care, Biweekly Maintenance, Seasonal Reset, Bed Refresh.
5. Work cards: Corner Lot Seasonal Reset, Front-Bed Mulch Refresh, Weekly Route Maintenance, HOA Common-Area Schedule, Fall Leaf Closeout, Entry Garden Color Update.
6. Process: request estimate, walk the property, choose the plan, scheduled visits, tidy closeout notes.
7. Property types: homes, townhomes, small HOAs, rentals, small storefronts.
8. Service-area route/map band using small SVG route accents only.
9. Lawn health education: mowing height, edging, weeds, watering, compaction, mulch depth, seasonal timing.
10. Crew standards: clean edges, gates latched, beds blown clear, debris removed, notes after visits.
11. Estimate CTA and contact form section.
12. FAQ: pricing factors, recurring vs one-time, rain delays, pets/gates, yard waste, scheduling.
13. Seasonal guide/blog preview.
14. Footer CTA: `Get your next yard visit on the calendar.`

## Services And Copy

Use complete original copy. Do not use Lorem ipsum. Do not claim awards, exact years in business, insurance, licenses, review counts, or real endorsements.

Service detail language:

- Weekly Mowing: scheduled mowing, edging along walks and drives, string trimming, blowing clippings off hard surfaces, visit notes.
- Lawn Health: mowing height guidance, spot seeding, sun/shade observation, weed-pressure notes, watering guidance.
- Mulch and Bed Refresh: bed edging, weed clearing, mulch installation, plant spacing cleanup, curb appeal.
- Spring Cleanup: winter debris removal, first trim, bed reset, early weed cleanup, growth-season prep.
- Fall Cleanup: leaf removal, final mow, perennial cutback language, bed cleanup, winter-ready prep.
- Pruning and Trimming: shrubs, hedges, small ornamental plants, sightline cleanup, shape maintenance. Do not claim arborist tree work.
- Seasonal Planting: annual color, planters, front-entry improvements, small garden updates.
- Storm Debris Cleanup: small branch and debris cleanup. Do not claim emergency tree removal.

Use CTAs:

- Request an Estimate
- Build My Yard Plan
- Schedule a Cleanup
- Compare Plans
- See Seasonal Work
- Ask About My Property

## Forms

Contact and estimate forms should ask for name, email, phone, property type, street/city or service area, services needed, recurring or one-time work, timeline, and notes about gates, pets, slopes, cleanup, or photos.

Confirmation, admin labels, email subjects, exports, validation messages, and form helper copy must say Evergreen Yardworks and lawn/landscaping language.

## Interactions And Motion

Add accessible, useful interactions in the existing JS/SCSS:

- Header dropdown rail panels update right-side photo/content on hover and keyboard focus.
- Homepage service selector changes active service detail and image.
- Seasonal guide tabs or segmented controls for spring, summer, fall, winter.
- Estimate checklist for selectable service interests.
- Scroll reveal for service cards and process steps, respecting `prefers-reduced-motion`.
- Optional route line, mowing-stripe, or checklist progress effect.

Avoid distracting parallax, giant decorative blobs, purple/blue gradients, or anything that hurts readability.

## Footer

Fully redesign and personalize the footer:

- Evergreen Yardworks brand statement.
- CTA: request an estimate or schedule a cleanup.
- Services links matching the taxonomy.
- Plans links.
- Seasonal guide links.
- Service-area note.
- Contact block: `(555) 014-7826` and `hello@evergreenyardworks.example`.
- Hours: `Office replies Monday-Friday; crew schedules vary by season and weather.`
- Copyright: `2026 Evergreen Yardworks.`

Footer mobile requirement: at 390px, every footer column, nav link, contact line, email address, and footer CTA must fit without horizontal overflow. Do not use grid-column spans, min-width values, nowrap links, or wide inline contact rows on mobile. Stack footer widgets to one column at small widths, allow `hello@evergreenyardworks.example` to wrap with `overflow-wrap: anywhere`, and keep all footer links inside the viewport.

## Other Pages

About: local property-care philosophy, crew standards, scheduling approach, and seasonal mindset.

Services: full lawn care and landscaping taxonomy.

Single Service: recurring lawn maintenance or seasonal cleanup service detail.

Work: project examples with seeded photos and realistic descriptions.

Blog: homeowner seasonal education.

Contact: estimate-focused form and service-area expectations.

Search, archive, 403, 404, documentation, accessibility docs, README, CHANGELOG, forms, admin copy, and fallback text must all use Evergreen Yardworks language.

## Stale Content Ban

Before finishing, search the whole prepared theme source and remove these terms if present:

- Brightlane
- Commerce Engineering
- WordPress agency
- Shopify agency
- WooCommerce migration
- Circuit Commerce Studio
- Stackforge Commerce Labs
- Northstar Websites
- Northstar Codeworks
- Nolan Designs
- software development agency
- ecommerce planning
- analytics instrumentation
- generated-bitmap

This ban applies to every PHP template, template part, helper, form handler, admin label, README, CHANGELOG, accessibility note, customization doc, SCSS file, compiled CSS output, JS strings, SVG titles/descriptions, image alt text, and fallback/error page.

The copied template may contain old files that are not visible on the homepage. You must still convert them. In particular, do not leave stale identity in:

- `403.php`
- `404.php`
- `README.md`
- `CHANGELOG.md`
- `accessibility/README.md`
- `assets/icons/README.md`
- `docs/customization.md`
- `footer.php`
- `inc/forms.php`
- `inc/helpers.php`
- `page-templates/template-about-us.php`
- `template-parts/content-brand-statement.php`
- `template-parts/content-footer-widgets.php`
- `template-parts/content-hero.php`
- `src/scss/abstracts/_variables.scss`
- `assets/css/bundle.css` after running `npm run build`

All old blue/orange/teal software-theme colors must be replaced in source and compiled assets:

- `#2563eb`
- `#1d4ed8`
- `#14b8a6`
- `#f97316`

The generated source should reference the seeded photo inventory throughout the real templates, not only in one homepage image. Use the lawn, crew, installation, maintenance, planting, and meadow images across hero, services, work, guide, about, dropdown, process, and footer/texture areas.

The final theme must clearly look and read like a lawn care and landscaping company website.
