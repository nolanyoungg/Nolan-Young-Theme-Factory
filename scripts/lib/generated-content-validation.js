const fs = require('fs');
const path = require('path');
const {
  GENERATED_DETAILED_PAGE_TEMPLATES,
  PAGE_TEMPLATE_MIN_BYTES,
  PAGE_TEMPLATE_MIN_STRUCTURAL_TAGS,
  PAGE_TEMPLATE_WITH_CONTENT_PAGE_MIN_STRUCTURAL_TAGS,
  PLACEHOLDER_PATTERN,
  UNSUPPORTED_PREVIEW_PHP_CALLS
} = require('./constants');
const { localAssetReferenceFailures } = require('./local-assets');
const { normalizeRelativePath } = require('./file-block-parser');
const {
  pageTemplateDetailThresholds,
  pageTemplateDisallowsFixtureContent,
  pageTemplateGenericLabelHits,
  phpLiteralTemplatePartReferences
} = require('./page-template-validation');

function validateGeneratedTextContent(candidateDir, changed) {
  const checks = [];
  const textLike = changed.filter((file) => /\.(php|html|css|scss|sass|js|json|svg|md|txt)$/i.test(file));
  for (const file of textLike) {
    const full = path.join(candidateDir, file);
    const text = fs.readFileSync(full, 'utf8');
    const isPhp = file.endsWith('.php');
    const longestLine = Math.max(...text.split('\n').map((line) => line.length), 0);
    checks.push({
      type: 'no-transport-noise',
      file,
      passed: !/[\u001b\u2800-\u28ff]/u.test(text),
      details: 'Generated source must not contain terminal control codes or Ollama spinner glyphs'
    });
    checks.push({
      type: 'no-placeholder-content',
      file,
      passed: !PLACEHOLDER_PATTERN.test(text),
      details: 'Generated source must not contain placeholder copy, scaffold instructions, generic placeholder names, or shortened/mixed Nolan Young branding'
    });
    if (isPhp) {
      const unsafeArrayReads = unsafeDirectArrayKeyReads(text);
      checks.push({
        type: 'safe-array-key-access',
        file,
        passed: unsafeArrayReads.length === 0,
        details: unsafeArrayReads.join('; ') || 'Static foreach arrays define every directly read item key, or use null-coalescing defaults for optional keys.'
      });
      checks.push({
        type: 'php-size-sanity',
        file,
        passed: Buffer.byteLength(text, 'utf8') <= 24000,
        details: `PHP file is ${Buffer.byteLength(text, 'utf8')} bytes`
      });
      for (const call of UNSUPPORTED_PREVIEW_PHP_CALLS) {
        checks.push({
          type: 'unsupported-preview-php-call',
          file,
          passed: !call.pattern.test(text),
          details: call.details,
          call: call.name
        });
      }
    }
    checks.push({
      type: 'line-length',
      file,
      passed: longestLine <= (isPhp ? 12000 : 30000),
      details: `Longest line is ${longestLine} characters`
    });
  }
  const missingLocalAssets = localAssetReferenceFailures(
    candidateDir,
    textLike.map((file) => path.join(candidateDir, file)),
    (file) => path.relative(candidateDir, file).replace(/\\/g, '/')
  );
  checks.push({
    type: 'local-asset-reference-resolves',
    passed: missingLocalAssets.length === 0,
    details: missingLocalAssets.join('; ') || 'Generated local asset references resolve to files inside the theme.'
  });
  return checks;
}

