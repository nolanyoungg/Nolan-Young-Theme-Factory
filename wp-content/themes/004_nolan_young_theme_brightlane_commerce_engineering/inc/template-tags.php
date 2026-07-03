<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function nolan_young_template_fallback_menu() {
	echo '<ul class="menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', '004-nolan-young-theme-brightlane-commerce-engineering' ) . '</a></li><li><a href="' . esc_url( home_url( '/services/' ) ) . '">' . esc_html__( 'Services', '004-nolan-young-theme-brightlane-commerce-engineering' ) . '</a></li><li><a href="' . esc_url( home_url( '/contact/' ) ) . '">' . esc_html__( 'Contact', '004-nolan-young-theme-brightlane-commerce-engineering' ) . '</a></li></ul>';
}

