<?php
get_header(); ?>

?>
<main id="primary" class="site-main">
    <section class="error-404 not-found">
        <h1>Oops! That page can't be found.</h1>
        <p>It looks like nothing was found at this location. Maybe try a search or one of the links below?</p>

        <?php get_search_form(); ?>

        <?php the_widget( 'WP_Widget_Recent_Posts' ); ?>
    </section>
</main>

<?php
get_footer();
?>
