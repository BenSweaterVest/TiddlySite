# TiddlyWiki Collaborative Blog Plugin v2.1.0

## 🎨 Feature Release - Themes & Custom Post Types

This release adds powerful customization options with a complete theme system and specialized post type templates for richer content.

## ✨ New Features

### Theme System

**5 Professional Themes** - Complete visual redesigns with one-click switching:

1. **Historical Society** (Default)
   - Classic serif typography (Georgia)
   - Traditional navy/burgundy palette
   - Paper-like textures and formal styling
   - Perfect for historical societies and heritage organizations

2. **Modern Minimalist**
   - Clean sans-serif typography (Inter, System UI)
   - High-contrast black/white with blue accents
   - Sharp edges and minimal shadows
   - Ideal for contemporary professional blogs

3. **Dark Mode**
   - Eye-friendly dark backgrounds
   - Muted purple/teal accents
   - Reduced brightness for night reading
   - Great for tech blogs and personal sites

4. **Vibrant Creative**
   - Bold orange/pink/yellow color palette
   - Playful rounded corners
   - Energetic gradients and shadows
   - Perfect for creative portfolios and lifestyle blogs

5. **Professional Business**
   - Corporate blue/gray scheme
   - Balanced serif/sans-serif mix
   - Subtle shadows and refined spacing
   - Suited for business and consulting sites

**How It Works**:
- All themes use CSS custom properties (variables) for instant switching
- No page reload required - themes apply immediately
- Consistent layouts across all themes with unique color/typography personalities
- Configure in: Control Panel → Appearance → Theme Selection

### Custom Post Types

**4 Specialized Post Templates** with unique layouts and metadata:

1. **Event Posts** (`Post` + `Event` tags)
   - Event date, time, location, status (upcoming/past/cancelled)
   - RSVP link integration
   - Visual event badge and gradient background
   - Status-based color coding
   - Fields: `event-date`, `event-time`, `event-location`, `event-status`, `event-rsvp-link`

2. **Gallery Posts** (`Post` + `Gallery` tags)
   - Responsive CSS grid layout (auto-fill, min 250px columns)
   - Hover effects with elevation
   - Support for external image URLs or tagged image tiddlers
   - Image captions and alt text
   - Field: `gallery-images` (comma-separated URLs)

3. **Video Posts** (`Post` + `Video` tags)
   - YouTube and Vimeo auto-detection and embedding
   - Responsive 16:9 aspect ratio container
   - Optional video transcript with collapsible display
   - Direct video URL support
   - Fields: `video-url`, `video-transcript`

4. **Quote Posts** (`Post` + `Quote` tags)
   - Large centered quotation display (1.75rem)
   - Decorative quotation marks (6rem, opacity 0.3)
   - Gradient accent background
   - Author and source attribution
   - Optional commentary section alongside quote
   - Fields: `quote-text`, `quote-author`, `quote-source`

**Admin Panel Enhancement**:
- Replaced single "New Post" button with post type selector
- Color-coded buttons for each post type (📝 Post, 📅 Event, 🖼️ Gallery, 🎥 Video, 💬 Quote)
- Pre-filled tags and default values for each type
- Visual grouping with flexible layout

## 📊 Technical Details

- **Version**: 2.1.0
- **New Files**: 6 (4 post type templates + 2 theme system files)
- **Core Tiddlers**: 22 (up from 16 in v2.0.0)
- **Total Package**: 30 tiddlers with example content
- **Plugin Size**: ~91KB (up from 57KB)
- **TiddlyWiki Compatibility**: >=5.3.0

### Architecture

**Theme System**:
- `theme-controller.tid` - Dynamic CSS injection using `$:/tags/RawMarkup`
- `theme-switcher.tid` - Control Panel UI with radio buttons and color previews
- `styles.tid` - Refactored to use 40+ CSS variables
- Theme selection stored in: `$:/config/collaborative-blog/theme`

