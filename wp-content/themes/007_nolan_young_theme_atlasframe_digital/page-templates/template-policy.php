<?php
/**
 * Template Name: Policy
 * Template Post Type: page
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-policy">
	<section class="section page-hero"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Policy', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h1><?php the_title(); ?></h1><p><?php esc_html_e( 'This page displays policy content managed in WordPress.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></div></section>
	<?php get_template_part( 'template-parts/content', 'policy' ); ?>
</main>
<?php get_footer(); ?>
