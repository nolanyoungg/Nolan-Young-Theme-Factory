<?php
/**
 * Comments template.
 *
 * @package 008_nolan_young_theme_testing
 */
if ( post_password_required() ) {
  return;
}
?>
<section id="comments" class="comments-area">
  <h2><?php esc_html_e( 'Project discussion', '008_nolan_young_theme_testing' ); ?></h2>
  <?php if ( have_comments() ) : ?>
    <ol class="comment-list"><?php wp_list_comments(); ?></ol>
  <?php endif; ?>
  <?php comment_form(); ?>
</section>
