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
			<p class="eyebrow"><?php esc_html_e( 'Brightlane Commerce Engineering', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
			<h1><?php esc_html_e( 'Senior WordPress and Shopify engineering for sites that need to work harder.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h1>
			<p><?php esc_html_e( 'Custom WordPress themes, Shopify storefront planning, WooCommerce migration guidance, performance repair, accessibility improvements, analytics instrumentation, and launch-support sprints for serious growth teams.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'See Work', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div>
			<ul class="trust-row"><li><?php esc_html_e( 'WordPress', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Shopify', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Integrations', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Launch support', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li></ul>
		</div>
		<div class="hero__visual"><?php nolan_young_template_render_image( 'assets/images/hero/agency-workspace.jpg', __( 'Brightlane Commerce Engineering strategy workspace with laptops and planning material', '004-nolan-young-theme-brightlane-commerce-engineering' ) ); ?></div>
	</div>
</section>
