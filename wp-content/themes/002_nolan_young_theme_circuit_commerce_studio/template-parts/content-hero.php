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
			<p class="eyebrow"><?php esc_html_e( 'Circuit Commerce Studio', 'nolan-young-theme-circuit-commerce-studio' ); ?></p>
			<h1><?php esc_html_e( 'Modern WordPress websites built around business clarity.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h1>
			<p><?php esc_html_e( 'Circuit Commerce Studio designs, builds, and supports service-business websites with clear navigation, useful content systems, accessible interactions, and practical launch workflows.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-theme-circuit-commerce-studio' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'See Work', 'nolan-young-theme-circuit-commerce-studio' ); ?></a></div>
			<ul class="trust-row"><li><?php esc_html_e( 'Strategy', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Design', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Development', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Support', 'nolan-young-theme-circuit-commerce-studio' ); ?></li></ul>
		</div>
		<div class="hero__visual"><?php nolan_young_template_render_image( 'assets/images/hero/northstar-hero.svg', __( 'Layered website planning interface', 'nolan-young-theme-circuit-commerce-studio' ) ); ?></div>
	</div>
</section>
