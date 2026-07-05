<?php $services = nolan_young_template_services(); ?>
<section class="section services-overview">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Services', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'Lawn care, bed refreshes, seasonal cleanup, and practical maintenance plans.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
		<div class="card-grid">
			<?php foreach ( $services as $service ) : ?>
				<article class="service-card" data-reveal><?php nolan_young_template_render_image( $service['image'], $service['title'] ); ?><h3><a href="<?php echo esc_url( $service['url'] ); ?>"><?php echo esc_html( $service['title'] ); ?></a></h3><p><?php echo esc_html( $service['excerpt'] ); ?></p><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'View service', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
