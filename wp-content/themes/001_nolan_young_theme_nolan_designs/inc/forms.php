<?php
/**
 * Form handling.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

function nolan_young_template_form_table() {
	global $wpdb;
	return $wpdb->prefix . 'nolan_submissions';
}

function nolan_young_template_forms_boot() {
	add_action( 'admin_menu', 'nolan_young_template_forms_admin_menu' );
	add_action( 'init', 'nolan_young_template_register_form_meta' );
	add_action( 'admin_post_nolan_young_submit_contact', 'nolan_young_template_handle_contact' );
	add_action( 'admin_post_nopriv_nolan_young_submit_contact', 'nolan_young_template_handle_contact' );
	add_action( 'admin_post_nolan_young_submit_service', 'nolan_young_template_handle_service' );
	add_action( 'admin_post_nopriv_nolan_young_submit_service', 'nolan_young_template_handle_service' );
}
add_action( 'after_setup_theme', 'nolan_young_template_forms_boot' );

function nolan_young_template_register_form_meta() {
	register_meta( 'post', 'nolan_form_type', array( 'show_in_rest' => false, 'single' => true, 'type' => 'string' ) );
	register_meta( 'post', 'nolan_form_payload', array( 'show_in_rest' => false, 'single' => true, 'type' => 'string' ) );
}

function nolan_young_template_forms_admin_menu() {
	add_menu_page( __( 'Forms', '001_nolan_young_theme_nolan_designs' ), __( 'Forms', '001_nolan_young_theme_nolan_designs' ), 'manage_options', 'nolan-forms', 'nolan_young_template_forms_screen', 'dashicons-email-alt2', 26 );
}

function nolan_young_template_forms_screen() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	echo '<div class="wrap"><h1>' . esc_html__( 'Forms', '001_nolan_young_theme_nolan_designs' ) . '</h1><p>' . esc_html__( 'Submissions are stored privately as form entries.', '001_nolan_young_theme_nolan_designs' ) . '</p></div>';
}

function nolan_young_template_handle_contact() {
	nolan_young_template_handle_form( 'contact' );
}

function nolan_young_template_handle_service() {
	nolan_young_template_handle_form( 'service' );
}

function nolan_young_template_handle_form( $form_type ) {
	if ( ! isset( $_POST['nolan_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nolan_form_nonce'] ) ), 'nolan_form_submit' ) ) {
		wp_die( esc_html__( 'Invalid request.', '001_nolan_young_theme_nolan_designs' ) );
	}

	$honeypot = isset( $_POST['company_website'] ) ? sanitize_text_field( wp_unslash( $_POST['company_website'] ) ) : '';
	if ( '' !== $honeypot ) {
		wp_safe_redirect( add_query_arg( 'form', 'sent', wp_get_referer() ?: home_url( '/' ) ) );
		exit;
	}

	$name    = sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) );
	$email   = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
	$phone   = sanitize_text_field( wp_unslash( $_POST['phone'] ?? '' ) );
	$message = sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) );
	$service = sanitize_text_field( wp_unslash( $_POST['service_id'] ?? '' ) );

	if ( '' === $name || ! is_email( $email ) || '' === $message ) {
		wp_safe_redirect( add_query_arg( 'form', 'error', wp_get_referer() ?: home_url( '/' ) ) );
		exit;
	}

	$post_id = wp_insert_post(
		array(
			'post_type'   => 'nolan_submission',
			'post_status' => 'private',
			'post_title'  => sprintf( '%s - %s', ucfirst( $form_type ), current_time( 'mysql' ) ),
			'meta_input'  => array(
				'nolan_form_type'    => $form_type,
				'nolan_form_payload' => wp_json_encode( compact( 'name', 'email', 'phone', 'message', 'service' ) ),
			),
		),
		true
	);

	if ( ! is_wp_error( $post_id ) ) {
		wp_mail( get_option( 'admin_email' ), sprintf( __( 'New %s submission', '001_nolan_young_theme_nolan_designs' ), $form_type ), $message );
	}

	wp_safe_redirect( add_query_arg( 'form', 'success', wp_get_referer() ?: home_url( '/' ) ) );
	exit;
}
