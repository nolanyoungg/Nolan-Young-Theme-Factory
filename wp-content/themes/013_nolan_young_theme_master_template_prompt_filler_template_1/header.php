<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package NOLAN-YOUNG Theme
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

    <header id="masthead" class="site-header">
        <div class="container">
            <div class="site-branding">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                    <?php the_custom_logo(); ?>
                    <h1 class="site-title"><?php bloginfo( 'name' ); ?></h1>
                </a>
            </div><!-- .site-branding -->

            <nav id="site-navigation" class="main-navigation">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'nolan-young-theme' ); ?></button>
                <?php
                    wp_nav_menu(
                        array(
                            'theme_location' => 'primary',
                            'container_class'    => 'primary-menu-container',
                            'menu_id'            => 'primary-menu',
                            'fallback_cb'        => false,
                            'depth'              => 2,
                        )
                    );
                ?>
            </nav><!-- #site-navigation -->

            <div class="header-cta">
                <a href="/contact/" class="btn btn-header-cta">Contact Us</a>
            </div>
        </div><!-- .container -->
    </header><!-- #masthead -->

    <?php get_template_part( 'template-parts/content-hero' ); ?>

    <div id="content" class="site-content">
