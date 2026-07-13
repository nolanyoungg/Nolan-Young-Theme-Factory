# Cinderline Digital Systems — 007–009 Generation Benchmark

Create a complete, production-minded WordPress theme for **Cinderline Digital Systems**, a premium WordPress and WooCommerce design and engineering studio. This single brief is the shared benchmark for themes 007, 008, and 009 across Codex, Ollama, and LM Studio generation modes.

The normalized benchmark description slug is `cinderline_digital_systems`; the runner supplies the numbered prepared theme slug. Work only within the current prepared theme directory. Preserve the existing theme architecture where it is sound, but transform the starter into a distinctive, coherent Cinderline website. Do not create previews, reports, ZIP files, or repository infrastructure during generation.

The site must communicate careful engineering, strong visual judgment, accessible interaction design, and practical commercial understanding. It should feel like a finished studio website, not a recolored starter, generic SaaS landing page, or speculative portfolio.

## Business Identity

Business name: **Cinderline Digital Systems**

Short name where space is constrained: **Cinderline**

Business category: Premium WordPress and WooCommerce design and engineering studio.

Core positioning: Cinderline plans, designs, builds, improves, and supports content-rich WordPress websites and WooCommerce stores for established service businesses, specialist retailers, publishers, and lean internal marketing teams. The studio combines interface design, theme engineering, commerce implementation, performance work, content architecture, accessibility, integrations, and ongoing technical stewardship.

Primary audience:

- Owners and marketing leaders replacing an outdated or difficult-to-manage WordPress website.
- Established retailers planning a more capable WooCommerce storefront.
- Design or content teams that need a senior implementation partner.
- Organizations with complex content, editorial, product, integration, accessibility, or performance requirements.
- Teams inheriting a fragile theme and needing a clearer technical path.

Primary conversion goal: Start a project-fit conversation through the consultation form.

Secondary conversion goals:

- Explore WordPress and WooCommerce services.
- Review representative project scenarios and engineering approaches.
- Understand the studio process.
- Read practical resources.
- Join the studio newsletter.

Brand personality: exacting, warm, senior, direct, editorial, commercially aware, technically credible, calm under pressure, and free of empty agency hype.

Brand voice:

- Use concise, specific language with enough technical detail to earn trust.
- Explain what Cinderline does, why a decision matters, and what a client can expect.
- Prefer “clear product structure,” “maintainable theme systems,” and “measured performance work” over vague claims such as “world-class digital experiences.”
- Avoid inflated adjectives, trend jargon, fake urgency, and absolute guarantees.
- CTAs should be direct: “Discuss your project,” “Explore WooCommerce engineering,” “See the working approach,” and “Read the field notes.”

Truthfulness rules:

- Do not invent clients, awards, certifications, office locations, employee counts, partner badges, revenue, conversion lifts, speed scores, review totals, star ratings, launch counts, or years in business.
- Do not write fabricated testimonials or attribute quotations to fictional people or companies.
- Representative work may be presented only as clearly labeled project scenarios, implementation patterns, or example engagements.
- Do not promise rankings, guaranteed sales, guaranteed accessibility compliance, or guaranteed performance scores.
- Use qualitative proof grounded in process: documented decisions, accessible patterns, local assets, maintainable source, testing, clear handoff, and ongoing improvement options.

## Style / CSS Requirements

Build a visually distinctive editorial-technical system rather than reusing a blue SaaS or generic agency aesthetic.

Required visual qualities:

- Warm off-white canvases, near-black editorial panels, restrained ember accents, precise rules, and strong typographic hierarchy.
- A modular grid that can shift between quiet editorial layouts and dense engineering detail.
- Deliberate asymmetry in hero and case-study compositions without sacrificing readability.
- Thin rule lines, small technical labels, compact metadata, numbered process markers, and subtle diagram-like connectors.
- Large breathing room around major statements, followed by tighter information-rich grids.
- Consistent containers, section spacing, card radii, borders, buttons, form controls, media crops, and focus treatments.
- Mobile layouts that feel deliberately recomposed rather than merely stacked.

