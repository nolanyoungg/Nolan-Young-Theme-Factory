	<footer id="colophon" class="site-footer">
		<div class="footer-container">
			<div class="site-info">
				<p>&copy; <?php echo date('Y'); ?> Northstar Codeworks. All rights reserved.</p>
			</div>
			<nav id="footer-navigation" class="footer-navigation">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'footer-menu',
					'menu_id'        => 'footer-menu',
				) );
				?>
			</nav>
			<div class="contact-details">
				<p>Email: <a href="mailto:hello@northstarcodeworks.com">hello@northstarcodeworks.com</a></p>
				<p>Phone: <a href="tel:+1234567890">+1 234-567-890</a></p>
			</div>
			<div class="social-links">
				<a href="#" target="_blank" rel="noopener noreferrer"><span class="fab fa-linkedin-in"></span></a>
				<a href="#" target="_blank" rel="noopener noreferrer"><span class="fab fa-github"></span></a>
			</div>
			<div class="newsletter-signup">
				<p>Sign up for our newsletter:</p>
				<form method="post" action="#" id="newsletter-form">
					<input type="email" name="email" placeholder="Your email address" required>
					<button type="submit">Subscribe</button>
				</form>
			</div>
			<div class="legal-links">
				<a href="#privacy-policy" title="Privacy Policy">Privacy Policy</a> | <a href="#terms-of-service" title="Terms of Service">Terms of Service</a>
			</div>
		</div>
	</footer>
<?php wp_footer(); ?>
</body>
</html>
