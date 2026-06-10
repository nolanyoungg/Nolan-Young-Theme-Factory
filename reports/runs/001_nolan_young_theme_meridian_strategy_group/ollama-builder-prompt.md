# Ollama Builder Stage

Theme slug: `001_nolan_young_theme_meridian_strategy_group`

Prompt file: `/c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/prompts/pending/00-first-ollama-baseline-professional-services.txt`

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
- /c/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/reports/runs/001_nolan_young_theme_meridian_strategy_group/plan.md

Task:
- create the complete classic WordPress theme at wp-content/themes/001_nolan_young_theme_meridian_strategy_group/
- emit only file blocks using the required protocol
- include all required files, expanded template parts, premium header, local assets, and real prompt-specific content
- create local image assets under wp-content/themes/001_nolan_young_theme_meridian_strategy_group/assets/images/ and reference them from the templates
- implement Nolan-menu desktop and mobile behavior in local JS
- implement complete CSS for sticky header, Nolan-menu panels, mobile drawer, homepage, services, work, blog, contact, footer, and responsive states
- do not use remote assets, CDN assets, placeholder text, TODOs, or lorem ipsum
- keep the design polished, finished, and installable

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

## Plan

[?2026h[?25l[1G⠙ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠧ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠙ [K[?25h[?2026l[?2026h[?25l[1G⠙ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠦ [K[?25h[?2026l[?2026h[?25l[1G⠧ [K[?25h[?2026l[?2026h[?25l[1G⠧ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠦ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠙ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠧ [K[?25h[?2026l[?2026h[?25l[1G⠧ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠦ [K[?25h[?2026l[?2026h[?25l[1G⠧ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠙ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠦ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠦ [K[?25h[?2026l[?2026h[?25l[1G⠧ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠸ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?2026h[?25l[1G⠦ [K[?25h[?2026l[?2026h[?25l[1G⠦ [K[?25h[?2026l[?2026h[?25l[1G⠇ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠏ [K[?25h[?2026l[?2026h[?25l[1G⠋ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠹ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠼ [K[?25h[?2026l[?2026h[?25l[1G⠴ [K[?25h[?2026l[?25l[?2026h[?25l[1G[K[?25h[?2026l[2K[1G[?25h###[?25l[?25h Implementation[?25l[?25h Plan[?25l[?25h for[?25l[?25h Nolan[?25l[?25h Showcase[?25l[?25h Theme[?25l[?25h [?25l[?25h0[?25l[?25h1[?25l[?25h

[?25l[?25h####[?25l[?25h Page[?25l[?25h Map[?25l[?25h &[?25l[?25h Content[?25l[?25h Direction[?25l[?25h:
[?25l[?25h1[?25l[?25h.[?25l[?25h **[?25l[?25hHomepage[?25l[?25h (`[?25l[?25hhomepage[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`)[?25l[?25h**
[?25l[?25h  [?25l[?25h -[?25l[?25h Premium[?25l[?25h hero[?25l[?25h with[?25l[?25h clear[?25l[?25h positioning[?25l[?25h and[?25l[?25h a[?25l[?25h strong[?25l[?25h consultation[?25l[?25h C[?25l[?25hTA[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Services[?25l[?25h overview[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Featured[?25l[?25h work[?25l[?25h or[?25l[?25h case[?25l[?25h-st[?25l[?25hudy[?25l[?25h proof[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Trust[?25l[?25h/[?25l[?25hproof[?25l[?25h section[?25l[?25h with[?25l[?25h specific[?25l[?25h metrics[?25l[?25h or[?25l[?25h outcomes[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Process[?25l[?25h section[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Test[?25l[?25himonials[?25l[?25h or[?25l[?25h proof[?25l[?25h quotes[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Blog[?25l[?25h/resource[?25l[?25h preview[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Final[?25l[?25h C[?25l[?25hTA[?25l[?25h and[?25l[?25h full[?25l[?25h footer[?25l[?25h.

[?25l[?25h2[?25l[?25h.[?25l[?25h **[?25l[?25hServices[?25l[?25h (`[?25l[?25hservices[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`)[?25l[?25h**
[?25l[?25h  [?25l[?25h -[?25l[?25h Overview[?25l[?25h of[?25l[?25h the[?25l[?25h three[?25l[?25h main[?25l[?25h services[?25l[?25h ([?25l[?25hOperating[?25l[?25h Model[?25l[?25h Design[?25l[?25h,[?25l[?25h Complianc[9D[K
Compliance[?25l[?25h Read[?25l[?25hiness[?25l[?25h,[?25l[?25h Client[?25l[?25h Experience[?25l[?25h Systems[?25l[?25h).
[?25l[?25h  [?25l[?25h -[?25l[?25h Detailed[?25l[?25h description[?25l[?25h of[?25l[?25h each[?25l[?25h service[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Call[?25l[?25h to[?25l[?25h action[?25l[?25h for[?25l[?25h each[?25l[?25h service[?25l[?25h.

[?25l[?25h3[?25l[?25h.[?25l[?25h **[?25l[?25hSingle[?25l[?25h Service[?25l[?25h (`[?25l[?25hsingle[?25l[?25h_services[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h)**[?25l[?25h  
[?25l[?25h  [?25l[?25h -[?25l[?25h In[?25l[?25h-depth[?25l[?25h description[?25l[?25h of[?25l[?25h a[?25l[?25h selected[?25l[?25h service[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Case[?25l[?25h studies[?25l[?25h or[?25l[?25h testimonials[?25l[?25h related[?25l[?25h to[?25l[?25h the[?25l[?25h service[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Contact[?25l[?25h form[?25l[?25h or[?25l[?25h C[?25l[?25hTA[?25l[?25h.

[?25l[?25h4[?25l[?25h.[?25l[?25h **[?25l[?25hAbout[?25l[?25h Us[?25l[?25h (`[?25l[?25habout[?25l[?25h-us[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h)**[?25l[?25h  
[?25l[?25h  [?25l[?25h -[?25l[?25h Overview[?25l[?25h of[?25l[?25h the[?25l[?25h company[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Mission[?25l[?25h and[?25l[?25h values[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Team[?25l[?25h bios[?25l[?25h with[?25l[?25h images[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Company[?25l[?25h culture[?25l[?25h and[?25l[?25h ethos[?25l[?25h.

[?25l[?25h5[?25l[?25h.[?25l[?25h **[?25l[?25hWork[?25l[?25h (`[?25l[?25hwork[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h)**[?25l[?25h  
[?25l[?25h  [?25l[?25h -[?25l[?25h Portfolio[?25l[?25h showcasing[?25l[?25h completed[?25l[?25h projects[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Case[?25l[?25h studies[?25l[?25h or[?25l[?25h testimonials[?25l[?25h for[?25l[?25h each[?25l[?25h project[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Contact[?25l[?25h form[?25l[?25h or[?25l[?25h C[?25l[?25hTA[?25l[?25h.

[?25l[?25h6[?25l[?25h.[?25l[?25h **[?25l[?25hBlog[?25l[?25h (`[?25l[?25hblog[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h)**[?25l[?25h  
[?25l[?25h  [?25l[?25h -[?25l[?25h List[?25l[?25h of[?25l[?25h recent[?25l[?25h blog[?25l[?25h posts[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Featured[?25l[?25h blog[?25l[?25h post[?25l[?25h preview[?25l[?25h with[?25l[?25h image[?25l[?25h and[?25l[?25h summary[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Call[?25l[?25h to[?25l[?25h action[?25l[?25h for[?25l[?25h more[?25l[?25h articles[?25l[?25h.

[?25l[?25h7[?25l[?25h.[?25l[?25h **[?25l[?25hContact[?25l[?25h (`[?25l[?25hcontact[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h)**[?25l[?25h  
[?25l[?25h  [?25l[?25h -[?25l[?25h Contact[?25l[?25h form[?25l[?25h with[?25l[?25h fields[?25l[?25h for[?25l[?25h name[?25l[?25h,[?25l[?25h email[?25l[?25h,[?25l[?25h message[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Map[?25l[?25h or[?25l[?25h directions[?25l[?25h to[?25l[?25h the[?25l[?25h company[?25l[?25h's[?25l[?25h office[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Alternative[?25l[?25h contact[?25l[?25h methods[?25l[?25h like[?25l[?25h phone[?25l[?25h numbers[?25l[?25h and[?25l[?25h social[?25l[?25h media[?25l[?25h links[?25l[?25h.[6D[K
links.

[?25l[?25h####[?25l[?25h Design[?25l[?25h Direction[?25l[?25h:
[?25l[?25h-[?25l[?25h The[?25l[?25h design[?25l[?25h should[?25l[?25h be[?25l[?25h cohesive[?25l[?25h,[?25l[?25h clean[?25l[?25h,[?25l[?25h and[?25l[?25h premium[?25l[?25h.
[?25l[?25h-[?25l[?25h Use[?25l[?25h a[?25l[?25h color[?25l[?25h palette[?25l[?25h that[?25l[?25h con[?25l[?25hveys[?25l[?25h precision[?25l[?25h,[?25l[?25h calm[?25l[?25hness[?25l[?25h,[?25l[?25h and[?25l[?25h senior[?25l[?25hity[?25l[?25h.
[?25l[?25h-[?25l[?25h Incorpor[?25l[?25hate[?25l[?25h imagery[?25l[?25h relevant[?25l[?25h to[?25l[?25h healthcare[?25l[?25h,[?25l[?25h wellness[?25l[?25h,[?25l[?25h and[?25l[?25h professional[?25l[?25h se[2D[K
services[?25l[?25h.
[?25l[?25h-[?25l[?25h Ensure[?25l[?25h the[?25l[?25h use[?25l[?25h of[?25l[?25h high[?25l[?25h-quality[?25l[?25h local[?25l[?25h assets[?25l[?25h for[?25l[?25h images[?25l[?25h,[?25l[?25h logos[?25l[?25h,[?25l[?25h icons[?25l[?25h,[?25l[?25h etc[?25l[?25h[3D[K
etc.

[?25l[?25h####[?25l[?25h Ris[?25l[?25hks[?25l[?25h &[?25l[?25h Execution[?25l[?25h Prior[?25l[?25hities[?25l[?25h:
[?25l[?25h1[?25l[?25h.[?25l[?25h **[?25l[?25hR[?25l[?25hisks[?25l[?25h:[?25l[?25h**
[?25l[?25h  [?25l[?25h -[?25l[?25h Mis[?25l[?25hinterpret[?25l[?25hation[?25l[?25h of[?25l[?25h the[?25l[?25h brand[?25l[?25h positioning[?25l[?25h or[?25l[?25h tone[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Design[?25l[?25h that[?25l[?25h does[?25l[?25h not[?25l[?25h align[?25l[?25h with[?25l[?25h the[?25l[?25h premium[?25l[?25h standard[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h F[?25l[?25hailing[?25l[?25h to[?25l[?25h meet[?25l[?25h the[?25l[?25h deadline[?25l[?25h due[?25l[?25h to[?25l[?25h scope[?25l[?25h creep[?25l[?25h.

[?25l[?25h2[?25l[?25h.[?25l[?25h **[?25l[?25hExecution[?25l[?25h Prior[?25l[?25hities[?25l[?25h:[?25l[?25h**
[?25l[?25h  [?25l[?25h -[?25l[?25h Ensure[?25l[?25h adherence[?25l[?25h to[?25l[?25h the[?25l[?25h branding[?25l[?25h guidelines[?25l[?25h and[?25l[?25h premium[?25l[?25h output[?25l[?25h standar[7D[K
standards[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Prior[?25l[?25hitize[?25l[?25h creating[?25l[?25h high[?25l[?25h-quality[?25l[?25h,[?25l[?25h relevant[?25l[?25h images[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Focus[?25l[?25h on[?25l[?25h the[?25l[?25h interactive[?25l[?25h elements[?25l[?25h of[?25l[?25h the[?25l[?25h Nolan[?25l[?25h-menu[?25l[?25h header[?25l[?25h for[?25l[?25h accessi[7D[K
accessibility[?25l[?25h and[?25l[?25h user[?25l[?25h experience[?25l[?25h.
[?25l[?25h  [?25l[?25h -[?25l[?25h Ensure[?25l[?25h all[?25l[?25h static[?25l[?25h preview[?25l[?25h pages[?25l[?25h are[?25l[?25h fully[?25l[?25h functional[?25l[?25h and[?25l[?25h visually[?25l[?25h matc[4D[K
match[?25l[?25h the[?25l[?25h WordPress[?25l[?25h templates[?25l[?25h.

[?25l[?25h####[?25l[?25h Static[?25l[?25h Preview[?25l[?25h Pages[?25l[?25h:
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25hindex[?25l[?25h.html[?25l[?25h`[?25l[?25h**[?25l[?25h ([?25l[?25hMain[?25l[?25h entry[?25l[?25h point[?25l[?25h)
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25hhomepage[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h**
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25hservices[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h**
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25habout[?25l[?25h-us[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h**
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25hcontact[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h**
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25hsingle[?25l[?25h_services[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h**
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25hblog[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h**
[?25l[?25h-[?25l[?25h **[?25l[?25h`[?25l[?25hwork[?25l[?25h_preview[?25l[?25h.html[?25l[?25h`[?25l[?25h**

[?25l[?25hEach[?25l[?25h static[?25l[?25h preview[?25l[?25h page[?25l[?25h should[?25l[?25h visually[?25l[?25h match[?25l[?25h the[?25l[?25h corresponding[?25l[?25h WordPress[?25l[?25h [K
template[?25l[?25h,[?25l[?25h including[?25l[?25h:
[?25l[?25h-[?25l[?25h The[?25l[?25h same[?25l[?25h header[?25l[?25h and[?25l[?25h footer[?25l[?25h.
[?25l[?25h-[?25l[?25h Cons[?25l[?25histent[?25l[?25h use[?25l[?25h of[?25l[?25h classes[?25l[?25h,[?25l[?25h section[?25l[?25h order[?25l[?25h,[?25l[?25h image[?25l[?25h assets[?25l[?25h,[?25l[?25h and[?25l[?25h visual[?25l[?25h hierar[6D[K
hierarchy[?25l[?25h.

[?25l[?25h####[?25l[?25h Nolan[?25l[?25h-menu[?25l[?25h Header[?25l[?25h &[?25l[?25h Local[?25l[?25h Image[?25l[?25h Asset[?25l[?25h Set[?25l[?25h:
[?25l[?25h-[?25l[?25h Implement[?25l[?25h a[?25l[?25h sticky[?25l[?25h header[?25l[?25h with[?25l[?25h specific[?25l[?25h behaviors[?25l[?25h as[?25l[?25h defined[?25l[?25h in[?25l[?25h `[?25l[?25hcontract[9D[K
`contracts[?25l[?25h/n[?25l[?25holan[?25l[?25h-menu[?25l[?25h-header[?25l[?25h.md[?25l[?25h`.
[?25l[?25h-[?25l[?25h Use[?25l[?25h local[?25l[?25h copyright[?25l[?25h-safe[?25l[?25h images[?25l[?25h that[?25l[?25h match[?25l[?25h the[?25l[?25h healthcare[?25l[?25h and[?25l[?25h professiona[11D[K
professional[?25l[?25h services[?25l[?25h theme[?25l[?25h.
[?25l[?25h-[?25l[?25h Store[?25l[?25h images[?25l[?25h under[?25l[?25h the[?25l[?25h required[?25l[?25h asset[?25l[?25h folders[?25l[?25h (`[?25l[?25h/[?25l[?25hassets[?25l[?25h/images[?25l[?25h/[?25l[?25h`)[?25l[?25h with[?25l[?25h de[2D[K
descriptive[?25l[?25h filenames[?25l[?25h.

[?25l[?25h###[?25l[?25h Summary[?25l[?25h:
[?25l[?25hThis[?25l[?25h plan[?25l[?25h ensures[?25l[?25h that[?25l[?25h the[?25l[?25h Nolan[?25l[?25h Showcase[?25l[?25h Theme[?25l[?25h [?25l[?25h0[?25l[?25h1[?25l[?25h meets[?25l[?25h all[?25l[?25h the[?25l[?25h specified[?25l[?25h [K
requirements[?25l[?25h,[?25l[?25h including[?25l[?25h brand[?25l[?25h positioning[?25l[?25h,[?25l[?25h design[?25l[?25h quality[?25l[?25h,[?25l[?25h content[?25l[?25h relevanc[8D[K
relevance[?25l[?25h,[?25l[?25h and[?25l[?25h technical[?25l[?25h standards[?25l[?25h.[?25l[?25h By[?25l[?25h following[?25l[?25h this[?25l[?25h structured[?25l[?25h approach[?25l[?25h,[?25l[?25h [K
we[?25l[?25h can[?25l[?25h deliver[?25l[?25h a[?25l[?25h polished[?25l[?25h premium[?25l[?25h company[?25l[?25h website[?25l[?25h ready[?25l[?25h for[?25l[?25h launch[?25l[?25h.[?25l[?25h

[?25l[?25h