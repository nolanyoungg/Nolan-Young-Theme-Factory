<section class="all-services">
    <h2 class="section-title">Our Services</h2>
    <div class="services-grid">
        <?php $services = ['Design', 'Development', 'Support']; ?>
        <?php foreach ($services as $service): ?>
            <div class="service-card">
                <h3 class="service-title"><?php echo esc_html($service); ?></h3>
                <p class="service-description">A detailed description of what we offer in this service.</p>
                <a href="#" class="secondary-button">Learn More</a>
            </div>
        <?php endforeach; ?>
    </div>
</section>
