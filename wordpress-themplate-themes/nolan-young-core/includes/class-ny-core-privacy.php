<?php
/**
 * WordPress privacy-tool integration.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

/** Registers policy guidance and personal-data exporter/eraser callbacks. */
final class NY_Core_Privacy {
	/** Constructor. */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'add_policy_content' ) );
		add_filter( 'wp_privacy_personal_data_exporters', array( $this, 'register_exporters' ) );
		add_filter( 'wp_privacy_personal_data_erasers', array( $this, 'register_erasers' ) );
	}

	/** @return void */
	public function add_policy_content() {
		if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
			return;
		}
		$content = '<p>' . esc_html__( 'When visitors submit the contact or newsletter forms, the site stores the submitted contact details, message, consent record, submission time, and source URL in private administrator-only records. This data is used to respond to inquiries or manage requested email updates. Site administrators can export or erase records associated with an email address through WordPress privacy tools.', 'nolan-young-core' ) . '</p>';
		wp_add_privacy_policy_content( esc_html__( 'Nolan Young Core', 'nolan-young-core' ), wp_kses_post( wpautop( $content, false ) ) );
	}

	/** @param array<string,array<string,mixed>> $exporters Exporters. @return array<string,array<string,mixed>> */
	public function register_exporters( $exporters ) {
		$exporters['nolan-young-core'] = array(
			'exporter_friendly_name' => esc_html__( 'Nolan Young Core submissions', 'nolan-young-core' ),
			'callback'               => array( $this, 'export_personal_data' ),
		);
		return $exporters;
	}

	/** @param array<string,array<string,mixed>> $erasers Erasers. @return array<string,array<string,mixed>> */
	public function register_erasers( $erasers ) {
		$erasers['nolan-young-core'] = array(
			'eraser_friendly_name' => esc_html__( 'Nolan Young Core submissions', 'nolan-young-core' ),
			'callback'             => array( $this, 'erase_personal_data' ),
		);
		return $erasers;
	}

	/** @param string $email_address Email. @param int $page Page. @return array<string,mixed> */
	public function export_personal_data( $email_address, $page = 1 ) {
		unset( $page );
		$data = array();
		foreach ( $this->find_records( $email_address ) as $post_id ) {
			$post_type = get_post_type( $post_id );
			if ( 'ny_inquiry' === $post_type ) {
				$data[] = array(
					'group_id'    => 'ny-core-inquiries',
					'group_label' => esc_html__( 'Website inquiries', 'nolan-young-core' ),
					'item_id'     => 'ny-inquiry-' . $post_id,
					'data'        => array(
						array( 'name' => esc_html__( 'Name', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_name', true ) ),
						array( 'name' => esc_html__( 'Email', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_email', true ) ),
						array( 'name' => esc_html__( 'Phone', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_phone', true ) ),
						array( 'name' => esc_html__( 'Subject', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_subject', true ) ),
						array( 'name' => esc_html__( 'Message', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_message', true ) ),
						array( 'name' => esc_html__( 'Submitted', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_submitted', true ) ),
					),
				);
			} else {
				$data[] = array(
					'group_id'    => 'ny-core-newsletter',
					'group_label' => esc_html__( 'Newsletter subscriptions', 'nolan-young-core' ),
					'item_id'     => 'ny-subscriber-' . $post_id,
					'data'        => array(
						array( 'name' => esc_html__( 'Email', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_email', true ) ),
						array( 'name' => esc_html__( 'Subscribed', 'nolan-young-core' ), 'value' => get_post_meta( $post_id, '_ny_core_subscribed', true ) ),
					),
				);
			}
		}
		return array( 'data' => $data, 'done' => true );
	}

	/** @param string $email_address Email. @param int $page Page. @return array<string,mixed> */
	public function erase_personal_data( $email_address, $page = 1 ) {
		unset( $page );
		$removed = false;
		foreach ( $this->find_records( $email_address ) as $post_id ) {
			if ( wp_delete_post( $post_id, true ) ) {
				$removed = true;
			}
		}
		return array(
			'items_removed'  => $removed,
			'items_retained' => false,
			'messages'       => array(),
			'done'           => true,
		);
	}

	/** @param string $email_address Email. @return int[] */
	private function find_records( $email_address ) {
		return get_posts(
			array(
				'post_type'      => array( 'ny_inquiry', 'ny_subscriber' ),
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => '_ny_core_email', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Privacy lookup is explicitly email-based.
				'meta_value'     => sanitize_email( $email_address ), // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- Privacy lookup is explicitly email-based.
			)
		);
	}
}
