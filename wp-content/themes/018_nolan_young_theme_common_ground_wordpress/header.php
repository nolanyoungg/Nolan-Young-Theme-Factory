<?php
/** Shared site header. */
defined( 'ABSPATH' ) || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f4f1e8">
<?php wp_head(); ?>
</head>
<body id="top" <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
    <div class="wrap header-inner">
        <?php get_template_part( 'template-parts/brand' ); ?>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">Menu +</button>
        <nav class="site-nav" id="site-navigation" aria-label="Main navigation">
            <?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'cground-menu', 'depth' => 1, 'fallback_cb' => 'cground_primary_fallback' ) ); ?>
        </nav>
    </div>
</header>
