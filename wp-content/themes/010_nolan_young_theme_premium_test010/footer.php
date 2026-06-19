<?php
    wp_footer();
    ?>
</div><!-- #page -->
<footer id="colophon" class="site-footer">
    <div class="footer-container">
        <div class="cta-band">
            <h2>Ready to Grow Your Business?</h2>
            <p>We help businesses grow with custom WordPress solutions.</p>
            <a href="/contact/" class="btn btn-primary">Contact Us</a>
        </div>
        <div class="brand-statement">
            <p>We are dedicated to delivering exceptional web development services that exceed your expectations.</p>
        </div>
        <div class="services-column">
            <h3>Services</h3>
            <ul>
                <li><a href="/services/web-design/">Web Design</a></li>
                <li><a href="/services/development/">Development</a></li>
                <li><a href="/services/support/">Support</a></li>
            </ul>
        </div>
        <div class="company-column">
            <h3>About Us</h3>
            <ul>
                <li><a href="/about/">About Northstar Websites</a></li>
                <li><a href="/work/">Our Work</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><a href="/contact/">Contact Us</a></li>
            </ul>
        </div>
        <div class="blog-column">
            <h3>Latest from the Blog</h3>
            <?php
            $recent_posts = wp_get_recent_posts(array(
                'numberposts' => 4,
                'post_status' => 'publish'
            ));
            foreach ($recent_posts as $post) : ?>
?>
                <div class="blog-card">
                    <a href="<?php echo get_permalink($post['ID']); ?>">
                        <?php if (has_post_thumbnail($post['ID'])) {
                            echo get_the_post_thumbnail($post['ID'], 'thumbnail');
                        } else { ?>
                            <img src="/assets/images/placeholder.svg" alt="Placeholder">
                        <?php } ?>
                    </a>
                    <div class="blog-card-content">
                        <h4><?php echo esc_html($post['post_title']); ?></h4>
                        <p><?php echo wp_trim_words($post['post_content'], 20); ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <div class="contact-block">
            <h3>Contact Us</h3>
            <address>123 Business Street, City, Country</address>
            <a href="mailto:info@northstarwebsites.com">Email Us</a>
            <p>Phone: +1234567890</p>
        </div>
    </div>
    <div class="bottom-legal-row">
        <p>&copy; <?php echo date('Y'); ?> Northstar Websites. All rights reserved.</p>
        <nav class="footer-navigation">
            <a href="/privacy-policy/">Privacy Policy</a>
            <a href="/terms-of-service/">Terms of Service</a>
        </nav>
    </div>
</footer>
</body>
</html>
