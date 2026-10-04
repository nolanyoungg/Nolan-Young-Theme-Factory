<?php
/** Clay & Still does not solicit comments in this demonstration. */
if ( post_password_required() ) { return; }
if ( have_comments() ) : ?>
<section class="comments-area"><h2>From the studio community</h2><ol><?php wp_list_comments(); ?></ol><?php the_comments_navigation(); ?></section>
<?php endif; ?>
