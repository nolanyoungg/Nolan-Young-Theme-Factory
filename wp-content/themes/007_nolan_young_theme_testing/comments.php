<?php
// Comments template for the theme
if (post_password_required()) {
  return;
}

if (have_comments() || comments_open()) : ?>
?>
<div id="comments" class="comments-area">
  <?php if (have_comments()) : ?>
    <h2 class="comments-title">
      <?php
      $comment_count = get_comments_number();
      echo sprintf(_n('%1$s Comment', '%1$s Comments', $comment_count, '007_nolan_young_theme_testing'), number_format_i18n($comment_count));
      ?>
    </h2>

    <ol class="comment-list">
      <?php
      wp_list_comments(array('style' => 'ol', 'short_ping' => true));
      ?>
    </ol>

    <?php the_comments_navigation(); ?>
  <?php endif; // Check for have_comments(). ?>

  <?php if (!comments_open() && get_comments_number()) : ?>
    <p class="no-comments"><?php _e('Comments are closed.', '007_nolan_young_theme_testing'); ?></p>
  <?php endif; // Check for comments_open(). ?>

  <?php comment_form(); ?>
</div><!-- #comments -->
<?php endif; // Check for have_comments() || comments_open(). ?>
