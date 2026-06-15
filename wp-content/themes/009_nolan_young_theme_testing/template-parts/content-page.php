<?php
/**
 * Page content partial.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry-content narrow-flow' ); ?>>
	<?php the_title( '<h1>', '</h1>' ); ?>
	<?php the_content(); ?>
</article>
