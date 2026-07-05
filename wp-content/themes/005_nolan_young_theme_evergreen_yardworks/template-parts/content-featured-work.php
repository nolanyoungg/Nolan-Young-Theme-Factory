<?php $work = array_slice( nolan_young_template_work_items(), 0, 3 ); ?>
<section class="section featured-strip">
	<div class="container">
		<div class="section-heading section-heading--row"><div><p class="eyebrow"><?php esc_html_e( 'Featured work', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'Representative lawn, cleanup, bed, and route maintenance examples.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View all work', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
		<div class="featured-strip__grid">
			<?php foreach ( $work as $item ) : ?>
				<article data-reveal><?php nolan_young_template_render_image( $item['image'], $item['title'] ); ?><p class="eyebrow"><?php echo esc_html( $item['category'] ); ?></p><h3><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a></h3></article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

