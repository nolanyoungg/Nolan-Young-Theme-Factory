<?php /** Clay & Still colophon. */ ?>
<footer class="site-footer">
	<div class="wrap">
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
		<div class="footer-credits"><p>Image credits: <a href="https://unsplash.com/@tomcrewceramics">Tom Crew</a> &amp; <a href="https://unsplash.com/@oriento">五玄土 ORIENTO</a> / Unsplash.<br>Photography is illustrative stock, not work made by Clay &amp; Still.</p><p>Clay &amp; Still is a fictional sample studio.<br>No sales, bookings, or messages are processed.</p></div>
		<div class="footer-bottom"><p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> Clay &amp; Still</p><span>Made slowly. Kept close.</span><a href="<?php echo clay_still_url( '/privacy-policy/' ); ?>">Privacy &amp; this demo</a></div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>

