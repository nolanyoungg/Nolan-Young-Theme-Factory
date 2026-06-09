<?php
/**
 * Template Name: Work
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
</section>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
</section>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</section>
<?php
get_footer();

