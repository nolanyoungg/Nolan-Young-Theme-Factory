<?php $articles = nolan_young_template_articles(); ?>
<section class="section blog-preview" aria-labelledby="blog-preview-title">
	<div class="container">
		<div class="section-heading section-heading--split"><div><p class="eyebrow"><?php esc_html_e( 'Resources', 'nolan-young-template' ); ?></p><h2 id="blog-preview-title"><?php esc_html_e( 'Helpful website planning notes for service businesses.', 'nolan-young-template' ); ?></h2></div><a class="btn btn-text" href="<?php echo nolan_young_template_page_url( 'blog/' ); ?>"><?php esc_html_e( 'Visit blog', 'nolan-young-template' ); ?></a></div>
		<div class="card-grid card-grid--four"><?php foreach ( $articles as $article ) : ?><article class="blog-card"><?php nolan_young_template_card_image( $article['image'], $article['title'] ); ?><div><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h3><?php echo esc_html( $article['title'] ); ?></h3><p><?php echo esc_html( $article['excerpt'] ); ?></p><a class="btn btn-text" href="<?php echo esc_url( $article['url'] ); ?>"><?php esc_html_e( 'Read article', 'nolan-young-template' ); ?></a></div></article><?php endforeach; ?></div>
	</div>
</section>
