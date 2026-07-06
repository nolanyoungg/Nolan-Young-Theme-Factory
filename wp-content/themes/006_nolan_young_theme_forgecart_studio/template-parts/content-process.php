<section class="section process section-dark">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Process', 'nolan-young-template' ); ?></p><h2><?php esc_html_e( 'A complete path from inquiry to support.', 'nolan-young-template' ); ?></h2></div>
		<ol class="process-list">
			<?php
			$steps = array(
				__( 'Inquiry', 'nolan-young-template' )   => __( 'Capture goals, current platform, audience, catalog or content needs, and timeline pressure.', 'nolan-young-template' ),
				__( 'Discovery', 'nolan-young-template' ) => __( 'Clarify whether WordPress, Shopify, WooCommerce, or a connected setup fits the job.', 'nolan-young-template' ),
				__( 'Planning', 'nolan-young-template' )  => __( 'Map pages, products, forms, newsletter capture, analytics events, and launch responsibilities.', 'nolan-young-template' ),
				__( 'Design', 'nolan-young-template' )    => __( 'Shape page sections, product storytelling, editorial hierarchy, and conversion paths.', 'nolan-young-template' ),
				__( 'Build', 'nolan-young-template' )     => __( 'Implement maintainable templates, theme sections, content fields, and local assets.', 'nolan-young-template' ),
				__( 'Launch', 'nolan-young-template' )    => __( 'Review forms, checkout readiness, redirects, accessibility, analytics, and handoff notes.', 'nolan-young-template' ),
				__( 'Support', 'nolan-young-template' )   => __( 'Plan updates, backups, edits, seasonal campaigns, and practical improvement reviews.', 'nolan-young-template' ),
			);
			foreach ( $steps as $step => $description ) :
				?>
				<li><span><?php echo esc_html( $step ); ?></span><p><?php echo esc_html( $description ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>
