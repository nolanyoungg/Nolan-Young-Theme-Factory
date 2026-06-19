<?php
/*
Template Name: Services
*/
get_header();
?>

<main id="primary" class="site-main">
    <section class="services-hero">
        <div class="container">
            <h1>Our Services</h1>
            <p>We offer a range of services to help your business grow online.</p>
            <a href="/contact/" class="btn btn-primary">Contact Us</a>
        </div>
    </section>

    <section class="services-cards">
        <div class="container">
            <h2>What We Do</h2>
            <div class="service-cards">
                <?php
                // Example service cards
                $services = [
                    [
                        'title' => 'Website Design',
                        'description' => 'Modern, user-friendly website design to enhance your brand.',
                        'image' => get_template_directory_uri() . '/assets/images/portfolio/website_design.jpg'
                    ],
                    [
                        'title' => 'WordPress Development',
                        'description' => 'Custom WordPress development for robust online presence.',
                        'image' => get_template_directory_uri() . '/assets/images/portfolio/wordpress_development.jpg'
                    ],
                    // Add more services as needed
                ];

                foreach ($services as $service) {
                    echo '<div class="service-card">';
                    echo '<img src="' . esc_url($service['image']) . '" alt="' . esc_attr($service['title']) . '">';
                    echo '<h3>' . esc_html($service['title']) . '</h3>';
                    echo '<p>' . esc_html($service['description']) . '</p>';
                    echo '</div>';
                }
                ?>
            </div>
        </div>
    </section>

    <section class="services-process">
        <div class="container">
            <h2>Our Process</h2>
            <p>We understand that every project is unique. Our process involves discovery, planning, design, development, and ongoing support to ensure your vision becomes a reality.</p>
        </div>
    </section>

    <section class="services-faq">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-accordion">
                <?php
                // Example FAQs
                $faqs = [
                    [
                        'question' => 'How long does the project take?',
                        'answer' => 'The duration varies based on the scope and complexity of the project.'
                    ],
                    [
                        'question' => 'Do you offer maintenance services?',
                        'answer' => 'Yes, we provide ongoing support and maintenance for your website.'
                    ],
                    // Add more FAQs as needed
                ];

                foreach ($faqs as $faq) {
                    echo '<div class="faq-item">';
                    echo '<h3>' . esc_html($faq['question']) . '</h3>';
                    echo '<p>' . esc_html($faq['answer']) . '</p>';
                    echo '</div>';
                }
                ?>
            </div>
        </div>
    </section>

    <section class="services-contact">
        <div class="container">
            <h2>Contact Us</h2>
            <p>Get in touch with our team to learn more about what we can do for your business.</p>
            <a href="/contact/" class="btn btn-primary">Contact Us</a>
        </div>
    </section>
</main>

<?php
get_footer();
?>