# Architecture

TiddlySite has three parts: a TiddlyWiki plugin that turns a wiki into a blog, a saver inside that plugin that publishes through Cloudflare, and Cloudflare Pages Functions that commit to GitHub and serve feeds.

## The plugin

`plugins/collaborative-blog/` is a standard TiddlyWiki plugin folder. The build packs it into the shadow tiddlers of `$:/plugins/collaborative-blog`, so every part can be overridden from inside a site and restored by deleting the override.

| Folder | Contents |
|---|---|
| `config/` | Default settings (`.multids`), core overrides (`$:/DefaultTiddlers`, story view, address bar) and the view template cascade filters |
| `globals.tid` | Global functions and procedures (`$:/tags/Global`) used by every template |
| `layout/` | Sidebar and admin panel (`$:/tags/PageTemplate`), the base stylesheet, the theme stylesheet and the admin visibility stylesheet |
| `templates/` | Body templates for posts, pages, category archives and the bare layout |
| `sections/` | Post sections (table of contents, quote, event, video, gallery, related posts, footer) |
| `post-types/` | Post type definitions that drive the admin panel's Create buttons |
| `edit/` | The Post details form added to the edit template |
| `pages/` | Home, All Posts, Categories and Search |
| `themes/` | Theme dictionaries |
| `settings/` | Blog settings tabs |
| `saver/` | The Cloudflare saver, password dialog, action widgets, settings and setup guide |
| `seo/` | The `cb-head-markup` filter and the TopHead tiddler that uses it |
| `content/` | The scroll-to-heading action widget used by the table of contents |

### Rendering

- **Layouts** are selected with TiddlyWiki's view template body cascade. Four filters (`$:/config/ViewTemplateBodyFilters/collaborative-blog-*`) pick the post, page, bare or category template, in that order, ahead of the core filters. A class filter (`$:/tags/ClassFilters/TiddlerTemplate`) adds `cb-frame` to tiddlers using these templates so the stylesheet can hide the core title, subtitle and tags.
- **Posts** are tiddlers tagged `Post` (not `Draft`, not system). The `cb.*` functions in `globals.tid` define the lists: `cb.posts`, `cb.posts.sorted` (by the `date` field, falling back to `created`; both `YYYYMMDD` and `YYYY-MM-DD` are accepted), `cb.categories` (tags of posts minus the reserved tags) and so on. Functions must have a dot in their name to be callable as filter operators.
- **Story view** is `zoomin`, so one tiddler is shown at a time like a normal website, and the address bar shows a permalink (`#Title`).
- **Templates** use `\whitespace trim` and `\parsermode inline`. Without inline mode, a top-level HTML element is wrapped in a paragraph unless a blank line follows its opening tag. With whitespace trim, a space that must be kept next to a widget is written as `&#32;`.

### Styles and themes

`stylesheets/base` is plain CSS that reads `--cb-*` custom properties. `stylesheets/theme` is wikitext (restricted with `\rules only`, so `--` is not turned into a dash) that writes the active theme dictionary into `:root`. Changing `$:/config/collaborative-blog/theme` therefore restyles the page immediately. `stylesheets/visibility` hides the edit toolbar unless `$:/temp/cb/admin` is `yes`. `$:/temp/` tiddlers are never saved.

### Head markup

`$:/tags/RawMarkup` tiddlers are copied into the saved file without being rendered, so they cannot contain widgets. The plugin uses `$:/tags/RawMarkupWikified/TopHead` instead: `seo/head.tid` renders `<$text text={{{ [cb-head-markup[]] }}}/>`, and the `cb-head-markup` filter operator (JavaScript) builds escaped `<meta>`, `<link>` and analytics tags from the settings.

## Publishing

```
tm-save-wiki
  -> TiddlyWiki saver handler (highest priority saver first)
  -> CloudflareSaver.save()                       saver/cloudflare-saver.js
       - returns false (falls back to other savers) when disabled, when the
         page is a local file and the endpoint is relative, or for autosave
         without a remembered password
       - asks for the password (saver/password-dialog.js)
       - writes a new revision id to $:/state/cloudflare-saver/revision and
         re-renders the file so the file contains its own revision
       - POST /save {content, password, editor, baseRevision, revision, force}
  -> functions/save.js
       - checks origin, size, JSON, password (constant time)
       - reads the latest commit for the file; if its
         "TiddlySite-Revision:" trailer differs from baseRevision, returns 409
       - PUTs the file through the GitHub contents API with the new
         revision in the commit message
  -> GitHub commit -> Cloudflare Pages deploys the new index.html
```

`$:/state/` tiddlers are saved in the file but do not mark the wiki as changed, which is why the revision lives there. If the save fails, the revision is rolled back. On a 409 the editor is asked whether to overwrite; an overwrite sends `force: true` and is marked `[overwrite]` in the commit message. Cancelling the dialog leaves the wiki unsaved without falling through to a download.

The password is kept only in `session.js` memory (if the editor ticks "remember"). The editor's name is kept in `localStorage` for convenience.

## Cloudflare functions

`site/functions/` is copied into the starter kit.

| File | Route | Notes |
|---|---|---|
| `save.js` | `/save` | `GET` health check (reports missing settings), `POST {action: "verify"}` checks the password and repository access, `POST` with content saves |
| `rss.xml.js` | `/rss.xml` | Latest 20 published posts |
| `sitemap.xml.js` | `/sitemap.xml` | The home page with the newest modification date |
| `robots.txt.js` | `/robots.txt` | Follows the robots setting and points to the sitemap |
| `_lib/` | none | Shared helpers: HTTP utilities, GitHub client, reading tiddlers from the saved file |

The feed functions read the deployed `index.html` through the `ASSETS` binding and parse the `tiddlywiki-tiddler-store` JSON blocks, so they always match the published site and need no extra commits.

## Build and tests

`scripts/build.mjs` runs TiddlyWiki on Node.js against `editions/starter` (which loads the plugin from `plugins/` via `TIDDLYWIKI_PLUGIN_PATH`) and renders the release files into `dist/`.

- `tests/functions/` (node:test) run the functions against an in-memory GitHub mock (`tests/fixtures/mock-github.js`).
- `tests/e2e/` (node:test with Playwright) open `dist/index.html`, either as a file or through a local server that runs the real `save.js` with the GitHub mock, and check pages, post types, search, themes, the mobile layout, the saved head markup, admin editing, publishing, conflicts and the offline fallback.
