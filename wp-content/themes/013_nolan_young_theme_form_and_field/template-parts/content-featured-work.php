<section class="section work-section" aria-labelledby="work-title">
	<div class="container">
		<div class="section-heading"><div><p class="eyebrow">02 / Selected explorations</p><h2 id="work-title">Ideas taking shape.</h2></div><a class="text-link" href="<?php echo form_field_url( 'work' ); ?>">All concept studies ↗</a></div>
		<div class="study-grid">
			<?php foreach ( array_slice( form_field_projects(), 0, 2 ) as $project ) : ?>
			<article class="study-card" data-reveal><a class="study-card__image" href="<?php echo form_field_url( 'work' ) . '#' . esc_attr( $project['id'] ); ?>" aria-label="<?php echo esc_attr( 'Explore ' . $project['title'] ); ?>"><?php form_field_image( $project['image'] ); ?><span aria-hidden="true">↗</span></a><p class="eyebrow"><?php echo esc_html( $project['type'] ); ?></p><h3><a href="<?php echo form_field_url( 'work' ) . '#' . esc_attr( $project['id'] ); ?>"><?php echo esc_html( $project['title'] ); ?></a></h3><p><?php echo esc_html( $project['idea'] ); ?></p></article>
			<?php endforeach; ?>
		</div>
		<p class="image-note">Unbuilt, fictional studies. Stock photographs illustrate atmosphere and material; they do not depict these projects.</p>
	</div>
</section>
