<?php
// Header template for NOLAN-YOUNG Theme
if (!defined('ABSPATH')) exit; // Exit if accessed directly
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header id="site-header" class="sticky-header">
  <div class="container">
    <div class="logo-block">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
        <img src="assets/icons/icon1.svg" alt="Northstar Websites logo">
        <span>Northstar Websites</span>
      </a>
    </div>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
      <a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Services</a>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a>
      <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a>
      <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="btn btn-primary btn-header-cta">Contact</a>
    </nav>
  </div>
</header>
