<?php
/**
 * Template Name: About Us
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-about">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'About Circuit Commerce Studio', 'nolan-young-theme-circuit-commerce-studio' ); ?></p><h1><?php esc_html_e( 'A practical website partner for service businesses.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h1><p><?php esc_html_e( 'Circuit Commerce Studio helps teams turn scattered ideas, services, and content into WordPress websites that are easier to understand, maintain, and improve.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/hero/about-approach.svg', __( 'Website planning workspace', 'nolan-young-theme-circuit-commerce-studio' ), 'media-frame' ); ?></div></section>
	<section class="section" id="values"><div class="container"><div class="card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Clear before clever', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2><p><?php esc_html_e( 'Navigation, content, and forms are planned around the decisions visitors need to make.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Built to keep working', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2><p><?php esc_html_e( 'The theme favors reusable components, local assets, and documented behavior over fragile one-off sections.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Respectful collaboration', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2><p><?php esc_html_e( 'Project work is organized around focused reviews, plain-language next steps, and realistic support needs.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p></article></div></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>
