<?php
/**
 * Template Name: Work
 */
get_header(); ?>

?>
<section class="work-section">
    <div class="container">
        <h1>Our Work</h1>
        <p>We take pride in our portfolio of successful projects. Each piece showcases our commitment to delivering high-quality web solutions.</p>

        <div class="work-cards">
            <?php
            $args = array(
                'post_type' => 'post',
                'posts_per_page' => 3,
                'category_name' => 'case-studies'
            );
            $query = new WP_Query( $args );

            if ( $query->have_posts() ) :
                while ( $query->have_posts() ) : $query->the_post();
                    ?>
                    <div class="card">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('large'); ?>
                            <h2><?php the_title(); ?></h2>
                            <p><?php the_excerpt(); ?></p>
                        </a>
                    </div>
                <?php endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
