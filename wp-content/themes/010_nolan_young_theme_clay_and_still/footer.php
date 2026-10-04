<?php /** Clay & Still colophon. */ ?>
<footer class="site-footer">
	<div class="container">
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
		<div class="image-credits"><p>Photography, with thanks: <a href="https://unsplash.com/@tomcrewceramics">Tom Crew</a> (white vessels) &amp; <a href="https://unsplash.com/@oriento">五玄土 ORIENTO</a> (red vase), via Unsplash. Illustrative stock photography; not Clay &amp; Still products or projects.</p></div>
		<div class="footer-bottom"><p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> Clay &amp; Still · A fictional studio, thoughtfully imagined.</p><a href="<?php echo clay_url( '/privacy-policy/' ); ?>">Privacy note</a><a href="#primary">Back to top ↑</a></div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
