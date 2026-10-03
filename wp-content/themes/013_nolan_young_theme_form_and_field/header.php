<?php /** Form & Field: compact masthead and a single practice disclosure. */ ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary">Skip to content</a>
<header class="site-header" data-header>
	<div class="container masthead">
		<a class="wordmark" href="<?php echo form_field_url(); ?>" aria-label="Form and Field — Home">form<span>&amp;</span>field<span class="wordmark__dot">.</span></a>
		<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="studio-navigation" hidden><span class="menu-toggle__lines" aria-hidden="true"></span><span class="screen-reader-text" data-menu-label>Open navigation</span></button>
		<nav id="studio-navigation" class="primary-navigation" aria-label="Main navigation">
			<a href="<?php echo form_field_url(); ?>">Home</a>
			<a href="<?php echo form_field_url( 'about' ); ?>">About</a>
			<div class="practice-nav">
				<a href="<?php echo form_field_url( 'services' ); ?>">Services</a>
				<details class="practice-disclosure">
					<summary aria-label="Explore our capabilities"><span aria-hidden="true">+</span></summary>
					<div class="practice-panel">
						<div><p class="eyebrow">The practice</p><a href="<?php echo form_field_url( 'services/featured' ); ?>">Residential architecture ↗</a><a href="<?php echo form_field_url( 'services' ); ?>#reuse">Adaptive reuse ↗</a><a href="<?php echo form_field_url( 'services' ); ?>#interiors">Interior design ↗</a></div>
						<figure><?php form_field_image( 'detail' ); ?><figcaption>Care for what is here.<br>Make room for what comes next.<small>Material reference / Stock photograph</small></figcaption></figure>
					</div>
				</details>
			</div>
			<a href="<?php echo form_field_url( 'work' ); ?>">Work</a>
			<a href="<?php echo form_field_url( 'blog' ); ?>">Journal</a>
			<a class="nav-contact" href="<?php echo form_field_url( 'contact' ); ?>">Let’s talk <span aria-hidden="true">↗</span></a>
			<p class="mobile-nav-note">Independent architecture &amp; interiors.<br>Thoughtful places for everyday life.</p>
		</nav>
	</div>
</header>
