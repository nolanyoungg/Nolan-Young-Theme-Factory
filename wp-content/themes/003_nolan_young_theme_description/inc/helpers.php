<?php
function nolan_showcase_theme_01_asset_uri( $path ) {
  return esc_url( get_template_directory_uri() . '/assets/' . ltrim( $path, '/' ) );
}
