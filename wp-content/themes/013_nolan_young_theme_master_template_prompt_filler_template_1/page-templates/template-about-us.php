<?php
/*
Template Name: About Us
*/

get_header();

?>
<main id="primary" class="site-main">
  <section class="about-section-hero">
    <div class="container">
      <h1>About Northstar Websites</h1>
      <p>We are dedicated to providing high-quality website development services that help businesses grow.</p>
      <a href="#" class="btn btn-primary">Learn More About Us</a>
    </div>
  </section>

  <section class="about-section-mission">
    <div class="container">
      <h2>Our Mission</h2>
      <p>To create modern, user-friendly websites that enhance our clients' online presence and drive growth.</p>
    </div>
  </section>

  <section class="about-section-team">
    <div class="container">
      <h2>Our Team</h2>
      <div class="team-member">
        <img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/placeholder.svg' ) ); ?>" alt="Team Member 1">
        <h3>John Doe</h3>
        <p>CEO and Co-Founder</p>
      </div>
      <div class="team-member">
        <img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/placeholder.svg' ) ); ?>" alt="Team Member 2">
        <h3>Jane Smith</h3>
        <p>CTO and Co-Founder</p>
      </div>
    </div>
  </section>

  <section class="about-section-contact">
    <div class="container">
      <h2>Contact Us</h2>
      <p>Get in touch with us to learn more about our services.</p>
      <a href="/contact/" class="btn btn-primary">Contact Us</a>
    </div>
  </section>
</main>

<?php
get_footer();
