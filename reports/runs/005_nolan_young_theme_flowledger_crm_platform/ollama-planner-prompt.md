# Ollama Planner Stage

You are planning a premium website from the selected creative brief.


Task:
- create a concise creative execution brief for the generated website
- preserve the selected prompt intent exactly
- identify the page map, content direction, design direction, interaction direction, image/art direction, risks, and execution priorities
- keep the plan business-facing and website-facing
- do not mention repository paths, generated slugs, validation, ZIP files, CI, contracts, script names, implementation filenames, or code
- do not mention WordPress, PHP, HTML, CSS, JavaScript, static preview filenames, internal factory names, or workflow modes
- do not write theme files
- do not output file blocks
- keep the response under 90 concise lines

Selected Ollama model: qwen2.5-coder:14b


## User Prompt

# Website Generation Brief

## 1. Product Identity

Product Name: FlowLedger CRM

Short Product Description: FlowLedger CRM is a customer operations platform for growing service companies that need one clear place to manage leads, client records, follow-ups, tasks, renewals, and reporting. It replaces scattered spreadsheets, inbox reminders, and disconnected intake forms with a clean workspace for sales, service, and leadership teams.

Product Category: CRM software, customer operations platform, sales pipeline dashboard, account management workspace, and form intake system.

Primary Users: founders, sales teams, service managers, operations coordinators, account managers, and admin users at small and mid-sized service businesses.

Primary Conversion Goal: Book a product demo.

Secondary Conversion Goals:

- View CRM feature details.
- Read customer operations guides.
- Compare workflow examples.
- Request pricing guidance.

## 2. Product Positioning

Primary Problem: Service businesses often lose customer context across spreadsheets, email threads, sticky notes, form notifications, and disconnected tools. Leads stall, renewals are missed, handoffs are unclear, and leadership cannot trust the numbers.

Product Promise: FlowLedger CRM gives teams a shared operating layer for every customer relationship, from first inquiry through service delivery, renewal, and long-term account health.

Key Differentiators:

- Visual pipeline boards with clear stage ownership and next actions.
- Complete client records with activity history, notes, files, tasks, and service interests.
- Form submissions that feed an admin-reviewed Forms area, with the ability to export all entries or selected entries.
- Role-based dashboards for sales, service, leadership, and admin users.
- Customer health indicators for overdue follow-ups, open issues, renewal windows, and stalled opportunities.
- Implementation support for field mapping, data cleanup, import planning, and team adoption.

Buyer Objections to Address:

- Teams worry a CRM will create busywork instead of clarity.
- Leaders worry migration will expose messy data.
- Service teams worry handoffs will be harder than their current process.
- Owners need confidence that form inquiries and demo requests can be reviewed and exported.

## 3. Brand Voice and Content Style

Brand Personality: modern, trustworthy, operational, sharp, calm, product-led, and practical.

Writing Style: clear product marketing with concrete workflow examples, short confident headings, useful support copy, and no vague startup filler.

Content Density: moderately detailed, with enough substance for a buyer to understand features, use cases, implementation, and fit.

Phrases or Claims to Avoid:

- Revolutionary platform.
- Unlock your potential.
- All-in-one solution without proof.
- Generic business growth claims.

## 4. Visual Design Direction

Overall Website Style: modern SaaS dashboard website with a polished dark-mode hero, crisp product panels, clear feature sections, strong contrast, refined spacing, and product UI-inspired local imagery.

Layout Rhythm: hero, product proof bar, dashboard feature preview, problem/solution section, CRM feature grid, workflow process, customer story cards, resource previews, FAQ, demo CTA, and complete footer.

Image Direction: local generated dashboard-style raster assets showing CRM pipeline boards, customer timelines, account health cards, form-entry tables, task queues, admin export screens, and reporting charts. Images should feel like product UI visuals, not generic office stock.

Animation / Interaction Direction: subtle hover states, polished dropdown navigation, lightweight scroll reveal feel, animated hero/dashboard composition, accessible reduced-motion behavior, and no distracting motion.

## 5. Color System

Main Background Color: #06111f

Secondary Background Color: #0d1b2d

Dark Background Color: #030712

Primary Brand Color: #38bdf8

Secondary Brand Color: #a3e635

Accent Color: #f59e0b

Text Color: #f8fafc

Muted Text Color: #94a3b8

Border / Divider Color: #1e3a5f

Primary Button:

- Background: #38bdf8
- Text: #03121e
- Hover Background: #7dd3fc
- Hover Text: #020617

Secondary Button:

- Background: transparent
- Text: #f8fafc
- Border: #38bdf8
- Hover Background: #102a44
- Hover Text: #ffffff

Additional Color Notes: Use lime only for small success indicators, health signals, and proof chips. Use amber for warning or attention details in dashboard visuals. Keep the palette product-focused and avoid a one-note blue page.

## 6. Typography Direction

Heading Style: clean SaaS-style headings with strong hierarchy and confident product clarity.

Body Text Style: readable modern sans-serif with practical, concise explanations.

Font Notes: Use safe local/system font stacks. The typography should feel product-led and operational, not decorative.

## 7. Header and Navigation

Header Layout: logo left, primary navigation center, Book Demo CTA on the right.

Header Behavior: sticky solid header with polished dropdown panels and a mobile drawer.

Header CTA Label: Book Demo

Header CTA Destination: Demo request and contact page.

Main Navigation Items and Dropdown Intent:

