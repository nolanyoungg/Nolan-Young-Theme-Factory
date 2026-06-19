<?php
/*
Template Name: Contact
*/

get_header();

?>
<main id="primary" class="site-main">
  <section class="contact-section-hero">
    <div class="container">
      <h1>Contact Us</h1>
      <p>Get in touch with us for any inquiries or questions.</p>
      <a href="#" class="btn btn-primary">Send a Message</a>
    </div>
  </section>

  <section class="contact-section-form">
    <div class="container">
      <h2>Get in Touch</h2>
      <form id="contact-form" action="/wp-admin/admin-post.php" method="post">
        <input type="hidden" name="action" value="submit_contact_form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" name="phone">
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
      </form>
    </div>
  </section>

  <section class="contact-section-contact-info">
    <div class="container">
      <h2>Contact Information</h2>
      <p>Email: info@northstarwebsites.com</p>
      <p>Phone: (123) 456-7890</p>
      <p>Address: 123 Main St, Anytown, USA</p>
    </div>
  </section>
</main>

<?php
get_footer();
