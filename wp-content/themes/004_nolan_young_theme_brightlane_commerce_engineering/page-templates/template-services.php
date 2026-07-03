<?php
/**
 * Template Name: Services
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-services">
	<section class="section page-hero"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Services', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h1><?php esc_html_e( 'WordPress strategy, design, development, integration, support, and optimization.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h1><p><?php esc_html_e( 'Use Brightlane for a focused project, a complete build, or a practical improvement plan for an existing website.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></div></section>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Service fit', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h2><?php esc_html_e( 'Not every project needs the same level of work.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2></div><div><p><?php esc_html_e( 'A new website may need strategy, design, and development together. An existing site may only need content structure, form cleanup, accessibility fixes, or support planning. The service pages are written to help teams identify the useful next step.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Ask about services', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div></div></section>
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
</main>
<?php get_footer(); ?>
