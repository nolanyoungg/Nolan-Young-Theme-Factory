<?php
/**
 * Template Name: Work
 *
 * @package Nolan_Young_Template
 */
get_header();
$work = nolan_young_template_work_items();
?>
<main id="primary" class="site-main page-work">
	<section class="section page-hero"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Work', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h1><?php esc_html_e( 'Representative property-care examples from lawns, beds, cleanup, and routes.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h1><p><?php esc_html_e( 'These examples show how Evergreen Yardworks talks about realistic yard maintenance without invented awards, reviews, or unsupported performance claims.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></div></section>
	<section class="section portfolio-filter"><div class="container"><div class="filter-controls"><?php foreach ( array( 'All', 'Cleanup', 'Beds', 'Route', 'HOA', 'Fall', 'Planting' ) as $category ) : ?><button type="button" data-filter="<?php echo esc_attr( 'All' === $category ? 'all' : $category ); ?>" aria-pressed="<?php echo 'All' === $category ? 'true' : 'false'; ?>" class="<?php echo 'All' === $category ? 'is-active' : ''; ?>"><?php echo esc_html( $category ); ?></button><?php endforeach; ?></div><div class="portfolio-grid" data-filter-grid><?php foreach ( $work as $item ) : ?><article class="portfolio-card" data-category="<?php echo esc_attr( $item['category'] ); ?>"><?php nolan_young_template_render_image( $item['image'], $item['title'] ); ?><p class="eyebrow"><?php echo esc_html( $item['category'] ); ?></p><h2><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a></h2><p><?php echo esc_html( $item['excerpt'] ); ?></p></article><?php endforeach; ?></div></div></section>
</main>
<?php get_footer(); ?>

