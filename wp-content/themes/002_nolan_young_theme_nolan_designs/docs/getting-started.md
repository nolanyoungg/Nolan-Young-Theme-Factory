# Getting started

1. Install and activate `nolan-young-core.zip`.
2. Install and activate `nolan-young-theme-template-01.zip`.
3. Assign Primary and Footer menus under Appearance.
4. Create a static front page and an optional posts page under Settings → Reading.
5. Assign page templates only where their specialized composition is needed.

## Development

Install the locked dependencies:

```bash
npm ci
```

Use the standard readable WordPress watcher for normal debugging:

```bash
npm run start
```

Use the minified production-mode watcher when production-style output is specifically required during local work:

```bash
npm run dev
```

Stop either watcher with `Ctrl + C`. When development is complete, run the final production gate last:

```bash
npm run build
```

`npm run build` cleans generated assets, lints maintained source, creates optimized production assets, and validates the theme structure. `npm test` is an alias for the same final gate.

For PHP standards, install Composer dependencies and run `composer lint:php`.
