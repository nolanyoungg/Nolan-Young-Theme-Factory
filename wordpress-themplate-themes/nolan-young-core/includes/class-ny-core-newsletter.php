<?php
/**
 * Newsletter signup handling.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

/** Provides consent-aware local newsletter signups and an integration hook. */
final class NY_Core_Newsletter {
	/** Constructor. */
	public function __construct() {
		add_shortcode( 'nolan_young_newsletter_form', array( $this, 'render_shortcode' ) );
		add_action( 'admin_post_ny_core_newsletter_submit', array( $this, 'handle_submission' ) );
		add_action( 'admin_post_nopriv_ny_core_newsletter_submit', array( $this, 'handle_submission' ) );
	}

	/** @param array<string,mixed> $attributes Attributes. @return string */
	public function render_shortcode( $attributes ) {
		$attributes = shortcode_atts( array( 'title' => esc_html__( 'Join the newsletter', 'nolan-young-core' ) ), $attributes, 'nolan_young_newsletter_form' );
		$title = sanitize_text_field( $attributes['title'] );
		$status = isset( $_GET['ny_newsletter_status'] ) ? sanitize_key( wp_unslash( $_GET['ny_newsletter_status'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only status display.
		$redirect_url = remove_query_arg( array( 'ny_contact_status', 'ny_newsletter_status' ) );
		ob_start();
		include NY_CORE_PATH . 'templates/newsletter-form.php';
		return (string) ob_get_clean();
	}

	/** @return void */
	public function handle_submission() {
		$nonce = isset( $_POST['ny_core_newsletter_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['ny_core_newsletter_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'ny_core_newsletter_submit' ) ) {
			$this->redirect_with_status( 'invalid_request' );
		}
		if ( ! empty( $_POST['ny_core_fax_number'] ) ) {
			$this->redirect_with_status( 'subscribed' );
		}

		$email   = isset( $_POST['ny_core_newsletter_email'] ) ? sanitize_email( wp_unslash( $_POST['ny_core_newsletter_email'] ) ) : '';
		$consent = isset( $_POST['ny_core_newsletter_consent'] ) && '1' === sanitize_text_field( wp_unslash( $_POST['ny_core_newsletter_consent'] ) );
		if ( ! is_email( $email ) || ! $consent ) {
			$this->redirect_with_status( 'validation_error' );
		}

		$existing = get_posts(
			array(
				'post_type'      => 'ny_subscriber',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'meta_key'       => '_ny_core_email', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Narrow private record lookup.
				'meta_value'     => $email, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- Narrow private record lookup.
			)
		);
		if ( $existing ) {
			$this->redirect_with_status( 'subscribed' );
		}

		$subscriber_id = wp_insert_post(
			array(
				'post_type'   => 'ny_subscriber',
				'post_status' => 'publish',
				'post_title'  => $email,
			),
			true
		);
		if ( is_wp_error( $subscriber_id ) ) {
			$this->redirect_with_status( 'storage_error' );
		}

		update_post_meta( $subscriber_id, '_ny_core_email', $email );
		update_post_meta( $subscriber_id, '_ny_core_consent', '1' );
		update_post_meta( $subscriber_id, '_ny_core_subscribed', current_time( 'mysql', true ) );
		do_action( 'ny_core_newsletter_subscribed', $subscriber_id, $email );
		$this->redirect_with_status( 'subscribed' );
	}

	/** @param string $status Status. @return void */
	private function redirect_with_status( $status ) {
		$requested = isset( $_POST['ny_core_redirect_to'] ) ? esc_url_raw( wp_unslash( $_POST['ny_core_redirect_to'] ) ) : '';
		$target = wp_validate_redirect( $requested, home_url( '/' ) );
		wp_safe_redirect( add_query_arg( 'ny_newsletter_status', sanitize_key( $status ), $target ) . '#ny-core-newsletter-form' );
		exit;
	}
}
