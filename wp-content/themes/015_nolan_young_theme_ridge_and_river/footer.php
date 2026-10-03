<?php /** The end of the trail. */ ?>
<footer class="site-footer">
	<div class="container footer-top">
		<div class="footer-brand"><?php ridge_river_mark( 3 ); ?><h2>Good days.<br>Long ways.</h2><p>Ridge & River is a small, fictional walking outfitter with a simple idea: make room for the outdoors.</p></div>
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
	</div>
	<div class="container image-credit"><span class="eyebrow">Image credit</span><p>Mountain photograph by <a href="https://unsplash.com/@alexanderhipp">Alexander Hipp</a> / <a href="https://unsplash.com/photos/landscape-photography-of-mountain-range-mRyCvjWhM1k">Unsplash</a>, used under the <a href="https://unsplash.com/license">Unsplash License</a>. Illustrative stock; not a Ridge & River trip location.</p></div>
	<div class="container footer-bottom"><span>© <?php echo esc_html( date( 'Y' ) ); ?> Ridge & River · A fictional sample brand</span><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>">Privacy & demo information</a><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Back to base ↑</a></div>
</footer>
<?php wp_footer(); ?>
</body></html>

