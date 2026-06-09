<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<article <?php post_class( 'content-article content-article--page' ); ?>>
	<header class="entry-header">
		<?php if ( ! is_front_page() ) : ?>
			<p class="kicker"><?php echo esc_html( get_the_date( 'F Y' ) ); ?></p>
		<?php endif; ?>
		<h1 class="entry-title"><?php the_title(); ?></h1>
	</header>
	<div class="entry-content">
		<?php the_content(); ?>
	</div>
</article>

