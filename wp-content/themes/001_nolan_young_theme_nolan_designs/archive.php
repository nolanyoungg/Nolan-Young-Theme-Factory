<?php
/**
 * Archive template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="site-main archive-page">
	<div class="site-wrap">
		<header class="page-hero page-hero--compact">
			<p class="eyebrow"><?php esc_html_e( 'Archive', 'nolan-young-theme-template-01' ); ?></p>
			<h1><?php the_archive_title(); ?></h1>
			<div class="page-hero__summary"><?php the_archive_description( '<p>', '</p>' ); ?></div>
		</header>
		<?php if ( have_posts() ) : ?>
			<div class="card-grid card-grid--posts">
				<?php while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( 'template-parts/content/content', get_post_type() === 'post' ? 'post' : 'page' ); ?>
				<?php endwhile; ?>
			</div>
			<?php the_posts_pagination(); ?>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content/content', 'none' ); ?>
		<?php endif; ?>
	</div>
</main>
<?php get_footer();
