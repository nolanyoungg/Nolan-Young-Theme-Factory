<?php
/**
 * Template Name: About Us
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-about">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'About Evergreen Yardworks', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h1><?php esc_html_e( 'Local property care built around tidy visits and seasonal timing.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h1><p><?php esc_html_e( 'Evergreen Yardworks keeps lawn care practical: understand the property, choose the right route or cleanup plan, protect access details, and leave the yard looking cared for.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/hero/garden-crew-hands.jpg', __( 'Evergreen Yardworks landscape crew hands planting and improving garden beds', '005-nolan-young-theme-evergreen-yardworks' ), 'media-frame' ); ?></div></section>
	<section class="section" id="values"><div class="container"><div class="card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Route-minded', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Scheduling considers neighborhoods, weather, access, and visit notes so recurring care stays predictable.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Detail-oriented', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Edges, beds, gates, clippings, and cleanup debris are part of the finished property experience.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Seasonal', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Spring growth, summer heat, fall leaves, and winter planning each change what the yard needs next.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></article></div></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>

