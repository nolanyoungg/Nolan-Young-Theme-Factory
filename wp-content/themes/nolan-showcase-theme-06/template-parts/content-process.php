<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$steps = nolan_get_fallback_items( 'process' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Process', 'nolan-showcase-theme-06' ), __( 'A calm workflow that keeps the build moving with intention.', 'nolan-showcase-theme-06' ) ); ?>
	<div class="process-steps">
		<?php foreach ( $steps as $step ) : ?>
			<div class="process-step">
				<h3><?php echo esc_html( $step['title'] ); ?></h3>
				<p><?php echo esc_html( $step['description'] ); ?></p>
			</div>
		<?php endforeach; ?>
	</div>
</div>


