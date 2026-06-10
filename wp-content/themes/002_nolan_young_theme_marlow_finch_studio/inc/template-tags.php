<?php
function nolan_showcase_theme_01_posted_on() {
  echo '<span class="posted-on">' . esc_html( get_the_date() ) . '</span>';
}
