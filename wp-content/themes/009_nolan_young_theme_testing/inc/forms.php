<?php
/**
 * Form handling and admin export.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_theme_register_form_entry_post_type() {
	register_post_type(
		'ny_form_entry',
		array(
			'labels' => array(
				'name'          => __( 'Forms', '009_nolan_young_theme_testing' ),
				'singular_name' => __( 'Form Entry', '009_nolan_young_theme_testing' ),
				'menu_name'     => __( 'Forms', '009_nolan_young_theme_testing' ),
			),
			'public'      => false,
			'show_ui'     => true,
			'show_in_menu'=> true,
			'menu_icon'   => 'dashicons-feedback',
			'supports'    => array( 'title' ),
		)
	);
}
add_action( 'init', 'nolan_young_theme_register_form_entry_post_type' );

function nolan_young_theme_form_types() {
	return array(
		'contact'      => __( 'Contact', '009_nolan_young_theme_testing' ),
		'consultation' => __( 'Consultation', '009_nolan_young_theme_testing' ),
		'newsletter'   => __( 'Newsletter', '009_nolan_young_theme_testing' ),
	);
}

function nolan_young_theme_save_form_entry( $form_type, $fields ) {
	$form_labels = nolan_young_theme_form_types();
	$form_label  = isset( $form_labels[ $form_type ] ) ? $form_labels[ $form_type ] : ucfirst( $form_type );
	$email       = isset( $fields['email'] ) ? sanitize_email( $fields['email'] ) : '';
	$name        = isset( $fields['name'] ) ? sanitize_text_field( $fields['name'] ) : $email;

	$post_id = wp_insert_post(
		array(
			'post_title'  => sanitize_text_field( $form_label . ': ' . $name ),
			'post_type'   => 'ny_form_entry',
			'post_status' => 'publish',
		)
	);

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		return false;
	}

	update_post_meta( $post_id, '_ny_form_type', sanitize_key( $form_type ) );

	foreach ( $fields as $key => $value ) {
		update_post_meta( $post_id, '_ny_field_' . sanitize_key( $key ), is_array( $value ) ? wp_json_encode( $value ) : sanitize_textarea_field( $value ) );
	}

	return $post_id;
}

function nolan_young_theme_redirect_with_status( $status ) {
	$redirect_to = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	wp_safe_redirect( add_query_arg( 'form_status', $status, $redirect_to ) );
	exit;
}

function nolan_young_theme_handle_contact_submission() {
	if ( ! isset( $_POST['contact_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['contact_form_nonce'] ) ), 'nolan_young_theme_submit_contact' ) ) {
		nolan_young_theme_redirect_with_status( 'invalid' );
	}

	$fields = array(
		'name'         => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
		'email'        => sanitize_email( wp_unslash( $_POST['email'] ?? '' ) ),
		'phone'        => sanitize_text_field( wp_unslash( $_POST['phone'] ?? '' ) ),
		'company'      => sanitize_text_field( wp_unslash( $_POST['company'] ?? '' ) ),
		'message'      => sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) ),
		'service_type' => sanitize_text_field( wp_unslash( $_POST['service_type'] ?? '' ) ),
	);

	nolan_young_theme_save_form_entry( 'contact', $fields );
	nolan_young_theme_redirect_with_status( 'success' );
}
add_action( 'admin_post_nopriv_nolan_young_theme_submit_contact', 'nolan_young_theme_handle_contact_submission' );
add_action( 'admin_post_nolan_young_theme_submit_contact', 'nolan_young_theme_handle_contact_submission' );

function nolan_young_theme_handle_consultation_submission() {
	if ( ! isset( $_POST['consultation_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['consultation_form_nonce'] ) ), 'nolan_young_theme_submit_consultation' ) ) {
		nolan_young_theme_redirect_with_status( 'invalid' );
	}

	$fields = array(
		'name'         => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
		'email'        => sanitize_email( wp_unslash( $_POST['email'] ?? '' ) ),
		'phone'        => sanitize_text_field( wp_unslash( $_POST['phone'] ?? '' ) ),
		'project_type' => sanitize_text_field( wp_unslash( $_POST['project_type'] ?? '' ) ),
		'business_type'=> sanitize_text_field( wp_unslash( $_POST['business_type'] ?? '' ) ),
		'website'      => esc_url_raw( wp_unslash( $_POST['website'] ?? '' ) ),
		'goals'        => sanitize_textarea_field( wp_unslash( $_POST['goals'] ?? '' ) ),
		'timeline'     => sanitize_text_field( wp_unslash( $_POST['timeline'] ?? '' ) ),
		'budget'       => sanitize_text_field( wp_unslash( $_POST['budget'] ?? '' ) ),
	);

	nolan_young_theme_save_form_entry( 'consultation', $fields );
	nolan_young_theme_redirect_with_status( 'success' );
}
add_action( 'admin_post_nopriv_nolan_young_theme_submit_consultation', 'nolan_young_theme_handle_consultation_submission' );
add_action( 'admin_post_nolan_young_theme_submit_consultation', 'nolan_young_theme_handle_consultation_submission' );

function nolan_young_theme_render_form_notice() {
	$status = sanitize_key( wp_unslash( $_GET['form_status'] ?? '' ) );

	if ( 'success' === $status ) {
		echo '<p class="form-notice form-notice--success">' . esc_html__( 'Thanks. Your submission has been received and stored in Forms.', '009_nolan_young_theme_testing' ) . '</p>';
	} elseif ( 'invalid' === $status ) {
		echo '<p class="form-notice form-notice--error">' . esc_html__( 'The form could not be verified. Please try again.', '009_nolan_young_theme_testing' ) . '</p>';
	}
}

function nolan_young_theme_add_export_page() {
	add_submenu_page(
		'edit.php?post_type=ny_form_entry',
		__( 'Export Forms', '009_nolan_young_theme_testing' ),
		__( 'Export', '009_nolan_young_theme_testing' ),
		'manage_options',
		'ny-form-export',
		'nolan_young_theme_render_export_page'
	);
}
add_action( 'admin_menu', 'nolan_young_theme_add_export_page' );

function nolan_young_theme_render_export_page() {
	$form_types = nolan_young_theme_form_types();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Export Form Submissions', '009_nolan_young_theme_testing' ); ?></h1>
		<p><?php esc_html_e( 'Export every submission or filter by a specific form type.', '009_nolan_young_theme_testing' ); ?></p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="nolan_young_theme_export_forms">
			<?php wp_nonce_field( 'nolan_young_theme_export_forms', 'nolan_young_theme_export_nonce' ); ?>
			<label for="ny-form-export-type"><?php esc_html_e( 'Form Type', '009_nolan_young_theme_testing' ); ?></label>
			<select id="ny-form-export-type" name="form_type">
				<option value="all"><?php esc_html_e( 'All Forms', '009_nolan_young_theme_testing' ); ?></option>
				<?php foreach ( $form_types as $key => $label ) : ?>
					<option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
			<?php submit_button( __( 'Export CSV', '009_nolan_young_theme_testing' ) ); ?>
		</form>
	</div>
	<?php
}

function nolan_young_theme_export_forms() {
	if ( ! current_user_can( 'manage_options' ) || ! isset( $_POST['nolan_young_theme_export_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nolan_young_theme_export_nonce'] ) ), 'nolan_young_theme_export_forms' ) ) {
		wp_die( esc_html__( 'You are not allowed to export form submissions.', '009_nolan_young_theme_testing' ) );
	}

	$form_type = sanitize_key( wp_unslash( $_POST['form_type'] ?? 'all' ) );
	$meta_query = array();

	if ( 'all' !== $form_type ) {
		$meta_query[] = array(
			'key'   => '_ny_form_type',
			'value' => $form_type,
		);
	}

	$entries = get_posts(
		array(
			'post_type'      => 'ny_form_entry',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'meta_query'     => $meta_query,
		)
	);

	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=forms-export-' . gmdate( 'Ymd-His' ) . '.csv' );

	$output = fopen( 'php://output', 'w' );
	fputcsv( $output, array( 'Submitted At', 'Form Type', 'Title', 'Name', 'Email', 'Phone', 'Company', 'Project Type', 'Business Type', 'Website', 'Timeline', 'Budget', 'Goals', 'Message' ) );

	foreach ( $entries as $entry ) {
		fputcsv(
			$output,
			array(
				$entry->post_date_gmt,
				get_post_meta( $entry->ID, '_ny_form_type', true ),
				$entry->post_title,
				get_post_meta( $entry->ID, '_ny_field_name', true ),
				get_post_meta( $entry->ID, '_ny_field_email', true ),
				get_post_meta( $entry->ID, '_ny_field_phone', true ),
				get_post_meta( $entry->ID, '_ny_field_company', true ),
				get_post_meta( $entry->ID, '_ny_field_project_type', true ),
				get_post_meta( $entry->ID, '_ny_field_business_type', true ),
				get_post_meta( $entry->ID, '_ny_field_website', true ),
				get_post_meta( $entry->ID, '_ny_field_timeline', true ),
				get_post_meta( $entry->ID, '_ny_field_budget', true ),
				get_post_meta( $entry->ID, '_ny_field_goals', true ),
				get_post_meta( $entry->ID, '_ny_field_message', true ),
			)
		);
	}

	fclose( $output );
	exit;
}
add_action( 'admin_post_nolan_young_theme_export_forms', 'nolan_young_theme_export_forms' );
