# Contributing to TiddlySite

Thanks for helping. Bug reports, documentation fixes and pull requests are all welcome.

## Setting up

You need Node.js 20 or later and Git.

```bash
git clone https://github.com/BenSweaterVest/TiddlySite.git
```

```bash
cd TiddlySite && npm install && npx playwright install chromium
```

Useful commands:

| Command | What it does |
|---|---|
| `npm run build` | Builds everything into `dist/` |
| `npm run build:quick` | Same, without the starter zip |
| `npm run serve` | Local preview at http://localhost:8080. Saving (password `local`) writes `dist/index.html` |
| `npm run test:functions` | Tests for the Cloudflare functions |
| `npm run test:e2e` | Browser tests (run a build first) |
| `npm test` | All of the above in order |
| `npm run lint` | ESLint |

[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains how the pieces fit together.

## Making changes

1. Create a branch from `main`.
2. Make your change. Plugin tiddlers live in `plugins/collaborative-blog/tiddlers/`, grouped by purpose. Example content lives in `editions/starter/tiddlers/`.
3. Add or update tests. Anything a visitor or editor can see should have a browser test in `tests/e2e/`; changes to `site/functions/` need a test in `tests/functions/`.
4. Run `npm run lint` and `npm test`.
5. Update the documentation and add a line to the top section of `CHANGELOG.md`.
6. Open a pull request describing what changed and why, with screenshots for visual changes.

## Conventions

### Wikitext

- Start templates with `\whitespace trim` and `\parsermode inline`, and repeat both at the top of multi-line procedure bodies. Use `&#32;` for a space that must survive next to a widget.
- Prefer `\procedure` and `\function` to `\define`. Function names must contain a dot (for example `cb.posts`) to be callable as filter operators; an undefined dotted operator silently matches everything, so test any filter that feeds a delete action.
- Put shared helpers in `globals.tid`. Prefix everything with `cb-` / `cb.` and CSS classes with `cb-`.
- Keep CSS in `layout/styles.css` (plain CSS). Wikitext turns `--` into a dash, so never put CSS custom properties inside a wikitext tiddler unless it uses `\rules only` like the theme stylesheet.
- Use `$:/temp/` for per-visitor state (never saved) and `$:/config/collaborative-blog/` for settings.
- Escape user-entered text with `<$text>` and attribute values with filtered transclusion rather than inserting it as wikitext.

### JavaScript

- Plugin modules (`plugins/**/*.js`) are TiddlyWiki modules: the `/*\ ... \*/` header, an IIFE with `'use strict'`, `exports`. They run in current browsers, so ES2020 features are fine.
- Functions (`site/**/*.js`) are ES modules for the Cloudflare Workers runtime. Use only Web APIs (`fetch`, `Request`, `crypto.subtle`), no Node.js modules.
- Two-space indentation, single quotes, semicolons. `npm run lint` enforces the rest.

### Accessibility

- Keep colour contrast at WCAG AA (4.5:1 for text). Check new theme colours.
- Every interactive element must be reachable and usable by keyboard and have a text label.
- Images need alternative text; video posts support transcripts.

### Writing

Documentation is for non-technical editors as much as developers. Use plain words, short sentences, and say where to click.

## Releases

1. Update the version in `package.json` and `plugins/collaborative-blog/plugin.info` (they must match), and in `site/functions/save.js` (`VERSION`).
2. Move the changes into a new `## x.y.z` section of `CHANGELOG.md`.
3. Merge to `main`, then tag: `git tag vX.Y.Z && git push origin vX.Y.Z`.
4. The release workflow runs the tests, builds, and publishes the release with the changelog section as notes.

Versioning follows [semantic versioning](https://semver.org/): breaking changes to settings, tags or templates bump the major version.

## Reporting bugs

Open an issue with the TiddlyWiki version, browser, what you did, what you expected and what happened. For saving problems, include the message from **Blog settings > Publishing > Test connection** and any errors in the browser console. Never include passwords or tokens.

## Code of conduct

Be kind and constructive. Harassment or discrimination of any kind is not tolerated. Project maintainers may remove comments or contributions that break this.

## License

By contributing you agree that your contributions are licensed under the BSD 3-Clause License, as used by TiddlyWiki.
