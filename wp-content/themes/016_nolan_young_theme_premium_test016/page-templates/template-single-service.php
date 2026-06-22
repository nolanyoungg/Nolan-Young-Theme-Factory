<?php
/**
 * Template Name: Single Service
 */
get_header();
?>

<main id="main" class="site-main">
    <section class="single-service-hero">
        <h1><?php the_title(); ?></h1>
        <p>Learn more about our <?php the_title(); ?> service.</p>
    </section>

    <section class="service-details">
        <?php the_content(); ?>
    </section>
</main>

<?php
get_footer();
?>
