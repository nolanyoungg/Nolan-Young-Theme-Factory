<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="container">
	<div class="cta-banner">
		<div class="cta-banner__copy">
			<?php nolan_inline_kicker( __( 'Ready when you are', '001_nolan_young_theme_northstar_web_works' ) ); ?>
			<h2><?php esc_html_e( 'Bring the next website, redesign, or maintenance plan into focus.', '001_nolan_young_theme_northstar_web_works' ); ?></h2>
			<p><?php esc_html_e( 'Tell us the goals, the timeline, and the pages you need. We will reply with a clear plan and a thoughtful recommendation for the right build format.', '001_nolan_young_theme_northstar_web_works' ); ?></p>
		</div>
		<div class="cta-banner__actions">
			<?php nolan_button( __( 'Start an inquiry', '001_nolan_young_theme_northstar_web_works' ), '#contact', 'primary' ); ?>
			<?php nolan_button( __( 'View policies', '001_nolan_young_theme_northstar_web_works' ), home_url( '/privacy-policy/' ), 'ghost' ); ?>
		</div>
	</div>
</div>



