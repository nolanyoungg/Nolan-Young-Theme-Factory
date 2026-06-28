<?php
/**
 * Theme setup tests.
 *
 * @package NolanYoungThemeTemplate01
 */

class NYTT01_Theme_Setup_Test extends WP_UnitTestCase {
	/** @return void */
	public function test_required_theme_supports_are_registered() {
		do_action( 'after_setup_theme' );
		$this->assertTrue( current_theme_supports( 'title-tag' ) );
		$this->assertTrue( current_theme_supports( 'post-thumbnails' ) );
		$this->assertTrue( current_theme_supports( 'html5' ) );
	}

	/** @return void */
	public function test_navigation_locations_are_registered() {
		do_action( 'after_setup_theme' );
		$locations = get_registered_nav_menus();
		$this->assertArrayHasKey( 'primary', $locations );
		$this->assertArrayHasKey( 'footer', $locations );
	}
}