- Services: product features, pipeline management, client records, form intake, reporting dashboards, and implementation support.
- About: product story, operating principles, team workflow standards, and adoption approach.
- Work: customer stories, workflow examples, and measurable outcomes.
- Resources: CRM readiness guides, migration checklists, pipeline planning articles, adoption tips, and FAQ content.

## 8. Pages to Build

Describe pages by purpose and content. The builder should determine the implementation details.

Home Page:

- Purpose: show FlowLedger CRM as a complete product for customer operations and persuade qualified buyers to book a demo.
- Sections: hero with dashboard visual, proof bar, problem/solution section, feature preview cards, workflow process, customer story preview, product resources, FAQ, and final demo CTA.
- Primary CTA: Book Demo
- Secondary CTA: View Features

About Page:

- Purpose: explain why FlowLedger exists, how it thinks about customer operations, and how it helps teams adopt cleaner processes.
- Sections: product mission, operating principles, adoption standards, data clarity approach, and customer proof.

Services Overview Page:

- Purpose: present core CRM capabilities as clear product feature groups.
- Features to Feature:
  - Pipeline Management
  - Client Records
  - Form Intake and Admin Review
  - Task and Follow-Up Automation
  - Customer Health Dashboards
  - Reporting and Export Tools

Individual Feature Pages:

- Pipeline Management with stage ownership, next actions, stalled-deal alerts, and manager review.
- Client Records with contact history, service interests, files, notes, and account timeline.
- Form Intake with admin review, Forms area visibility, selected export, all-entry export, and inquiry routing.

Work / Customer Stories Page:

- Customer Story 1: a residential service company moved from spreadsheet pipeline tracking to stage-based sales follow-up and weekly forecast reviews.
- Customer Story 2: a consulting firm organized client notes, renewal dates, and open issues into account health cards.
- Customer Story 3: a field service company connected website inquiries to admin-reviewed form entries and cleaner service handoffs.
- Customer Story 4: a small agency cleaned duplicate records, mapped service interests, and created dashboard views for leadership.

Process Page or Process Section:

- Map the customer lifecycle.
- Clean the data model.
- Configure pipelines, fields, forms, and dashboards.
- Train each role with real workflows.
- Review usage patterns and improve the system.

Resources / Blog Page:

- CRM readiness checklist for growing service businesses.
- How to clean customer data before migration.
- Pipeline stages that teams actually use.
- What leaders should track each week.
- How to design better website intake forms.
- CRM adoption mistakes to avoid.

Contact Page:

- Purpose: convert qualified buyers into demo requests.
- Include: demo intro copy, contact form design, product interest selector, team-size selector, expected response time, support copy, and trust signals near the form.

Optional Additional Pages:

- Pricing overview if it fits the generated structure.
- Implementation approach if it fits the generated structure.
- Security and data handling overview if it fits the generated structure.

## 9. Forms and Conversion Elements

Contact / Demo Form Fields:

- Name
- Email
- Phone
- Company / Organization
- Role
- Team size
- Product interest
- Current tool or spreadsheet process
- Goals
- Timeline
- Budget or plan fit
- Message

Form Handling Expectation: Captured submissions should be visible to site admins in a Forms area. Admins should be able to export all entries or selected entries.

Conversion Elements:

- Book Demo CTA in the header.
- Demo CTA above the fold.
- Feature-specific CTAs after major feature explanations.
- Trust indicators near forms.
- Footer demo CTA.
- Resource cards that point visitors back to demo or feature exploration.

## 10. Homepage Required Flow

The homepage should feel complete and product-focused.

Required Sections:

1. Hero section with a strong product headline, dashboard-style hero imagery, clear CTA, and subtle motion direction.
2. Trust bar with believable product proof points.
3. Feature preview cards linking to real feature/service pages.
4. Problem / solution section explaining why the CRM exists.
5. Workflow process section explaining implementation and adoption.
6. Featured customer story or product outcome preview.
7. Testimonials or review-style proof section.
8. FAQ section.
9. Final demo CTA section.

## 11. Footer Requirements

Include:

- Product name and short summary.
- Main navigation links.
- Feature links.
- Resource links.
- Contact details or demo contact path.
- Social links or safe placeholders if appropriate.
- Newsletter or product update signup if appropriate.
- Copyright line.
- Privacy / Terms links if appropriate.

## 12. Responsive and Accessibility Requirements

Required:

- Mobile-first behavior.
- Usable mobile navigation.
- No horizontal scrolling bugs.
- Large enough tap targets.
- Visible focus states.
- Semantic page structure.
- Proper heading order.
- Alt text direction for meaningful product visuals.
- Good color contrast.
- Keyboard-accessible dropdown behavior where practical.
- Reduced-motion consideration for animations.
- No text hidden behind sticky headers.
- No overflowing cards, buttons, menus, or hero visuals.

## 13. Quality Bar

The finished website should feel like a real CRM product website ready for a founder or product team to review. It should not look like a generic agency site, a lawn care site, a landscape site, a logistics site, an insurance site, or a vague software placeholder.

Avoid:

- Generic startup filler.
- Empty product cards.
- Broken links.
- Fake charts with no context.
- Duplicate sections with only minor text changes.
- Unstyled forms.
- Random colors not in the palette.
- Remote images that may break.
- Overly complex code that does not fit the site.

Include:

- Specific product copy.
- Clear CRM feature groups.
- Realistic customer stories.
- Strong demo CTAs.
- Admin-review and export language for form submissions.
- Responsive polish.
- Modern spacing.
- Consistent buttons.
- Consistent card styles.
- Useful footer and navigation.
