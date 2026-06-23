<?php
/**
 * Secure contact form handling.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

/** Provides a portable contact form and stores inquiries privately. */
final class NY_Core_Contact_Form {
	/** Constructor. */
	public function __construct() {
		add_shortcode( 'nolan_young_contact_form', array( $this, 'render_shortcode' ) );
		add_action( 'admin_post_ny_core_contact_submit', array( $this, 'handle_submission' ) );
		add_action( 'admin_post_nopriv_ny_core_contact_submit', array( $this, 'handle_submission' ) );
	}

	/**
	 * Render the form.
	 *
	 * @param array<string,mixed> $attributes Shortcode attributes.
	 * @return string
	 */
	public function render_shortcode( $attributes ) {
		$attributes = shortcode_atts(
			array(
				'title' => esc_html__( 'Contact us', 'nolan-young-core' ),
			),
			$attributes,
			'nolan_young_contact_form'
		);

		$title        = sanitize_text_field( $attributes['title'] );
		$status       = isset( $_GET['ny_contact_status'] ) ? sanitize_key( wp_unslash( $_GET['ny_contact_status'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only status display.
		$redirect_url = remove_query_arg( array( 'ny_contact_status', 'ny_newsletter_status' ) );

		ob_start();
		include NY_CORE_PATH . 'templates/contact-form.php';
		return (string) ob_get_clean();
	}

	/** Process a contact form submission. @return void */
	public function handle_submission() {
		$nonce = isset( $_POST['ny_core_contact_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['ny_core_contact_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'ny_core_contact_submit' ) ) {
			$this->redirect_with_status( 'invalid_request' );
		}

		$honeypot = isset( $_POST['ny_core_company_website'] ) ? trim( (string) wp_unslash( $_POST['ny_core_company_website'] ) ) : '';
		if ( '' !== $honeypot || $this->is_rate_limited() ) {
			$this->redirect_with_status( 'received' );
		}

		$name    = isset( $_POST['ny_core_name'] ) ? sanitize_text_field( wp_unslash( $_POST['ny_core_name'] ) ) : '';
		$email   = isset( $_POST['ny_core_email'] ) ? sanitize_email( wp_unslash( $_POST['ny_core_email'] ) ) : '';
		$phone   = isset( $_POST['ny_core_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['ny_core_phone'] ) ) : '';
		$subject = isset( $_POST['ny_core_subject'] ) ? sanitize_text_field( wp_unslash( $_POST['ny_core_subject'] ) ) : '';
		$message = isset( $_POST['ny_core_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['ny_core_message'] ) ) : '';
		$consent = isset( $_POST['ny_core_consent'] ) && '1' === sanitize_text_field( wp_unslash( $_POST['ny_core_consent'] ) );

		if ( '' === $name || ! is_email( $email ) || '' === $message || ! $consent ) {
			$this->redirect_with_status( 'validation_error' );
		}

		$inquiry_id = wp_insert_post(
			array(
				'post_type'   => 'ny_inquiry',
				'post_status' => 'publish',
				'post_title'  => sprintf(
					/* translators: 1: Contact name, 2: Submission date. */
					__( '%1$s — %2$s', 'nolan-young-core' ),
					$name,
					current_time( 'mysql' )
				),
			),
			true
		);

		if ( is_wp_error( $inquiry_id ) ) {
			$this->redirect_with_status( 'storage_error' );
		}

		$fields = array(
			'_ny_core_name'       => $name,
			'_ny_core_email'      => $email,
			'_ny_core_phone'      => $phone,
			'_ny_core_subject'    => $subject,
			'_ny_core_message'    => $message,
			'_ny_core_consent'    => '1',
			'_ny_core_submitted'  => current_time( 'mysql', true ),
			'_ny_core_source_url' => esc_url_raw( wp_get_referer() ),
		);
		foreach ( $fields as $meta_key => $meta_value ) {
			update_post_meta( $inquiry_id, $meta_key, $meta_value );
		}

		$site_name     = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES );
		$email_subject = '' !== $subject
			? sprintf( '[%1$s] %2$s', $site_name, $subject )
			: sprintf( '[%s] New website inquiry', $site_name );
		$email_body    = $this->format_notification_body( $name, $email, $phone, $message );
		$headers       = array( 'Reply-To: ' . $name . ' <' . $email . '>' );
		$mail_sent     = wp_mail( get_option( 'admin_email' ), $email_subject, $email_body, $headers );
		update_post_meta( $inquiry_id, '_ny_core_mail_sent', $mail_sent ? '1' : '0' );

		do_action( 'ny_core_contact_submitted', $inquiry_id, $fields );
		$this->redirect_with_status( 'received' );
	}

	/**
	 * Build the plain-text administrator notification body.
	 *
	 * Concatenation is used instead of a double-quoted sprintf() format string
	 * so PHP cannot interpret positional placeholders such as %1$s as variable
	 * interpolation before the formatter runs.
	 *
	 * @param string $name    Contact name.
	 * @param string $email   Contact email address.
	 * @param string $phone   Contact phone number.
	 * @param string $message Contact message.
	 * @return string
	 */
	private function format_notification_body( $name, $email, $phone, $message ) {
		return implode(
			"\n",
			array(
				'Name: ' . $name,
				'Email: ' . $email,
				'Phone: ' . $phone,
				'',
				'Message:',
				$message,
			)
		);
	}

	/**
	 * Apply a short submission throttle without retaining a raw IP address.
	 *
	 * @return bool
	 */
	private function is_rate_limited() {
		$remote_address = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
		$key            = 'ny_core_contact_' . hash_hmac( 'sha256', $remote_address, wp_salt( 'nonce' ) );
		if ( get_transient( $key ) ) {
			return true;
		}
		set_transient( $key, 1, MINUTE_IN_SECONDS );
		return false;
	}

	/**
	 * Redirect to an approved local URL with a status code.
	 *
	 * @param string $status Status key.
	 * @return void
	 */
	private function redirect_with_status( $status ) {
		$requested = isset( $_POST['ny_core_redirect_to'] ) ? esc_url_raw( wp_unslash( $_POST['ny_core_redirect_to'] ) ) : '';
		$fallback  = home_url( '/' );
		$target    = wp_validate_redirect( $requested, $fallback );
		wp_safe_redirect( add_query_arg( 'ny_contact_status', sanitize_key( $status ), $target ) . '#ny-core-contact-form' );
		exit;
	}
}
