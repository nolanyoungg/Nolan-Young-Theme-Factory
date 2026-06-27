<?php
/**
 * Front-page template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main">
	<?php
	get_template_part( 'template-parts/global/content', 'hero' );
	get_template_part( 'template-parts/global/content', 'brand-statement' );
	get_template_part( 'template-parts/front-page/content', 'featured-work' );
	get_template_part( 'template-parts/front-page/content', 'all-services' );
	get_template_part( 'template-parts/front-page/content', 'service-highlight' );
	get_template_part( 'template-parts/front-page/content', 'process' );
	get_template_part( 'template-parts/front-page/content', 'style-pillars' );
	get_template_part( 'template-parts/front-page/content', 'testimonials' );
	get_template_part( 'template-parts/front-page/content', 'blog-preview' );
	get_template_part( 'template-parts/global/content', 'cta-banner' );
	?>
</main>
<?php
get_footer();
