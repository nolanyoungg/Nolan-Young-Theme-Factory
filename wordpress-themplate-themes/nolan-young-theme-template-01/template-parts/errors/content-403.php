<?php
/**
 * Access-denied presentation loaded by the companion plugin.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;
?>
<section class="nytt01-error-page" aria-labelledby="nytt01-access-denied-title">
	<p class="nytt01-eyebrow"><?php esc_html_e( 'Error 403', 'nolan-young-theme-template-01' ); ?></p>
	<h1 id="nytt01-access-denied-title"><?php esc_html_e( 'You do not have permission to view this page.', 'nolan-young-theme-template-01' ); ?></h1>
	<p><?php esc_html_e( 'Sign in with an authorized account or return to the home page.', 'nolan-young-theme-template-01' ); ?></p>
	<div class="nytt01-button-group">
		<?php if ( ! is_user_logged_in() ) : ?>
			<a class="nytt01-button" href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>"><?php esc_html_e( 'Sign in', 'nolan-young-theme-template-01' ); ?></a>
		<?php endif; ?>
		<a class="nytt01-button nytt01-button--secondary" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', 'nolan-young-theme-template-01' ); ?></a>
	</div>
</section>
