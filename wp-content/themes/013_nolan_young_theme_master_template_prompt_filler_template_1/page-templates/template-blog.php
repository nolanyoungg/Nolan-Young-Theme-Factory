<?php
/*
Template Name: Blog
*/
get_header();
?>

<main id="primary" class="site-main">
    <section class="blog-hero">
        <div class="container">
            <h1>Our Blog</h1>
            <p>Websites that help businesses grow.</p>
        </div>
    </section>

    <section class="blog-featured">
        <div class="container">
            <h2>Featured Articles</h2>
            <?php
                $args = array(
                    'posts_per_page' => 3,
                    'post__in' => get_option('sticky_posts')
                );
                $the_query = new WP_Query($args);
                while ($the_query->have_posts()) : $the_query->the_post();
            ?>
                <article class="post-preview">
                    <a href="<?php the_permalink(); ?>">
                        <?php if (has_post_thumbnail()): ?>
                            <div class="post-thumbnail">
                                <?php the_post_thumbnail('large'); ?>
                            </div>
                        <?php endif; ?>
                        <h3><?php the_title(); ?></h3>
                        <?php the_excerpt(); ?>
                    </a>
                </article>
            <?php endwhile; wp_reset_query(); ?>
        </div>
    </section>

    <section class="blog-categories">
        <div class="container">
            <h2>Categories</h2>
            <div class="category-navigation">
                <?php
                    $categories = get_categories(array('orderby' => 'name', 'order' => 'ASC'));
                    foreach($categories as $category) {
                        echo '<a href="' . esc_url(get_category_link($category->term_id)) . '">' . esc_html($category->name) . '</a>';
                    }
                ?>
            </div>
        </div>
    </section>

    <section class="blog-articles">
        <div class="container">
            <h2>All Articles</h2>
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                <article class="post-preview">
                    <a href="<?php the_permalink(); ?>">
                        <?php if (has_post_thumbnail()): ?>
                            <div class="post-thumbnail">
                                <?php the_post_thumbnail('medium'); ?>
                            </div>
                        <?php endif; ?>
                        <h3><?php the_title(); ?></h3>
                        <?php the_excerpt(); ?>
                    </a>
                </article>
            <?php endwhile; endif; ?>
        </div>
    </section>

    <section class="blog-pagination">
        <div class="container">
            <?php the_posts_pagination(); ?>
        </div>
    </section>

    <section class="blog-contact">
        <div class="container">
            <h2>Contact Us</h2>
            <p>Get in touch with our team to learn more about what we can do for your business.</p>
            <a href="/contact/" class="btn btn-primary">Contact Us</a>
        </div>
    </section>
</main>

<?php
get_footer();
?>