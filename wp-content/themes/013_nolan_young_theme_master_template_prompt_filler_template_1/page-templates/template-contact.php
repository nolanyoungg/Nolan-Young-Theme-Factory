<?php
/*
Template Name: Contact
*/
get_header();
?>

<main id="primary" class="site-main">
    <section class="contact-hero">
        <div class="container">
            <h1>Contact Us</h1>
            <p>We are here to assist you with any inquiries. Please feel free to reach out.</p>
        </div>
    </section>

    <section class="contact-form">
        <div class="container">
            <h2>Get in Touch</h2>
            <?php get_template_part('template-parts/content-contact'); ?>
        </div>
    </section>

    <section class="contact-info">
        <div class="container">
            <h2>Contact Information</h2>
            <p>Email: info@northstarwebsites.com<br>Phone: +1 (555) 555-5555</p>
        </div>
    </section>
</main>

<?php
get_footer();
?>