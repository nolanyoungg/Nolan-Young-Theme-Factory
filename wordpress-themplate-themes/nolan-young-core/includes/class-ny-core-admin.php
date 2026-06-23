<?php
/**
 * Administrator record presentation.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

/** Improves the private-record administration screens. */
final class NY_Core_Admin {
	/** Constructor. */
	public function __construct() {
		add_filter( 'manage_ny_inquiry_posts_columns', array( $this, 'inquiry_columns' ) );
		add_action( 'manage_ny_inquiry_posts_custom_column', array( $this, 'render_inquiry_column' ), 10, 2 );
		add_filter( 'manage_ny_subscriber_posts_columns', array( $this, 'subscriber_columns' ) );
		add_action( 'manage_ny_subscriber_posts_custom_column', array( $this, 'render_subscriber_column' ), 10, 2 );
		add_action( 'add_meta_boxes', array( $this, 'add_record_meta_boxes' ) );
	}

	/** @param array<string,string> $columns Columns. @return array<string,string> */
	public function inquiry_columns( $columns ) {
		return array(
			'cb'      => $columns['cb'],
			'title'   => esc_html__( 'Submission', 'nolan-young-core' ),
			'email'   => esc_html__( 'Email', 'nolan-young-core' ),
			'subject' => esc_html__( 'Subject', 'nolan-young-core' ),
			'date'    => esc_html__( 'Date', 'nolan-young-core' ),
		);
	}

	/** @param string $column Column key. @param int $post_id Post ID. @return void */
	public function render_inquiry_column( $column, $post_id ) {
		if ( 'email' === $column ) {
			echo esc_html( get_post_meta( $post_id, '_ny_core_email', true ) );
		} elseif ( 'subject' === $column ) {
			echo esc_html( get_post_meta( $post_id, '_ny_core_subject', true ) );
		}
	}

	/** @param array<string,string> $columns Columns. @return array<string,string> */
	public function subscriber_columns( $columns ) {
		return array(
			'cb'    => $columns['cb'],
			'title' => esc_html__( 'Email', 'nolan-young-core' ),
			'date'  => esc_html__( 'Date', 'nolan-young-core' ),
		);
	}

	/** @param string $column Column key. @param int $post_id Post ID. @return void */
	public function render_subscriber_column( $column, $post_id ) {
		if ( 'email' === $column ) {
			echo esc_html( get_post_meta( $post_id, '_ny_core_email', true ) );
		}
	}

	/** @return void */
	public function add_record_meta_boxes() {
		add_meta_box( 'ny-core-inquiry-details', esc_html__( 'Inquiry Details', 'nolan-young-core' ), array( $this, 'render_inquiry_details' ), 'ny_inquiry', 'normal', 'high' );
		add_meta_box( 'ny-core-subscriber-details', esc_html__( 'Subscriber Details', 'nolan-young-core' ), array( $this, 'render_subscriber_details' ), 'ny_subscriber', 'normal', 'high' );
	}

	/** @param WP_Post $post Post. @return void */
	public function render_inquiry_details( $post ) {
		$fields = array(
			esc_html__( 'Name', 'nolan-young-core' )       => '_ny_core_name',
			esc_html__( 'Email', 'nolan-young-core' )      => '_ny_core_email',
			esc_html__( 'Phone', 'nolan-young-core' )      => '_ny_core_phone',
			esc_html__( 'Subject', 'nolan-young-core' )    => '_ny_core_subject',
			esc_html__( 'Submitted', 'nolan-young-core' )  => '_ny_core_submitted',
			esc_html__( 'Source URL', 'nolan-young-core' ) => '_ny_core_source_url',
		);
		echo '<table class="widefat striped"><tbody>';
		foreach ( $fields as $label => $meta_key ) {
			printf( '<tr><th scope="row">%1$s</th><td>%2$s</td></tr>', esc_html( $label ), esc_html( get_post_meta( $post->ID, $meta_key, true ) ) );
		}
		echo '</tbody></table>';
		echo '<h3>' . esc_html__( 'Message', 'nolan-young-core' ) . '</h3>';
		echo '<p style="white-space:pre-wrap">' . esc_html( get_post_meta( $post->ID, '_ny_core_message', true ) ) . '</p>';
	}

	/** @param WP_Post $post Post. @return void */
	public function render_subscriber_details( $post ) {
		printf( '<p><strong>%1$s:</strong> %2$s</p>', esc_html__( 'Email', 'nolan-young-core' ), esc_html( get_post_meta( $post->ID, '_ny_core_email', true ) ) );
		printf( '<p><strong>%1$s:</strong> %2$s</p>', esc_html__( 'Consent recorded', 'nolan-young-core' ), esc_html( get_post_meta( $post->ID, '_ny_core_subscribed', true ) ) );
	}
}
