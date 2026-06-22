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
			<p class="eyebrow"><?php esc_html_e( 'Northstar Websites Journal', 'nolan-young-template' ); ?></p>
			<h1><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'Practical notes on planning, building, and maintaining a stronger WordPress presence, written for teams that want their site to support real business goals.', 'nolan-young-template' ); ?></p>
		</div>
	</section>
</main>
<?php
get_footer();
