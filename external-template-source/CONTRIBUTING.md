# Contributing to Nolan Young Theme Template 01

This repository is the authoritative development source for the theme. The installable WordPress ZIP is generated output and must never replace the repository as the source of truth.

## Required workflow

1. Pull the latest `main`.
2. Create a focused branch such as `feature/header-adjustment` or `fix/contact-layout`.
3. Run `npm ci` in a new checkout or whenever `package.json` or `package-lock.json` changes.
4. Use `npm run start` for readable development output or `npm run dev` for a minified production-mode watcher.
5. Edit PHP templates directly and edit maintained frontend source only under `src/js/` and `src/scss/`.
6. Stop active watchers.
7. Run `npm run build` as the final production gate.
8. Review the local WordPress site with `WP_DEBUG` enabled.
9. Commit source changes together with regenerated assets under `assets/css/` and `assets/js/`.
10. Open a pull request and complete the repository checklist.
11. Run `npm run package` only from an approved source state to create the WordPress-upload ZIP.

## Sources of truth

- PHP templates, `inc/`, `template-parts/`, `patterns/`, and `theme.json` are maintained runtime source.
- `src/scss/` is the sole maintained source for compiled CSS.
- `src/js/` is the sole maintained source for compiled JavaScript.
- `package.json` defines supported npm commands and direct Node dependencies.
- `package-lock.json` locks the Node dependency graph and must be committed.
- `webpack.config.js` defines build entry points and output behavior.
- `README.md` is the authoritative operating manual.
- `CHANGELOG.md` records released changes.
- `style.css` and `package.json` must carry matching theme versions.

## Generated files

The following files are committed because WordPress needs them at runtime, but they must never be edited manually:

- `assets/css/bundle.css`
- `assets/css/bundle-rtl.css`
- `assets/css/editor.css`
- `assets/css/editor-rtl.css`
- `assets/css/*.asset.php`
- `assets/js/bundle.js`
- `assets/js/*.asset.php`

Regenerate them with `npm run build`.

## Theme/plugin boundary

The theme owns presentation and WordPress template rendering. Persistent functionality, business logic, custom post type registration, form processing, access control, stored submissions, and privacy integrations belong in the companion plugin or another dedicated plugin.

Do not add `register_post_type()` or `register_taxonomy()` to this repository. The build validator rejects those calls.

## Commit expectations

Use small, descriptive commits. Examples:

- `feat: add reusable service hero variation`
- `fix: preserve mega-menu keyboard focus`
- `docs: clarify production packaging workflow`
- `chore: update locked build dependencies`

Do not commit `node_modules/`, `vendor/`, `dist/`, local environment files, logs, or credentials.
