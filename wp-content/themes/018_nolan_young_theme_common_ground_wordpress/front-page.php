<?php
/** Designed home, optionally replaced by the assigned front page's editor content. */
defined( 'ABSPATH' ) || exit;
get_header();
cground_render_design( 'home' );
get_footer();
