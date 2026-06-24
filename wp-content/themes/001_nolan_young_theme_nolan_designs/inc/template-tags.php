<?php
defined( 'ABSPATH' ) || exit;
function nytt01_button( $label, $url, $class = 'btn btn-primary' ) { return '<a class="' . esc_attr( $class ) . '" href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a>'; }
