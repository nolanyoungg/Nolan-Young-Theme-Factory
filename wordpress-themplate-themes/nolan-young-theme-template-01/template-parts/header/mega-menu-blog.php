<?php
/**
 * Latest-posts mega menu.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$panel_id     = isset( $args['panel_id'] ) ? sanitize_html_class( $args['panel_id'] ) : '';
$trigger_id   = isset( $args['trigger_id'] ) ? sanitize_html_class( $args['trigger_id'] ) : '';
$overview_url = isset( $args['overview_url'] ) ? (string) $args['overview_url'] : get_post_type_archive_link( 'post' );
$latest_posts = new WP_Query(
	array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => 4,
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true,
	)
);
$post_count   = (int) $latest_posts->post_count;

if ( empty( $panel_id ) || empty( $trigger_id ) ) {
	return;
}
?>
<div
	id="<?php echo esc_attr( $panel_id ); ?>"
	class="nytt01-mega-menu nytt01-mega-menu--blog"
	aria-labelledby="<?php echo esc_attr( $trigger_id ); ?>"
	data-nytt01-mega-panel
	data-nytt01-mega-type="blog"
	hidden
>
	<div class="nytt01-mega-menu__blog-header">
		<div>
			<p class="nytt01-mega-menu__eyebrow"><?php esc_html_e( 'From the blog', 'nolan-young-theme-template-01' ); ?></p>
			<h2><?php esc_html_e( 'Latest insights', 'nolan-young-theme-template-01' ); ?></h2>
		</div>
		<a href="<?php echo esc_url( $overview_url ); ?>"><?php esc_html_e( 'View all posts', 'nolan-young-theme-template-01' ); ?></a>
	</div>

	<?php if ( $latest_posts->have_posts() ) : ?>
		<div class="nytt01-mega-menu__blog-grid nytt01-mega-menu__blog-grid--count-<?php echo esc_attr( (string) $post_count ); ?>">
			<?php while ( $latest_posts->have_posts() ) : ?>
				<?php
				$latest_posts->the_post();
				$thumbnail_url = get_the_post_thumbnail_url( get_the_ID(), 'medium_large' );
				if ( ! $thumbnail_url ) {
					$thumbnail_url = nytt01_get_navigation_image_uri( 'blog-placeholder.svg' );
				}
				?>
				<article <?php post_class( 'nytt01-mega-blog-card' ); ?>>
					<a class="nytt01-mega-blog-card__media" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
						<img src="<?php echo esc_url( $thumbnail_url ); ?>" alt="" width="640" height="400" loading="lazy" decoding="async">
					</a>
					<div class="nytt01-mega-blog-card__content">
						<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
						<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 18 ) ); ?></p>
						<a class="nytt01-text-link" href="<?php the_permalink(); ?>">
							<?php esc_html_e( 'Read more', 'nolan-young-theme-template-01' ); ?>
							<span class="screen-reader-text">: <?php the_title(); ?></span>
						</a>
					</div>
				</article>
			<?php endwhile; ?>
		</div>
	<?php else : ?>
		<div class="nytt01-mega-menu__empty">
			<p><?php esc_html_e( 'No blog posts are published yet.', 'nolan-young-theme-template-01' ); ?></p>
			<a class="nytt01-button nytt01-button--secondary" href="<?php echo esc_url( $overview_url ); ?>"><?php esc_html_e( 'Visit the blog', 'nolan-young-theme-template-01' ); ?></a>
		</div>
	<?php endif; ?>
</div>
<?php wp_reset_postdata(); ?>
