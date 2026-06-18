<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry-content-shell' ); ?>>
	<header class="entry-header"><p class="eyebrow"><?php esc_html_e( 'Page', 'nolan-young-template' ); ?></p><?php the_title( '<h1>', '</h1>' ); ?></header>
	<div class="entry-content"><?php the_content(); wp_link_pages( array( 'before' => '<nav class="page-links">' . esc_html__( 'Pages:', 'nolan-young-template' ), 'after' => '</nav>' ) ); ?></div>
</article>
