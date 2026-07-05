<?php
/**
 * Template Name: Services
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-services">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Services', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h1><?php esc_html_e( 'Residential lawn care, landscaping maintenance, and seasonal property cleanup.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h1><p><?php esc_html_e( 'Use Evergreen Yardworks for weekly mowing, edging, trimming, lawn health guidance, mulch and bed refreshes, pruning, planting, storm debris cleanup, and recurring property plans.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/portfolio/lawn-maintenance.jpg', __( 'Evergreen Yardworks lawn maintenance crew work and fresh turf detail', '005-nolan-young-theme-evergreen-yardworks' ), 'media-frame' ); ?></div></section>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
</main>
<?php get_footer(); ?>

