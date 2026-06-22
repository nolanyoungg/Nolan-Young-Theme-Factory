<?php
/*
Template Name: Single Service
*/
get_header(); ?>

?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <!-- Section 01: High-Impact Hero -->
        <section class="hero-section">
            <div class="container">
                <h1><?php the_title(); ?></h1>
                <p><?php the_excerpt(); ?></p>
                <a href="#" class="cta-button">Get a Quote</a>
            </div>
        </section>

        <!-- Section 02: Service Details -->
        <section class="service-details-section">
            <div class="container">
                <?php the_content(); ?>
            </div>
        </section>

    </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
