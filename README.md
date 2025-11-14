# TiddlyWiki Collaborative Blog Plugin

A WordPress-style collaborative blog plugin for TiddlyWiki, designed to create a clean, professional website with a non-wiki feel. Perfect for historical societies, nonprofits, and small organizations.

## Features

- **Clean, blog-style interface** - Hides typical wiki elements (edit buttons, sidebar) for a professional look
- **Multiple authors** - Built-in support for author attribution on posts
- **Left sidebar navigation** - Fixed navigation menu with customizable links
- **Featured posts** - Highlight important content on the homepage
- **Categories/tags** - Organize content by topic
- **Post archive** - Automatic table of contents for all posts
- **Static pages** - Create About, Contact, and other non-blog pages
- **Responsive design** - Works on desktop and mobile devices
- **Discrete admin panel** - Hidden "Admin" link reveals editing controls
- **Historical society aesthetic** - Professional, trustworthy design with serif fonts

## Installation

You have three easy options to install this plugin:

### Method 1: Drag and Drop - Complete Package (Recommended for Testing)

**Install everything at once - plugin + example content:**

1. Open your TiddlyWiki file in your browser (e.g., `empty.html`)
2. Download **`collaborative-blog-plugin.json`** from this repository
3. Drag and drop the JSON file onto your TiddlyWiki page
4. Click the "Import" button to import all tiddlers (plugin + 4 example posts + example pages)
5. Click "Admin" in the sidebar, then "Save Changes"
6. Refresh the page to see your new blog with example content!

### Method 2: Drag and Drop - Plugin Only (Recommended for Production)

**Install just the plugin, start with a clean slate:**

1. Open your TiddlyWiki file in your browser (e.g., `empty.html`)
2. Download **`collaborative-blog-plugin.tid`** from this repository
3. Drag and drop the `.tid` file onto your TiddlyWiki page
4. Click the "Import" button
5. Save and refresh
6. Click "Admin" to start creating your own posts!

*Optional:* To add example content later, drag the individual `.tid` files from `plugins/collaborative-blog/tiddlers/` onto your wiki.

### Method 3: Use Node.js (Advanced)

If you're running TiddlyWiki on Node.js:

1. Copy the `plugins/collaborative-blog/` directory to your wiki's `plugins/` folder
2. Add the plugin to your `tiddlywiki.info` file:
   ```json
   {
     "plugins": [
       "collaborative-blog"
     ]
   }
   ```
3. Restart your TiddlyWiki server

## Usage

### Creating Blog Posts

1. Click the **Admin** link in the left sidebar
2. Click **New Post** in the admin panel
3. Add the following fields to your tiddler:
   - **Title**: Your post title
   - **Tags**: `Post` (required), plus any category tags (e.g., `News`, `Events`, `History`)
   - **Author**: Author name (e.g., `Sarah Johnson`)
   - **Date**: Date in YYYYMMDD format (e.g., `20251108`)
   - **Excerpt**: Brief summary (optional but recommended)
4. Write your content using TiddlyWiki markup
5. Save the tiddler

### Creating Featured Posts

To feature a post on the homepage:

1. Edit the post
2. Add `Featured` to the tags field (e.g., `Post Featured News`)
3. Save the tiddler

**Note**: Only the most recent featured post will display in the featured section.

### Creating Static Pages

1. Click **New Page** in the admin panel
2. Add the following fields:
   - **Title**: Page name (e.g., `About`, `Contact`)
   - **Tags**: `Page` (required)
3. Write your content
4. Save the tiddler
5. The page will automatically appear in the navigation (edit `navigation.tid` to customize menu links)

### Managing Draft Posts

To save a post as a draft (not visible on the site):

1. Create or edit a post
2. Add `Draft` to the tags field
3. Save the tiddler

### Customizing the Site

#### Change Site Title and Subtitle

Edit these tiddlers:
- `$:/SiteTitle` - Main site title
- `$:/SiteSubtitle` - Tagline/subtitle

#### Customize Navigation Menu

Edit `$:/plugins/collaborative-blog/Navigation` to change menu links.

#### Modify Color Scheme

Edit `$:/plugins/collaborative-blog/styles` to customize colors, fonts, and layout.

#### Change Homepage Layout

Edit the `Home` tiddler to modify which posts appear and how they're displayed.

## Content Organization

### Tags

The plugin uses tags to organize content:

- **Post** - Marks content as a blog post
- **Page** - Marks content as a static page
- **Featured** - Highlights post on homepage
- **Draft** - Hides content from public view
- **Category tags** (e.g., `News`, `Events`, `History`) - Organize posts by topic

### Custom Fields

Blog posts support these custom fields:

- **author** - Author name (displays in post metadata)
- **date** - Date in YYYYMMDD format (used for sorting and display)
- **excerpt** - Brief summary (shown on homepage and archive pages)

### Data Validation and Format Requirements

To ensure your blog functions correctly, follow these data format requirements:

#### Date Field Format

