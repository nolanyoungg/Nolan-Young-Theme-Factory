<?php
/**
 * Newsletter subscriber management.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_register_newsletter_cpt() {
	register_post_type(
		'northstar_subscriber',
		array(
			'labels' => array( 'name' => __( 'Newsletter Subscribers', 'nolan-young-template' ) ),
			'public' => false,
			'show_ui' => false,
			'show_in_rest' => false,
			'exclude_from_search' => true,
			'publicly_queryable' => false,
			'supports' => array( 'title' ),
		)
	);
}
add_action( 'init', 'nolan_young_template_register_newsletter_cpt' );

function nolan_young_template_render_newsletter_form() {
	$status = isset( $_GET['northstar_newsletter_status'] ) ? sanitize_key( wp_unslash( $_GET['northstar_newsletter_status'] ) ) : '';
	ob_start();
	?>
	<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-validate-form>
		<?php if ( 'success' === $status ) : ?><div class="form-notice form-notice--success" role="status"><?php esc_html_e( 'You are subscribed.', 'nolan-young-template' ); ?></div><?php endif; ?>
		<?php if ( 'error' === $status ) : ?><div class="form-notice form-notice--error" role="alert"><?php esc_html_e( 'Enter a valid email address.', 'nolan-young-template' ); ?></div><?php endif; ?>
		<input type="hidden" name="action" value="northstar_newsletter_signup">
		<?php wp_nonce_field( 'northstar_newsletter_signup', 'northstar_newsletter_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label for="newsletter-company"><?php esc_html_e( 'Company', 'nolan-young-template' ); ?></label><input id="newsletter-company" type="text" name="company_name" tabindex="-1" autocomplete="off"></div>
		<label><?php esc_html_e( 'First name', 'nolan-young-template' ); ?><input type="text" name="first_name" autocomplete="given-name"></label>
		<label><?php esc_html_e( 'Email', 'nolan-young-template' ); ?><input required type="email" name="email" autocomplete="email"></label>
		<button class="btn btn-secondary btn-small" type="submit"><?php esc_html_e( 'Subscribe', 'nolan-young-template' ); ?></button>
	</form>
	<?php
	return ob_get_clean();
}

function nolan_young_template_newsletter_rate_limited( $email ) {
	$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key = 'northstar_newsletter_' . md5( strtolower( $email ) . '|' . $ip );
	if ( get_transient( $key ) ) {
		return true;
	}
	set_transient( $key, 1, MINUTE_IN_SECONDS );
	return false;
}

function nolan_young_template_find_subscriber( $email ) {
	$query = new WP_Query(
		array(
			'post_type' => 'northstar_subscriber',
			'post_status' => 'private',
			'posts_per_page' => 1,
			'meta_key' => '_email',
			'meta_value' => strtolower( $email ),
		)
	);
	return $query->have_posts() ? $query->posts[0]->ID : 0;
}

function nolan_young_template_handle_newsletter_signup() {
	$referer = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	if ( ! isset( $_POST['northstar_newsletter_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['northstar_newsletter_nonce'] ) ), 'northstar_newsletter_signup' ) ) {
		wp_safe_redirect( add_query_arg( 'northstar_newsletter_status', 'error', $referer ) );
		exit;
	}
	$honeypot = isset( $_POST['company_name'] ) ? sanitize_text_field( wp_unslash( $_POST['company_name'] ) ) : '';
	$email = isset( $_POST['email'] ) ? strtolower( sanitize_email( wp_unslash( $_POST['email'] ) ) ) : '';
	$first_name = isset( $_POST['first_name'] ) ? sanitize_text_field( wp_unslash( $_POST['first_name'] ) ) : '';
	if ( '' !== $honeypot || nolan_young_template_newsletter_rate_limited( $email ) ) {
		wp_safe_redirect( add_query_arg( 'northstar_newsletter_status', 'success', $referer ) );
		exit;
	}
	if ( ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'northstar_newsletter_status', 'error', $referer ) );
		exit;
	}
	$existing_id = nolan_young_template_find_subscriber( $email );
	$post_id = $existing_id ? $existing_id : wp_insert_post( array( 'post_type' => 'northstar_subscriber', 'post_status' => 'private', 'post_title' => $email ), true );
	if ( ! is_wp_error( $post_id ) ) {
		update_post_meta( $post_id, '_email', $email );
		update_post_meta( $post_id, '_first_name', $first_name );
		update_post_meta( $post_id, '_status', 'Active' );
		update_post_meta( $post_id, '_unsubscribe_key', wp_generate_password( 32, false, false ) );
		delete_post_meta( $post_id, '_unsubscribed_at' );
	}
	wp_safe_redirect( add_query_arg( 'northstar_newsletter_status', 'success', $referer ) );
	exit;
}
add_action( 'admin_post_nopriv_northstar_newsletter_signup', 'nolan_young_template_handle_newsletter_signup' );
add_action( 'admin_post_northstar_newsletter_signup', 'nolan_young_template_handle_newsletter_signup' );

function nolan_young_template_handle_unsubscribe() {
	$unsubscribe_key = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	$query = new WP_Query( array( 'post_type' => 'northstar_subscriber', 'post_status' => 'private', 'posts_per_page' => 1, 'meta_key' => '_unsubscribe_key', 'meta_value' => $unsubscribe_key ) );
	if ( $unsubscribe_key && $query->have_posts() ) {
		$id = $query->posts[0]->ID;
		update_post_meta( $id, '_status', 'Unsubscribed' );
		update_post_meta( $id, '_unsubscribed_at', current_time( 'mysql' ) );
	}
	wp_safe_redirect( home_url( '/' ) );
	exit;
}
add_action( 'admin_post_nopriv_northstar_newsletter_unsubscribe', 'nolan_young_template_handle_unsubscribe' );
add_action( 'admin_post_northstar_newsletter_unsubscribe', 'nolan_young_template_handle_unsubscribe' );

function nolan_young_template_newsletter_menu() {
	add_menu_page( __( 'Newsletter', 'nolan-young-template' ), __( 'Newsletter', 'nolan-young-template' ), 'manage_options', 'northstar-newsletter', 'nolan_young_template_newsletter_admin_page', 'dashicons-email-alt2', 27 );
}
add_action( 'admin_menu', 'nolan_young_template_newsletter_menu' );

function nolan_young_template_newsletter_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view subscribers.', 'nolan-young-template' ) );
	}
	$status = isset( $_GET['status'] ) ? sanitize_text_field( wp_unslash( $_GET['status'] ) ) : '';
	$args = array( 'post_type' => 'northstar_subscriber', 'post_status' => 'private', 'posts_per_page' => 100 );
	if ( $status ) {
		$args['meta_key'] = '_status';
		$args['meta_value'] = $status;
	}
	$query = new WP_Query( $args );
	?>
	<div class="wrap"><h1><?php esc_html_e( 'Newsletter', 'nolan-young-template' ); ?></h1>
	<form method="get"><input type="hidden" name="page" value="northstar-newsletter"><label for="status"><?php esc_html_e( 'Filter by status', 'nolan-young-template' ); ?></label> <select id="status" name="status"><option value=""><?php esc_html_e( 'All', 'nolan-young-template' ); ?></option><option value="Active" <?php selected( $status, 'Active' ); ?>><?php esc_html_e( 'Active', 'nolan-young-template' ); ?></option><option value="Unsubscribed" <?php selected( $status, 'Unsubscribed' ); ?>><?php esc_html_e( 'Unsubscribed', 'nolan-young-template' ); ?></option></select> <button class="button"><?php esc_html_e( 'Filter', 'nolan-young-template' ); ?></button></form>
	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"><?php wp_nonce_field( 'northstar_newsletter_bulk', 'northstar_newsletter_bulk_nonce' ); ?><input type="hidden" name="action" value="northstar_newsletter_bulk"><p><button class="button button-primary" name="bulk_action" value="export"><?php esc_html_e( 'Export selected CSV', 'nolan-young-template' ); ?></button> <button class="button" name="bulk_action" value="email"><?php esc_html_e( 'Email selected summary', 'nolan-young-template' ); ?></button></p>
	<table class="widefat striped"><thead><tr><th><span class="screen-reader-text"><?php esc_html_e( 'Select', 'nolan-young-template' ); ?></span></th><th><?php esc_html_e( 'Email', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Name', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Signup date', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Status', 'nolan-young-template' ); ?></th><th><?php esc_html_e( 'Unsubscribe date', 'nolan-young-template' ); ?></th></tr></thead><tbody>
	<?php foreach ( $query->posts as $post ) : ?>
		<tr><td><input type="checkbox" name="subscriber_ids[]" value="<?php echo esc_attr( absint( $post->ID ) ); ?>"></td><td><?php echo esc_html( get_post_meta( $post->ID, '_email', true ) ); ?></td><td><?php echo esc_html( get_post_meta( $post->ID, '_first_name', true ) ); ?></td><td><?php echo esc_html( get_the_date( '', $post ) ); ?></td><td><?php echo esc_html( get_post_meta( $post->ID, '_status', true ) ); ?></td><td><?php echo esc_html( get_post_meta( $post->ID, '_unsubscribed_at', true ) ); ?></td></tr>
	<?php endforeach; ?>
	</tbody></table></form></div>
	<?php
}

function nolan_young_template_newsletter_bulk() {
	if ( ! current_user_can( 'manage_options' ) || ! isset( $_POST['northstar_newsletter_bulk_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['northstar_newsletter_bulk_nonce'] ) ), 'northstar_newsletter_bulk' ) ) {
		wp_die( esc_html__( 'Unauthorized request.', 'nolan-young-template' ) );
	}
	$ids = isset( $_POST['subscriber_ids'] ) ? array_map( 'absint', (array) wp_unslash( $_POST['subscriber_ids'] ) ) : array();
	$rows = array( array( 'Email', 'Name', 'Signup Date', 'Status', 'Unsubscribe Date' ) );
	foreach ( $ids as $id ) {
		$rows[] = array( get_post_meta( $id, '_email', true ), get_post_meta( $id, '_first_name', true ), get_the_date( 'c', $id ), get_post_meta( $id, '_status', true ), get_post_meta( $id, '_unsubscribed_at', true ) );
	}
	$bulk_action = isset( $_POST['bulk_action'] ) ? sanitize_key( wp_unslash( $_POST['bulk_action'] ) ) : '';
	if ( 'email' === $bulk_action ) {
		wp_mail( get_option( 'admin_email' ), __( 'Northstar newsletter export summary', 'nolan-young-template' ), wp_json_encode( $rows ) );
		wp_safe_redirect( admin_url( 'admin.php?page=northstar-newsletter' ) );
		exit;
	}
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=northstar-newsletter-subscribers.csv' );
	$output = fopen( 'php://output', 'w' );
	foreach ( $rows as $row ) {
		fputcsv( $output, $row );
	}
	fclose( $output );
	exit;
}
add_action( 'admin_post_northstar_newsletter_bulk', 'nolan_young_template_newsletter_bulk' );
