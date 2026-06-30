const THEME_SLUG_PATTERN = /^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/;
const TEMPLATE_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

const GENERATED_THEME_PATHS = {
  templates: 'wordpress-themplate-themes',
  themes: 'wp-content/themes',
  previews: 'docs/Preview-Themes-Github',
  zips: 'dist/zipped-themes',
  reports: 'reports/runs'
};

const WALK_IGNORED_DIRECTORIES = ['node_modules', '.git', '.generation', 'reports'];
const ZIP_EXCLUDED_DIRECTORIES = ['node_modules', '.git', '.generation', 'reports'];
const ZIP_EXCLUDED_FILE_PATTERN = /\.(log|map)$/i;

const REQUIRED_ROOT_FILES = ['style.css', 'functions.php', 'index.php', 'header.php', 'footer.php'];
const REQUIRED_BUNDLES = ['assets/css/bundle.css', 'assets/js/bundle.js'];
const GENERATED_DETAILED_PAGE_TEMPLATES = [
  'page-templates/template-about-us.php',
  'page-templates/template-services.php',
  'page-templates/template-service-detail.php',
  'page-templates/template-work.php',
  'page-templates/template-blog-landing.php',
  'page-templates/template-contact.php'
];
const PAGE_TEMPLATE_MIN_BYTES = 1600;
const PAGE_TEMPLATE_MIN_STRUCTURAL_TAGS = 10;
const PAGE_TEMPLATE_WITH_CONTENT_PAGE_MIN_STRUCTURAL_TAGS = 12;

