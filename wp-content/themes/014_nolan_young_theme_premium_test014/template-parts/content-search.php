<?php
/**
 * Search result fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-search">
	<div class="template-container">
		<p class="eyebrow"><?php esc_html_e( 'Search results', 'nolan-young-template' ); ?></p>
		<?php the_title( '<h2>', '</h2>' ); ?>
		<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 28 ) ); ?></p>
		<a class="btn btn-text" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Read more', 'nolan-young-template' ); ?></a>
	</div>
</section>
