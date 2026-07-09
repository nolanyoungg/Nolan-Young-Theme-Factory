<?php $services = nolan_young_template_services(); ?>
<section class="section services-overview">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Services', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h2><?php esc_html_e( 'WordPress services for planning, building, connecting, and caring for the site.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2></div>
		<div class="card-grid service-grid">
			<?php foreach ( $services as $service ) : ?>
				<article class="service-card"><?php nolan_young_template_render_image( $service['image'], $service['alt'] ); ?><h3><a href="<?php echo esc_url( $service['url'] ); ?>"><?php echo esc_html( $service['title'] ); ?></a></h3><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( array_slice( $service['bullets'], 0, 3 ) as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'View service', '007-nolan-young-theme-atlasframe-digital' ); ?></a></article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
