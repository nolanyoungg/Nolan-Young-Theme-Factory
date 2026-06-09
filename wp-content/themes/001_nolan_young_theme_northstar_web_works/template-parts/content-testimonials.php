<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$testimonials = nolan_get_fallback_items( 'testimonials' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Testimonials', '001_nolan_young_theme_northstar_web_works' ), __( 'Clients value the combination of clarity, reliability, and polished delivery.', '001_nolan_young_theme_northstar_web_works' ) ); ?>
	<div class="card-grid card-grid--testimonials">
		<?php foreach ( $testimonials as $testimonial ) : ?>
			<blockquote class="testimonial-card">
				<p><?php echo esc_html( $testimonial['quote'] ); ?></p>
				<footer>
					<strong><?php echo esc_html( $testimonial['name'] ); ?></strong>
					<span><?php echo esc_html( $testimonial['role'] ); ?></span>
				</footer>
			</blockquote>
		<?php endforeach; ?>
	</div>
</div>



