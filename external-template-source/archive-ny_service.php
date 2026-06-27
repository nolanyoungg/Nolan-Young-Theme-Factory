<?php
/**
 * Service archive template for the Nolan Young Core plugin.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main nytt01-container nytt01-content-area">
	<header class="nytt01-page-header">
		<h1><?php post_type_archive_title(); ?></h1>
		<p><?php esc_html_e( 'Explore the services available through this site.', 'nolan-young-theme-template-01' ); ?></p>
	</header>
	<?php if ( have_posts() ) : ?>
		<div class="nytt01-card-grid">
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
