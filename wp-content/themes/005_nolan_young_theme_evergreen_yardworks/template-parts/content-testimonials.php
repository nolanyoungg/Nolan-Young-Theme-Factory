<section class="section crew-standards">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Crew standards', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'No invented endorsements, just the standards that make visits feel finished.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
		<div class="proof-grid">
			<?php foreach ( array( 'Clean edges' => 'Walks, drives, and bed lines are treated as part of the finished look.', 'Gates latched' => 'Access notes, pets, and gates are handled carefully before the crew leaves.', 'Beds blown clear' => 'Clippings and debris are cleared from hard surfaces and bed edges.', 'Debris removed' => 'Cleanup work includes practical removal notes based on the material and service size.', 'Visit notes' => 'Follow-up needs are surfaced so recurring care stays practical.' ) as $title => $text ) : ?>
				<div data-reveal><strong><?php echo esc_html( $title ); ?></strong><p><?php echo esc_html( $text ); ?></p></div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

