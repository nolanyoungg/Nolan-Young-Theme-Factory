# Ollama Planner Stage

Theme slug: `000_nolan_young_theme_premium_landscape_design_company`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/premium-landscape-design-company.txt`

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

Theme slug: 000_nolan_young_theme_premium_landscape_design_company
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

Create a premium classic WordPress theme for Aster Grove Landscape Design, a high-end residential landscape design and build company serving homeowners who want outdoor spaces that feel architectural, calm, and deeply livable.

Creative direction:
- The site should feel refined, grounded, editorial, and warm, not like a generic contractor template.
- Visual language should combine natural stone, sculptural planting, clean masonry, outdoor living spaces, garden rooms, evening lighting, and precise site planning.
- Use a palette inspired by limestone, deep garden green, weathered bronze, warm cream, clay, and soft charcoal.
- Typography should feel premium and crafted. Avoid default-looking type choices.
- Use generous spacing, layered image compositions, refined cards, strong section rhythm, and subtle texture.

Business positioning:
- Aster Grove designs and builds complete outdoor environments: front entries, garden rooms, terraces, poolside planting, outdoor kitchens, courtyard retreats, lighting plans, and seasonal stewardship.
- The brand promise is practical elegance: beautiful landscapes that are planned clearly, built carefully, and maintained with long-term stewardship.
- The audience includes discerning homeowners, architects, builders, and estate managers.

Required pages and content:
- Homepage with a polished hero, clear positioning, services overview, featured work, trust or proof, design-build process, testimonials or client proof, industry-appropriate imagery, blog/resource preview, strong CTA, and premium footer.
- Services page describing design-build, planting design, outdoor living, estate stewardship, lighting and seasonal care.
- Single service page focused on complete garden design and build, with process, deliverables, timeline, and CTA.
- About page telling the studio story, values, working style, and quality standards.
- Work/portfolio page with at least three detailed project previews and local imagery.
- Blog/resources page with practical editorial posts such as garden planning, material selection, seasonal care, and outdoor room design.
- Contact page with a consultation-focused form, fit criteria, service area language, and next-step expectations.

Static preview:
- Create matching static preview pages for homepage, services, about, work, blog, contact, and single service.
- The static preview must visually match the WordPress templates: same header, footer, class names, section order, copy style, cards, buttons, imagery, and responsive assumptions.
- Header links must connect all required preview pages.

Header:
- Implement the Nolan-menu header system.
- Desktop nav items must be Services, About, Work, and Blog.
- Contact must be a right-side Contact Us CTA, not a primary desktop nav item.
- Services, About, and Blog need accessible dropdown panels with the required Nolan-menu data attributes, rail controls, ARIA controls, and expanded state.
- Include mobile drawer behavior, Escape handling, outside-click close behavior, scroll lock, and active rail switching in local JavaScript.

Assets:
- Use local, copyright-safe raster demo images that fit landscape design and outdoor living.
- Image subjects should include garden pathway, outdoor terrace, planting plan detail, stonework, evening lighting, courtyard retreat, outdoor dining, and seasonal planting texture.
- Store WordPress theme images under the theme's `assets/images/` folders.
- Store static preview images under `docs/themes/<slug>/assets/images/`.
- Do not use remote images, CDNs, hotlinked assets, watermarked stock, client photos, celebrity photos, or gray image boxes.

Technical requirements:
- Produce an installable classic WordPress theme.
- Include the required minimum theme structure from `contracts/required-theme-structure.md`.
- Generate source SCSS and JavaScript plus compiled `assets/css/bundle.css` and `assets/js/bundle.js`.
- Enqueue only compiled local assets in WordPress.
- Include `package.json`, `package-lock.json`, and `build/webpack.config.js` so `npm install` and `npm run build` work.
- Include all required static preview files, preview CSS, preview JS, preview README, and preview image README.
- Avoid remote runtime dependencies.
- Avoid secrets, tracking scripts, analytics snippets, unsafe PHP execution patterns, and unescaped output.
- Avoid lorem ipsum, unfinished copy, sample services, generic AI marketing filler, and unstyled skeleton sections.

The final result should feel like a complete website a premium landscape design company could review with confidence.
