<?php
/**
 * The template for displaying the front page.
 *
 * @package NOLAN-YOUNG Theme
 */

get_header();

?>

    <main id="primary" class="site-main">
        <?php get_template_part( 'template-parts/content-hero' ); ?>
        <?php get_template_part( 'template-parts/content-featured-work' ); ?>
        <?php get_template_part( 'template-parts/content-brand-statement' ); ?>
        <?php get_template_part( 'template-parts/content-all-services' ); ?>
        <?php get_template_part( 'template-parts/content-process' ); ?>
        <?php get_template_part( 'template-parts/content-featured-work-filter' ); ?>
        <?php get_template_part( 'template-parts/content-featured-case-study' ); ?>
        <?php get_template_part( 'template-parts/content-before-after' ); ?>
        <?php get_template_part( 'template-parts/content-packages' ); ?>
        <?php get_template_part( 'template-parts/content-business-solutions' ); ?>
        <?php get_template_part( 'template-parts/content-customer-experience' ); ?>
        <?php get_template_part( 'template-parts/content-testimonials' ); ?>
        <?php get_template_part( 'template-parts/content-blog-preview' ); ?>
        <?php get_template_part( 'template-parts/content-faq' ); ?>
        <?php get_template_part( 'template-parts/content-cta-banner' ); ?>
    </main><!-- #primary -->

<?php
get_footer();
?>
