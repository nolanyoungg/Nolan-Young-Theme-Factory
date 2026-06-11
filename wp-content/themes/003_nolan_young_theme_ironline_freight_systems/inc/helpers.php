<?php
function nytf_003_image_uri( $path ) {
  return esc_url( get_template_directory_uri() . '/assets/images/' . ltrim( $path, '/' ) );
}