Avoid:

- Default blue-and-purple gradients.
- Glassmorphism everywhere.
- Excessive rounded pills or floating dashboard cards.
- Repeated three-card sections with no change in rhythm.
- Huge empty areas that force users to scroll past little information.
- Decorative code snippets that imply technology choices not supported by the site.
- Inline `<style>` blocks or style attributes in PHP templates.
- External font, icon, image, or JavaScript CDNs.

Use reusable classes and established SCSS partials. Keep presentation in SCSS source. Do not solve layout problems with large one-off selectors tied to a single paragraph.

### CSS Architecture

Treat `src/scss/main.scss` as the explicit entry point and retain a clear partial structure.

Expected responsibilities:

- `src/scss/abstracts/`: palette, spacing, type scales, breakpoints, mixins, and reusable functions.
- `src/scss/base/`: reset, typography, accessibility, forms, and global document behavior.
- `src/scss/components/`: buttons, cards, accordions, filters, badges, forms, media treatments, and other reusable interface patterns.
- `src/scss/layout/`: container, grid, header, footer, and shared section composition.
- `src/scss/pages/`: homepage and page-specific enhancements that cannot reasonably remain shared.

Requirements:

- Use custom properties or SCSS variables consistently for the defined design tokens.
- Keep source readable and grouped by component responsibility.
- Avoid specificity escalation, repeated magic numbers, `!important` except for a narrowly justified accessibility utility, and duplicated breakpoint logic.
- Ensure every new class used by the PHP templates has intentional styling or inherits a clearly appropriate shared pattern.
- Keep `style.css` as valid WordPress theme metadata, not as the main compiled stylesheet.
- The model must edit source only. Do not edit `assets/css/bundle.css`, `assets/js/bundle.js`, or `package-lock.json`; deterministic build work owns those artifacts.

### Content Requirements

Every visible section must be written for Cinderline Digital Systems.

Required content themes:

- WordPress design systems and custom theme engineering.
- WooCommerce storefront structure and commerce implementation.
- Content modeling and editorial workflow design.
- Performance diagnosis and measured improvement.
- Accessibility-minded design and implementation.
- Integration planning for operational tools and commerce services.
- Migration and inherited-theme stabilization.
- Documentation, handoff, maintenance, and retained improvement.

Write realistic service explanations and clearly labeled representative scenarios. A scenario may describe a specialist retailer reorganizing product discovery, a publisher simplifying editorial patterns, or a service company replacing a fragile page-builder implementation, but it must not imply that Cinderline performed work for a named real client.

All links must point to real generated routes, meaningful anchors, or valid WordPress destinations. Do not use `href="#"`, empty links, dead CTA buttons, or navigation labels without a destination.

All starter identity and stale business copy must be removed from visible content, metadata, documentation, alt text, form labels, admin labels, email subjects, and footer text. Do not leave Northstar, Forgecart, Brightlane, Stackforge, Circuit, Evergreen, Atlasframe, Nolan Designs, or generic template business copy.

### Accessibility and Motion

Motion should clarify state and hierarchy, never delay access to content.

Required motion patterns:

- A restrained hero entrance using opacity and short transforms.
- Header state changes that respond to scrolling without visual jitter.
- Accessible dropdown, drawer, accordion, and portfolio-filter transitions.
- Optional section reveals driven by `IntersectionObserver`, with content visible by default when JavaScript is unavailable.
- A subtle progress-line, underline, or connector animation may reinforce the Cinderline identity.

Motion constraints:

- Respect `prefers-reduced-motion: reduce` in CSS and JavaScript behavior.
- Do not hide essential content until JavaScript runs.
- Avoid parallax, autoplay video, looping attention effects, cursor followers, large continuous marquees, and scroll-jacking.
- Keep transforms from causing horizontal overflow or blurry resting states.
- Focus movement and expanded/collapsed state must remain understandable to keyboard and assistive-technology users.

