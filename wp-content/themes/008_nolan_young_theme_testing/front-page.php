<?php
// This is the front page template for displaying all of the Front Page content.
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
get_header();
?>
<main id="primary" class="site-main">
	<section id="hero" class="hero-section">
		<div class="hero-content">
			<h1>Welcome to Northstar Codeworks</h1>
			<p>Building custom web applications, internal tools, API integrations, and automation systems for growing service businesses.</p>
			<a href="#contact-section" class="btn-primary">Book a Consultation</a>
		</div>
		<div class="hero-image">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/images/hero-software-interface.svg" alt="Software Interface">
		</div>
	</section>
	<section id="trust-bar" class="trust-section">
		<div class="trust-container">
			<div class="trust-item">
				<h2>Trusted by</h2>
				<ul>
					<li>Enterprise Clients</li>
					<li>SaaS Providers</li>
					<li>Professional Services Firms</li>
				</ul>
			</div>
			<div class="trust-item">
				<h2>Experience</h2>
				<ul>
					<li>10+ Years in Software Development</li>
					<li>Over 50 Completed Projects</li>
					<li>Experienced Senior Engineers</li>
				</ul>
			</div>
			<div class="trust-item">
				<h2>Awards</h2>
				<ul>
					<li>Best in Class</li>
					<li>Innovator of the Year</li>
					<li>Customer Satisfaction Award</li>
				</ul>
			</div>
		</div>
	</section>
	<section id="services-preview" class="services-section">
		<div class="services-container">
			<h2>Our Core Services</h2>
			<div class="service-card">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/icon-web-app.svg" alt="Web Applications">
				<h3>Custom Web Applications</h3>
				<p>Build robust, scalable web applications tailored to your business needs.</p>
				<a href="<?php echo esc_url( home_url( '/services/custom-web-applications/' ) ); ?>" class="btn-secondary">Learn More</a>
			</div>
			<div class="service-card">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/icon-internal-tools.svg" alt="Internal Tools">
				<h3>Internal Tools and Admin Portals</h3>
				<p>Create intuitive internal tools to streamline operations and boost productivity.</p>
				<a href="<?php echo esc_url( home_url( '/services/internal-tools/' ) ); ?>" class="btn-secondary">Learn More</a>
			</div>
			<div class="service-card">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/icon-api-integrations.svg" alt="API Integrations">
				<h3>API Integrations</h3>
				<p>Leverage API integrations to connect and automate your workflows.</p>
				<a href="<?php echo esc_url( home_url( '/services/api-integrations/' ) ); ?>" class="btn-secondary">Learn More</a>
			</div>
			<div class="service-card">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/icon-automation.svg" alt="Automation Systems">
				<h3>Workflow Automation Systems</h3>
				<p>Automate your processes to save time and reduce errors.</p>
				<a href="<?php echo esc_url( home_url( '/services/automation-systems/' ) ); ?>" class="btn-secondary">Learn More</a>
			</div>
		</div>
	</section>
	<section id="problem-solution" class="solution-section">
		<div class="solution-content">
			<h2>Replacing Manual Workflows and Disconnected Tools</h2>
			<p>Northstar Codeworks specializes in transforming complex business processes into efficient, automated systems. We help businesses replace manual spreadsheets, disconnected tools, and repetitive tasks with reliable software solutions.</p>
			<a href="#contact-section" class="btn-primary">Book a Consultation</a>
		</div>
	</section>
	<section id="process" class="process-section">
		<div class="process-container">
			<h2>Our Process</h2>
			<ol>
				<li><strong>Discovery:</strong> Understand your business needs and workflows.</li>
				<li><strong>Architecture:</strong> Plan the technical architecture and implementation roadmap.</li>
				<li><strong>Design:</strong> Create detailed interface designs and prototypes.</li>
				<li><strong>Build:</strong> Develop, test, and iterate on the software solution.</li>
				<li><strong>Launch:</strong> Deploy the application with comprehensive documentation and monitoring.</li>
			</ol>
		</div>
	</section>
	<section id="featured-work" class="case-study-section">
		<div class="case-study-container">
			<h2>Featured Work</h2>
			<div class="case-study-item">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/case-study-1.svg" alt="Case Study 1">
				<h3>Operations Dashboard for Multi-Location Service Business</h3>
				<p>A customized dashboard to manage operations across multiple locations.</p>
				<a href="<?php echo esc_url( home_url( '/work/multi-location-dashboard/' ) ); ?>" class="btn-secondary">View Case Study</a>
			</div>
			<div class="case-study-item">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/case-study-2.svg" alt="Case Study 2">
				<h3>Client Portal for Professional Services Firm</h3>
				<p>A secure portal for clients to manage their engagements and communications.</p>
				<a href="<?php echo esc_url( home_url( '/work/client-portal/' ) ); ?>" class="btn-secondary">View Case Study</a>
			</div>
			<div class="case-study-item">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/case-study-3.svg" alt="Case Study 3">
				<h3>API Integration Layer for CRM, Billing, and Scheduling</h3>
				<p>An integrated solution to streamline data flow between various tools.</p>
				<a href="<?php echo esc_url( home_url( '/work/api-integration/' ) ); ?>" class="btn-secondary">View Case Study</a>
			</div>
			<div class="case-study-item">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/case-study-4.svg" alt="Case Study 4">
				<h3>Workflow Automation for Quote Intake and Project Handoff</h3>
				<p>A system to automate the intake of quotes and handover of projects.</p>
				<a href="<?php echo esc_url( home_url( '/work/workflow-automation/' ) ); ?>" class="btn-secondary">View Case Study</a>
			</div>
		</div>
	</section>
	<section id="testimonials" class="testimonial-section">
		<div class="testimonial-container">
			<h2>What Clients Say</h2>
			<div class="testimonial-item">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/testimonial-1.svg" alt="Testimonial 1">
				<blockquote>
					<p>Northstar Codeworks delivered a custom solution that significantly improved our workflow efficiency.</p>
				</blockquote>
				<p><strong>- John Doe, CEO of XYZ Corp</strong></p>
			</div>
			<div class="testimonial-item">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/testimonial-2.svg" alt="Testimonial 2">
				<blockquote>
					<p>The team at Northstar Codeworks was professional and responsive throughout the project.</p>
				</blockquote>
				<p><strong>- Jane Smith, Operations Manager of ABC Inc</strong></p>
			</div>
			<div class="testimonial-item">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/testimonial-3.svg" alt="Testimonial 3">
				<blockquote>
					<p>The reliability and maintainability of their systems have been a game-changer for us.</p>
				</blockquote>
				<p><strong>- Tom Brown, CTO of DEF Tech</strong></p>
			</div>
		</div>
	</section>
	<section id="faq" class="faq-section">
		<div class="faq-container">
			<h2>Frequently Asked Questions</h2>
			<details>
				<summary>What services do you offer?</summary>
				<p>We offer custom web applications, internal tools, API integrations, and workflow automation systems.</p>
			</details>
			<details>
				<summary>How long does a project take?</summary>
				<p>The timeline varies based on the complexity of the project, but we aim to provide clear estimates during the discovery phase.</p>
			</details>
			<details>
				<summary>What is your engagement model?</summary>
				<p>We offer flexible engagement models, including fixed-price projects and hourly rates. Contact us for a custom quote.</p>
			</details>
			<details>
				<summary>Do you provide support after the project is complete?</summary>
				<p>Yes, we offer ongoing support and maintenance to ensure your systems run smoothly over time.</p>
			</details>
		</div>
	</section>
	<section id="contact-section" class="contact-section">
		<div class="contact-container">
			<h2>Get in Touch</h2>
			<p>Ready to take the next step? Let's discuss your project needs.</p>
			<form method="post" action="#" id="contact-form">
				<label for="name">Name</label>
				<input type="text" name="name" placeholder="Your Name" required>
				<label for="email">Email</label>
				<input type="email" name="email" placeholder="Your Email Address" required>
				<label for="phone">Phone</label>
				<input type="tel" name="phone" placeholder="Your Phone Number">
				<label for="company">Company / Organization</label>
				<input type="text" name="company" placeholder="Your Company/Organization Name">
				<label for="message">Message</label>
				<textarea name="message" placeholder="Tell us about your project needs..."></textarea>
				<button type="submit">Send Message</button>
			</form>
		</div>
	</section>
</main>
<?php
get_footer();
?>
