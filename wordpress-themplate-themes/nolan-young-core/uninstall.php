<?php
/**
 * Optional destructive uninstall routine.
 *
 * Data is retained by default. Define NY_CORE_REMOVE_DATA as true before
 * uninstalling only when permanent deletion is explicitly intended.
 *
 * @package NolanYoungCore
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;
if ( ! defined( 'NY_CORE_REMOVE_DATA' ) || true !== NY_CORE_REMOVE_DATA ) {
	return;
}
$records = get_posts(
	array(
		'post_type'      => array( 'ny_inquiry', 'ny_subscriber' ),
		'post_status'    => 'any',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	)
);
foreach ( $records as $record_id ) {
	wp_delete_post( $record_id, true );
}