## Functionality

The finished theme must remain a conventional, maintainable WordPress theme.

Required behavior:

- Valid bootstrap through `functions.php` and the existing `inc/` modules.
- Theme support for title tags, thumbnails, custom logo, responsive embeds, wide alignment, editor styles, and appropriate HTML5 features.
- Registered primary and footer navigation locations.
- Local compiled CSS and JavaScript enqueued through WordPress APIs with safe versioning.
- No runtime dependency on remote assets.
- Reusable service, article, and representative-work data must remain internally consistent wherever used in header panels, homepage sections, page templates, and footer links.
- All template-part references and helper calls must resolve to real generated files and functions.
- Generic WordPress templates must retain safe loops, empty states, escaping, header/footer calls, and semantic landmarks.
- Search, 403, 404, archive, single, page, and index experiences must use Cinderline language and the shared design system.

No stage may create a fallback for a missing helper or conceal incomplete generated source. Missing files, functions, assets, or data contracts are generation failures.

### Webpack Build Requirements

The prepared build system is infrastructure, not a design surface.

- Keep `src/js/main.js` as the JavaScript entry importing `src/scss/main.scss` unless the prepared config explicitly establishes another valid entry.
- Write maintainable source compatible with the existing Webpack, Sass, CSS loader, and extraction configuration.
- Do not add dependencies, external packages, or CDN imports.
- Do not edit `package-lock.json`.
- Do not directly edit compiled `assets/css/bundle.css` or `assets/js/bundle.js`.
- Do not change build configuration merely to work around invalid SCSS or JavaScript.
- SCSS must compile without warnings caused by malformed nesting, missing imports, or undefined variables.
- JavaScript must bundle without syntax errors and must tolerate missing optional DOM targets.

### WordPress Security Requirements

- Escape output according to context with `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`, or equivalent appropriate functions.
- Sanitize and validate every submitted value before storage or email use.
- Use nonces for public and authenticated form actions.
- Apply capability checks before displaying or exporting private submissions.
- Store inquiry and newsletter data as non-public records excluded from search and REST exposure unless the existing architecture requires a safer equivalent.
- Use safe redirects and exit immediately after redirecting.
- Preserve a honeypot or equivalent low-risk spam-control field without exposing it to keyboard users.
- Do not enable unrestricted SVG uploads, execute submitted content, trust request values, or expose private submission data on public routes.
- CSV export must use correct headers and escaped field output without permitting arbitrary file paths.
- Avoid leaking emails, form entries, nonces, environment data, API keys, or absolute filesystem paths.

## Color System

Use the following palette as the source of truth:

- Canvas / warm paper: `#F4EFE6`
- Clean surface: `#FFFDF8`
- Soft secondary surface: `#E9E0D3`
- Near-black ink: `#171513`
- Charcoal panel: `#24201D`
- Primary ember: `#A83A1F`
- Bright ember detail: `#E56A3A`
- Deep teal counterpoint: `#0B6861`
- Primary text on light: `#211E1B`
- Muted text on light: `#665E56`
- Muted text on dark: `#C9BEB1`
- Light border: `#D5CABD`
- Dark border: `#4A423C`
- Success: `#277A51`
- Error: `#A42525`

Usage rules:

- Use near-black and charcoal for high-impact proof, technical detail, and final CTA sections.
- Use primary ember for important actions and active states, with verified readable foreground colors.
- Use bright ember sparingly for rules, diagram nodes, small labels, and decorative highlights; do not use it for long body text on light backgrounds.
- Use deep teal as a controlled counterpoint for commerce, reliability, and successful-system cues.
- Keep warm paper dominant so the experience feels editorial rather than like a dark developer dashboard.
- Maintain WCAG AA contrast for body text, controls, links, active states, and focus indicators.
- Do not reintroduce the starter blue, teal, and orange software palette as the dominant system.

## Visual Design Direction

The design concept is **editorial precision with an ember-line engineering motif**.

