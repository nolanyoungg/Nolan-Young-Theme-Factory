<?php
/**
 * Page access control.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

/** Implements durable access rules independently from the active theme. */
final class NY_Core_Access_Control {
	const META_KEY = '_ny_core_access_level';

	/** Constructor. */
	public function __construct() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'save_post_page', array( $this, 'save_access_level' ) );
		add_action( 'template_redirect', array( $this, 'enforce_access' ), 8 );
		add_action( 'pre_get_posts', array( $this, 'hide_restricted_content' ) );
	}

	/** @return void */
	public function add_meta_box() {
		add_meta_box(
			'ny-core-access',
			esc_html__( 'Page Access', 'nolan-young-core' ),
			array( $this, 'render_meta_box' ),
			'page',
			'side',
			'default'
		);
	}

	/** @param WP_Post $post Current post. @return void */
	public function render_meta_box( $post ) {
		$current = get_post_meta( $post->ID, self::META_KEY, true );
		if ( ! in_array( $current, array( 'public', 'logged_in', 'administrators' ), true ) ) {
			$current = 'public';
		}
		wp_nonce_field( 'ny_core_save_access', 'ny_core_access_nonce' );
		?>
		<p><label for="ny-core-access-level"><?php esc_html_e( 'Who may view this page?', 'nolan-young-core' ); ?></label></p>
		<select id="ny-core-access-level" name="ny_core_access_level">
			<option value="public" <?php selected( $current, 'public' ); ?>><?php esc_html_e( 'Everyone', 'nolan-young-core' ); ?></option>
			<option value="logged_in" <?php selected( $current, 'logged_in' ); ?>><?php esc_html_e( 'Logged-in users', 'nolan-young-core' ); ?></option>
			<option value="administrators" <?php selected( $current, 'administrators' ); ?>><?php esc_html_e( 'Administrators', 'nolan-young-core' ); ?></option>
		</select>
		<?php
	}

	/** @param int $post_id Post ID. @return void */
	public function save_access_level( $post_id ) {
		$nonce = isset( $_POST['ny_core_access_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['ny_core_access_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'ny_core_save_access' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		$level = isset( $_POST['ny_core_access_level'] ) ? sanitize_key( wp_unslash( $_POST['ny_core_access_level'] ) ) : 'public';
		if ( ! in_array( $level, array( 'public', 'logged_in', 'administrators' ), true ) ) {
			$level = 'public';
		}
		update_post_meta( $post_id, self::META_KEY, $level );
	}

	/** @return void */
	public function enforce_access() {
		if ( is_admin() || wp_doing_ajax() || ! is_singular( 'page' ) ) {
			return;
		}
		$post_id = get_queried_object_id();
		$level   = get_post_meta( $post_id, self::META_KEY, true );
		if ( $this->user_can_view( $level ) ) {
			return;
		}

		status_header( 403 );
		nocache_headers();
		add_filter( 'wp_robots', array( $this, 'noindex_robots' ) );
		$this->render_access_denied();
		exit;
	}

	/**
	 * Hide inaccessible pages from public lists and search results.
	 *
	 * @param WP_Query $query Query object.
	 * @return void
	 */
	public function hide_restricted_content( $query ) {
		if ( is_admin() || current_user_can( 'manage_options' ) || $query->is_singular() ) {
			return;
		}
		$post_type = $query->get( 'post_type' );
		if ( $post_type && 'page' !== $post_type && ! ( is_array( $post_type ) && in_array( 'page', $post_type, true ) ) ) {
			return;
		}
		$allowed = array( 'public' );
		if ( is_user_logged_in() ) {
			$allowed[] = 'logged_in';
		}
		$access_query = array(
			'relation' => 'OR',
			array(
				'key'     => self::META_KEY,
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => self::META_KEY,
				'value'   => $allowed,
				'compare' => 'IN',
			),
		);
		$existing = $query->get( 'meta_query' );
		if ( $existing ) {
			$query->set( 'meta_query', array( 'relation' => 'AND', $existing, $access_query ) );
		} else {
			$query->set( 'meta_query', $access_query );
		}
	}

	/** @param string $level Access level. @return bool */
	private function user_can_view( $level ) {
		if ( '' === $level || 'public' === $level ) {
			return true;
		}
		if ( 'logged_in' === $level ) {
			return is_user_logged_in();
		}
		if ( 'administrators' === $level ) {
			return current_user_can( 'manage_options' );
		}
		return false;
	}

	/** @param array<string,bool> $robots Existing directives. @return array<string,bool> */
	public function noindex_robots( $robots ) {
		$robots['noindex']  = true;
		$robots['nofollow'] = true;
		return $robots;
	}

	/** @return void */
	private function render_access_denied() {
		$theme_template = locate_template( 'template-parts/errors/content-403.php' );
		if ( $theme_template ) {
			get_header();
			include $theme_template;
			get_footer();
			return;
		}
		include NY_CORE_PATH . 'templates/access-denied.php';
	}
}
