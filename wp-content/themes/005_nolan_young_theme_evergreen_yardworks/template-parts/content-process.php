<section class="section process section-dark">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Process', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'From first estimate to tidy closeout notes.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
		<ol class="process-list">
			<?php foreach ( array( 'Request estimate' => 'Share the property type, timing, services needed, and any useful photos.', 'Walk the property' => 'The crew reviews access, turf, beds, slopes, cleanup volume, and seasonal priorities.', 'Choose the plan' => 'Pick recurring route care, a one-time reset, bed refresh work, or a seasonal cleanup.', 'Scheduled visits' => 'Visits are grouped by route, weather, and property notes so service stays predictable.', 'Tidy closeout notes' => 'Edges, gates, beds, debris, and follow-up needs are checked before the visit wraps.' ) as $step => $text ) : ?>
				<li data-reveal><span><?php echo esc_html( $step ); ?></span><p><?php echo esc_html( $text ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>

