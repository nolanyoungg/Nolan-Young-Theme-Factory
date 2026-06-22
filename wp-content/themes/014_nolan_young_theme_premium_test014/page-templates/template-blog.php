<?php
/*
Template Name: Blog
*/
get_header(); ?>

?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <!-- Section 01: High-Impact Hero -->
        <section class="hero-section">
            <div class="container">
                <h1>Blog</h1>
                <p>Read our latest insights and tips on website development and digital marketing.</p>
                <a href="#" class="cta-button">Subscribe to Our Newsletter</a>
            </div>
        </section>

        <!-- Section 02: Blog Posts -->
        <section class="blog-posts-section">
            <div class="container">
                <?php
                if (have_posts()) : ?>
                    <?php while (have_posts()) : the_post(); ?>
                        <article class="post">
                            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                            <p><?php the_excerpt(); ?></p>
                            <a href="<?php the_permalink(); ?>" class="read-more">Read More</a>
                        </article>
                    <?php endwhile; ?>
                <?php endif;
                ?>
            </div>
        </section>

    </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
