'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('preview home URL mapping preserves WordPress query and fragment suffixes', () => {
  const source = fs.readFileSync(path.join(__dirname, '../theme-factory.js'), 'utf8');
  const implementation = source.match(/function preview_home_url\(\$path = ''\)\{[\s\S]*?\n\}/)[0];
  const cases = ['', '/', '#schedule', '/#schedule', '/about/#team', '/contact/?topic=hello#inquiry', '/services/featured/#details', '/blog/?page=2'];
  const phpArray = `array(${cases.map((value) => `'${value}'`).join(',')})`;
  const result = spawnSync('php', ['-r', `${implementation}\necho json_encode(array_map('preview_home_url', ${phpArray}));`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), ['index.html', 'index.html', 'index.html#schedule', 'index.html#schedule', 'about-us_preview.html#team', 'contact_preview.html?topic=hello#inquiry', 'single_services_preview.html#details', 'blog_preview.html?page=2']);
});
