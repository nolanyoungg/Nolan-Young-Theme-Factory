<?php
/**
 * Theme asset tests.
 *
 * @package NolanYoungThemeTemplate01
 */

class NYTT01_Assets_Test extends WP_UnitTestCase {
	/** @return void */
	public function test_frontend_assets_are_enqueued() {
		do_action( 'wp_enqueue_scripts' );
		$this->assertTrue( wp_style_is( 'nytt01-bundle', 'enqueued' ) );
		$this->assertTrue( wp_script_is( 'nytt01-bundle', 'enqueued' ) );
	}
}
