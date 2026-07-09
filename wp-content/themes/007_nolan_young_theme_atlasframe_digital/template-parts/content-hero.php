<?php
/**
 * Reusable homepage hero.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="hero">
	<div class="container hero__grid">
		<div class="hero__copy">
			<p class="eyebrow"><?php esc_html_e( 'Atlasframe Digital', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
			<h1><?php esc_html_e( 'WordPress systems, designed for momentum.', '007-nolan-young-theme-atlasframe-digital' ); ?></h1>
			<p><?php esc_html_e( 'Atlasframe Digital plans, designs, and builds maintainable WordPress sites for teams that need clearer content, better structure, and a site they can keep improving.', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', '007-nolan-young-theme-atlasframe-digital' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Explore Work', '007-nolan-young-theme-atlasframe-digital' ); ?></a></div>
			<ul class="trust-row"><li><?php esc_html_e( 'Custom theme systems', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'WooCommerce-ready', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Care after launch', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Accessible interactions', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul>
		</div>
		<div class="hero__visual">
			<?php nolan_young_template_render_image( 'assets/images/hero/agency-workspace.jpg', __( 'Atlasframe Digital strategy workspace with laptops and planning material', '007-nolan-young-theme-atlasframe-digital' ) ); ?>
		</div>
	</div>
</section>
