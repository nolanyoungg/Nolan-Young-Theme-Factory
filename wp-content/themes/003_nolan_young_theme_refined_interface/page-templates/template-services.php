<?php
/**
 * Template Name: Services
 * Template Post Type: page
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="primary" class="nytt01-site-main nytt01-page-services">
	<?php
	while ( have_posts() ) {
		the_post();
		get_template_part( 'template-parts/content/content', 'page' );
	}
	get_template_part( 'template-parts/front-page/content', 'all-services' );
	get_template_part( 'template-parts/front-page/content', 'process' );
	get_template_part( 'template-parts/global/content', 'cta-banner' );
	?>
</main>
<?php
get_footer();
