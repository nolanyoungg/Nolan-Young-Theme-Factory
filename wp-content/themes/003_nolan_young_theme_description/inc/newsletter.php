<?php
function nolan_showcase_theme_01_sanitize_signup_email( $email ) {
  return sanitize_email( $email );
}
