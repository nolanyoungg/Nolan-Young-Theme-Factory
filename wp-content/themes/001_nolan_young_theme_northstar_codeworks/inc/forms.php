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
			'labels'              => array( 'name' => __( 'Forms', 'nolan-young-template' ), 'singular_name' => __( 'Form Submission', 'nolan-young-template' ) ),
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
		wp_die( esc_html__( 'The form security check failed.', 'nolan-young-template' ), 403 );
	}
	if ( ! empty( $_POST['company_url'] ) ) {
		wp_safe_redirect( wp_get_referer() ? wp_get_referer() : home_url( '/' ) );
		exit;
	}

	$name         = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email        = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$phone        = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$company      = isset( $_POST['company'] ) ? sanitize_text_field( wp_unslash( $_POST['company'] ) ) : '';
	$message      = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$type         = isset( $_POST['form_type'] ) ? sanitize_key( wp_unslash( $_POST['form_type'] ) ) : 'contact';
	$service      = isset( $_POST['service'] ) ? sanitize_text_field( wp_unslash( $_POST['service'] ) ) : '';
	$project_type = isset( $_POST['project_type'] ) ? sanitize_key( wp_unslash( $_POST['project_type'] ) ) : '';
	$budget_range  = isset( $_POST['budget_range'] ) ? sanitize_key( wp_unslash( $_POST['budget_range'] ) ) : '';

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
				'_form_type'    => $type,
				'_name'         => $name,
				'_email'        => $email,
				'_phone'        => $phone,
				'_company'      => $company,
				'_message'      => $message,
				'_service'      => $service,
				'_project_type' => $project_type,
				'_budget_range' => $budget_range,
			),
		),
		true
	);

	if ( ! is_wp_error( $post_id ) ) {
		wp_mail(
			get_option( 'admin_email' ),
			__( 'New Northstar Codeworks inquiry', 'nolan-young-template' ),
			"Name: $name\nEmail: $email\nPhone: $phone\nCompany: $company\nService: $service\nProject type: $project_type\nBudget: $budget_range\n\n$message"
		);
	}

	wp_safe_redirect( add_query_arg( 'form_status', 'success', wp_get_referer() ? wp_get_referer() : home_url( '/contact/' ) ) );
	exit;
}
add_action( 'admin_post_nopriv_nolan_young_template_submit_form', 'nolan_young_template_submit_form' );
add_action( 'admin_post_nolan_young_template_submit_form', 'nolan_young_template_submit_form' );

function nolan_young_template_known_form_types() {
	return array(
		'contact'       => __( 'Contact', 'nolan-young-template' ),
		'single-service' => __( 'Single service', 'nolan-young-template' ),
	);
}

function nolan_young_template_get_form_submissions( $selected_form = 'all' ) {
	$posts = get_posts(
		array(
			'post_type'   => 'northstar_form',
			'post_status' => 'private',
			'numberposts' => -1,
			'orderby'     => 'date',
			'order'       => 'DESC',
		)
	);

	if ( 'all' === $selected_form ) {
		return $posts;
	}

	return array_values(
		array_filter(
			$posts,
			function ( $post ) use ( $selected_form ) {
				return $selected_form === get_post_meta( $post->ID, '_form_type', true );
			}
		)
	);
}

function nolan_young_template_forms_menu() {
	add_menu_page( __( 'Forms', 'nolan-young-template' ), __( 'Forms', 'nolan-young-template' ), 'manage_options', 'northstar-forms', 'nolan_young_template_forms_page', 'dashicons-feedback', 58 );
}
add_action( 'admin_menu', 'nolan_young_template_forms_menu' );

