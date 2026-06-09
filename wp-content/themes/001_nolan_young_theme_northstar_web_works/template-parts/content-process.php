<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$steps = nolan_get_fallback_items( 'process' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Process', '001_nolan_young_theme_northstar_web_works' ), __( 'A calm workflow that keeps the build moving with intention.', '001_nolan_young_theme_northstar_web_works' ) ); ?>
	<div class="process-steps">
		<?php foreach ( $steps as $step ) : ?>
			<div class="process-step">
				<h3><?php echo esc_html( $step['title'] ); ?></h3>
				<p><?php echo esc_html( $step['description'] ); ?></p>
			</div>
		<?php endforeach; ?>
	</div>
</div>



