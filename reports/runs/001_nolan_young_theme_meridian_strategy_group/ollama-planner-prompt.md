# Ollama Planner Stage

Theme slug: `001_nolan_young_theme_meridian_strategy_group`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/00-first-ollama-baseline-professional-services.txt`

Repository root: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory`

Read these files before planning:
- AGENTS.md
- agents/00-orchestrator.md
- agents/01-planner.md
- instructions/00-global-instructions.md
- instructions/01-planning-instructions.md
- contracts/theme-versioning.md
- contracts/required-theme-structure.md
- contracts/premium-output-standard.md
- contracts/nolan-menu-header.md
- contracts/local-image-rules.md

Task:
- create a concise implementation plan for the next generated theme
- preserve the prompt intent exactly
- identify the page map, content direction, design direction, risks, and execution priorities
- plan the seven required static preview pages and how they mirror WordPress templates
- plan the Nolan-menu header and local image asset set
- do not write theme files
- do not output file blocks

Theme slug: 001_nolan_young_theme_meridian_strategy_group
Selected Ollama model: qwen2.5-coder:14b


## Non-Negotiable Premium Output Standard

Follow the selected user prompt as the creative brief. Do not produce a generic agency site unless the prompt asks for one.
Use the required WordPress structure as the scaffold, but make the design, copy, imagery, and page staging fit the prompt.
The final output must look like a polished premium company website, not a file checklist.
Build a complete sticky Nolan-menu header with logo, Services/About/Work/Blog nav, and a right-side Contact Us CTA. Contact must not be a primary desktop nav item.
Use the exact Nolan-menu data attributes and ARIA behavior from contracts/nolan-menu-header.md.
Use local copyright-safe image assets that match the generated business category. Do not hotlink images or use CDNs.
Create matching WordPress templates and static preview pages with the same header, footer, classes, section order, image assets, and visual hierarchy.
Create all seven required static preview pages: homepage_preview.html, services_preview.html, about-us_preview.html, contact_preview.html, single_services_preview.html, blog_preview.html, and work_preview.html.
Do not use lorem ipsum, placeholder copy, gray boxes, sample text, TODOs, or generic filler.

Read and obey these contracts:
- contracts/premium-output-standard.md
- contracts/nolan-menu-header.md
- contracts/local-image-rules.md
- contracts/required-preview-structure.md
- contracts/required-theme-structure.md
- contracts/quality-rules.md

## User Prompt

Create the first clean baseline theme after the generated-output reset.

Use the theme slug `001_nolan_young_theme_meridian_strategy_group`.

Build a premium classic WordPress theme for a polished professional service company. Use one cohesive business concept: a high-end operations and compliance consulting firm for growing healthcare, wellness, and professional-services organizations. The brand should feel precise, calm, senior, and expensive without looking like a generic agency site.

Suggested brand:
- Name: Meridian Strategy Group
- Positioning: Operational systems, compliance readiness, and service-design consulting for founder-led companies that need stronger processes before scaling.
- Audience: Clinic owners, wellness groups, boutique service firms, and regional professional-services companies.
- Tone: Direct, polished, specific, credible, and practical.

The site must feel complete and client-ready, not like a thin demo. Write all content as if this is a real firm with a mature service model.

Required pages and sections:
- Home
- Services
- Single Service
- About Us
- Work
- Blog
- Contact
- Policy content where required by the WordPress theme scaffold

Homepage requirements:
- Premium hero with clear positioning and a strong consultation CTA
- Services overview
- Featured work or case-study proof
- Trust/proof section with specific metrics or outcomes
- Process section
- Testimonials or proof quotes
- Blog/resource preview
- Final CTA and full footer

Service direction:
- Operating Model Design
- Compliance Readiness
- Client Experience Systems
- Leadership Dashboards

Static preview requirements:
- Create `index.html`
- Create `homepage_preview.html`
- Create `services_preview.html`
- Create `about-us_preview.html`
- Create `contact_preview.html`
- Create `single_services_preview.html`
- Create `blog_preview.html`
- Create `work_preview.html`
- Header links must click between all required preview pages
- Static previews must visually match the WordPress templates

Nolan-menu header requirements:
- Desktop structure: logo, then Services | About | Work | Blog, then Contact Us CTA
- Contact must not be a primary nav item
- Services, About, and Blog open Nolan-menu panels
- Work is a direct link
- Contact Us links to Contact
- Sticky header with top and scrolled states and no layout shift
- Solid polished backgrounds, strong z-index, no transparent dropdowns
- Use required `data-menu-item`, `data-menu-dropdown`, `data-rail-item`, and `data-rail-content` attributes
- Menu triggers must use `aria-controls` and update `aria-expanded`
- One panel open at a time; same trigger closes; outside click closes; Escape closes; backdrop appears; body scroll locks; focus-visible states are strong
- Rail hover and keyboard focus update right content

Image requirements:
- Use only local copyright-safe raster assets that match the consulting and operations concept.
- Good image subjects include advisory work sessions, planning boards, leadership dashboards, clinic operations details, office materials, process diagrams, and professional workspace details.
- Do not use external image URLs, CDNs, remote fonts, watermarked stock, client photos, celebrity photos, gray image boxes, or generic placeholders.
- Store images under the required theme and preview asset folders with descriptive filenames.

Build and quality requirements:
- Produce the complete required WordPress theme file tree.
- Include local CSS and JS with compiled `assets/css/bundle.css` and `assets/js/bundle.js`.
- Include `package.json`, `package-lock.json`, and `build/webpack.config.js`.
- Do not enqueue source SCSS or source JS.
- No lorem ipsum, TODO text, placeholder copy, sample services, coming soon text, dummy content, or generic filler.
- No remote scripts, CDN dependencies, tracking snippets, API keys, secrets, unsafe PHP execution, or `.env` values.
- Package as a ZIP and pass the repo validation scripts.
