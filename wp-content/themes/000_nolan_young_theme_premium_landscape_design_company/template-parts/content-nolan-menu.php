<?php
$menu_cards = array(
  'services' => array(
    'Complete Garden Design', 'Outdoor Living Rooms', 'Estate Stewardship'
  ),
  'about' => array(
    'Studio Story', 'Design Standards', 'Working Rhythm'
  ),
  'blog' => array(
    'Planning Notes', 'Material Guides', 'Seasonal Care'
  ),
);
?>
<div class="nolan-menu-dropdown" id="nolan-menu-services" data-menu-dropdown="services" hidden>
  <div class="nolan-menu-panel">
    <div class="nolan-menu-rail">
      <button type="button" data-rail-item="design-build" aria-controls="services-design-build" aria-expanded="true"><?php esc_html_e( 'Design Build', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
      <button type="button" data-rail-item="stewardship" aria-controls="services-stewardship" aria-expanded="false"><?php esc_html_e( 'Stewardship', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
    </div>
    <div class="nolan-menu-content">
      <div class="nolan-rail-content" id="services-design-build" data-rail-content="design-build">
        <h3><?php esc_html_e( 'Outdoor rooms planned with architectural calm.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></h3>
        <p><?php esc_html_e( 'Move from first site walk to planting, stonework, lighting, and final handoff with one accountable studio.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></p>
        <div class="nolan-menu-link-grid">
          <a class="nolan-menu-card" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'Services overview', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
          <a class="nolan-menu-card" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>"><?php esc_html_e( 'Garden design build', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
          <a class="nolan-menu-card" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View project work', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
        </div>
      </div>
      <div class="nolan-rail-content" id="services-stewardship" data-rail-content="stewardship" hidden>
        <h3><?php esc_html_e( 'Care plans for landscapes that improve with age.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></h3>
        <p><?php esc_html_e( 'Seasonal visits, planting edits, lighting reviews, and estate guidance keep the design intentional year after year.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></p>
      </div>
    </div>
  </div>
</div>
<div class="nolan-menu-dropdown" id="nolan-menu-about" data-menu-dropdown="about" hidden>
  <div class="nolan-menu-panel">
    <div class="nolan-menu-rail">
      <button type="button" data-rail-item="studio" aria-controls="about-studio" aria-expanded="true"><?php esc_html_e( 'Studio', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
      <button type="button" data-rail-item="standards" aria-controls="about-standards" aria-expanded="false"><?php esc_html_e( 'Standards', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
    </div>
    <div class="nolan-menu-content">
      <div class="nolan-rail-content" id="about-studio" data-rail-content="studio">
        <h3><?php esc_html_e( 'A design-build studio for measured outdoor living.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></h3>
        <p><?php esc_html_e( 'Aster Grove pairs thoughtful planning with careful build management and long-term stewardship.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></p>
        <a class="button ghost" href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>"><?php esc_html_e( 'Meet the studio', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      </div>
      <div class="nolan-rail-content" id="about-standards" data-rail-content="standards" hidden>
        <h3><?php esc_html_e( 'Built around clarity, craft, and durable materials.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></h3>
        <p><?php esc_html_e( 'Every proposal includes the practical details owners and builders need before work begins.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></p>
      </div>
    </div>
  </div>
</div>
<div class="nolan-menu-dropdown" id="nolan-menu-blog" data-menu-dropdown="blog" hidden>
  <div class="nolan-menu-panel">
    <div class="nolan-menu-rail">
      <button type="button" data-rail-item="planning" aria-controls="blog-planning" aria-expanded="true"><?php esc_html_e( 'Planning', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
      <button type="button" data-rail-item="care" aria-controls="blog-care" aria-expanded="false"><?php esc_html_e( 'Care', '000_nolan_young_theme_premium_landscape_design_company' ); ?></button>
    </div>
    <div class="nolan-menu-content">
      <div class="nolan-rail-content" id="blog-planning" data-rail-content="planning">
        <h3><?php esc_html_e( 'Field notes for better outdoor decisions.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></h3>
        <p><?php esc_html_e( 'Read practical guidance on garden planning, stone selection, planting structure, and lighting.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></p>
        <a class="button ghost" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Read resources', '000_nolan_young_theme_premium_landscape_design_company' ); ?></a>
      </div>
      <div class="nolan-rail-content" id="blog-care" data-rail-content="care" hidden>
        <h3><?php esc_html_e( 'Seasonal stewardship that protects the design.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></h3>
        <p><?php esc_html_e( 'Keep plantings edited, lighting adjusted, and outdoor rooms ready for daily use.', '000_nolan_young_theme_premium_landscape_design_company' ); ?></p>
      </div>
    </div>
  </div>
</div>
