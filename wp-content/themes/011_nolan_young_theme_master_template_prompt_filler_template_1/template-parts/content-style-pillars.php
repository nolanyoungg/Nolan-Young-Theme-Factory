<?php $pillars = array( __( 'Content clarity', 'nolan-young-template' ), __( 'Accessible interaction', 'nolan-young-template' ), __( 'Maintainable WordPress', 'nolan-young-template' ) ); ?>
<section class="section pillars" aria-labelledby="pillars-title">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Experience pillars', 'nolan-young-template' ); ?></p><h2 id="pillars-title"><?php esc_html_e( 'A polished site system without fragile one-off decisions.', 'nolan-young-template' ); ?></h2></div>
		<div class="card-grid card-grid--three"><?php foreach ( $pillars as $pillar ) : ?><article class="info-card"><h3><?php echo esc_html( $pillar ); ?></h3><p><?php esc_html_e( 'Reusable patterns, readable typography, clear state changes, and restrained motion keep the site useful for visitors and manageable for editors.', 'nolan-young-template' ); ?></p></article><?php endforeach; ?></div>
	</div>
</section>
