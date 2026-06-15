<?php
/**
 * Lightweight form admin scaffolding.
 *
 * @package 008_nolan_young_theme_testing
 */
function nolan_young_theme_register_forms_menu() {
  add_menu_page( __( 'Forms', '008_nolan_young_theme_testing' ), __( 'Forms', '008_nolan_young_theme_testing' ), 'manage_options', 'nolan-theme-forms', 'nolan_young_theme_render_forms_page', 'dashicons-feedback', 26 );
}
add_action( 'admin_menu', 'nolan_young_theme_register_forms_menu' );

function nolan_young_theme_render_forms_page() {
  echo '<div class="wrap"><h1>' . esc_html__( 'Form submissions', '008_nolan_young_theme_testing' ) . '</h1><p>' . esc_html__( 'Connect production storage before launch. This generated theme includes the admin surface and export intent.', '008_nolan_young_theme_testing' ) . '</p></div>';
}
