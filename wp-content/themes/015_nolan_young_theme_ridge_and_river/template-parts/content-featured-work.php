<?php /** Sample walks, presented as a departure ledger. */ ?>
<section class="section container" id="walks" data-animate>
	<div class="section-heading"><div><p class="eyebrow">01 / Out on the trail</p><h2>A day worth<br>making room for.</h2></div><div><p>Ideas for the next time you lace up. These are sample walks, with no live dates or availability.</p><a class="text-link" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">See all ways to walk ↗</a></div></div>
	<div class="walk-ledger"><?php foreach ( ridge_river_walks() as $index => $walk ) : ?>
	<a class="walk-row" href="<?php echo esc_url( home_url( $walk['url'] ) ); ?>"><span class="row-number"><?php echo esc_html( sprintf( '%02d', $index + 1 ) ); ?></span><div><span class="eyebrow"><?php echo esc_html( $walk['season'] ); ?></span><h3><?php echo esc_html( $walk['name'] ); ?></h3></div><span class="walk-meta"><?php echo esc_html( $walk['distance'] . ' / ' . $walk['time'] ); ?></span><span class="grade"><?php echo esc_html( $walk['grade'] ); ?></span><span class="row-arrow" aria-hidden="true">↗</span></a>
	<?php endforeach; ?></div>
</section>
