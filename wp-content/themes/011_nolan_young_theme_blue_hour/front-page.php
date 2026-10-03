<?php get_header(); ?>
<main id="primary">
	<?php
	get_template_part( 'template-parts/content', 'hero' );
	get_template_part( 'template-parts/content', 'featured-work' );
	get_template_part( 'template-parts/content', 'brand-statement' );
	get_template_part( 'template-parts/content', 'process' );
	get_template_part( 'template-parts/content', 'cta-banner' );
	?>
</main>
<?php get_footer(); ?>
