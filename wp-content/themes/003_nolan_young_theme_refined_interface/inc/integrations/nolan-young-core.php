<?php
/**
 * Presentation integration for the Nolan Young Core companion plugin.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Add a theme class to companion-plugin form wrappers.
 *
 * @param string[] $classes Existing wrapper classes.
 * @return string[]
 */
function nytt01_core_form_classes( $classes ) {
	$classes[] = 'nytt01-form-card';
	return array_values( array_unique( array_map( 'sanitize_html_class', $classes ) ) );
}
add_filter( 'ny_core_form_classes', 'nytt01_core_form_classes' );
