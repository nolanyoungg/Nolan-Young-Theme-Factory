<?php
/** A six-part editorial introduction to Clay & Still. */
get_header();
?>
<main id="primary" class="site-main">
	<?php get_template_part( 'template-parts/content', 'hero' ); ?>
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>
