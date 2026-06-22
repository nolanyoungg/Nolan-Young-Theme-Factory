<footer class="site-footer">
    <div class="container">
        <div class="footer-cta-band">
            <h2>Websites that help businesses grow.</h2>
            <a href="<?php echo home_url('/contact/'); ?>" class="btn btn-primary">Get Started</a>
        </div>

        <div class="footer-columns">
            <div class="column services">
                <h3>Services</h3>
                <?php
                $services = [
                    'Web Design',
                    'Development',
                    'SEO Optimization',
                    'Hosting Solutions',
                    'Maintenance'
                ];
                foreach ($services as $service) {
                    echo '<a href="' . home_url('/' . strtolower($service) . '/') . '">' . esc_html($service) . '</a>';
                }
                ?>
            </div>

            <div class="column company">
                <h3>Company</h3>
                <?php
                $company_links = [
                    'About Us',
                    'Our Work',
                    'Blog',
                    'Contact'
                ];
                foreach ($company_links as $link) {
                    echo '<a href="' . home_url('/' . strtolower($link) . '/') . '">' . esc_html($link) . '</a>';
                }
                ?>
            </div>

            <div class="column blog">
                <h3>Blog</h3>
                <?php
                $blog_posts = [
                    'WordPress Tips',
                    'SEO Best Practices',
                    'Design Trends',
                    'Development Updates'
                ];
                foreach ($blog_posts as $post) {
                    echo '<a href="' . home_url('/blog/' . strtolower(str_replace(' ', '-', $post)) . '/') . '">' . esc_html($post) . '</a>';
                }
                ?>
            </div>

            <div class="column contact">
                <h3>Contact Us</h3>
                <p>Northstar Websites<br>123 Business Lane<br>Business City, 12345</p>
                <a href="tel:+1234567890" class="phone">+1 (234) 567-890</a>
                <a href="mailto:info@northstarwebsites.com" class="email">info@northstarwebsites.com</a>
            </div>
        </div>

        <div class="footer-legal">
            <p>&copy; <?php echo date('Y'); ?> Northstar Websites. All rights reserved.</p>
            <nav class="legal-links">
                <a href="<?php echo home_url('/terms-of-service/'); ?>">Terms of Service</a> |
                <a href="<?php echo home_url('/privacy-policy/'); ?>">Privacy Policy</a>
            </nav>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
