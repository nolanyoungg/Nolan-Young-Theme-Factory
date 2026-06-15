<?php
/* Template Name: Blog */
?>
<div class="container blog-container">
  <h1>Resources</h1>
  <p>Explore our educational content that helps business owners make better software decisions.</p>
  <?php while ( have_posts() ) : the_post(); ?>
    <div class="blog-post">
      <h2><a href='<?php the_permalink(); ?>'><?php the_title(); ?></a></h2>
      <p><?php the_excerpt(); ?></p>
    </div>
  <?php endwhile; // End of the loop. ?>
</div>
<?php
get_footer();
