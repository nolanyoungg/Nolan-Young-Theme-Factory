<?php
/*
Template Name: Single Service
*/

get_header();

?>
<main id="primary" class="site-main">
  <section class="service-section-hero">
    <div class="container">
      <h1><?php the_title(); ?></h1>
      <p>Discover how we can help you with <?php the_title(); ?>.</p>
      <a href="#" class="btn btn-primary">Get a Quote</a>
    </div>
  </section>

  <section class="service-section-overview">
    <div class="container">
      <?php the_content(); ?>
    </div>
  </section>

  <section class="service-section-ideal-customer">
    <div class="container">
      <h2>Ideal Customer</h2>
      <p>This service is perfect for businesses looking to enhance their online presence through <?php the_title(); ?>.</p>
    </div>
  </section>

  <section class="service-section-deliverables">
    <div class="container">
      <h2>Deliverables</h2>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  </section>

  <section class="service-section-process">
    <div class="container">
      <h2>Process</h2>
      <p>Our process for <?php the_title(); ?> includes several key steps to ensure a successful outcome.</p>
    </div>
  </section>

  <section class="service-section-related-services">
    <div class="container">
      <h2>Related Services</h2>
      <div class="related-service-grid">
        <div class="related-service-card">
          <h3>Strategy-Led Web Design</h3>
          <p>Clarify the message, structure the content, and create a site that earns trust quickly.</p>
          <a href="/services/web-design/" class="btn btn-secondary">Learn More</a>
        </div>
        <div class="related-service-card">
          <h3>Custom WordPress Development</h3>
          <p>Build flexible, maintainable themes and templates tailored to your business goals.</p>
          <a href="/services/web-development/" class="btn btn-secondary">Learn More</a>
        </div>
        <div class="related-service-card">
          <h3>Care & Support</h3>
          <p>Keep the site fast, secure, and updated with an ongoing maintenance plan.</p>
          <a href="/services/maintenance-support/" class="btn btn-secondary">Learn More</a>
        </div>
      </div>
    </div>
  </section>

  <section class="service-section-contact">
    <div class="container">
      <h2>Contact Us for a Quote</h2>
      <p>Get in touch with us to discuss your specific needs.</p>
      <a href="/contact/" class="btn btn-primary">Contact Us</a>
    </div>
  </section>
</main>

<?php
get_footer();
