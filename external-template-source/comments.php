<?php
/**
 * Comments template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

if ( post_password_required() ) {
	return;
}
?>
<section id="comments" class="nytt01-comments-area">
	<?php if ( have_comments() ) : ?>
		<h2 class="nytt01-comments-title">
			<?php
			$nytt01_comment_count = get_comments_number();

			printf(
				/* translators: 1: Comment count. 2: Post title. */
				esc_html( _n( '%1$s comment on “%2$s”', '%1$s comments on “%2$s”', $nytt01_comment_count, 'nolan-young-theme-template-01' ) ),
				number_format_i18n( $nytt01_comment_count ),
				esc_html( get_the_title() )
			);
			?>
		</h2>
		<ol class="nytt01-comment-list">
			<?php
			wp_list_comments(
				array(
					'avatar_size' => 56,
					'short_ping'  => true,
					'style'       => 'ol',
				)
			);
			?>
		</ol>
		<?php the_comments_navigation(); ?>
	<?php endif; ?>

	<?php if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
		<p class="nytt01-no-comments"><?php esc_html_e( 'Comments are closed.', 'nolan-young-theme-template-01' ); ?></p>
	<?php endif; ?>

	<?php comment_form(); ?>
</section>
