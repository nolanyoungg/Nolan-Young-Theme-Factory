<?php
/**
 * Template part for displaying the all services section on the homepage.
 *
 * @link #
 *
 * @package NOLAN-YOUNG-theme-000
 */
?>

<div class="all-services-section">
    <div class="container">
        <h2>Our Services</h2>
        <div class="service-cards">
            <!-- Placeholder for service cards -->
            <div class="service-card">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/service-icon-1.png'); ?>" alt="Service Icon 1" loading="lazy">
                <h3>Web Design</h3>
                <p>We create visually stunning and user-friendly websites that align with your brand identity.</p>
                <a href="/services/web-design/" class="btn btn-text">Learn More</a>
            </div>
            <div class="service-card">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/service-icon-2.png'); ?>" alt="Service Icon 2" loading="lazy">
                <h3>Development</h3>
                <p>Custom-built WordPress solutions that meet your specific business needs.</p>
                <a href="/services/development/" class="btn btn-text">Learn More</a>
            </div>
            <!-- Add more service cards as needed -->
        </div>
    </div>
</div>