<?php /** Form & Field colophon. */ ?>
<footer class="site-footer">
	<div class="container">
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
		<details class="image-credits">
			<summary>Image credits &amp; project notes</summary>
			<p>Form &amp; Field is a fictional sample practice. All three projects are unbuilt concept studies. Photographs are illustrative references, not our completed work.</p>
			<p>White concrete building: <a href="https://unsplash.com/photos/white-concrete-building-BK00-RIxFLc">Pierre Châtel-Innocenti</a>. Beige concrete building: <a href="https://unsplash.com/photos/fzbQz0RoNLs">Annie Spratt</a>. Both photographs via Unsplash, used under the <a href="https://unsplash.com/license">Unsplash License</a>.</p>
		</details>
		<div class="colophon"><p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> Form &amp; Field · A fictional practice</p><a href="<?php echo form_field_url( 'privacy-policy' ); ?>">Privacy</a><a href="#primary">Back to top ↑</a></div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
