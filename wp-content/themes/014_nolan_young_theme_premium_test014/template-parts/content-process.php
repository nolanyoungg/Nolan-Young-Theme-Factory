<section class="section process section-dark">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Process', 'nolan-young-template' ); ?></p><h2><?php esc_html_e( 'A complete path from inquiry to support.', 'nolan-young-template' ); ?></h2></div>
		<ol class="process-list">
			<?php foreach ( array( __( 'Inquiry', 'nolan-young-template' ), __( 'Discovery', 'nolan-young-template' ), __( 'Planning', 'nolan-young-template' ), __( 'Design', 'nolan-young-template' ), __( 'Build', 'nolan-young-template' ), __( 'Launch', 'nolan-young-template' ), __( 'Support', 'nolan-young-template' ) ) as $step ) : ?>
				<li><span><?php echo esc_html( $step ); ?></span><p><?php echo esc_html( sprintf( __( '%s work is documented with clear decisions, next actions, and review points.', 'nolan-young-template' ), $step ) ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>
