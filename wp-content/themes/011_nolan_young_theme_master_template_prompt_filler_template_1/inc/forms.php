<?php
/**
 * Contact and service inquiry forms.
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
			'labels' => array( 'name' => __( 'Form Submissions', 'nolan-young-template' ) ),
			'public' => false,
			'show_ui' => false,
			'show_in_rest' => false,
			'exclude_from_search' => true,
			'publicly_queryable' => false,
			'capability_type' => 'post',
			'supports' => array( 'title' ),
		)
	);
}
add_action( 'init', 'nolan_young_template_register_form_cpt' );

function nolan_young_template_render_contact_form( $form_type = 'contact', $service = '' ) {
	$form_type = sanitize_key( $form_type );
	$service = sanitize_text_field( $service );
	$status = isset( $_GET['northstar_form_status'] ) ? sanitize_key( wp_unslash( $_GET['northstar_form_status'] ) ) : '';
	ob_start();
	?>
	<form class="northstar-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" novalidate data-validate-form>
		<?php if ( 'success' === $status ) : ?><div class="form-notice form-notice--success" role="status"><?php esc_html_e( 'Thank you. Your message has been received.', 'nolan-young-template' ); ?></div><?php endif; ?>
		<?php if ( 'error' === $status ) : ?><div class="form-notice form-notice--error" role="alert"><?php esc_html_e( 'Please review the highlighted fields and try again.', 'nolan-young-template' ); ?></div><?php endif; ?>
		<input type="hidden" name="action" value="northstar_form_submit">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'northstar_form_submit', 'northstar_form_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label for="northstar-company"><?php esc_html_e( 'Company', 'nolan-young-template' ); ?></label><input id="northstar-company" type="text" name="company_name" tabindex="-1" autocomplete="off"></div>
		<div class="form-grid">
			<label><?php esc_html_e( 'Name', 'nolan-young-template' ); ?><input required type="text" name="name" autocomplete="name" aria-describedby="form-name-error"><span id="form-name-error" class="field-error" aria-live="polite"></span></label>
			<label><?php esc_html_e( 'Email', 'nolan-young-template' ); ?><input required type="email" name="email" autocomplete="email" aria-describedby="form-email-error"><span id="form-email-error" class="field-error" aria-live="polite"></span></label>
		</div>
		<label><?php esc_html_e( 'Phone', 'nolan-young-template' ); ?><input type="tel" name="phone" autocomplete="tel"></label>
		<label><?php esc_html_e( 'Message', 'nolan-young-template' ); ?><textarea required name="message" rows="6" aria-describedby="form-message-error"></textarea><span id="form-message-error" class="field-error" aria-live="polite"></span></label>
		<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Send inquiry', 'nolan-young-template' ); ?></button>
	</form>
	<?php
	return ob_get_clean();
}

function nolan_young_template_form_rate_limited( $type ) {
	$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key = 'northstar_form_' . md5( $type . '|' . $ip );
	if ( get_transient( $key ) ) {
		return true;
	}
	set_transient( $key, 1, MINUTE_IN_SECONDS );
	return false;
}

function nolan_young_template_handle_form_submit() {
	if ( ! isset( $_POST['northstar_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['northstar_form_nonce'] ) ), 'northstar_form_submit' ) ) {
		wp_safe_redirect( add_query_arg( 'northstar_form_status', 'error', wp_get_referer() ? wp_get_referer() : home_url( '/' ) ) );
		exit;
	}

	$referer = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	$honeypot = isset( $_POST['company_name'] ) ? sanitize_text_field( wp_unslash( $_POST['company_name'] ) ) : '';
	$form_type = isset( $_POST['form_type'] ) ? sanitize_key( wp_unslash( $_POST['form_type'] ) ) : 'contact';
	if ( '' !== $honeypot || nolan_young_template_form_rate_limited( $form_type ) ) {
		wp_safe_redirect( add_query_arg( 'northstar_form_status', 'success', $referer ) );
		exit;
	}

	$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$phone = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$service = isset( $_POST['service'] ) ? sanitize_text_field( wp_unslash( $_POST['service'] ) ) : '';

	if ( '' === $name || '' === $message || ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'northstar_form_status', 'error', $referer ) );
		exit;
	}

	$post_id = wp_insert_post(
		array(
			'post_type' => 'northstar_form',
			'post_status' => 'private',
			'post_title' => sprintf( '%s - %s', $name, current_time( 'mysql' ) ),
		),
		true
	);

	if ( ! is_wp_error( $post_id ) ) {
		foreach ( compact( 'form_type', 'name', 'email', 'phone', 'message', 'service' ) as $key => $value ) {
			update_post_meta( $post_id, '_' . $key, $value );
		}
		wp_mail( get_option( 'admin_email' ), __( 'New Northstar Websites inquiry', 'nolan-young-template' ), $message );
	}

	wp_safe_redirect( add_query_arg( 'northstar_form_status', 'success', $referer ) );
	exit;
}
add_action( 'admin_post_nopriv_northstar_form_submit', 'nolan_young_template_handle_form_submit' );
add_action( 'admin_post_northstar_form_submit', 'nolan_young_template_handle_form_submit' );

function nolan_young_template_forms_menu() {
	add_menu_page( __( 'Forms', 'nolan-young-template' ), __( 'Forms', 'nolan-young-template' ), 'manage_options', 'northstar-forms', 'nolan_young_template_forms_admin_page', 'dashicons-feedback', 26 );
}
add_action( 'admin_menu', 'nolan_young_template_forms_menu' );

function nolan_young_template_forms_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view submissions.', 'nolan-young-template' ) );
	}
	$form_filter = isset( $_GET['form_type'] ) ? sanitize_key( wp_unslash( $_GET['form_type'] ) ) : '';
	$query = new WP_Query(
		array(
			'post_type' => 'northstar_form',
			'post_status' => 'private',
			'posts_per_page' => 100,
			'meta_key' => $form_filter ? '_form_type' : '',
			'meta_value' => $form_filter,
		)
	);
	?>
	<div class="wrap"><h1><?php esc_html_e( 'Forms', 'nolan-young-template' ); ?></h1>
	<form method="get"><input type="hidden" name="page" value="northstar-forms"><label for="form_type"><?php esc_html_e( 'Filter by type', 'nolan-young-template' ); ?></label> <select id="form_type" name="form_type"><option value=""><?php esc_html_e( 'All', 'nolan-young-template' ); ?></option><option value="contact" <?php selected( $form_filter, 'contact' ); ?>><?php esc_html_e( 'Contact', 'nolan-young-template' ); ?></option><option value="service" <?php selected( $form_filter, 'service' ); ?>><?php esc_html_e( 'Service', 'nolan-young-template' ); ?></option></select> <button class="button"><?php esc_html_e( 'Filter', 'nolan-young-template' ); ?></button></form>
	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"><?php wp_nonce_field( 'northstar_forms_bulk', 'northstar_forms_nonce' ); ?><input type="hidden" name="action" value="northstar_forms_bulk">
	<p><button class="button button-primary" name="bulk_action" value="export"><?php esc_html_e( 'Export selected CSV', 'nolan-young-template' ); ?></button> <button class="button" name="bulk_action" value="email"><?php esc_html_e( 'Email selected summary', 'nolan-young-template' ); ?></button> <button class="button button-link-delete" name="bulk_action" value="delete"><?php esc_html_e( 'Delete selected', 'nolan-young-template' ); ?></button></p>
	<table class="widefat striped"><thead><tr><th><span class="screen-reader-text"><?php esc_html_e( 'Select', 'nolan-young-template' ); ?></span></th><th><?php esc_html_e( 'Date', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Type', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Name', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Email', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Service', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Message', 'nolan-young-template' ); ?></th></tr></thead><tbody>
	<?php foreach ( $query->posts as $post ) : ?>
		<tr><td><input type="checkbox" name="submission_ids[]" value="<?php echo esc_attr( absint( $post->ID ) ); ?>"></td><td><?php echo esc_html( get_the_date( '', $post ) ); ?></td><td><?php echo esc_html( get_post_meta( $post->ID, '_form_type', true ) ); ?></td><td><?php echo esc_html( get_post_meta( $post->ID, '_name', true ) ); ?></td><td><?php echo esc_html( get_post_meta( $post->ID, '_email', true ) ); ?></td><td><?php echo esc_html( get_post_meta( $post->ID, '_service', true ) ); ?></td><td><?php echo esc_html( wp_trim_words( get_post_meta( $post->ID, '_message', true ), 18 ) ); ?></td></tr>
	<?php endforeach; ?>
	</tbody></table></form></div>
	<?php
}

function nolan_young_template_forms_bulk() {
	if ( ! current_user_can( 'manage_options' ) || ! isset( $_POST['northstar_forms_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['northstar_forms_nonce'] ) ), 'northstar_forms_bulk' ) ) {
		wp_die( esc_html__( 'Unauthorized request.', 'nolan-young-template' ) );
	}
	$ids = isset( $_POST['submission_ids'] ) ? array_map( 'absint', (array) wp_unslash( $_POST['submission_ids'] ) ) : array();
	$bulk_action = isset( $_POST['bulk_action'] ) ? sanitize_key( wp_unslash( $_POST['bulk_action'] ) ) : '';
	if ( 'delete' === $bulk_action ) {
		foreach ( $ids as $id ) {
			wp_delete_post( $id, true );
		}
		wp_safe_redirect( admin_url( 'admin.php?page=northstar-forms' ) );
		exit;
	}
	$rows = array( array( 'Date', 'Type', 'Name', 'Email', 'Phone', 'Service', 'Message' ) );
	foreach ( $ids as $id ) {
		$rows[] = array( get_the_date( 'c', $id ), get_post_meta( $id, '_form_type', true ), get_post_meta( $id, '_name', true ), get_post_meta( $id, '_email', true ), get_post_meta( $id, '_phone', true ), get_post_meta( $id, '_service', true ), get_post_meta( $id, '_message', true ) );
	}
	if ( 'email' === $bulk_action ) {
		wp_mail( get_option( 'admin_email' ), __( 'Northstar form export summary', 'nolan-young-template' ), wp_json_encode( $rows ) );
		wp_safe_redirect( admin_url( 'admin.php?page=northstar-forms' ) );
		exit;
	}
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=northstar-form-submissions.csv' );
	$output = fopen( 'php://output', 'w' );
	foreach ( $rows as $row ) {
		fputcsv( $output, $row );
	}
	fclose( $output );
	exit;
}
add_action( 'admin_post_northstar_forms_bulk', 'nolan_young_template_forms_bulk' );
