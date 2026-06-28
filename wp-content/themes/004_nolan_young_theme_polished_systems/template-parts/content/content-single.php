<?php
/**
 * Single-content presentation.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'nytt01-entry' ); ?>>
	<header class="nytt01-entry-header">
		<?php the_title( '<h1 class="nytt01-entry-title">', '</h1>' ); ?>
		<?php if ( 'post' === get_post_type() ) : ?>
			<div class="nytt01-entry-meta"><?php nytt01_posted_on(); ?> <?php nytt01_posted_by(); ?></div>
		<?php endif; ?>
	</header>
	<?php if ( has_post_thumbnail() ) : ?>
		<figure class="nytt01-entry-media"><?php the_post_thumbnail( 'large' ); ?></figure>
	<?php endif; ?>
	<div class="nytt01-entry-content">
		<?php
		the_content();
		wp_link_pages(
			array(
				'before' => '<nav class="nytt01-page-links" aria-label="' . esc_attr__( 'Page', 'nolan-young-theme-template-01' ) . '">',
				'after'  => '</nav>',
			)
		);
		?>
	</div>
	<footer class="nytt01-entry-footer"><?php nytt01_entry_footer(); ?></footer>
</article>
