<?php
get_header();
?>

<main id="main" class="site-main">
    <h1>Search Results for: <?php echo get_search_query(); ?></h1>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
            get_template_part('template-parts/content', 'search');
        endwhile;
    else :
        echo '<p>No posts found.</p>';
    endif;
    ?>
</main>

<?php
get_footer();
?>
