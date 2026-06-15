#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const [sourceFile, themeDirArg] = process.argv.slice(2);
const warnings = [];

function fail(message) {
  for (const warning of warnings || []) {
    console.warn(`WARNING: ${warning}`);
  }
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!sourceFile || !themeDirArg) {
  fail('Usage: node scripts/apply-theme-file-blocks.js <source-output-file> <theme-dir>');
}

const themeDir = path.resolve(themeDirArg);
const themeSlug = path.basename(themeDir);
const input = fs.readFileSync(sourceFile, 'utf8')
  .replace(/\u001B\[[0-9;?]*[ -/]*[@-~]/g, '')
  .replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]\s*/g, '')
  .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
const pattern = /^---FILE: ([^\r\n]+)---\r?\n([\s\S]*?)\r?\n---END FILE---$/gm;
let match;
let count = 0;

function phpIsAvailable() {
  if (phpIsAvailable.cached !== undefined) return phpIsAvailable.cached;
  phpIsAvailable.cached = spawnSync('php', ['-v'], { encoding: 'utf8' }).status === 0;
  return phpIsAvailable.cached;
}

function phpSyntaxIsValid(relativePath, content) {
  if (!relativePath.endsWith('.php') || !phpIsAvailable()) return true;
  const tempDir = path.join(os.tmpdir(), 'theme-factory-php-lint');
  fs.mkdirSync(tempDir, { recursive: true });
  const tempFile = path.join(tempDir, `.php-lint-${Date.now()}-${Math.random().toString(16).slice(2)}.php`);
  fs.writeFileSync(tempFile, content, 'utf8');
  const result = spawnSync('php', ['-l', tempFile], { encoding: 'utf8' });
  fs.rmSync(tempFile, { force: true });
  if (result.status !== 0) {
    warnings.push(`Skipped invalid PHP from model for ${relativePath}; kept existing template file.`);
    return false;
  }
  return true;
}

function sanitizeRemoteReferences(content) {
  return content.replace(/https?:\/\/[^\s"'<>),]+/g, (url) => {
    if (url.startsWith('https://schemas.wp.org')) return url;
    if (url.startsWith('https://www.w3.org') || url.startsWith('http://www.w3.org')) return url;
    return '#';
  });
}

function sanitizeScaffoldOnlyCopy(content) {
  return content
    .replace(/^[ \t]*\/\/[ \t]*Add settings and controls here[ \t]*\r?\n/gm, '')
    .replace(/^[ \t]*\/\/[ \t]*Add routes here[ \t]*\r?\n/gm, '')
    .replace(/^[ \t]*\/\/[ \t]*Add .+ here[ \t]*\r?\n/gm, '');
}

function normalizePhpTemplateContent(relativePath, content) {
  if (!relativePath.endsWith('.php') || !content.startsWith('<?php')) return content;

  content = content
    .replace(/^\?php$/gm, '?>')
    .replace(/^(<\?php[^\n]*\?>)\n\?>\n/, '$1\n')
    .replace(/^(<\?php[^\n]*\?>)\r\n\?>\r\n/, '$1\r\n');

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  let inPhp = true;
  let inBlockComment = false;

  for (let index = 1; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();

    if (!inPhp) {
      if (trimmed === '<?php') inPhp = true;
      continue;
    }

    if (!trimmed) continue;

    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }

    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlockComment = true;
      continue;
    }

    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    if (trimmed.startsWith('?>')) {
      inPhp = false;
      continue;
    }

    if (trimmed.startsWith('<?php')) {
      inPhp = !trimmed.includes('?>');
      continue;
    }

    if (trimmed.startsWith('<')) {
      lines.splice(index, 0, '?>');
      inPhp = false;
      index += 1;
    }
  }

  return lines.join('\n');
}

