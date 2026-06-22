<?php
/**
 * Template Name: Contact
 */
get_header(); ?>

?>
<section class="contact-section">
    <div class="container">
        <h1>Contact Us</h1>
        <p>Get in touch with Northstar Websites to discuss your web development needs. We'd love to hear from you!</p>

        <form action="#" method="post">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="4" required></textarea>

            <button type="submit">Send Message</button>
        </form>
    </div>
</section>

<?php get_footer(); ?>
