<?php
/*
Template Name: Privacy Policy
*/
get_header(); ?>

?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <!-- Section 01: High-Impact Hero -->
        <section class="hero-section">
            <div class="container">
                <h1>Privacy Policy</h1>
                <p>We value your privacy and are committed to protecting your information.</p>
            </div>
        </section>

        <!-- Section 02: Privacy Policy Content -->
        <section class="privacy-policy-content-section">
            <div class="container">
                <?php the_content(); ?>
            </div>
        </section>

    </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
