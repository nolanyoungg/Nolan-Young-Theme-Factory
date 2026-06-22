<?php
/**
 * Style Pillars Template Part
 *
 */
?>

<div class="style-pillars-section">
    <div class="container">
        <h2>Style Pillars</h2>
        <div class="pillar-items">
            <?php for ($i = 1; $i <= 3; $i++): ?>
                <div class="pillar-item">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/icons/icon' . esc_attr($i) . '.svg'); ?>" alt="Pillar Icon <?php echo esc_attr($i); ?>">
                    <h3>Pillar Title <?php echo esc_html($i); ?></h3>
                    <p>Describe the style pillar. Northstar Websites is committed to delivering a unique and personalized experience for each of our clients.</p>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</div>

<style>
.style-pillars-section {
    background-color: #f4f7fb;
    padding: 80px 0;
    text-align: center;
}

.style-pillars-section h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.pillar-items {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.pillar-item {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: calc(33.33% - 20px);
}

.pillar-item img {
    max-width: 50px;
    height: auto;
    margin-bottom: 20px;
    display: block;
}

.pillar-item h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
}

.pillar-item p {
    font-size: 1rem;
    line-height: 1.6;
}
</style>
