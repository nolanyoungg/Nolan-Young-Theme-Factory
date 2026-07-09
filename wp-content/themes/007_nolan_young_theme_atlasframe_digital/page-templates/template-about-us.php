<?php
/**
 * Template Name: About Us
 * Template Post Type: page
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-about">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'About Atlasframe Digital', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h1><?php esc_html_e( 'A focused WordPress systems studio for teams that need a better foundation.', '007-nolan-young-theme-atlasframe-digital' ); ?></h1><p><?php esc_html_e( 'Atlasframe Digital helps service companies and ecommerce teams diagnose site problems, plan cleaner content paths, build maintainable theme foundations, and keep improving after launch.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/portfolio/team-collaboration.jpg', __( 'Atlasframe Digital team collaboration around a digital project', '007-nolan-young-theme-atlasframe-digital' ), 'media-frame' ); ?></div></section>
	<section class="section" id="values"><div class="container"><div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Values', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h2><?php esc_html_e( 'Structure first, then polish.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2></div><div class="card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Clarity before decoration', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><p><?php esc_html_e( 'Navigation, page roles, and buyer questions are clarified before visual decisions carry the design.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Accessibility by default', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><p><?php esc_html_e( 'Keyboard states, responsive behavior, semantic landmarks, and reduced-motion support are treated as core requirements.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Documentation as delivery', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><p><?php esc_html_e( 'Theme structure, build outputs, forms, and admin workflows are documented so the site remains easier to maintain.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></article></div></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>
