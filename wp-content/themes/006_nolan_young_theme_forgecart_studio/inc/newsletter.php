<?php
/**
 * Newsletter signup management.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_register_newsletter_cpt() {
	register_post_type(
		'forgecart_subscriber',
		array(
			'labels'              => array( 'name' => __( 'Newsletter', 'nolan-young-template' ), 'singular_name' => __( 'Subscriber', 'nolan-young-template' ) ),
			'public'              => false,
			'show_ui'             => false,
			'exclude_from_search' => true,
			'show_in_rest'        => false,
			'supports'            => array( 'title' ),
		)
	);
}
add_action( 'init', 'nolan_young_template_register_newsletter_cpt' );

function nolan_young_template_newsletter_signup() {
	if ( ! isset( $_POST['nolan_young_template_newsletter_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nolan_young_template_newsletter_nonce'] ) ), 'nolan_young_template_newsletter' ) ) {
		wp_die( esc_html__( 'Newsletter security check failed.', 'nolan-young-template' ), 403 );
	}
	if ( ! empty( $_POST['website'] ) ) {
		wp_safe_redirect( wp_get_referer() ? wp_get_referer() : home_url( '/' ) );
		exit;
	}
	$email = isset( $_POST['email'] ) ? sanitize_email( strtolower( wp_unslash( $_POST['email'] ) ) ) : '';
	$name  = isset( $_POST['first_name'] ) ? sanitize_text_field( wp_unslash( $_POST['first_name'] ) ) : '';
	if ( ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'newsletter', 'invalid', wp_get_referer() ? wp_get_referer() : home_url( '/' ) ) );
		exit;
	}
	$existing = get_posts( array( 'post_type' => 'forgecart_subscriber', 'post_status' => 'private', 'numberposts' => 1, 'meta_key' => '_email', 'meta_value' => $email ) );
	$unsubscribe_hash = wp_generate_password( 32, false, false );
	if ( $existing ) {
		update_post_meta( $existing[0]->ID, '_status', 'Active' );
		update_post_meta( $existing[0]->ID, '_unsubscribed_at', '' );
	} else {
		wp_insert_post( array( 'post_type' => 'forgecart_subscriber', 'post_status' => 'private', 'post_title' => $email, 'meta_input' => array( '_email' => $email, '_first_name' => $name, '_status' => 'Active', '_token' => $unsubscribe_hash ) ) );
	}
	wp_safe_redirect( add_query_arg( 'newsletter', 'success', wp_get_referer() ? wp_get_referer() : home_url( '/' ) ) );
	exit;
}
add_action( 'admin_post_nopriv_nolan_young_template_newsletter_signup', 'nolan_young_template_newsletter_signup' );
add_action( 'admin_post_nolan_young_template_newsletter_signup', 'nolan_young_template_newsletter_signup' );

function nolan_young_template_newsletter_menu() {
	add_menu_page( __( 'Newsletter', 'nolan-young-template' ), __( 'Newsletter', 'nolan-young-template' ), 'manage_options', 'forgecart-newsletter', 'nolan_young_template_newsletter_page', 'dashicons-email-alt2', 59 );
}
add_action( 'admin_menu', 'nolan_young_template_newsletter_menu' );

function nolan_young_template_newsletter_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Not allowed.', 'nolan-young-template' ) );
	}
	if ( isset( $_GET['export'] ) && check_admin_referer( 'forgecart_newsletter_export' ) ) {
		nolan_young_template_export_newsletter();
	}
	$subscribers = get_posts( array( 'post_type' => 'forgecart_subscriber', 'post_status' => 'private', 'numberposts' => 100 ) );
	echo '<div class="wrap"><h1>' . esc_html__( 'Newsletter', 'nolan-young-template' ) . '</h1><p><a class="button button-primary" href="' . esc_url( wp_nonce_url( admin_url( 'admin.php?page=forgecart-newsletter&export=1' ), 'forgecart_newsletter_export' ) ) . '">' . esc_html__( 'Export CSV', 'nolan-young-template' ) . '</a></p><table class="widefat striped"><thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Signup date</th><th>Unsubscribed</th></tr></thead><tbody>';
	foreach ( $subscribers as $subscriber ) {
		echo '<tr><td>' . esc_html( get_post_meta( $subscriber->ID, '_email', true ) ) . '</td><td>' . esc_html( get_post_meta( $subscriber->ID, '_first_name', true ) ) . '</td><td>' . esc_html( get_post_meta( $subscriber->ID, '_status', true ) ) . '</td><td>' . esc_html( get_the_date( '', $subscriber ) ) . '</td><td>' . esc_html( get_post_meta( $subscriber->ID, '_unsubscribed_at', true ) ) . '</td></tr>';
	}
	echo '</tbody></table></div>';
}

function nolan_young_template_export_newsletter() {
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=forgecart-newsletter-subscribers.csv' );
	$output = fopen( 'php://output', 'w' );
	fputcsv( $output, array( 'Email', 'First name', 'Status', 'Signup date', 'Unsubscribed at' ) );
	foreach ( get_posts( array( 'post_type' => 'forgecart_subscriber', 'post_status' => 'private', 'numberposts' => -1 ) ) as $subscriber ) {
		fputcsv( $output, array( get_post_meta( $subscriber->ID, '_email', true ), get_post_meta( $subscriber->ID, '_first_name', true ), get_post_meta( $subscriber->ID, '_status', true ), get_the_date( 'c', $subscriber ), get_post_meta( $subscriber->ID, '_unsubscribed_at', true ) ) );
	}
	exit;
}

