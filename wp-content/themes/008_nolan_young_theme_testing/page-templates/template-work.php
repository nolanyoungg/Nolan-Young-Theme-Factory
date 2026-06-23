<?php
/**
 * Template for Software case studies with operational outcomes..
 *
 * @package 008_nolan_young_theme_testing
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( 'Work', '008_nolan_young_theme_testing' ); ?></p>
        <h1><?php esc_html_e( 'Software case studies with operational outcomes.', '008_nolan_young_theme_testing' ); ?></h1>
        <p class="lede"><?php esc_html_e( 'Review realistic examples of dashboards, portals, integration layers, and workflow systems built for service businesses and B2B teams.', '008_nolan_young_theme_testing' ); ?></p>
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
  <section class="section"><div class="container">
<div class="case-grid">
  <article class="case-card"><p class="eyebrow">Operations dashboard</p><h3>Multi-location service visibility</h3><p>Unified job status, technician capacity, invoice readiness, and regional performance into one decision workspace.</p><b>Result: 18 hours saved weekly</b></article>
  <article class="case-card"><p class="eyebrow">Client portal</p><h3>Professional services onboarding</h3><p>Built a secure portal for file collection, task status, team messages, and approval checkpoints.</p><b>Result: 42% faster onboarding</b></article>
  <article class="case-card"><p class="eyebrow">Integration layer</p><h3>CRM, billing, and scheduling sync</h3><p>Replaced duplicate entry with audited data flows, retry handling, and exception reporting.</p><b>Result: fewer missed handoffs</b></article>
</div></div></section>
</main>
<?php
get_footer();
