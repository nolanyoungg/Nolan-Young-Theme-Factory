<?php
/**
 * Template Part for Blog Preview Section
 *
 * @package 010_nolan_young_theme_premium_test010
 */

?>
<section class="blog-preview">
    <div class="container">
        <h2>Latest from Our Blog</h2>
        <div class="blog-posts">
            <?php
            $args = array(
                'post_type' => 'post',
                'posts_per_page' => 4,
            );

            $query = new WP_Query($args);

            if ($query->have_posts()) {
                while ($query->have_posts()) {
                    $query->the_post();
                    ?>
                    <div class="blog-post">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('thumbnail'); ?>
                            <h3><?php the_title(); ?></h3>
                            <p><?php the_excerpt(); ?></p>
                        </a>
                    </div>
                    <?php
                }
            }

            wp_reset_postdata();
            ?>
        </div>
    </div>
</section>
