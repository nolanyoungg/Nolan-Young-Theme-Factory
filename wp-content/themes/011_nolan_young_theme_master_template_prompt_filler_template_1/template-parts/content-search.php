<article id="post-<?php the_ID(); ?>" <?php post_class( 'search-card' ); ?>>
	<p class="eyebrow"><?php echo esc_html( get_post_type_object( get_post_type() )->labels->singular_name ); ?></p>
	<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 28 ) ); ?></p>
	<a class="btn btn-text" href="<?php the_permalink(); ?>" aria-label="<?php the_title_attribute( array( 'before' => __( 'Open ', 'nolan-young-template' ) ) ); ?>"><?php esc_html_e( 'Open result', 'nolan-young-template' ); ?></a>
</article>
