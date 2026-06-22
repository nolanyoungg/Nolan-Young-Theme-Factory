<?php
get_header();
?>

<main id="main" class="site-main">
    <h1><?php echo post_type_archive_title('', false); ?></h1>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
            get_template_part('template-parts/content', 'archive');
        endwhile;
    else :
        echo '<p>No posts found.</p>';
    endif;
    ?>
</main>

<?php
get_footer();
?>
