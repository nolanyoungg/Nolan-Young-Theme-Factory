<?php
/**
 * Template for Start with the workflow that needs to change..
 *
 * @package 007_nolan_young_theme_testing
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( 'Contact', '007_nolan_young_theme_testing' ); ?></p>
        <h1><?php esc_html_e( 'Start with the workflow that needs to change.', '007_nolan_young_theme_testing' ); ?></h1>
        <p class="lede"><?php esc_html_e( 'Tell Northstar Codeworks what is slow, fragile, duplicated, or disconnected. You will get a practical response about fit and next steps.', '007_nolan_young_theme_testing' ); ?></p>
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
  <section class="section contact-section"><div class="container contact-grid"><div><h2>What to include</h2><p>Share current tools, team roles, timeline, budget range, and what the software must make easier.</p></div><form class="contact-form"><label>Name<input type="text"></label><label>Email<input type="email"></label><label>Company<input type="text"></label><label>Project goals<textarea rows="5"></textarea></label><button class="btn btn-primary" type="submit">Send project note</button></form></div></section>
</main>
<?php
get_footer();
