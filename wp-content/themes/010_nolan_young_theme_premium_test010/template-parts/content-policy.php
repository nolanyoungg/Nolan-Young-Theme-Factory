<?php
/**
 * Policy page content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-policy">
	<div class="template-container">
		<p class="eyebrow"><?php esc_html_e( 'Policy information', 'nolan-young-template' ); ?></p>
		<?php the_title( '<h1>', '</h1>' ); ?>
		<div class="entry-content">
			<?php the_content(); ?>
		</div>
	</div>
</section>
