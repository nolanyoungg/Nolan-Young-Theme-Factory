<?php
/** Native WordPress pages use the bakery composition matching their slug. */
$hearth_pages = array( 'about' => 'about-us', 'services' => 'services', 'work' => 'work', 'blog' => 'blog', 'contact' => 'contact', 'privacy-policy' => 'policy', 'featured' => 'single-service' );
foreach ( $hearth_pages as $hearth_slug => $hearth_template ) {
    if ( is_page( $hearth_slug ) ) {
        require get_template_directory() . '/page-templates/template-' . $hearth_template . '.php';
        return;
    }
}
get_header(); ?><main id="primary" class="container narrow inner-section"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; ?></main><?php get_footer(); ?>
