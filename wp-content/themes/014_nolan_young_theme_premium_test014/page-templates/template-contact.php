<?php
/*
Template Name: Contact Us
*/
get_header(); ?>

?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <!-- Section 01: High-Impact Hero -->
        <section class="hero-section">
            <div class="container">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you. Please fill out the form below or reach out via email and phone.</p>
                <a href="#" class="cta-button">Send Message</a>
            </div>
        </section>

        <!-- Section 02: Contact Form -->
        <section class="contact-form-section">
            <div class="container">
                <?php echo do_shortcode('[contact-form-7 id="123" title="Contact form 1"]'); ?>
            </div>
        </section>

    </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
