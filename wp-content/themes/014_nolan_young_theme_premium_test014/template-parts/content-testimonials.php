<?php
/**
 * Testimonials Template Part
 *
 */
?>

<div class="testimonials-section">
    <div class="container">
        <h2>What Our Clients Say</h2>
        <div class="testimonial-items">
            <?php for ($i = 1; $i <= 3; $i++): ?>
                <div class="testimonial-item">
                    <blockquote>"Northstar Websites exceeded our expectations. Their team is professional, reliable, and highly skilled. We are thrilled with the results of our project."</blockquote>
                    <p>- Client Name <?php echo esc_html($i); ?>, Company <?php echo esc_html('Company ' . $i); ?></p>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</div>

<style>
.testimonials-section {
    background-color: #ffffff;
    padding: 80px 0;
    text-align: center;
}

.testimonials-section h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.testimonial-items {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.testimonial-item {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: calc(33.33% - 20px);
}

.testimonial-item blockquote {
    font-style: italic;
    margin-bottom: 10px;
}

.testimonial-item p {
    font-size: 1rem;
    line-height: 1.6;
}
</style>
