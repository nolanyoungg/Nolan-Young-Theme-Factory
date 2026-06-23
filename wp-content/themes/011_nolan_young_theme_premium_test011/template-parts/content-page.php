<?php
/**
 * Generic page content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-page">
	<div class="template-container">
		<p class="eyebrow"><?php esc_html_e( 'Page details', 'nolan-young-template' ); ?></p>
		<?php the_title( '<h1>', '</h1>' ); ?>
		<div class="entry-content">
			<?php the_content(); ?>
		</div>
	</div>
</section>
