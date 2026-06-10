<?php
function nolan_showcase_theme_01_sanitize_message( $message ) {
  return sanitize_textarea_field( $message );
}
