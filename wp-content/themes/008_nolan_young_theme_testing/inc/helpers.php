<?php
function nolan_young_theme_asset_version( $relative_path ) {
  $file = get_theme_file_path( $relative_path );
  return file_exists( $file ) ? (string) filemtime( $file ) : wp_get_theme()->get( 'Version' );
}
