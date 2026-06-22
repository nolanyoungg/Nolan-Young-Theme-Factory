<section class="testimonials">
    <h2 class="section-title">What Our Clients Say</h2>
    <div class="testimonial-slider">
        <?php for ($i = 0; $i < 3; $i++): ?>
            <div class="testimonial-card">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/placeholder.svg" alt="Client Avatar">
                <h3 class="client-name">John Doe</h3>
                <p class="testimonial-quote">"Northstar Websites exceeded our expectations. Their team is highly professional and delivers exceptional results."</p>
            </div>
        <?php endfor; ?>
    </div>
</section>
