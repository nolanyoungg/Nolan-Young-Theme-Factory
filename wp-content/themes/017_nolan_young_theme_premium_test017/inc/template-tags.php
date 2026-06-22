<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function nolan_young_template_fallback_menu() {
	$links = array(
		array( 'label' => __( 'Services', 'nolan-young-template' ), 'url' => home_url( '/services/' ) ),
		array( 'label' => __( 'About', 'nolan-young-template' ), 'url' => home_url( '/about/' ) ),
		array( 'label' => __( 'Work', 'nolan-young-template' ), 'url' => home_url( '/work/' ) ),
		array( 'label' => __( 'Contact', 'nolan-young-template' ), 'url' => home_url( '/contact/' ) ),
	);

	echo '<ul class="menu">';
	foreach ( $links as $link ) {
		echo '<li><a href="' . esc_url( $link['url'] ) . '">' . esc_html( $link['label'] ) . '</a></li>';
	}
	echo '</ul>';
}