function writeFile(relativePath, content) {
  let cleanedPath = String(relativePath || '').trim().replace(/\\/g, '/');
  cleanedPath = cleanedPath.replace(/^\.\//, '');

  const themePrefix = `wp-content/themes/${themeSlug}/`;
  if (cleanedPath.startsWith(themePrefix)) {
    cleanedPath = cleanedPath.slice(themePrefix.length);
  }

  if (!cleanedPath) fail('Encountered an empty file path.');
  if (path.isAbsolute(cleanedPath) || cleanedPath.includes('..')) {
    fail(`Rejected unsafe file path: ${cleanedPath}`);
  }

  const target = path.resolve(themeDir, cleanedPath);
  if (!target.startsWith(themeDir + path.sep)) {
    fail(`Rejected path outside theme folder: ${cleanedPath}`);
  }

  if (cleanedPath === 'style.css') {
    warnings.push('Skipped model output for style.css; WordPress theme metadata is prepared deterministically.');
    return;
  }

  content = sanitizeScaffoldOnlyCopy(normalizePhpTemplateContent(cleanedPath, sanitizeRemoteReferences(content)));

  if (!phpSyntaxIsValid(cleanedPath, content)) return;

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
  count += 1;
}

while ((match = pattern.exec(input)) !== null) {
  writeFile(match[1], match[2]);
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1];

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) return text.slice(start, end + 1);
  return '';
}

function readJsonString(text, start) {
  let end = start + 1;
  let escaped = false;
  while (end < text.length) {
    const char = text[end];
    if (escaped) {
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === '"') {
      return { value: JSON.parse(text.slice(start, end + 1)), end: end + 1 };
    }
    end += 1;
  }
  return null;
}

function readContentLines(text, start) {
  const lines = [];
  let index = start;

  while (index < text.length) {
    while (index < text.length && /[\s,]/.test(text[index])) index += 1;
    if (text[index] === ']') return lines;
    if (text[index] !== '"') return lines;

    const parsed = readJsonString(text, index);
    if (!parsed) return lines;
    lines.push(parsed.value);
    index = parsed.end;
  }

  return lines;
}

function salvageJsonFiles(text) {
  const pathPattern = /"path"\s*:\s*"([^"]+)"/g;
  let salvaged = 0;
  let pathMatch;

  while ((pathMatch = pathPattern.exec(text)) !== null) {
    const nextPath = text.indexOf('"path"', pathPattern.lastIndex);
    const contentKey = text.indexOf('"content_lines"', pathPattern.lastIndex);
    if (contentKey === -1) continue;
    if (nextPath !== -1 && nextPath < contentKey) continue;

    const arrayStart = text.indexOf('[', contentKey);
    if (arrayStart === -1) continue;

    const lines = readContentLines(text, arrayStart + 1);
    if (lines.length === 0) continue;

    const before = count;
    writeFile(pathMatch[1], `${lines.map((line) => String(line)).join('\n')}\n`);
    if (count > before) salvaged += 1;
  }

  return salvaged;
}

if (count === 0) {
  const jsonText = extractJson(input);
  if (jsonText) {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      const salvaged = salvageJsonFiles(jsonText);
      if (salvaged === 0) {
        fail(`Could not parse JSON file payload: ${error.message}`);
      }
      warnings.push(`JSON payload was malformed; salvaged ${salvaged} complete file entr${salvaged === 1 ? 'y' : 'ies'}.`);
    }

    if (parsed && !Array.isArray(parsed.files)) {
      fail('JSON payload must contain a files array.');
    }

    if (parsed) {
      for (const file of parsed.files) {
        if (!file || typeof file !== 'object') continue;
        let content = '';
        if (Array.isArray(file.content_lines)) {
          content = file.content_lines.map((line) => String(line)).join('\n');
        } else if (typeof file.content === 'string') {
          content = file.content;
        } else {
          fail(`File entry missing content or content_lines: ${file.path || '(unknown path)'}`);
        }
        writeFile(file.path, `${content.replace(/\r\n/g, '\n')}\n`);
      }
    }
  }
}

if (count === 0) {
  fail('No file blocks or JSON files payload were found.');
}

for (const warning of warnings) {
  console.warn(`WARNING: ${warning}`);
}

console.log(`Applied ${count} file block(s).`);
