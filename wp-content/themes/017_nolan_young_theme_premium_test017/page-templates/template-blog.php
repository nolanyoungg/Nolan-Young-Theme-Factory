<?php
/**
 * Template Name: Blog
 */
get_header(); ?>

?>
<section class="blog-section">
    <div class="container">
        <h1>Blog</h1>
        <p>Stay up to date with the latest news, insights, and tips from Northstar Websites.</p>

        <div class="blog-posts">
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                <article class="post">
                    <a href="<?php the_permalink(); ?>">
                        <?php the_post_thumbnail('large'); ?>
                        <h2><?php the_title(); ?></h2>
                        <p><?php the_excerpt(); ?></p>
                    </a>
                </article>
            <?php endwhile; endif; ?>
        </div>

        <?php
        if ( function_exists( 'the_posts_pagination' ) ) {
            the_posts_pagination();
        }
        ?>
    </div>
</section>

<?php get_footer(); ?>
