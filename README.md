# TiddlyWiki Collaborative Blog Plugin

A complete blogging solution for TiddlyWiki with WordPress-style UI and automatic GitHub saving via Cloudflare Functions. Designed to create a clean, professional website with a non-wiki feel. Perfect for historical societies, nonprofits, and small organizations.

**All-in-one package:** Beautiful blog theme + automatic save/deploy mechanism integrated into a single plugin.

## Features

### Content Management
- **Clean, blog-style interface** - Hides typical wiki elements for a professional look
- **Multiple authors** - Built-in support for author attribution on posts
- **Featured posts** - Highlight important content on the homepage
- **Favorite articles** - Curate a list of your best or most important posts
- **Recently updated** - Automatic sidebar showing the 5 most recently modified posts
- **Categories/tags** - Organize content by topic
- **Post archive** - Automatic table of contents for all posts
- **Static pages** - Create About, Contact, and other non-blog pages
- **Draft management** - Save posts as drafts before publishing

### User Interface
- **Fixed left sidebar navigation** - Always-visible menu with customizable links
- **Responsive design** - Works on desktop and mobile devices
- **Historical society aesthetic** - Professional, trustworthy design with serif fonts
- **System tiddler hiding** - Control panel and other system tiddlers hidden from story view

### Automatic Saving & Deployment
- **Cloudflare Functions integration** - Automatic GitHub saves built-in
- **Password-protected saves** - Server-side authentication via environment variables
- **Real-time deployment** - Cloudflare Pages auto-deploys on every save
- **Save notifications** - Visual feedback for save status (saving, success, failure)
- **Save statistics** - Track successful and failed saves
- **Session password memory** - Optional password caching during session
- **Admin panel** - Quick access to editing features

### Accessibility
- **ARIA labels** - Screen reader support for all interactive elements
- **Semantic HTML** - Proper heading hierarchy and document structure
- **Keyboard navigation** - All features accessible via keyboard

## Installation

### Quick Start (Testing Locally)

