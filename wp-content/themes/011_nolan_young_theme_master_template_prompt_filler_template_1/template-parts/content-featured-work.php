<?php $items = array_slice( nolan_young_template_work_items(), 0, 4 ); ?>
<section class="section featured-strip" aria-labelledby="featured-strip-title">
	<div class="container">
		<div class="section-heading section-heading--split"><div><p class="eyebrow"><?php esc_html_e( 'Featured work', 'nolan-young-template' ); ?></p><h2 id="featured-strip-title"><?php esc_html_e( 'Practical site systems for real service workflows.', 'nolan-young-template' ); ?></h2></div><a class="btn btn-text" href="<?php echo nolan_young_template_page_url( 'work/' ); ?>"><?php esc_html_e( 'See all work', 'nolan-young-template' ); ?></a></div>
		<div class="featured-strip__track">
			<?php foreach ( $items as $item ) : ?><article class="mini-work"><span><?php echo esc_html( $item['category'] ); ?></span><h3><?php echo esc_html( $item['title'] ); ?></h3><p><?php echo esc_html( $item['excerpt'] ); ?></p><a href="<?php echo esc_url( $item['url'] ); ?>"><?php esc_html_e( 'Open project', 'nolan-young-template' ); ?></a></article><?php endforeach; ?>
		</div>
	</div>
</section>
