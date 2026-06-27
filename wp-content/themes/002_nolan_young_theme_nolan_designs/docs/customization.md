# Customization

Global colors, spacing, typography, and widths belong in `theme.json`. Complex selectors and responsive behavior belong in `src/scss/`. Interactive behavior belongs in `src/js/`. Rebuild after source changes.

Do not add application logic to the theme. Extend durable functionality through the companion plugin or another purpose-built plugin.

## Primary mega menus

The Primary Navigation menu remains assigned through WordPress under Appearance > Menus. Services, About, and Blog receive mega-menu behavior when the menu item matches the expected title or URL, or when one of these CSS classes is assigned to the item:

- `nytt01-mega-services`
- `nytt01-mega-about`
- `nytt01-mega-blog`

Use the `nytt01_services_mega_menu_items` and `nytt01_about_mega_menu_items` filters to replace the default featured content without editing template files. Each item must provide `title`, `description`, `image`, `url`, and a `subitems` array containing `label` and `url` values.

The Blog mega menu always queries the four latest published standard posts and uses each post's featured image when available.
