<?php
/**
 * Template Name: Single Service
 *
 * @package Nolan_Young_Template
 */
get_header();
$title = get_the_title() ? get_the_title() : __( 'Website Service', 'nolan-young-template' );
?>
<main id="primary" class="site-main page-service-detail">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Service detail', 'nolan-young-template' ); ?></p><h1><?php echo esc_html( $title ); ?></h1><p><?php esc_html_e( 'A reusable service-detail layout for explaining who the service is for, what is included, how the work runs, and how to ask a focused question.', 'nolan-young-template' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/portfolio/service-development.svg', $title, 'media-frame' ); ?></div></section>
	<section class="section"><div class="container card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Best for', 'nolan-young-template' ); ?></h2><p><?php esc_html_e( 'Teams that need a clearer website path, stronger service presentation, or a maintainable WordPress implementation.', 'nolan-young-template' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Deliverables', 'nolan-young-template' ); ?></h2><p><?php esc_html_e( 'Scope notes, page structure, reusable sections, launch checks, and documentation appropriate to the project.', 'nolan-young-template' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Support', 'nolan-young-template' ); ?></h2><p><?php esc_html_e( 'Post-launch review and improvement guidance can be included when the project needs continuity.', 'nolan-young-template' ); ?></p></article></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section"><div class="container narrow"><h2><?php esc_html_e( 'Ask about this service', 'nolan-young-template' ); ?></h2><?php nolan_young_template_render_contact_form( 'single-service', $title ); ?></div></section>
</main>
<?php get_footer(); ?>
