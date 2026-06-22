<?php
/**
 * Single post content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<article <?php post_class( 'template-section content-single' ); ?>>
	<div class="template-container">
		<p class="eyebrow"><?php esc_html_e( 'Resource', 'nolan-young-template' ); ?></p>
		<?php the_title( '<h1>', '</h1>' ); ?>
		<div class="entry-content">
			<?php the_content(); ?>
		</div>
	</div>
</article>
