<?php
/** Native discussion for Form & Field journal entries. */
if ( post_password_required() ) { return; }
?>
<section class="comments-area prose" aria-label="Journal discussion">
<?php if ( have_comments() ) : ?><h2>In conversation</h2><ol class="comment-list"><?php wp_list_comments( array( 'style' => 'ol', 'avatar_size' => 0 ) ); ?></ol><?php the_comments_pagination(); endif; ?>
<?php if ( comments_open() ) { comment_form(); } ?>
</section>
