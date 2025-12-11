# Migration Guide

This guide helps you migrate to TiddlySite from various platforms and between TiddlySite versions.

## Table of Contents

- [From WordPress to TiddlySite](#from-wordpress-to-tiddlysite)
- [From Standard TiddlyWiki to TiddlySite](#from-standard-tiddlywiki-to-tiddlysite)
- [From Other Static Site Generators](#from-other-static-site-generators)
- [Between TiddlySite Versions](#between-tiddlysite-versions)

---

## From WordPress to TiddlySite

### Why Migrate?

- **No database required** - Single HTML file
- **No server required** - Static hosting (free with Cloudflare Pages)
- **Version control** - Every save is a Git commit
- **No security vulnerabilities** - No PHP, no plugins to update
- **No maintenance** - No WordPress updates, backups handled by Git
- **Faster** - Static files load instantly

### Migration Process

#### Step 1: Export WordPress Content

1. Log into WordPress admin panel
2. Go to **Tools** → **Export**
3. Select **All content** (or just **Posts**)
4. Click **Download Export File**
5. Save the XML file

#### Step 2: Convert WordPress Posts to Tiddlers

You'll need to create tiddlers for each WordPress post. Here's a Python script to help:

```python
#!/usr/bin/env python3
"""
Convert WordPress export XML to TiddlyWiki tiddlers
"""
import xml.etree.ElementTree as ET
import re
from datetime import datetime

def wordpress_to_tid(xml_file, output_dir):
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # WordPress RSS namespace
    ns = {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'wp': 'http://wordpress.org/export/1.2/'
    }

    for item in root.findall('.//item'):
        # Skip drafts
        status = item.find('wp:status', ns)
        if status is not None and status.text != 'publish':
            continue

        # Extract post data
        title = item.find('title').text or 'Untitled'
        content = item.find('content:encoded', ns).text or ''
        pub_date = item.find('pubDate').text
        creator = item.find('dc:creator', {'dc': 'http://purl.org/dc/elements/1.1/'})
        author = creator.text if creator is not None else ''

        # Convert HTML to TiddlyWiki markdown (basic conversion)
        content = html_to_wikitext(content)

        # Format date as YYYYMMDD
        dt = datetime.strptime(pub_date, '%a, %d %b %Y %H:%M:%S %z')
        date_field = dt.strftime('%Y%m%d')

        # Extract excerpt (first paragraph)
        excerpt = re.search(r'<p>(.*?)</p>', item.find('content:encoded', ns).text or '', re.DOTALL)
        excerpt_text = excerpt.group(1)[:200] if excerpt else ''

        # Get categories
        categories = [cat.text for cat in item.findall('category[@domain="category"]')]
        tags = ' '.join(['Post'] + categories)

        # Create tiddler filename
        filename = re.sub(r'[^a-z0-9]+', '-', title.lower())
        filepath = f'{output_dir}/{filename}.tid'

        # Write tiddler file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f'title: {title}\n')
            f.write(f'tags: {tags}\n')
            f.write(f'author: {author}\n')
            f.write(f'date: {date_field}\n')
            f.write(f'excerpt: {excerpt_text}\n')
            f.write(f'type: text/vnd.tiddlywiki\n')
            f.write('\n')
            f.write(content)

        print(f'Created: {filepath}')

def html_to_wikitext(html):
    """Basic HTML to TiddlyWiki conversion"""
    # Remove HTML comments
    html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)

    # Convert headings
    html = re.sub(r'<h2>(.*?)</h2>', r'!! \1', html, flags=re.IGNORECASE | re.DOTALL)
    html = re.sub(r'<h3>(.*?)</h3>', r'!!! \1', html, flags=re.IGNORECASE | re.DOTALL)

    # Convert bold/italic
    html = re.sub(r'<strong>(.*?)</strong>', r"''\1''", html, flags=re.IGNORECASE | re.DOTALL)
    html = re.sub(r'<em>(.*?)</em>', r"//\1//", html, flags=re.IGNORECASE | re.DOTALL)

    # Convert links
    html = re.sub(r'<a href="(.*?)">(.*?)</a>', r'[[\2|\1]]', html, flags=re.IGNORECASE | re.DOTALL)

    # Convert lists
    html = re.sub(r'<li>(.*?)</li>', r'* \1', html, flags=re.IGNORECASE | re.DOTALL)
    html = re.sub(r'</?ul>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'</?ol>', '', html, flags=re.IGNORECASE)

    # Remove remaining HTML tags (basic cleanup)
    html = re.sub(r'<p>', '\n\n', html, flags=re.IGNORECASE)
    html = re.sub(r'</p>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.IGNORECASE)

    return html.strip()

if __name__ == '__main__':
    wordpress_to_tid('wordpress-export.xml', 'tiddlers')
```

#### Step 3: Set Up TiddlySite

1. Follow the [Installation guide](README.md#installation)
2. Install TiddlySite plugin
3. Set up Cloudflare deployment

#### Step 4: Import Converted Tiddlers

1. Open your new TiddlyWiki
2. Drag and drop each `.tid` file from the conversion
3. Click "Import"
4. Save your wiki

#### Step 5: Configure Site Settings

1. Update `$:/SiteTitle` with your blog name
2. Update `$:/SiteSubtitle` with your tagline
3. Configure navigation links
4. Choose a theme
5. Set up analytics (if needed)

#### Step 6: Migrate Images

WordPress images need to be hosted separately:

**Option 1: Cloudflare R2** (Recommended)
- Upload images to Cloudflare R2
- Update image URLs in tiddlers
- Enable public access

**Option 2: GitHub**
- Create `images/` folder in your repository
- Upload images
- Reference with relative URLs

**Option 3: External CDN**
- Upload to Imgur, ImgBB, or Cloudinary
- Update image URLs in tiddlers

### What Doesn't Transfer

- ❌ Comments (consider adding Giscus or Utterances)
- ❌ Plugins (use TiddlyWiki plugins instead)
- ❌ User accounts (TiddlySite is single-author by default)
- ❌ Dynamic functionality (use TiddlyWiki widgets instead)

---

## From Standard TiddlyWiki to TiddlySite

### Migration Process

#### Step 1: Backup Your Wiki

1. Download a copy of your TiddlyWiki HTML file
2. Save to a safe location

#### Step 2: Install TiddlySite Plugin

**Method 1: Drag and Drop**
1. Download `collaborative-blog-plugin.tid`
2. Drag onto your TiddlyWiki
3. Click "Import" and save

**Method 2: Node.js**
1. Copy `plugins/collaborative-blog/` to your wiki's plugins folder
2. Update `tiddlywiki.info` to include the plugin
3. Restart TiddlyWiki server

#### Step 3: Tag Your Content

Add appropriate tags to existing tiddlers:

- **Blog posts**: Add `Post` tag and `date` field (YYYYMMDD format)
- **Static pages**: Add `Page` tag
- **Drafts**: Add `Draft` tag

**Bulk tagging tip**: Use search and replace or TiddlyWiki's batch operations

#### Step 4: Add Metadata Fields

For each blog post, add:
- `author`: Your name
- `date`: Publication date (YYYYMMDD format)
- `excerpt`: Brief summary (optional but recommended)

#### Step 5: Set Up Cloudflare Deployment

Follow the [Cloudflare Setup guide](README.md#cloudflare-setup) to enable automatic saving.

### Preserving Custom Styles

If you have custom CSS:

1. Edit `$:/plugins/collaborative-blog/styles`
2. Add your custom styles at the end
3. Use CSS variables for theme compatibility:
   ```css
   .my-custom-element {
     color: var(--cb-text-primary);
     background: var(--cb-bg-content);
   }
   ```

---

## From Other Static Site Generators

### From Jekyll

Jekyll uses Markdown with YAML frontmatter. Convert to TiddlyWiki format:

```python
#!/usr/bin/env python3
"""Convert Jekyll posts to TiddlyWiki tiddlers"""
import os
import re
from pathlib import Path

def jekyll_to_tid(jekyll_posts_dir, output_dir):
    for filepath in Path(jekyll_posts_dir).glob('*.md'):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract YAML frontmatter
        match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
        if not match:
            continue

        frontmatter, body = match.groups()

        # Parse frontmatter
        metadata = {}
        for line in frontmatter.split('\n'):
            if ': ' in line:
                key, value = line.split(': ', 1)
                metadata[key] = value.strip('"')

        # Create tiddler
        title = metadata.get('title', filepath.stem)
        tags = 'Post ' + ' '.join(metadata.get('categories', '').split())
        author = metadata.get('author', '')
        date = metadata.get('date', '')[:10].replace('-', '')  # YYYYMMDD

        # Write tiddler
        output_path = f'{output_dir}/{filepath.stem}.tid'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f'title: {title}\n')
            f.write(f'tags: {tags}\n')
            f.write(f'author: {author}\n')
            f.write(f'date: {date}\n')
            f.write(f'type: text/x-markdown\n')
            f.write('\n')
            f.write(body)

        print(f'Created: {output_path}')

if __name__ == '__main__':
    jekyll_to_tid('_posts', 'tiddlers')
```

### From Hugo

Similar process to Jekyll. Hugo also uses Markdown with frontmatter.

### From Gatsby

Export Gatsby content to Markdown, then follow Jekyll conversion process.

---

## Between TiddlySite Versions

### Upgrading from v1.x to v2.x

#### Breaking Changes

- ⚠️ **Authentication changed**: Client-side password removed, Cloudflare server-side required
- ⚠️ **Login/logout removed**: Admin panel now always accessible
- ⚠️ **Cloudflare required**: Plugin assumes Cloudflare Functions deployment

#### Migration Steps

1. **Backup your wiki** before upgrading

2. **Set up Cloudflare Functions** following the [Cloudflare Setup guide](README.md#cloudflare-setup)

3. **Update the plugin**:
   - Remove old plugin
   - Install v2.x plugin
   - Save and refresh

4. **Configure Cloudflare saver**:
   - Open Control Panel → Saving → Cloudflare Saver
   - Enable saving to Cloudflare Functions
   - Enter your endpoint URL
   - Test connection

5. **Remove old configuration** (optional):
   - Delete `$:/config/collaborative-blog/password` (if exists)
   - Old settings won't interfere but aren't used

### Upgrading from v2.0 to v2.1

#### New Features

- ✅ Theme system (5 themes)
- ✅ Custom post types (Event, Gallery, Video, Quote)

#### Migration Steps

1. **Update plugin** (drag and drop new version)
2. **Choose a theme**: Control Panel → Appearance → Theme Selection
3. **Optional**: Update existing posts with new post types
   - Add `Event` tag for events
   - Add `Gallery` tag and `gallery-images` field for galleries
   - Add `Video` tag and `video-url` field for videos
   - Add `Quote` tag and quote fields for quotes

### Upgrading from v2.1 to v2.2

#### New Features

- ✅ Enhanced search (quick search + advanced search)
- ✅ Analytics integration

#### Migration Steps

1. **Update plugin** (drag and drop new version)
2. **Test search**: Click Search tab in sidebar
3. **Optional**: Set up analytics
   - Control Panel → Settings → Analytics
   - Choose provider and configure

---

## Troubleshooting Migrations

### Common Issues

**Issue**: Dates not displaying correctly

**Solution**: Ensure date format is YYYYMMDD (e.g., `20251207`)

```
❌ Wrong: 2025-12-07, 12/07/2025
✅ Correct: 20251207
```

---

**Issue**: Posts not appearing on homepage

**Solution**: Verify tiddlers have:
- `Post` tag (case-sensitive)
- `date` field in YYYYMMDD format
- No `Draft` tag

---

**Issue**: Images not loading

**Solution**:
- Check image URLs are absolute (not relative)
- Ensure images are publicly accessible
- Test URLs in browser first

---

**Issue**: Styles look broken

**Solution**:
- Clear browser cache (Ctrl+Shift+R)
- Verify CSS variables in custom styles
- Check theme is properly selected

---

**Issue**: Search not finding posts

**Solution**:
- Posts must have `Post` tag
- Posts must not have `Draft` tag
- Refresh wiki after adding new posts

---

## Migration Checklist

Use this checklist when migrating:

- [ ] Backup original content
- [ ] Convert posts to tiddler format
- [ ] Add required tags (`Post`, `Page`)
- [ ] Add required fields (`author`, `date`, `excerpt`)
- [ ] Format dates as YYYYMMDD
- [ ] Migrate or host images externally
- [ ] Install TiddlySite plugin
- [ ] Configure site title and subtitle
- [ ] Set up Cloudflare deployment
- [ ] Test all posts display correctly
- [ ] Test navigation links work
- [ ] Test search functionality
- [ ] Test save to GitHub works
- [ ] Configure analytics (optional)
- [ ] Choose and test theme
- [ ] Verify responsive design on mobile
- [ ] Check for console errors (F12)

---

## Need Help?

- **GitHub Issues**: https://github.com/BenSweaterVest/TiddlySite/issues
- **TiddlyWiki Community**: https://talk.tiddlywiki.org/
- **Documentation**: https://tiddlywiki.com/

---

Last Updated: 2025-12-07
