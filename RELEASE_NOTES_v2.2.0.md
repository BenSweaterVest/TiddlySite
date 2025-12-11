# TiddlyWiki Collaborative Blog Plugin v2.2.0

## 🔍 Feature Release - Enhanced Search & Analytics

This release adds powerful search capabilities and flexible analytics integration to help you understand and serve your audience better.

## ✨ New Features

### Enhanced Search Functionality

**Advanced Search Interface** with filtering and faceted search:

1. **Quick Search Panel** (Sidebar)
   - Real-time search as you type
   - Shows top 5 matching results instantly
   - Result count and "View All" link
   - Filter by category tags with one click
   - Clean, integrated sidebar design

2. **Advanced Search Page** (`$:/plugins/collaborative-blog/search-results`)
   - Full search results with detailed cards
   - Multiple filter options:
     - **Post Type**: Standard Post, Event, Gallery, Video, Quote, Page
     - **Category**: All available category tags
     - **Author**: Filter by post author
   - Rich result cards showing:
     - Post type badges (color-coded)
     - Publication date and author
     - Excerpts with context
     - Category tags
   - "No results" messaging with suggestions
   - Responsive grid layout

3. **Search Features**:
   - Searches both title and full text content
   - Excludes draft posts from results
   - Highlights post type with badges
   - Shows metadata (date, author, tags)
   - Direct links to matching content
   - Clear filter button to reset all filters

4. **User Experience**:
   - Search panel accessible from sidebar tab
   - Advanced search link for power users
   - Collapsible category filter
   - Clean, modern interface matching theme system
   - Mobile-responsive design

### Analytics Integration

**Privacy-Friendly Analytics** with support for multiple providers:

1. **Supported Providers**:
   - **Plausible Analytics** (Recommended)
     - Privacy-friendly, no cookies
     - GDPR/CCPA compliant
     - Lightweight script (~1KB)
     - Simple setup with domain configuration

   - **Simple Analytics**
     - Privacy-first alternative
     - No cookies, GDPR compliant
     - Clean interface
     - No configuration needed

   - **Google Analytics (GA4)**
     - Comprehensive analytics
     - Advanced features
     - Requires Measurement ID
     - May need cookie consent

   - **Custom Analytics**
     - Bring your own provider
     - Paste custom HTML/JavaScript
     - Full flexibility

2. **Configuration** (Control Panel → Settings → Analytics):
   - Enable/disable analytics with checkbox
   - Choose provider with radio buttons
   - Provider-specific configuration:
     - Plausible: Enter your domain
     - Google: Enter Measurement ID (G-XXXXXXXXXX)
     - Custom: Paste script tags
   - Visual configuration preview
   - Testing instructions

3. **Privacy Features**:
   - Analytics disabled by default
   - Privacy notice with best practices
   - Recommendations for privacy-friendly options
   - GDPR/CCPA compliance guidance
   - Links to privacy policy resources

4. **Implementation**:
   - Dynamic script injection via `$:/tags/RawMarkup`
   - No manual code editing required
   - Scripts load only when enabled
   - Conditional rendering based on provider
   - Clean, maintainable architecture

## 📊 Technical Details

- **Version**: 2.2.0
- **New Files**: 4 (2 search files + 2 analytics files)
- **Core Tiddlers**: 26 (up from 22 in v2.1.0)
- **Total Package**: 34 tiddlers with example content
- **Plugin Size**: ~112KB (up from ~91KB)
- **TiddlyWiki Compatibility**: >=5.3.0

### Architecture

**Enhanced Search**:
- `search-panel.tid` - Sidebar search interface (tagged `$:/tags/SideBar`)
- `search-results.tid` - Advanced search page with filters (tagged `Page`)
- Uses TiddlyWiki's built-in filter operators for powerful queries
- Dynamic filter construction based on user selections
- Responsive CSS with theme variable integration

**Analytics Integration**:
- `analytics-controller.tid` - Script injection controller (tagged `$:/tags/RawMarkup`)
- `analytics-settings.tid` - Control Panel UI (tagged `$:/tags/ControlPanel/Settings`)
- Configuration stored in `$:/config/collaborative-blog/analytics/*` tiddlers
- Conditional rendering with `<$list>` filters
- Clean separation of concerns

### Search Filter Logic

The search system builds filters dynamically:

```wikitext
Base: [!is[system]!tag[Draft]]
+ Search text: search:title,text{$:/temp/search}
+ Post type: tag[Event]
+ Category: tag[News]
+ Author: author[Sarah Johnson]
→ Final filter combines all active filters
```

### Analytics Provider Detection

