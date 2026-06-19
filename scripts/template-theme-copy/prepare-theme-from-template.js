#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const {
  assertTemplateName,
  assertThemeSlug,
  nextThemeNumber,
  slugifyPromptPath
} = require('../shared/theme-utils');

const args = parseArgs(process.argv.slice(2));
const [positionalPrompt, positionalTemplate] = args._;
const promptFile = arg(args, 'prompt', positionalPrompt || process.env.THEME_PROMPT_FILE || '');
const templateName = arg(args, 'template', positionalTemplate || process.env.THEME_TEMPLATE || 'NOLAN-YOUNG-theme-000');
const requestedThemeSlug = arg(args, 'theme-slug', process.env.THEME_SLUG || '');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function updateJson(file, updater) {
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function promptBusinessName(promptText) {
  const explicit = promptText.match(/For this theme,\s+use\s+`([^`]+)`/i);
  if (explicit) return explicit[1].trim();
  const named = promptText.match(/Business Name\s*\r?\n+([\s\S]{0,300}?)(?:\r?\n#{2,}|$)/i);
  const fallback = named && named[1].match(/`([^`]+)`/);
  return fallback ? fallback[1].trim() : 'the generated business';
}

function writeThemeFile(themeDir, relativePath, content) {
  const target = path.join(themeDir, relativePath);
  if (!fs.existsSync(target)) return;
  fs.writeFileSync(target, `${content.replace(/\r\n/g, '\n').replace(/\n?$/, '\n')}`);
}

function completeCopiedTemplateScaffolds(themeDir, businessName) {
  const headerPath = path.join(themeDir, 'header.php');
  if (fs.existsSync(headerPath)) {
    const header = fs.readFileSync(headerPath, 'utf8')
      .replace(/esc_html_e\(\s*'Lorem ipsum dolor'\s*,\s*'nolan-young-template'\s*\)/g, "esc_html_e( 'Websites that help businesses grow.', 'nolan-young-template' )");
    fs.writeFileSync(headerPath, header);
  }

  writeThemeFile(themeDir, 'accessibility/README.md', `# Accessibility

${businessName} includes keyboard-visible focus states, semantic section structure, responsive navigation states, reduced-motion safeguards, and local assets that do not depend on third-party runtime services.

Review generated templates after content changes to confirm heading order, link labels, form labels, and contrast remain appropriate for the final site owner.
`);

  writeThemeFile(themeDir, 'assets/icons/README.md', `# Icons

This folder contains local SVG icon assets for ${businessName}. Keep icons simple, accessible, and self-contained. Do not reference remote icon fonts or CDN icon libraries from the generated theme.
`);

  writeThemeFile(themeDir, 'blocks/README.md', `# Blocks

This generated theme is template-first. Add custom blocks only when a future implementation needs editor-specific block behavior; keep shared presentation in template parts and bundled assets.
`);

  writeThemeFile(themeDir, 'inc/template-tags.php', `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function nolan_young_template_fallback_menu() {
\t$links = array(
\t\tarray( 'label' => __( 'Services', 'nolan-young-template' ), 'url' => home_url( '/services/' ) ),
\t\tarray( 'label' => __( 'About', 'nolan-young-template' ), 'url' => home_url( '/about/' ) ),
\t\tarray( 'label' => __( 'Work', 'nolan-young-template' ), 'url' => home_url( '/work/' ) ),
\t\tarray( 'label' => __( 'Contact', 'nolan-young-template' ), 'url' => home_url( '/contact/' ) ),
\t);

\techo '<ul class="menu">';
\tforeach ( $links as $link ) {
\t\techo '<li><a href="' . esc_url( $link['url'] ) . '">' . esc_html( $link['label'] ) . '</a></li>';
\t}
\techo '</ul>';
}
`);

  writeThemeFile(themeDir, 'template-parts/content-none.php', `<?php
/**
 * Empty content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-none">
\t<div class="template-container">
\t\t<p class="eyebrow"><?php esc_html_e( 'Content unavailable', 'nolan-young-template' ); ?></p>
\t\t<h2><?php esc_html_e( 'No matching content was found.', 'nolan-young-template' ); ?></h2>
\t\t<p><?php esc_html_e( 'Try another search or return to the homepage to continue exploring services, resources, and ways to start a project.', 'nolan-young-template' ); ?></p>
\t\t<?php get_search_form(); ?>
\t</div>
</section>
`);

  writeThemeFile(themeDir, 'template-parts/content-page.php', `<?php
/**
 * Generic page content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-page">
\t<div class="template-container">
\t\t<p class="eyebrow"><?php esc_html_e( 'Page details', 'nolan-young-template' ); ?></p>
\t\t<?php the_title( '<h1>', '</h1>' ); ?>
\t\t<div class="entry-content">
\t\t\t<?php the_content(); ?>
\t\t</div>
\t</div>
</section>
`);

  writeThemeFile(themeDir, 'template-parts/content-policy.php', `<?php
/**
 * Policy page content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-policy">
\t<div class="template-container">
\t\t<p class="eyebrow"><?php esc_html_e( 'Policy information', 'nolan-young-template' ); ?></p>
\t\t<?php the_title( '<h1>', '</h1>' ); ?>
\t\t<div class="entry-content">
\t\t\t<?php the_content(); ?>
\t\t</div>
\t</div>
</section>
`);

  writeThemeFile(themeDir, 'template-parts/content-search.php', `<?php
/**
 * Search result fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section content-search">
\t<div class="template-container">
\t\t<p class="eyebrow"><?php esc_html_e( 'Search results', 'nolan-young-template' ); ?></p>
\t\t<?php the_title( '<h2>', '</h2>' ); ?>
\t\t<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 28 ) ); ?></p>
\t\t<a class="btn btn-text" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Read more', 'nolan-young-template' ); ?></a>
\t</div>
</section>
`);

  writeThemeFile(themeDir, 'template-parts/content-single.php', `<?php
/**
 * Single post content fragment.
 *
 * @package Nolan_Young_Template
 */
?>
<article <?php post_class( 'template-section content-single' ); ?>>
\t<div class="template-container">
\t\t<p class="eyebrow"><?php esc_html_e( 'Resource', 'nolan-young-template' ); ?></p>
\t\t<?php the_title( '<h1>', '</h1>' ); ?>
\t\t<div class="entry-content">
\t\t\t<?php the_content(); ?>
\t\t</div>
\t</div>
</article>
`);
}

if (!promptFile) fail('Usage: node scripts/template-theme-copy/prepare-theme-from-template.js --prompt <prompt-file> [--template <template-name>] [--theme-slug <theme-slug>]');
if (promptFile.includes('..') || templateName.includes('..')) fail('Unsafe path segment detected.');
assertTemplateName(templateName);

const promptPath = path.isAbsolute(promptFile) ? promptFile : path.join(root, promptFile);
if (!fs.existsSync(promptPath)) fail(`Prompt file not found: ${promptFile}`);
const promptText = fs.readFileSync(promptPath, 'utf8');

const templateDir = path.join(root, 'wordpress-themplate-themes', templateName);
if (!fs.existsSync(templateDir)) fail(`Template not found: wordpress-themplate-themes/${templateName}`);

const themeSlug = requestedThemeSlug || `${nextThemeNumber()}_nolan_young_theme_${slugifyPromptPath(promptPath)}`;
assertThemeSlug(themeSlug);

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (fs.existsSync(themeDir)) fail(`Theme already exists: wp-content/themes/${themeSlug}`);

fs.cpSync(templateDir, themeDir, { recursive: true });
completeCopiedTemplateScaffolds(themeDir, promptBusinessName(promptText));

const title = themeSlug.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const stylePath = path.join(themeDir, 'style.css');
if (fs.existsSync(stylePath)) {
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(/^Theme Name:.*$/m, `Theme Name: ${title}`);
  style = style.replace(/^Description:.*$/m, `Description: Generated WordPress theme prepared from ${templateName}.`);
  style = style.replace(/^Text Domain:.*$/m, `Text Domain: ${themeSlug}`);
  fs.writeFileSync(stylePath, style);
}

const packageName = themeSlug.replace(/_/g, '-');
updateJson(path.join(themeDir, 'package.json'), (pkg) => { pkg.name = packageName; });
updateJson(path.join(themeDir, 'package-lock.json'), (lock) => {
  lock.name = packageName;
  if (lock.packages && lock.packages['']) lock.packages[''].name = packageName;
});

fs.writeFileSync(path.join(themeDir, '.theme-template-source'), `template=${templateName}\nprepared_slug=${themeSlug}\n`);

console.log(`Prepared theme folder: wp-content/themes/${themeSlug}`);
console.log(`Template source: wordpress-themplate-themes/${templateName}`);
console.log(`Theme generation must edit only: wp-content/themes/${themeSlug}`);
