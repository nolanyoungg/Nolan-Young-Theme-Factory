<?php
/**
 * Template for This page is not available..
 *
 * @package 008_nolan_young_theme_testing
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( '404', '008_nolan_young_theme_testing' ); ?></p>
        <h1><?php esc_html_e( 'This page is not available.', '008_nolan_young_theme_testing' ); ?></h1>
        <p class="lede"><?php esc_html_e( 'The requested page could not be found. Use the navigation or search to continue exploring Northstar Codeworks.', '008_nolan_young_theme_testing' ); ?></p>
      </div>
      <div class="interface-card" aria-hidden="true">
        <span class="status-dot"></span>
        <strong>Project signal</strong>
        <div class="metric-row"><span>Risk map</span><b>Clear</b></div>
        <div class="metric-row"><span>Workflow fit</span><b>92%</b></div>
        <div class="metric-row"><span>Launch path</span><b>Ready</b></div>
      </div>
    </div>
  </section>

</main>
<?php
get_footer();
