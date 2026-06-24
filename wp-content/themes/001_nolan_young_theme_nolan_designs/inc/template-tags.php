<?php
/**
 * Template tags.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

function nolan_young_template_posted_on() {
	printf(
		'<time datetime="%1$s">%2$s</time>',
		esc_attr( get_the_date( DATE_W3C ) ),
		esc_html( get_the_date() )
	);
}

function nolan_young_template_posted_by() {
	printf(
		'<span class="byline">%s</span>',
		esc_html( get_the_author() )
	);
}

function nolan_young_template_pagination() {
	the_posts_pagination(
		array(
			'mid_size'  => 1,
			'prev_text' => __( 'Previous', '001_nolan_young_theme_nolan_designs' ),
			'next_text' => __( 'Next', '001_nolan_young_theme_nolan_designs' ),
		)
	);
}
