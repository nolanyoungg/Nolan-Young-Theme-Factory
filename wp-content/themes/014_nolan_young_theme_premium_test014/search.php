<?php
get_header(); ?>

?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <?php if (have_posts()) : ?>

            <header class="page-header">
                <h1 class="page-title"><?php printf(esc_html__('Search Results for: %s', 'textdomain'), '<span>' . get_search_query() . '</span>'); ?></h1>
            </header><!-- .page-header -->

            <?php
            /* Start the Loop */
            while (have_posts()) : the_post();

                get_template_part('template-parts/content', get_post_format());

            endwhile;

            // Previous/next page navigation.
            the_posts_pagination(array(
                'prev_text' => '<span class="screen-reader-text">' . esc_html__('Previous page', 'textdomain') . '</span>',
                'next_text' => '<span class="screen-reader-text">' . esc_html__('Next page', 'textdomain') . '</span>',
            ));

        else :

            get_template_part('template-parts/content', 'none');

        endif; ?>
?>
    </main><!-- #main -->
</div><!-- #primary -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
