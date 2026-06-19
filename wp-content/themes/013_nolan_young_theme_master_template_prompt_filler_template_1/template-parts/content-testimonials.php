<?php
/**
 * Template part for displaying the testimonials section on the homepage.
 *
 * @link #
 *
 * @package NOLAN-YOUNG-theme-000
 */
?>

<div class="testimonials-section">
    <div class="container">
        <h2>What Our Clients Say</h2>
        <div class="testimonial-items">
            <!-- Placeholder for testimonial items -->
            <div class="testimonial-item">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/client-avatar-1.jpg'); ?>" alt="Client Avatar 1" loading="lazy">
                <blockquote>
                    "Northstar Websites exceeded our expectations with their exceptional service and attention to detail."
                    <span>- John Doe, Client</span>
                </blockquote>
            </div>
            <div class="testimonial-item">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/client-avatar-2.jpg'); ?>" alt="Client Avatar 2" loading="lazy">
                <blockquote>
                    "Their expertise in WordPress development is top-notch, and we're thrilled with the results."
                    <span>- Jane Smith, Client</span>
                </blockquote>
            </div>
            <!-- Add more testimonial items as needed -->
        </div>
    </div>
</div>