**Custom Post Types**:
- `viewtemplate-post-event.tid` - Event template (tagged `$:/tags/ViewTemplate`)
- `viewtemplate-post-gallery.tid` - Gallery template with CSS Grid
- `viewtemplate-post-video.tid` - Video embed template
- `viewtemplate-post-quote.tid` - Quote display template
- Each template uses conditional rendering (`<$list>` filters) to show only for matching tags

### CSS Variables System

40+ customizable variables for complete theme control:

**Colors**: `--cb-primary`, `--cb-accent`, `--cb-bg-page`, `--cb-text-body`, `--cb-border-light`, etc.
**Typography**: `--cb-font-serif`, `--cb-font-sans`, `--cb-font-mono`, `--cb-font-body`, `--cb-font-heading`
**Shadows**: `--cb-shadow-sm`, `--cb-shadow-md`, `--cb-shadow-lg`, `--cb-shadow-xl`
**Spacing**: `--cb-radius-sm`, `--cb-radius-md`, `--cb-radius-lg`

## 🔄 Compatibility

**Backward Compatible** with v2.0.0:
- All existing posts render normally with standard template
- Default theme matches v2.0.0 visual design
- No configuration changes required
- Existing custom styles will override theme variables

**Upgrade Notes**:
- Simply drag and drop new `.tid` or `.json` file
- Choose theme in Control Panel → Appearance
- Start using new post types by adding appropriate tags to posts

## 📝 Usage Examples

### Creating an Event Post

1. Click "📅 Event" button in Admin Panel
2. Add event details:
   - Title: "Summer Fundraiser Gala"
   - Tags: `Post Event` (auto-added)
   - `event-date`: 2025-08-15
   - `event-time`: 6:00 PM - 10:00 PM
   - `event-location`: City Hall Ballroom
   - `event-status`: upcoming
   - `event-rsvp-link`: https://example.com/rsvp
3. Save - displays with event badge and formatted details

### Creating a Gallery Post

1. Click "🖼️ Gallery" button in Admin Panel
2. Add gallery images:
   - Title: "Historic Building Photos"
   - Tags: `Post Gallery` (auto-added)
   - `gallery-images`: https://example.com/img1.jpg, https://example.com/img2.jpg, https://example.com/img3.jpg
3. Save - displays in responsive grid layout

### Switching Themes

1. Navigate to Control Panel → Appearance
2. Select theme radio button (Historical, Modern, Dark, Vibrant, or Professional)
3. Preview color palette swatches
4. Theme applies immediately across entire site

## 🎯 Use Cases

**Themes Perfect For**:
- Historical societies → Historical theme
- Tech blogs → Dark mode or Modern
- Creative agencies → Vibrant theme
- Professional services → Professional Business theme
- Personal blogs → Any theme based on personality

**Custom Post Types Perfect For**:
- Community events → Event posts
- Photography portfolios → Gallery posts
- Video tutorials → Video posts
- Inspirational content → Quote posts
- Mixed content blogs → Combination of all types

## 🐛 Bug Fixes

- None - this is a feature-only release

## 🔜 Coming Soon (Roadmap)

Potential future enhancements:
- Enhanced search functionality with filters and highlighting
- Analytics integration (Plausible/Simple Analytics)
- Custom theme creator
- Additional post types (Audio, Link, Review)
- RSS feed generation

## 📥 Download

- **[collaborative-blog-plugin.tid](./collaborative-blog-plugin.tid)** (~91KB) - Plugin only
- **[collaborative-blog-plugin.json](./collaborative-blog-plugin.json)** (~91KB) - Complete package with examples

---

**Full Documentation**: [README.md](https://github.com/BenSweaterVest/TiddlySite/blob/main/README.md)
**Previous Release**: [v2.0.0 Release Notes](./RELEASE_NOTES_v2.0.0.md)
**Issues & Support**: [GitHub Issues](https://github.com/BenSweaterVest/TiddlySite/issues)
**TiddlyWiki Community**: [talk.tiddlywiki.org](https://talk.tiddlywiki.org/)
