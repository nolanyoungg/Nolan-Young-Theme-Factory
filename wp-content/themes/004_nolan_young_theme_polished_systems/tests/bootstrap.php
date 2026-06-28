<?php
/**
 * WordPress PHPUnit bootstrap.
 *
 * @package NolanYoungThemeTemplate01
 */

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	fwrite( STDERR, "WordPress test library not found. Set WP_TESTS_DIR.\n" );
	exit( 1 );
}

require_once $_tests_dir . '/includes/functions.php';

tests_add_filter(
	'muplugins_loaded',
	static function () {
		register_theme_directory( dirname( dirname( __DIR__ ) ) );
		switch_theme( 'nolan-young-theme-template-01' );
	}
);

require $_tests_dir . '/includes/bootstrap.php';
