<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_handle_newsletter_form() {
	if ( ! isset( $_POST['nolan_newsletter_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nolan_newsletter_nonce'] ) ), 'nolan_newsletter' ) ) {
		wp_die( esc_html__( 'Security check failed.', '001_nolan_young_theme_northstar_web_works' ) );
	}

	$email    = isset( $_POST['newsletter_email'] ) ? sanitize_email( wp_unslash( $_POST['newsletter_email'] ) ) : '';
	$response = $email ? 'thanks' : 'invalid';
	$redirect = add_query_arg( 'newsletter', $response, wp_get_referer() ? wp_get_referer() : home_url( '/' ) );
	wp_safe_redirect( $redirect );
	exit;
}
add_action( 'admin_post_nopriv_nolan_newsletter', 'nolan_handle_newsletter_form' );
add_action( 'admin_post_nolan_newsletter', 'nolan_handle_newsletter_form' );



