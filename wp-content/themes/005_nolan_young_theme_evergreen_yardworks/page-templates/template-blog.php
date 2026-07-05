<?php
/**
 * Template Name: Blog
 *
 * @package Nolan_Young_Template
 */
get_header();
$articles = nolan_young_template_articles();
?>
<main id="primary" class="site-main page-blog">
	<section class="section page-hero"><div class="container narrow"><p class="eyebrow"><?php esc_html_e( 'Seasonal Guide', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h1><?php esc_html_e( 'Lawn care notes for homeowners who want fewer surprises.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h1><?php get_search_form(); ?></div></section>
	<section class="section"><div class="container"><article class="featured-article"><?php nolan_young_template_render_image( $articles[0]['image'], $articles[0]['title'] ); ?><div><p class="eyebrow"><?php echo esc_html( $articles[0]['tag'] ); ?></p><h2><a href="<?php echo esc_url( $articles[0]['url'] ); ?>"><?php echo esc_html( $articles[0]['title'] ); ?></a></h2><p><?php echo esc_html( $articles[0]['excerpt'] ); ?></p></div></article><div class="card-grid"><?php foreach ( $articles as $article ) : ?><article class="blog-card"><?php nolan_young_template_render_image( $article['image'], $article['title'] ); ?><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h2><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a></h2><p><?php echo esc_html( $article['excerpt'] ); ?></p></article><?php endforeach; ?></div></div></section>
</main>
<?php get_footer(); ?>

