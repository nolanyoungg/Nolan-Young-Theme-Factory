<?php
/**
 * Privacy-policy page template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main nytt01-container nytt01-content-area nytt01-policy-layout">
	<?php
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/content/content', 'policy' );
	endwhile;
	?>
</main>
<?php
get_footer();
