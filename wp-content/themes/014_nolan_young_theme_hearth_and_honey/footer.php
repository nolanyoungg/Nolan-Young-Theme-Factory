<footer class="site-footer scallop">
<div class="container">
    <img class="interface-mark" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/mark-2.svg' ) ); ?>" alt="" width="32" height="32">
    <?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
    <div class="footer-bottom"><p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> Hearth &amp; Honey. Made slowly. Shared happily.</p><?php hearth_honey_link( '/privacy-policy/', 'Privacy & demo details' ); ?></div>
    <details class="image-credits"><summary>Image credits &amp; sample brand</summary><p>Hearth &amp; Honey is a fictional bakery. Address, opening hours, menu and prices are sample content. Bread photographs are illustrative stock, not photographs of our products or premises.</p><p>Rack photograph by <a href="https://unsplash.com/@intrepidfilm">Intrepid</a>; basket photograph by <a href="https://unsplash.com/@eprouzet">Eric Prouzet</a>, via Unsplash. Used under the <a href="https://unsplash.com/license">Unsplash License</a>.</p></details>
</div>
</footer>
<?php wp_footer(); ?>
</body></html>
