const fs = require('fs');
const path = require('path');

const LOCAL_ASSET_EXTENSION_PATTERN = /\.(?:css|js|mjs|cjs|svg|png|jpe?g|gif|webp|avif|ico|woff2?|woff|ttf|eot)(?:[?#].*)?$/i;

function stripUrlDecorators(value) {
  return String(value || '')
    .trim()
    .replace(/&amp;/g, '&')
    .replace(/[?#].*$/, '');
}

function isExternalOrVirtualUrl(value) {
  return /^(?:https?:|data:|mailto:|tel:|#|javascript:)/i.test(String(value || '').trim());
}

function addLocalReference(out, value, kind) {
  const cleaned = stripUrlDecorators(value);
  if (!cleaned || isExternalOrVirtualUrl(cleaned)) return;
  if (!LOCAL_ASSET_EXTENSION_PATTERN.test(cleaned)) return;
  out.push({ reference: cleaned, kind });
}

function localAssetReferences(text) {
  const source = String(text || '');
  const references = [];
  let match;

  const markupPattern = /\b(?:src|href)=["']([^"']+)["']|url\(\s*["']?([^"')]+)["']?\s*\)/g;
  while ((match = markupPattern.exec(source)) !== null) {
    addLocalReference(references, match[1] || match[2], 'markup');
  }

  const themeUriConcatPattern = /\bget_(?:template|stylesheet)_directory_uri\s*\(\s*\)\s*\.\s*['"]([^'"]+)['"]/g;
  while ((match = themeUriConcatPattern.exec(source)) !== null) {
    addLocalReference(references, match[1], 'theme-uri-concat');
  }

  const themeFileUriPattern = /\bget_theme_file_uri\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = themeFileUriPattern.exec(source)) !== null) {
    addLocalReference(references, match[1], 'theme-file-uri');
  }

  const phpStringAssetPattern = /['"]((?:\.{0,2}\/)?(?:assets|images|build)\/[^'"]+)['"]/g;
  while ((match = phpStringAssetPattern.exec(source)) !== null) {
    addLocalReference(references, match[1], 'php-string');
  }

  const seen = new Set();
  return references.filter((item) => {
    const key = `${item.kind}:${item.reference}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveLocalAssetReference(baseDir, sourceFile, reference) {
  const cleaned = stripUrlDecorators(reference).replace(/\\/g, '/');
  if (!cleaned) return '';
  if (path.posix.isAbsolute(cleaned)) {
    return path.resolve(baseDir, cleaned.replace(/^\/+/, ''));
  }
  if (/^(?:assets|images|build)\//i.test(cleaned)) {
    return path.resolve(baseDir, cleaned);
  }
  return path.resolve(path.dirname(sourceFile), cleaned);
}

function localAssetReferenceFailures(baseDir, files, relativePath = (file) => path.relative(baseDir, file).replace(/\\/g, '/')) {
  const failures = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const item of localAssetReferences(text)) {
      const target = resolveLocalAssetReference(baseDir, file, item.reference);
      const inside = target === baseDir || target.startsWith(`${baseDir}${path.sep}`);
      if (!inside || !fs.existsSync(target)) {
        failures.push(`${relativePath(file)} -> ${item.reference}`);
      }
    }
  }
  return failures;
}

module.exports = {
  localAssetReferenceFailures,
  localAssetReferences,
  resolveLocalAssetReference
};
