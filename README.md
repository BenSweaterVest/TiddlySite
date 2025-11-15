# TiddlyWiki Collaborative Blog Plugin

A WordPress-style collaborative blog plugin for TiddlyWiki, designed to create a clean, professional website with a non-wiki feel. Perfect for historical societies, nonprofits, and small organizations.

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

### Security & Authentication
- **Password-protected editing** - Admin features only accessible after login
- **Login/Logout system** - Discrete login link in sidebar
- **Admin panel** - Hidden by default, appears after authentication
- **Session state management** - Maintains login state during browsing session

### Accessibility
- **ARIA labels** - Screen reader support for all interactive elements
- **Semantic HTML** - Proper heading hierarchy and document structure
- **Keyboard navigation** - All features accessible via keyboard

## Installation

You have three easy options to install this plugin:

### Method 1: Drag and Drop - Complete Package (Recommended for Testing)

**Install everything at once - plugin + example content:**

1. Open your TiddlyWiki file in your browser (e.g., `empty.html`)
2. Download **`collaborative-blog-plugin.json`** from this repository or the [latest release](https://github.com/BenSweaterVest/TiddlySite/releases)
3. Drag and drop the JSON file onto your TiddlyWiki page
4. Click the "Import" button to import all tiddlers (plugin + 4 example posts + 2 example pages)
5. Save your wiki (the admin panel will be accessible before you set a password)
6. Refresh the page to see your new blog with example content!

### Method 2: Drag and Drop - Plugin Only (Recommended for Production)

**Install just the plugin, start with a clean slate:**

1. Open your TiddlyWiki file in your browser (e.g., `empty.html`)
2. Download **`collaborative-blog-plugin.tid`** from this repository or the [latest release](https://github.com/BenSweaterVest/TiddlySite/releases)
3. Drag and drop the `.tid` file onto your TiddlyWiki page
4. Click the "Import" button
5. Save and refresh
6. **IMPORTANT:** Immediately set your admin password (see Security Setup below)

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
4. **IMPORTANT:** Immediately set your admin password (see Security Setup below)

## Security Setup

### ⚠️ CRITICAL: Change the Default Password

The plugin ships with a default password of `changeme`. **You MUST change this immediately after installation.**

**To change your password:**

1. Search for the tiddler: `$:/config/collaborative-blog/password`
2. Edit the tiddler
3. Replace `changeme` with your new password
4. Save the tiddler
5. Save your wiki

**Security Best Practices:**

- ✅ **DO:** Use a strong, unique password
- ✅ **DO:** Change the password regularly
- ✅ **DO:** Keep backup copies of your wiki in a secure location
- ❌ **DON'T:** Share your wiki file with untrusted parties (password is stored in plain text)
- ❌ **DON'T:** Use the same password as other accounts
- ❌ **DON'T:** Commit the wiki file with your password to public repositories

### 🔒 Security Limitations

**IMPORTANT:** This plugin provides basic password protection suitable for personal blogs and small team collaboration. However, you should understand its limitations:

1. **Plain text storage** - The password is stored in plain text within the HTML file. Anyone with access to the file can view it by opening it in a text editor.

2. **No encryption** - The wiki file itself is not encrypted. All content is readable without a password if someone has file access.

3. **Client-side only** - Password checking happens in the browser. This is NOT suitable for protecting sensitive information or preventing determined attackers.

4. **Session-based** - Login state is only maintained during your browsing session. Refreshing the page requires logging in again.

**Recommended use cases:**
- Personal blogs where you want to prevent accidental edits
- Small team blogs where all members are trusted
- Public-facing sites where you want to discourage casual vandalism
- Educational or demonstration sites

**NOT recommended for:**
- Storing confidential information
- Protecting against determined attackers
- Compliance with data protection regulations
- Sites with untrusted visitors who have file access

**For enhanced security**, consider:
- Using TiddlyWiki on Node.js with server-side authentication
- Hosting on platforms with built-in access control (e.g., TiddlyHost, TiddlySpot)
- Using the [Cloudflare saver](https://github.com/BenSweaterVest/tiddlywiki-cloudflare-saver) for server-side password protection
- Implementing full encryption solutions for sensitive data

## Usage

### Logging In

1. Click the **Login** link in the left sidebar
2. Enter your admin password
3. Click **Login**
4. If successful, you'll see **Admin** and **Logout** links replace the Login link

**Notes:**
- Login state persists during your browsing session
- You'll need to log in again after refreshing the page
- Invalid password attempts show an error message

### Admin Panel

After logging in, click the **Admin** link to toggle the admin panel. The panel provides quick access to:

- **New Post** - Create a new blog post
- **New Page** - Create a new static page
- **Control Panel** - Access TiddlyWiki settings
- **Save Changes** - Download updated wiki file
- **Advanced Search** - Search all tiddlers

### Creating Blog Posts

1. Log in and click **Admin** in the sidebar
2. Click **New Post** in the admin panel
3. Add the following fields to your tiddler:
   - **Title**: Your post title
   - **Tags**: `Post` (required), plus any category tags (e.g., `News`, `Events`, `History`)
   - **Author**: Author name (e.g., `Sarah Johnson`)
   - **Date**: Date in YYYYMMDD format (e.g., `20251115`)
   - **Excerpt**: Brief summary (optional but recommended)
4. Write your content using TiddlyWiki markup
5. Save the tiddler
6. Click **Save Changes** in the admin panel to persist your work

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

1. Log in and click **New Page** in the admin panel
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

### Logging Out

1. Click the **Logout** link in the sidebar
2. Admin panel will hide and Login link will reappear
3. Remember to save any changes before logging out

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
- Login/Admin/Logout links

### Modify Color Scheme

Edit `$:/plugins/collaborative-blog/styles` to customize:
- Colors (backgrounds, text, links, accents)
- Fonts (typefaces, sizes, weights)
- Layout (spacing, widths, breakpoints)
- Admin panel appearance
- Login modal styling

**Key CSS variables to modify:**
- `.cb-sidebar` - Sidebar background and width
- `.cb-post` - Post card styling
- `.cb-admin-panel` - Admin panel appearance
- `.cb-login-modal` - Login modal styling

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
| Can't edit after login | Wrong password | Check password in `$:/config/collaborative-blog/password` |
| Admin panel won't appear | Not authenticated | Click Login and enter correct password |

## File Structure

```
plugins/collaborative-blog/
├── plugin.info                          # Plugin metadata
└── tiddlers/
    ├── styles.tid                       # Main stylesheet (includes login modal styles)
    ├── navigation.tid                   # Left sidebar (with login/recently updated/favorites)
    ├── admin-panel.tid                  # Admin interface (password-protected)
    ├── login-modal.tid                  # Password login interface
    ├── password-config.tid              # Admin password storage (DEFAULT: "changeme")
    ├── viewtemplate-systemtiddler.tid   # Hides system tiddlers from story view
    ├── homepage.tid                     # Homepage template
    ├── viewtemplate-post.tid            # Blog post layout
    ├── viewtemplate-page.tid            # Static page layout
    ├── all-posts.tid                    # Post archive page
    ├── categories.tid                   # Category browser
    ├── readme.tid                       # Plugin documentation
    ├── about.tid                        # Example About page
    ├── contact.tid                      # Example Contact page
    ├── post1.tid                        # Example blog post (featured)
    ├── post2.tid                        # Example blog post
    ├── post3.tid                        # Example blog post
    ├── post4.tid                        # Example blog post
    ├── site-title.tid                   # Site title configuration
    ├── site-subtitle.tid                # Site subtitle configuration
    └── default-tiddlers.tid             # Default page on load

Distribution Files:
├── collaborative-blog-plugin.tid        # Single-file plugin (9 core tiddlers, no examples)
└── collaborative-blog-plugin.json       # Complete package (21 tiddlers with examples)
```

## Troubleshooting

### Authentication Issues

**Can't log in / Invalid password error:**
- Check that you're entering the correct password
- Verify the password in `$:/config/collaborative-blog/password`
- Ensure there are no extra spaces or line breaks in the password tiddler
- Password comparison is case-sensitive

**Admin panel not appearing after login:**
- Click the "Admin" link in the sidebar to toggle panel visibility
- Check that `$:/state/collaborative-blog/authenticated` contains "yes"
- Clear browser cache and try again

**Logged out after refresh:**
- This is expected behavior - login state is session-based
- You must log in again after refreshing the page
- This is a security feature to prevent unauthorized access

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
- Log out and log back in to reset state

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

1. **Set up security** - Change default password in `$:/config/collaborative-blog/password`
2. **Log in** - Click Login link, enter password
3. **Create post** - Click Admin → New Post
4. **Add metadata:**
   - Title: "Welcome to Our Blog"
   - Tags: `Post News`
   - Author: Your name
   - Date: `20251115` (today's date in YYYYMMDD format)
   - Excerpt: "Welcome to our new blog! We're excited to share our stories."
5. **Write content** - Use TiddlyWiki markup or plain text
6. **Save tiddler** - Click the checkmark button
7. **Save wiki** - Click Save Changes in admin panel
8. **View result** - Navigate to homepage to see your post

### Workflow 2: Featuring a Post

1. Log in
2. Navigate to the post you want to feature
3. Click the edit button (pencil icon at top of post)
4. Add `Featured` to the tags field (e.g., change `Post News` to `Post News Featured`)
5. Save the tiddler
6. Navigate to homepage to see post in featured section
7. Remember: Only one post should be featured at a time for best visual impact

### Workflow 3: Adding a Static Page to Navigation

1. Log in
2. Create new page via Admin → New Page
3. Add title (e.g., "Projects") and tag `Page`
4. Write page content and save
5. Edit `$:/plugins/collaborative-blog/Navigation`
6. Find the navigation links section
7. Add a new link: `<$link to="Projects">Projects</$link>`
8. Save the navigation tiddler
9. The new link will appear in the left sidebar

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

13. **Change default password immediately** - Replace "changeme" with a strong password on first use
14. **Use unique passwords** - Don't reuse passwords from other accounts
15. **Keep password secure** - Don't share the password or the wiki file publicly
16. **Regular password changes** - Update your password periodically
17. **Understand limitations** - Remember this is client-side security suitable for basic protection only

### Performance

18. **Optimize images** - Compress images before embedding to keep file size manageable
19. **Archive old content** - For large blogs (100+ posts), consider archiving old content to separate wiki files
20. **Use excerpts** - Prevents homepage from loading full post content

### Customization

21. **Customize incrementally** - Make small changes and test frequently
22. **Keep backups before major changes** - Save a copy before modifying core plugin tiddlers
23. **Document customizations** - Add comments to your custom CSS and templates
24. **Test on mobile** - Check responsive design on different screen sizes

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

### v1.0.0 (November 2025)

**Features:**
- Initial release with blog-style interface
- Password-protected admin panel
- Login/logout system
- Featured posts on homepage
- Favorite articles sidebar
- Recently updated sidebar
- Multiple author support
- Categories and tags
- Static pages support
- Responsive design
- Comprehensive documentation

**Accessibility:**
- ARIA labels for all interactive elements
- Keyboard navigation support
- Semantic HTML structure

**Bug Fixes:**
- Fixed admin panel toggle using TiddlyWiki state management instead of JavaScript
- Fixed system tiddlers (like ControlPanel) appearing in story view

**Security:**
- Client-side password authentication
- Session-based login state
- Plain-text password storage (see Security Limitations)

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

Password authentication inspired by the [Cloudflare saver plugin](https://github.com/BenSweaterVest/tiddlywiki-cloudflare-saver).

---

**Version**: 1.0.0
**Author**: BenSweaterVest
**Last Updated**: November 2025
**Repository**: https://github.com/BenSweaterVest/TiddlySite
