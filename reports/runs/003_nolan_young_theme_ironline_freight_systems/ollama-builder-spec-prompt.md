# Ollama Builder Stage

Theme slug: `003_nolan_young_theme_ironline_freight_systems`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/ironline-freight-systems.txt`

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
- /c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/reports/runs/003_nolan_young_theme_ironline_freight_systems/plan.md

Task:
- produce a compact JSON site specification for the deterministic local renderer
- do not emit files, file blocks, Markdown, code fences, implementation guides, apologies, or commentary
- output one JSON object only
- keep strings short and concrete so the local renderer can produce the required WordPress theme and static preview
- include prompt-specific business name, industry, tone, hero headline, hero copy, services, work/project cards, resource/blog cards, process steps, proof chips, testimonial, region, and image direction
- do not include remote asset URLs, CDN references, secrets, placeholder copy, TODOs, lorem ipsum, sample services, or unfinished notes
- the renderer will create the complete theme, local raster images, Nolan-menu behavior, static preview, build files, and required structure from this JSON

Theme slug: 003_nolan_young_theme_ironline_freight_systems
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

Create a premium website for Ironline Freight Systems, a regional logistics, trucking, and fleet coordination company serving manufacturers, distributors, construction suppliers, and ecommerce operations.

Business positioning:
- Ironline Freight Systems moves time-sensitive freight across regional routes with disciplined dispatch, clear communication, practical tracking, and safety-first operations.
- The company should feel reliable, modern, operationally sharp, and easy to trust.
- The site should communicate control, movement, dispatch clarity, safety standards, and no-drama freight coordination.

Audience:
- Operations managers
- Warehouse teams
- Construction suppliers
- Manufacturers
- Regional distributors
- Ecommerce teams
- Business owners who need dependable freight support without vague communication

Design direction:
- Premium logistics command center
- Industrial but refined
- Strong dark and light contrast
- Clear route maps, dispatch boards, fleet cards, tracking panels, safety signals, and lane diagrams
- Confident, direct, and practical
- Avoid generic stock-truck brochure styling.

Color palette:
- Asphalt charcoal
- Deep navy
- Safety orange
- Steel gray
- White
- Muted road-line yellow
- Cool blue route accents

Layout rhythm:
- Command-center hero
- Route and lane overview
- Services grid
- Fleet capability panels
- Dispatch process timeline
- Safety and compliance proof
- Customer scenario cards
- Quote-focused call-to-action sections

Artwork direction:
- Regional route maps
- Dispatch console
- Fleet capacity cards
- Warehouse handoff diagrams
- Road lane patterns
- Shipment tracking panels
- Safety checklist visuals
- Quote request workflow
- Avoid celebrity images, watermarked stock, and empty gray placeholder boxes.

Header and navigation:
- Brand/logo area: Ironline Freight Systems
- Desktop navigation should include Services, About, Work, and Resources.
- Request a Quote should be the prominent right-side call-to-action.
- Services should open a rich panel with service categories.
- About should open a rich panel with company standards.
- Resources should open a rich panel with useful planning guides.
- Work should link directly to project stories or customer scenarios.
- The mobile header should use a dedicated drawer with organized service and resource sections.

Services panel rail labels:
- Regional Truckload
- LTL Coordination
- Construction Supply Runs
- Ecommerce Distribution
- Dedicated Fleet Support
- Expedited Freight

About panel rail labels:
- Dispatch Standards
- Safety Culture
- Communication Promise

Resources panel cards:
- Freight Quote Checklist
- How To Prepare A Palletized Shipment
- Choosing Dedicated Fleet Support
- Reducing Delivery Window Misses

Homepage requirements:
- Build a complete homepage with a strong command-center hero.
- Include a problem statement about late updates, vague freight handoffs, and unreliable delivery windows.
- Include a services grid.
- Include a regional route or lane overview.
- Include a fleet and capacity section.
- Include a dispatch process timeline.
- Include safety and compliance proof.
- Include customer scenario cards.
- Include testimonials or operational proof.
- Include helpful resource previews.
- Include an FAQ section.
- Include a strong final quote call-to-action.

Footer requirements:
- Large quote call-to-action band
- Brand statement
- Services column
- Company column
- Resources column
- Dispatch/contact block
- Small quote or email signup area
- Bottom legal row

About page:
- Company story
- Dispatch standards
- Safety culture
- Communication principles
- Fleet and partner standards
- Call to action

Services page:
- Service overview
- Detailed service sections
- Comparison grid for service types
- Dispatch process
- FAQ
- Call to action

Single service page:
- Focus on dedicated fleet support.
- Explain ideal fit, recurring lanes, scheduling, dispatch communication, service-level expectations, reporting, and next steps.

Work page:
- Include at least twelve customer scenario cards.
- Include filters by freight type or industry.
- Include a featured logistics case study.
- Include route, dispatch, and capacity visuals.
- Include a quote call-to-action.

Resources page:
- Include a planning library.
- Include at least six helpful article cards.
- Include topic cards for quoting, packaging, routing, and delivery windows.
- Include a call to action.

Contact page:
- Quote-focused inquiry form
- Name
- Email
- Company
- Pickup location
- Delivery location
- Freight type
- Timeline
- Message
- Dispatch contact details
- Quote expectations
- FAQ
- Final call to action

Interaction expectations:
- Fast and practical motion
- Reduced-motion-friendly effects
- Header panel behavior
- Mobile drawer behavior
- Service or scenario filtering
- Testimonials or customer proof behavior where useful
- Scroll reveal where it helps the story

Accessibility expectations:
- Clear navigation
- Keyboard-friendly menus
- Visible focus states
- Labeled forms
- Strong contrast
- Clear expanded and collapsed states
- Proper heading order
- No placeholder copy

Quality bar:
- The finished site should look like a real premium logistics company website.
- It should feel operationally sharp, trustworthy, responsive on mobile, and ready for a business owner to review.

## Plan

### Creative Execution Brief for Ironline Freight Systems Premium Website

#### Page Map:
1. **Homepage**
   - Command-center hero
   - Problem statement
   - Services grid
   - Regional route overview
   - Fleet capability section
   - Dispatch process timeline
   - Safety and compliance proof
   - Customer scenario cards
   - Testimonials/operational proof
   - Resource previews
   - FAQ
   - Final quote call-to-action

2. **About**
   - Company story
   - Dispatch standards
   - Safety culture
   - Communication principles
   - Fleet and partner standards
   - Call to action

3. **Services**
   - Service overview
   - Detailed service sections
   - Comparison grid for service types
   - Dispatch process
   - FAQ
   - Call to action

4. **Single Service (Dedicated Fleet Support)**
   - Focus on dedicated fleet support
   - Recurring lanes
   - Scheduling
   - Dispatch communication
   - Service-level expectations
   - Reporting
   - Next steps

5. **Work**
   - Customer scenario cards
   - Filters by freight type or industry
   - Featured logistics case study
   - Route, dispatch, and capacity visuals
   - Quote call-to-action

6. **Resources**
   - Planning library
   - Article cards (6)
   - Topic cards for quoting, packaging, routing, delivery windows
   - Call to action

7. **Contact**
   - Quote-focused inquiry form
   - Dispatch contact details
   - FAQ
   - Final call to action

#### Content Direction:
- Focus on reliability, modernity, operational sharpness, and safety.
- Highlight disciplined dispatch, clear communication, practical tracking, 
and safety-first operations.
- Use strong visuals to communicate control, movement, dispatch clarity, sa
safety standards, and no-drama freight coordination.

#### Design Direction:
- Premium logistics command center look
- Industrial but refined design
- Strong dark and light contrast
- Clear route maps, dispatch boards, fleet cards, tracking panels, safety s
signals, and lane diagrams

#### Interaction Direction:
- Fast and practical motion
- Reduced-motion-friendly effects
- Header panel behavior
- Mobile drawer behavior
- Service or scenario filtering
- Testimonials or customer proof behavior
- Scroll reveal where it helps the story

#### Image/Art Direction:
- Regional route maps
- Dispatch console
- Fleet capacity cards
- Warehouse handoff diagrams
- Road lane patterns
- Shipment tracking panels
- Safety checklist visuals
- Quote request workflow

#### Risks:
- Ensuring a consistent brand voice across all content.
- Maintaining a premium look and feel without relying on generic imagery.

#### Execution Priorities:
1. **Homepage Design**: Ensure the command-center hero is compelling and ef
effectively communicates Ironline’s operational capabilities.
2. **Services Section**: Create clear, detailed service categories with use
user-friendly comparison grids.
3. **Work Page**: Develop engaging customer scenario cards and a featured l
logistics case study.
4. **Accessibility and Responsiveness**: Implement best practices to ensure
ensure the site is accessible and responsive across all devices.
5. **Final Quote Call-to-Action**: Ensure this remains prominent and effect
effective throughout the website.

This plan ensures that Ironline Freight Systems' premium website communicat
communicates reliability, modernity, and operational sharpness effectively 
while engaging its target audience.
