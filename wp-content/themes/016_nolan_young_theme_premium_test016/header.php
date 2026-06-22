<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package Northstar_Websites_Premium_Theme
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div id="page" class="site">
    <header id="masthead" class="site-header" role="banner">
        <div class="container">
            <div class="site-branding">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" title="Northstar Websites">
                    <span class="site-title">Northstar Websites</span>
                </a>
            </div><!-- .site-branding -->

            <nav id="site-navigation" class="main-navigation" role="navigation">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'northstar-websites-premium-theme' ); ?></button>
                <?php
					wp_nav_menu(
						array(
							'theme_location' => 'primary',
							'menu_id'        => 'primary-menu',
							'container'      => false,
							'fallback_cb'    => 'nolan_young_template_fallback_menu',
						)
					);
                ?>
            </nav><!-- #site-navigation -->

            <div class="header-cta">
                <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="btn btn-header-cta">Contact Us</a>
            </div>
        </div><!-- .container -->
    </header><!-- #masthead -->

    <div id="content" class="site-content">
