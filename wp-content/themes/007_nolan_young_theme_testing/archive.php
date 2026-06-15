<?php get_header(); ?>
?>
<div id="primary" class="content-area">
  <main id="main" class="site-main">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <?php the_title('<h2>', '</h2>'); ?>
      <?php the_excerpt(); ?>
    <?php endwhile; endif; ?>
  </main><!-- #main -->
</div><!-- #primary -->
<?php get_footer(); ?>
