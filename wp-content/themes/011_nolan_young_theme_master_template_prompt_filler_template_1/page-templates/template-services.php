<?php
/**
 * Template Name: Services
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="section hero hero--page" aria-labelledby="services-title">
		<div class="container hero__grid">
			<div class="hero__content">
				<p class="eyebrow"><?php esc_html_e( 'Services', 'nolan-young-template' ); ?></p>
				<h1 id="services-title"><?php esc_html_e( 'Six focused services for better WordPress sites.', 'nolan-young-template' ); ?></h1>
				<p><?php esc_html_e( 'Northstar Websites can plan, design, build, connect, launch, and support a website as a single engagement or through a focused set of improvements.', 'nolan-young-template' ); ?></p>
			</div>
			<div class="hero__visual"><?php nolan_young_template_card_image( 'assets/images/portfolio/service-design.svg', __( 'Service design illustration', 'nolan-young-template' ) ); ?></div>
		</div>
	</section>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php nolan_young_template_render_faqs( __( 'Service questions and planning notes.', 'nolan-young-template' ) ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php
get_footer();
