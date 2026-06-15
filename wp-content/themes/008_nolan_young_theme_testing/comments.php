<?php if ( post_password_required() ) { return; } ?>
?>
<section id="comments" class="comments-area">
  <?php if ( have_comments() ) : ?>
    <h2><?php esc_html_e( 'Client testimonials', 'nolan-young-template' ); ?></h2>
    <ol class="comment-list">
      <?php wp_list_comments(); ?>
    </ol>
  <?php endif; ?>
  <?php comment_form(); ?>
</section>
