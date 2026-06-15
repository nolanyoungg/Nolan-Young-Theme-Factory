<?php
// Footer widgets section for the homepage

?>
<section class="footer-widgets-section">
    <div class="container">
        <div class="widget-column">
            <h3>About Us</h3>
            <p>Northstar Codeworks is a senior software development company that builds custom web applications, internal tools, API integrations, and automation systems.</p>
        </div>
        <div class="widget-column">
            <h3>Contact Us</h3>
            <p>Email: info@northstarcodeworks.com</p>
            <p>Phone: +1-800-123-4567</p>
        </div>
        <div class="widget-column">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter for updates and insights.</p>
            <form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
                <input type="hidden" name="action" value="nolan_young_theme_submit_newsletter">
                <?php wp_nonce_field( 'nolan_young_theme_submit_newsletter', 'newsletter_nonce' ); ?>
                <label class="screen-reader-text" for="footer-newsletter-email"><?php esc_html_e( 'Email address', '009_nolan_young_theme_testing' ); ?></label>
                <input id="footer-newsletter-email" type="email" name="email" aria-label="<?php esc_attr_e( 'Email address', '009_nolan_young_theme_testing' ); ?>" required>
                <button type="submit" class="btn secondary-btn">Subscribe</button>
            </form>
        </div>
    </div>
</section>
