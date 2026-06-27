<?php
/**
 * Frontend asset loading.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Return a cache-safe asset version.
 *
 * @param string $relative_path Relative path from the theme root.
 * @return string
 */
function nytt01_get_asset_version( $relative_path ) {
	$asset_path = get_theme_file_path( $relative_path );

	if ( file_exists( $asset_path ) ) {
		return (string) filemtime( $asset_path );
	}

	return (string) wp_get_theme()->get( 'Version' );
}

/**
 * Read webpack-generated asset metadata with a safe runtime fallback.
 *
 * The @wordpress/scripts dependency-extraction plugin creates an adjacent
 * *.asset.php file containing a dependency list and content-derived version.
 * The fallback keeps the theme operational if an incomplete development copy
 * is used, while release validation still requires the metadata files.
 *
 * @param string $metadata_path Relative metadata path from the theme root.
 * @param string $asset_path    Relative browser asset path from the theme root.
 * @return array{dependencies: array<int, string>, version: string}
 */
function nytt01_get_asset_metadata( $metadata_path, $asset_path ) {
	$metadata_file = get_theme_file_path( $metadata_path );
	$metadata      = array();

	if ( file_exists( $metadata_file ) ) {
		$loaded_metadata = require $metadata_file;

		if ( is_array( $loaded_metadata ) ) {
			$metadata = $loaded_metadata;
		}
	}

	$dependencies = isset( $metadata['dependencies'] ) && is_array( $metadata['dependencies'] )
		? array_values( array_filter( array_map( 'sanitize_key', $metadata['dependencies'] ) ) )
		: array();

	$version = isset( $metadata['version'] ) && is_scalar( $metadata['version'] )
		? (string) $metadata['version']
		: nytt01_get_asset_version( $asset_path );

	return array(
		'dependencies' => $dependencies,
		'version'      => $version,
	);
}

/**
 * Enqueue public theme assets.
 *
 * @return void
 */
function nytt01_enqueue_assets() {
	$style_asset = nytt01_get_asset_metadata(
		'/assets/css/bundle.asset.php',
		'/assets/css/bundle.css'
	);
	$script_asset = nytt01_get_asset_metadata(
		'/assets/js/bundle.asset.php',
		'/assets/js/bundle.js'
	);

	wp_enqueue_style(
		'nytt01-bundle',
		get_theme_file_uri( '/assets/css/bundle.css' ),
		$style_asset['dependencies'],
		$style_asset['version']
	);

	wp_style_add_data( 'nytt01-bundle', 'rtl', 'replace' );

	wp_enqueue_script(
		'nytt01-bundle',
		get_theme_file_uri( '/assets/js/bundle.js' ),
		$script_asset['dependencies'],
		$script_asset['version'],
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'nytt01_enqueue_assets' );
