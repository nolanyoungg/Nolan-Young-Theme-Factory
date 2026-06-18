<?php $steps = array( __( 'Inquire', 'nolan-young-template' ), __( 'Discover', 'nolan-young-template' ), __( 'Plan', 'nolan-young-template' ), __( 'Design', 'nolan-young-template' ), __( 'Build', 'nolan-young-template' ), __( 'Support', 'nolan-young-template' ) ); ?>
<section class="section process" aria-labelledby="process-title">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Process', 'nolan-young-template' ); ?></p><h2 id="process-title"><?php esc_html_e( 'A steady path from first inquiry to supported launch.', 'nolan-young-template' ); ?></h2></div>
		<ol class="process-list">
			<?php foreach ( $steps as $index => $step ) : ?><li><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><h3><?php echo esc_html( $step ); ?></h3><p><?php echo esc_html( array( __( 'Share the business context and what needs to improve.', 'nolan-young-template' ), __( 'Clarify audiences, content, site structure, and constraints.', 'nolan-young-template' ), __( 'Turn priorities into pages, sections, and conversion paths.', 'nolan-young-template' ), __( 'Create responsive layouts with accessible states and clear hierarchy.', 'nolan-young-template' ), __( 'Build WordPress templates, assets, forms, and editor-ready patterns.', 'nolan-young-template' ), __( 'Review, document, refine, and support the handoff.', 'nolan-young-template' ) )[ $index ] ); ?></p></li><?php endforeach; ?>
		</ol>
	</div>
</section>
