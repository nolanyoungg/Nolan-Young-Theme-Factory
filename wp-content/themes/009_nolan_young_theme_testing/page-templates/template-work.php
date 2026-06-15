<?php
/**
 * Template Name: Work / Portfolio
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<section class="page-hero section-shell">
		<div class="container narrow-flow">
			<p class="section-kicker"><?php esc_html_e( 'Work', '009_nolan_young_theme_testing' ); ?></p>
			<h1><?php esc_html_e( 'Case studies focused on workflow clarity, integration reliability, and operational leverage.', '009_nolan_young_theme_testing' ); ?></h1>
		</div>
	</section>
	<section class="section-shell">
		<div class="container case-study-grid">
			<article class="case-study-card"><h2><?php esc_html_e( 'Operations dashboard for a multi-location service business', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'Challenge: managing branch-level status and profitability without dependable daily reporting. Solution: a centralized operations dashboard with scheduling, status tracking, and finance-ready summaries. Result: faster decisions, clearer staffing visibility, and less spreadsheet cleanup.', '009_nolan_young_theme_testing' ); ?></p></article>
			<article class="case-study-card"><h2><?php esc_html_e( 'Client portal for a professional services firm', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'Challenge: scattered client communication and slow approval cycles. Solution: a secure portal for documents, timelines, approvals, and messaging. Result: stronger client visibility and less manual follow-up.', '009_nolan_young_theme_testing' ); ?></p></article>
			<article class="case-study-card"><h2><?php esc_html_e( 'API integration layer connecting CRM, billing, and scheduling', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'Challenge: duplicate records and conflicting statuses across systems. Solution: a normalized middleware workflow with validation and exception handling. Result: cleaner reporting and more reliable downstream automation.', '009_nolan_young_theme_testing' ); ?></p></article>
			<article class="case-study-card"><h2><?php esc_html_e( 'Workflow automation for quote intake and project handoff', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'Challenge: slow response time between lead intake and delivery kickoff. Solution: automation around routing, task creation, approvals, and handoff tracking. Result: faster turnaround and fewer dropped details.', '009_nolan_young_theme_testing' ); ?></p></article>
		</div>
	</section>
</main>
<?php get_footer(); ?>
