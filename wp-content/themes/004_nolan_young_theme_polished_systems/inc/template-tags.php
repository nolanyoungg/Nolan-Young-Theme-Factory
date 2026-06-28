<?php
/**
 * Reusable presentation functions.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Print post publication metadata.
 *
 * @return void
 */
function nytt01_posted_on() {
	$published_time = sprintf(
		'<time class="entry-date published" datetime="%1$s">%2$s</time>',
		esc_attr( get_the_date( DATE_W3C ) ),
		esc_html( get_the_date() )
	);

	if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
		$published_time = sprintf(
			'<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated screen-reader-text" datetime="%3$s">%4$s</time>',
			esc_attr( get_the_date( DATE_W3C ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( DATE_W3C ) ),
			esc_html( get_the_modified_date() )
		);
	}

	printf(
		/* translators: %s: Post date. */
		'<span class="posted-on">' . esc_html__( 'Published %s', 'nolan-young-theme-template-01' ) . '</span>',
		wp_kses_post( $published_time )
	);
}

/**
 * Print post author metadata.
 *
 * @return void
 */
function nytt01_posted_by() {
	printf(
		/* translators: %s: Post author. */
		'<span class="byline">' . esc_html__( 'By %s', 'nolan-young-theme-template-01' ) . '</span>',
		'<a class="url fn n" href="' . esc_url( get_author_posts_url( (int) get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a>'
	);
}

/**
 * Print categories, tags, comments link, and edit link.
 *
 * @return void
 */
function nytt01_entry_footer() {
	if ( 'post' === get_post_type() ) {
		$categories = get_the_category_list( esc_html_x( ', ', 'list item separator', 'nolan-young-theme-template-01' ) );
		$tags       = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'nolan-young-theme-template-01' ) );

		if ( $categories ) {
			printf(
				/* translators: %s: Post categories. */
				'<span class="cat-links">' . esc_html__( 'Filed under %s', 'nolan-young-theme-template-01' ) . '</span>',
				wp_kses_post( $categories )
			);
		}

		if ( $tags ) {
			printf(
				/* translators: %s: Post tags. */
				'<span class="tags-links">' . esc_html__( 'Tagged %s', 'nolan-young-theme-template-01' ) . '</span>',
				wp_kses_post( $tags )
			);
		}
	}

	if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
		echo '<span class="comments-link">';
		comments_popup_link(
			esc_html__( 'Leave a comment', 'nolan-young-theme-template-01' ),
			esc_html__( '1 comment', 'nolan-young-theme-template-01' ),
			esc_html__( '% comments', 'nolan-young-theme-template-01' )
		);
		echo '</span>';
	}

	edit_post_link(
		sprintf(
			/* translators: %s: Post title. */
			esc_html__( 'Edit %s', 'nolan-young-theme-template-01' ),
			'<span class="screen-reader-text">' . esc_html( get_the_title() ) . '</span>'
		),
		'<span class="edit-link">',
		'</span>'
	);
}

/**
 * Print accessible archive pagination.
 *
 * @return void
 */
function nytt01_posts_pagination() {
	the_posts_pagination(
		array(
			'mid_size'  => 2,
			'prev_text' => esc_html__( 'Previous', 'nolan-young-theme-template-01' ),
			'next_text' => esc_html__( 'Next', 'nolan-young-theme-template-01' ),
		)
	);
}
