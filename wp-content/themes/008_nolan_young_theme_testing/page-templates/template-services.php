<?php
/* Template Name: Services */
?>
<div class="container services-container">
  <h1>Our Core Services</h1>
  <p>We offer a range of services to help you build and maintain serious business software. Choose the path that best fits your project needs.</p>
  <div class="service-cards">
    <?php while ( have_posts() ) : the_post(); ?>
      <div class="service-card">
        <h2><?php the_title(); ?></h2>
        <p><?php the_content(); ?></p>
      </div>
    <?php endwhile; // End of the loop. ?>
  </div>
</div>
<?php
get_footer();
