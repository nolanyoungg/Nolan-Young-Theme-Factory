<?php
// Newsletter signup functionality
function nolan_young_add_newsletter_menu() {
  add_menu_page('Newsletter', 'Newsletter', 'manage_options', 'newsletter', 'nolan_young_render_newsletter_page');
}

add_action('admin_menu', 'nolan_young_add_newsletter_menu');

function nolan_young_render_newsletter_page() {
  echo '<div class="wrap"><h1>Newsletter Subscribers</h1><p>This page will display newsletter subscribers.</p></div>';
}
