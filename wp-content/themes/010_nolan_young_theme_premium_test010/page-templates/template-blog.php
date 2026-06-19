<?php
/*
Template Name: Blog
*/
get_header();
?>

<main class="blog">
    <section class="hero">
        <h1>From Our Blog</h1>
        <p>Stay updated with the latest insights and resources.</p>
    </section>

    <section class="featured-article">
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </section>

    <section class="category-navigation">
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </section>

    <section class="article-cards">
        <?php
        // Loop through the latest posts and display them as cards
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                ?>
                <div class="blog-card">
                    <a href="<?php the_permalink(); ?>">
                        <?php the_post_thumbnail('thumbnail'); ?>
                        <h3><?php the_title(); ?></h3>
                        <p><?php the_excerpt(); ?></p>
                    </a>
                </div>
                <?php
            endwhile;
        endif;
        ?>
    </section>

    <section class="pagination">
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </section>
</main>

<?php
get_footer();
?>
