<?php
/**
 * Template tags.
 *
 * @package 008_nolan_young_theme_testing
 */
function nolan_young_theme_posted_on() {
  echo '<span class="posted-on">' . esc_html( get_the_date() ) . '</span>';
}

function nolan_young_theme_service_nav() {
  echo '<nav class="service-jump-links" aria-label="' . esc_attr__( 'Service links', '008_nolan_young_theme_testing' ) . '"><a href="#services">' . esc_html__( 'Services', '008_nolan_young_theme_testing' ) . '</a><a href="#work">' . esc_html__( 'Work', '008_nolan_young_theme_testing' ) . '</a><a href="#contact">' . esc_html__( 'Contact', '008_nolan_young_theme_testing' ) . '</a></nav>';
}
