<?php
/**
 * Private inquiry forms.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_register_form_cpt() {
	register_post_type(
		'northstar_form',
		array(
			'labels'              => array( 'name' => __( 'Forms', 'nolan-young-theme-circuit-commerce-studio' ), 'singular_name' => __( 'Form Submission', 'nolan-young-theme-circuit-commerce-studio' ) ),
			'public'              => false,
			'show_ui'             => false,
			'exclude_from_search' => true,
			'show_in_rest'        => false,
			'capability_type'     => 'post',
			'supports'            => array( 'title' ),
		)
	);
}
add_action( 'init', 'nolan_young_template_register_form_cpt' );

function nolan_young_template_submit_form() {
	if ( ! isset( $_POST['nolan_young_template_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nolan_young_template_form_nonce'] ) ), 'nolan_young_template_form' ) ) {
		wp_die( esc_html__( 'The form security check failed.', 'nolan-young-theme-circuit-commerce-studio' ), 403 );
	}
	if ( ! empty( $_POST['company_url'] ) ) {
		wp_safe_redirect( wp_get_referer() ? wp_get_referer() : home_url( '/' ) );
		exit;
	}
	$name    = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$phone   = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$type    = isset( $_POST['form_type'] ) ? sanitize_key( wp_unslash( $_POST['form_type'] ) ) : 'contact';
	$service = isset( $_POST['service'] ) ? sanitize_text_field( wp_unslash( $_POST['service'] ) ) : '';
	if ( '' === $name || '' === $message || ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'form_status', 'invalid', wp_get_referer() ? wp_get_referer() : home_url( '/contact/' ) ) );
		exit;
	}
	$post_id = wp_insert_post(
		array(
			'post_type'   => 'northstar_form',
			'post_status' => 'private',
			'post_title'  => sprintf( '%s inquiry from %s', ucfirst( $type ), $name ),
			'meta_input'  => array(
				'_form_type' => $type,
				'_name'      => $name,
				'_email'     => $email,
				'_phone'     => $phone,
				'_message'   => $message,
				'_service'   => $service,
			),
		),
		true
	);
	if ( ! is_wp_error( $post_id ) ) {
		wp_mail( get_option( 'admin_email' ), __( 'New Circuit Commerce Studio inquiry', 'nolan-young-theme-circuit-commerce-studio' ), "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\n\n$message" );
	}
	wp_safe_redirect( add_query_arg( 'form_status', 'success', wp_get_referer() ? wp_get_referer() : home_url( '/contact/' ) ) );
	exit;
}
add_action( 'admin_post_nopriv_nolan_young_template_submit_form', 'nolan_young_template_submit_form' );
add_action( 'admin_post_nolan_young_template_submit_form', 'nolan_young_template_submit_form' );

function nolan_young_template_forms_menu() {
	add_menu_page( __( 'Forms', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Forms', 'nolan-young-theme-circuit-commerce-studio' ), 'manage_options', 'northstar-forms', 'nolan_young_template_forms_page', 'dashicons-feedback', 58 );
}
add_action( 'admin_menu', 'nolan_young_template_forms_menu' );

function nolan_young_template_forms_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view submissions.', 'nolan-young-theme-circuit-commerce-studio' ) );
	}
	if ( isset( $_GET['export'] ) && check_admin_referer( 'northstar_forms_export' ) ) {
		nolan_young_template_export_forms();
	}
	$submissions = get_posts( array( 'post_type' => 'northstar_form', 'post_status' => 'private', 'numberposts' => 50, 'orderby' => 'date', 'order' => 'DESC' ) );
	echo '<div class="wrap"><h1>' . esc_html__( 'Forms', 'nolan-young-theme-circuit-commerce-studio' ) . '</h1>';
	echo '<p><a class="button button-primary" href="' . esc_url( wp_nonce_url( admin_url( 'admin.php?page=northstar-forms&export=1' ), 'northstar_forms_export' ) ) . '">' . esc_html__( 'Export CSV', 'nolan-young-theme-circuit-commerce-studio' ) . '</a></p>';
	echo '<table class="widefat striped"><thead><tr><th>' . esc_html__( 'Date', 'nolan-young-theme-circuit-commerce-studio' ) . '</th><th>' . esc_html__( 'Type', 'nolan-young-theme-circuit-commerce-studio' ) . '</th><th>' . esc_html__( 'Name', 'nolan-young-theme-circuit-commerce-studio' ) . '</th><th>' . esc_html__( 'Email', 'nolan-young-theme-circuit-commerce-studio' ) . '</th><th>' . esc_html__( 'Message', 'nolan-young-theme-circuit-commerce-studio' ) . '</th></tr></thead><tbody>';
	foreach ( $submissions as $submission ) {
		echo '<tr><td>' . esc_html( get_the_date( '', $submission ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_form_type', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_name', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_email', true ) ) . '</td><td>' . esc_html( wp_trim_words( get_post_meta( $submission->ID, '_message', true ), 18 ) ) . '</td></tr>';
	}
	echo '</tbody></table></div>';
}

function nolan_young_template_export_forms() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Not allowed.', 'nolan-young-theme-circuit-commerce-studio' ) );
	}
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=northstar-form-submissions.csv' );
	$output = fopen( 'php://output', 'w' );
	fputcsv( $output, array( 'Date', 'Type', 'Name', 'Email', 'Phone', 'Service', 'Message' ) );
	foreach ( get_posts( array( 'post_type' => 'northstar_form', 'post_status' => 'private', 'numberposts' => -1 ) ) as $submission ) {
		fputcsv( $output, array( get_the_date( 'c', $submission ), get_post_meta( $submission->ID, '_form_type', true ), get_post_meta( $submission->ID, '_name', true ), get_post_meta( $submission->ID, '_email', true ), get_post_meta( $submission->ID, '_phone', true ), get_post_meta( $submission->ID, '_service', true ), get_post_meta( $submission->ID, '_message', true ) ) );
	}
	exit;
}

