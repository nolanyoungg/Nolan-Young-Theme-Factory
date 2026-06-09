<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$pillars = nolan_get_fallback_items( 'pillars' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Working principles', '001_nolan_young_theme_northstar_web_works' ), __( 'The practical rules that keep the product voice consistent.', '001_nolan_young_theme_northstar_web_works' ) ); ?>
	<div class="pillars-grid">
		<?php foreach ( $pillars as $pillar ) : ?>
			<article class="pillar-card">
				<h3><?php echo esc_html( $pillar['title'] ); ?></h3>
				<p><?php echo esc_html( $pillar['description'] ); ?></p>
			</article>
		<?php endforeach; ?>
	</div>
</div>



