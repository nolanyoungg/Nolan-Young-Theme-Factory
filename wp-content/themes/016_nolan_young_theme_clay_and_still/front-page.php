<?php
/** Six linked chapters in the Clay & Still studio story. */
get_header();
?>
<main id="primary">
	<?php get_template_part( 'template-parts/content', 'hero' ); ?>
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>

