<?php
/**
 * Required-file tests.
 *
 * @package NolanYoungThemeTemplate01
 */

class NYTT01_Required_Files_Test extends WP_UnitTestCase {
	/**
	 * Confirm production-critical files exist.
	 *
	 * @return void
	 */
	public function test_required_theme_files_exist() {
		$required = array(
			'style.css',
			'functions.php',
			'theme.json',
			'index.php',
			'header.php',
			'footer.php',
			'home.php',
			'404.php',
			'assets/css/bundle.css',
			'assets/css/bundle-rtl.css',
			'assets/css/bundle.asset.php',
			'assets/css/editor.css',
			'assets/css/editor-rtl.css',
			'assets/css/editor.asset.php',
			'assets/js/bundle.js',
			'assets/js/bundle.asset.php',
			'inc/navigation.php',
			'template-parts/header/mega-menu-featured.php',
			'template-parts/header/mega-menu-blog.php',
			'assets/images/navigation/service-1.svg',
			'assets/images/navigation/blog-placeholder.svg',
		);

		foreach ( $required as $relative_path ) {
			$this->assertFileExists( get_theme_file_path( '/' . $relative_path ) );
		}
	}
}
