<?php
/**
 * Process Template Part
 *
 */
?>

<div class="process-section">
    <div class="container">
        <h2>Our Process</h2>
        <div class="process-steps">
            <?php for ($i = 1; $i <= 4; $i++): ?>
                <div class="process-step">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/icons/icon' . esc_attr($i) . '.svg'); ?>" alt="Process Step Icon <?php echo esc_attr($i); ?>">
                    <h3>Step Title <?php echo esc_html($i); ?></h3>
                    <p>Describe the process step. Our team will work closely with you to ensure each step is completed efficiently and effectively.</p>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</div>

<style>
.process-section {
    background-color: #ffffff;
    padding: 80px 0;
    text-align: center;
}

.process-section h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.process-steps {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.process-step {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: calc(25% - 20px);
}

.process-step img {
    max-width: 50px;
    height: auto;
    margin-bottom: 20px;
    display: block;
}

.process-step h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
}

.process-step p {
    font-size: 1rem;
    line-height: 1.6;
}
</style>