function nolan_young_template_forms_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view submissions.', 'nolan-young-template' ) );
	}

	$selected_form = isset( $_GET['form'] ) ? sanitize_key( wp_unslash( $_GET['form'] ) ) : 'all';

	if ( isset( $_GET['export'] ) && check_admin_referer( 'northstar_forms_export' ) ) {
		nolan_young_template_export_forms( $selected_form );
	}

	$submissions = nolan_young_template_get_form_submissions( $selected_form );
	$forms       = array( 'all' => __( 'All forms', 'nolan-young-template' ) );

	foreach ( nolan_young_template_known_form_types() as $form_key => $label ) {
		$forms[ $form_key ] = $label;
	}

	echo '<div class="wrap"><h1>' . esc_html__( 'Forms', 'nolan-young-template' ) . '</h1>';
	echo '<form method="get" class="form-row"><input type="hidden" name="page" value="northstar-forms"><label>' . esc_html__( 'Filter form submissions', 'nolan-young-template' ) . '<select name="form">';
	foreach ( $forms as $form_key => $label ) {
		printf( '<option value="%1$s"%2$s>%3$s</option>', esc_attr( $form_key ), selected( $selected_form, $form_key, false ), esc_html( $label ) );
	}
	echo '</select></label><button class="button">' . esc_html__( 'Apply', 'nolan-young-template' ) . '</button></form>';
	echo '<p><a class="button button-primary" href="' . esc_url( wp_nonce_url( add_query_arg( array( 'page' => 'northstar-forms', 'form' => $selected_form, 'export' => 1 ), admin_url( 'admin.php' ) ), 'northstar_forms_export' ) ) . '">' . esc_html__( 'Export selected form', 'nolan-young-template' ) . '</a> <a class="button" href="' . esc_url( wp_nonce_url( add_query_arg( array( 'page' => 'northstar-forms', 'form' => 'all', 'export' => 1 ), admin_url( 'admin.php' ) ), 'northstar_forms_export' ) ) . '">' . esc_html__( 'Export all submissions', 'nolan-young-template' ) . '</a></p>';
	echo '<table class="widefat striped"><thead><tr><th>' . esc_html__( 'Date', 'nolan-young-template' ) . '</th><th>' . esc_html__( 'Type', 'nolan-young-template' ) . '</th><th>' . esc_html__( 'Name', 'nolan-young-template' ) . '</th><th>' . esc_html__( 'Email', 'nolan-young-template' ) . '</th><th>' . esc_html__( 'Company', 'nolan-young-template' ) . '</th><th>' . esc_html__( 'Message', 'nolan-young-template' ) . '</th></tr></thead><tbody>';
	foreach ( $submissions as $submission ) {
		echo '<tr><td>' . esc_html( get_the_date( '', $submission ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_form_type', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_name', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_email', true ) ) . '</td><td>' . esc_html( get_post_meta( $submission->ID, '_company', true ) ) . '</td><td>' . esc_html( wp_trim_words( get_post_meta( $submission->ID, '_message', true ), 18 ) ) . '</td></tr>';
	}
	echo '</tbody></table></div>';
}

function nolan_young_template_export_forms( $selected_form = 'all' ) {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Not allowed.', 'nolan-young-template' ) );
	}

	header( 'Content-Type: text/csv; charset=utf-8' );
	$filename = 'all' === $selected_form ? 'northstar-form-submissions.csv' : 'northstar-form-' . $selected_form . '.csv';
	header( 'Content-Disposition: attachment; filename=' . $filename );

	$output = fopen( 'php://output', 'w' );
	fputcsv( $output, array( 'Date', 'Type', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Project Type', 'Budget', 'Message' ) );
	foreach ( nolan_young_template_get_form_submissions( $selected_form ) as $submission ) {
		fputcsv(
			$output,
			array(
				get_the_date( 'c', $submission ),
				get_post_meta( $submission->ID, '_form_type', true ),
				get_post_meta( $submission->ID, '_name', true ),
				get_post_meta( $submission->ID, '_email', true ),
				get_post_meta( $submission->ID, '_phone', true ),
				get_post_meta( $submission->ID, '_company', true ),
				get_post_meta( $submission->ID, '_service', true ),
				get_post_meta( $submission->ID, '_project_type', true ),
				get_post_meta( $submission->ID, '_budget_range', true ),
				get_post_meta( $submission->ID, '_message', true ),
			)
		);
	}
	exit;
}
