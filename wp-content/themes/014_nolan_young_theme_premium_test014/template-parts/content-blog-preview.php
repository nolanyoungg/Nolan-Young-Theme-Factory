<?php
/**
 * Blog Preview Template Part
 *
 */
?>

<div class="blog-preview-section">
    <div class="container">
        <h2>From Our Blog</h2>
        <div class="blog-items">
            <?php for ($i = 1; $i <= 3; $i++): ?>
                <div class="blog-item">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/placeholder.svg'); ?>" alt="Blog Post Image <?php echo esc_attr($i); ?>">
                    <h3>Blog Post Title <?php echo esc_html($i); ?></h3>
                    <p>Summary of the blog post. Learn how Northstar Websites can help you grow your business through innovative WordPress solutions.</p>
                    <a href="#" class="read-more">Read More</a>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</div>

<style>
.blog-preview-section {
    background-color: #f4f7fb;
    padding: 80px 0;
    text-align: center;
}

.blog-preview-section h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.blog-items {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.blog-item {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: calc(33.33% - 20px);
}

.blog-item img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin-bottom: 20px;
}

.blog-item h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
}

.blog-item p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 20px;
}

.read-more {
    background-color: #2563eb;
    color: #ffffff;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.read-more:hover {
    background-color: #1d4ed8;
}
</style>
