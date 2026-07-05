<?php
/**
 * Reusable hero.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="hero">
	<div class="container hero__grid">
		<div class="hero__copy">
			<p class="eyebrow"><?php esc_html_e( 'Evergreen Yardworks', '005-nolan-young-theme-evergreen-yardworks' ); ?></p>
			<h1><?php esc_html_e( 'Lawn care that makes the whole property feel handled.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h1>
			<p><?php esc_html_e( 'Reliable mowing, clean edges, bed care, seasonal cleanup, and recurring maintenance for homes, small HOAs, rentals, and light commercial properties.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Request an Estimate', '005-nolan-young-theme-evergreen-yardworks' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'View Services', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
			<ul class="trust-row"><li><?php esc_html_e( 'Photos of your property help us estimate faster.', '005-nolan-young-theme-evergreen-yardworks' ); ?></li><li><?php esc_html_e( 'Route-minded scheduling', '005-nolan-young-theme-evergreen-yardworks' ); ?></li><li><?php esc_html_e( 'Clean closeout notes', '005-nolan-young-theme-evergreen-yardworks' ); ?></li></ul>
		</div>
		<div class="hero__visual">
			<?php nolan_young_template_render_image( 'assets/images/hero/curb-appeal-lawn.jpg', __( 'Evergreen Yardworks freshly maintained residential lawn and planting beds', '005-nolan-young-theme-evergreen-yardworks' ) ); ?>
		</div>
	</div>
</section>

