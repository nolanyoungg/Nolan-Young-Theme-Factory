<?php
/**
 * Template for Access is restricted..
 *
 * @package 008_nolan_young_theme_testing
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( '403', '008_nolan_young_theme_testing' ); ?></p>
        <h1><?php esc_html_e( 'Access is restricted.', '008_nolan_young_theme_testing' ); ?></h1>
        <p class="lede"><?php esc_html_e( 'This page is not available for public viewing. Return to the main site or contact the team for help.', '008_nolan_young_theme_testing' ); ?></p>
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
