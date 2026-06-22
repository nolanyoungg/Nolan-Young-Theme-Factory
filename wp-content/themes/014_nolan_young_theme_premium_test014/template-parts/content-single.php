<article id="post-<?php the_ID(); ?>" <?php post_class( 'content-entry content-entry--single' ); ?>>
	<header class="entry-header"><p class="eyebrow"><?php echo esc_html( get_the_date() ); ?></p><h1><?php the_title(); ?></h1></header>
	<div class="entry-content"><?php the_content(); ?></div>
</article>