function unsafeDirectArrayKeyReads(text) {
  const issues = [];
  const source = String(text || '').replace(/\r\n/g, '\n');
  const foreaches = foreachContexts(source);
  const pattern = /\$([A-Za-z_][A-Za-z0-9_]*)\s*\[\s*['"]([A-Za-z0-9_-]+)['"]\s*\]/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const variable = match[1];
    if (/^_(?:POST|GET|REQUEST|SERVER|COOKIE|SESSION|FILES|ENV)$/.test(variable) || variable === 'GLOBALS') continue;
    const lineStart = source.lastIndexOf('\n', match.index) + 1;
    const lineEndIndex = source.indexOf('\n', match.index);
    const lineEnd = lineEndIndex === -1 ? source.length : lineEndIndex;
    const before = source.slice(lineStart, match.index);
    const after = source.slice(match.index + match[0].length, lineEnd).trimStart();
    if (/\b(?:isset|empty)\s*\([^)]*$/.test(before)) continue;
    if (after.startsWith('??')) continue;
    const context = foreaches
      .filter((item) => item.alias === variable && match.index >= item.bodyStart && match.index <= item.end)
      .sort((a, b) => b.bodyStart - a.bodyStart)[0];
    if (!context) continue;
    const items = localStaticArrayItemsForVariable(source, context.sourceVariable, context.start);
    if (!items || items.length === 0) continue;
    const missing = items.filter((item) => !arrayItemDefinesKey(item, match[2]));
    if (missing.length > 0) {
      issues.push(`line ${source.slice(0, match.index).split('\n').length}: ${match[0]} from $${context.sourceVariable} has ${missing.length}/${items.length} item(s) missing '${match[2]}'`);
    }
  }
  return issues;
}

function foreachContexts(source) {
  const contexts = [];
  const pattern = /\bforeach\s*\(\s*\$([A-Za-z_][A-Za-z0-9_]*)\s+as\s+(?:\$[A-Za-z_][A-Za-z0-9_]*\s*=>\s*)?\$([A-Za-z_][A-Za-z0-9_]*)\s*\)\s*([:{])?/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const delimiter = match[3] || nextNonWhitespace(source, pattern.lastIndex);
    const bodyStart = delimiter === match[3] ? pattern.lastIndex : source.indexOf(delimiter, pattern.lastIndex) + 1;
    let end = source.length;
    if (delimiter === ':') end = findMatchingEndForeach(source, bodyStart);
    if (delimiter === '{') {
      const openIndex = source.indexOf('{', pattern.lastIndex - (match[3] ? 1 : 0));
      const closeIndex = openIndex === -1 ? -1 : findMatchingCloser(source, openIndex, '{', '}');
      if (closeIndex !== -1) end = closeIndex;
    }
    contexts.push({
      sourceVariable: match[1],
      alias: match[2],
      start: match.index,
      bodyStart,
      end
    });
  }
  return contexts;
}

function nextNonWhitespace(source, index) {
  const match = source.slice(index).match(/\S/);
  return match ? match[0] : '';
}

function findMatchingEndForeach(source, startIndex) {
  const pattern = /\bforeach\s*\(|\bendforeach\s*;/g;
  pattern.lastIndex = startIndex;
  let depth = 1;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    if (match[0].startsWith('foreach')) depth += 1;
    else depth -= 1;
    if (depth === 0) return pattern.lastIndex;
  }
  return source.length;
}

function localStaticArrayItemsForVariable(source, variable, beforeIndex) {
  const escaped = escapeRegExp(variable);
  const pattern = new RegExp(`\\$${escaped}\\s*=\\s*(?:array\\s*\\(|\\[)`, 'g');
  let match;
  let candidate = null;
  while ((match = pattern.exec(source)) !== null) {
    if (match.index >= beforeIndex) break;
    const header = match[0];
    const openChar = header.endsWith('[') ? '[' : '(';
    const closeChar = openChar === '[' ? ']' : ')';
    const openIndex = match.index + header.lastIndexOf(openChar);
    const closeIndex = findMatchingCloser(source, openIndex, openChar, closeChar);
    if (closeIndex !== -1 && closeIndex < beforeIndex) {
      candidate = source.slice(openIndex + 1, closeIndex);
    }
  }
  return candidate === null ? null : splitTopLevelCommas(candidate).map((item) => item.trim()).filter(Boolean);
}

function splitTopLevelCommas(source) {
  const parts = [];
  let start = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let quote = '';
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }
    if (char === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === '#') {
      lineComment = true;
      continue;
    }
    if (char === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === '(') parenDepth += 1;
    else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
    else if (char === '[') bracketDepth += 1;
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === '{') braceDepth += 1;
    else if (char === '}') braceDepth = Math.max(0, braceDepth - 1);
    else if (char === ',' && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
      parts.push(source.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(source.slice(start));
  return parts;
}

function findMatchingCloser(source, openIndex, openChar, closeChar) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }
    if (char === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === '#') {
      lineComment = true;
      continue;
    }
    if (char === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    else if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function arrayItemDefinesKey(item, key) {
  return new RegExp(`['"]${escapeRegExp(key)}['"]\\s*=>`).test(item);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validateTemplatePartReferences(candidateDir, phpFiles) {
  const checks = [];
  for (const file of phpFiles) {
    const text = fs.existsSync(path.join(candidateDir, file)) ? fs.readFileSync(path.join(candidateDir, file), 'utf8') : '';
    const references = phpLiteralTemplatePartReferences(text).filter((reference) => reference.startsWith('template-parts/'));
    for (const reference of references) {
      checks.push({
        type: 'template-part-reference-resolves',
        file,
        reference,
        passed: fs.existsSync(path.join(candidateDir, reference)),
        details: reference
      });
    }
  }
  return checks;
}

function validateRequiredTemplatePartReferences(candidateDir, phpFiles, requiredTemplateParts) {
  const checks = [];
  const required = [...new Set((requiredTemplateParts || []).map((file) => normalizeRelativePath(file, path.basename(candidateDir))).filter(Boolean))].sort();
  if (!required.length) return checks;
  const observed = new Set();
  for (const file of phpFiles) {
    const text = fs.existsSync(path.join(candidateDir, file)) ? fs.readFileSync(path.join(candidateDir, file), 'utf8') : '';
    for (const reference of phpLiteralTemplatePartReferences(text)) observed.add(reference);
  }
  for (const reference of required) {
    checks.push({
      type: 'required-template-part-reference',
      file: phpFiles.join(', '),
      reference,
      passed: observed.has(reference),
      details: `Required reference must be preserved: ${reference}`
    });
  }
  return checks;
}

function validateDeclaredThemeHelperCalls(candidateDir, phpFiles, declarations) {
  const unresolved = [];
  const callPattern = /\b((?:nytt01|ny|nolan_young)_[A-Za-z][A-Za-z0-9_]*)\s*\(/g;
  for (const file of phpFiles) {
    const text = fs.existsSync(path.join(candidateDir, file)) ? fs.readFileSync(path.join(candidateDir, file), 'utf8') : '';
    let match;
    while ((match = callPattern.exec(text)) !== null) {
      const before = text.slice(Math.max(0, match.index - 24), match.index);
      if (/\bfunction\s*$/.test(before)) continue;
      if (declarations.has(match[1])) continue;
      unresolved.push({ file, function: match[1] });
    }
  }
  return [{
    type: 'declared-theme-helper-calls',
    passed: unresolved.length === 0,
    details: unresolved.map((item) => `${item.file}: ${item.function}`).join('; '),
    unresolved
  }];
}

function validatePageTemplateDetail(candidateDir, phpFiles) {
  const checks = [];
  const detailedPageTemplates = new Set(GENERATED_DETAILED_PAGE_TEMPLATES);
  const pageTemplates = phpFiles.filter((file) => detailedPageTemplates.has(file));
  for (const file of pageTemplates) {
    const text = fs.existsSync(path.join(candidateDir, file)) ? fs.readFileSync(path.join(candidateDir, file), 'utf8') : '';
    const structuralTags = (text.match(/<(?:section|article|aside|div|header|form|ul|ol)\b/gi) || []).length;
    const contentPageCalls = phpLiteralTemplatePartReferences(text).filter((reference) => reference === 'template-parts/content/content-page.php').length;
    const bytes = Buffer.byteLength(text, 'utf8');
    const thresholds = pageTemplateDetailThresholds(file, contentPageCalls);
    const usesFixtureContent = pageTemplateDisallowsFixtureContent(file) && /\b(?:get_the_excerpt|the_content)\s*\(/.test(text);
    const genericLabels = pageTemplateGenericLabelHits(file, text);
    const passed = structuralTags >= thresholds.minTags && bytes >= thresholds.minBytes && !usesFixtureContent && genericLabels.length === 0;
    checks.push({
      type: 'page-template-detail',
      file,
      passed,
      details: `Page templates need page-specific rendered structure and explicit page intro copy. structural_tags=${structuralTags}; min_structural_tags=${thresholds.minTags}; content_page_calls=${contentPageCalls}; bytes=${bytes}; min_bytes=${thresholds.minBytes}; uses_fixture_content=${usesFixtureContent}; generic_labels=${genericLabels.join(', ')}`
    });
  }
  return checks;
}

function validateHeaderComposition(candidateDir, phpFiles) {
  if (!phpFiles.includes('header.php')) return [];
  const text = fs.existsSync(path.join(candidateDir, 'header.php')) ? fs.readFileSync(path.join(candidateDir, 'header.php'), 'utf8') : '';
  return [{
    type: 'header-composition-preserved',
    file: 'header.php',
    passed: !/\bwp_nav_menu\s*\(/.test(text),
    details: 'header.php must delegate primary navigation to template-parts/header/primary-navigation.php instead of inlining wp_nav_menu()'
  }];
}

module.exports = {
  validateDeclaredThemeHelperCalls,
  validateGeneratedTextContent,
  validateHeaderComposition,
  validatePageTemplateDetail,
  validateRequiredTemplatePartReferences,
  validateTemplatePartReferences
};
