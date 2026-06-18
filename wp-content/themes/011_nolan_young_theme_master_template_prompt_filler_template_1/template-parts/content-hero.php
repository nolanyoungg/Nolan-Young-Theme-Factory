<?php
/**
 * Hero section.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="hero section" aria-labelledby="hero-title">
	<div class="container hero__grid">
		<div class="hero__content">
			<p class="eyebrow"><?php esc_html_e( 'Northstar Websites', 'nolan-young-template' ); ?></p>
			<h1 id="hero-title"><?php esc_html_e( 'Modern WordPress websites for service businesses that need clarity.', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'Northstar Websites plans, designs, builds, and supports polished WordPress sites with clear services, purposeful content, accessible interactions, and practical conversion paths.', 'nolan-young-template' ); ?></p>
			<div class="hero__actions"><a class="btn btn-primary" href="<?php echo nolan_young_template_page_url( 'contact/' ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a><a class="btn btn-secondary" href="<?php echo nolan_young_template_page_url( 'work/' ); ?>"><?php esc_html_e( 'View Work', 'nolan-young-template' ); ?></a></div>
			<ul class="hero__summary" aria-label="<?php esc_attr_e( 'Service summary', 'nolan-young-template' ); ?>"><li><?php esc_html_e( 'Strategy', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Design', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Development', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Support', 'nolan-young-template' ); ?></li></ul>
		</div>
		<div class="hero__visual"><?php nolan_young_template_card_image( 'assets/images/hero/northstar-hero.svg', __( 'Layered website planning board for Northstar Websites', 'nolan-young-template' ) ); ?></div>
	</div>
</section>
