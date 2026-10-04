// Generic core behavior for an isolated preview with no saved settings/menu.
// This is not WordPress and never supplies generated theme helpers.
function get_template_directory_uri(){ return '.'; }
function get_stylesheet_directory_uri(){ return '.'; }
function get_stylesheet_uri(){ return 'style.css'; }
function get_theme_mod($name, $default_value = false){
  if (is_string($default_value) && preg_match('#(?<!%)%(?:\d+\$?)?s#', $default_value)) {
    $default_value = preg_replace('#(?<!%)%$#', '', $default_value);
    $default_value = sprintf($default_value, get_template_directory_uri(), get_stylesheet_directory_uri());
  }
  return apply_filters('theme_mod_' . $name, $default_value);
}
function has_nav_menu($location){ return false; }
function is_page_template($template = ''){ global $template_rel; return $template ? $template === $template_rel : strpos($template_rel, 'page-templates/') === 0; }
