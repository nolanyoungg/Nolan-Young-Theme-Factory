<?php
/**
 * No content fallback.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */
?>
<article class="info-card info-card--empty">
	<h2><?php esc_html_e( 'Nothing matched that request.', '009_nolan_young_theme_testing' ); ?></h2>
	<p><?php esc_html_e( 'Try a different search term or return to the main service and case study sections for an overview of the site.', '009_nolan_young_theme_testing' ); ?></p>
	<a class="text-link" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', '009_nolan_young_theme_testing' ); ?></a>
</article>
