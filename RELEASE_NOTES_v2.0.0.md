# TiddlyWiki Collaborative Blog Plugin v2.0.0

## 🚀 Major Release - Cloudflare Integration

A complete overhaul integrating automatic GitHub saving via Cloudflare Functions directly into the plugin. This release transforms the plugin into an all-in-one blogging solution with seamless deployment.

## ⚠️ Breaking Changes

**This is a major version update with breaking changes from v1.0.0:**

- **Removed client-side password authentication** - No more password stored in tiddlers
- **Removed login/logout UI** - Admin panel is now always accessible (password required only on save)
- **Requires Cloudflare Pages deployment** - Plugin now assumes Cloudflare Functions setup
- **Server-side authentication** - Password validation moved to Cloudflare Functions

## ✨ New Features

### Integrated Cloudflare Saver
- **Automatic GitHub saves** - No manual download required
- **Server-side authentication** - Passwords validated via Cloudflare environment variables
- **Real-time deployment** - Cloudflare Pages auto-deploys on every save
- **Visual notifications** - Save status displayed (saving, success, failure)
- **Save statistics** - Track successful and failed saves over time
- **Connection testing** - Test Cloudflare endpoint from Control Panel
- **Session password memory** - Optional password caching during browser session (disabled by default)
- **Auto-retry** - Exponential backoff retry logic (up to 3 attempts)
- **Setup wizard** - Guided configuration for first-time users

### Enhanced Admin Experience
- **Simplified navigation** - Admin panel toggle (no login required)
- **Configuration UI** - Complete Control Panel → Saving interface
- **Debug logging** - Optional console logging for troubleshooting
- **Timeout configuration** - Customizable request timeout (5-300 seconds)

## 🗑️ Removed Features

- `login-modal.tid` - No longer needed with server-side auth
- `password-config.tid` - Replaced by Cloudflare environment variables
- Login/Logout links in sidebar - Admin panel now toggle-based
- Client-side password validation - Moved to Cloudflare Function

## 📦 Installation

### Prerequisites

1. **Cloudflare Pages account** (free)
2. **GitHub repository** for your TiddlyWiki
3. **GitHub Personal Access Token** with `repo` scope

### Quick Start

1. Download `collaborative-blog-plugin.tid` or `collaborative-blog-plugin.json`
2. Drag and drop onto your TiddlyWiki
3. Follow the Cloudflare setup instructions in README.md
4. Configure the plugin in Control Panel → Saving

See the [README](https://github.com/BenSweaterVest/TiddlySite/blob/main/README.md) for complete installation instructions.

## 🔧 What's Included

### Core Plugin (collaborative-blog-plugin.tid)
**16 core tiddlers** - 57KB

- **UI Components**
  - `admin-panel.tid` - Admin control panel (no auth required)
  - `navigation.tid` - Left sidebar with admin toggle
  - `styles.tid` - Complete stylesheet (login/logout CSS removed)
  - `viewtemplate-*.tid` - Post, page, and system tiddler templates
  - `readme.tid` - Plugin documentation

- **Cloudflare Saver Modules**
  - `cloudflare-saver.js` - Main save mechanism (module-type: saver)
  - `cloudflare-startup.js` - Plugin initialization
  - `cloudflare-test-action.js` - Connection test widget
  - `cloudflare-clear-password-action.js` - Password clearing widget

- **UI Tiddlers**
  - `cloudflare-settings.tid` - Control Panel configuration interface
  - `cloudflare-wizard.tid` - Setup wizard
  - `notification-saving.tid` - "Saving..." notification
  - `notification-success.tid` - "Success!" notification
  - `notification-failure.tid` - "Failed" notification

### Complete Package (collaborative-blog-plugin.json)
**24 tiddlers** - 57KB (includes 8 example content items)

Additional example content:
- 4 sample blog posts with proper metadata
- 2 example pages (About, Contact)
- Homepage, All Posts, and Categories pages
- Pre-configured site title and navigation

## 📊 Technical Details

- **Version**: 2.0.0
- **TiddlyWiki Compatibility**: >=5.3.0
- **Plugin Size**: 57KB (both .tid and .json)
- **Total Code**: ~1500 lines across 28 files
- **Module Types**: saver, startup, widget
- **Saver Priority**: 2000 (high - preferred over download saver)

## 🔐 Security Improvements

### v2.0.0 Security Model
- ✅ **Server-side password validation** via Cloudflare environment variables
- ✅ **GitHub token never exposed** to client
- ✅ **Session passwords in memory only** (not persisted)
- ✅ **Auto-clear on 401** authentication failures
- ✅ **Optional session memory** (disabled by default)

### v1.0.0 Security Model (deprecated)
- ❌ Client-side password in tiddler (plain text)
- ❌ JavaScript password comparison (client-side)
- ❌ Session state in tiddler

## 📝 Documentation

Completely rewritten for v2.0.0:
- **README.md** - Full Cloudflare deployment guide
- **Cloudflare Setup** - 6-step setup with complete `functions/save.js` code
- **Troubleshooting** - Save & deployment issues (not authentication)
- **Version History** - Detailed v2.0.0 changelog
- **Security** - Server-side authentication best practices

## 🔄 Migration from v1.0.0

**Upgrading is not straightforward - this is a complete architecture change:**

1. **Backup your v1.0.0 TiddlyWiki** before upgrading
2. **Set up Cloudflare Pages** following README instructions
3. **Create `functions/save.js`** in your repository
4. **Configure environment variables** in Cloudflare
5. **Install v2.0.0 plugin** (will replace v1.0.0)
6. **Configure in Control Panel → Saving**
7. **Remove old password tiddler** (`$:/config/collaborative-blog/password` if it exists)

## 🆕 Cloudflare Function

v2.0.0 requires a Cloudflare Function at `functions/save.js`. Example code provided in README includes:

- Password authentication via `env.SAVE_PASSWORD`
- GitHub API integration with proper SHA handling
- UTF-8 content encoding
- Error handling and validation
- Optional rate limiting and content size validation

## 🎯 Use Cases

Perfect for:
- Historical societies and nonprofits
- Personal blogs with GitHub version control
- Organization websites with multiple contributors
- Projects requiring automatic deployment
- Blogs that need password-protected editing

## 🙏 Credits

- Built with [TiddlyWiki](https://tiddlywiki.com/) by Jeremy Ruston
- Cloudflare Functions integration for seamless deployment
- Inspired by WordPress-style blog interfaces

## 📥 Download

- **[collaborative-blog-plugin.tid](./collaborative-blog-plugin.tid)** (57KB) - Plugin only
- **[collaborative-blog-plugin.json](./collaborative-blog-plugin.json)** (57KB) - Complete package with examples

---

**Full Documentation**: [README.md](https://github.com/BenSweaterVest/TiddlySite/blob/main/README.md)
**Issues & Support**: [GitHub Issues](https://github.com/BenSweaterVest/TiddlySite/issues)
**TiddlyWiki Community**: [talk.tiddlywiki.org](https://talk.tiddlywiki.org/)
