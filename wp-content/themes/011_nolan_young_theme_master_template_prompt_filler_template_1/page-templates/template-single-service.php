<?php
/**
 * Template Name: Single Service
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="section hero hero--page" aria-labelledby="service-title">
		<div class="container hero__grid">
			<div class="hero__content">
				<p class="eyebrow"><?php esc_html_e( 'Service detail', 'nolan-young-template' ); ?></p>
				<h1 id="service-title"><?php the_title(); ?></h1>
				<p><?php esc_html_e( 'This template supports focused service pages with useful context, strong calls to action, and a form that carries the service name into the inquiry flow.', 'nolan-young-template' ); ?></p>
			</div>
			<div class="hero__visual"><?php nolan_young_template_card_image( 'assets/images/portfolio/service-development.svg', __( 'Service detail illustration', 'nolan-young-template' ) ); ?></div>
		</div>
	</section>
	<section class="section">
		<div class="container content-grid">
			<article class="content-card"><?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?></article>
			<div class="content-card">
				<h2><?php esc_html_e( 'Start the conversation', 'nolan-young-template' ); ?></h2>
				<?php echo nolan_young_template_render_contact_form( 'service', get_the_title() ); ?>
			</div>
		</div>
	</section>
	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
	<?php nolan_young_template_render_faqs( __( 'Questions about this service.', 'nolan-young-template' ) ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php
get_footer();