const PLACEHOLDER_PATTERN = /Lorem ipsum|TODO|FIXME|Add [A-Za-z0-9 _/-]+ here|add [A-Za-z0-9 _/-]+ here|Generation should replace|Static preview generated from|prepared WordPress theme folder|Project Title\s*\d+|Service Title\s*\d+|Case Study\s*\d+|Process Step Icon\s*\d+|Pillar Icon\s*\d+|Blog Post Image\s*\d+|Placeholder image|ensure this exists|Description of (?:the )?(?:project|service|work|case study)|Highlight Service Title|Service Image|Service Icon\s*\d+|We provide comprehensive Service\s*\d+|Publish posts to populate this section|Publish service (?:entries|entry) to replace this starter content|starter content\.|Preview fixture|Preview fixture excerpt|Generated theme preview\.|within \d+ hours|\b\d+-hour\b|free consultations?|successfully launched over \d+|customer satisfaction rate|Client Satisfaction|Satisfaction Rate|Years of Experience|Projects Delivered|Projects Completed|Happy Clients|Custom WordPress Development|Custom Development|Responsive Design|SEO Optimization|Website Maintenance|User Experience Design|E-commerce Website|Non-profit Organization Site|Corporate Blog|Example (?:Corp|Inc|Company)|Acme\b|\bNolan Designs\b|\b(?:John Doe|Jane Doe|John Smith|Jane Smith|Mike Johnson)\b|(?:john|jane)-(?:doe|smith)|123 Main St|Anytown|12345|\(123\)\s*456-7890|\+1\s*234\s*567\s*890|[a-z0-9._%+-]+@nolanyoung\.com|info@example\.com/i;
const INLINE_STYLE_BLOCK_PATTERN = /<style\b/i;
const ABSOLUTE_LOCAL_ASSET_PATTERN = /\b(?:src|href)=["']\/assets\//i;
const PREVIEW_RUNTIME_WARNING_PATTERN = /(?:Warning|Notice|Deprecated|Fatal error|Parse error):|Undefined array key|undefined function/i;
const SECRET_PATTERN = /OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|AWS_SECRET_ACCESS_KEY|(?:api[_-]?key|password|secret|token)\s*[:=]\s*["'][A-Za-z0-9_./+=-]{16,}["']/i;
const REMOTE_RUNTIME_PATTERN = /<(script|link|img|source|video|audio)[^>]+(src|href)=["'][^"']*https?:\/\/|@import\s+url\(["']?https?:\/\/|url\(["']?https?:\/\/|\/\/cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic/i;
const ALLOWED_REMOTE_REFERENCE_PATTERN = /schemas\.wp\.org|www\.w3\.org|gmpg\.org\/xfn\/11/i;
const REPO_LOCAL_PATH_PATTERN = /C:\\Users\\|\/Users\/|codex-ggi-nolan-local|docs\/Preview-Themes-Github|dist\/zipped-themes/i;
const TEMPLATE_PART_WRAPPER_PATTERN = /(get_header\s*\(|get_footer\s*\(|wp_head\s*\(|wp_footer\s*\(|<!doctype|<html\b|<body\b|<\/body>|<\/html>)/i;
const CONTENT_SECTION_PATTERN = /get_template_part\(.*template-parts\/(content-hero|content-cta-banner|content-brand-statement|content-featured-work|content-all-services|content-single-service-highlight|content-process|content-style-pillars|content-testimonials|content-blog-preview|content-faqs)/i;
const MODEL_FILE_BLOCK_MARKER_PATTERN = /^---(?:FILE:\s*[^\r\n]+|END FILE)---\s*$/im;
const UNSUPPORTED_PREVIEW_PHP_CALLS = [
  {
    name: 'wp_reset_query',
    pattern: /\bwp_reset_query\s*\(/,
    details: 'wp_reset_query() is unsupported by the deterministic preview harness and should not be needed in generated visible theme files; use wp_reset_postdata() only after setup_postdata()/WP_Query loops.'
  },
  {
    name: 'get_categories',
    pattern: /\bget_categories\s*\(/,
    details: 'get_categories() is unsupported by the deterministic preview harness; use explicit topic/category links or existing loop data in generated visible templates.'
  },
  {
    name: 'get_category_link',
    pattern: /\bget_category_link\s*\(/,
    details: 'get_category_link() is unsupported by the deterministic preview harness; use explicit static topic links in generated visible templates.'
  },
  {
    name: 'get_terms',
    pattern: /\bget_terms\s*\(/,
    details: 'get_terms() is unsupported by the deterministic preview harness; use explicit static topic links in generated visible templates.'
  },
  {
    name: 'shortcode_exists',
    pattern: /\bshortcode_exists\s*\(/,
    details: 'Generated preview-facing page templates should render explicit form markup instead of depending on shortcode/plugin conditionals.'
  },
  {
    name: 'do_shortcode',
    pattern: /\bdo_shortcode\s*\(/,
    details: 'Generated preview-facing page templates should render explicit form markup instead of depending on shortcode/plugin output.'
  }
];

const COMMAND_FAILURE_CODES = {
  COMMAND_NOT_FOUND: 'COMMAND_NOT_FOUND',
  CLI_VERSION_UNSUPPORTED: 'CLI_VERSION_UNSUPPORTED',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  AUTHENTICATION_EXPIRED: 'AUTHENTICATION_EXPIRED',
  MODEL_NOT_INSTALLED: 'MODEL_NOT_INSTALLED',
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',
  MODEL_ACCESS_DENIED: 'MODEL_ACCESS_DENIED',
  REASONING_LEVEL_UNSUPPORTED: 'REASONING_LEVEL_UNSUPPORTED',
  INVALID_MODEL_REASONING_COMBINATION: 'INVALID_MODEL_REASONING_COMBINATION',
  OLLAMA_SERVICE_UNAVAILABLE: 'OLLAMA_SERVICE_UNAVAILABLE',
  MODEL_LOAD_FAILED: 'MODEL_LOAD_FAILED',
  INSUFFICIENT_MEMORY: 'INSUFFICIENT_MEMORY',
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  NETWORK_FAILURE: 'NETWORK_FAILURE',
  PROCESS_TIMEOUT: 'PROCESS_TIMEOUT',
  NONZERO_EXIT: 'NONZERO_EXIT',
  OUTPUT_MISSING: 'OUTPUT_MISSING',
  OUTPUT_INVALID: 'OUTPUT_INVALID',
  UNKNOWN_PROVIDER_FAILURE: 'UNKNOWN_PROVIDER_FAILURE'
};

module.exports = {
  ALLOWED_REMOTE_REFERENCE_PATTERN,
  ABSOLUTE_LOCAL_ASSET_PATTERN,
  COMMAND_FAILURE_CODES,
  CONTENT_SECTION_PATTERN,
  GENERATED_DETAILED_PAGE_TEMPLATES,
  INLINE_STYLE_BLOCK_PATTERN,
  GENERATED_THEME_PATHS,
  PAGE_TEMPLATE_MIN_BYTES,
  PAGE_TEMPLATE_MIN_STRUCTURAL_TAGS,
  PAGE_TEMPLATE_WITH_CONTENT_PAGE_MIN_STRUCTURAL_TAGS,
  MODEL_FILE_BLOCK_MARKER_PATTERN,
  PLACEHOLDER_PATTERN,
  PREVIEW_RUNTIME_WARNING_PATTERN,
  REMOTE_RUNTIME_PATTERN,
  REPO_LOCAL_PATH_PATTERN,
  REQUIRED_BUNDLES,
  REQUIRED_ROOT_FILES,
  SECRET_PATTERN,
  TEMPLATE_NAME_PATTERN,
  TEMPLATE_PART_WRAPPER_PATTERN,
  THEME_SLUG_PATTERN,
  UNSUPPORTED_PREVIEW_PHP_CALLS,
  WALK_IGNORED_DIRECTORIES,
  ZIP_EXCLUDED_DIRECTORIES,
  ZIP_EXCLUDED_FILE_PATTERN
};
