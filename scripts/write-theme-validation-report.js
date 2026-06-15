#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const [themeSlug, templateName, outputJson, phase = 'final'] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!themeSlug || !templateName || !outputJson) {
  fail('Usage: node scripts/write-theme-validation-report.js <theme-slug> <template-name> <output-json> [phase]');
}

if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) fail(`Invalid theme slug: ${themeSlug}`);
if (themeSlug.includes('..') || templateName.includes('..') || outputJson.includes('..')) fail('Unsafe path segment detected.');

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
  return { status: result.status ?? 1, stdout: result.stdout || '', stderr: result.stderr || '' };
}

function check(name, cmd, args, pending = false) {
  if (pending) return { name, passed: null, status: 'pending', details: 'Pending for a later workflow phase.' };
  const result = run(cmd, args);
  return {
    name,
    passed: result.status === 0,
    status: result.status === 0 ? 'passed' : 'failed',
    details: [result.stdout.trim(), result.stderr.trim()].filter(Boolean).join('\n')
  };
}

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', themeSlug);
const zipPath = path.join(root, 'dist', 'zipped-themes', `${themeSlug}.zip`);

const finalPhase = phase === 'final';
const checks = [
  check('template_base_structure', 'bash', ['scripts/validate-theme-from-template.sh', themeSlug, templateName]),
  check('wordpress_quality', 'bash', ['scripts/theme-quality-check.sh', themeSlug]),
  check('preview_exists', 'node', ['-e', `const fs=require('fs');process.exit(fs.existsSync(${JSON.stringify(path.join(previewDir, 'homepage_preview.html'))}) ? 0 : 1)`], !finalPhase),
  check('preview_gallery_entry', 'node', ['-e', `const fs=require('fs');const html=fs.readFileSync(${JSON.stringify(path.join(root,'docs','index.html'))},'utf8');process.exit(html.includes(${JSON.stringify(themeSlug)}) ? 0 : 1)`], !finalPhase),
  check('zip_exists', 'node', ['-e', `const fs=require('fs');process.exit(fs.existsSync(${JSON.stringify(zipPath)}) ? 0 : 1)`], !finalPhase),
  check('zip_freshness', 'node', ['-e', `const fs=require('fs');const zip=fs.existsSync(${JSON.stringify(zipPath)}) ? fs.statSync(${JSON.stringify(zipPath)}).mtimeMs : 0;const theme=fs.existsSync(${JSON.stringify(themeDir)}) ? fs.statSync(${JSON.stringify(themeDir)}).mtimeMs : 0;process.exit(zip >= theme ? 0 : 1)`], !finalPhase),
  check('zip_contents', 'bash', ['scripts/validation/validate-generated-theme-all.sh', themeSlug, templateName], !finalPhase)
];

const passed = checks.every((entry) => entry.status !== 'failed');
const report = {
  theme_slug: themeSlug,
  template_name: templateName,
  passed,
  phase,
  created_at: new Date().toISOString(),
  checks
};

const outputPath = path.isAbsolute(outputJson) ? outputJson : path.join(root, outputJson);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(path.relative(root, outputPath).replace(/\\/g, '/'));