**Required format:** `YYYYMMDD` (8 digits, no separators)

- ✅ **Correct:** `20251108` (November 8, 2025)
- ❌ **Incorrect:** `2025-11-08`, `11/08/2025`, `2025/11/8`

**Why it matters:**
- The date field is used for chronological sorting
- Incorrect formats will cause posts to appear out of order or not display at all
- TiddlyWiki's date formatting converts YYYYMMDD to human-readable format (e.g., "08 Nov 2025")

#### Tags Field Requirements

**Required tags:**
- Posts MUST have the `Post` tag (case-sensitive)
- Pages MUST have the `Page` tag (case-sensitive)

**Optional tags:**
- `Featured` - Shows post in featured section on homepage
- `Draft` - Hides post from public view
- Category tags (e.g., `News`, `Events`, `History`) - Organize and filter posts

**Best practices:**
- Use consistent capitalization for category tags
- Avoid special characters in tag names
- Keep tag names concise and descriptive

#### Excerpt Field Format

**Recommended:** Plain text only (no TiddlyWiki markup)

- ✅ **Correct:** `"This post discusses the history of our organization."`
- ⚠️ **Avoid:** Complex wikitext formatting, links, or embedded widgets

**Why it matters:**
- Excerpts appear on the homepage in a simplified format
- Complex wikitext may not render correctly in excerpt context
- Keep excerpts brief (1-2 sentences, ~150-200 characters)

#### Author Field Format

**Format:** Plain text name

- ✅ **Correct:** `Sarah Johnson`, `Dr. Emily Chen`, `The Editorial Team`
- ✅ **Also okay:** Author with credentials or title

**Note:** The plugin does not currently support author profile linking, but author names display prominently on posts.

#### Common Validation Errors

| Issue | Cause | Solution |
|-------|-------|----------|
| Post doesn't appear on homepage | Missing `Post` tag or `date` field | Add both required fields |
| Post appears in wrong order | Invalid date format | Use YYYYMMDD format |
| Post shows as "Draft" | Has `Draft` tag | Remove `Draft` tag to publish |
| Categories not showing | Using system tags as categories | Use custom tags (not `Post`, `Page`, `Featured`, or `Draft`) |
| Excerpt not displaying | Excerpt field missing | Add excerpt field (or it will show full text) |

## File Structure

```
plugins/collaborative-blog/
├── plugin.info                    # Plugin metadata
└── tiddlers/
    ├── styles.tid                 # Main stylesheet
    ├── navigation.tid             # Left sidebar navigation
    ├── admin-panel.tid            # Admin interface
    ├── homepage.tid               # Homepage template
    ├── viewtemplate-post.tid      # Blog post layout
    ├── viewtemplate-page.tid      # Static page layout
    ├── all-posts.tid              # Post archive page
    ├── categories.tid             # Category browser
    ├── about.tid                  # Example About page
    ├── contact.tid                # Example Contact page
    ├── post1.tid                  # Example blog post (featured)
    ├── post2.tid                  # Example blog post
    ├── post3.tid                  # Example blog post
    ├── post4.tid                  # Example blog post
    ├── site-title.tid             # Site title configuration
    ├── site-subtitle.tid          # Site subtitle configuration
    └── default-tiddlers.tid       # Default page on load
```

## Tips and Best Practices

1. **Use excerpts** - Always add an excerpt field to posts for better homepage display
2. **Consistent dates** - Use YYYYMMDD format for dates (e.g., `20251108`)
3. **Tag consistently** - Establish category tags early and use them consistently
4. **One featured post** - Only feature one post at a time for best visual impact
5. **Save regularly** - Click the Save button in the admin panel frequently
6. **Backup your wiki** - Regularly download a copy of your HTML file

## Customization Ideas

- Add a search box to the sidebar
- Create author profile pages
- Add social media links
- Implement a newsletter signup form
- Add image galleries for posts
- Create custom post templates for different content types

## Troubleshooting

**Posts not showing on homepage:**
- Check that the post has the `Post` tag
- Verify the post doesn't have the `Draft` tag
- Ensure the post has a `date` field in YYYYMMDD format

**Navigation links not working:**
- Make sure target pages exist with exact title matches
- Check capitalization (TiddlyWiki is case-sensitive)

**Styles not applying:**
- Clear your browser cache
- Check that `styles.tid` has the `$:/tags/Stylesheet` tag

**Admin panel not appearing:**
- Click the Admin link in the sidebar
- Check that JavaScript is enabled in your browser

## Support

For questions, issues, or suggestions:
- GitHub Issues: https://github.com/BenSweaterVest/TiddlySite/issues
- TiddlyWiki Community: https://talk.tiddlywiki.org/

## License

This plugin is released under the same license as TiddlyWiki (BSD 3-Clause).

## Credits

Built with [TiddlyWiki](https://tiddlywiki.com/) by Jeremy Ruston and the TiddlyWiki community.

---

**Version**: 1.0.0
**Author**: BenSweaterVest
**Last Updated**: November 2025
