<?php
/**
 * Activation and deactivation routines.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

final class NY_Core_Activator {
	/** @return void */
	public static function activate() {
		$post_types = new NY_Core_Post_Types();
		$post_types->register();
		flush_rewrite_rules();
	}

	/** @return void */
	public static function deactivate() {
		flush_rewrite_rules();
	}
}
