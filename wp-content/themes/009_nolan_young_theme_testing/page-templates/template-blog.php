<?php
/**
 * Template Name: Blog / Resources
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<section class="page-hero section-shell">
		<div class="container narrow-flow">
			<p class="section-kicker"><?php esc_html_e( 'Resources', '009_nolan_young_theme_testing' ); ?></p>
			<h1><?php esc_html_e( 'Planning notes for operators investing in better software systems.', '009_nolan_young_theme_testing' ); ?></h1>
		</div>
	</section>
	<section class="section-shell">
		<div class="container card-grid">
			<article class="info-card"><h2><?php esc_html_e( 'When custom software beats another SaaS subscription', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'How to recognize when patching together more subscriptions is costing more than a focused custom system.', '009_nolan_young_theme_testing' ); ?></p></article>
			<article class="info-card"><h2><?php esc_html_e( 'How to plan an internal tool project', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'Questions to answer before the first build sprint so the team is not discovering the workflow mid-implementation.', '009_nolan_young_theme_testing' ); ?></p></article>
			<article class="info-card"><h2><?php esc_html_e( 'Integration mistakes that create long-term maintenance problems', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'A look at brittle automations, hidden dependencies, and bad ownership boundaries that make systems harder to support.', '009_nolan_young_theme_testing' ); ?></p></article>
			<article class="info-card"><h2><?php esc_html_e( 'What a technical discovery phase should include', '009_nolan_young_theme_testing' ); ?></h2><p><?php esc_html_e( 'Scope mapping, architecture choices, data flow, risk notes, implementation phases, and review checkpoints.', '009_nolan_young_theme_testing' ); ?></p></article>
		</div>
	</section>
</main>
<?php get_footer(); ?>
