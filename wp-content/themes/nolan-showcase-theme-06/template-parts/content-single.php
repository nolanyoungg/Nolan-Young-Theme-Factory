<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<article <?php post_class( 'content-article content-article--single' ); ?>>
	<header class="entry-header">
		<p class="kicker"><?php echo esc_html( get_the_date() ); ?></p>
		<h1 class="entry-title"><?php the_title(); ?></h1>
		<div class="entry-meta"><?php echo esc_html( get_the_author() ); ?></div>
	</header>
	<div class="entry-content">
		<?php the_content(); ?>
	</div>
</article>

