<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function nolan_young_template_fallback_menu() {
	echo '<ul class="menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'nolan-young-template' ) . '</a></li><li><a href="' . esc_url( home_url( '/services/' ) ) . '">' . esc_html__( 'Services', 'nolan-young-template' ) . '</a></li><li><a href="' . esc_url( home_url( '/contact/' ) ) . '">' . esc_html__( 'Contact', 'nolan-young-template' ) . '</a></li></ul>';
}
