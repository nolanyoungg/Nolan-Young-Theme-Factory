<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$pillars = nolan_get_fallback_items( 'pillars' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Working principles', 'nolan-showcase-theme-06' ), __( 'The practical rules that keep the product voice consistent.', 'nolan-showcase-theme-06' ) ); ?>
	<div class="pillars-grid">
		<?php foreach ( $pillars as $pillar ) : ?>
			<article class="pillar-card">
				<h3><?php echo esc_html( $pillar['title'] ); ?></h3>
				<p><?php echo esc_html( $pillar['description'] ); ?></p>
			</article>
		<?php endforeach; ?>
	</div>
</div>


