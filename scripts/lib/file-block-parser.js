const path = require('path');

function fail(message) {
  throw new Error(message);
}

function unwrapMarkdownFence(content) {
  const normalized = String(content || '').replace(/\r\n/g, '\n');
  const match = normalized.match(/(?:^|\n)```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```(?:\n|$)/);
  if (!match) return content;
  return match[1];
}

function unwrapFileContentFence(content, relativePath) {
  const normalized = String(content || '').replace(/\r\n/g, '\n');
  const ext = path.posix.extname(String(relativePath || '')).toLowerCase();
  if (!['.php', '.css', '.scss', '.js', '.mjs', '.cjs', '.json', '.svg', '.html'].includes(ext)) return unwrapMarkdownFence(normalized);
  const fullFence = normalized.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```$/);
  if (fullFence) return fullFence[1];
  return normalized
    .replace(/^```[a-zA-Z0-9_-]*\n/, '')
    .replace(/\n```$/, '')
    .replace(/\n---$/, '');
}

function unwrapLeadingMarkdownFence(content) {
  const normalized = String(content || '').replace(/\r\n/g, '\n').trimStart();
  const match = normalized.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```/);
  return match ? match[1] : content;
}

function singleRequiredFileFromOptions(options) {
  const required = options.requiredFiles || [];
  const optional = options.optionalFiles || [];
  const patterns = options.allowedPatterns || [];
  if (options.singleRequiredFile) return options.singleRequiredFile;
  if (required.length === 1 && optional.length === 0 && patterns.length === 0) return required[0];
  return '';
}

function looksLikeModelDecline(content) {
  const trimmed = String(content || '').trim();
  if (!trimmed) return false;
  const lowered = trimmed.toLowerCase();
  if (/---file:\s*/i.test(trimmed)) return false;
  return [
    "i'm sorry",
    'i will not proceed',
    "i can't assist",
    'i cannot assist',
    'cannot comply',
    'unable to comply',
    'significant amount of time and resources',
    'please let me know',
    'within the scope of ethical and respectful guidelines'
  ].some((phrase) => lowered.includes(phrase));
}

function normalizeRelativePath(input, themeSlug) {
  let value = String(input || '').trim().replace(/\\/g, '/').replace(/^\.\//, '');
  const themePrefix = `wp-content/themes/${themeSlug}/`;
  if (value.startsWith(themePrefix)) value = value.slice(themePrefix.length);
  if (!value) fail('Encountered an empty file path.');
  if (path.isAbsolute(value) || value.includes('..')) fail(`Rejected unsafe file path: ${value}`);
  return value;
}

function parseSingleFileProtocolFallback(raw, themeSlug, options) {
  const singleRequiredFile = singleRequiredFileFromOptions(options);
  if (!singleRequiredFile) return null;
  const normalizedPath = normalizeRelativePath(singleRequiredFile, themeSlug);
  const stripped = String(raw || '')
    .replace(/\u001b\[[0-9;?]*[A-Za-z]/g, '')
    .replace(/\r\n/g, '\n')
    .trim();
  if (!stripped || /-{2,}FILE:\s*/i.test(stripped)) return null;
  const content = unwrapLeadingMarkdownFence(stripped).trim();
  if (!content) return null;
  const ext = path.posix.extname(normalizedPath).toLowerCase();
  if (!['.php', '.css', '.scss', '.js', '.mjs', '.cjs', '.json', '.svg'].includes(ext)) return null;
  if (ext === '.php' && !content.startsWith('<?php')) return null;
  if ((ext === '.css' || ext === '.scss') && /<\?php/i.test(content)) return null;
  return [{
    relativePath: normalizedPath,
    content: `${String(content || '').replace(/\n?$/, '\n')}`
  }];
}

function parseExactFileBlocks(raw, themeSlug, options = {}) {
  const normalizedRaw = raw
    .replace(/\u001b\[[0-9;?]*[A-Za-z]/g, '')
    .replace(/^[ \t]*[\u2800-\u28ff](?:[ \t\u2800-\u28ff])*[ \t]*(?:\n|$)/gmu, '')
    .replace(/\r\n/g, '\n');
  if (options.allowNoChange) {
    const trimmed = unwrapMarkdownFence(normalizedRaw).trim();
    if (trimmed === '---NO CHANGES---' || trimmed.startsWith('---NO CHANGES---')) return [];
    if (options.allowDeclineAsNoChange && looksLikeModelDecline(trimmed)) return [];
  }
  const normalized = normalizedRaw
    .replace(/^---FILE:\s*([^\n]+?)-{3,}\s*$/gm, '---FILE: $1---')
    .replace(/^\s*--FILE:\s*([^\n-]+?)(?:--)?\s*$/gm, '---FILE: $1---')
    .replace(/^```FILE:\s*([^\n]+)$/gm, '---FILE: $1---')
    .replace(/^```$/gm, '---END FILE---');
  const blockPattern = /^---FILE:\s*([^\n]+?)(?:---)?$/gm;
  const files = [];
  const matches = [];
  let match;
  while ((match = blockPattern.exec(normalized)) !== null) {
    matches.push({ relativePath: match[1], contentStart: blockPattern.lastIndex, headerIndex: match.index });
  }
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const nextHeaderIndex = index + 1 < matches.length ? matches[index + 1].headerIndex : normalized.length;
    let contentEnd = nextHeaderIndex;
    const explicitEndIndex = normalized.indexOf('\n---END FILE---', current.contentStart);
    if (explicitEndIndex !== -1 && explicitEndIndex < contentEnd) contentEnd = explicitEndIndex;
    let content = normalized.slice(current.contentStart, contentEnd).replace(/^\n+/, '').replace(/\n+$/, '');
    const relativePath = normalizeRelativePath(current.relativePath, themeSlug);
    content = unwrapFileContentFence(content, relativePath);
    files.push({
      relativePath,
      content: `${String(content || '').replace(/\n?$/, '\n')}`
    });
  }
  if (files.length === 0) {
    const fallback = parseSingleFileProtocolFallback(normalizedRaw, themeSlug, options);
    if (fallback) return fallback;
    fail('No documented file blocks were found.');
  }
  return files;
}

module.exports = {
  looksLikeModelDecline,
  normalizeRelativePath,
  parseExactFileBlocks
};
