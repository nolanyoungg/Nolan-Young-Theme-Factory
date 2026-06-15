<?php
/**
 * Header.
 *
 * @package 008_nolan_young_theme_testing
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header" data-nolan-menu-header>
  <div class="container header-inner">
    <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'Northstar Codeworks home', '008_nolan_young_theme_testing' ); ?>">
      <span class="brand-mark">NC</span>
      <span>Northstar Codeworks</span>
    </a>
    <button class="menu-toggle" type="button" data-nolan-menu-toggle aria-expanded="false" aria-controls="primary-menu">
      <span>Menu</span>
    </button>
    <nav id="primary-menu" class="primary-nav" data-nolan-menu-panel aria-label="<?php esc_attr_e( 'Primary navigation', '008_nolan_young_theme_testing' ); ?>">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
      <a href="#services">Services</a>
      <a href="#work">Work</a>
      <a href="#process">Process</a>
      <a href="#resources">Resources</a>
      <a href="#contact">Contact</a>
    </nav>
    <a class="btn btn-primary header-action" href="#contact">Book a Consultation</a>
  </div>
</header>
