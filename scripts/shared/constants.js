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

const PLACEHOLDER_PATTERN = /Lorem ipsum|TODO|FIXME|Add [A-Za-z0-9 _/-]+ here|add [A-Za-z0-9 _/-]+ here|Generation should replace|Static preview generated from|prepared WordPress theme folder/i;
const SECRET_PATTERN = /OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|AWS_SECRET_ACCESS_KEY|password\s*[:=]\s*\S+|token\s*[:=]\s*\S+/i;
const REMOTE_RUNTIME_PATTERN = /<(script|link|img|source|video|audio)[^>]+(src|href)=["'][^"']*https?:\/\/|@import\s+url\(["']?https?:\/\/|url\(["']?https?:\/\/|\/\/cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic/i;
const ALLOWED_REMOTE_REFERENCE_PATTERN = /schemas\.wp\.org|www\.w3\.org|gmpg\.org\/xfn\/11/i;
const REPO_LOCAL_PATH_PATTERN = /C:\\Users\\|\/Users\/|codex-ggi-nolan-local|docs\/Preview-Themes-Github|dist\/zipped-themes/i;
const TEMPLATE_PART_WRAPPER_PATTERN = /(get_header\s*\(|get_footer\s*\(|wp_head\s*\(|wp_footer\s*\(|<!doctype|<html\b|<body\b|<\/body>|<\/html>)/i;
const CONTENT_SECTION_PATTERN = /get_template_part\(.*template-parts\/(content-hero|content-cta-banner|content-brand-statement|content-featured-work|content-all-services|content-single-service-highlight|content-process|content-style-pillars|content-testimonials|content-blog-preview|content-faqs)/i;
const MODEL_FILE_BLOCK_MARKER_PATTERN = /^---(?:FILE:\s*[^\r\n]+|END FILE)---\s*$/im;

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
  COMMAND_FAILURE_CODES,
  CONTENT_SECTION_PATTERN,
  GENERATED_THEME_PATHS,
  MODEL_FILE_BLOCK_MARKER_PATTERN,
  PLACEHOLDER_PATTERN,
  REMOTE_RUNTIME_PATTERN,
  REPO_LOCAL_PATH_PATTERN,
  REQUIRED_BUNDLES,
  REQUIRED_ROOT_FILES,
  SECRET_PATTERN,
  TEMPLATE_NAME_PATTERN,
  TEMPLATE_PART_WRAPPER_PATTERN,
  THEME_SLUG_PATTERN,
  WALK_IGNORED_DIRECTORIES,
  ZIP_EXCLUDED_DIRECTORIES,
  ZIP_EXCLUDED_FILE_PATTERN
};
