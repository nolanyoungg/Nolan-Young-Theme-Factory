<?php
/**
 * Template Part for All Services Section
 *
 * @package 010_nolan_young_theme_premium_test010
 */

?>
<section class="all-services">
    <div class="container">
        <h2>Our Services</h2>
        <div class="service-cards">
            <?php
            $services = array(
                'Web Design' => 'Crafting visually appealing and user-friendly websites.',
                'Development' => 'Building robust and scalable WordPress solutions.',
                'SEO Optimization' => 'Improving website visibility in search engine results.',
                'Content Management' => 'Managing and updating website content efficiently.',
                'Support' => 'Providing ongoing support for website maintenance and enhancements.'
            );

            foreach ($services as $service_name => $description) {
                ?>
                <div class="service-card">
                    <h3><?php echo esc_html($service_name); ?></h3>
                    <p><?php echo esc_html($description); ?></p>
                    <a href="<?php echo esc_url(home_url('/services/' . strtolower(str_replace(' ', '-', $service_name)))); ?>" class="secondary-button">Learn More</a>
                </div>
                <?php
            }
            ?>
        </div>
    </div>
</section>