The “cinderline” should appear as a restrained visual device: a thin ember rule, numbered connector, cropped diagonal, or small glowing node that helps users follow a sequence. It must never become a decorative gimmick or reduce contrast.

Hero direction:

- Use an asymmetric two-column composition with a concise high-impact headline and the approved workspace photo.
- Layer a small technical project-path panel over or beside the photo using real service labels rather than fake analytics.
- Include one primary CTA, one secondary CTA, and a compact capability line.
- Do not invent client-logo strips, numeric performance claims, or awards.

Section rhythm:

- Alternate warm editorial surfaces with charcoal technical panels.
- Use one wide feature, one dense comparison or service matrix, numbered process rows, representative scenario cards, and a focused FAQ.
- Let photography carry human and workspace context; use CSS lines, grids, and typographic annotations for technical character.
- Maintain consistent image aspect ratios and intentional focal cropping.

Approved local asset contract:

Use the existing `assets/images/asset-manifest.json` as the source of truth. The following six approved software-studio assets must each appear intentionally in visible generated markup at least once. Reference these exact local paths; do not rename, hotlink, replace, or invent provenance for them:

1. `assets/images/hero/agency-workspace.jpg`
   - Required use: homepage hero or primary homepage studio statement.
   - Alt intent: office hallway with glass-panel doors and adjacent work areas.
2. `assets/images/hero/developer-screens.jpg`
   - Required use: header service panel or WordPress engineering service feature.
   - Alt intent: MacBook displaying code on a busy desk.
3. `assets/images/portfolio/ecommerce-planning.jpg`
   - Required use: WooCommerce planning representative scenario or services content.
   - Alt intent: laptop displaying analytics on a glass-top table.
4. `assets/images/portfolio/team-collaboration.jpg`
   - Required use: About page or collaborative process section.
   - Alt intent: people collaborating around a table with laptops.
5. `assets/images/portfolio/performance-review.jpg`
   - Required use: performance engineering representative scenario or Work page feature.
   - Alt intent: laptop screen displaying performance analytics graphs.
6. `assets/images/texture/studio-detail.jpg`
   - Required use: subtle editorial crop in the process, contact, or footer-adjacent composition.
   - This image may be decorative only when rendered with empty alt text; otherwise provide alt text describing the visible scene rather than the brand.

Asset rules:

- All six assets must be referenced by generated PHP source, not only left in the filesystem or mentioned in documentation.
- Do not use a single image repeatedly as a substitute for using the full set.
- Do not invent source URLs, creators, license text, photography descriptions, or acquisition dates.
- Use manifest-compatible alt text that describes the image and its purpose without claiming depicted people work for Cinderline.
- Keep any new local SVG work original, simple, and appropriate for marks, icons, or interface diagrams; do not imitate protected logos.

## Typography Direction

Use local system font stacks only.

Recommended stacks:

- Display and headings: `Arial Black`, `Arial`, `Helvetica Neue`, sans-serif, tuned so weight and spacing remain controlled across platforms.
- Body and interface: `Inter`, `Segoe UI`, `Helvetica Neue`, `Arial`, sans-serif, relying on installed system fonts rather than a network request.
- Technical labels: `SFMono-Regular`, `Consolas`, `Liberation Mono`, monospace.

Typography behavior:

- Hero heading should be bold and compact with a controlled maximum width.
- Section headings should be editorial and specific, not generic labels such as “Our Solutions.”
- Body text should use comfortable measure and line height.
- Eyebrows and metadata should remain readable, not microscopic.
- Use monospace only for small process labels, categories, or technical annotations.
- Preserve clear heading order and avoid using heading elements solely for appearance.

## Header

Create a polished responsive header that feels integrated with the editorial-technical design.

### Header Layout

Desktop structure:

- Cinderline logo/wordmark at left.
- Primary navigation centered or optically balanced in the available space.
- “Discuss a project” CTA at right.
- Services and Studio may use accessible disclosure panels when meaningful content exists.

Mobile structure:

