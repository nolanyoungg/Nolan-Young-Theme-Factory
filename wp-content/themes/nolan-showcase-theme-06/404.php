<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<div class="container content-shell error-shell">
		<p class="kicker"><?php esc_html_e( 'Page not found', 'nolan-showcase-theme-06' ); ?></p>
		<h1 class="page-title"><?php esc_html_e( 'The page you were looking for could not be found.', 'nolan-showcase-theme-06' ); ?></h1>
		<p><?php esc_html_e( 'Try the home page, the journal, or the search form below to find the right destination.', 'nolan-showcase-theme-06' ); ?></p>
		<?php get_search_form(); ?>
		<p class="error-links">
			<a class="button button--primary" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back home', 'nolan-showcase-theme-06' ); ?></a>
			<a class="button button--ghost" href="<?php echo esc_url( home_url( '/#work' ) ); ?>"><?php esc_html_e( 'See featured work', 'nolan-showcase-theme-06' ); ?></a>
		</p>
	</div>
</section>
<?php
get_footer();


