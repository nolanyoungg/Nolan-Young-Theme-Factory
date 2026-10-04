<?php if ( post_password_required() ) { return; } ?>
<section id="comments" class="container section"><h2>Trail conversations</h2><?php if ( have_comments() ) : ?><ol><?php wp_list_comments(); ?></ol><?php the_comments_pagination(); endif; ?><?php comment_form(); ?></section>
