<?php
defined( 'ABSPATH' ) || exit;
foreach ( array( '/inc/setup.php', '/inc/navigation.php', '/inc/enqueue.php', '/inc/editor.php', '/inc/template-tags.php', '/inc/template-functions.php', '/inc/customizer.php', '/inc/block-styles.php', '/inc/integrations/nolan-young-core.php' ) as $file ) { $path = get_theme_file_path( $file ); if ( file_exists( $path ) ) require_once $path; }
