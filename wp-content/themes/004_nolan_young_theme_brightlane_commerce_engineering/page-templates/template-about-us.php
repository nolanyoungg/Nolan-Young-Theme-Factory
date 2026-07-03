<?php
/**
 * Template Name: About Us
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-about">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'About Brightlane', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h1><?php esc_html_e( 'Senior web engineering for teams balancing commerce, content, and growth.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h1><p><?php esc_html_e( 'Brightlane Commerce Engineering helps teams turn scattered platform requirements into WordPress and Shopify systems that are easier to understand, maintain, measure, and improve.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/portfolio/team-collaboration.jpg', __( 'Brightlane Commerce Engineering team collaboration around a digital project', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'media-frame' ); ?></div></section>
	<section class="section" id="values"><div class="container"><div class="card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Clear before clever', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><p><?php esc_html_e( 'Navigation, content, and forms are planned around the decisions visitors need to make.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Built to keep working', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><p><?php esc_html_e( 'The theme favors reusable components, local assets, and documented behavior over fragile one-off sections.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Respectful collaboration', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><p><?php esc_html_e( 'Project work is organized around focused reviews, plain-language next steps, and realistic support needs.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></article></div></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>
