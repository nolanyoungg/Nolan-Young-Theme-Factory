const fs = require('fs');
const path = require('path');
const {
  GENERATED_DETAILED_PAGE_TEMPLATES,
  PAGE_TEMPLATE_MIN_BYTES,
  PAGE_TEMPLATE_MIN_STRUCTURAL_TAGS,
  PAGE_TEMPLATE_WITH_CONTENT_PAGE_MIN_STRUCTURAL_TAGS
} = require('./constants');
const { walkFiles } = require('./theme-utils');

function phpLiteralTemplatePartReferences(text) {
  const references = [];
  const patterns = [
    /get_template_part\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*\)/g,
    /get_template_part\(\s*['"]([^'"]+)['"]\s*\)/g
  ];
  let match;
  for (const pattern of patterns) {
    while ((match = pattern.exec(text)) !== null) {
      const base = match[1];
      const slug = typeof match[2] === 'string' ? match[2] : '';
      const file = slug ? `${base}-${slug}.php` : `${base}.php`;
      references.push(file.replace(/\\/g, '/'));
    }
  }
  return references;
}

function pageTemplateDetailThresholds(file, contentPageCalls) {
  const minTagsByFile = {
    'page-templates/template-contact.php': 12,
    'page-templates/template-service-detail.php': 13,
    'page-templates/template-services.php': 14,
    'page-templates/template-work.php': 14
  };
  const minBytesByFile = {
    'page-templates/template-contact.php': 2600,
    'page-templates/template-service-detail.php': 3200,
    'page-templates/template-services.php': 3200,
    'page-templates/template-work.php': 3200
  };
  return {
    minTags: Math.max(contentPageCalls > 0 ? PAGE_TEMPLATE_WITH_CONTENT_PAGE_MIN_STRUCTURAL_TAGS : PAGE_TEMPLATE_MIN_STRUCTURAL_TAGS, minTagsByFile[file] || 0),
    minBytes: Math.max(PAGE_TEMPLATE_MIN_BYTES, minBytesByFile[file] || 0)
  };
}

function pageTemplateDisallowsFixtureContent(file) {
  return [
    'page-templates/template-about-us.php',
    'page-templates/template-contact.php',
    'page-templates/template-service-detail.php',
    'page-templates/template-services.php',
    'page-templates/template-work.php'
  ].includes(file);
}

function pageTemplateGenericLabelHits(file, text) {
  const labelsByFile = {
    'page-templates/template-services.php': ['Custom WordPress Development', 'Responsive Design', 'SEO Optimization'],
    'page-templates/template-work.php': ['E-commerce Website', 'Non-profit Organization Site', 'Corporate Blog']
  };
  return (labelsByFile[file] || []).filter((label) => new RegExp(`\\b${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text));
}

function pageTemplateDetailFailures(themeDir) {
  const pageTemplateDir = path.join(themeDir, 'page-templates');
  if (!fs.existsSync(pageTemplateDir)) return [];
  const detailedTemplates = new Set(GENERATED_DETAILED_PAGE_TEMPLATES);
  return walkFiles(pageTemplateDir)
    .filter((file) => detailedTemplates.has(path.relative(themeDir, file).replace(/\\/g, '/')))
    .map((file) => {
      const relative = path.relative(themeDir, file).replace(/\\/g, '/');
      const text = fs.readFileSync(file, 'utf8');
      const structuralTags = (text.match(/<(?:section|article|aside|div|header|form|ul|ol)\b/gi) || []).length;
      const contentPageCalls = phpLiteralTemplatePartReferences(text).filter((reference) => reference === 'template-parts/content/content-page.php').length;
      const bytes = Buffer.byteLength(text, 'utf8');
      const thresholds = pageTemplateDetailThresholds(relative, contentPageCalls);
      const usesFixtureContent = pageTemplateDisallowsFixtureContent(relative) && /\b(?:get_the_excerpt|the_content)\s*\(/.test(text);
      const genericLabels = pageTemplateGenericLabelHits(relative, text);
      const passed = structuralTags >= thresholds.minTags && bytes >= thresholds.minBytes && !usesFixtureContent && genericLabels.length === 0;
      return passed ? '' : `${relative} structural_tags=${structuralTags} min_structural_tags=${thresholds.minTags} content_page_calls=${contentPageCalls} bytes=${bytes} min_bytes=${thresholds.minBytes} uses_fixture_content=${usesFixtureContent} generic_labels=${genericLabels.join(', ')}`;
    })
    .filter(Boolean);
}

module.exports = {
  pageTemplateDetailFailures,
  pageTemplateDetailThresholds,
  pageTemplateDisallowsFixtureContent,
  pageTemplateGenericLabelHits,
  phpLiteralTemplatePartReferences
};
