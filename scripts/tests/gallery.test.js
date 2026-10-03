'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { renderGallery } = require('../lib/gallery');
const { runNpm } = require('../lib/npm');

test('every supplied preview page targets its own embedded website, including extra pages', () => {
  const themes = [
    { slug: '007_nolan_young_theme_example', title: '007 Nolan Young Theme Example', pages: ['index.html', 'about-us_preview.html', 'extra-page.html'] },
    { slug: '008_nolan_young_theme_second', title: 'Second', pages: ['index.html', 'contact_preview.html'] }
  ];
  const html = renderGallery(themes);
  for (const theme of themes) for (const page of theme.pages) {
    assert.ok(html.includes(`href="Preview-Themes-Github/${theme.slug}/${page}" target="preview-${theme.slug}"`));
  }
  assert.ok(html.indexOf('<iframe') < html.indexOf('<h2>Example</h2>'));
  assert.ok(!html.includes('ZIP ready'));
});

test('gallery escapes theme metadata and supports an empty inventory', () => {
  const html = renderGallery([{ slug: '007_nolan_young_theme_example', title: 'A <script> & "B"', pages: ['index.html'] }]);
  assert.ok(html.includes('A &lt;script&gt; &amp; &quot;B&quot;'));
  assert.ok(renderGallery([]).includes('No previews are available yet.'));
});

test('npm version probe works without launching a Windows command shim', () => {
  const result = runNpm(['--version'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout.trim(), /^\d+\.\d+\.\d+/);
});
