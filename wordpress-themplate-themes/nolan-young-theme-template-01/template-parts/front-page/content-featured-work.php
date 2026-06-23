<?php
/**
 * Featured work section.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_work_query = new WP_Query(
	array(
		'post_type'           => 'post',
		'posts_per_page'      => 3,
		'ignore_sticky_posts' => true,
	)
);
?>
<section class="nytt01-section">
	<div class="nytt01-container">
		<header class="nytt01-section-header">
			<div>
				<p class="nytt01-eyebrow"><?php esc_html_e( 'Selected work', 'nolan-young-theme-template-01' ); ?></p>
				<h2><?php esc_html_e( 'Recent ideas and outcomes', 'nolan-young-theme-template-01' ); ?></h2>
			</div>
			<a class="nytt01-text-link" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'View all', 'nolan-young-theme-template-01' ); ?><span aria-hidden="true"> →</span></a>
		</header>
		<?php if ( $nytt01_work_query->have_posts() ) : ?>
			<div class="nytt01-card-grid">
				<?php
				while ( $nytt01_work_query->have_posts() ) :
					$nytt01_work_query->the_post();
					get_template_part( 'template-parts/content/content', 'search' );
				endwhile;
				?>
			</div>
		<?php else : ?>
			<p><?php esc_html_e( 'Publish posts to populate this section.', 'nolan-young-theme-template-01' ); ?></p>
		<?php endif; ?>
		<?php wp_reset_postdata(); ?>
	</div>
</section>
