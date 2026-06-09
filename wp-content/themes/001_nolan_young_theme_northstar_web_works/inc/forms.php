<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_handle_contact_form() {
	if ( ! isset( $_POST['nolan_contact_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nolan_contact_nonce'] ) ), 'nolan_contact' ) ) {
		wp_die( esc_html__( 'Security check failed.', '001_nolan_young_theme_northstar_web_works' ) );
	}

	$name    = isset( $_POST['contact_name'] ) ? sanitize_text_field( wp_unslash( $_POST['contact_name'] ) ) : '';
	$email   = isset( $_POST['contact_email'] ) ? sanitize_email( wp_unslash( $_POST['contact_email'] ) ) : '';
	$project = isset( $_POST['contact_project'] ) ? sanitize_text_field( wp_unslash( $_POST['contact_project'] ) ) : '';
	$message = isset( $_POST['contact_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['contact_message'] ) ) : '';

	$admin_email = get_option( 'admin_email' );
	$subject      = sprintf( '[%s] New inquiry from %s', wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ), $name ? $name : 'a visitor' );
	$body         = implode(
		"\n\n",
		array(
			'Name: ' . $name,
			'Email: ' . $email,
			'Project: ' . $project,
			'Message: ' . $message,
		)
	);

	if ( is_email( $admin_email ) ) {
		wp_mail( $admin_email, $subject, $body, array( 'Reply-To: ' . $email ) );
	}

	$redirect = add_query_arg( 'contact', 'sent', wp_get_referer() ? wp_get_referer() : home_url( '/' ) );
	wp_safe_redirect( $redirect );
	exit;
}
add_action( 'admin_post_nopriv_nolan_contact', 'nolan_handle_contact_form' );
add_action( 'admin_post_nolan_contact', 'nolan_handle_contact_form' );



