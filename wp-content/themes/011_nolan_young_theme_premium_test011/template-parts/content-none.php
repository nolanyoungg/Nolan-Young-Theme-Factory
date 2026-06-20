<?php
/**
 * Empty content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-none">
	<div class="template-container">
		<p class="eyebrow"><?php esc_html_e( 'Content unavailable', 'nolan-young-template' ); ?></p>
		<h2><?php esc_html_e( 'No matching content was found.', 'nolan-young-template' ); ?></h2>
		<p><?php esc_html_e( 'Try another search or return to the homepage to continue exploring services, resources, and ways to start a project.', 'nolan-young-template' ); ?></p>
		<?php get_search_form(); ?>
	</div>
</section>
