<?php
/**
 * Template for Custom software built around one high-value workflow..
 *
 * @package 009_nolan_young_theme_testing
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( 'Service detail', '009_nolan_young_theme_testing' ); ?></p>
        <h1><?php esc_html_e( 'Custom software built around one high-value workflow.', '009_nolan_young_theme_testing' ); ?></h1>
        <p class="lede"><?php esc_html_e( 'Each service page clarifies the value proposition, deliverables, process, frequently asked questions, and next step for a focused project.', '009_nolan_young_theme_testing' ); ?></p>
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
  <section class="section"><div class="container split-grid"><div><h2>Deliverables</h2><p>Architecture map, implementation plan, responsive UI, WordPress-ready templates when needed, integration notes, QA checklist, and launch support.</p></div><div class="check-list"><p>Discovery workshop</p><p>Prototype and review</p><p>Implementation sprint</p><p>Testing and deployment</p><p>Support handoff</p></div></div></section>
</main>
<?php
get_footer();
