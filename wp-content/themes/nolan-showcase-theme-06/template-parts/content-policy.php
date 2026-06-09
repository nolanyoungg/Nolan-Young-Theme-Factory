<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$policies = nolan_get_fallback_items( 'policies' );
?>
<article <?php post_class( 'content-article content-article--policy' ); ?>>
	<header class="entry-header">
		<p class="kicker"><?php esc_html_e( 'Studio policies', 'nolan-showcase-theme-06' ); ?></p>
		<h1 class="entry-title"><?php the_title(); ?></h1>
	</header>
	<div class="policy-grid">
		<?php foreach ( $policies as $policy ) : ?>
			<section class="policy-card">
				<h2><?php echo esc_html( $policy['title'] ); ?></h2>
				<p><?php echo esc_html( $policy['content'] ); ?></p>
			</section>
		<?php endforeach; ?>
	</div>
	<div class="entry-content">
		<?php the_content(); ?>
	</div>
</article>


