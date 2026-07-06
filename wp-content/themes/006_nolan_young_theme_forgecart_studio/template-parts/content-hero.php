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
			<p class="eyebrow"><?php esc_html_e( 'ForgeCart Studio', 'nolan-young-template' ); ?></p>
			<h1><?php esc_html_e( 'WordPress sites and Shopify stores built to sell clearly.', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'ForgeCart Studio helps service brands, creators, and growing ecommerce teams connect content, commerce, lead capture, analytics, and launch operations into one maintainable website system.', 'nolan-young-template' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'See Work', 'nolan-young-template' ); ?></a></div>
			<ul class="trust-row"><li><?php esc_html_e( 'WordPress', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Shopify', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'WooCommerce', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Site care', 'nolan-young-template' ); ?></li></ul>
		</div>
		<div class="hero__visual"><?php nolan_young_template_render_image( 'assets/images/hero/agency-workspace.jpg', __( 'ForgeCart Studio strategy workspace with laptops and planning material', 'nolan-young-template' ) ); ?></div>
	</div>
</section>
