<?php
// Footer template for NOLAN-YOUNG Theme
if (!defined('ABSPATH')) exit; // Exit if accessed directly
?>
<footer id="site-footer">
  <div class="container">
    <section class="cta-band">
      <h2>Websites that help businesses grow.</h2>
      <p>Let's work together to create a website that drives your success.</p>
      <a href="/contact/" class="btn btn-primary btn-header-cta">Contact Us</a>
    </section>

    <div class="brand-statement">
      <h3>Northstar Websites</h3>
      <p>A leading WordPress design and development company.</p>
    </div>

    <section class="services-column">
      <h4>Our Services</h4>
      <ul>
        <li><a href="/services/web-design/">Web Design</a></li>
        <li><a href="/services/web-development/">Web Development</a></li>
        <li><a href="/services/content-creation/">Content Creation</a></li>
        <li><a href="/services/maintenance-support/">Maintenance & Support</a></li>
      </ul>
    </section>

    <section class="company-column">
      <h4>Company</h4>
      <ul>
        <li><a href="/about-us/">About Us</a></li>
        <li><a href="/work/">Work</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </section>

    <section class="blog-column">
      <h4>From Our Blog</h4>
      <ul>
        <li><a href="/blog/post-1/">Blog Post 1</a></li>
        <li><a href="/blog/post-2/">Blog Post 2</a></li>
        <li><a href="/blog/post-3/">Blog Post 3</a></li>
      </ul>
    </section>

    <div class="contact-block">
      <h4>Contact Us</h4>
      <p>Email: info@northstarwebsites.com</p>
      <p>Phone: (123) 456-7890</p>
    </div>

    <section class="legal-row">
      <p>&copy; <?php echo date('Y'); ?> Northstar Websites. All rights reserved.</p>
      <ul>
        <li><a href="/privacy-policy/">Privacy Policy</a></li>
        <li><a href="/terms-of-service/">Terms of Service</a></li>
      </ul>
    </section>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
