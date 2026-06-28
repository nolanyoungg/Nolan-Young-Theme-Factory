<?php
/**
 * Search-results template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main nytt01-container nytt01-content-area">
	<header class="nytt01-page-header">
		<h1>
			<?php
			printf(
				/* translators: %s: Search query. */
				esc_html__( 'Search results for “%s”', 'nolan-young-theme-template-01' ),
				esc_html( get_search_query() )
			);
			?>
		</h1>
	</header>
	<?php if ( have_posts() ) : ?>
		<div class="nytt01-post-grid">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content/content', 'search' );
			endwhile;
			?>
		</div>
		<?php nytt01_posts_pagination(); ?>
	<?php else : ?>
		<?php get_template_part( 'template-parts/content/content', 'none' ); ?>
	<?php endif; ?>
</main>
<?php
get_footer();