1. Download **`collaborative-blog-plugin.json`** from the [latest release](https://github.com/BenSweaterVest/TiddlySite/releases)
2. Open an empty TiddlyWiki in your browser
3. Drag and drop the JSON file onto the page
4. Click "Import" to install the plugin and example content
5. Save and refresh to see your blog!

**Note:** For local testing, you can edit and use the browser download to save. For production deployment with automatic GitHub saves, follow the Cloudflare Setup below.

### Production Deployment (Recommended)

For a complete blogging solution with automatic GitHub saves and deployment:

**Method 1: Drag and Drop Plugin (Simplest)**

1. Download **`collaborative-blog-plugin.tid`** from the [latest release](https://github.com/BenSweaterVest/TiddlySite/releases)
2. Open an empty TiddlyWiki in your browser
3. Drag and drop the `.tid` file onto the page
4. Click "Import" and save
5. Continue to **Cloudflare Setup** below to enable automatic saves

**Method 2: Node.js (Advanced)**

1. Copy `plugins/collaborative-blog/` to your wiki's `plugins/` folder
2. Add to your `tiddlywiki.info`:
   ```json
   {
     "plugins": [
       "collaborative-blog"
     ]
   }
   ```
3. Restart your TiddlyWiki server
4. Continue to **Cloudflare Setup** below to enable automatic saves

## Cloudflare Setup

This plugin includes built-in automatic GitHub saving via Cloudflare Functions. Follow these steps to enable automatic saves and deployment:

### Prerequisites

- GitHub account
- Cloudflare account (free tier works fine)
- GitHub Personal Access Token with `repo` scope

### Step 1: Create GitHub Repository

1. Create a new GitHub repository (public or private)
2. Initialize with a README or push an initial commit
3. Note your repository name: `username/repository-name`

### Step 2: Create Cloudflare Function

In your repository, create a file at `functions/save.js`:

```javascript
export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { content, password } = await request.json();

    // Verify password
    if (password !== env.SAVE_PASSWORD) {
      return new Response('Unauthorized', { status: 401 });
    }

    // GitHub API configuration
    const githubToken = env.GITHUB_TOKEN;
    const repo = env.GITHUB_REPO; // format: "username/repo-name"
    const filePath = env.FILE_PATH || 'index.html';

    // Get current file SHA (required for updates)
    const getResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'User-Agent': 'TiddlyWiki-Saver'
        }
      }
    );

    let sha = null;
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }

    // Update file on GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'TiddlyWiki-Saver'
        },
        body: JSON.stringify({
          message: 'Update TiddlyWiki',
          content: btoa(unescape(encodeURIComponent(content))),
          sha: sha
        })
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      throw new Error(`GitHub API error: ${error}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

Commit and push this file to your repository.

### Step 3: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Click "Create application" → "Pages" → "Connect to Git"
3. Select your GitHub repository
4. Configure build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/`
5. Click "Save and Deploy"

### Step 4: Set Environment Variables

In your Cloudflare Pages project settings:

1. Go to "Settings" → "Environment variables"
2. Add these variables (for **Production** and **Preview**):
   - `SAVE_PASSWORD`: Your chosen save password (keep this secret!)
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token
   - `GITHUB_REPO`: Your repository in format `username/repo-name`
   - `FILE_PATH`: `index.html` (or your wiki filename)

### Step 5: Upload Your TiddlyWiki

1. Add your TiddlyWiki HTML file to the repository as `index.html`
2. Commit and push:
   ```bash
   git add index.html
   git commit -m "Add TiddlyWiki"
   git push
   ```
3. Cloudflare will automatically deploy your site

### Step 6: Configure the Plugin

1. Open your deployed TiddlyWiki at `https://your-site.pages.dev`
2. Click **Admin** in the sidebar
3. Click **Control Panel** → **Saving** tab → **CloudFlare Saver** section
4. Configure:
   - ☑ **Enable saving to Cloudflare Functions**
   - **Endpoint URL:** `https://your-site.pages.dev/save`
   - Optionally enable **Remember password for session**
5. Click the save button in the admin panel
6. Enter your `SAVE_PASSWORD` when prompted
7. Your wiki will save to GitHub and auto-deploy!

### Security Best Practices

- ✅ **DO:** Use a strong, unique `SAVE_PASSWORD`
- ✅ **DO:** Keep environment variables secret
- ✅ **DO:** Use GitHub token with minimal required scope (`repo` only)
- ✅ **DO:** Regularly rotate your GitHub token and save password
- ❌ **DON'T:** Commit environment variables to your repository
- ❌ **DON'T:** Share your Cloudflare dashboard access
- ❌ **DON'T:** Use the same password for multiple services

### How It Works

1. **Edit** - Make changes to your blog (posts, pages, settings)
2. **Save** - Click "Save Changes" in the admin panel
3. **Authenticate** - Enter your save password (stored in Cloudflare environment variable)
4. **Commit** - Cloudflare Function commits changes to GitHub
5. **Deploy** - Cloudflare Pages automatically deploys the updated site

**Benefits:**
- Server-side password authentication (more secure than client-side)
- Automatic deployment on every save
- Version control via Git
- No manual file uploads needed
- Works from any browser

## Usage

### Admin Panel

Click the **Admin** link in the left sidebar to toggle the admin panel. The panel provides quick access to:

- **New Post** - Create a new blog post
- **New Page** - Create a new static page
- **Control Panel** - Access TiddlyWiki settings (including Cloudflare saver configuration)
- **Save Changes** - Save to GitHub via Cloudflare (prompts for password)
- **Advanced Search** - Search all tiddlers

**Note:** The admin panel is always accessible - password authentication happens when you save, not when you access the panel.

### Creating Blog Posts

1. Click **Admin** in the sidebar
2. Click **New Post** in the admin panel
3. Add the following fields to your tiddler:
   - **Title**: Your post title
   - **Tags**: `Post` (required), plus any category tags (e.g., `News`, `Events`, `History`)
   - **Author**: Author name (e.g., `Sarah Johnson`)
   - **Date**: Date in YYYYMMDD format (e.g., `20251118`)
   - **Excerpt**: Brief summary (optional but recommended)
4. Write your content using TiddlyWiki markup
5. Save the tiddler (checkmark button)
6. Click **Save Changes** in the admin panel
7. Enter your Cloudflare save password when prompted
8. Your changes are committed to GitHub and auto-deployed!

### Creating Featured Posts

To feature a post on the homepage:

1. Edit the post
2. Add `Featured` to the tags field (e.g., `Post Featured News`)
3. Save the tiddler

**Note**: Only the most recent featured post will display in the featured section on the homepage.

### Creating Favorite Articles

To add a post to the "Favorite Articles" sidebar:

1. Edit the post
2. Add `Favorite` to the tags field (e.g., `Post Favorite History`)
3. Save the tiddler

**Note**: All posts tagged `Favorite` will appear in the sidebar, sorted by most recent first (limited to 10).

### Creating Static Pages

1. Click **Admin** in the sidebar, then click **New Page** in the admin panel
2. Add the following fields:
   - **Title**: Page name (e.g., `About`, `Contact`)
   - **Tags**: `Page` (required)
3. Write your content
4. Save the tiddler
5. To add the page to navigation, edit `$:/plugins/collaborative-blog/Navigation`

### Managing Draft Posts

To save a post as a draft (not visible on the site):

1. Create or edit a post
2. Add `Draft` to the tags field
3. Save the tiddler
4. The post will not appear on the homepage or in post lists

**To publish a draft:**
1. Edit the post
2. Remove `Draft` from the tags
3. Save the tiddler

## Customization

### Change Site Title and Subtitle

Edit these tiddlers:
- `$:/SiteTitle` - Main site title (appears in browser tab and header)
- `$:/SiteSubtitle` - Tagline/subtitle (appears below site title)

### Customize Navigation Menu

Edit `$:/plugins/collaborative-blog/Navigation` to change menu links. The navigation shows:
- Custom menu links
- Recently Updated section (5 most recent posts)
- Favorite Articles section (posts tagged "Favorite")
- Admin panel toggle link

### Modify Color Scheme

Edit `$:/plugins/collaborative-blog/styles` to customize:
- Colors (backgrounds, text, links, accents)
- Fonts (typefaces, sizes, weights)
- Layout (spacing, widths, breakpoints)
- Admin panel appearance
- Notification styling

**Key CSS variables to modify:**
- `.cb-sidebar` - Sidebar background and width
- `.cb-post` - Post card styling
- `.cb-admin-panel` - Admin panel appearance
- `.tc-notification-banner` - Save notification styling

### Change Homepage Layout

Edit the `Home` tiddler to modify:
- Which posts appear (change filters)
- Number of posts shown (change `limit[]` values)
- Featured post section
- Recent posts section

### Customize Admin Panel

Edit `$:/plugins/collaborative-blog/AdminPanel` to:
- Add custom buttons
- Rearrange existing buttons
- Change button labels or icons
- Add custom admin tools

### Add Custom Page Templates

Create new view templates by:
1. Creating a new tiddler
2. Adding tag: `$:/tags/ViewTemplate`
3. Using filters to control when it appears
4. Designing custom layout for specific content types

## Content Organization

### Tags

The plugin uses tags to organize content:

- **Post** - Marks content as a blog post (required for posts)
- **Page** - Marks content as a static page (required for pages)
- **Featured** - Highlights post on homepage in featured section
- **Favorite** - Adds post to "Favorite Articles" sidebar
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

- ✅ **Correct:** `20251115` (November 15, 2025)
- ❌ **Incorrect:** `2025-11-15`, `11/15/2025`, `2025/11/15`

**Why it matters:**
- The date field is used for chronological sorting
- Incorrect formats will cause posts to appear out of order or not display at all
- TiddlyWiki's date formatting converts YYYYMMDD to human-readable format (e.g., "15 Nov 2025")

**How it's used:**
- Homepage: Shows posts in reverse chronological order (newest first)
- Recently Updated: Tracks modification dates to show recent changes
- Post metadata: Displays formatted date on individual posts

#### Tags Field Requirements

**Required tags:**
- Posts MUST have the `Post` tag (case-sensitive)
- Pages MUST have the `Page` tag (case-sensitive)

**Optional tags:**
- `Featured` - Shows post in featured section on homepage
- `Favorite` - Adds post to "Favorite Articles" sidebar
- `Draft` - Hides post from public view
- Category tags (e.g., `News`, `Events`, `History`) - Organize and filter posts

**Best practices:**
- Use consistent capitalization for category tags
- Avoid special characters in tag names
- Keep tag names concise and descriptive
- Don't use system tags (starting with `$:/`) as categories

#### Excerpt Field Format

**Recommended:** Plain text only (no TiddlyWiki markup)

- ✅ **Correct:** `This post discusses the history of our organization.`
- ⚠️ **Avoid:** Complex wikitext formatting, links, or embedded widgets

**Why it matters:**
- Excerpts appear on the homepage in a simplified format
- Complex wikitext may not render correctly in excerpt context
- Keep excerpts brief (1-2 sentences, ~150-200 characters)

**If no excerpt is provided:**
- The full post text will be displayed on homepage
- Consider adding excerpts for better homepage layout control

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
| Categories not showing | Using system tags as categories | Use custom tags (not reserved tags) |
| Excerpt not displaying | Excerpt field missing | Add excerpt field for better control |
| Post not in "Recently Updated" | Modified date not recent | Edit and save to update modified date |
| Post not in "Favorite Articles" | Missing `Favorite` tag | Add `Favorite` tag to post |

## File Structure

```
plugins/collaborative-blog/
├── plugin.info                          # Plugin metadata
└── tiddlers/
    ├── styles.tid                       # Main stylesheet
    ├── navigation.tid                   # Left sidebar with recently updated/favorites
    ├── admin-panel.tid                  # Admin interface
    ├── viewtemplate-systemtiddler.tid   # Hides system tiddlers from story view
    ├── viewtemplate-post.tid            # Blog post layout
    ├── viewtemplate-page.tid            # Static page layout
    ├── readme.tid                       # Plugin documentation
    ├── cloudflare-saver.js              # Main save mechanism (module-type: saver)
    ├── cloudflare-startup.js            # Startup initialization
    ├── cloudflare-test-action.js        # Connection test widget
    ├── cloudflare-clear-password-action.js  # Password clearing widget
    ├── cloudflare-settings.tid          # Control Panel configuration UI
    ├── cloudflare-wizard.tid            # Setup wizard
    ├── notification-saving.tid          # "Saving..." notification
    ├── notification-success.tid         # "Success!" notification
    ├── notification-failure.tid         # "Failed" notification
    ├── homepage.tid                     # Example homepage (not in core plugin)
    ├── all-posts.tid                    # Example post archive (not in core plugin)
    ├── categories.tid                   # Example category browser (not in core plugin)
    ├── about.tid                        # Example About page (not in core plugin)
    ├── contact.tid                      # Example Contact page (not in core plugin)
    ├── post1.tid                        # Example blog post (not in core plugin)
    ├── post2.tid                        # Example blog post (not in core plugin)
    ├── post3.tid                        # Example blog post (not in core plugin)
    ├── post4.tid                        # Example blog post (not in core plugin)
    ├── site-title.tid                   # Example site title (not in core plugin)
    ├── site-subtitle.tid                # Example site subtitle (not in core plugin)
    └── default-tiddlers.tid             # Example default page config (not in core plugin)

Distribution Files:
├── collaborative-blog-plugin.tid        # Single-file plugin (16 core tiddlers, no examples)
└── collaborative-blog-plugin.json       # Complete package (24 tiddlers with examples)
```

## Troubleshooting

### Save and Deployment Issues

**Save fails with "Unauthorized" error:**
- Check that your password matches the `SAVE_PASSWORD` environment variable in Cloudflare
- Verify the environment variable is properly set in your Cloudflare Pages settings
- Password is case-sensitive
- Try clearing the session password: Control Panel → Saving → "Clear Session Password"

**Save fails with "GitHub API error":**
- Verify your `GITHUB_TOKEN` has the correct permissions (repo access)
- Check that `GITHUB_REPO` is in the format `username/repo-name`
- Ensure `FILE_PATH` points to the correct file (default: `index.html`)
- Check GitHub API rate limits: https://api.github.com/rate_limit

**Save fails silently or times out:**
- Check browser console for detailed error messages
- Verify your Cloudflare Function is deployed correctly
- Test the connection using Control Panel → Saving → "Test Connection"
- Ensure your `functions/save.js` file is in the repository root

**Admin panel not appearing:**
- Click the "Admin" link in the sidebar to toggle panel visibility
- Check that `$:/state/admin-panel-visible` is set to "yes"
- Clear browser cache and try again

**Changes not appearing after save:**
- Cloudflare Pages may take 30-60 seconds to rebuild and deploy
- Check the Cloudflare Pages dashboard for deployment status
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Verify the commit was made to GitHub

### Content Display Issues

**Posts not showing on homepage:**
- Check that the post has the `Post` tag (case-sensitive)
- Verify the post doesn't have the `Draft` tag
- Ensure the post has a `date` field in YYYYMMDD format
- Verify the date is not in the future

**Post not in "Recently Updated" sidebar:**
- The list shows only the 5 most recently modified posts
- Edit and save the post to update its modified timestamp
- Only posts tagged `Post` (without `Draft`) appear in this list

**Post not in "Favorite Articles" sidebar:**
- Add the `Favorite` tag to the post
- Save the post
- The list shows up to 10 favorites, newest first

**Featured post not showing:**
- Only the most recent post with both `Post` and `Featured` tags appears
- Remove `Featured` tag from old posts if you want a new post featured
- Ensure the featured post has a valid `date` field

### Navigation and Interface Issues

**Navigation links not working:**
- Make sure target pages exist with exact title matches
- Check capitalization (TiddlyWiki is case-sensitive)
- Verify the page has the `Page` tag

**Styles not applying:**
- Clear your browser cache
- Check that `$:/plugins/collaborative-blog/styles` has the `$:/tags/Stylesheet` tag
- Save the wiki and refresh

**Control Panel appearing on page load:**
- This should be automatically hidden by `viewtemplate-systemtiddler.tid`
- Verify the tiddler exists and has tag `$:/tags/ViewTemplate`
- System tiddlers (starting with `$:/`) are hidden from story view but accessible via modals

**Admin panel always visible / won't hide:**
- Click the "Admin" link to toggle visibility
- Check `$:/state/admin-panel-visible` tiddler value (should be "yes" when visible, "no" when hidden)
- Try setting the state tiddler to "no" manually to reset

### Performance Issues

**Wiki feels slow:**
- Large wikis (100+ posts) may benefit from Node.js hosting
- Consider archiving old posts by removing the `Post` tag
- Optimize images before embedding
- Remove unused tiddlers

**Long load times:**
- Check for very large embedded images
- Consider linking to external images instead of embedding
- Archive old content to a separate wiki file

### Data Validation Errors

**Posts appearing out of order:**
- Verify all posts use YYYYMMDD date format
- Check for typos in date fields (e.g., `20251315` - invalid month)
- Ensure dates don't have separators or spaces

**Categories not working:**
- Don't use reserved tags (`Post`, `Page`, `Featured`, `Favorite`, `Draft`) as category names
- Use consistent capitalization for category tags
- Create a Categories page to list all available categories

**Excerpt showing full text:**
- Add an `excerpt` field to control what shows on homepage
- Keep excerpts under 200 characters for best display
- Use plain text in excerpts (avoid wikitext markup)

## Common Workflows

### Workflow 1: Publishing Your First Post

1. **Set up Cloudflare deployment** - Follow the Cloudflare Setup section to configure saving
2. **Open admin panel** - Click Admin link in sidebar
3. **Create post** - Click New Post in admin panel
4. **Add metadata:**
   - Title: "Welcome to Our Blog"
   - Tags: `Post News`
   - Author: Your name
   - Date: `20251118` (today's date in YYYYMMDD format)
   - Excerpt: "Welcome to our new blog! We're excited to share our stories."
5. **Write content** - Use TiddlyWiki markup or plain text
6. **Save tiddler** - Click the checkmark button
7. **Save to GitHub** - Click Save Changes in admin panel, enter your password when prompted
8. **Wait for deployment** - Cloudflare Pages will auto-deploy (30-60 seconds)
9. **View result** - Navigate to your Cloudflare Pages URL to see your post live

### Workflow 2: Featuring a Post

1. Navigate to the post you want to feature
2. Click the edit button (pencil icon at top of post)
3. Add `Featured` to the tags field (e.g., change `Post News` to `Post News Featured`)
4. Save the tiddler
5. Click Save Changes in admin panel and enter password
6. Navigate to homepage to see post in featured section
7. Remember: Only one post should be featured at a time for best visual impact

### Workflow 3: Adding a Static Page to Navigation

1. Click Admin in sidebar
2. Create new page via New Page button
3. Add title (e.g., "Projects") and tag `Page`
4. Write page content and save tiddler
5. Edit `$:/plugins/collaborative-blog/Navigation`
6. Find the navigation links section
7. Add a new link: `<$link to="Projects">Projects</$link>`
8. Save the navigation tiddler
9. Click Save Changes and enter password
10. The new link will appear in the left sidebar after deployment

### Workflow 4: Curating Favorite Articles

1. Review your existing posts
2. For each post you want to highlight:
   - Edit the post
   - Add `Favorite` tag (e.g., `Post History Favorite`)
   - Save
3. Favorite articles automatically appear in the sidebar
4. The list shows up to 10 favorites, sorted by most recent first
5. Use favorites to highlight your best content, evergreen posts, or most important articles

## Tips and Best Practices

### Content Creation

1. **Use excerpts** - Always add an excerpt field to posts for better homepage display and SEO
2. **Consistent dates** - Use YYYYMMDD format for dates (e.g., `20251115`) without exception
3. **Tag consistently** - Establish category tags early and use them consistently across posts
4. **One featured post** - Only feature one post at a time for best visual impact
5. **Curate favorites** - Keep 5-10 favorites for best sidebar readability
6. **Meaningful titles** - Use descriptive, SEO-friendly titles
7. **Author attribution** - Always add author field for multi-author blogs

### Site Management

8. **Save regularly** - Click the Save Changes button in admin panel frequently
9. **Backup your wiki** - Regularly download a copy of your HTML file to a secure location
10. **Test before publishing** - Preview posts as drafts before removing `Draft` tag
11. **Update favorites** - Periodically review and update your favorite articles list
12. **Monitor recently updated** - Use the "Recently Updated" sidebar to track your editing activity

### Security

13. **Use strong passwords** - Set a strong `SAVE_PASSWORD` in Cloudflare environment variables
14. **Protect your tokens** - Keep your `GITHUB_TOKEN` secure and never commit it to the repository
15. **Use unique passwords** - Don't reuse passwords from other accounts
16. **Regular password rotation** - Update your Cloudflare `SAVE_PASSWORD` periodically
17. **Monitor access** - Check Cloudflare and GitHub logs for unauthorized access attempts
18. **Environment variables only** - Never hardcode passwords in your `functions/save.js` file

### Performance

19. **Optimize images** - Compress images before embedding to keep file size manageable
20. **Archive old content** - For large blogs (100+ posts), consider archiving old content to separate wiki files
21. **Use excerpts** - Prevents homepage from loading full post content

### Customization

22. **Customize incrementally** - Make small changes and test frequently
23. **Keep backups before major changes** - Save a copy before modifying core plugin tiddlers
24. **Document customizations** - Add comments to your custom CSS and templates
25. **Test on mobile** - Check responsive design on different screen sizes

## Advanced Features

### Custom Post Templates

Create templates for different post types (e.g., photo essays, tutorials, announcements):

1. Create a new tiddler with your template content
2. Tag it with a custom tag (e.g., `PostTemplate`)
3. Reference it when creating new posts
4. Use TiddlyWiki's transclude features to apply templates

### Author Profiles

Create author profile pages:

1. Create a new tiddler for each author (e.g., "Author: Sarah Johnson")
2. Add author bio, photo, and links
3. Link author names in posts to their profile pages
4. Consider creating an "Authors" page listing all contributors

### Newsletter Integration

Add newsletter signup:

1. Edit `$:/plugins/collaborative-blog/Navigation`
2. Add a newsletter signup form (HTML or TiddlyWiki form)
3. Integrate with email service provider (Mailchimp, ConvertKit, etc.)
4. Style the form in `styles.tid`

### Social Media Integration

Add social sharing:

1. Edit `viewtemplate-post.tid`
2. Add social sharing buttons at end of posts
3. Use services like AddThis or ShareThis
4. Or create custom share links (Twitter, Facebook, LinkedIn)

### Search Functionality

Add search to sidebar:

1. Edit `$:/plugins/collaborative-blog/Navigation`
2. Add TiddlyWiki's search widget: `<$search />`
3. Customize search appearance in `styles.tid`
4. Consider adding advanced search link

### Custom Categories Page

Create dynamic category browser:

1. Use the included `categories.tid` as starting point
2. Customize to show post counts per category
3. Add category descriptions
4. Style category cards in `styles.tid`

## Customization Ideas

- Add a search box to the sidebar for easy content discovery
- Create author profile pages with bios and photos
- Add social media links to sidebar or footer
- Implement a newsletter signup form
- Add image galleries for photo-heavy posts
- Create custom post templates for different content types (tutorials, announcements, photo essays)
- Add comment functionality using third-party services (Disqus, Commento)
- Integrate analytics (Google Analytics, Plausible)
- Add RSS feed for blog syndication
- Create landing pages for different audiences
- Implement related posts suggestions
- Add breadcrumb navigation
- Create author archives (all posts by specific author)
- Add estimated reading time to posts
- Implement table of contents for long posts

## Accessibility Features

This plugin includes several accessibility enhancements:

- **ARIA labels** on all interactive elements (buttons, links, modals)
- **Semantic HTML** structure with proper heading hierarchy
- **Keyboard navigation** support for all features
- **Focus indicators** for interactive elements
- **High contrast** design for better readability
- **Responsive text sizing** that respects user preferences

To further improve accessibility:
- Add alt text to all images in your posts
- Use descriptive link text (avoid "click here")
- Maintain proper heading order (h1 → h2 → h3)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Ensure sufficient color contrast (use WebAIM contrast checker)

## Version History

### v2.0.0 (November 2025)

**BREAKING CHANGES:**
- Complete Cloudflare deployment integration - requires Cloudflare Pages setup
- Removed client-side password authentication in favor of server-side auth
- Removed login/logout UI - admin panel now always accessible
- Password required only when saving changes (via Cloudflare Function)

**New Features:**
- **Integrated Cloudflare Saver** - Automatic GitHub saves built into plugin
- **Server-side authentication** - Password validation via Cloudflare environment variables
- **Auto-deployment** - Cloudflare Pages deploys on every save
- **Save notifications** - Visual feedback for save status (saving, success, failure)
- **Save statistics** - Track successful and failed saves
- **Connection testing** - Test Cloudflare endpoint from Control Panel
- **Session password memory** - Optional password caching during browser session
- **Setup wizard** - Guided Cloudflare configuration

**Removed:**
- `login-modal.tid` - No longer needed with server-side auth
- `password-config.tid` - Replaced by Cloudflare environment variables
- Login/logout sidebar links - Admin panel now toggle-based

**Updated:**
- `navigation.tid` - Simplified to admin toggle only
- `admin-panel.tid` - Removed authentication checks
- All documentation updated for Cloudflare deployment workflow

**Added Files:**
- `cloudflare-saver.js` - Main save mechanism (module-type: saver)
- `cloudflare-startup.js` - Module initialization
- `cloudflare-test-action.js` - Connection test widget
- `cloudflare-clear-password-action.js` - Password clearing widget
- `cloudflare-settings.tid` - Control Panel configuration UI
- `cloudflare-wizard.tid` - Setup wizard
- `notification-saving.tid`, `notification-success.tid`, `notification-failure.tid`

### v1.0.0 (November 2025)

**Initial Release:**
- Blog-style interface with WordPress-like feel
- Client-side password authentication
- Login/logout system
- Featured posts on homepage
- Favorite articles sidebar
- Recently updated sidebar
- Multiple author support
- Categories and tags
- Static pages support
- Responsive design
- Admin panel with password protection
- Comprehensive documentation

## Support

For questions, issues, or suggestions:
- **GitHub Issues**: https://github.com/BenSweaterVest/TiddlySite/issues
- **TiddlyWiki Community**: https://talk.tiddlywiki.org/
- **Documentation**: https://tiddlywiki.com/

## Contributing

Contributions are welcome! Please:
- Fork the repository
- Create a feature branch
- Make your changes with clear documentation
- Test thoroughly
- Submit a pull request with detailed description

## License

This plugin is released under the same license as TiddlyWiki (BSD 3-Clause).

## Credits

Built with [TiddlyWiki](https://tiddlywiki.com/) by Jeremy Ruston and the TiddlyWiki community.

Cloudflare Functions integration enables seamless GitHub saves and automatic deployment.

---

**Version**: 2.0.0
**Author**: BenSweaterVest
**Last Updated**: November 2025
**Repository**: https://github.com/BenSweaterVest/TiddlySite
