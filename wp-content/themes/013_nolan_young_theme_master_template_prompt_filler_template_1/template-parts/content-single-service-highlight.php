<?php
/**
 * Template part for displaying a single service highlight on the homepage.
 *
 * @link #
 *
 * @package NOLAN-YOUNG-theme-000
 */
?>

<div class="single-service-highlight-section">
    <div class="container">
        <h2>Highlight Service</h2>
        <div class="service-highlight-content">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/highlight-service-image.jpg'); ?>" alt="Highlight Service Image" loading="lazy">
            <div class="service-highlight-text">
                <h3>Service Title</h3>
                <p>A detailed description of the highlighted service, outlining its benefits and how it can help your business.</p>
                <a href="/services/highlight-service/" class="btn btn-primary">Get Started</a>
            </div>
        </div>
    </div>
</div>