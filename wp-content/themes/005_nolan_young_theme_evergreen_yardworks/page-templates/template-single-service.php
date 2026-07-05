<?php
/**
 * Template Name: Single Service
 *
 * @package Nolan_Young_Template
 */
get_header();
$title = get_the_title() ? get_the_title() : __( 'Recurring Lawn Maintenance', '005-nolan-young-theme-evergreen-yardworks' );
?>
<main id="primary" class="site-main page-service-detail">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Service detail', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h1><?php echo esc_html( $title ); ?></h1><p><?php esc_html_e( 'Use this page to explain who the service fits, what is included, how scheduling works, and what property notes Evergreen Yardworks needs before estimating.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/portfolio/landscape-install.jpg', $title, 'media-frame' ); ?></div></section>
	<section class="section"><div class="container card-grid card-grid--three"><article class="info-card"><h2><?php esc_html_e( 'Best for', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Homes, rentals, small HOAs, and light commercial entries that need consistent curb appeal or a seasonal reset.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Typical work', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Mowing, edging, trimming, blowoff, bed cleanup, mulch, planting, pruning, debris removal, and visit notes depending on the service.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></article><article class="info-card"><h2><?php esc_html_e( 'Before visiting', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Share property photos, gate or pet notes, slopes, yard-waste needs, timeline, and whether work should recur.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></article></div></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section"><div class="container narrow"><h2><?php esc_html_e( 'Ask about this service', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><?php nolan_young_template_render_contact_form( 'single-service', $title ); ?></div></section>
</main>
<?php get_footer(); ?>

