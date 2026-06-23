<?php
/**
 * Template for Clear project expectations and responsible data handling..
 *
 * @package 009_nolan_young_theme_testing
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( 'Policy', '009_nolan_young_theme_testing' ); ?></p>
        <h1><?php esc_html_e( 'Clear project expectations and responsible data handling.', '009_nolan_young_theme_testing' ); ?></h1>
        <p class="lede"><?php esc_html_e( 'This page outlines practical privacy, communication, and project-operation expectations for generated theme previews.', '009_nolan_young_theme_testing' ); ?></p>
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
  <section class="section"><div class="container prose"><h2>Privacy and project notes</h2><p>Do not submit sensitive credentials through public forms. Production policies should be reviewed before launch.</p></div></section>
</main>
<?php
get_footer();
