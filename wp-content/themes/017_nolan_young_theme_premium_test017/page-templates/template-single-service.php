<?php
/**
 * Template Name: Single Service
 */
get_header();

if ( have_posts() ) :
    while ( have_posts() ) : the_post();
        $service_title = get_the_title();
        $service_content = get_the_content();
        ?>
        <section class="single-service-section">
            <div class="container">
                <h1><?php echo esc_html( $service_title ); ?></h1>
                <?php echo wpautop( $service_content ); ?>
            </div>
        </section>
    <?php endwhile;
endif;

get_footer(); ?>
