<?php
/**
 * Template Name: Work
 * Template Post Type: page
 *
 * @package Nolan_Young_Template
 */
get_header();
$work = nolan_young_template_work_items();
?>
<main id="primary" class="site-main page-work">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Work', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h1><?php esc_html_e( 'Anonymized project types for structured WordPress improvement.', '007-nolan-young-theme-atlasframe-digital' ); ?></h1><p><?php esc_html_e( 'These examples are framed as project types, not client endorsements. They show how strategy, design, development, integration, support, and results-oriented work can be presented clearly.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/portfolio/performance-review.jpg', __( 'Atlasframe Digital performance review and analytics dashboard', '007-nolan-young-theme-atlasframe-digital' ), 'media-frame' ); ?></div></section>
	<section class="section portfolio-filter"><div class="container"><div class="filter-controls"><?php foreach ( array( 'All', 'Strategy', 'Design', 'Development', 'Integration', 'Support', 'Results' ) as $category ) : ?><button type="button" data-filter="<?php echo esc_attr( 'All' === $category ? 'all' : $category ); ?>" aria-pressed="<?php echo 'All' === $category ? 'true' : 'false'; ?>" class="<?php echo 'All' === $category ? 'is-active' : ''; ?>"><?php echo esc_html( $category ); ?></button><?php endforeach; ?></div><div class="portfolio-grid" data-filter-grid><?php foreach ( $work as $item ) : ?><article class="portfolio-card" data-category="<?php echo esc_attr( $item['category'] ); ?>"><?php nolan_young_template_render_image( $item['image'], $item['alt'] ); ?><p class="eyebrow"><?php echo esc_html( $item['category'] ); ?></p><h2><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a></h2><p><?php echo esc_html( $item['excerpt'] ); ?></p><a class="btn btn-text" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'See related services', '007-nolan-young-theme-atlasframe-digital' ); ?></a></article><?php endforeach; ?></div></div></section>
</main>
<?php get_footer(); ?>
