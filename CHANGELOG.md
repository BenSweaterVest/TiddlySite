# Changelog

All notable changes to the TiddlyWiki Collaborative Blog Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-11-18

### Added
- **Enhanced Search**: Quick search panel in sidebar with instant results
- **Advanced Search Page**: Full-featured search with filters for post type, category, and author
- **Search Filters**: Filter search results by post type, category tags, and author
- **Rich Search Results**: Detailed result cards with post type badges, metadata, excerpts, and tags
- **Analytics Integration**: Support for Plausible Analytics, Simple Analytics, Google Analytics (GA4), and custom providers
- **Analytics Configuration UI**: Easy setup in Control Panel → Settings → Analytics
- **Privacy Guidance**: Built-in GDPR/CCPA compliance recommendations for analytics
- 4 new core files: search-panel.tid, search-results.tid, analytics-controller.tid, analytics-settings.tid

### Changed
- Plugin size increased to ~114KB (from ~91KB) with 26 core tiddlers (from 22)
- Updated plugin readme (readme.tid) with all v2.1.0 and v2.2.0 features
- Total package now includes 34 tiddlers (from 30)

### Technical
- Search uses TiddlyWiki's powerful filter operators with dynamic filter construction
- Analytics uses dynamic script injection via `$:/tags/RawMarkup`
- Configuration stored in `$:/config/collaborative-blog/analytics/*` tiddlers

## [2.1.0] - 2025-11-18

### Added
- **Theme System**: 5 professional themes (Historical Society, Modern Minimalist, Dark Mode, Vibrant Creative, Professional Business)
- **Theme Switcher UI**: One-click theme selection in Control Panel → Appearance
- **CSS Variable System**: 40+ customizable properties for complete design control
- **Theme Controller**: Dynamic CSS variable injection based on selected theme
- **Color Palette Previews**: Visual swatches for each theme in theme selector
- **Custom Post Types**: 4 specialized post templates
  - Event Posts: Date, time, location, status, RSVP link fields
  - Gallery Posts: Responsive image grid layout with hover effects
  - Video Posts: YouTube/Vimeo auto-embed with optional transcripts
  - Quote Posts: Large centered quotation display with author/source attribution
- **Post Type Selector**: Color-coded buttons in admin panel for creating different post types
- 6 new core files: viewtemplate-post-event.tid, viewtemplate-post-gallery.tid, viewtemplate-post-video.tid, viewtemplate-post-quote.tid, theme-controller.tid, theme-switcher.tid

### Changed
- Refactored styles.tid to use CSS variables throughout
- Updated admin-panel.tid with post type selector buttons replacing single "New Post" button
- Plugin size increased to ~91KB (from ~57KB) with 22 core tiddlers (from 16)
- Total package now includes 30 tiddlers (from 24)

### Technical
- Default theme matches v2.0.0 visual design for backward compatibility
- All themes use same CSS variable names for consistency
- Post type templates use conditional rendering with `<$list>` filters

## [2.0.0] - 2025-11-17

### Added
- **Integrated Cloudflare Saver**: Automatic GitHub saves built into plugin
- **Server-side Authentication**: Password validation via Cloudflare environment variables
- **Auto-deployment**: Cloudflare Pages deploys on every save
- **Save Notifications**: Visual feedback for save status (saving, success, failure)
- **Save Statistics**: Track successful and failed saves over time
- **Connection Testing**: Test Cloudflare endpoint from Control Panel
- **Session Password Memory**: Optional password caching during browser session (disabled by default)
- **Auto-retry**: Exponential backoff retry logic (up to 3 attempts)
- **Setup Wizard**: Guided configuration for first-time users
- **Enhanced Admin Experience**: Simplified navigation with admin panel toggle
- **Configuration UI**: Complete Control Panel → Saving interface
- **Debug Logging**: Optional console logging for troubleshooting
- **Timeout Configuration**: Customizable request timeout (5-300 seconds)
- 10 new files: cloudflare-saver.js, cloudflare-startup.js, cloudflare-test-action.js, cloudflare-clear-password-action.js, cloudflare-settings.tid, cloudflare-wizard.tid, notification-saving.tid, notification-success.tid, notification-failure.tid

### Removed
- `login-modal.tid` - No longer needed with server-side auth
- `password-config.tid` - Replaced by Cloudflare environment variables
- Login/Logout links in sidebar - Admin panel now toggle-based
- Client-side password validation - Moved to Cloudflare Function

### Changed
- Admin panel always accessible - password authentication happens on save, not on access
- Navigation simplified to admin toggle only
- Documentation completely rewritten for Cloudflare deployment workflow
- Plugin size: ~57KB with 16 core tiddlers

### Breaking Changes
- **Requires Cloudflare Pages deployment** - Plugin now assumes Cloudflare Functions setup
- **Server-side authentication** - Password stored in Cloudflare environment variables, not in tiddlers
- **No more client-side password** - Removed password stored in tiddlers and JavaScript password comparison

### Security Improvements
- Server-side password validation via Cloudflare environment variables
- GitHub token never exposed to client
- Session passwords stored in memory only (not persisted)
- Auto-clear passwords on 401 authentication failures
- Optional session memory (disabled by default for security)

## [1.0.0] - 2025-11-16

### Added
- Initial release of Collaborative Blog Plugin
- WordPress-style blog interface for TiddlyWiki
- Clean blog layout with hidden wiki controls
- Left sidebar navigation with recently updated and favorite articles
- Multiple author support with attribution
- Featured posts on homepage
- Favorite articles sidebar
- Categories and tags for organization
- Post archive and table of contents
- Static pages support (About, Contact, etc.)
- Draft management (hide posts from public view)
- Client-side password authentication
- Login/logout system
- Admin panel with password protection
- Responsive design for mobile and desktop
- Historical society / nonprofit aesthetic
- ARIA labels and semantic HTML for accessibility
- Comprehensive documentation

### Initial Files
- 16 core tiddlers including styles, templates, and admin panel
- 8 example content tiddlers (sample posts and pages)
- Total package: ~57KB

---

## Release Links

- [v2.2.0 Release Notes](./RELEASE_NOTES_v2.2.0.md)
- [v2.1.0 Release Notes](./RELEASE_NOTES_v2.1.0.md)
- [v2.0.0 Release Notes](./RELEASE_NOTES_v2.0.0.md)
- [GitHub Repository](https://github.com/BenSweaterVest/TiddlySite)
