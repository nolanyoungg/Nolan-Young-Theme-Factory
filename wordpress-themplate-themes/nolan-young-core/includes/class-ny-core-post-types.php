<?php
/**
 * Persistent content model registration.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

/** Registers portable post types and taxonomies. */
final class NY_Core_Post_Types {
	/** Constructor. */
	public function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	/** @return void */
	public function register() {
		register_post_type(
			'ny_service',
			array(
				'labels'       => array(
					'name'          => esc_html__( 'Services', 'nolan-young-core' ),
					'singular_name' => esc_html__( 'Service', 'nolan-young-core' ),
					'add_new_item'  => esc_html__( 'Add New Service', 'nolan-young-core' ),
					'edit_item'     => esc_html__( 'Edit Service', 'nolan-young-core' ),
					'view_item'     => esc_html__( 'View Service', 'nolan-young-core' ),
					'search_items'  => esc_html__( 'Search Services', 'nolan-young-core' ),
				),
				'public'       => true,
				'show_in_rest' => true,
				'has_archive'  => true,
				'menu_icon'    => 'dashicons-admin-tools',
				'rewrite'      => array( 'slug' => 'services' ),
				'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes' ),
				'taxonomies'   => array( 'ny_service_category' ),
			)
		);

		register_taxonomy(
			'ny_service_category',
			array( 'ny_service' ),
			array(
				'labels'       => array(
					'name'          => esc_html__( 'Service Categories', 'nolan-young-core' ),
					'singular_name' => esc_html__( 'Service Category', 'nolan-young-core' ),
				),
				'public'       => true,
				'hierarchical' => true,
				'show_in_rest' => true,
				'rewrite'      => array( 'slug' => 'service-category' ),
			)
		);

		$this->register_private_record_type( 'ny_inquiry', esc_html__( 'Inquiries', 'nolan-young-core' ), esc_html__( 'Inquiry', 'nolan-young-core' ) );
		$this->register_private_record_type( 'ny_subscriber', esc_html__( 'Subscribers', 'nolan-young-core' ), esc_html__( 'Subscriber', 'nolan-young-core' ) );
	}

	/**
	 * Register an administrator-only record type.
	 *
	 * @param string $post_type Post type key.
	 * @param string $plural Plural label.
	 * @param string $singular Singular label.
	 * @return void
	 */
	private function register_private_record_type( $post_type, $plural, $singular ) {
		$capabilities = array(
			'edit_post'              => 'manage_options',
			'read_post'              => 'manage_options',
			'delete_post'            => 'manage_options',
			'edit_posts'             => 'manage_options',
			'edit_others_posts'      => 'manage_options',
			'publish_posts'          => 'manage_options',
			'read_private_posts'     => 'manage_options',
			'delete_posts'           => 'manage_options',
			'delete_private_posts'   => 'manage_options',
			'delete_published_posts' => 'manage_options',
			'delete_others_posts'    => 'manage_options',
			'edit_private_posts'     => 'manage_options',
			'edit_published_posts'   => 'manage_options',
			'create_posts'           => 'do_not_allow',
		);

		register_post_type(
			$post_type,
			array(
				'labels' => array(
					'name'          => $plural,
					'singular_name' => $singular,
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'capabilities'        => $capabilities,
				'map_meta_cap'        => false,
				'supports'            => array( 'title' ),
			)
		);
	}
}
