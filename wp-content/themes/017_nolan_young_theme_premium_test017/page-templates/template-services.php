<?php
/**
 * Template Name: Services
 */
get_header(); ?>

?>
<section class="services-section">
    <div class="container">
        <h1>Our Services</h1>
        <p>We offer a range of services to help your business thrive online. From design to development, we provide comprehensive solutions tailored to your needs.</p>

        <div class="service-cards">
            <div class="card">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/design-icon.svg" alt="Design Icon">
                <h2>WordPress Design</h2>
                <p>We create visually appealing and user-friendly websites that align with your brand identity.</p>
            </div>
            <div class="card">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/development-icon.svg" alt="Development Icon">
                <h2>WordPress Development</h2>
                <p>We build robust and scalable websites that meet the demands of your business.</p>
            </div>
            <div class="card">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/support-icon.svg" alt="Support Icon">
                <h2>WordPress Support</h2>
                <p>We provide ongoing support to ensure your website runs smoothly and efficiently.</p>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
