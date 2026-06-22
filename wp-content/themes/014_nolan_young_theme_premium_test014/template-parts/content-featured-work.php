<?php
/**
 * Featured Work Template Part
 *
 */
?>

<div class="featured-work-section">
    <div class="container">
        <h2>Featured Projects</h2>
        <div class="work-items">
            <?php for ($i = 1; $i <= 3; $i++): ?>
                <div class="work-item">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/placeholder.svg'); ?>" alt="Project <?php echo esc_attr($i); ?>">
                    <h3>Project Title <?php echo esc_html($i); ?></h3>
                    <p>Description of the project. We transformed this business with a custom WordPress solution, resulting in increased traffic and conversions.</p>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</div>

<style>
.featured-work-section {
    background-color: #f4f7fb;
    padding: 80px 0;
    text-align: center;
}

.featured-work-section h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.work-items {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.work-item {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: calc(33.33% - 20px);
}

.work-item img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

.work-item h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
}

.work-item p {
    font-size: 1rem;
    line-height: 1.6;
}
</style>
