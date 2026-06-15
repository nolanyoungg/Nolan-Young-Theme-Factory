<?php
/* Template Name: Work */
?>
<div class="container work-container">
  <h1>Our Portfolio</h1>
  <p>Explore our credible software outcomes through realistic case studies and project summaries.</p>
  <div class="work-items">
    <?php while ( have_posts() ) : the_post(); ?>
      <div class="work-item">
        <h2><?php the_title(); ?></h2>
        <p><strong>Client Type:</strong> <?php echo get_post_meta(get_the_ID(), 'client_type', true); ?></p>
        <p><strong>Challenge:</strong> <?php echo get_post_meta(get_the_ID(), 'challenge', true); ?></p>
        <p><strong>Solution:</strong> <?php echo get_post_meta(get_the_ID(), 'solution', true); ?></p>
        <p><strong>Result:</strong> <?php echo get_post_meta(get_the_ID(), 'result', true); ?></p>
      </div>
    <?php endwhile; // End of the loop. ?>
  </div>
</div>
<?php
get_footer();
