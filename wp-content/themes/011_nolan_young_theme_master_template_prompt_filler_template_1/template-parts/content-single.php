<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry-content-shell entry-content-shell--single' ); ?>>
	<header class="entry-header"><p class="eyebrow"><?php echo esc_html( get_the_date() ); ?></p><?php the_title( '<h1>', '</h1>' ); ?></header>
	<?php if ( has_post_thumbnail() ) : ?><div class="entry-media"><?php the_post_thumbnail( 'large' ); ?></div><?php endif; ?>
	<div class="entry-content"><?php the_content(); ?></div>
	<footer class="entry-footer"><?php the_tags( '<div class="tag-list">', '', '</div>' ); ?></footer>
</article>
