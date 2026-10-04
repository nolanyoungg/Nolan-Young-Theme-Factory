# Common Ground Wordpress

A classic PHP WordPress theme converted from `017_nolan_young_theme_common_ground`. The prepared `style.css` identity is unchanged. All eight designed experiences retain the source copy, photography, responsive layout, fragment links, and local demo interactions. The two source home filenames become one WordPress front page. The theme does not depend on the original sample at runtime.

## Installation and page setup

1. Copy this entire theme directory into an isolated WordPress installation's `wp-content/themes/` directory and activate **Common Ground Wordpress** in Appearance → Themes. PHP 7.4+ and WordPress 6.3+ are the intended baseline; no plugins or npm packages are required. The generated bundles must be present.
2. Create and publish the pages below. Leave the editor body genuinely empty to display the original design. Select the named template in each page's template settings. No pages, posts, menus, settings, or other records are created automatically.

| Page title | Slug / public path | Template |
| --- | --- | --- |
| Home | `home` (served at `/` after assignment) | Default; `front-page.php` takes precedence |
| Studio | `about` → `/about/` | Common Ground — Studio |
| Services | `services` → `/services/` | Common Ground — Services |
| Work | `work` → `/work/` | Common Ground — Work |
| Journal | `blog` → `/blog/` | Common Ground — Journal |
| Contact | `contact` → `/contact/` | Common Ground — Contact |
| Privacy | `privacy-policy` → `/privacy-policy/` | Common Ground — Privacy |
| Renovations | `featured`, with **Services as parent** → `/services/featured/` | Common Ground — Renovations |

3. In Settings → Reading, select **A static page** and choose Home as the homepage. Leave the posts-page assignment empty to retain the designed Journal page. If a live posts feed is wanted, create a separate page such as News and assign that as the posts page; WordPress then uses `index.php` there. Do not assign Journal as the posts page: WordPress would ignore its page template.
4. In Settings → Permalinks, select a pretty permalink structure such as Post name and save. Confirm that the server supports WordPress rewrites. The theme's built-in links use the paths above, including on subdirectory installations through `home_url()`; different slugs require updating those links in the template parts as well as menus. The theme does not install rewrites or make missing pages exist.
5. In Appearance → Menus, optionally assign a flat menu to **Primary navigation** in this order: Work, Studio, Services, Journal, Contact (label it “Start a project ↗”). Contact links receive the original button styling. Assign a second flat menu to **Footer navigation**: Home, Work, Studio, Services, Journal, Renovations, Contact, Privacy. Nesting is intentionally limited to one level to preserve the design. With no assigned menu, the original navigation is rendered as a fallback. The fallback links still require the pages above to exist.

## Editing content

Ordinary pages using the Default template use the normal WordPress loop, page title, `the_content()`, and paginated content. Posts, archives, search results, and a separately assigned posts page use the real main query in `index.php`; the fallback also renders single-post content. Comments are not rendered by this theme.

For Home and the seven designed templates, an empty editor body displays `template-parts/design-*.php`. Any nonempty saved editor content replaces the **whole main body**, including its heading and inquiry section, through `the_content()`. Header and footer remain shared. Password-protected pages show the WordPress password form rather than the demo body. To restore the original layout, remove all editor blocks and save; even an empty saved block can count as content.

For an editable starting point, use the block inserter's Patterns → **Common Ground layouts** and insert exactly one corresponding layout into the empty page. These registered patterns provide the original layout as a standard **Custom HTML block**. Edit its copy and links in the block's HTML view while preserving classes, IDs, credits, and image attributes; PHP is already resolved into ordinary local URLs. This is HTML editing, not a set of individually editable visual blocks. You may instead build a replacement with standard blocks. Designed replacements provide the outer `main` only: include your own heading and a Group with the `wrap` CSS class for content margins when building a fresh layout. Pattern URLs are saved with the page; after a domain or installation-path migration, update those saved URLs through the usual WordPress migration process. Default PHP layouts resolve URLs on every request.

