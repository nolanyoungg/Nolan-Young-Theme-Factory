<?php
/**
 * Archive template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main">
	<section class="nytt01-section">
		<div class="nytt01-container">
			<?php if ( have_posts() ) : ?>
				<header class="nytt01-section-header nytt01-section-header--stacked">
					<div>
						<p class="nytt01-eyebrow"><?php esc_html_e( 'Archive', 'nolan-young-theme-template-01' ); ?></p>
						<h1><?php the_archive_title(); ?></h1>
						<?php the_archive_description( '<div class="nytt01-section-summary">', '</div>' ); ?>
					</div>
				</header>
				<div class="nytt01-card-grid">
					<?php while ( have_posts() ) : the_post(); ?>
						<?php get_template_part( 'template-parts/content/content', get_post_type() === 'post' ? 'post' : 'search' ); ?>
					<?php endwhile; ?>
				</div>
				<?php nytt01_posts_pagination(); ?>
			<?php else : ?>
				<?php get_template_part( 'template-parts/content/content', 'none' ); ?>
			<?php endif; ?>
		</div>
	</section>
</main>
<?php get_footer();