- Brand at left, clearly labeled menu control at right.
- Drawer or expanding panel with logical heading and link groups.
- Primary CTA remains easy to find without covering content.
- Controls and links meet comfortable touch-target sizing.

Use the existing local SVG mark system or create an original restrained Cinderline mark. The mark may suggest a precise line, ember node, bracket, or CDS monogram. Do not use copied mountain, cursor, shopping-bag, or prior-theme symbols.

### Header Behavior

- Header may be sticky, but it must reserve space correctly and never cover anchored content.
- Apply a subtle solid-background and border state after scrolling.
- Desktop disclosure panels must support click, keyboard focus, Escape to close, outside-click close, accurate `aria-expanded`, and predictable focus return.
- Only one disclosure panel may be open at a time.
- Mobile menu must lock problematic background interaction without trapping the user permanently.
- Closing controls, Escape, and meaningful navigation must restore a coherent state.
- Content remains reachable when JavaScript is disabled.

### Header and Navigation

Required primary destinations:

- Home
- Services
  - WordPress Strategy and Design
  - Custom Theme Engineering
  - WooCommerce Design and Development
  - Performance and Accessibility
  - Integrations and Content Systems
  - Maintenance and Improvement
- Work
- Process
- Studio
- Resources
- Contact

Navigation rules:

- Every item must resolve to a generated page or meaningful homepage/page anchor.
- Service titles and slugs must stay consistent with helper data, cards, service templates, mobile links, and footer links.
- Use `assets/images/hero/developer-screens.jpg` intentionally in a services disclosure panel if that panel contains media.
- Do not create an empty mega-menu, placeholder navigation, fake search control, or nonfunctional account/cart icon.

## Accessibility

- Include a visible-on-focus skip link targeting the actual main-content landmark.
- Use one main landmark per page and semantic header, navigation, section, article, aside, and footer elements where appropriate.
- Maintain a logical heading hierarchy with one clear page-level heading.
- Provide visible keyboard focus styles that work on light and dark surfaces.
- All disclosure, drawer, accordion, filter, and form controls must be native controls or have complete keyboard semantics.
- Pair state changes with `aria-expanded`, `aria-controls`, `aria-pressed`, live status text, or other appropriate attributes.
- Do not rely on color alone for active, error, success, or selected states.
- Meaningful images require accurate alt text; decorative images use empty alt text.
- Form labels must remain visible and programmatically associated with inputs.
- Validation and success messaging must be understandable without relying on animation.
- Ensure 390px layouts have no horizontal overflow, clipped hero headings, inaccessible menus, or off-screen CTAs.

## Footer

Create a complete footer that closes the experience with useful navigation and an honest invitation to start a conversation.

Required content:

- Cinderline wordmark and one-sentence positioning statement.
- Compact consultation CTA.
- Service links matching the generated service model.
- Studio, Work, Process, Resources, and Contact links.
- Newsletter form with a concise description of what subscribers receive.
- Privacy and Terms links pointing to real policy destinations.
- Copyright line using the WordPress-localized current year.
- A small build-quality statement may mention accessible patterns, local assets, or maintainable theme source without claiming certification.

Do not invent a street address, telephone number, social account, office location, operating hours, association membership, or platform-partner status. If the prompt supplies no verified contact value, guide visitors to the contact form rather than fabricating one.

### Responsive Footer Behavior

- Desktop may use a strong brand column plus balanced navigation columns.
- Tablet should preserve readable groupings without compressing labels.
- Mobile must stack in a deliberate order: brand and CTA, navigation groups, newsletter, legal row.
- Footer link groups may remain expanded on mobile; do not hide essential links behind unnecessary accordions.
- Newsletter fields and buttons must fit the viewport and retain useful labels.
- No footer content may overlap, overflow, or become too small to activate.

### Accessibility and Visual Quality

- Footer navigation requires an accessible label.
- Links must have visible hover and focus treatment on the dark background.
- Newsletter status must be announced accessibly.
- Muted text must retain sufficient contrast.
- The footer should feel visually resolved and connected to the page, not like a default dark rectangle.
- Reuse established tokens and components; do not introduce a separate footer-only palette.

