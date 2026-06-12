#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [sourceFile, themeDirArg] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!sourceFile || !themeDirArg) {
  fail('Usage: node scripts/apply-theme-file-blocks.js <source-output-file> <theme-dir>');
}

const themeDir = path.resolve(themeDirArg);
const input = fs.readFileSync(sourceFile, 'utf8').replace(/\u001B\[[0-9;?]*[ -/]*[@-~]/g, '');
const pattern = /^---FILE: ([^\r\n]+)---\r?\n([\s\S]*?)\r?\n---END FILE---$/gm;
let match;
let count = 0;

while ((match = pattern.exec(input)) !== null) {
  const relativePath = String(match[1] || '').trim();
  const content = match[2];

  if (!relativePath) fail('Encountered an empty file block path.');
  if (path.isAbsolute(relativePath) || relativePath.includes('..')) {
    fail(`Rejected unsafe file block path: ${relativePath}`);
  }

  const target = path.resolve(themeDir, relativePath);
  if (!target.startsWith(themeDir + path.sep)) {
    fail(`Rejected path outside theme folder: ${relativePath}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
  count += 1;
}

if (count === 0) {
  fail('No file blocks were found. Expected ---FILE: relative/path--- blocks.');
}

console.log(`Applied ${count} file block(s).`);
