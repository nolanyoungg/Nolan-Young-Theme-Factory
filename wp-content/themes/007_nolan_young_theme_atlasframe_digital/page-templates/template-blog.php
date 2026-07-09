<?php
/**
 * Template Name: Blog
 * Template Post Type: page
 *
 * @package Nolan_Young_Template
 */
get_header();
$articles = nolan_young_template_articles();
?>
<main id="primary" class="site-main page-blog">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Blog', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h1><?php esc_html_e( 'Practical WordPress planning, theme, and care guidance.', '007-nolan-young-theme-atlasframe-digital' ); ?></h1><p><?php esc_html_e( 'Generated article destinations for teams thinking through redesigns, custom themes, service pages, integrations, care plans, and WooCommerce storefronts.', '007-nolan-young-theme-atlasframe-digital' ); ?></p><?php get_search_form(); ?></div><?php nolan_young_template_render_image( 'assets/images/hero/agency-workspace.jpg', __( 'Atlasframe Digital strategy workspace with laptops and planning material', '007-nolan-young-theme-atlasframe-digital' ), 'media-frame' ); ?></div></section>
	<section class="section"><div class="container"><article class="featured-article"><?php nolan_young_template_render_image( $articles[0]['image'], $articles[0]['alt'] ); ?><div><p class="eyebrow"><?php echo esc_html( $articles[0]['tag'] ); ?></p><h2><a href="<?php echo esc_url( $articles[0]['url'] ); ?>"><?php echo esc_html( $articles[0]['title'] ); ?></a></h2><p><?php echo esc_html( $articles[0]['excerpt'] ); ?></p></div></article><div class="card-grid blog-grid"><?php foreach ( $articles as $article ) : ?><article class="blog-card"><?php nolan_young_template_render_image( $article['image'], $article['alt'] ); ?><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h2><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a></h2><p><?php echo esc_html( $article['excerpt'] ); ?></p></article><?php endforeach; ?></div></div></section>
</main>
<?php get_footer(); ?>
