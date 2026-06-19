<?php
/*
Template Name: Contact
*/
get_header();
?>

<main class="contact">
    <section class="hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Get in touch with us today.</p>
    </section>

    <section class="contact-form">
        <?php echo do_shortcode('[contact-form-7 id="456" title="Contact form 1"]'); ?>
    </section>

    <section class="contact-info">
        <h2>Contact Information</h2>
        <p>Email: info@northstarwebsites.com</p>
        <p>Phone: (123) 456-7890</p>
        <!-- Add more contact details as needed -->
    </section>
</main>

<?php
get_footer();
?>
