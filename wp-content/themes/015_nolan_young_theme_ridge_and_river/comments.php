<?php if ( post_password_required() ) { return; } ?>
<section id="comments" class="comments-area"><h2>Trail conversations</h2><?php if ( have_comments() ) : ?><ol class="comment-list"><?php wp_list_comments(); ?></ol><?php the_comments_navigation(); endif; ?><?php comment_form(); ?></section>

