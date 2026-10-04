<?php
/** Default editable WordPress page. */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main">
<?php
while ( have_posts() ) {
    the_post();
    get_template_part( 'template-parts/content', 'page' );
}
?>
</main>
<?php get_footer(); ?>
