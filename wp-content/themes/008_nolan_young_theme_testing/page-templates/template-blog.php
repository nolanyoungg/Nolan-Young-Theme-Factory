<?php
/**
 * Template Name: Blog
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="template-section">
		<div class="template-container">
			<p class="eyebrow"><?php esc_html_e( 'Insights', 'nolan-young-template' ); ?></p>
			<h1><?php esc_html_e( 'Notes on product design, engineering, and delivery', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'This blog layout helps the team publish advice, perspectives, and technical updates without sacrificing readability or structure.', 'nolan-young-template' ); ?></p>
		</div>
	</section>
</main>
<?php
get_footer();
