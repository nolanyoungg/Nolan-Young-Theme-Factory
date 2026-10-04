<section class="journal-preview section container" aria-labelledby="journal-title">
	<div class="section-heading"><div><p class="eyebrow">04 / The studio journal</p><h2 id="journal-title">Notes from <em>the table.</em></h2></div><a class="text-link" href="<?php echo clay_url( '/blog/' ); ?>">Open the journal ↗</a></div>
	<div class="journal-list"><?php foreach ( clay_articles() as $article ) : ?><a class="journal-row" href="<?php echo clay_url( '/blog/#' . $article['id'] ); ?>"><span class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></span><h3><?php echo esc_html( $article['title'] ); ?></h3><span class="journal-arrow" aria-hidden="true">↗</span></a><?php endforeach; ?></div>
</section>
