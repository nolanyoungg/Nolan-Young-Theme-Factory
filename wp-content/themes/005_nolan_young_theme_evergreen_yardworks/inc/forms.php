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
		'yardworks_form',
		array(
			'labels'              => array( 'name' => __( 'Forms', '005-nolan-young-theme-evergreen-yardworks' ), 'singular_name' => __( 'Form Submission', '005-nolan-young-theme-evergreen-yardworks' ) ),
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
		wp_die( esc_html__( 'The form security check failed.', '005-nolan-young-theme-evergreen-yardworks' ), 403 );
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
	$property_type  = isset( $_POST['property_type'] ) ? sanitize_text_field( wp_unslash( $_POST['property_type'] ) ) : '';
	$service_area   = isset( $_POST['service_area'] ) ? sanitize_text_field( wp_unslash( $_POST['service_area'] ) ) : '';
	$services_needed = isset( $_POST['services_needed'] ) ? sanitize_textarea_field( wp_unslash( $_POST['services_needed'] ) ) : '';
	$schedule_type  = isset( $_POST['schedule_type'] ) ? sanitize_text_field( wp_unslash( $_POST['schedule_type'] ) ) : '';
	$timeline       = isset( $_POST['timeline'] ) ? sanitize_text_field( wp_unslash( $_POST['timeline'] ) ) : '';
	$interests      = isset( $_POST['interests'] ) && is_array( $_POST['interests'] ) ? array_map( 'sanitize_text_field', wp_unslash( $_POST['interests'] ) ) : array();
	$combined_note  = trim( $services_needed . "\n\nNotes: " . $message );
	if ( '' === $name || '' === $services_needed || ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'form_status', 'invalid', wp_get_referer() ? wp_get_referer() : home_url( '/contact/' ) ) );
		exit;
	}
	$post_id = wp_insert_post(
		array(
			'post_type'   => 'yardworks_form',
			'post_status' => 'private',
			'post_title'  => sprintf( '%s estimate request from %s', ucfirst( $type ), $name ),
			'meta_input'  => array(
				'_form_type'       => $type,
				'_name'            => $name,
				'_email'           => $email,
				'_phone'           => $phone,
				'_property_type'   => $property_type,
				'_service_area'    => $service_area,
				'_services_needed' => $services_needed,
				'_schedule_type'   => $schedule_type,
				'_timeline'        => $timeline,
				'_interests'       => implode( ', ', $interests ),
				'_message'         => $combined_note,
				'_service'         => $service,
			),
		),
		true
	);
	if ( ! is_wp_error( $post_id ) ) {
		wp_mail( get_option( 'admin_email' ), __( 'New Evergreen Yardworks estimate request', '005-nolan-young-theme-evergreen-yardworks' ), "Name: $name\nEmail: $email\nPhone: $phone\nProperty: $property_type\nArea: $service_area\nSchedule: $schedule_type\nTimeline: $timeline\nService: $service\nInterests: " . implode( ', ', $interests ) . "\n\n$combined_note" );
	}
	wp_safe_redirect( add_query_arg( 'form_status', 'success', wp_get_referer() ? wp_get_referer() : home_url( '/contact/' ) ) );
	exit;
}
add_action( 'admin_post_nopriv_nolan_young_template_submit_form', 'nolan_young_template_submit_form' );
add_action( 'admin_post_nolan_young_template_submit_form', 'nolan_young_template_submit_form' );

function nolan_young_template_forms_menu() {
	add_menu_page( __( 'Estimate Requests', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Estimate Requests', '005-nolan-young-theme-evergreen-yardworks' ), 'manage_options', 'evergreen-yardworks-forms', 'nolan_young_template_forms_page', 'dashicons-feedback', 58 );
}
add_action( 'admin_menu', 'nolan_young_template_forms_menu' );

function nolan_young_template_forms_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view submissions.', '005-nolan-young-theme-evergreen-yardworks' ) );
	}
	if ( isset( $_GET['export'] ) && check_admin_referer( 'yardworks_forms_export' ) ) {
		nolan_young_template_export_forms();
	}
	$submissions = get_posts( array( 'post_type' => 'yardworks_form', 'post_status' => 'private', 'numberposts' => 50, 'orderby' => 'date', 'order' => 'DESC' ) );
	echo '<div class="wrap"><h1>' . esc_html__( 'Evergreen Yardworks Estimate Requests', '005-nolan-young-theme-evergreen-yardworks' ) . '</h1>';
	echo '<p><a class="button button-primary" href="' . esc_url( wp_nonce_url( admin_url( 'admin.php?page=evergreen-yardworks-forms&export=1' ), 'yardworks_forms_export' ) ) . '">' . esc_html__( 'Export CSV', '005-nolan-young-theme-evergreen-yardworks' ) . '</a></p>';
	echo '<table class="widefat striped"><thead><tr><th>' . esc_html__( 'Date', '005-nolan-young-theme-evergreen-yardworks' ) . '</th><th>' . esc_html__( 'Type', '005-nolan-young-theme-evergreen-yardworks' ) . '</th><th>' . esc_html__( 'Name', '005-nolan-young-theme-evergreen-yardworks' ) . '</th><th>' . esc_html__( 'Email', '005-nolan-young-theme-evergreen-yardworks' ) . '</th><th>' . esc_html__( 'Property', '005-nolan-young-theme-evergreen-yardworks' ) . '</th><th>' . esc_html__( 'Message', '005-nolan-young-theme-evergreen-yardworks' ) . '</th></tr></thead><tbody>';
	foreach ( $submissions as $submission ) {
		echo '<tr><td>' . esc_html( get_the_date( '', $submission ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_form_type', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_name', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_email', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_property_type', true ) ) . '</td><td>' . esc_html( wp_trim_words( get_post_meta( $submission->ID, '_message', true ), 18 ) ) . '</td></tr>';
	}
	echo '</tbody></table></div>';
}

function nolan_young_template_export_forms() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Not allowed.', '005-nolan-young-theme-evergreen-yardworks' ) );
	}
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=evergreen-yardworks-estimate-requests.csv' );
	$output = fopen( 'php://output', 'w' );
	fputcsv( $output, array( 'Date', 'Type', 'Name', 'Email', 'Phone', 'Property Type', 'Service Area', 'Schedule', 'Timeline', 'Interests', 'Service', 'Message' ) );
	foreach ( get_posts( array( 'post_type' => 'yardworks_form', 'post_status' => 'private', 'numberposts' => -1 ) ) as $submission ) {
		fputcsv( $output, array( get_the_date( 'c', $submission ), get_post_meta( $submission->ID, '_form_type', true ), get_post_meta( $submission->ID, '_name', true ), get_post_meta( $submission->ID, '_email', true ), get_post_meta( $submission->ID, '_phone', true ), get_post_meta( $submission->ID, '_property_type', true ), get_post_meta( $submission->ID, '_service_area', true ), get_post_meta( $submission->ID, '_schedule_type', true ), get_post_meta( $submission->ID, '_timeline', true ), get_post_meta( $submission->ID, '_interests', true ), get_post_meta( $submission->ID, '_service', true ), get_post_meta( $submission->ID, '_message', true ) ) );
	}
	exit;
}
