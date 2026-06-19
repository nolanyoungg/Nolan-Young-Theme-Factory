<?php
/*
Template Name: Policy
*/

get_header();

?>
<main id="primary" class="site-main">
  <section class="policy-section-hero">
    <div class="container">
      <h1>Privacy Policy</h1>
      <p>Our commitment to protecting your privacy.</p>
    </div>
  </section>

  <section class="policy-section-content">
    <div class="container">
      <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <article class="policy-content">
          <?php the_content(); ?>
        </article>
      <?php endwhile; endif; ?>
    </div>
  </section>
</main>

<?php
get_footer();
