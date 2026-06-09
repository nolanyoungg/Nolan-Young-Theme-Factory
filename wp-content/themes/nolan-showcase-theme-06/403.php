<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<div class="container content-shell error-shell">
		<p class="kicker"><?php esc_html_e( 'Access restricted', 'nolan-showcase-theme-06' ); ?></p>
		<h1 class="page-title"><?php esc_html_e( 'You do not have permission to view this page.', 'nolan-showcase-theme-06' ); ?></h1>
		<p><?php esc_html_e( 'If you believe this is a mistake, please return home or send a direct inquiry.', 'nolan-showcase-theme-06' ); ?></p>
		<p class="error-links">
			<a class="button button--primary" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back home', 'nolan-showcase-theme-06' ); ?></a>
			<a class="button button--ghost" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Northstar', 'nolan-showcase-theme-06' ); ?></a>
		</p>
	</div>
</section>
<?php
get_footer();


