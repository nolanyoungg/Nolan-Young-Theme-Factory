<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$posts = new WP_Query(
	array(
		'post_type'      => 'post',
		'posts_per_page' => 3,
	)
);
$fallback = nolan_get_fallback_items( 'journal' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Journal', '001_nolan_young_theme_northstar_web_works' ), __( 'Ideas, release notes, and practical planning for clients.', '001_nolan_young_theme_northstar_web_works' ), __( 'When no posts are published yet, the section still reads like a finished editorial preview rather than an empty state.', '001_nolan_young_theme_northstar_web_works' ) ); ?>
	<div class="card-grid card-grid--blog">
		<?php if ( $posts->have_posts() ) : ?>
			<?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
				<article class="blog-card">
					<p class="kicker"><?php echo esc_html( get_the_date( 'F j, Y' ) ); ?></p>
					<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
					<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 22 ) ); ?></p>
				</article>
			<?php endwhile; wp_reset_postdata(); ?>
		<?php else : ?>
			<?php foreach ( $fallback as $entry ) : ?>
				<article class="blog-card">
					<p class="kicker"><?php echo esc_html( $entry['date'] . ' · ' . $entry['term'] ); ?></p>
					<h3><?php echo esc_html( $entry['title'] ); ?></h3>
					<p><?php esc_html_e( 'Read the Northstar journal for guidance on planning, content structure, and launch preparation.', '001_nolan_young_theme_northstar_web_works' ); ?></p>
				</article>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
</div>



