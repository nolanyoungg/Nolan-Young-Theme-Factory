<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section id="home" class="hero-section">
	<?php get_template_part( 'template-parts/content', 'hero' ); ?>
</section>
<section id="work" class="section section--featured-work">
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
</section>
<section id="services" class="section section--services">
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
</section>
<section class="section section--process">
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
</section>
<section class="section section--pillars">
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
</section>
<section class="section section--testimonials">
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
</section>
<section class="section section--blog-preview">
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
</section>
<section id="contact" class="section section--cta">
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</section>
<?php
get_footer();
