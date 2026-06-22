<?php
/**
 * Single Service Highlight Template Part
 *
 */
?>

<div class="single-service-highlight-section">
    <div class="container">
        <h2>Service Overview</h2>
        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/icons/icon1.svg'); ?>" alt="Service Icon 1">
        <p>We provide comprehensive Service 1 solutions tailored to meet your business needs. Our team is dedicated to delivering high-quality results and exceeding your expectations.</p>
    </div>
</div>

<style>
.single-service-highlight-section {
    background-color: #f4f7fb;
    padding: 80px 0;
    text-align: center;
}

.single-service-highlight-section h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.single-service-highlight-section img {
    max-width: 50px;
    height: auto;
    margin-bottom: 20px;
    display: block;
}

.single-service-highlight-section p {
    font-size: 1rem;
    line-height: 1.6;
}
</style>
