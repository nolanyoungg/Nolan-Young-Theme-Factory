<?php
/**
 * Template Name: Policy
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-policy">
	<section class="section page-hero"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Policy', 'nolan-young-theme-circuit-commerce-studio' ); ?></p><h1><?php the_title(); ?></h1><p><?php esc_html_e( 'This page displays policy content managed in WordPress. Review and publish legal text with qualified guidance before relying on it.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p></div></section>
	<?php get_template_part( 'template-parts/content', 'policy' ); ?>
</main>
<?php get_footer(); ?>
