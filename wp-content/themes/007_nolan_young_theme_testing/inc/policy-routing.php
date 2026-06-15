<?php
// Policy routing for the theme
function nolan_young_add_policy_pages() {
  // Add privacy policy page
  add_rewrite_rule('^privacy-policy/?$', 'index.php?pagename=privacy-policy', 'top');

  // Add terms and conditions page
  add_rewrite_rule('^terms-and-conditions/?$', 'index.php?pagename=terms-and-conditions', 'top');
}

add_action('init', 'nolan_young_add_policy_pages');
