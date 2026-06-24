<?php
/**
 * Newsletter handling.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', 'nolan_young_template_newsletter_admin_menu' );
add_action( 'admin_post_nolan_young_newsletter_signup', 'nolan_young_template_handle_newsletter_signup' );
add_action( 'admin_post_nopriv_nolan_young_newsletter_signup', 'nolan_young_template_handle_newsletter_signup' );

function nolan_young_template_newsletter_admin_menu() {
	add_menu_page( __( 'Newsletter', '001_nolan_young_theme_nolan_designs' ), __( 'Newsletter', '001_nolan_young_theme_nolan_designs' ), 'manage_options', 'nolan-newsletter', 'nolan_young_template_newsletter_screen', 'dashicons-email', 27 );
}

function nolan_young_template_newsletter_screen() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	echo '<div class="wrap"><h1>' . esc_html__( 'Newsletter', '001_nolan_young_theme_nolan_designs' ) . '</h1><p>' . esc_html__( 'Subscribers are stored privately and can be exported by administrators.', '001_nolan_young_theme_nolan_designs' ) . '</p></div>';
}

function nolan_young_template_handle_newsletter_signup() {
	if ( ! isset( $_POST['nolan_newsletter_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nolan_newsletter_nonce'] ) ), 'nolan_newsletter_signup' ) ) {
		wp_die( esc_html__( 'Invalid request.', '001_nolan_young_theme_nolan_designs' ) );
	}
	$email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
	$name  = sanitize_text_field( wp_unslash( $_POST['first_name'] ?? '' ) );
	if ( ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'signup', 'error', wp_get_referer() ?: home_url( '/' ) ) );
		exit;
	}
	$existing = get_posts( array( 'post_type' => 'nolan_subscriber', 'post_status' => 'any', 'numberposts' => 1, 'meta_key' => 'nolan_subscriber_email', 'meta_value' => strtolower( $email ) ) );
	if ( $existing ) {
		wp_update_post( array( 'ID' => $existing[0]->ID, 'post_status' => 'publish' ) );
		update_post_meta( $existing[0]->ID, 'nolan_subscriber_status', 'active' );
	} else {
		$subscriber_id = wp_insert_post( array( 'post_type' => 'nolan_subscriber', 'post_status' => 'publish', 'post_title' => $email ) );
		update_post_meta( $subscriber_id, 'nolan_subscriber_email', strtolower( $email ) );
		update_post_meta( $subscriber_id, 'nolan_subscriber_name', $name );
		update_post_meta( $subscriber_id, 'nolan_subscriber_status', 'active' );
		update_post_meta( $subscriber_id, 'nolan_subscriber_token', wp_generate_password( 32, false ) );
	}
	wp_safe_redirect( add_query_arg( 'signup', 'success', wp_get_referer() ?: home_url( '/' ) ) );
	exit;
}
