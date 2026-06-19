<?php
/**
 * Template part for displaying the blog preview section on the homepage.
 *
 * @link #
 *
 * @package NOLAN-YOUNG-theme-000
 */
?>

<div class="blog-preview-section">
    <div class="container">
        <h2>From Our Blog</h2>
        <div class="blog-card-grid">
            <!-- Placeholder for blog card items -->
            <div class="blog-card">
                <a href="/blog/blog-post-1/">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/blog-post-1.jpg'); ?>" alt="Blog Post 1" loading="lazy">
                    <h3>Blog Post Title 1</h3>
                    <p>A brief excerpt from the blog post.</p>
                </a>
            </div>
            <div class="blog-card">
                <a href="/blog/blog-post-2/">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/blog-post-2.jpg'); ?>" alt="Blog Post 2" loading="lazy">
                    <h3>Blog Post Title 2</h3>
                    <p>A brief excerpt from the blog post.</p>
                </a>
            </div>
            <!-- Add more blog card items as needed -->
        </div>
    </div>
</div>