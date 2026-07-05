<?php $articles = nolan_young_template_articles(); ?>
<section class="section blog-preview">
	<div class="container">
		<div class="section-heading section-heading--row"><div><p class="eyebrow"><?php esc_html_e( 'Seasonal guide', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'Homeowner notes for cleaner lawns, beds, and seasonal timing.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Read the guide', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
		<div class="card-grid">
			<?php foreach ( array_slice( $articles, 0, 4 ) as $article ) : ?>
				<article class="blog-card" data-reveal><?php nolan_young_template_render_image( $article['image'], $article['title'] ); ?><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h3><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a></h3><p><?php echo esc_html( $article['excerpt'] ); ?></p></article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

