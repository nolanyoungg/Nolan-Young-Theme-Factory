<?php
/**
 * Newsletter handling.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Normalize an email address for storage.
 *
 * @param string $email Raw email.
 * @return string
 */
function nolan_young_theme_normalize_newsletter_email( $email ) {
	$email = sanitize_email( wp_unslash( $email ) );
	return $email ? strtolower( $email ) : '';
}

/**
 * Find an existing newsletter subscriber by email.
 *
 * @param string $email Normalized email.
 * @return WP_Post|null
 */
function nolan_young_theme_get_newsletter_subscriber_by_email( $email ) {
	$posts = get_posts(
		array(
			'post_type'      => 'newsletter_subscriber',
			'post_status'    => array( 'publish', 'draft', 'private' ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'   => '_newsletter_email',
					'value' => $email,
				),
			),
		)
	);

	if ( empty( $posts ) ) {
		return null;
	}

	return get_post( $posts[0] );
}

/**
 * Generate a public unsubscribe token.
 *
 * @return string
 */
function nolan_young_theme_generate_newsletter_token() {
	return wp_generate_password( 32, false, false );
}

/**
 * Build an unsubscribe URL for a subscriber.
 *
 * @param int $subscriber_id Subscriber post ID.
 * @return string
 */
function nolan_young_theme_get_newsletter_unsubscribe_url( $subscriber_id ) {
	$token = get_post_meta( $subscriber_id, '_newsletter_unsubscribe_token', true );
	if ( empty( $token ) ) {
		$token = nolan_young_theme_generate_newsletter_token();
		update_post_meta( $subscriber_id, '_newsletter_unsubscribe_token', $token );
	}

	return add_query_arg(
		array(
			'nl_unsubscribe' => 1,
			'token'          => rawurlencode( $token ),
		),
		home_url( '/' )
	);
}

/**
 * Handle newsletter signups.
 */
function nolan_young_theme_process_newsletter_signup() {
	if ( empty( $_POST['newsletter_signup_submit'] ) ) {
		return;
	}

	if ( empty( $_POST['newsletter-signup-nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['newsletter-signup-nonce'] ) ), 'newsletter_signup_nonce' ) ) {
		wp_die( esc_html__( 'Security check failed.', 'nolan-young-template' ) );
	}

	$honeypot = isset( $_POST['newsletter_company'] ) ? sanitize_text_field( wp_unslash( $_POST['newsletter_company'] ) ) : '';
	if ( '' !== $honeypot ) {
		wp_die( esc_html__( 'Spam detected.', 'nolan-young-template' ) );
	}

	$email = nolan_young_theme_normalize_newsletter_email( $_POST['email'] ?? '' );
	$first_name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';

	if ( ! is_email( $email ) ) {
		wp_die( esc_html__( 'Please enter a valid email address.', 'nolan-young-template' ) );
	}

	$existing = nolan_young_theme_get_newsletter_subscriber_by_email( $email );
	if ( $existing ) {
		$status = get_post_meta( $existing->ID, '_newsletter_status', true );
		if ( 'unsubscribed' === $status ) {
			update_post_meta( $existing->ID, '_newsletter_status', 'active' );
			delete_post_meta( $existing->ID, '_newsletter_unsubscribed_at' );
		}
		update_post_meta( $existing->ID, '_newsletter_first_name', $first_name );
		update_post_meta( $existing->ID, '_newsletter_signed_up_at', current_time( 'mysql' ) );
		nolan_young_theme_get_newsletter_unsubscribe_url( $existing->ID );
		wp_safe_redirect( add_query_arg( 'newsletter', 'success', wp_get_referer() ? wp_get_referer() : home_url( '/' ) ) );
		exit;
	}

	$subscriber_id = wp_insert_post(
		array(
			'post_type'   => 'newsletter_subscriber',
			'post_status' => 'publish',
			'post_title'  => $email,
			'post_name'   => sanitize_title( str_replace( '@', '-', $email ) ),
		),
		true
	);

	if ( is_wp_error( $subscriber_id ) ) {
		wp_die( esc_html( $subscriber_id->get_error_message() ) );
	}

	update_post_meta( $subscriber_id, '_newsletter_email', $email );
	update_post_meta( $subscriber_id, '_newsletter_first_name', $first_name );
	update_post_meta( $subscriber_id, '_newsletter_status', 'active' );
	update_post_meta( $subscriber_id, '_newsletter_signed_up_at', current_time( 'mysql' ) );
	update_post_meta( $subscriber_id, '_newsletter_unsubscribe_token', nolan_young_theme_generate_newsletter_token() );

	wp_safe_redirect( add_query_arg( 'newsletter', 'success', wp_get_referer() ? wp_get_referer() : home_url( '/' ) ) );
	exit;
}
add_action( 'init', 'nolan_young_theme_process_newsletter_signup' );

/**
 * Handle unsubscribe requests.
 */
function nolan_young_theme_process_newsletter_unsubscribe() {
	if ( empty( $_GET['nl_unsubscribe'] ) || empty( $_GET['token'] ) ) {
		return;
	}

	$token = sanitize_text_field( wp_unslash( $_GET['token'] ) );

	$matches = get_posts(
		array(
			'post_type'      => 'newsletter_subscriber',
			'post_status'    => array( 'publish', 'draft', 'private' ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'   => '_newsletter_unsubscribe_token',
					'value' => $token,
				),
			),
		)
	);

	if ( empty( $matches ) ) {
		wp_die( esc_html__( 'Invalid unsubscribe link.', 'nolan-young-template' ) );
	}

	$subscriber_id = (int) $matches[0];
	update_post_meta( $subscriber_id, '_newsletter_status', 'unsubscribed' );
	update_post_meta( $subscriber_id, '_newsletter_unsubscribed_at', current_time( 'mysql' ) );

	wp_safe_redirect( add_query_arg( 'newsletter', 'unsubscribed', home_url( '/' ) ) );
	exit;
}
add_action( 'init', 'nolan_young_theme_process_newsletter_unsubscribe' );
