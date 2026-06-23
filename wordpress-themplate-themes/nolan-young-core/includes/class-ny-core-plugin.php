<?php
/**
 * Plugin coordinator.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

/**
 * Coordinates plugin modules.
 */
final class NY_Core_Plugin {
	/** @var NY_Core_Plugin|null */
	private static $instance = null;

	/**
	 * Return the singleton instance.
	 *
	 * @return NY_Core_Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/** Initialize modules. */
	private function __construct() {
		new NY_Core_Post_Types();
		new NY_Core_Contact_Form();
		new NY_Core_Newsletter();
		new NY_Core_Access_Control();
		new NY_Core_Admin();
		new NY_Core_Privacy();

		add_action( 'init', array( $this, 'load_textdomain' ), 1 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_public_assets' ) );
	}

	/** @return void */
	public function load_textdomain() {
		load_plugin_textdomain( 'nolan-young-core', false, dirname( plugin_basename( NY_CORE_FILE ) ) . '/languages' );
	}

	/** @return void */
	public function enqueue_public_assets() {
		wp_enqueue_style(
			'ny-core-public',
			NY_CORE_URL . 'assets/css/public.css',
			array(),
			NY_CORE_VERSION
		);
	}
}
