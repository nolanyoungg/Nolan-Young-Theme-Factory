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
			<p class="eyebrow"><?php esc_html_e( 'Stackforge Commerce Labs', 'nolan-young-template' ); ?></p>
			<h1><?php esc_html_e( 'Modern WordPress and Shopify systems built around business clarity.', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'Stackforge Commerce Labs designs, builds, and supports service and ecommerce websites with clear navigation, useful content systems, accessible interactions, and practical launch workflows.', 'nolan-young-template' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'See Work', 'nolan-young-template' ); ?></a></div>
			<ul class="trust-row"><li><?php esc_html_e( 'Strategy', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Design', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Development', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Support', 'nolan-young-template' ); ?></li></ul>
		</div>
		<div class="hero__visual"><?php nolan_young_template_render_image( 'assets/images/hero/automation-architecture.svg', __( 'Stackforge Commerce Labs automation architecture illustration', 'nolan-young-template' ) ); ?></div>
	</div>
</section>
