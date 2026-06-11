<?php
function nytf_002_posted_on() {
  printf( '<span class="posted-on">%s</span>', esc_html( get_the_date() ) );
}

