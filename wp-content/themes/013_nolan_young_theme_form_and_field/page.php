<?php
/** Standard pages use the requested slug or an explicitly assigned page template. */
$form_field_pages = array(
	'about' => 'about-us', 'services' => 'services', 'work' => 'work',
	'blog' => 'blog', 'contact' => 'contact', 'privacy-policy' => 'policy', 'featured' => 'single-service',
);
foreach ( $form_field_pages as $form_field_slug => $form_field_template ) {
	if ( is_page( $form_field_slug ) ) {
		require get_template_directory() . '/page-templates/template-' . $form_field_template . '.php';
		return;
	}
}
get_header();
?>
<main id="primary" class="site-main"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; ?></main>
<?php get_footer(); ?>
