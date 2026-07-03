<?php
/**
 * Template Name: Single Service
 *
 * @package Nolan_Young_Template
 */
get_header();
$title = get_the_title() ? get_the_title() : __( 'Website Service', '004-nolan-young-theme-brightlane-commerce-engineering' );
?>
<main id="primary" class="site-main page-service-detail">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Service detail', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h1><?php echo esc_html( $title ); ?></h1><p><?php esc_html_e( 'A reusable service-detail layout for explaining who the service is for, what is included, how the work runs, and how to ask a focused question.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/hero/developer-screens.jpg', __( 'Brightlane Commerce Engineering developer screens and code workspace', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'media-frame' ); ?></div></section>
	<section class="section"><div class="container card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Best for', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><p><?php esc_html_e( 'Teams that need a clearer website path, stronger service presentation, or a maintainable WordPress implementation.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Deliverables', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><p><?php esc_html_e( 'Scope notes, page structure, reusable sections, launch checks, and documentation appropriate to the project.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Support', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><p><?php esc_html_e( 'Post-launch review and improvement guidance can be included when the project needs continuity.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></article></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section"><div class="container narrow"><h2><?php esc_html_e( 'Ask about this service', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><?php nolan_young_template_render_contact_form( 'single-service', $title ); ?></div></section>
</main>
<?php get_footer(); ?>
