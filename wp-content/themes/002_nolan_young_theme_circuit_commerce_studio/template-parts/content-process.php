<section class="section process section-dark">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Process', 'nolan-young-theme-circuit-commerce-studio' ); ?></p><h2><?php esc_html_e( 'A complete path from inquiry to support.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2></div>
		<ol class="process-list">
			<?php foreach ( array( __( 'Inquiry', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Discovery', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Planning', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Design', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Build', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Launch', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Support', 'nolan-young-theme-circuit-commerce-studio' ) ) as $step ) : ?>
				<li><span><?php echo esc_html( $step ); ?></span><p><?php echo esc_html( sprintf( __( '%s work is documented with clear decisions, next actions, and review points.', 'nolan-young-theme-circuit-commerce-studio' ), $step ) ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>
