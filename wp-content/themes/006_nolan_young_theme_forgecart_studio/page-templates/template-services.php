<?php
/**
 * Template Name: Services
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-services">
	<section class="section page-hero"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Services', 'nolan-young-template' ); ?></p><h1><?php esc_html_e( 'WordPress websites, Shopify storefronts, WooCommerce builds, migrations, conversion design, and site care.', 'nolan-young-template' ); ?></h1><p><?php esc_html_e( 'Use ForgeCart Studio for a focused project, a complete content-and-commerce build, or a practical improvement plan for an existing website or store.', 'nolan-young-template' ); ?></p></div></section>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Service fit', 'nolan-young-template' ); ?></p><h2><?php esc_html_e( 'WordPress and Shopify are operating decisions, not competing slogans.', 'nolan-young-template' ); ?></h2></div><div><p><?php esc_html_e( 'A new site may need strategy, design, and development together. An existing store may only need collection structure, theme sections, checkout-readiness review, or campaign support. The service pages help teams identify the useful next step without pretending one platform solves every problem.', 'nolan-young-template' ); ?></p><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Ask about services', 'nolan-young-template' ); ?></a></div></div></section>
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
</main>
<?php get_footer(); ?>
