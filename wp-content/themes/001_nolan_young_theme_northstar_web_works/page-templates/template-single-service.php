<?php
/**
 * Template Name: Single Service
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
</section>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</section>
<?php
get_footer();

