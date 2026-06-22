<?php
get_header(); ?>

?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <section class="error-404 not-found">
            <header class="page-header">
                <h1 class="page-title"><?php esc_html_e('Oops! That page can&rsquo;t be found.', 'textdomain'); ?></h1>
            </header><!-- .page-header -->

            <div class="page-content">
                <p><?php esc_html_e('It looks like nothing was found at this location. Maybe try a search?', 'textdomain'); ?></p>

                <?php get_search_form(); ?>

                <?php the_widget('WP_Widget_Recent_Posts'); ?>

                <?php the_widget('WP_Widget_Archives', array('dropdown' => 1)); ?>

            </div><!-- .page-content -->
        </section><!-- .error-404 -->

    </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
