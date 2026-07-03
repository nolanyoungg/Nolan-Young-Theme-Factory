<?php $services = nolan_young_template_services(); ?>
<section class="section services-overview">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Services', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h2><?php esc_html_e( 'Focused engineering services for WordPress, Shopify, WooCommerce, and retained improvement work.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2></div>
		<div class="card-grid">
			<?php foreach ( $services as $service ) : ?>
				<article class="service-card"><?php nolan_young_template_render_image( $service['image'], $service['title'] ); ?><h3><a href="<?php echo esc_url( $service['url'] ); ?>"><?php echo esc_html( $service['title'] ); ?></a></h3><p><?php echo esc_html( $service['excerpt'] ); ?></p><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'View service', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
