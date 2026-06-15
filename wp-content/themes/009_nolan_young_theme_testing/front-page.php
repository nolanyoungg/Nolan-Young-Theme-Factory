<?php
/**
 * Front page template.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main front-page">
	<?php nolan_young_theme_render_form_notice(); ?>

	<section class="hero-section section-shell">
		<div class="container hero-section__grid">
			<div class="hero-section__content">
				<p class="section-kicker"><?php esc_html_e( 'Senior software delivery for operators who need systems that hold up under real use.', '009_nolan_young_theme_testing' ); ?></p>
				<h1><?php esc_html_e( 'Replace manual workflows with custom software your team can actually run.', '009_nolan_young_theme_testing' ); ?></h1>
				<p class="hero-section__lead"><?php esc_html_e( 'Northstar Codeworks builds internal tools, client portals, API integrations, and automation systems for growing service businesses that have outgrown spreadsheets and disconnected SaaS subscriptions.', '009_nolan_young_theme_testing' ); ?></p>
				<div class="hero-section__actions">
					<a class="button button--primary" href="#contact"><?php esc_html_e( 'Book a Consultation', '009_nolan_young_theme_testing' ); ?></a>
					<a class="button button--secondary" href="#work"><?php esc_html_e( 'View Case Studies', '009_nolan_young_theme_testing' ); ?></a>
				</div>
				<ul class="hero-section__meta" aria-label="<?php esc_attr_e( 'Northstar Codeworks proof points', '009_nolan_young_theme_testing' ); ?>">
					<li><strong>Discovery-led</strong><span>Architecture before implementation.</span></li>
					<li><strong>Maintainable</strong><span>Clear codebases, documented decisions, long-term support.</span></li>
					<li><strong>Practical</strong><span>Built around operations, approvals, and team handoffs.</span></li>
				</ul>
			</div>
			<div class="hero-visual" aria-hidden="true">
				<div class="hero-visual__panel hero-visual__panel--primary">
					<span class="hero-visual__label">Workflow Map</span>
					<div class="hero-visual__nodes">
						<span>Lead Intake</span>
						<span>Scheduling</span>
						<span>Billing Sync</span>
						<span>Ops Dashboard</span>
					</div>
				</div>
				<div class="hero-visual__panel hero-visual__panel--secondary">
					<span class="hero-visual__label">Ops Metrics</span>
					<ul>
						<li><strong>42%</strong> less manual entry</li>
						<li><strong>3 systems</strong> unified under one workflow</li>
						<li><strong>Daily</strong> reporting without spreadsheet cleanup</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="trust-bar section-shell">
		<div class="container trust-bar__grid">
			<div><strong>Founder and ops friendly</strong><span>Built for buyers who need clarity, not hand-waving.</span></div>
			<div><strong>Architecture-first delivery</strong><span>Discovery, implementation roadmap, then deliberate build phases.</span></div>
			<div><strong>Clean handoff standards</strong><span>Documentation, maintainability notes, and support-ready launches.</span></div>
			<div><strong>High-fit projects</strong><span>Internal tools, portals, integrations, workflow automation, modernization.</span></div>
		</div>
	</section>

	<section id="services" class="services-preview section-shell">
		<div class="container">
			<div class="section-heading">
				<p class="section-kicker"><?php esc_html_e( 'Services', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Software engagements built around the operating bottlenecks that slow teams down.', '009_nolan_young_theme_testing' ); ?></h2>
				<p><?php esc_html_e( 'Each service page is scoped to business outcomes, delivery constraints, and maintenance realities rather than generic feature lists.', '009_nolan_young_theme_testing' ); ?></p>
			</div>
			<div class="card-grid card-grid--services">
				<article id="service-web-applications" class="info-card">
					<h3><?php esc_html_e( 'Custom Web Applications', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Purpose-built systems for complex workflows, approvals, reporting, and user-facing operations that do not fit off-the-shelf tools.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
				<article id="service-internal-tools" class="info-card">
					<h3><?php esc_html_e( 'Internal Tools and Admin Portals', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Operator-focused dashboards that centralize recurring tasks, reduce duplicate entry, and improve handoff quality across teams.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
				<article id="service-api-integrations" class="info-card">
					<h3><?php esc_html_e( 'API Integrations', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Stable connections between CRM, billing, scheduling, forms, and reporting tools so data moves once and arrives where it should.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
				<article id="service-automation-systems" class="info-card">
					<h3><?php esc_html_e( 'Workflow Automation Systems', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Automation for quote intake, job routing, notifications, document generation, and other repetitive operational sequences.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
				<article class="info-card">
					<h3><?php esc_html_e( 'Legacy System Modernization', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Careful replacement or stabilization of brittle tools, ad hoc admin panels, and spreadsheet-heavy workflows without disrupting active teams.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
				<article class="info-card">
					<h3><?php esc_html_e( 'Technical Discovery and Architecture', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'A structured engagement for process mapping, system decisions, implementation sequencing, and scope clarification before build work starts.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
			</div>
		</div>
	</section>

	<section class="problem-solution section-shell section-shell--alt">
		<div class="container split-layout">
			<div>
				<p class="section-kicker"><?php esc_html_e( 'Why teams call us', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Most operations problems are not caused by lack of effort. They are caused by bad system shape.', '009_nolan_young_theme_testing' ); ?></h2>
			</div>
			<div class="stack-list">
				<div class="stack-card">
					<h3><?php esc_html_e( 'Before', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Spreadsheets as source of truth, email-driven approvals, duplicate data entry, weak reporting, and fragile workarounds between SaaS tools.', '009_nolan_young_theme_testing' ); ?></p>
				</div>
				<div class="stack-card">
					<h3><?php esc_html_e( 'After', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Deliberate workflow design, connected systems, clearer ownership, faster response time, and software that new team members can learn without tribal knowledge.', '009_nolan_young_theme_testing' ); ?></p>
				</div>
			</div>
		</div>
	</section>

	<section id="process" class="process section-shell">
		<div class="container">
			<div class="section-heading">
				<p class="section-kicker"><?php esc_html_e( 'Process', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'A delivery model designed to reduce ambiguity before it becomes expensive.', '009_nolan_young_theme_testing' ); ?></h2>
			</div>
			<ol class="process-grid">
				<li><strong>Discovery and workflow mapping</strong><span>Clarify inputs, outputs, approvals, reporting needs, and edge cases with the people who actually run the work.</span></li>
				<li><strong>Architecture and roadmap</strong><span>Define systems, data flow, constraints, integration points, and implementation phases before code starts accumulating.</span></li>
				<li><strong>Interface design and prototype review</strong><span>Shape the operator experience with realistic states, clear task flows, and feedback loops.</span></li>
				<li><strong>Iterative build, QA, and stakeholder review</strong><span>Ship in defensible milestones with functional testing, review checkpoints, and practical tradeoff decisions.</span></li>
				<li><strong>Launch, documentation, monitoring, and support</strong><span>Make the handoff durable with docs, training notes, and a support plan that fits the system.</span></li>
			</ol>
		</div>
	</section>

	<section id="work" class="featured-work section-shell">
		<div class="container">
			<div class="section-heading">
				<p class="section-kicker"><?php esc_html_e( 'Featured Work', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Representative software outcomes for B2B teams that needed operational clarity, not another dashboard screenshot.', '009_nolan_young_theme_testing' ); ?></h2>
			</div>
			<div class="case-study-grid">
				<article class="case-study-card">
					<span class="case-study-card__tag">Operations Dashboard</span>
					<h3><?php esc_html_e( 'Multi-location field operations dashboard', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Built a role-based control center for dispatch, QA review, and daily margin reporting across multiple service regions.', '009_nolan_young_theme_testing' ); ?></p>
					<ul>
						<li><strong>Challenge:</strong> fragmented spreadsheets and no trustworthy daily visibility</li>
						<li><strong>Solution:</strong> centralized scheduling, status tracking, and reporting pipeline</li>
						<li><strong>Result:</strong> faster issue detection and cleaner handoffs between ops and finance</li>
					</ul>
				</article>
				<article class="case-study-card">
					<span class="case-study-card__tag">Client Portal</span>
					<h3><?php esc_html_e( 'Professional services client portal', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Designed a secure portal for document exchange, milestone visibility, approvals, and ongoing account communication.', '009_nolan_young_theme_testing' ); ?></p>
					<ul>
						<li><strong>Challenge:</strong> email-heavy status management and slow approval cycles</li>
						<li><strong>Solution:</strong> portal workflows with role permissions and action history</li>
						<li><strong>Result:</strong> stronger client transparency and less admin overhead</li>
					</ul>
				</article>
				<article class="case-study-card">
					<span class="case-study-card__tag">Integration Layer</span>
					<h3><?php esc_html_e( 'CRM, billing, and scheduling integration layer', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Created a middleware layer that normalized records and automated downstream updates between disconnected systems.', '009_nolan_young_theme_testing' ); ?></p>
					<ul>
						<li><strong>Challenge:</strong> mismatched records and unreliable duplicate entry</li>
						<li><strong>Solution:</strong> automated sync rules, validation, and exception handling</li>
						<li><strong>Result:</strong> lower data cleanup time and better reporting confidence</li>
					</ul>
				</article>
				<article class="case-study-card">
					<span class="case-study-card__tag">Automation</span>
					<h3><?php esc_html_e( 'Quote intake and project handoff automation', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Mapped the pre-sales to delivery workflow and automated intake routing, estimate prep, and kickoff handoff tasks.', '009_nolan_young_theme_testing' ); ?></p>
					<ul>
						<li><strong>Challenge:</strong> quote delays and inconsistent project launch prep</li>
						<li><strong>Solution:</strong> automation around intake, alerts, and downstream task creation</li>
						<li><strong>Result:</strong> faster turnaround and fewer dropped details</li>
					</ul>
				</article>
			</div>
		</div>
	</section>

	<section class="testimonials section-shell section-shell--dark">
		<div class="container">
			<div class="section-heading section-heading--light">
				<p class="section-kicker"><?php esc_html_e( 'Proof', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Buyers do not need hype. They need to know the work will stay clear under pressure.', '009_nolan_young_theme_testing' ); ?></h2>
			</div>
			<div class="testimonial-grid">
				<blockquote class="testimonial-card">
					<p><?php esc_html_e( 'Northstar Codeworks translated a messy approval process into a system our operations team could trust. The big win was not just automation. It was clarity.', '009_nolan_young_theme_testing' ); ?></p>
					<cite><?php esc_html_e( 'Director of Operations, regional service company', '009_nolan_young_theme_testing' ); ?></cite>
				</blockquote>
				<blockquote class="testimonial-card">
					<p><?php esc_html_e( 'The technical work was strong, but the difference was the implementation discipline. Architecture decisions were explained clearly and the handoff was clean.', '009_nolan_young_theme_testing' ); ?></p>
					<cite><?php esc_html_e( 'Founder, B2B professional services firm', '009_nolan_young_theme_testing' ); ?></cite>
				</blockquote>
				<blockquote class="testimonial-card">
					<p><?php esc_html_e( 'We stopped moving the same client data through three systems by hand. That alone changed how quickly our team could respond.', '009_nolan_young_theme_testing' ); ?></p>
					<cite><?php esc_html_e( 'Operations lead, multi-office consultancy', '009_nolan_young_theme_testing' ); ?></cite>
				</blockquote>
			</div>
		</div>
	</section>

	<section id="resources" class="resources-preview section-shell">
		<div class="container">
			<div class="section-heading">
				<p class="section-kicker"><?php esc_html_e( 'Resources', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Educational content for founders and operators planning more serious software work.', '009_nolan_young_theme_testing' ); ?></h2>
			</div>
			<div class="card-grid">
				<article class="info-card">
					<h3><?php esc_html_e( 'When custom software beats another SaaS subscription', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'A decision framework for teams balancing recurring tool sprawl against long-term software leverage.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
				<article class="info-card">
					<h3><?php esc_html_e( 'How to plan an internal tool project', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'A practical checklist covering user roles, workflow edges, reporting needs, and rollout constraints.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
				<article class="info-card">
					<h3><?php esc_html_e( 'Integration mistakes that create maintenance drag', '009_nolan_young_theme_testing' ); ?></h3>
					<p><?php esc_html_e( 'Common architecture shortcuts that look fast early and become expensive later.', '009_nolan_young_theme_testing' ); ?></p>
				</article>
			</div>
		</div>
	</section>

	<section class="faq section-shell section-shell--alt">
		<div class="container faq-layout">
			<div>
				<p class="section-kicker"><?php esc_html_e( 'FAQ', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Common questions before a discovery call.', '009_nolan_young_theme_testing' ); ?></h2>
			</div>
			<div class="faq-list">
				<details>
					<summary><?php esc_html_e( 'What projects are the best fit?', '009_nolan_young_theme_testing' ); ?></summary>
					<p><?php esc_html_e( 'Northstar Codeworks is strongest when the business problem touches real workflow complexity: approvals, system handoffs, reporting, user roles, or brittle integrations.', '009_nolan_young_theme_testing' ); ?></p>
				</details>
				<details>
					<summary><?php esc_html_e( 'Do you handle discovery before full implementation?', '009_nolan_young_theme_testing' ); ?></summary>
					<p><?php esc_html_e( 'Yes. Discovery and technical architecture can run as a focused engagement so teams can validate scope, sequence, and risk before committing to build work.', '009_nolan_young_theme_testing' ); ?></p>
				</details>
				<details>
					<summary><?php esc_html_e( 'Can you improve an existing internal system instead of replacing it?', '009_nolan_young_theme_testing' ); ?></summary>
					<p><?php esc_html_e( 'Yes. Many engagements start by stabilizing or extending an existing system when a full rebuild would create unnecessary disruption.', '009_nolan_young_theme_testing' ); ?></p>
				</details>
				<details>
					<summary><?php esc_html_e( 'What happens after launch?', '009_nolan_young_theme_testing' ); ?></summary>
					<p><?php esc_html_e( 'Launch includes documentation, support planning, and practical maintenance notes so the system stays understandable after the initial project ends.', '009_nolan_young_theme_testing' ); ?></p>
				</details>
			</div>
		</div>
	</section>

	<section id="about" class="final-cta section-shell">
		<div class="container final-cta__grid">
			<div>
				<p class="section-kicker"><?php esc_html_e( 'About Northstar Codeworks', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Senior engineering judgment, calm communication, and software shaped for real operators.', '009_nolan_young_theme_testing' ); ?></h2>
				<p><?php esc_html_e( 'The company focuses on systems that reduce operational drag without creating a maintenance burden. That means direct communication, specific tradeoff decisions, and implementation quality that survives team growth.', '009_nolan_young_theme_testing' ); ?></p>
			</div>
			<div id="contact" class="contact-panel">
				<h3><?php esc_html_e( 'Book a consultation', '009_nolan_young_theme_testing' ); ?></h3>
				<p><?php esc_html_e( 'Tell us what is breaking down today, what systems are involved, and what success should look like.', '009_nolan_young_theme_testing' ); ?></p>
				<form class="contact-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
					<input type="hidden" name="action" value="nolan_young_theme_submit_consultation">
					<?php wp_nonce_field( 'nolan_young_theme_submit_consultation', 'consultation_form_nonce' ); ?>
					<div class="form-grid">
						<label><span><?php esc_html_e( 'Name', '009_nolan_young_theme_testing' ); ?></span><input type="text" name="name" required></label>
						<label><span><?php esc_html_e( 'Email', '009_nolan_young_theme_testing' ); ?></span><input type="email" name="email" required></label>
						<label><span><?php esc_html_e( 'Phone', '009_nolan_young_theme_testing' ); ?></span><input type="tel" name="phone"></label>
						<label><span><?php esc_html_e( 'Project Type', '009_nolan_young_theme_testing' ); ?></span><input type="text" name="project_type"></label>
						<label><span><?php esc_html_e( 'Business Type', '009_nolan_young_theme_testing' ); ?></span><input type="text" name="business_type"></label>
						<label><span><?php esc_html_e( 'Current Website URL', '009_nolan_young_theme_testing' ); ?></span><input type="url" name="website"></label>
						<label><span><?php esc_html_e( 'Timeline', '009_nolan_young_theme_testing' ); ?></span><input type="text" name="timeline"></label>
						<label><span><?php esc_html_e( 'Budget Range', '009_nolan_young_theme_testing' ); ?></span><input type="text" name="budget"></label>
						<label class="form-grid__full"><span><?php esc_html_e( 'Goals', '009_nolan_young_theme_testing' ); ?></span><textarea name="goals" rows="5" required></textarea></label>
					</div>
					<button class="button button--primary" type="submit"><?php esc_html_e( 'Request Consultation', '009_nolan_young_theme_testing' ); ?></button>
				</form>
				<p class="contact-panel__meta"><?php esc_html_e( 'Typical response time: within 1 business day. Urgent workflow blockers can be flagged in the goals field.', '009_nolan_young_theme_testing' ); ?></p>
			</div>
		</div>
	</section>
</main>
<?php
get_footer();
