<?php
/*
Template Name: Single Service
*/
get_header();
?>

<main id="primary" class="site-main">
    <section class="service-hero">
        <div class="container">
            <h1><?php the_title(); ?></h1>
            <p>We specialize in creating websites that help businesses grow. Our team of experts delivers custom solutions tailored to your unique needs.</p>
        </div>
    </section>

    <section class="service-overview">
        <div class="container">
            <h2>Overview</h2>
            <p><?php the_content(); ?></p>
        </div>
    </section>

    <section class="service-ideal-customer">
        <div class="container">
            <h2>Ideal Customer</h2>
            <p>We are perfect for businesses seeking a modern, user-friendly website that enhances their online presence and drives engagement.</p>
        </div>
    </section>

    <section class="service-deliverables">
        <div class="container">
            <h2>Deliverables</h2>
            <ul>
                <li>Custom WordPress theme design and development</li>
                <li>User-friendly, mobile-responsive website architecture</li>
                <li>SEO-optimized content integration</li>
                <li>Regular updates and maintenance services</li>
            </ul>
        </div>
    </section>

    <section class="service-process">
        <div class="container">
            <h2>Our Process</h2>
            <p>From discovery to delivery, our process ensures a seamless collaboration with you. We listen, plan, design, build, and support your website every step of the way.</p>
        </div>
    </section>

    <section class="service-visuals">
        <div class="container">
            <h2>Visual Content</h2>
            <!-- Placeholder for visual content -->
        </div>
    </section>

    <section class="service-packages">
        <div class="container">
            <h2>Packages and Engagement Models</h2>
            <div class="package-cards">
                <!-- Placeholder for package cards -->
            </div>
        </div>
    </section>

    <section class="service-related-services">
        <div class="container">
            <h2>Related Services</h2>
            <div class="related-service-cards">
                <!-- Placeholder for related service cards -->
            </div>
        </div>
    </section>

    <section class="service-faq">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-accordion">
                <!-- Placeholder for FAQ accordion -->
            </div>
        </div>
    </section>

    <section class="service-contact-form">
        <div class="container">
            <h2>Contact Us</h2>
            <?php get_template_part('template-parts/content-single-service-highlight'); ?>
            <a href="/contact/" class="btn btn-primary">Contact Us</a>
        </div>
    </section>
</main>

<?php
get_footer();
?>