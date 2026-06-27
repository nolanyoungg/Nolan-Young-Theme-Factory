<?php
/**
 * Single Service template for the Nolan Young Core plugin.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main nytt01-container nytt01-content-area">
	<?php
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/content/content', 'single' );
	endwhile;
	?>
</main>
<?php
get_footer();
