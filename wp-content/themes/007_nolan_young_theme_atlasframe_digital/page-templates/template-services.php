<?php
/**
 * Template Name: Services
 * Template Post Type: page
 *
 * @package Nolan_Young_Template
 */
get_header();
$faqs = nolan_young_template_faqs();
?>
<main id="primary" class="site-main page-services">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Services', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h1><?php esc_html_e( 'WordPress design, development, WooCommerce, integrations, redesigns, and care.', '007-nolan-young-theme-atlasframe-digital' ); ?></h1><p><?php esc_html_e( 'Use Atlasframe Digital for a focused Foundation Sprint, a full Custom Theme Build, or ongoing Website Care that keeps the site useful.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></div><?php nolan_young_template_render_image( 'assets/images/hero/developer-screens.jpg', __( 'Atlasframe Digital developer screens and code workspace', '007-nolan-young-theme-atlasframe-digital' ), 'media-frame' ); ?></div></section>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section"><div class="container"><div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Choose a path', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h2><?php esc_html_e( 'Match the engagement to the problem.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2></div><div class="card-grid card-grid--three"><article class="info-card"><h3><?php esc_html_e( 'Foundation Sprint', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><p><?php esc_html_e( 'Best when the site needs strategy, sitemap direction, content priorities, and technical recommendations before a build.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></article><article class="info-card"><h3><?php esc_html_e( 'Custom Theme Build', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><p><?php esc_html_e( 'Best when the business is ready for a full design system, custom templates, component buildout, responsive QA, and launch support.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></article><article class="info-card"><h3><?php esc_html_e( 'Ongoing Website Care', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><p><?php esc_html_e( 'Best when the site needs updates, incremental improvements, content support, quality checks, and technical stewardship.', '007-nolan-young-theme-atlasframe-digital' ); ?></p></article></div></div></section>
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
	<section class="section faq-section"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Service FAQ', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h2><?php esc_html_e( 'Common service questions.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><?php foreach ( $faqs as $question => $answer ) : ?><section class="accordion-item"><button type="button" aria-expanded="false"><?php echo esc_html( $question ); ?></button><div hidden><p><?php echo esc_html( $answer ); ?></p></div></section><?php endforeach; ?></div></section>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>
