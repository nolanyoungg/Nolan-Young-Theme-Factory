<section class="section bill-section" id="weekly-bill" aria-labelledby="bill-title">
	<div class="container">
		<div class="section-heading"><div><p class="eyebrow">01 / On the turntable &amp; on the stage</p><h2 id="bill-title">This week, in feeling.</h2></div><p>November 12–14, 2026<br><span class="microcopy">An illustrative lineup. No tickets on sale.</span></p></div>
		<div class="weekly-bill">
		<?php foreach ( blue_hour_bill() as $event ) : ?>
			<article class="ticket-row"><div class="date-badge"><span><?php echo esc_html( $event[0] ); ?></span><strong><?php echo esc_html( $event[1] ); ?></strong><span>NOV</span></div><div class="ticket-title"><p class="eyebrow"><?php echo esc_html( $event[3] ); ?></p><h3><?php echo esc_html( $event[2] ); ?></h3></div><p class="set-times"><?php echo esc_html( $event[4] ); ?><span>Sample set times</span></p><?php blue_hour_link( '/services/', 'Meet the sessions ↗', 'text-link' ); ?></article>
		<?php endforeach; ?>
		</div>
	</div>
</section>
