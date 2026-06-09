<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$testimonials = nolan_get_fallback_items( 'testimonials' );
?>
<div class="container">
	<?php nolan_section_header( __( 'Testimonials', 'nolan-showcase-theme-06' ), __( 'Clients value the combination of clarity, reliability, and polished delivery.', 'nolan-showcase-theme-06' ) ); ?>
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


