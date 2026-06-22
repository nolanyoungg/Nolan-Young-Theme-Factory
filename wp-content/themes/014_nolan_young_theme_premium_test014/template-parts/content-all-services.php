<?php
/**
 * All Services Template Part
 *
 */
?>

<div class="all-services-section">
    <div class="container">
        <h2>Our Services</h2>
        <div class="service-items">
            <?php for ($i = 1; $i <= 3; $i++): ?>
                <div class="service-item">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/icons/icon' . esc_attr($i) . '.svg'); ?>" alt="Service Icon <?php echo esc_attr($i); ?>">
                    <h3>Service Title <?php echo esc_html($i); ?></h3>
                    <p>We provide comprehensive <?php echo esc_html('Service ' . $i); ?> solutions tailored to meet your business needs.</p>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</div>

<style>
.all-services-section {
    background-color: #ffffff;
    padding: 80px 0;
    text-align: center;
}

.all-services-section h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.service-items {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.service-item {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: calc(33.33% - 20px);
}

.service-item img {
    max-width: 50px;
    height: auto;
    margin-bottom: 20px;
    display: block;
}

.service-item h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
}

.service-item p {
    font-size: 1rem;
    line-height: 1.6;
}
</style>
