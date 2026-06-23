<?php
/**
 * Plugin Name: Nolan Young Core
 * Plugin URI: https://example.com/nolan-young-core
 * Description: Portable content models, secure forms, privacy tools, and access rules for Nolan Young sites.
 * Version: 1.0.1
 * Requires at least: 7.0
 * Requires PHP: 7.4
 * Author: Nolan Young
 * Author URI: https://example.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: nolan-young-core
 * Domain Path: /languages
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

define( 'NY_CORE_VERSION', '1.0.1' );
define( 'NY_CORE_FILE', __FILE__ );
define( 'NY_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'NY_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once NY_CORE_PATH . 'includes/class-ny-core-post-types.php';
require_once NY_CORE_PATH . 'includes/class-ny-core-contact-form.php';
require_once NY_CORE_PATH . 'includes/class-ny-core-newsletter.php';
require_once NY_CORE_PATH . 'includes/class-ny-core-access-control.php';
require_once NY_CORE_PATH . 'includes/class-ny-core-admin.php';
require_once NY_CORE_PATH . 'includes/class-ny-core-privacy.php';
require_once NY_CORE_PATH . 'includes/class-ny-core-activator.php';
require_once NY_CORE_PATH . 'includes/class-ny-core-plugin.php';

register_activation_hook( __FILE__, array( 'NY_Core_Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'NY_Core_Activator', 'deactivate' ) );

NY_Core_Plugin::instance();
