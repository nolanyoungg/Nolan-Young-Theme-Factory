<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function nolan_young_template_fallback_menu() {
    echo '<ul class="menu">'
         . '<li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li>'
         . '<li><a href="#services">Services</a></li>'
         . '<li><a href="#work">Work</a></li>'
         . '<li><a href="#process">Process</a></li>'
         . '<li><a href="#resources">Resources</a></li>'
         . '<li><a href="#about">About</a></li>'
         . '<li><a href="' . esc_url( home_url( '/contact/' ) ) . '">Contact</a></li>'
         . '</ul>';
}
