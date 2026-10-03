<?php /** A small reading list, without fabricated article routes. */ ?>
<section class="journal-section wrap section-space" aria-labelledby="journal-title">
	<div class="section-heading"><div><p class="eyebrow">04 / Studio journal</p><h2 id="journal-title">Notes from <em>the table.</em></h2></div><a class="text-link" href="<?php echo clay_still_url( '/blog/' ); ?>">Read the journal ↗</a></div>
	<div class="journal-list">
		<?php foreach ( clay_still_notes() as $index => $note ) : ?>
		<a class="journal-row reveal" href="<?php echo clay_still_url( '/blog/#' . $note['id'] ); ?>"><span class="journal-number">0<?php echo esc_html( $index + 1 ); ?></span><span class="eyebrow"><?php echo esc_html( $note['category'] ); ?></span><h3><?php echo esc_html( $note['title'] ); ?></h3><span class="journal-arrow" aria-hidden="true">↗</span></a>
		<?php endforeach; ?>
	</div>
</section>
