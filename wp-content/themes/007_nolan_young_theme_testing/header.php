<?php
// Header template for Northstar Codeworks WordPress theme
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <header class="site-header"
    <div class="container">
      <div class="logo">
        <!-- Replace with your logo image or SVG -->
        <img src="/wp-content/themes/007_nolan_young_theme_testing/images/logo.png" alt="Northstar Codeworks Logo">
      </div>
      <nav class="main-navigation">
        <?php
          wp_nav_menu(array(
            'theme_location' => 'primary-menu',
            'menu_class' => 'nav-menu'
          ));
        ?>
      </nav>
      <button class="cta-button" onclick="location.href='/contact/';">Book a Consultation</button>
    </div>
  </header>
