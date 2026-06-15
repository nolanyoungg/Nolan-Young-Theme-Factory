<?php /** * Template Name: Blog */ ?>
?>
<div id="primary" class="content-area">
  <main id="main" class="site-main">
    <section class="blog-posts">
      <h2>Latest Resources</h2>
      <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article class="post-summary">
          <h3><a href='<?php the_permalink(); ?>'><?php the_title(); ?></a></h3>
          <p><?php the_excerpt(); ?></p>
        </article>
      <?php endwhile; endif; ?>
    </section>
  </main><!-- #main -->
</div><!-- #primary -->
