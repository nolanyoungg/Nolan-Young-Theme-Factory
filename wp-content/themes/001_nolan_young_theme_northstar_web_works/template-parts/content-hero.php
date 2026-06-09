<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$brand = nolan_get_studio_brand();
?>
<div class="container hero-grid">
	<div class="hero-copy">
		<?php nolan_inline_kicker( __( 'Northstar Web Works', '001_nolan_young_theme_northstar_web_works' ) ); ?>
		<h1><?php echo esc_html( $brand['title'] ); ?></h1>
		<p class="hero-lede"><?php echo esc_html( $brand['lede'] ); ?></p>
		<div class="button-row">
			<?php nolan_button( $brand['primary_label'], $brand['primary_url'], 'primary' ); ?>
			<?php nolan_button( $brand['secondary_label'], $brand['secondary_url'], 'ghost' ); ?>
		</div>
		<div class="hero-metrics" aria-label="<?php esc_attr_e( 'Agency highlights', '001_nolan_young_theme_northstar_web_works' ); ?>">
			<div><strong>14</strong><span><?php esc_html_e( 'years of design, build, and support experience', '001_nolan_young_theme_northstar_web_works' ); ?></span></div>
			<div><strong>180+</strong><span><?php esc_html_e( 'launches, rebuilds, and maintenance fixes delivered', '001_nolan_young_theme_northstar_web_works' ); ?></span></div>
			<div><strong>32</strong><span><?php esc_html_e( 'client-ready systems shipped with local assets', '001_nolan_young_theme_northstar_web_works' ); ?></span></div>
		</div>
	</div>
	<div class="hero-visual" aria-hidden="true">
		<img src="<?php echo esc_url( nolan_asset_uri( 'assets/images/hero/hero-editorial.svg' ) ); ?>" alt="" loading="eager">
	</div>
</div>


