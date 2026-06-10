# Ollama Planner Stage

Theme slug: `003_nolan_young_theme_description`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/003-landscape-architecture-studio.txt`

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

Theme slug: 003_nolan_young_theme_description
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

Create a premium classic WordPress theme for a high-end landscape architecture studio.

This theme must be a fresh concept. Do not reuse the advisory consulting theme, the photography studio theme, or any prior generated layout as a design reference. Build it from scratch around a different business.

Brand direction:
- Name: Aster & Field Landscape Studio
- Positioning: A refined landscape architecture practice for residences, hospitality properties, and public-facing gardens.
- Audience: Design-led homeowners, property developers, hospitality operators, and institutions that want elegant outdoor spaces with lasting structure.
- Tone: Editorial, calm, precise, and premium.

Site goals:
- Feel like a finished, high-end studio website.
- Make the homepage immersive and visually confident.
- Include a strong visual rhythm, deeper content hierarchy, and more interactive-feeling sections than a basic brochure site.
- Use local copyright-safe raster images only.
- Avoid CDN assets, remote images, placeholder blocks, or generic filler.

Required pages:
- Home
- About
- Services
- Work
- Journal
- Contact
- Single Service
- Policies

Homepage requirements:
- An immersive hero with a clear studio statement and a strong invitation to inquire.
- Services or studio offerings presented with editorial weight.
- A featured work section with real project language.
- A process or approach section that explains how the studio works.
- A values or materials section that explains the studio point of view.
- A journal or insight preview.
- A clear final CTA and a memorable footer.

Design requirements:
- The site should feel architectural, calm, and materially rich.
- Use a premium editorial layout with restraint, texture, and thoughtful spacing.
- Add subtle interactive touches in the theme JS, but keep the experience polished and stable.
- The header must still use the Nolan-menu system with Services/About/Work/Blog style behavior adapted to this brand as needed by the repository rules.

Technical requirements:
- Use the next numeric theme slug: `003_nolan_young_theme_description`.
- Build a complete classic WordPress theme.
- Build the seven required static preview pages.
- Keep the preview visually aligned with the WordPress theme.
- Keep all assets local.
- Make the result installable, validated, packaged, and ready to push.

Do not copy content, section order, imagery, or styling from the earlier generated themes. Treat this as a fresh concept.
