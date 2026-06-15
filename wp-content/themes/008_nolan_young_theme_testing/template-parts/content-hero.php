<?php
// Hero section content for the homepage
$hero_image = get_template_directory_uri() . '/images/homepage/hero-image.svg';
$hero_title = 'Transform Your Business with Custom Software Solutions';
$hero_subtitle = 'Efficiently design, build, and maintain reliable software that scales.';
$hero_cta_text = 'Book a Consultation';
$hero_cta_link = home_url('/contact/');
?>
<section class="hero-section">
  <div class="hero-container">
    <img src="$hero_image" alt="Hero Image" class="hero-image">
    <h1 class="hero-title">$hero_title</h1>
    <p class="hero-subtitle">$hero_subtitle</p>
    <a href="$hero_cta_link" class="primary-cta">$hero_cta_text</a>
  </div>
</section>
