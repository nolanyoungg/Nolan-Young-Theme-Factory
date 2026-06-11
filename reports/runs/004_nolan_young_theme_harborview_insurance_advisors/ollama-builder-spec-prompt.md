# Ollama Builder Stage

Theme slug: `004_nolan_young_theme_harborview_insurance_advisors`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/harborview-insurance-advisors.txt`

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
- /c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/reports/runs/004_nolan_young_theme_harborview_insurance_advisors/plan.md

Task:
- produce a compact JSON site specification for the deterministic local renderer
- do not emit files, file blocks, Markdown, code fences, implementation guides, apologies, or commentary
- output one JSON object only
- keep strings short and concrete so the local renderer can produce the required WordPress theme and static preview
- include prompt-specific business name, industry, tone, hero headline, hero copy, services, work/project cards, resource/blog cards, process steps, proof chips, testimonial, region, and image direction
- do not include remote asset URLs, CDN references, secrets, placeholder copy, TODOs, lorem ipsum, sample services, or unfinished notes
- the renderer will create the complete theme, local raster images, Nolan-menu behavior, static preview, build files, and required structure from this JSON

Theme slug: 004_nolan_young_theme_harborview_insurance_advisors
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

Create a premium website for Harborview Insurance Advisors, an independent insurance and risk advisory firm serving families, homeowners, small business owners, and professional service companies.

Business positioning:
- Harborview Insurance Advisors helps clients understand coverage, compare options, prepare for renewals, and make calm decisions before stressful moments happen.
- The firm should feel trustworthy, precise, warm, editorial, and highly organized.
- The site should communicate clarity, protection, practical guidance, and long-term advisory support.

Audience:
- Families reviewing home, auto, life, and umbrella coverage
- Homeowners with complex properties or changing needs
- Small business owners comparing liability and property coverage
- Professional service companies that need clear risk guidance
- Founders who want a steady advisory partner
- Clients who feel overwhelmed by policy language and renewal decisions

Design direction:
- Premium advisory office with a calm editorial feel
- Trustworthy and modern without looking corporate or generic
- Refined document layouts, coverage comparison cards, risk maps, client journey panels, renewal calendars, and soft nautical or harbor-inspired visual cues
- Warm but not casual
- Precise but not cold
- Avoid fear-based insurance marketing and avoid generic handshake imagery.

Color palette:
- Deep harbor blue
- Warm ivory
- Slate gray
- Soft brass
- Fog blue
- White
- Muted sea glass accents

Layout rhythm:
- Calm advisory hero
- Coverage clarity section
- Services grid
- Risk review pathway
- Family and business protection panels
- Renewal planning section
- Client scenario cards
- Education/resource preview
- High-trust call-to-action sections

Artwork direction:
- Abstract coverage maps
- Advisory document stacks
- Renewal calendar panels
- Home and business protection diagrams
- Risk review dashboards
- Claims preparation checklists
- Harbor-inspired line art
- Client decision pathway graphics
- Avoid celebrity images, watermarked stock, and empty gray placeholder boxes.

Header and navigation:
- Brand/logo area: Harborview Insurance Advisors
- Desktop navigation should include Services, About, Work, and Resources.
- Schedule a Coverage Review should be the prominent right-side call-to-action.
- Services should open a rich panel with service categories.
- About should open a rich panel with firm standards.
- Resources should open a rich panel with helpful planning guides.
- Work should link directly to client scenarios or advisory case studies.
- The mobile header should use a dedicated drawer with organized service and resource sections.

Services panel rail labels:
- Personal Coverage Reviews
- Home and Umbrella Guidance
- Life and Income Protection
- Business Liability Reviews
- Benefits Education
- Renewal Planning

About panel rail labels:
- Advisory Philosophy
- How Reviews Work
- Client Care Standards

Resources panel cards:
- Annual Coverage Review Checklist
- Understanding Umbrella Coverage
- Preparing for a Claims Conversation
- Insurance Terms in Plain Language

Homepage requirements:
- Build a complete homepage with a calm, high-trust advisory hero.
- Include a problem statement about confusing policies, rushed renewals, and unclear coverage gaps.
- Include a services grid.
- Include a coverage clarity or risk map section.
- Include family and business advisory panels.
- Include a review process timeline.
- Include trust and proof elements.
- Include client scenario cards.
- Include testimonials or advisory proof.
- Include helpful resource previews.
- Include an FAQ section.
- Include a strong final coverage review call-to-action.

Footer requirements:
- Large coverage review call-to-action band
- Brand statement
- Services column
- Company column
- Resources column
- Contact block
- Small question or newsletter form
- Bottom legal row

About page:
- Firm story
- Advisory philosophy
- Review standards
- Client communication principles
- Ongoing support standards
- Call to action

Services page:
- Service overview
- Detailed service sections
- Comparison grid for coverage review types
- Review process
- FAQ
- Call to action

Single service page:
- Focus on annual coverage reviews.
- Explain ideal fit, policy gathering, risk questions, comparison notes, coverage gap review, renewal planning, and next steps.

Work page:
- Include at least six client scenario cards.
- Include filters by personal, business, and renewal planning.
- Include a featured advisory case study.
- Include coverage map, document, and planning visuals.
- Include a coverage review call-to-action.

Resources page:
- Include a planning library.
- Include at least six helpful article cards.
- Include topic cards for personal coverage, business risk, renewals, claims, and benefits education.
- Include a call to action.

Contact page:
- Coverage review inquiry form
- Name
- Email
- Phone
- Coverage type
- Current concern
- Renewal timeline
- Household or company context
- Message
- Contact details
- Review expectations
- FAQ
- Final call to action

Interaction expectations:
- Calm, minimal motion
- Reduced-motion-friendly effects
- Header panel behavior
- Mobile drawer behavior
- Scenario filtering
- Testimonials or client proof behavior where useful
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
- The finished site should look like a real premium independent insurance advisory firm website.
- It should feel calm, trustworthy, responsive on mobile, specific to insurance and advisory work, and ready for a business owner to review.

## Plan

### Creative Execution Brief

**Business Positioning:**
Harborview Insurance Advisors is an independent insurance and risk advisory
advisory firm that helps clients understand coverage, compare options, prep
prepare for renewals, and make calm decisions before stressful moments happ
happen. The website should communicate clarity, protection, practical guida
guidance, and long-term advisory support.

**Audience:**
- Families reviewing home, auto, life, and umbrella coverage
- Homeowners with complex properties or changing needs
- Small business owners comparing liability and property coverage
- Professional service companies that need clear risk guidance
- Founders who want a steady advisory partner
- Clients who feel overwhelmed by policy language and renewal decisions

**Page Map:**
1. **Homepage**
   - Hero section (calm, high-trust)
   - Problem statement
   - Services grid
   - Coverage clarity or risk map
   - Family and business protection panels
   - Review process timeline
   - Trust and proof elements
   - Client scenario cards
   - Testimonials/advisory proof
   - Helpful resource previews
   - FAQ section
   - Call-to-action

2. **About**
   - Firm story
   - Advisory philosophy
   - Review standards
   - Client communication principles
   - Ongoing support standards
   - Call to action

3. **Services**
   - Service overview
   - Detailed service sections
   - Comparison grid for coverage review types
   - Review process
   - FAQ
   - Call to action

4. **Single Service (Annual Coverage Reviews)**
   - Ideal fit, policy gathering, risk questions
   - Comparison notes, coverage gap review, renewal planning
   - Next steps

5. **Work**
   - Client scenario cards
   - Filters by personal, business, and renewal planning
   - Featured advisory case study
   - Coverage map, document, and planning visuals
   - Call-to-action

6. **Resources**
   - Planning library
   - Article cards (personal coverage, business risk, renewals, claims, ben
benefits education)
   - Topic cards
   - Call to action

7. **Contact**
   - Inquiry form
   - Name, email, phone, coverage type, current concern, renewal timeline
   - Household or company context
   - Message
   - Contact details
   - Review expectations
   - FAQ
   - Final call-to-action

**Content Direction:**
- Clear, concise content with a focus on trust and support.
- Use of bullet points, lists, and easy-to-read fonts.
- Avoid complex jargon; provide practical guidance.

**Design Direction:**
- Premium advisory office aesthetic with a calm editorial feel.
- Trustworthy and modern design without corporate or generic elements.
- Refined layouts for documents, coverage comparison cards, risk maps, clie
client journey panels, renewal calendars, and nautical/harbor-inspired visu
visual cues.
- Warm but not casual; precise but not cold.

**Interaction Direction:**
- Calm, minimal motion with reduced-motion-friendly effects.
- Header panel behavior, mobile drawer behavior, scenario filtering, testim
testimonials or client proof behavior, scroll reveal for storytelling.

**Image/Art Direction:**
- Abstract coverage maps, advisory document stacks, renewal calendar panels
panels, home and business protection diagrams, risk review dashboards, clai
claims preparation checklists, harbor-inspired line art, client decision pa
pathway graphics.
- Avoid celebrity images, watermarked stock, or empty gray placeholder boxe
boxes.

**Color Palette:**
- Deep harbor blue
- Warm ivory
- Slate gray
- Soft brass
- Fog blue
- White
- Muted sea glass accents

**Risks:**
- Ensuring the site feels trustworthy and not generic.
- Balancing modern design with a calm, advisory feel.
- Avoiding fear-based insurance marketing.

**Execution Priorities:**
1. **Homepage:** Ensure all key elements are present and visually appealing
appealing.
2. **About Page:** Clearly communicate firm values and standards.
3. **Services Grid:** Highlight core services and comparison features.
4. **Work Page:** Showcase client scenarios and case studies effectively.
5. **Accessibility & Usability:** Prioritize clear navigation, keyboard acc
accessibility, and visible focus states.

**Footer Requirements:**
- Large coverage review call-to-action band
- Brand statement
- Services column
- Company column
- Resources column
- Contact block
- Small question or newsletter form
- Bottom legal row
