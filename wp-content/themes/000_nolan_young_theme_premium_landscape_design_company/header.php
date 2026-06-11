<?php
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary"><?php esc_html_e( 'Skip to content', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
<header class="nolan-site-header" data-site-header>
  <div class="nolan-header-inner">
    <a class="nolan-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
      <span class="nolan-mark">AG</span>
      <span><?php esc_html_e( 'Aster Grove', '000_nolan_young_theme_premium_landscape_design_company' ); ?></span>
    </a>
    <nav class="nolan-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', '000_nolan_young_theme_premium_landscape_design_company' ); ?>">
      <button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="nolan-menu-services" aria-expanded="false"><?php esc_html_e( 'Services', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
      <button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="nolan-menu-about" aria-expanded="false"><?php esc_html_e( 'About', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      <button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="nolan-menu-blog" aria-expanded="false"><?php esc_html_e( 'Blog', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
    </nav>
    <div class="nolan-header-actions">
      <a class="nolan-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      <button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="nolan-mobile-drawer" aria-expanded="false"><?php esc_html_e( 'Menu', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
    </div>
  </div>
  <div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>
  <?php get_template_part( 'template-parts/content', 'nolan-menu' ); ?>
  <div class="nolan-mobile-drawer" id="nolan-mobile-drawer" data-mobile-drawer hidden>
    <nav aria-label="<?php esc_attr_e( 'Mobile navigation', '000_nolan_young_theme_premium_landscape_design_company' ); ?>">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'Services', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>"><?php esc_html_e( 'About', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Blog', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
    </nav>
  </div>
</header>
<main id="primary" class="site-main">