## Forms

Create a secure and credible inquiry system aligned with the existing theme architecture.

Required behavior:

- Submissions are stored privately and visible only to authorized administrators under a WordPress admin menu labeled **Forms**.
- The admin view must clearly show submission date, form type, name, email, and a safe message summary.
- Authorized users can export all submissions or a selected form type as CSV.
- Public forms use nonces, honeypot handling, sanitization, validation, safe redirects, and clear status messages.
- Form handling must not expose entries through public queries, search, or the REST API.
- Submitted values must not be echoed without context-appropriate escaping.
- The interface must work without client-side validation; JavaScript enhancement is supplementary.

### Required Forms

Primary project consultation form fields:

- Name — required.
- Work email — required and validated.
- Company or organization — optional.
- Current website URL — optional and sanitized as a URL.
- Project focus — required selection: WordPress rebuild, new WordPress site, WooCommerce, performance/accessibility, integration/content system, or ongoing improvement.
- Current situation — required textarea.
- Desired outcome — required textarea.
- Target timing — optional selection with honest ranges.
- Budget range — optional selection using broad project-fit ranges without implying a fixed quote.
- Consent checkbox acknowledging that the information will be used to respond to the inquiry.

Compact service inquiry forms may reuse the same secure handler while passing a sanitized form type and service identifier.

Status behavior:

- Invalid submissions return an actionable error without discarding the user’s understanding of what is required.
- Successful submissions show a concise confirmation without promising a response deadline not established in this brief.
- Email notifications may go to the configured WordPress administrator address; do not hardcode a fabricated business email.

## Newsletter

Create a restrained newsletter signup for practical WordPress, WooCommerce, performance, accessibility, and content-system notes.

Required fields:

- First name — optional.
- Email address — required and validated.

Required behavior:

- Store subscribers privately in the established non-public subscriber model.
- Prevent duplicate active records for the same normalized email.
- Provide an authorized admin list and CSV export.
- Use nonce and honeypot protection.
- Show accessible invalid and success states.
- Do not claim a publication schedule, subscriber count, exclusive community, or guaranteed business result.
- Do not add external email-platform calls or API credentials.

## front-page.php

The front page must be a complete conversion-focused narrative using real template parts and consistent helper data.

### Homepage

Required section flow:

1. **Hero — “WordPress and commerce systems, drawn with intent.”**
   - Explain that Cinderline designs and engineers WordPress and WooCommerce experiences for organizations with serious content and commercial requirements.
   - Primary CTA: “Discuss your project.”
   - Secondary CTA: “Explore the work.”
   - Use `assets/images/hero/agency-workspace.jpg` visibly.
   - Add a small project-path panel with truthful labels such as Discover, Structure, Design, Engineer, Validate, Improve.

2. **Capability line**
   - Present concise capabilities, not fake logos or metrics: WordPress, WooCommerce, Theme Systems, Content Architecture, Performance, Accessibility.

3. **Services matrix**
   - Six service paths matching the navigation and service data.
   - Vary emphasis rather than rendering six identical cards.
   - Use `assets/images/hero/developer-screens.jpg` in the engineering feature if it is not already used visibly in the header.

4. **Why systems fail**
   - Contrast common problems—page-builder drift, inconsistent product content, brittle templates, slow change cycles—with Cinderline’s structured approach.
   - Avoid promising that every technical issue can be eliminated.

5. **WooCommerce planning feature**
   - Use `assets/images/portfolio/ecommerce-planning.jpg`.
   - Discuss product discovery, merchandising structure, checkout dependencies, content operations, and integration boundaries.
   - Label the example as a representative engagement pattern, not a client result.

6. **Working process**
   - Numbered sequence: Frame, Map, Design, Engineer, Validate, Evolve.
   - Each step states a decision or deliverable without inventing a fixed timeline.
   - Use the ember-line motif as a progressive connector.

