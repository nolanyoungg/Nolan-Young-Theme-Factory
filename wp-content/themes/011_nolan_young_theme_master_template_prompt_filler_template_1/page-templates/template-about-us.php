<?php
/**
 * Template Name: About Us
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="section hero hero--page" aria-labelledby="about-title">
		<div class="container hero__grid">
			<div class="hero__content">
				<p class="eyebrow"><?php esc_html_e( 'About Northstar Websites', 'nolan-young-template' ); ?></p>
				<h1 id="about-title"><?php esc_html_e( 'A website partner focused on clarity, not noise.', 'nolan-young-template' ); ?></h1>
				<p><?php esc_html_e( 'Northstar Websites helps service businesses present their work clearly, route visitors toward the next step, and keep the content system easy to maintain after launch.', 'nolan-young-template' ); ?></p>
			</div>
			<div class="hero__visual"><?php nolan_young_template_card_image( 'assets/images/hero/northstar-hero.svg', __( 'Northstar Websites planning board illustration', 'nolan-young-template' ) ); ?></div>
		</div>
	</section>
	<?php get_template_part( 'template-parts/content', 'brand-statement' ); ?>
	<section class="section" aria-labelledby="approach-title">
		<div class="container">
			<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Approach', 'nolan-young-template' ); ?></p><h2 id="approach-title"><?php esc_html_e( 'Structure first, then the visual system.', 'nolan-young-template' ); ?></h2></div>
			<div class="card-grid card-grid--three">
				<article class="info-card"><h3><?php esc_html_e( 'Discover', 'nolan-young-template' ); ?></h3><p><?php esc_html_e( 'Start with business goals, service priorities, content gaps, and the decisions visitors need to make.', 'nolan-young-template' ); ?></p></article>
				<article class="info-card"><h3><?php esc_html_e( 'Design', 'nolan-young-template' ); ?></h3><p><?php esc_html_e( 'Shape a reusable visual system that keeps navigation, sections, and calls to action consistent.', 'nolan-young-template' ); ?></p></article>
				<article class="info-card"><h3><?php esc_html_e( 'Launch', 'nolan-young-template' ); ?></h3><p><?php esc_html_e( 'Ship a WordPress site with maintainable templates, local assets, and a handoff that makes updates easier.', 'nolan-young-template' ); ?></p></article>
			</div>
		</div>
	</section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
	<?php nolan_young_template_render_faqs( __( 'Questions about working together.', 'nolan-young-template' ) ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php
get_footer();