The Contact page deliberately has no pattern, since WordPress may strip form controls from saved content depending on user permissions. Keep its body empty to retain the fully functional local demonstration. Adding page content replaces that demonstration too; there is no hidden second form.

Exactly what stays in theme files until explicitly replaced:

- `design-home.php`: hero copy/photo, selected studies, philosophy, service summaries, and shared inquiry callout.
- `design-about-us.php`: studio introduction, portrait, principles, process, and inquiry callout.
- `design-services.php`: three offerings, scope lists, FAQs, and inquiry callout.
- `design-work.php`: all three fictional project studies, metadata, photography, fragment destinations, and inquiry callout.
- `design-blog.php`: featured article and all three complete journal articles, reading labels, fragments, and inquiry callout. These are sample editorial content, not database posts.
- `design-contact.php`: introductory copy, example address, all form labels/options/help text, demo notices, and form markup. Confirmation copy remains in `assets/js/site.js`.
- `design-policy.php`: the original sample privacy text and section navigation. This describes the supplied sample, not every possible WordPress installation. Before public use, replace it with text reflecting actual hosting, WordPress login/comment cookies, plugins, analytics, and any real form processing.
- `design-single-service.php`: renovation introduction, scope, process, example project, FAQs, and inquiry callout.
- `template-parts/brand.php`, `template-parts/inquiry.php`, and `footer.php`: brand name/mark, shared callout, footer description, fictional-practice note, and original 2026 sample copyright. These are intentionally fixed template content. Change them in a child theme for a real practice. Menus are editable through Appearance → Menus; there are no theme-specific options or Customizer settings.

Page titles and the WordPress site title feed WordPress document titles. Default designed headings and the visible Common Ground logo stay as supplied; changing a page title alone does not rewrite a designed heading. Patterns and replacement content are stored normally by WordPress only when an editor saves them. There are no custom post types, custom taxonomies, activation mutations, or content imports.

## Assets and build

The approved photographs, SVG assets, and `assets/images/asset-manifest.json` remain unchanged, including their intentional attribution to source sample 017. Photographs are illustrative stock by Pierre Châtel-Innocenti and Annie Spratt under the recorded Unsplash License, not photographs of built Common Ground projects. Preserve the accompanying credits. The brand mark is the original inline SVG.

`assets/css/site.css` and `assets/js/site.js` are unchanged source design files. The prepared dependency-free `npm run build` copies them byte-for-byte to `assets/css/bundle.css` and `assets/js/bundle.js`. Run it from this theme directory when intentionally changing those source files; no install step is needed. WordPress enqueues the bundles using `get_theme_file_uri()`. The small separate `assets/css/wordpress.css` supports native menu lists and editable content without altering the source stylesheet. The script loads in the footer after the page markup. No remote fonts, image hotlinks, submission APIs, or runtime packages are introduced.

## Demo interactions

Mobile navigation retains the original button state, Escape/focus behavior, outside-click handling, and close-on-navigation behavior. With JavaScript disabled, navigation remains visible. FAQ disclosures and in-page project/article links are native HTML.

The inquiry form is **demo-only**. It validates locally and displays the original live-region confirmation. It has no submission field names, server handler, email action, fetch request, database write, or browser-storage write. Its non-submit preview button remains disabled until the original script attaches; a noscript message explains the limitation. Use invented details. Browser history may restore field values. The displayed `example.test` address is not monitored. Real submissions require a separately implemented, secured form and an updated privacy policy; none is connected here.

## Verification boundary

This conversion pass creates only the prepared theme and runs its dependency-free build. The parent runner owns deterministic validation, PHP lint, harness previews, screenshots, and packaging afterward. A PHP preview harness is not an actual WordPress installation. Activation, editor pattern insertion/saving, assigned menus, WordPress routing, password handling, admin screens, plugin compatibility, and real form behavior remain unverified in a live runtime unless separately tested in an isolated installation. No live WordPress site was modified; no reports, previews, ZIPs, publication, network requests, or dependency installations are part of this pass.
