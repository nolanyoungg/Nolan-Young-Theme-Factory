<?php defined( 'ABSPATH' ) || exit; if ( ! function_exists( 'nytt01_has_core_plugin' ) ) { function nytt01_has_core_plugin() { return post_type_exists( 'ny_service' ); } }
