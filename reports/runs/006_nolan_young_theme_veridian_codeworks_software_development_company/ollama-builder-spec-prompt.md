# Ollama Builder Stage

Theme slug: `006_nolan_young_theme_veridian_codeworks_software_development_company`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/veridian-codeworks-software-development-company.md`

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
- /c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/reports/runs/006_nolan_young_theme_veridian_codeworks_software_development_company/plan.md

Task:
- produce a compact JSON site specification for the deterministic local renderer
- do not emit files, file blocks, Markdown, code fences, implementation guides, apologies, or commentary
- output one JSON object only
- keep strings short and concrete so the local renderer can produce the required WordPress theme and static preview
- include prompt-specific business or product name, industry or site type, tone, hero headline, hero copy, services/features, work/project cards, resource/blog cards, process steps, proof chips, testimonial, region, and image direction
- preserve the category in the prompt even when it is not a known local default; a CRM, SaaS platform, ecommerce brand, nonprofit, clinic, course business, portfolio, or local service site must receive category-specific copy and page content
- if the prompt describes software or a CRM, describe product capabilities, dashboard/UI image subjects, account workflows, admin/export needs, buyer objections, and demo or consultation conversion paths
- do not include remote asset URLs, CDN references, secrets, placeholder copy, TODOs, lorem ipsum, sample services, or unfinished notes
- the renderer will create the complete theme, local raster images, Nolan-menu behavior, static preview, build files, and required structure from this JSON

Theme slug: 006_nolan_young_theme_veridian_codeworks_software_development_company
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
The final output must look like a polished premium business, product, or organization website, not a file checklist.
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

# WordPress Theme Generation Prompt - Filled Creative Brief

Create a premium WordPress website for a senior software development company. The finished site should feel like a polished, trustworthy engineering partner for growing businesses that need custom internal systems, workflow automation, dashboards, integrations, and long-term software support.

Brand consistency is critical. Every visible brand reference, testimonial, hero sentence, footer summary, case-study note, and service description must refer only to Veridian Codeworks. Do not introduce unrelated company names, alternate brand names, or copied brand names from other examples.

This is a services business, not a packaged subscription product. The website should sell senior engineering judgment, discovery, custom development, careful implementation, documentation, support, and operational clarity.

## 1. Business Identity

### Business Name

Veridian Codeworks

### Short Business Description

Veridian Codeworks is a senior software development company that plans, builds, improves, and maintains custom business software for growing companies with complex operations. The team helps owners, operators, sales leaders, service teams, and back-office staff replace brittle spreadsheets, repeated manual steps, disconnected tools, unclear reporting, and fragile handoffs with secure, maintainable systems shaped around the way their business actually works.

Veridian Codeworks should feel like a careful engineering partner. The company listens first, maps the workflow, designs a practical system, builds clean software, documents the decisions, and stays available for iteration after launch.

### Industry / Category

Custom software development company, software engineering studio, workflow automation partner, internal tools builder, business dashboard specialist, systems integration team, long-term software maintenance partner.

### Primary Conversion Goal

Book a software strategy consultation with a senior technical lead.

### Secondary Conversion Goals

- Explore custom software development services.
- Review realistic internal systems and automation case studies.
- Understand how the engagement process works.
- Request a project estimate.
- Submit a discovery form.
- Read practical planning resources.
- Join an engineering newsletter for business operators.

---

## 2. Brand Voice and Style

### Brand Personality

Veridian Codeworks should feel premium, calm, senior, precise, practical, direct, trustworthy, and technically capable. The brand should sound like a team that has seen real operational problems and knows how to turn messy processes into stable software.

Avoid hype, empty innovation claims, generic agency language, and cartoonish tech energy. The voice should be confident without being loud. It should feel grounded, specific, and easy for a serious business buyer to trust.

### Writing Style

Use clear, benefit-focused copy with concrete examples. Headings should be short, confident, and specific. Support text should explain the business problem, the engineering approach, and the operational result in plain English.

Use writing patterns like:

- Replace spreadsheet handoffs with a guided internal workflow.
- Give leadership reliable visibility into work, revenue, service health, and exceptions.
- Connect existing tools so teams stop copying the same information twice.
- Build secure internal software your team can actually use, understand, and maintain.
- Turn scattered process notes into a documented system with ownership, rules, and useful reporting.

Avoid vague phrases unless they are immediately made specific.

### Content Density

Use detailed service-page copy, a complete homepage flow, realistic case studies, practical proof points, thoughtful FAQ answers, and enough technical depth to convince a serious buyer. The site should support a real sales conversation without reading like a developer resume.

---

## 3. Visual Design Direction

### Overall Website Style

Create a premium modern software-services website with a technical, dashboard-inspired feel. It should look like a high-end engineering firm for business operations, not a generic marketing agency, local contractor, restaurant, finance office, or single software tool sales page.

Use:

- Clean dashboard-style panels.
- Workflow diagrams.
- System maps.
- Data cards.
- Interface-inspired visuals.
- Planning-board visuals.
- Code and deployment details used sparingly.
- Crisp typography.
- Strong spacing.
- Subtle depth.
- Clear section separation.
- Confident CTA placement.

### Layout Rhythm

Use a business-focused flow:

- Hero with bold software-services positioning, interface-style visual, proof chips, and primary CTA.
- Trust bar with senior-led delivery, systems shipped, hours saved, response standards, and documented handoff.
- Problem section about scattered tools, manual handoffs, duplicated data entry, unclear ownership, and unreliable reporting.
- Services grid for custom software, internal tools, workflow automation, dashboards, integrations, and maintenance.
- Featured systems section showing realistic custom builds.
- Process section explaining discovery, workflow mapping, prototype, build, launch, and optimization.
- Work showcase with case-study cards.
- Technical standards section covering maintainability, security, performance, testing, documentation, and handoff.
- Testimonials or proof section from founder, operations, sales, and service-team perspectives.
- Resources preview.
- FAQ.
- Final CTA.

### Image Direction

Use royalty-free, non-copyright, safe stock-style imagery or CSS-generated visual treatments that match a software development company.

The visual direction should emphasize:

- Abstract software dashboards.
- Workflow boards.
- Clean interface mockups.
- System architecture diagrams.
- Team planning boards.
- Product strategy sessions.
- Code review details.
- Deployment checklists.
- Data visualization cards.
- Internal operations screens.
- Implementation roadmap visuals.

Do not use broken image links. Prefer local assets or generated CSS interface graphics when appropriate. Visuals should help visitors understand that Veridian Codeworks builds real custom software systems for business operations.

---

## 4. Color System

### Main Background Color

#f8faf7

### Secondary Background Color

#edf4ef

### Dark Background Color

#10231f

### Primary Brand Color

#1f7a5c

### Secondary Brand Color

#2563eb

### Accent Color

#f59e0b

### Text Color

#111827

### Muted Text Color

#53635d

### Border / Divider Color

#cfe0d6

### Button Colors

Primary button:

- Background: #1f7a5c
- Text: #ffffff
- Hover background: #145a44
- Hover text: #ffffff

Secondary button:

- Background: #ffffff
- Text: #145a44
- Border: #9fc6b5
- Hover background: #e8f3ed
- Hover text: #10231f

### Additional Color Specifications

Use dark green for serious trust, blue for technical clarity, amber for focused alerts and highlighted metrics, and warm off-white backgrounds for calm readability. Avoid a one-note green palette by balancing green with blue, amber, charcoal, and neutral surfaces.

Use subtle dark panels for dashboards and code-adjacent sections, but keep the overall site approachable and readable. Forms should use bright backgrounds, strong contrast, clear borders, and obvious focus states.

---

## 5. Typography Direction

### Heading Style

Use large, clean, confident sans-serif headings with strong hierarchy and no decorative styling. Headings should feel like a senior software consultancy: precise, calm, and modern.

### Body Text Style

Use highly readable modern sans-serif body copy with comfortable line height. Body text should be accessible, practical, and easy to scan. Use concise paragraphs supported by cards, proof points, and short lists.

### Font Rules

Use safe local/system font stacks unless a permitted font strategy already exists. Do not depend on external Google Fonts.

---

## 6. Header and Navigation

Create a polished responsive header.

### Header Layout

Logo left, navigation center, CTA right. Use a compact professional header that gives the website a business-software feel. The logo mark can use the initials VC with a refined geometric treatment.

### Header Behavior

Sticky on scroll with a solid surface and subtle border. Use accessible dropdown behavior on desktop and a clean mobile slide-down menu or off-canvas menu on small screens.

### Header CTA

Button label: Book Strategy Call  
Button destination: Contact page

### Main Navigation Items and Dropdowns

Do not create empty or fake dropdowns. Every dropdown item must connect to a real generated page or meaningful section.

Main navigation:

- Services
  - Custom Software Builds
  - Internal Tools
  - Workflow Automation
  - Dashboards and Reporting
  - Data and Tool Integrations
  - Maintenance and Optimization
- Work
  - Operations Systems
  - Reporting Dashboards
  - Automation Builds
  - Integration Projects
- Process
  - Discovery
  - Workflow Mapping
  - Prototype
  - Build
  - Launch and Support
- Resources
  - Planning Guides
  - Engineering Notes
  - Buyer Questions
  - Maintenance Checklist
- About
- Contact

---

## 7. Pages to Build

Describe pages by business purpose, not by implementation filename. The site builder should decide the correct WordPress templates, page templates, template parts, routes, preview sections, and navigation links.

Each page should feel intentionally designed, not copied with only text swapped.

### Home Page

Purpose: Explain Veridian Codeworks as a senior software development company, show the problems it solves, establish trust, preview services and work, and move qualified prospects toward a strategy call.

Main sections to include:

- Hero with business-software positioning, interface-style visual, proof chips, and two CTAs.
- Trust bar with proof points such as systems shipped, workflows mapped, documentation included, and support response rhythm.
- Problem / solution section about manual work, scattered data, unclear ownership, and systems that no longer fit.
- Services preview grid linking to real service pages or sections.
- Featured systems section showing realistic custom builds.
- Process preview section from discovery through ongoing optimization.
- Technical standards section covering maintainability, security, testing, performance, and documentation.
- Case-study preview section.
- Testimonials or proof quotes from business operators.
- Resources preview.
- FAQ.
- Final CTA.

Primary CTA: Book a software strategy call  
Secondary CTA: View example systems

### About Page

Purpose: Build confidence in Veridian Codeworks as a careful, senior, business-minded software partner.

Main sections to include:

- Company philosophy: business workflows first, code second.
- Senior-led delivery approach.
- What the team believes about maintainability, documentation, support, and clear ownership.
- Types of clients served: operations-heavy service companies, ecommerce teams, field teams, sales teams, professional services firms, and founder-led companies.
- Working principles: map first, ship carefully, document decisions, improve after launch.
- Proof section with practical client outcomes.
- CTA to book a strategy call.

### Services Overview Page

Purpose: Show the full service suite and help a prospect identify the right path.

Main sections to include:

- Overview of service categories.
- Comparison between new builds, improvements, automation, integrations, reporting, and maintenance.
- Service cards with clear outcomes, deliverables, and good-fit signals.
- Engagement models: focused discovery, build sprint, system improvement, ongoing support.
- CTA after every major service group.

### Individual Service Pages

Build individual pages or strong sections for these services. Each service page must have unique copy, unique layout details, a clear value proposition, deliverables, process, FAQ, and CTA.

- Custom Software Builds: for teams that need a purpose-built internal system instead of forcing their work into generic tools.
- Internal Tools: admin dashboards, request queues, review workflows, approval flows, lightweight operations interfaces, and staff-facing tools.
- Workflow Automation: routing rules, notifications, reviewed automation, handoff logic, status updates, and exception queues.
- Dashboards and Reporting: operational reporting, leadership dashboards, metric definitions, recurring snapshots, and data cleanup before reporting.
- Data and Tool Integrations: connecting forms, databases, ecommerce systems, billing tools, email systems, scheduling tools, and internal records.
- Maintenance and Optimization: ongoing improvements, bug fixes, performance work, documentation updates, monitoring, and small feature releases.

### Work / Portfolio Page

Purpose: Show realistic custom software outcomes without pretending to be a single packaged product.

Showcase items to include:

1. Field Operations Command Center
2. Service Request Intake System
3. Executive Reporting Dashboard
4. Inventory Exception Queue
5. Sales Handoff Automation
6. Internal Approval Workflow
7. Customer Service Triage Board
8. Founder Visibility Dashboard

Each showcase item should include:

- Project summary
- Client type
- Challenge
- Solution
- Result
- Services used
- Timeline range
- Important constraints
- Operational impact

### Process Page

Purpose: Make the engagement feel controlled, understandable, and low-risk.

Process steps:

1. Discovery call: understand business goals, current tools, users, constraints, and urgency.
2. Workflow map: document the current process, handoffs, rules, exceptions, and data sources.
3. Technical plan: define the build approach, architecture, deliverables, risks, and success measures.
4. Prototype and review: create a working direction the team can react to before deep build work.
5. Build and test: implement carefully with clear checkpoints, practical QA, and documented decisions.
6. Launch and train: deploy the system, train users, prepare support notes, and monitor adoption.
7. Optimize: improve reporting, performance, automation logic, and usability after real use.

### Resources / Blog Page

Purpose: Help operators understand how to plan software projects and identify good opportunities for custom systems.

Include sample educational resources, guide cards, blog-style article previews, or learning content relevant to the business.

Suggested topics:

- How to Know When a Spreadsheet Became a Business System
- What to Map Before Building Internal Software
- The Difference Between Automation and Unreviewed Risk
- Questions to Ask Before Building a Dashboard
- How to Plan a Maintainable Integration
- When to Improve Existing Software Instead of Replacing It
- What Belongs in a Software Maintenance Plan
- How Operators Should Prepare for a Discovery Call

### Contact Page

Purpose: Convert qualified prospects into a strategy call or project estimate request.

Include:

- Contact intro copy.
- Contact form design.
- Strategy-call request form.
- Business contact details.
- Service interest selector.
- Project stage selector.
- Expected response time.
- CTA for urgent operational issues.
- Trust/support copy.
- Privacy-minded reassurance about project details.

### Optional Additional Pages

Add these only if they fit the business and site scope:

- Technical Standards page.
- Maintenance Plans page.
- Discovery Workshop page.

---

## 8. Forms and Conversion Elements

Create realistic form layouts.

Form submissions must be viewable under a wp-admin tab called:

```text
Forms
```

The user must be able to export:

- All form submissions.
- Submissions from all forms.
- Submissions from a selected form.

### Contact Form Fields

- Name
- Email
- Phone
- Company / Organization
- Role
- Message

### Quote / Consultation Form Fields

- Name
- Email
- Phone
- Company / Organization
- Business type
- Current tools involved
- Project type
- Current workflow problem
- Goals
- Users affected
- Timeline
- Budget range
- Maintenance needs

### Conversion Elements

Include:

- Sticky or repeated CTA sections.
- Clear buttons above the fold.
- Contact CTA in the footer.
- CTA after each major service explanation.
- Trust indicators near forms.
- Proof chips near the hero.
- Short "not sure where to start?" CTA near process content.

---

## 9. Homepage Section Requirements

The home page should include a complete business-focused flow.

Required sections:

1. Hero section that strongly grabs the user's attention, looks polished, and includes subtle animation in the hero area and as the user scrolls.
2. Trust bar with believable stats, client types, badges, or proof points.
3. Services preview section with cards linking to real service pages.
4. Problem / solution section explaining why the business exists.
5. Process section explaining how working with Veridian Codeworks works.
6. Featured work or case-study preview section.
7. Technical standards section.
8. Testimonials or review-style proof section.
9. Resources preview section.
10. FAQ section.
11. Final CTA section.

---

## 10. Footer Requirements

Create a complete footer with:

- Business name and short summary.
- Main navigation links.
- Service links.
- Resource links.
- Contact details.
- Social links or inactive social labels if needed.
- Newsletter/signup area if appropriate.
- Copyright line.
- Privacy / Terms links if appropriate.

All footer links should point to real generated pages, real sections, or safe non-navigating labels only when unavoidable.

---

## 11. Responsive and Accessibility Requirements

The theme must be responsive and accessible.

Required:

- Mobile-first behavior.
- Usable mobile navigation.
- No horizontal scrolling bugs.
- Tap targets large enough for mobile.
- Visible focus states.
- Semantic HTML.
- Proper heading order.
- Alt text for meaningful images.
- Good color contrast.
- Keyboard-accessible dropdowns where practical.
- Reduced-motion consideration for animations.
- No text hidden behind sticky headers.
- No overflowing cards, buttons, menus, or hero visuals.

---

## 12. Quality Bar

The finished theme should feel like a polished finished website, not a starter shell.

Avoid:

- Lorem ipsum.
- Empty cards.
- Empty nav items.
- Broken links.
- Duplicate sections with only minor text changes.
- Generic About Us filler.
- Unstyled form fields.
- Inconsistent spacing.
- Random colors not in the palette.
- Remote images that may break.
- Overly complex code that does not match established WordPress style.
- Any visible brand name other than Veridian Codeworks.

Include:

- Specific business copy.
- Clear page intent.
- Realistic service descriptions.
- Realistic case studies or portfolio examples.
- Strong CTAs.
- Responsive polish.
- Modern spacing.
- Consistent buttons.
- Consistent card styles.
- Useful footer and navigation.
- Local visual assets.

## Plan

### Creative Execution Brief for Veridian Codeworks Website

#### Page Map:
1. Home
2. About
3. Services Overview
4. Custom Software Builds
5. Internal Tools
6. Workflow Automation
7. Dashboards and Reporting
8. Data and Tool Integrations
9. Maintenance and Optimization
10. Work / Portfolio
11. Process
12. Resources / Blog
13. Contact

#### Content Direction:
- Business-focused content with clear, benefit-oriented copy.
- Specific service descriptions and case studies.
- Strong problem-solution framing.

#### Design Direction:
- Premium modern software-services website with a technical, dashboard-insp
dashboard-inspired feel.
- Clean layout with strong hierarchy and spacing.
- Use of dashboard-style panels, workflow diagrams, system maps, etc.

#### Interaction Direction:
- Intuitive navigation with sticky header and responsive mobile menu.
- Realistic form layouts with exportable submissions.
- Clear CTAs throughout the site.

#### Image/Art Direction:
- Royalty-free imagery or CSS-generated visuals.
- Emphasis on software dashboards, workflow boards, clean interface mockups
mockups, etc.

#### Risks:
- Ensuring brand consistency across all content and visuals.
- Maintaining a professional and trustworthy tone.

#### Execution Priorities:
1. Brand consistency and visual design.
2. High-quality content and realistic case studies.
3. Intuitive navigation and user-friendly forms.
4. Responsive design and accessibility compliance.
5. Polished finish with no placeholders or generic content.

### Business-Facing Summary
Veridian Codeworks needs a premium, trustworthy website that showcases thei
their expertise in custom software development. The site must feel like a c
careful engineering partner, emphasizing senior judgment, discovery, and op
operational clarity. It should convert visitors into qualified prospects fo
for strategy calls.

### Website-Facing Summary
This premium WordPress theme will feature a modern, technical design with c
clear content, realistic case studies, and strong CTAs. The site will be re
responsive, accessible, and ensure brand consistency across all pages.
