<?php
get_header();

?>
<main id="primary" class="site-main">
  <?php if (have_posts()) : ?>
    <header class="page-header">
      <?php the_archive_title('<h1 class="page-title">', '</h1>'); ?>
    </header>

    <?php while (have_posts()) : the_post(); ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <header class="entry-header">
          <?php the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>'); ?>
        </header>

        <div class="entry-summary">
          <?php the_excerpt(); ?>
        </div>
      </article>
    <?php endwhile; ?>

    <?php if ( function_exists( 'the_posts_navigation' ) ) { the_posts_navigation(); } else { echo '<nav class="pagination-nav" aria-label="Archive navigation"><span class="pagination-link is-current">1</span></nav>'; } ?>
  <?php else : ?>
    <?php get_template_part('template-parts/content', 'none'); ?>
  <?php endif; ?>
</main>

<?php
get_footer();
