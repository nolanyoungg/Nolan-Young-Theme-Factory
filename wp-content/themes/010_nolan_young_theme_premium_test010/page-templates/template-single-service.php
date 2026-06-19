<?php
/*
Template Name: Single Service
*/
get_header();
?>

<main class="single-service">
    <section class="hero">
        <h1><?php the_title(); ?></h1>
        <p><?php the_excerpt(); ?></p>
        <a href="#contact" class="btn btn-primary">Get in Touch</a>
    </section>

    <section class="service-overview">
        <?php the_content(); ?>
    </section>

    <section class="ideal-customer">
        <h2>Ideal Customer Profile</h2>
        <p>Our services are best suited for businesses looking to grow their online presence with modern, scalable solutions. Whether you're a startup or an established enterprise, we can help you achieve your digital goals.</p>
    </section>

    <section class="deliverables">
        <h2>Deliverables</h2>
        <ul>
            <li>Custom WordPress design and development</li>
            <li>Optimized for SEO and performance</li>
            <li>Responsive layout for all devices</li>
            <li>Secure hosting and maintenance</li>
            <!-- Add more deliverables as needed -->
        </ul>
    </section>

    <section class="process">
        <h2>Process</h2>
        <p>We follow a structured process to ensure your project is executed smoothly:</p>
        <ol>
            <li>Discovery and planning</li>
            <li>Design phase</li>
            <li>Development and testing</li>
            <li>Launch and support</li>
        </ol>
    </section>

    <section class="related-services">
        <h2>Related Services</h2>
        <p>Explore other services we offer that complement your current project:</p>
        <div class="related-service-card">
            <img src="assets/images/service1.svg" alt="Web Design">
            <h3>Web Design</h3>
            <a href="#" class="btn btn-secondary">Learn More</a>
        </div>

        <div class="related-service-card">
            <img src="assets/images/service2.svg" alt="Web Development">
            <h3>Web Development</h3>
            <a href="#" class="btn btn-secondary">Learn More</a>
        </div>

        <!-- Add more related services as needed -->
    </section>

    <section class="faq">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-item">
            <h3>How much does this service cost?</h3>
            <p>The cost varies based on the scope of the project. We provide detailed quotes after a consultation.</p>
        </div>

        <div class="faq-item">
            <h3>Can I customize the design to match my brand?</h3>
            <p>Absolutely! We work closely with clients to ensure the design aligns perfectly with their branding and vision.</p>
        </div>

        <!-- Add more FAQ items as needed -->
    </section>

    <section class="contact-us">
        <a href="#contact" class="btn btn-primary">Get in Touch</a>
    </section>
</main>

<?php
get_footer();
?>
