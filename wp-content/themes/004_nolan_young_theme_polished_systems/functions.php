<?php
/**
 * Theme bootstrap.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_theme_includes = array(
	'/inc/setup.php',
	'/inc/navigation.php',
	'/inc/enqueue.php',
	'/inc/editor.php',
	'/inc/template-tags.php',
	'/inc/template-functions.php',
	'/inc/customizer.php',
	'/inc/block-styles.php',
	'/inc/integrations/nolan-young-core.php',
);

foreach ( $nytt01_theme_includes as $nytt01_theme_include ) {
	$nytt01_theme_include_path = get_theme_file_path( $nytt01_theme_include );

	if ( file_exists( $nytt01_theme_include_path ) ) {
		require_once $nytt01_theme_include_path;
	}
}

unset( $nytt01_theme_include, $nytt01_theme_include_path, $nytt01_theme_includes );
