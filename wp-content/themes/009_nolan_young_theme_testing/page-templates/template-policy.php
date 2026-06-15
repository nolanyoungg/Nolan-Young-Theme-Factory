<?php
/**
 * Template Name: Policy
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<section class="page-hero section-shell">
		<div class="container narrow-flow">
			<p class="section-kicker"><?php esc_html_e( 'Policy', '009_nolan_young_theme_testing' ); ?></p>
			<h1><?php esc_html_e( 'Privacy and data handling overview', '009_nolan_young_theme_testing' ); ?></h1>
			<p><?php esc_html_e( 'Northstar Codeworks collects only the information required to review project inquiries, respond to consultations, and manage newsletter subscriptions.', '009_nolan_young_theme_testing' ); ?></p>
		</div>
	</section>
	<section class="section-shell section-shell--alt">
		<div class="container narrow-flow">
			<h2><?php esc_html_e( 'Information collected', '009_nolan_young_theme_testing' ); ?></h2>
			<p><?php esc_html_e( 'Project and newsletter forms may collect names, email addresses, phone numbers, company details, workflow goals, timelines, budget context, and related planning notes.', '009_nolan_young_theme_testing' ); ?></p>
			<h2><?php esc_html_e( 'How information is used', '009_nolan_young_theme_testing' ); ?></h2>
			<p><?php esc_html_e( 'Submission data is used to review fit, respond to inquiries, and manage planning conversations. Data should not be sold or shared beyond the practical needs of servicing the request.', '009_nolan_young_theme_testing' ); ?></p>
			<h2><?php esc_html_e( 'Retention and access', '009_nolan_young_theme_testing' ); ?></h2>
			<p><?php esc_html_e( 'Form submissions are stored in the WordPress admin under Forms for operational review and CSV export. Site owners should periodically review retention practices and remove submissions they no longer need.', '009_nolan_young_theme_testing' ); ?></p>
		</div>
	</section>
</main>
<?php get_footer(); ?>
