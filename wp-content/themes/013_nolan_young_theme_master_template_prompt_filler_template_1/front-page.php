<?php
// Front page template for NOLAN-YOUNG Theme
if (!defined('ABSPATH')) exit; // Exit if accessed directly

get_header();

?>
<main id="site-main">
  <!-- Section 01: High-Impact Hero -->
  <section class="hero-section">
    <div class="hero-content">
      <h1>Welcome to Northstar Websites</h1>
      <p>We help businesses grow through innovative WordPress solutions.</p>
      <a href="/services/" class="btn btn-primary">View Our Services</a>
      <a href="/contact/" class="btn btn-secondary">Contact Us Now</a>
    </div>
  </section>

  <!-- Section 02: Featured Work Strip -->
  <section class="featured-work-strip">
    <div class="work-item"><a href="/work/project-1/"><img src="assets/images/hero/project-1.jpg" alt="Project 1"></a></div>
    <div class="work-item"><a href="/work/project-2/"><img src="assets/images/hero/project-2.jpg" alt="Project 2"></a></div>
    <div class="work-item"><a href="/work/project-3/"><img src="assets/images/hero/project-3.jpg" alt="Project 3"></a></div>
  </section>

  <!-- Section 03: Brand Statement -->
  <section class="brand-statement">
    <h2>Our Commitment</h2>
    <p>We deliver exceptional WordPress solutions that exceed your expectations.</p>
  </section>

  <!-- Section 04: Services Overview -->
  <section class="services-overview">
    <?php get_template_part('template-parts/content-all-services'); ?>
  </section>

  <!-- Section 05: Signature Process -->
  <section class="signature-process">
    <h2>Our Process</h2>
    <p>We guide you every step of the way from discovery to delivery.</p>
  </section>

  <!-- Section 06: Featured Work Filter -->
  <section class="featured-work-filter">
    <?php get_template_part('template-parts/content-featured-work'); ?>
  </section>

  <!-- Section 07: Featured Case Study -->
  <section class="featured-case-study">
    <h2>Case Study</h2>
    <p>A detailed look at how we solved a complex problem for our client.</p>
  </section>

  <!-- Section 08: Before-and-After or Comparison Feature -->
  <section class="before-after">
    <h2>Before & After</h2>
    <img src="assets/images/hero/before-after.jpg" alt="Before and After Image">
  </section>

  <!-- Section 09: Packages and Engagement Options -->
  <section class="packages">
    <?php get_template_part('template-parts/content-packages'); ?>
  </section>

  <!-- Section 10: Business Solutions Feature -->
  <section class="business-solutions">
    <h2>Business Solutions</h2>
    <p>We offer tailored solutions to fit your business needs.</p>
  </section>

  <!-- Section 11: Customer Experience Feature -->
  <section class="customer-experience">
    <h2>Customer Satisfaction</h2>
    <p>We prioritize a seamless and enjoyable customer experience.</p>
  </section>

  <!-- Section 12: Testimonials and Proof -->
  <section class="testimonials">
    <?php get_template_part('template-parts/content-testimonials'); ?>
  </section>

  <!-- Section 13: Blog Preview -->
  <section class="blog-preview">
    <?php get_template_part('template-parts/content-blog-preview'); ?>
  </section>

  <!-- Section 14: FAQ -->
  <section class="faq">
    <?php get_template_part('template-parts/content-faq'); ?>
  </section>

  <!-- Section 15: Final CTA -->
  <section class="final-cta">
    <h2>Ready to Grow?</h2>
    <a href="/contact/" class="btn btn-primary">Contact Us</a>
    <a href="/work/" class="btn btn-secondary">View Our Work</a>
  </section>
</main>

<?php
get_footer();
