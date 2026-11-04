# Customizing

Everything in the plugin is a tiddler, so you can change it from inside the site. Changes to plugin tiddlers create an override; delete the override to go back to the built-in version (the **Maintenance** tab in Blog settings does this for the built-in pages). Overrides do not receive improvements when you upgrade the plugin, so prefer the settings and extension points below where possible.

## Settings

Most options are in **Blog settings** (admin panel, or Control Panel > Blog). They are stored in these tiddlers:

| Tiddler | Default | Purpose |
|---|---|---|
| `$:/SiteTitle`, `$:/SiteSubtitle` | | Title and tagline |
| `$:/config/collaborative-blog/site-url` | empty | Public address, used for share links, canonical and preview tags |
| `$:/config/collaborative-blog/site-description` | tagline | Meta description |
| `$:/config/collaborative-blog/theme` | `$:/plugins/collaborative-blog/themes/historical` | Active theme |
| `$:/config/collaborative-blog/menu` (list field) | `Home About [[All Posts]] Categories Search Contact` | Sidebar menu |
| `$:/config/collaborative-blog/default-author` | empty | Author for new posts |
| `$:/config/collaborative-blog/home-post-count` | `10` | Posts on the home page |
| `$:/config/collaborative-blog/home-show-events` | `yes` | Upcoming events on the home page |
| `$:/config/collaborative-blog/date-format` | `DD MMM YYYY` | [Date format](https://tiddlywiki.com/#DateFormat) |
| `$:/config/collaborative-blog/words-per-minute` | `200` | Reading time |
| `$:/config/collaborative-blog/reserved-tags` | `Post Page Featured Favorite Draft Event Gallery Video Quote` | Tags never shown as categories |
| `$:/config/collaborative-blog/recently-updated-count`, `favorites-count` | `5` | Sidebar list lengths |
| `$:/config/collaborative-blog/og-image`, `twitter-handle`, `robots`, `rss-enabled` | | Sharing and search engines |
| `$:/config/collaborative-blog/analytics/*` | off | Analytics |
| `$:/config/cloudflare-saver/*` | | Publishing |

## Themes

A theme is a data tiddler (type `application/x-tiddler-dictionary`) tagged `$:/tags/cb/Theme`, with `caption` and `description` fields. Each line sets one CSS custom property, without the `--cb-` prefix:

```
bg-page: #f6f4ef
accent: #8b3a2b
font-body: Georgia, serif
```

To make your own theme, open one of the built-in themes (for example `$:/plugins/collaborative-blog/themes/historical`), clone it, give the clone a new title and caption, and change the values. It appears in **Blog settings > Theme**.

Keep text readable: aim for a contrast ratio of at least 4.5:1 between text and background colours (the built-in themes meet this). The variables are:

| Variables | Used for |
|---|---|
| `bg-page`, `bg-content`, `bg-highlight` | Page background, cards and posts, highlighted boxes |
| `bg-sidebar`, `text-on-sidebar`, `text-on-sidebar-muted`, `sidebar-hover`, `sidebar-accent`, `sidebar-border` | Sidebar |
| `text-primary`, `text-secondary`, `text-meta`, `heading`, `link` | Text |
| `accent`, `accent-hover`, `text-on-accent`, `secondary` | Buttons, highlights, featured posts |
| `border`, `focus`, `warning` | Lines, keyboard focus outline, warnings |
| `badge-event`, `badge-gallery`, `badge-video`, `badge-quote` | Post type badges (white text) |
| `font-body`, `font-heading`, `font-quote`, `font-size` | Typography |
| `radius-sm`, `radius-md`, `radius-lg`, `shadow-md`, `shadow-sidebar` | Corners and shadows |
| `sidebar-width`, `content-width` | Layout |

For changes beyond colours, add your own stylesheet: create a tiddler tagged `$:/tags/Stylesheet` with type `text/css`. It is applied after the plugin's styles. Plugin classes start with `cb-`.

## Post types

Post types are defined by tiddlers tagged `$:/tags/cb/PostType` with these fields:

| Field | Example | Meaning |
|---|---|---|
| `caption` | `Recipe` | Button label in the admin panel |
| `icon` | `🍲` | Shown on the button and badge |
| `type-tag` | `Recipe` | Tag added to new posts of this type |
| `description` | `A recipe with ingredients` | Tooltip |

Add the `type-tag` value to `$:/config/collaborative-blog/reserved-tags` so it is not treated as a category. The order of the buttons follows the `list` field of `$:/tags/cb/PostType`.

To give the new type its own layout, add a post section.

## Post sections

Posts are assembled from sections tagged `$:/tags/cb/PostSection`. Each section has:

- `cb-filter`: a filter applied to the post's title. The section is shown when it returns a result, for example `[tag[Recipe]]`.
- `cb-position`: `before` or `after` the post text.

The built-in sections are table of contents, quote, event, video and gallery (before) and related posts and the post footer (after). Their order follows the `list` field of `$:/tags/cb/PostSection`.

A section is rendered with `currentTiddler` set to the post, so you can use fields directly. For example, a recipe ingredients box:

```
title: $:/my-site/sections/ingredients
tags: $:/tags/cb/PostSection
cb-filter: [tag[Recipe]has[ingredients]]
cb-position: before

<div class="cb-notice">
<strong>Ingredients:</strong> <$text text={{!!ingredients}}/>
</div>
```

The global procedures in `$:/plugins/collaborative-blog/globals` are available in sections and pages, including `<<cb-post-card>>`, `<<cb-post-meta>>`, `<<cb-date>>`, `<<cb-category-links>>` and functions such as `[cb.posts.sorted[]]`, `[cb.categories[]]` and `[cb.upcoming.events[]]` (the latter needs a `cb-today` variable, for example `<$let cb-today=<<now YYYY0MM0DD>>>`).

## Pages and templates

- **Home**, **All Posts**, **Categories** and **Search** are shadow tiddlers provided by the plugin. Edit them to change their content. Home uses the field `cb-layout: bare`, which shows the text without a page title.
- Any tiddler tagged `Page` uses the page layout. Add `cb-hide-title: yes` to hide its title. Add `cb-exclude-from-search: yes` to leave it out of search results.
- A tiddler whose title is used as a category shows the list of posts in that category, below its own text if it has any. Create a tiddler called, say, `History` to add an introduction to the History category page.
- The layouts are chosen through TiddlyWiki's view template body cascade (`$:/config/ViewTemplateBodyFilters/collaborative-blog-*`). The templates are in `$:/plugins/collaborative-blog/templates/`.

## Menu, sidebar and admin panel

- The menu comes from the list field of `$:/config/collaborative-blog/menu` (editable in Blog settings > Menu).
- The sidebar is `$:/plugins/collaborative-blog/layout/sidebar` and the admin panel is `$:/plugins/collaborative-blog/layout/admin-panel`.
- Admin mode is the temporary tiddler `$:/temp/cb/admin`. It is never saved, so visitors never see the admin tools.

## Head markup and analytics

The `<head>` metadata (description, Open Graph, Twitter cards, RSS link and analytics) is generated by the `cb-head-markup` filter operator from the settings above, and inserted when the site is saved. **Blog settings > Sharing & SEO** shows a preview. To add something else to the head, create a tiddler tagged `$:/tags/RawMarkupWikified/TopHead` (it is wikified) or `$:/tags/RawMarkup` (inserted as is).
