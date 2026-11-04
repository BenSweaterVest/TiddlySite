# TiddlySite

A blog-style website for small organizations, built on [TiddlyWiki](https://tiddlywiki.com). The whole site is one HTML file that editors update in the browser. Saving commits the file to GitHub, and Cloudflare Pages republishes it, usually within a minute. There is no database or server to maintain, and the free tiers of GitHub and Cloudflare are enough.

It suits historical societies, community groups, clubs and nonprofits that want a simple site several volunteers can keep up to date.

## Features

**For visitors**
- Clean blog layout with a sidebar menu, a home page with a featured post, upcoming events and latest posts
- Archive by year, category pages and a search page with filters (type, category, author)
- Special layouts for events (with automatic upcoming/past status and RSVP links), image galleries, YouTube and Vimeo videos (privacy-enhanced embeds) and quotations
- Reading time, optional table of contents, related posts and newer/older links on every post
- Five themes that meet WCAG AA contrast, a responsive layout with a mobile menu, keyboard focus styles and a skip link
- RSS feed, sitemap, robots.txt and social media preview tags

**For editors**
- An **Admin** switch in the sidebar shows the editing tools; visitors never see them
- One-click buttons to create a post, event, gallery, video, quote or page
- A **Post details** form for author, date, excerpt, featured/favorite/draft and the fields each post type needs
- **Save changes** publishes. The password is typed into a masked dialog and is never stored in the site
- If two people edit at the same time, the second save is stopped with a warning instead of silently overwriting the first
- Blog settings for the title, menu, theme, publishing, sharing and analytics (Plausible, Simple Analytics, Google Analytics or a custom script)

## Getting started

| I want to... | Do this |
|---|---|
| See what it looks like | Download `index.html` from the [latest release](https://github.com/BenSweaterVest/TiddlySite/releases) and open it in a browser |
| Set up a new website | Download `tiddlysite-starter.zip` from the latest release and follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Add the blog to an existing TiddlyWiki | Drag `collaborative-blog-plugin.json` onto your wiki, import, save and reload |

## Documentation

- [Deployment](docs/DEPLOYMENT.md): GitHub and Cloudflare Pages setup, settings, security, troubleshooting
- [Editing guide](docs/EDITING.md): for the people writing posts (no technical knowledge needed)
- [Customizing](docs/CUSTOMIZING.md): themes, menu, post types, templates and styles
- [Architecture](docs/ARCHITECTURE.md): how the plugin, saver and functions fit together
- [Changelog](CHANGELOG.md) and [upgrading from version 2](CHANGELOG.md#upgrading-from-2x)

## Things to know

- **Everything in the site file is public**, including posts tagged `Draft`. Drafts are hidden from the menus and search, but anyone who downloads the file can read them. Keep private material elsewhere.
- **Search engines see one page.** Posts are addressed with `#` links (for example `/#My%20Post`), which work for visitors, feed readers and sharing but are not indexed as separate pages.
- **The file grows with your content.** Link to images hosted elsewhere, or keep imported images small, so the site stays quick to load.

## Development

Requires Node.js 20 or later.

```bash
npm install
```

```bash
npm run build        # builds dist/ (plugin files, starter site, starter zip)
```

```bash
npm run serve        # local preview at http://localhost:8080; saving writes dist/index.html (password: local)
```

```bash
npm test             # function tests, build, then browser tests
```

```bash
npm run lint
```

Browser tests use Playwright's Chromium (`npx playwright install chromium`). Set `CHROMIUM_PATH` to use a different Chromium binary.

The repository layout:

```
plugins/collaborative-blog/   the TiddlyWiki plugin (tiddlers grouped by purpose)
editions/starter/             example content and settings for the starter site
site/                         Cloudflare Pages functions and headers for the starter kit
scripts/                      build and local preview scripts
tests/                        function tests (node:test) and browser tests (Playwright)
docs/                         documentation
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions.

## License

BSD 3-Clause, the same license as TiddlyWiki. Built with [TiddlyWiki](https://tiddlywiki.com/) by Jeremy Ruston and the TiddlyWiki community.
