# Ollama Builder Stage

Theme slug: `001_nolan_young_theme_premium_landscape_design_company`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/premium-landscape-design-company.txt`

Repository root: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory`

Read these files before building:
- AGENTS.md
- agents/00-orchestrator.md
- agents/02-theme-architect.md
- agents/03-wordpress-builder.md
- agents/04-design-director.md
- agents/05-content-writer.md
- instructions/00-global-instructions.md
- instructions/02-theme-scaffolding-instructions.md
- instructions/03-wordpress-build-instructions.md
- instructions/04-design-style-instructions.md
- instructions/05-content-instructions.md
- contracts/required-theme-structure.md
- contracts/file-block-format.md
- contracts/premium-output-standard.md
- contracts/nolan-menu-header.md
- contracts/local-image-rules.md
- contracts/quality-rules.md

The plan file is:
- /c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/reports/runs/001_nolan_young_theme_premium_landscape_design_company/plan.md

Task:
- produce a compact JSON site specification for the deterministic local renderer
- do not emit files, file blocks, Markdown, code fences, implementation guides, apologies, or commentary
- output one JSON object only
- keep strings short and concrete so the local renderer can produce the required WordPress theme and static preview
- include prompt-specific business name, industry, tone, hero headline, hero copy, services, work/project cards, resource/blog cards, process steps, proof chips, testimonial, region, and image direction
- do not include remote asset URLs, CDN references, secrets, placeholder copy, TODOs, lorem ipsum, sample services, or unfinished notes
- the renderer will create the complete theme, local raster images, Nolan-menu behavior, static preview, build files, and required structure from this JSON

Theme slug: 001_nolan_young_theme_premium_landscape_design_company
Selected Ollama model: qwen2.5-coder:14b

Required JSON shape:
{
  "brandName": "Short business name",
  "industry": "Specific industry",
  "region": "Service area or appointment note",
  "tone": "Short tone phrase",
  "eyebrow": "Short brand/category label",
  "heroTitle": "Premium homepage headline",
  "heroText": "One sentence homepage lede",
  "services": [
    { "title": "Service name", "text": "Specific service description" }
  ],
  "projects": [
    { "title": "Work card title", "text": "Specific work result" }
  ],
  "resources": [
    { "title": "Resource title", "text": "Specific resource summary" }
  ],
  "process": [
    { "title": "Process step", "text": "Specific process description" }
  ],
  "proof": ["Short proof chip", "Short proof chip", "Short proof chip"],
  "testimonial": "Believable client quote without client secrets",
  "imageDirection": "Local demo image subjects that fit the business"
}


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

## Plan

# Implementation Plan for Premium Landscape Design Company Theme

## Overview
This plan outlines the creation of a premium WordPress theme for Aster Grov
Grove Landscape Design, focusing on delivering a refined, editorial, and wa
warm aesthetic. The implementation will adhere to the specified guidelines 
and contracts to ensure a polished professional look.

### Key Elements:
- **Theme Slug**: `001_nolan_young_theme_premium_landscape_design_company`
- **Selected Model**: qwen2.5-coder:14b
- **Output Standard**: Premium, refined, editorial, warm

## Page Map and Content Direction
1. **Homepage**:
   - Polished hero section
   - Services overview
   - Featured work
   - Trust/proof section
   - Design-build process
   - Testimonials or client proof
   - Blog/resource preview
   - Strong CTA
   - Premium footer

2. **Services Page**:
   - Design-build description
   - Planting design description
   - Outdoor living description
   - Estate stewardship description
   - Lighting and seasonal care description

3. **Single Service (Complete Garden Design and Build)**:
   - Process
   - Deliverables
   - Timeline
   - CTA

4. **About Page**:
   - Studio story
   - Values
   - Working style
   - Quality standards

5. **Work/Portfolio Page**:
   - At least three detailed project previews with local imagery

6. **Blog/Resources Page**:
   - Practical editorial posts: garden planning, material selection, season
seasonal care, outdoor room design

7. **Contact Page**:
   - Consultation-focused form
   - Fit criteria
   - Service area language
   - Next-step expectations

## Design Direction
- **Palette**: Limestone, deep garden green, weathered bronze, warm cream, 
clay, soft charcoal
- **Typography**: Premium and crafted, avoiding default type choices
- **Layout**: Generous spacing, layered image compositions, refined cards, 
strong section rhythm, subtle texture
- **Visual Elements**: Natural stone, sculptural planting, clean masonry, o
outdoor living spaces, garden rooms, evening lighting, precise site plannin
planning

## Risks and Execution Priorities
1. **Risks**:
   - **Design Misalignment**: Ensure the design adheres to the creative bri
brief.
   - **Content Quality**: Use high-quality copy and imagery that aligns wit
with the brand promise.
   - **Technical Issues**: Avoid remote runtime dependencies and ensure all
all assets are local.

2. **Execution Priorities**:
   - **Header Implementation**: Implement the Nolan-menu header system, ens
ensuring accessibility and responsiveness.
   - **Static Preview Pages**: Create matching static preview pages for all
all required WordPress templates.
   - **Local Image Assets**: Use local, copyright-safe raster demo images t
that fit the landscape design and outdoor living theme.

## Required Static Preview Pages
1. **homepage_preview.html**
2. **services_preview.html**
3. **about-us_preview.html**
4. **contact_preview.html**
5. **single_services_preview.html**
6. **blog_preview.html**
7. **work_preview.html**

### Mirroring WordPress Templates:
- Each preview page will mirror the corresponding WordPress template, inclu
including the same header, footer, classes, section order, image assets, an
and visual hierarchy.

## Nolan-menu Header and Local Image Asset Set
- **Header**:
  - Desktop nav items: Services, About, Work, Blog
  - Right-side Contact Us CTA (not a primary desktop nav item)
  - Accessible dropdown panels with required Nolan-menu data attributes, ra
rail controls, ARIA controls, expanded state.
  - Mobile drawer behavior, Escape handling, outside-click close behavior, 
scroll lock, and active rail switching in local JavaScript.

- **Local Image Asset Set**:
  - Subjects: garden pathway, outdoor terrace, planting plan detail, stonew
stonework, evening lighting, courtyard retreat, outdoor dining, seasonal pl
planting texture
  - Store WordPress theme images under `assets/images/` folders.
  - Store static preview images under `docs/themes/<slug>/assets/images/`.

## Technical Requirements
- **Theme Structure**: Include the required minimum theme structure from co
contracts.
- **Assets**:
  - Generate source SCSS and JavaScript, plus compiled `assets/css/bundle.c
`assets/css/bundle.css` and `assets/js/bundle.js`.
  - Enqueue only compiled local assets in WordPress.
  - Include `package.json`, `package-lock.json`, and `build/webpack.config.
`build/webpack.config.js` so `npm install` and `npm run build` work.
- **Static Preview Files**: Create all required static preview files, previ
preview CSS, preview JS, preview README, and preview image README.

## Conclusion
This plan ensures that the theme is built to meet the premium standard whil
while adhering to the provided contracts. The focus on design alignment, co
content quality, and technical accuracy will result in a complete website t
that a premium landscape design company can confidently review.