The analytics controller checks configuration and injects appropriate scripts:

- Plausible: `<script defer data-domain="..." src="https://plausible.io/js/script.js">`
- Simple Analytics: `<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js">`
- Google Analytics: `<script async src="https://www.googletagmanager.com/gtag/js?id=...">`
- Custom: Direct HTML/JavaScript injection

## 🔄 Compatibility

**Backward Compatible** with v2.1.0 and v2.0.0:
- All existing features continue to work
- Search panel adds new sidebar tab (doesn't replace anything)
- Analytics disabled by default (opt-in)
- No configuration changes required for existing users
- Themes work with new search/analytics UI

**Upgrade Notes**:
- Simply drag and drop new `.tid` or `.json` file
- Enable search by clicking "Search" tab in sidebar
- Enable analytics in Control Panel → Settings → Analytics
- No data migration needed

## 📝 Usage Examples

### Using Quick Search

1. Click **Search** tab in left sidebar
2. Type search query in input box
3. See instant results (top 5 matches)
4. Click category tag to filter by topic
5. Click "View All Results →" for advanced search

### Using Advanced Search

1. Navigate to Advanced Search page or click link from sidebar
2. Enter search terms in large search box
3. Select filters:
   - Post Type: Choose Event, Gallery, Video, Quote, etc.
   - Category: Select from available tags
   - Author: Filter by post author
4. View filtered results with detailed cards
5. Click "Clear" to reset all filters

### Setting Up Plausible Analytics

1. Sign up at [plausible.io](https://plausible.io)
2. Add your site and verify ownership
3. Navigate to Control Panel → Settings → Analytics
4. Check "Enable analytics tracking"
5. Select "Plausible Analytics"
6. Enter your domain (e.g., `myblog.com`)
7. Save your wiki
8. Verify script loads in browser DevTools (F12 → Network tab)

### Setting Up Google Analytics

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (G-XXXXXXXXXX)
3. Navigate to Control Panel → Settings → Analytics
4. Check "Enable analytics tracking"
5. Select "Google Analytics (GA4)"
6. Paste your Measurement ID
7. Save your wiki
8. (Optional) Add cookie consent banner if required by law

## 🎯 Use Cases

**Enhanced Search Perfect For**:
- Large blogs with 50+ posts
- Multi-author sites needing author filtering
- Sites with multiple post types (events, galleries, etc.)
- Category-heavy content organization
- Users who want quick access to content

**Analytics Perfect For**:
- Understanding visitor traffic patterns
- Measuring content popularity
- Tracking user engagement
- Making data-driven content decisions
- Demonstrating site impact to stakeholders

**Privacy-Friendly Analytics Recommended For**:
- European Union sites (GDPR compliance)
- California-based sites (CCPA compliance)
- Privacy-conscious organizations
- Sites wanting to avoid cookie consent banners
- Users who value visitor privacy

## 🐛 Bug Fixes

- None - this is a feature-only release

## 🔜 Coming Soon (Roadmap)

Potential future enhancements:
- Search result highlighting (matching text preview)
- Saved searches and search history
- RSS feed generation
- Email newsletter integration
- Comment system integration
- Custom theme creator UI
- Additional post types (Audio, Link, Review)
- Multi-language support

## 🔐 Privacy & Security

### Analytics Privacy

**Privacy-Friendly Options (Recommended)**:
- Plausible and Simple Analytics are **cookieless** and **GDPR/CCPA compliant** by default
- No personal data collection or tracking
- Aggregate statistics only
- No cross-site tracking
- Open-source and transparent

**Google Analytics**:
- May require cookie consent banners (EU, California)
- Consider enabling IP anonymization
- Review Google's data processing terms
- Add privacy policy explaining analytics use

**Best Practices**:
- Always inform users about analytics in your privacy policy
- Use privacy-friendly alternatives when possible
- Respect "Do Not Track" signals
- Regularly review analytics provider's privacy practices

## 📥 Download

- **[collaborative-blog-plugin.tid](./collaborative-blog-plugin.tid)** (~112KB) - Plugin only
- **[collaborative-blog-plugin.json](./collaborative-blog-plugin.json)** (~113KB) - Complete package with examples

---

**Full Documentation**: [README.md](https://github.com/BenSweaterVest/TiddlySite/blob/main/README.md)
**Previous Release**: [v2.1.0 Release Notes](./RELEASE_NOTES_v2.1.0.md)
**Issues & Support**: [GitHub Issues](https://github.com/BenSweaterVest/TiddlySite/issues)
**TiddlyWiki Community**: [talk.tiddlywiki.org](https://talk.tiddlywiki.org/)
