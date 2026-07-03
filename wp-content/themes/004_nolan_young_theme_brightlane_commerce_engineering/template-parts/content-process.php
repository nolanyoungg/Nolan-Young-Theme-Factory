<section class="section process section-dark">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Process', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h2><?php esc_html_e( 'A complete path from inquiry to support.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2></div>
		<ol class="process-list">
			<?php foreach ( array( __( 'Inquiry', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Discovery', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Planning', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Design', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Build', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Launch', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Support', '004-nolan-young-theme-brightlane-commerce-engineering' ) ) as $step ) : ?>
				<li><span><?php echo esc_html( $step ); ?></span><p><?php echo esc_html( sprintf( __( '%s work is documented with clear decisions, next actions, and review points.', '004-nolan-young-theme-brightlane-commerce-engineering' ), $step ) ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>
