<?php
/**
 * Posts index template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main nytt01-container nytt01-content-area">
	<header class="nytt01-page-header">
		<h1><?php single_post_title(); ?></h1>
		<?php if ( get_the_archive_description() ) : ?>
			<div class="nytt01-archive-description"><?php echo wp_kses_post( get_the_archive_description() ); ?></div>
		<?php endif; ?>
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
