'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('preview home URL mapping preserves WordPress query and fragment suffixes', () => {
  const source = fs.readFileSync(path.join(__dirname, '../legacy-wordpress.js'), 'utf8');
  const implementation = source.match(/function preview_home_url\(\$path = ''\)\{[\s\S]*?\n\}/)[0];
  const cases = ['', '/', '#schedule', '/#schedule', '/about/#team', '/contact/?topic=hello#inquiry', '/services/featured/#details', '/blog/?page=2'];
  const phpArray = `array(${cases.map((value) => `'${value}'`).join(',')})`;
  const result = spawnSync('php', ['-r', `${implementation}\necho json_encode(array_map('preview_home_url', ${phpArray}));`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), ['index.html', 'index.html', 'index.html#schedule', 'index.html#schedule', 'about-us_preview.html#team', 'contact_preview.html?topic=hello#inquiry', 'single_services_preview.html#details', 'blog_preview.html?page=2']);
});

test('empty-database conversion harness uses real default values and theme fallback menus', () => {
  const os = require('node:os');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-core-preview-'));
  try {
    fs.writeFileSync(path.join(root, 'functions.php'), '<?php function fixture_menu($args){ echo "fallback-menu"; }');
    fs.writeFileSync(path.join(root, 'front-page.php'), '<?php echo get_theme_mod("missing", "hello"); echo "|"; echo get_theme_mod("url", "%s/assets/a.jpg"); echo "|"; echo has_nav_menu("primary") ? "saved" : "empty"; echo "|"; wp_nav_menu(array("fallback_cb" => "fixture_menu"));');
    const legacy = require('../legacy-wordpress');
    assert.equal(legacy.renderTemplate(root, 'front-page.php', { emptyDatabase: true }), 'hello|./assets/a.jpg|empty|fallback-menu');
    fs.writeFileSync(path.join(root, 'functions.php'), '<?php add_action("after_setup_theme", function(){ add_theme_support("title-tag"); });');
    fs.writeFileSync(path.join(root, 'front-page.php'), '<?php wp_head();');
    assert.match(legacy.renderTemplate(root, 'front-page.php', { emptyDatabase: true }), /<title>WordPress conversion preview<\/title>/);
    fs.writeFileSync(path.join(root, 'front-page.php'), '<?php echo have_posts() ? "post" : "empty";');
    assert.equal(legacy.renderTemplate(root, 'front-page.php', { emptyDatabase: true }), 'empty');
    assert.equal(legacy.renderTemplate(root, 'front-page.php'), 'post');
    fs.writeFileSync(path.join(root, 'front-page.php'), '<?php missing_generated_helper();');
    assert.throws(() => legacy.renderTemplate(root, 'front-page.php', { emptyDatabase: true }), /missing_generated_helper/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
