<?php
/**
 * Template Name: Single Service
 * Template Post Type: page
 *
 * @package Nolan_Young_Template
 */
get_header();
$services = nolan_young_template_services();
$slug     = get_post_field( 'post_name', get_post() );
$service  = isset( $services[ $slug ] ) ? $services[ $slug ] : reset( $services );
$title    = $service['title'];
?>
<main id="primary" class="site-main page-service-detail">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Service detail', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h1><?php echo esc_html( $title ); ?></h1><p><?php echo esc_html( $service['description'] ); ?></p></div><?php nolan_young_template_render_image( $service['image'], $service['alt'], 'media-frame' ); ?></div></section>
	<section class="section"><div class="container card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Best for', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><p><?php echo esc_html( $service['ideal'] ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Deliverables', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul></article><article class="info-card"><h2><?php esc_html_e( 'Related support', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><p><?php esc_html_e( 'Engagement can connect to a Foundation Sprint, Custom Theme Build, or Ongoing Website Care depending on what the site needs next.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></article></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section"><div class="container narrow"><h2><?php esc_html_e( 'Ask about this service', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><p><?php esc_html_e( 'Use the form to describe the current site, goals, timeline context, must-have functionality, and support needs.', '007-nolan-young-theme-atlasframe-digital' ); ?></p><?php nolan_young_template_render_contact_form( 'single-service', $title ); ?></div></section>
</main>
<?php get_footer(); ?>
