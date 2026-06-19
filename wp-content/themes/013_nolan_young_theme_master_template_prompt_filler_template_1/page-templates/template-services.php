<?php
/*
Template Name: Services
*/

get_header();

?>
<main id="primary" class="site-main">
  <section class="services-section-hero">
    <div class="container">
      <h1>Our Services</h1>
      <p>We offer a range of services to help businesses achieve their online goals.</p>
      <a href="#" class="btn btn-primary">Explore Our Services</a>
    </div>
  </section>

  <section class="services-section-overview">
    <div class="container">
      <h2>What We Offer</h2>
      <div class="service-card">
        <img src="/assets/images/services/service-1.jpg" alt="Service 1">
        <h3>Web Design</h3>
        <p>Custom web design solutions that meet your business needs.</p>
        <a href="#" class="btn btn-secondary">Learn More</a>
      </div>
      <div class="service-card">
        <img src="/assets/images/services/service-2.jpg" alt="Service 2">
        <h3>Web Development</h3>
        <p>Expert web development for modern, scalable websites.</p>
        <a href="#" class="btn btn-secondary">Learn More</a>
      </div>
      <div class="service-card">
        <img src="/assets/images/services/service-3.jpg" alt="Service 3">
        <h3>SEO Optimization</h3>
        <p>Improve your website's visibility on search engines.</p>
        <a href="#" class="btn btn-secondary">Learn More</a>
      </div>
    </div>
  </section>

  <section class="services-section-contact">
    <div class="container">
      <h2>Contact Us for a Quote</h2>
      <p>Get in touch with us to discuss your specific needs.</p>
      <a href="/contact/" class="btn btn-primary">Contact Us</a>
    </div>
  </section>
</main>

<?php
get_footer();
