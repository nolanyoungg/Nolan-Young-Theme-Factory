<?php
/**
 * Newsletter handling.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_theme_handle_newsletter_submission() {
	if ( ! isset( $_POST['newsletter_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['newsletter_nonce'] ) ), 'nolan_young_theme_submit_newsletter' ) ) {
		nolan_young_theme_redirect_with_status( 'invalid' );
	}

	$fields = array(
		'email' => sanitize_email( wp_unslash( $_POST['email'] ?? '' ) ),
	);

	nolan_young_theme_save_form_entry( 'newsletter', $fields );
	nolan_young_theme_redirect_with_status( 'success' );
}
add_action( 'admin_post_nopriv_nolan_young_theme_submit_newsletter', 'nolan_young_theme_handle_newsletter_submission' );
add_action( 'admin_post_nolan_young_theme_submit_newsletter', 'nolan_young_theme_handle_newsletter_submission' );
