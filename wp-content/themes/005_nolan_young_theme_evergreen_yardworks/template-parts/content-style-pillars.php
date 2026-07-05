<section class="section property-types">
	<div class="container">
		<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Property types', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'Yard care for homes, townhomes, small HOAs, rentals, and storefront entries.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
		<div class="card-grid card-grid--three">
			<?php foreach ( array( 'Homes' => 'Recurring mowing, clean edges, seasonal beds, and cleanup that keeps curb appeal steady.', 'Townhomes' => 'Compact routes, entry beds, shared edges, and tidy hard surfaces with clear access notes.', 'Small HOAs' => 'Common-area schedules, weather-aware visits, and simple communication for managed spaces.', 'Rentals' => 'Move-in resets, listing-photo cleanup, and maintenance plans that reduce owner guesswork.', 'Small storefronts' => 'Entry planters, walks, turf strips, and light grounds care for a cared-for first impression.', 'Light commercial grounds' => 'Practical trimming, debris cleanup, and bed refreshes without overbuilt commercial claims.' ) as $title => $text ) : ?>
				<article class="info-card" data-reveal><h3><?php echo esc_html( $title ); ?></h3><p><?php echo esc_html( $text ); ?></p></article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