7. **Representative work scenarios**
   - Specialist retail catalog reorganization.
   - Editorial platform component system.
   - Service-business theme stabilization.
   - Performance review and improvement plan.
   - Clearly identify all as representative scenarios.
   - Use `assets/images/portfolio/performance-review.jpg` for the performance scenario.

8. **Collaboration statement**
   - Explain review checkpoints, documented decisions, content responsibilities, and handoff expectations.
   - Use `assets/images/portfolio/team-collaboration.jpg` here or on the About page.

9. **Technical quality panel**
   - Cover semantic templates, local assets, responsive behavior, accessible interactions, source organization, and deterministic builds.
   - Do not display fake Lighthouse numbers or compliance seals.

10. **Resources preview**
    - Include practical article concepts: planning a WordPress rebuild, defining WooCommerce content structure, evaluating inherited themes, and preparing for a performance review.

11. **FAQ**
    - What makes a project a good fit?
    - Can Cinderline improve an existing theme?
    - How are WooCommerce integrations scoped?
    - What does the client need to prepare?
    - How are accessibility and performance handled?
    - Is ongoing improvement available after launch?

12. **Final CTA**
    - Concise dark-panel invitation to describe the current system and desired outcome.
    - Include `assets/images/texture/studio-detail.jpg` as a restrained crop if it has not been assigned to Contact or Process.

Every homepage section needs a distinct purpose. Do not repeat the same headline, CTA, image, or paragraph structure in multiple sections.

## page-templates to fill in/build out

Complete every existing required page template. Keep header, footer, helper data, navigation, imagery, and CTA destinations consistent across the site.

### Page Templates

`page-templates/template-about-us.php`

- Page title: “A senior studio for consequential WordPress work.”
- Explain Cinderline’s design-and-engineering perspective, working principles, collaboration model, and commitment to maintainable systems.
- Use `assets/images/portfolio/team-collaboration.jpg` visibly if not used on the homepage; reusing it once is acceptable when both placements are intentional.
- Include principles such as frame the real problem, make content structure visible, design for operation, document decisions, and improve after launch.
- Do not invent founder biographies, employee profiles, locations, or years of experience.

`page-templates/template-services.php`

- Introduce the six services with audience, problem, work included, and useful next step.
- Include a comparison or project-fit guide that helps visitors choose a path.
- Use `assets/images/hero/developer-screens.jpg` for the custom-theme engineering feature when appropriate.
- Include a CTA to the contact form without presenting fixed packages or unverifiable pricing.

`page-templates/template-single-service.php`

- Support a service title or safe route-derived service context.
- Include value proposition, suitable situations, likely workstreams, collaboration expectations, technical considerations, FAQ, and a service-aware inquiry form.
- Ensure missing or unknown service context degrades to honest general service language rather than undefined array keys.
- Do not fabricate deliverables that the selected service data does not support.

`page-templates/template-work.php`

- Present representative scenarios with visible labels such as “Representative scenario” or “Engagement pattern.”
- Include challenge context, decision areas, possible workstreams, and what would be validated—not invented outcome metrics.
- Use both `assets/images/portfolio/ecommerce-planning.jpg` and `assets/images/portfolio/performance-review.jpg` in appropriate scenario cards or features.
- Filtering, if retained, must be keyboard operable and show all content without JavaScript.

`page-templates/template-blog.php`

- Create a useful resources landing page with a featured field note and article cards.
- Topics should focus on WordPress rebuild planning, WooCommerce structure, performance diagnosis, accessibility decisions, theme maintenance, and content operations.
- Article URLs may use meaningful generated routes, but do not imply publication dates, authors, or downloads not present in the data.

`page-templates/template-contact.php`

- Page title: “Start with the system you have.”
- Set expectations for a project-fit inquiry without promising a response window.
- Render the complete secure consultation form.
- Include a short preparation checklist and privacy reassurance grounded in the implemented private-storage behavior.
- Use `assets/images/texture/studio-detail.jpg` as a subtle editorial crop if not used on the homepage.
- Do not invent an address, phone number, email address, or opening hours.

