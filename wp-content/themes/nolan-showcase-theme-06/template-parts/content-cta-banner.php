<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="container">
	<div class="cta-banner">
		<div class="cta-banner__copy">
			<?php nolan_inline_kicker( __( 'Ready when you are', 'nolan-showcase-theme-06' ) ); ?>
			<h2><?php esc_html_e( 'Bring the next website, redesign, or maintenance plan into focus.', 'nolan-showcase-theme-06' ); ?></h2>
			<p><?php esc_html_e( 'Tell us the goals, the timeline, and the pages you need. We will reply with a clear plan and a thoughtful recommendation for the right build format.', 'nolan-showcase-theme-06' ); ?></p>
		</div>
		<div class="cta-banner__actions">
			<?php nolan_button( __( 'Start an inquiry', 'nolan-showcase-theme-06' ), '#contact', 'primary' ); ?>
			<?php nolan_button( __( 'View policies', 'nolan-showcase-theme-06' ), home_url( '/privacy-policy/' ), 'ghost' ); ?>
		</div>
	</div>
</div>


