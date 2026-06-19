<?php get_header(); ?>

?>
<main id="primary" class="site-main">
    <header class="page-header">
        <h1><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'textdomain' ); ?></h1>
    </header>

    <div class="page-content">
        <p><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try a search?', 'textdomain' ); ?></p>

        <?php get_search_form(); ?>
    </div>
</main>

<?php get_footer(); ?>