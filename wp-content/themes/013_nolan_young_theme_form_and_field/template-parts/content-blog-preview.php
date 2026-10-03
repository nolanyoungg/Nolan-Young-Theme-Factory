<section class="container journal-overview">
	<figure><?php form_field_image( 'detail', '', true ); ?><figcaption>Observation / Light meeting a surface. Illustrative stock.</figcaption></figure>
	<nav aria-label="Journal notes"><?php foreach ( form_field_notes() as $note ) : ?><a href="#<?php echo esc_attr( $note['id'] ); ?>"><span class="eyebrow"><?php echo esc_html( $note['label'] ); ?></span><h2><?php echo esc_html( $note['title'] ); ?></h2><span aria-hidden="true">↓</span></a><?php endforeach; ?></nav>
</section>
