<?php
/**
 * Restricted access template.
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="template-section error-403">
		<div class="template-container">
			<p class="eyebrow"><?php esc_html_e( 'Access restricted', 'nolan-young-template' ); ?></p>
			<h1><?php esc_html_e( 'This page is not available for public viewing.', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'Return to the homepage or use search to find public resources, services, and contact information.', 'nolan-young-template' ); ?></p>
			<a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', 'nolan-young-template' ); ?></a>
		</div>
	</section>
</main>
<?php
get_footer();
