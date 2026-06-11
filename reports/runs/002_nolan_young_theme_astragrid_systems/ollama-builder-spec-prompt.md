# Ollama Builder Stage

Theme slug: `002_nolan_young_theme_astragrid_systems`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/astragrid-systems.txt`

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
- /c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/reports/runs/002_nolan_young_theme_astragrid_systems/plan.md

Task:
- produce a compact JSON site specification for the deterministic local renderer
- do not emit files, file blocks, Markdown, code fences, implementation guides, apologies, or commentary
- output one JSON object only
- keep strings short and concrete so the local renderer can produce the required WordPress theme and static preview
- include prompt-specific business name, industry, tone, hero headline, hero copy, services, work/project cards, resource/blog cards, process steps, proof chips, testimonial, region, and image direction
- do not include remote asset URLs, CDN references, secrets, placeholder copy, TODOs, lorem ipsum, sample services, or unfinished notes
- the renderer will create the complete theme, local raster images, Nolan-menu behavior, static preview, build files, and required structure from this JSON

Theme slug: 002_nolan_young_theme_astragrid_systems
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

Create a premium website for AstraGrid Systems, an AI automation, analytics, and custom software studio.

AstraGrid Systems helps small businesses and operations teams replace messy manual workflows with automation systems, internal software, dashboards, reporting tools, AI-assisted processes, and cleaner data infrastructure.

Audience:
- Small businesses
- Operations teams
- Service companies
- Ecommerce teams
- Logistics teams
- Field-service businesses
- Founders who need clearer operational visibility

Brand positioning:
- AstraGrid Systems should feel like an intelligent operations grid.
- The studio is technical but approachable.
- The brand promise is operational clarity: cleaner workflows, clearer dashboards, better data, and practical automation that small teams can actually maintain.
- The site should communicate precision, calm control, and strong business outcomes without feeling cold or generic.

Design direction:
- Modern AI operations platform
- Premium software studio
- Dark-mode-first, sharp, polished, and conversion-focused
- Layered interface panels
- Gridline systems
- Orbiting data nodes
- Command-map visuals
- Workflow-routing diagrams
- Metric consoles
- Glowing connection paths
- Premium dark editorial sections

Color palette:
- Deep navy
- Near-black blue
- Graphite slate
- Electric blue
- Cyan
- White text
- Muted steel text
- Small lime-green micro accents

Layout rhythm:
- Command-grid hero
- Split-screen diagnostic sections
- Angular cards
- Metric panels
- System-map sections
- Horizontal workflow bands
- Case-study cards
- Dashboard panels
- High-contrast call-to-action blocks

Artwork direction:
- Original abstract interface artwork and iconography
- AI operations dashboard
- Automation node map
- Internal tools interface
- Analytics console
- Workflow routing diagram
- CRM cleanup pipeline
- Reporting dashboard
- Assistant panel
- System health monitor
- Orbital data grid
- Terminal card
- Project command center
- Avoid stock photos, celebrity images, watermarked assets, and gray placeholder boxes.

Header and navigation:
- Brand/logo area: AstraGrid Systems
- Desktop navigation should include Services, About Us, Work, and Blog.
- Contact Us should be a prominent right-side call-to-action.
- Services should open a rich full-width panel.
- About Us should open a rich full-width panel.
- Blog should open a rich full-width panel.
- Work should link directly to the work page.
- Panels should feel fast, clear, and accessible.
- Only one panel should be open at a time.
- The same trigger should toggle its active panel closed.
- Outside click and Escape should close active panels.
- A dark backdrop should appear while a panel is open.
- Right-side panel content should update when a visitor explores left rail items.
- Panel backgrounds should be readable dark navy or slate.
- The mobile header should use a dedicated drawer with accordions for Services, About Us, and Blog plus direct links for Work and Contact.

Services panel rail labels:
- AI Workflow Automation
- Custom Dashboards
- Internal Tools
- CRM and Data Cleanup
- WordPress Integrations
- Reporting Systems

About Us panel rail labels:
- Engineering Approach
- How We Scope Work
- Support Standards

Blog panel cards:
- Automation Readiness Checklist
- Dashboard Planning Guide
- AI Chatbot Use Cases
- Data Cleanup Before Reporting

Homepage requirements:
- Build a complete, impressive homepage with at least twelve fully developed sections.
- Include a command-grid hero with a subtle shooting-star or moving-signal background effect.
- Include a problem statement section.
- Include a services grid.
- Include an automation workflow section.
- Include a dashboard and reporting showcase.
- Include a featured work or project preview with filtering.
- Include a process section.
- Include a technology and style pillars section.
- Include testimonials or proof.
- Include a blog/resources preview.
- Include an FAQ section.
- Include a final call-to-action section.
- The homepage must feel premium and finished, not like a scaffold.

Footer requirements:
- Polished dark SaaS-style footer
- Large call-to-action top band
- Brand statement
- Services column
- Company column
- Blog/resources column
- Contact block
- Mini inquiry or newsletter form
- Bottom legal row
- Fully responsive layout
- Strong spacing and polished styling

About Us page:
- Engineering story
- Values
- Process
- Client experience
- Support standards
- Call to action

Services page:
- Service overview
- Detailed service sections
- Comparison grid
- Process
- FAQ
- Call to action

Single service page:
- Focus on AI workflow automation.
- Explain ideal fit, discovery, workflow mapping, build phase, review loop, deliverables, timeline, and next steps.

Work page:
- This should be the strongest visual internal page.
- Include at least twelve project cards.
- Include filters.
- Include a featured case study.
- Include dashboard and system visuals.
- Include a call to action.

Blog/resources page:
- Include a resource library.
- Include at least six helpful article cards.
- Include topic cards.
- Emphasize automation and analytics education.
- Include a call to action.

Contact page:
- Accessible inquiry form
- Name
- Email
- Company
- Website
- Service type
- Budget range
- Timeline
- Message
- Contact details
- Process expectations
- FAQ
- Final call to action

Interaction expectations:
- Fast, crisp, and minimal motion
- Reduced-motion-friendly animation
- Header menu behavior
- Mobile drawer behavior
- Rail panel switching
- Portfolio filtering
- Carousel or testimonial behavior where useful
- Scroll reveal where it improves the experience
- Optional interactive pieces should fail gracefully if a page does not include them.

Accessibility expectations:
- Skip link
- Semantic landmarks
- Proper heading order
- Visible focus states
- Keyboard-friendly navigation
- Keyboard-friendly accordions
- Clear expanded and collapsed states
- Labeled forms
- Strong text contrast

Quality bar:
- The finished site should look like a real premium AI automation and software studio website.
- It should be fully responsive, polished on mobile, complete in the header, complete in the footer, complete on the homepage, visually impressive, and ready for a business owner to review.

## Plan

### Creative Execution Brief: AstraGrid Systems Website

#### Theme Slug: 002_nolan_young_theme_astragrid_systems

**Objective:**  
Create a premium website for AstraGrid Systems that showcases its AI automa
automation, analytics, and custom software services to small businesses and
and operations teams.

**Brand Positioning:**  
AstraGrid Systems should appear as an intelligent operations grid. The bran
brand is technical yet approachable, emphasizing operational clarity throug
through cleaner workflows, clearer dashboards, better data, and practical a
automation.

#### Page Map:
1. **Homepage**
2. **Services**
3. **About Us**
4. **Work**
5. **Blog/Resources**
6. **Contact**

**Content Direction:**
- **Homepage:** 
  - Command-grid hero with subtle shooting-star effect.
  - Problem statement section highlighting manual workflow challenges.
  - Services grid showcasing key offerings.
  - Automation workflow section demonstrating process improvements.
  - Dashboard and reporting showcase.
  - Featured work or project preview with filtering.
  - Process section explaining AstraGrid’s approach.
  - Technology and style pillars section.
  - Testimonials or proof of success.
  - Blog/resources preview.
  - FAQ section.
  - Final call-to-action.

- **Services:**
  - Service overview.
  - Detailed service sections for AI Workflow Automation, Custom Dashboards
Dashboards, Internal Tools, CRM and Data Cleanup, WordPress Integrations, R
Reporting Systems.
  - Comparison grid highlighting service features.
  - Process explanation.
  - FAQ.
  - Call to action.

- **About Us:**
  - Engineering approach.
  - How AstraGrid scopes work.
  - Support standards.
  - Call to action.

- **Work:**
  - Portfolio of at least twelve project cards with filters.
  - Featured case study with detailed visuals.
  - Dashboard and system visuals.
  - Call to action.

- **Blog/Resources:**
  - Resource library with automation and analytics education.
  - Six helpful article cards.
  - Topic cards.
  - Call to action.

- **Contact:**
  - Accessible inquiry form.
  - Fields for name, email, company, website, service type, budget range, t
timeline, message, contact details, process expectations, FAQ, and final ca
call-to-action.

**Design Direction:**
- Modern AI operations platform design.
- Dark-mode-first, sharp, polished, and conversion-focused.
- Layered interface panels.
- Gridline systems.
- Orbiting data nodes.
- Command-map visuals.
- Workflow-routing diagrams.
- Metric consoles.
- Glowing connection paths.
- Premium dark editorial sections.

**Color Palette:**
- Deep navy
- Near-black blue
- Graphite slate
- Electric blue
- Cyan
- White text
- Muted steel text
- Small lime-green micro accents

**Layout Rhythm:**
- Command-grid hero.
- Split-screen diagnostic sections.
- Angular cards.
- Metric panels.
- System-map sections.
- Horizontal workflow bands.
- Case-study cards.
- Dashboard panels.
- High-contrast call-to-action blocks.

**Artwork Direction:**
- Original abstract interface artwork and iconography.
- AI operations dashboard.
- Automation node map.
- Internal tools interface.
- Analytics console.
- Workflow routing diagram.
- CRM cleanup pipeline.
- Reporting dashboard.
- Assistant panel.
- System health monitor.
- Orbital data grid.
- Terminal card.
- Project command center.

**Header & Navigation:**
- Brand/logo area: AstraGrid Systems.
- Desktop navigation: Services, About Us, Work, Blog.
- Contact Us as a prominent right-side call-to-action.
- Panels for Services, About Us, and Blog should open rich full-width panel
panels.
- Mobile header with dedicated drawer using accordions.

**Interaction Direction:**
- Fast, crisp, and minimal motion.
- Reduced-motion-friendly animation.
- Header menu behavior.
- Mobile drawer behavior.
- Rail panel switching.
- Portfolio filtering.
- Carousel or testimonial behavior where useful.
- Scroll reveal for improved experience.
- Optional interactive pieces should fail gracefully if a page does not inc
include them.

**Accessibility Expectations:**
- Skip link.
- Semantic landmarks.
- Proper heading order.
- Visible focus states.
- Keyboard-friendly navigation.
- Keyboard-friendly accordions.
- Clear expanded and collapsed states.
- Labeled forms.
- Strong text contrast.

**Risks:**
1. Ensuring the design remains modern and cutting-edge without appearing ge
generic.
2. Balancing technical details with an approachable tone.
3. Maintaining high visual quality across different devices and screen size
sizes.
4. Implementing a seamless navigation experience with multiple panels.

**Execution Priorities:**
1. Develop a visually stunning homepage that captures the essence of AstraG
AstraGrid Systems.
2. Ensure all pages are fully responsive and polished on mobile devices.
3. Create detailed content for each section, emphasizing operational clarit
clarity and practical automation.
4. Implement an interactive and intuitive header with accessible menu behav
behavior.
5. Prioritize high-quality custom artwork to align with the premium softwar
software studio brand.

**Quality Bar:**
- The finished site should look like a real premium AI automation and softw
software studio website.
- Fully responsive design.
- Polished mobile experience.
- Complete, engaging homepage.
- Clear, organized footer.
- Visually impressive throughout.
- Ready for business owner review.
