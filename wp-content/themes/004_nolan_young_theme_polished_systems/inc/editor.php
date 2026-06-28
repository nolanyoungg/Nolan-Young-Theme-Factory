<?php
/**
 * Block editor presentation integration.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Add a project-specific editor body class.
 *
 * @param string $classes Existing editor classes.
 * @return string
 */
function nytt01_editor_body_class( $classes ) {
	$classes .= ' nytt01-editor';
	return $classes;
}
add_filter( 'admin_body_class', 'nytt01_editor_body_class' );