`page-templates/template-policy.php`

- Provide a readable policy layout suitable for WordPress-managed Privacy and Terms content.
- Use neutral, clearly structured placeholder policy guidance rather than pretending generated text is legal advice.
- Do not make specific legal or regulatory compliance claims.

Top-level templates:

- `index.php`, `page.php`, `single.php`, and `archive.php` must render safe WordPress loops and useful empty states.
- `search.php` and `searchform.php` must provide accessible labels and Cinderline-specific result language.
- `404.php` and `403.php` must offer useful navigation without blaming the visitor.
- `comments.php` must remain secure and functional if comments are enabled.
- Shared `template-parts/` must be complete, nonempty, and used intentionally; remove stale template copy from parts that remain in the theme.

## README REQUIREMENTS

Update `README.md` for Cinderline Digital Systems.

Required README content:

- Theme name, purpose, and slug.
- WordPress and PHP expectations already supported by the prepared template; do not invent unsupported version guarantees.
- Local setup and deterministic build commands based on the existing `package.json`.
- Source and compiled asset locations.
- Template and template-part overview.
- Navigation locations.
- Forms and newsletter admin behavior.
- Approved asset-manifest location and the rule against hotlinking or invented provenance.
- Accessibility and reduced-motion notes.
- Customization guidance focused on tokens, SCSS partials, content helpers, and WordPress-managed content.
- Clear statement that representative scenarios are examples, not named client case studies.

Do not document features, commands, dependencies, plugins, integrations, custom post types, or configuration that the generated source does not actually contain.

### Supporting Documentation

Update the existing documentation files under `docs/`, `accessibility/`, `blocks/`, and asset README locations where they are part of the prepared theme.

Documentation must:

- Use the Cinderline name consistently.
- Describe actual generated behavior only.
- Explain safe customization boundaries.
- Note local asset use and where provenance is recorded.
- Explain keyboard and reduced-motion behavior at a practical level.
- Avoid copied starter instructions, absolute machine paths, repository-only commands, secrets, and unsupported promises.

### Changelog and License

- Update `CHANGELOG.md` with an honest initial Cinderline theme release entry covering identity, templates, design system, interactions, forms, newsletter, documentation, and approved local asset integration.
- Preserve the supplied license file unless an accurate metadata update is required.
- Do not change license terms, invent third-party license text, or claim ownership of stock photography.
- Keep image provenance in the approved asset manifest; documentation may point to it but must not fabricate missing metadata.

## Definition of done

The generated theme is complete only when all of the following are true:

- Cinderline Digital Systems is the only visible business identity.
- The theme presents a premium WordPress and WooCommerce studio with specific, truthful content.
- All required PHP templates, helpers, data providers, SCSS source, JavaScript source, config files, and documentation exist and are internally consistent.
- Header, desktop disclosures, mobile navigation, footer, accordions, filters, forms, and newsletter behavior are accessible and coherent.
- All six approved software-studio image paths are referenced intentionally in visible PHP markup.
- No remote image, font, icon, script, or stylesheet dependency has been introduced.
- No image provenance, client, testimonial, metric, award, certification, address, team fact, or business result has been invented.
- The homepage and every required page template have complete Cinderline content and distinct page intent.
- All navigation and CTA destinations resolve to real pages, routes, forms, or meaningful anchors.
- All PHP output, request handling, storage, admin viewing, and CSV export follow the stated security requirements.
- SCSS and JavaScript source are compatible with the prepared deterministic build.
- The model has not edited `package-lock.json`, `assets/css/bundle.css`, or `assets/js/bundle.js`.
- No inline PHP styles, unrestricted SVG upload support, horizontal mobile overflow, broken template-part reference, undefined helper, missing asset, or stale starter copy remains.
- README, supporting documentation, changelog, and license references match the actual generated theme.
- Any failed check remains a generation failure; do not add fallbacks, conceal incomplete output, or describe failed output as complete.
