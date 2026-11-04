# Changelog

## 3.0.0

A rebuild of the plugin. Several features advertised in 2.x did not work in practice; they now do, and are covered by automated browser tests.

### Fixed

- **Themes** never applied: the theme stylesheet was a `$:/tags/RawMarkup` tiddler, which TiddlyWiki inserts without rendering, so no theme variables were defined and the layout broke (sidebar overlapping content). Themes are now data tiddlers read by a live stylesheet, and switching applies immediately.
- **Analytics and social media tags** had the same problem and wrote raw wikitext into the page head. They are now generated with proper escaping when the site is saved.
- **Post titles appeared twice**, and tags such as `Post` and `Featured` were shown as categories. Posts and pages now use the view template cascade and categories exclude reserved tags correctly, including multi-word tags.
- **Advanced search** failed with a filter syntax error. Search has been rewritten with type, category and author filters, and the sidebar search box (previously in the hidden core sidebar) is now in the blog sidebar.
- **Reading time** and **table of contents** rendered empty. Both work, and table of contents entries scroll to their heading.
- **Event, gallery, video and quote** layouts: event dates were parsed with the wrong format, YouTube IDs were extracted unreliably, and inline `<style>` blocks had their CSS variables corrupted (`--` became an en dash).
- **Edit buttons were hidden** for everyone, so existing posts could not be edited from the page. They now appear in admin mode.
- **Admin panel state was saved into the site**, so leaving it open published it to visitors. Admin mode now uses a temporary tiddler.
- **Saver**: cancelling the password prompt fell through to a file download; autosave prompted for the password after every edit; "Test connection" made a real commit. All fixed.
- Release workflow linked to a missing changelog and used a retired GitHub Action.

### Added

- **Conflict protection**: a save made from an out-of-date copy is refused with a clear choice to cancel or overwrite, instead of silently replacing another editor's work.
- **Cloudflare functions in the repository**: `save.js` (constant-time password check, origin check, size limit, content check, verify mode, editor name in commit messages) plus `rss.xml`, `sitemap.xml` and `robots.txt` generated from the deployed site.
- **Starter kit** (`tiddlysite-starter.zip`): a ready-to-upload site with example content, functions and security headers.
- **Post details form** in the editor for author, date, excerpt, draft, featured, favorite, table of contents and each post type's fields.
- Masked, accessible **password dialog** with an optional editor name and "remember until I close this page".
- **Blog settings** in one place (General, Theme, Menu, Publishing, Sharing & SEO, Analytics, Maintenance), including a menu editor.
- Archive grouped by year, category pages with optional introductions, related posts, newer/older links, copy link button, upcoming events on the home page, automatic event status.
- Extension points: post types (`$:/tags/cb/PostType`), post sections (`$:/tags/cb/PostSection`), themes (`$:/tags/cb/Theme`).
- Mobile menu, skip link, focus styles, WCAG AA colour contrast in every theme.
- Maintenance tab to remove version 2 leftovers and reset edited built-in pages.
- Local preview server (`npm run serve`), function tests and Playwright browser tests in CI.

### Changed

- The build now uses TiddlyWiki's Node.js tooling (`npm run build`) instead of Python scripts. Release files are built into `dist/` and are no longer committed.
- `collaborative-blog-plugin.json` now contains only the plugin; `collaborative-blog-starter.json` contains the plugin plus example content.
- The Advanced Search page is now the `Search` page; the theme setting stores the theme tiddler's title (old short names still work).
- Publishing settings moved to Blog settings > Publishing (also under Control Panel > Saving). The default endpoint is `/save`.
- Requires TiddlyWiki 5.3.0 or later.

### Upgrading from 2.x

1. Save a backup copy of your site.
2. Drag the new `collaborative-blog-plugin.json` onto your site and import it, then save and reload.
3. Open **Admin > Blog settings > Maintenance**. If you installed 2.x from the `.json` package, its tiddlers were added as ordinary tiddlers and will override the new version: choose **Remove leftover tiddlers**. If your theme setting uses an old short name, choose **Update theme setting**.
4. If you never customised the Home, All Posts or Categories pages, reset them in the same tab to get the new versions.
5. Replace `functions/save.js` in your repository with the one from the starter kit and add the new `rss.xml.js`, `sitemap.xml.js`, `robots.txt.js` and `_lib` folder. The settings (`GITHUB_TOKEN`, `GITHUB_REPO`, `SAVE_PASSWORD`, `FILE_PATH`) are unchanged.
6. In **Blog settings > Publishing**, set the endpoint to `/save` (or keep your full address) and choose **Test connection**.

The first save after upgrading works as before. Conflict protection starts from that save onwards.

## 2.2.0

Added a search panel, advanced search page and analytics settings (see the 3.0.0 notes: several of these did not work as released).

## 2.1.0

Added five themes, a CSS variable system and event, gallery, video and quote post types.

## 2.0.0

Replaced client-side password checking with saving through a Cloudflare Pages Function to GitHub.

## 1.0.0

Initial release.
