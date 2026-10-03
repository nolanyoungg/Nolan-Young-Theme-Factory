<?php
/** Existing WordPress discussions, when enabled by the site operator. */
if ( post_password_required() ) { return; }
?>
<section id="comments" class="comments-area">
	<?php if ( have_comments() ) : ?><h2>Studio conversation</h2><ol class="comment-list"><?php wp_list_comments(); ?></ol><?php the_comments_navigation(); endif; ?>
</section>

