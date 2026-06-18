<?php
/**
 * Template Name: Work
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="section hero hero--page" aria-labelledby="work-title">
		<div class="container hero__grid">
			<div class="hero__content">
				<p class="eyebrow"><?php esc_html_e( 'Work', 'nolan-young-template' ); ?></p>
				<h1 id="work-title"><?php esc_html_e( 'Examples of clearer service websites and better inquiry paths.', 'nolan-young-template' ); ?></h1>
				<p><?php esc_html_e( 'This page brings together representative projects, categories, and outcome-focused cards so visitors can move from interest to action quickly.', 'nolan-young-template' ); ?></p>
			</div>
			<div class="hero__visual"><?php nolan_young_template_card_image( 'assets/images/portfolio/work-service-firm.svg', __( 'Work example illustration', 'nolan-young-template' ) ); ?></div>
		</div>
	</section>
	<?php nolan_young_template_render_work_filter( 'work-filter' ); ?>
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php
get_footer();
