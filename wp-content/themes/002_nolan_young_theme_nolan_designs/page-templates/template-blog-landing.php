<?php
/**
 * Template Name: Blog Landing
 * Template Post Type: page
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="primary" class="nytt01-site-main nytt01-page-blog">
	<?php
	while ( have_posts() ) {
		the_post();
		get_template_part( 'template-parts/content/content', 'page' );
	}
	get_template_part( 'template-parts/front-page/content', 'blog-preview' );
	?>
</main>
<?php
get_footer();
