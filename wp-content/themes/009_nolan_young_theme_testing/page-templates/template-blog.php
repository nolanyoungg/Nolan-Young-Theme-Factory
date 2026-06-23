<?php
/**
 * Template for Useful guidance before you invest in custom software..
 *
 * @package 009_nolan_young_theme_testing
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( 'Resources', '009_nolan_young_theme_testing' ); ?></p>
        <h1><?php esc_html_e( 'Useful guidance before you invest in custom software.', '009_nolan_young_theme_testing' ); ?></h1>
        <p class="lede"><?php esc_html_e( 'Educational notes for founders, operators, and technical buyers planning internal tools, integrations, and workflow automation.', '009_nolan_young_theme_testing' ); ?></p>
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
  <section class="section"><div class="container card-grid cards-3"><article><h3>Planning an internal tool</h3><p>How to define users, decisions, permissions, and operational success.</p></article><article><h3>Integration risk checklist</h3><p>Questions to ask before connecting systems that run your business.</p></article><article><h3>Build versus buy</h3><p>A practical way to decide when custom software is worth the investment.</p></article></div></section>
</main>
<?php
get_footer();
