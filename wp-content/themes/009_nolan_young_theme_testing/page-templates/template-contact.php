<?php
/**
 * Template Name: Contact Us
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<?php nolan_young_theme_render_form_notice(); ?>
	<section class="page-hero section-shell">
		<div class="container narrow-flow">
			<p class="section-kicker"><?php esc_html_e( 'Contact', '009_nolan_young_theme_testing' ); ?></p>
			<h1><?php esc_html_e( 'Start with the workflow that is slowing the business down the most.', '009_nolan_young_theme_testing' ); ?></h1>
			<p><?php esc_html_e( 'Share the systems involved, the operational pain point, and the outcome you need. Submissions are stored in the Forms admin area for review and export.', '009_nolan_young_theme_testing' ); ?></p>
		</div>
	</section>
	<section class="section-shell section-shell--alt">
		<div class="container split-layout">
			<div class="contact-panel">
				<h2><?php esc_html_e( 'Project inquiry', '009_nolan_young_theme_testing' ); ?></h2>
				<form class="contact-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
					<input type="hidden" name="action" value="nolan_young_theme_submit_contact">
					<?php wp_nonce_field( 'nolan_young_theme_submit_contact', 'contact_form_nonce' ); ?>
					<div class="form-grid">
						<label><span><?php esc_html_e( 'Name', '009_nolan_young_theme_testing' ); ?></span><input type="text" name="name" required></label>
						<label><span><?php esc_html_e( 'Email', '009_nolan_young_theme_testing' ); ?></span><input type="email" name="email" required></label>
						<label><span><?php esc_html_e( 'Phone', '009_nolan_young_theme_testing' ); ?></span><input type="tel" name="phone"></label>
						<label><span><?php esc_html_e( 'Company / Organization', '009_nolan_young_theme_testing' ); ?></span><input type="text" name="company"></label>
						<label class="form-grid__full"><span><?php esc_html_e( 'Service Interest', '009_nolan_young_theme_testing' ); ?></span><select name="service_type"><option><?php esc_html_e( 'Custom Web Applications', '009_nolan_young_theme_testing' ); ?></option><option><?php esc_html_e( 'Internal Tools and Admin Portals', '009_nolan_young_theme_testing' ); ?></option><option><?php esc_html_e( 'API Integrations', '009_nolan_young_theme_testing' ); ?></option><option><?php esc_html_e( 'Workflow Automation Systems', '009_nolan_young_theme_testing' ); ?></option><option><?php esc_html_e( 'Technical Discovery and Architecture', '009_nolan_young_theme_testing' ); ?></option></select></label>
						<label class="form-grid__full"><span><?php esc_html_e( 'Message', '009_nolan_young_theme_testing' ); ?></span><textarea name="message" rows="6" required></textarea></label>
					</div>
					<button class="button button--primary" type="submit"><?php esc_html_e( 'Send Project Inquiry', '009_nolan_young_theme_testing' ); ?></button>
				</form>
			</div>
			<div class="stack-list">
				<div class="stack-card"><h2><?php esc_html_e( 'Contact details', '009_nolan_young_theme_testing' ); ?></h2><p><a href="mailto:hello@northstarcodeworks.com">hello@northstarcodeworks.com</a></p><p><?php esc_html_e( 'Consultation response time: within 1 business day.', '009_nolan_young_theme_testing' ); ?></p></div>
				<div class="stack-card"><h2><?php esc_html_e( 'Best fit projects', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'Internal platforms, client portals, operational dashboards, integration layers, automation systems, and modernization work for service-focused B2B teams.', '009_nolan_young_theme_testing' ); ?></p></div>
				<div class="stack-card"><h2><?php esc_html_e( 'Urgent requests', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'If a current system is causing active operational risk, note that in the message field so the response can be prioritized correctly.', '009_nolan_young_theme_testing' ); ?></p></div>
			</div>
		</div>
	</section>
</main>
<?php get_footer(); ?>
