<?php
/**
 * Search result partial.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'info-card info-card--post' ); ?>>
	<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	<p><?php echo esc_html( get_the_excerpt() ); ?></p>
</article>
