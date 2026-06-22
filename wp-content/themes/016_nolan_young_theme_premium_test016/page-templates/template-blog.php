<?php
/**
 * Template Name: Blog
 */
get_header();
?>

<main id="main" class="site-main">
    <section class="blog-hero">
        <h1>Latest News and Insights</h1>
        <p>Stay updated with our blog posts.</p>
    </section>

    <section class="blog-posts">
        <?php
        if (have_posts()) :
            while (have_posts()) : the_post();
                get_template_part('template-parts/content', 'blog');
            endwhile;
        else :
            echo '<p>No posts found.</p>';
        endif;
        ?>
    </section>
</main>

<?php
get_footer();
?>
