<?php
/** Shared site footer. */
defined( 'ABSPATH' ) || exit;
?>
<footer class="site-footer"><div class="wrap"><div class="footer-main">
    <div><?php get_template_part( 'template-parts/brand' ); ?><p>Independent architecture.<br>Homes with staying power.<br>Places that bring us together.</p></div>
    <nav class="footer-links" aria-label="Footer navigation">
        <?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'menu_class' => 'cground-menu', 'depth' => 1, 'fallback_cb' => 'cground_footer_fallback' ) ); ?>
    </nav>
    <div class="footer-note"><span class="eyebrow">A little context</span><p>A fictional independent practice.<br>Three studies. One shared outlook.</p><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Begin a project conversation ↗</a></div>
</div><div class="footer-bottom"><span>© 2026 Common Ground · Fictional portfolio sample</span><span>Thoughtfully made, for everyday life.</span><a href="#top">Back to top ↑</a></div></div></footer>
<?php wp_footer(); ?>
</body>
</html>
