<?php
/**
 * Not-found template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="primary" class="nytt01-site-main nytt01-container nytt01-content-area">
	<section class="nytt01-error-page" aria-labelledby="nytt01-error-title">
		<p class="nytt01-eyebrow"><?php esc_html_e( 'Error 404', 'nolan-young-theme-template-01' ); ?></p>
		<h1 id="nytt01-error-title"><?php esc_html_e( 'That page could not be found.', 'nolan-young-theme-template-01' ); ?></h1>
		<p><?php esc_html_e( 'The address may be incorrect, or the page may have moved. Search the site or return to the home page.', 'nolan-young-theme-template-01' ); ?></p>
		<?php get_search_form(); ?>
		<p><a class="nytt01-button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', 'nolan-young-theme-template-01' ); ?></a></p>
	</section>
</main>
<?php
get_footer();
