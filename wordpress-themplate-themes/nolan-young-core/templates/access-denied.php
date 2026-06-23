<?php
/** Standalone access-denied template. @package NolanYoungCore */

defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'ny-core-access-denied' ); ?>>
<?php wp_body_open(); ?>
<main id="primary" class="ny-core-access-denied__content">
	<h1><?php esc_html_e( 'Access denied', 'nolan-young-core' ); ?></h1>
	<p><?php esc_html_e( 'You do not have permission to view this page.', 'nolan-young-core' ); ?></p>
	<p><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return to the home page', 'nolan-young-core' ); ?></a></p>
</main>
<?php wp_footer(); ?>
</body>
</html>
