<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<article <?php post_class( 'content-card content-card--search' ); ?>>
	<p class="kicker"><?php echo esc_html( get_the_date() ); ?></p>
	<h2 class="card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	<div class="card-excerpt"><?php the_excerpt(); ?></div>
</article>

