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
	<section class="section page-hero"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Work', 'nolan-young-theme-circuit-commerce-studio' ); ?></p><h1><?php esc_html_e( 'Representative website projects and problem types.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h1><p><?php esc_html_e( 'These examples show the kinds of strategy, design, development, integration, support, and results-focused work the theme is built to present.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p></div></section>
	<section class="section portfolio-filter"><div class="container"><div class="filter-controls"><?php foreach ( array( 'All', 'Strategy', 'Design', 'Development', 'Integration', 'Support', 'Results' ) as $category ) : ?><button type="button" data-filter="<?php echo esc_attr( 'All' === $category ? 'all' : $category ); ?>" aria-pressed="<?php echo 'All' === $category ? 'true' : 'false'; ?>" class="<?php echo 'All' === $category ? 'is-active' : ''; ?>"><?php echo esc_html( $category ); ?></button><?php endforeach; ?></div><div class="portfolio-grid" data-filter-grid><?php foreach ( $work as $item ) : ?><article class="portfolio-card" data-category="<?php echo esc_attr( $item['category'] ); ?>"><?php nolan_young_template_render_image( $item['image'], $item['title'] ); ?><p class="eyebrow"><?php echo esc_html( $item['category'] ); ?></p><h2><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a></h2><p><?php echo esc_html( $item['excerpt'] ); ?></p></article><?php endforeach; ?></div></div></section>
</main>
<?php get_footer(); ?>
