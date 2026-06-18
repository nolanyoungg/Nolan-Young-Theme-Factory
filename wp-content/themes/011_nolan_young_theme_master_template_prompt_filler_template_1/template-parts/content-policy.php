<article id="post-<?php the_ID(); ?>" <?php post_class( 'policy-content entry-content-shell' ); ?>>
	<header class="entry-header"><p class="eyebrow"><?php esc_html_e( 'Policy', 'nolan-young-template' ); ?></p><?php the_title( '<h1>', '</h1>' ); ?><p><?php esc_html_e( 'This page displays WordPress-managed policy content. Review and publish legal text appropriate for the site before use.', 'nolan-young-template' ); ?></p></header>
	<div class="entry-content"><?php the_content(); ?></div>
</article>
