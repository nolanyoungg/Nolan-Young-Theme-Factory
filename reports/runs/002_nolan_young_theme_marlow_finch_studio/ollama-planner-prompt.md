# Ollama Planner Stage

Theme slug: `002_nolan_young_theme_marlow_finch_studio`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/01-premium-photography-studio.txt`

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

Theme slug: 002_nolan_young_theme_marlow_finch_studio
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

Create a premium classic WordPress theme for a boutique photography studio.

The brand should feel editorial, warm, cinematic, and high-end. Build a complete, installable classic WordPress theme with polished responsive layouts and a matching static GitHub Pages preview.

Required site sections and pages:
- Home
- About Us
- Services
- Work
- Blog
- Contact
- Policies

Homepage requirements:
- Strong hero with a clear brand statement and booking-oriented CTA
- Featured work section
- Services overview
- Process or approach section
- Testimonials
- Blog or journal preview
- Final contact or booking CTA

Design direction:
- Use local assets only
- Avoid remote CDNs, external fonts, and stock-looking filler
- Use real, specific copy with a refined visual system
- Make navigation, spacing, typography, and image treatment feel polished and intentional

Content requirements:
- Write believable copy for a real studio, not placeholder text
- Include service details, work examples, contact language, and policy content
- Keep the tone professional, confident, and human

Build and output requirements:
- Produce a complete classic WordPress theme with compiled local assets
- Produce a matching static preview for GitHub Pages
- Produce all seven required static preview pages:
  - homepage_preview.html
  - services_preview.html
  - about-us_preview.html
  - contact_preview.html
  - single_services_preview.html
  - blog_preview.html
  - work_preview.html
- Make each static preview feel like a static render of the matching WordPress template with the same header, footer, section order, classes, image assets, cards, and buttons
- Implement the Nolan-menu header system:
  - desktop layout is logo, Services/About/Work/Blog primary nav, and a right-side Contact Us CTA
  - Contact is not a primary desktop nav item
  - Services, About, and Blog open accessible Nolan-menu panels
  - Work is a direct link
  - mobile drawer works without hover
- Because this prompt is for a photography studio, use local copyright-safe raster photography assets for hero, portfolio, service cards, editorial sections, and proof sections
- Package the theme as a ZIP ready for WordPress upload
- Validate structure, quality, security, preview linkage, and ZIP freshness

Do not use lorem ipsum, TODO placeholders, gray image boxes, hotlinked images, CDN assets, or weak fallback pages.
