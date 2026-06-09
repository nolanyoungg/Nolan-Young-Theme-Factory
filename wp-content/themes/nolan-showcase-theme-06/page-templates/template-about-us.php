<?php
/**
 * Template Name: About Us
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'brand-statement' ); ?>
</section>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
</section>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
</section>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</section>
<?php
get_footer();

