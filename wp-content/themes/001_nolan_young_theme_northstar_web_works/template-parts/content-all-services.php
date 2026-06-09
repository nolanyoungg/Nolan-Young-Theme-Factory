<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$services = nolan_get_fallback_items( 'services' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Services', '001_nolan_young_theme_northstar_web_works' ), __( 'Flexible offerings for launches, maintenance, and long-term growth.', '001_nolan_young_theme_northstar_web_works' ), __( 'Packages are designed to be clear, collaborative, and useful whether you need a clean build, a redesign, or steady support after launch.', '001_nolan_young_theme_northstar_web_works' ) ); ?>
	<div class="card-grid card-grid--services">
		<?php foreach ( $services as $service ) : ?>
			<article class="service-card">
				<p class="kicker"><?php echo esc_html( $service['price'] ); ?></p>
				<h3><?php echo esc_html( $service['title'] ); ?></h3>
				<p><?php echo esc_html( $service['description'] ); ?></p>
			</article>
		<?php endforeach; ?>
	</div>
</div>



