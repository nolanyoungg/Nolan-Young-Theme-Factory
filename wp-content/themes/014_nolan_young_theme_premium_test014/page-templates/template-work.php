<?php
/*
Template Name: Work
*/
get_header(); ?>

?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <!-- Section 01: High-Impact Hero -->
        <section class="hero-section">
            <div class="container">
                <h1>Our Portfolio</h1>
                <p>Take a look at our recent projects and see how we bring your ideas to life.</p>
                <a href="#" class="cta-button">View All Work</a>
            </div>
        </section>

        <!-- Section 02: Featured Work Grid -->
        <section class="featured-work-grid-section">
            <div class="container">
                <?php
                $args = array(
                    'post_type' => 'work',
                    'posts_per_page' => -1,
                );
                $query = new WP_Query($args);

                if ($query->have_posts()) : ?>
?>
                    <div class="grid">
                        <?php while ($query->have_posts()) : $query->the_post(); ?>
                            <div class="card">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('large'); ?>
                                    <h3><?php the_title(); ?></h3>
                                </a>
                            </div>
                        <?php endwhile; ?>
                    </div>
                <?php endif;
                wp_reset_postdata();
                ?>
            </div>
        </section>

    </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
