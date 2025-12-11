# SEO Guide for TiddlySite

This guide covers search engine optimization (SEO) best practices for your TiddlySite blog.

## Built-in SEO Features

TiddlySite includes several SEO features out of the box:

### 1. RSS Feed

Generate an RSS feed for search engines and feed readers:

**File**: `$:/plugins/collaborative-blog/rss-feed`

**Setup**:
1. Configure your site URL:
   - Edit `$:/config/collaborative-blog/site-url`
   - Set to your full URL (e.g., `https://yourblog.pages.dev`)

2. Access your RSS feed at:
   - Create a tiddler that renders the RSS feed
   - Export as static XML file
   - Upload to your site as `rss.xml`

**RSS Feed Example**:
The RSS feed automatically includes:
- Latest 20 posts
- Post titles, descriptions, dates
- Author information
- Category tags
- Permalinks

### 2. XML Sitemap

Generate a sitemap for search engines:

**File**: `$:/plugins/collaborative-blog/sitemap`

**Setup**:
1. Configure your site URL (same as RSS)
2. Render the sitemap tiddler
3. Export as `sitemap.xml`
4. Upload to your site root

**Sitemap includes**:
- Homepage
- All published blog posts (not drafts)
- Static pages
- Last modification dates
- Change frequency hints
- Priority levels

### 3. Social Media Meta Tags

Improve social sharing with Open Graph and Twitter Cards:

**File**: `$:/plugins/collaborative-blog/social-meta-tags`

**Setup**:
1. Configure social settings:
   - `$:/config/collaborative-blog/og-image`: Your social share image URL
   - `$:/config/collaborative-blog/twitter-handle`: Your Twitter/X handle (e.g., `@yourusername`)

2. Meta tags automatically generated for:
   - Open Graph (Facebook, LinkedIn)
   - Twitter Cards
   - Basic SEO meta tags

**What's included**:
- `og:title`, `og:description`, `og:image`
- `twitter:card`, `twitter:title`, `twitter:description`
- `description`, `author`, `canonical` tags

### 4. Semantic HTML

TiddlySite uses SEO-friendly semantic HTML:
- `<article>` for blog posts
- `<nav>` for navigation
- `<header>` and `<footer>` for sections
- Proper `<h1>`-`<h6>` hierarchy
- `<time>` elements for dates

## SEO Best Practices

### 1. Write Quality Content

**Content is king**:
- Write original, valuable content
- Aim for 500+ words per post (longer for key topics)
- Update content regularly
- Answer user questions
- Provide unique insights

**Content structure**:
```
!! Main Topic: How to Preserve Historical Documents

!!! Why Document Preservation Matters
[Introduction paragraph with key points]

!!! Best Practices for Preservation
[Detailed content with examples]

!!! Common Mistakes to Avoid
[List of mistakes with explanations]

!!! Conclusion
[Summary and call to action]
```

### 2. Optimize Titles and Headings

**Title optimization**:
- Include primary keyword
- Keep under 60 characters
- Make titles compelling
- Be specific and descriptive

**Good examples**:
```
✅ "How to Restore Antique Photographs: A Step-by-Step Guide"
✅ "The History of Main Street: 1920-2025"
✅ "Top 10 Local Historical Sites You Must Visit"
```

**Bad examples**:
```
❌ "Photos" (too vague)
❌ "Click Here for the Most Amazing Incredible Historical Information You'll Ever Read in Your Entire Life" (too long, clickbait)
❌ "Post #47" (no keywords)
```

**Heading hierarchy**:
```
!! Main Title (h2) - One per post, includes primary keyword

!!! Section Heading (h3) - Multiple, include related keywords

!!!! Subsection (h4) - As needed for detailed breakdowns
```

### 3. Use Descriptive URLs

TiddlyWiki uses tiddler titles as URLs (after the `#`):

**Good**:
```
title: Historic Main Street Walking Tour
URL: .../#Historic%20Main%20Street%20Walking%20Tour
```

**Bad**:
```
title: Post 1
URL: .../#Post%201
```

**Tips**:
- Use descriptive titles (they become URLs)
- Include keywords in titles
- Keep titles concise but descriptive
- Avoid special characters

### 4. Write Effective Excerpts

Excerpts become meta descriptions:

**Good excerpt**:
```
excerpt: Discover 10 must-visit historical sites in our town, from the 1850s courthouse to the restored Victorian train station. Complete with visitor info and historical photos.
```

**Bad excerpt**:
```
excerpt: This post talks about stuff.
```

**Excerpt best practices**:
- 150-160 characters ideal
- Include primary keyword
- Make it compelling (searchers will read this)
- Accurately describe content
- Include a call to action

### 5. Optimize Images

**Image SEO**:
1. **Use descriptive filenames**:
   ```
   ✅ mainstreet-1920-courthouse.jpg
   ❌ IMG_0047.jpg
   ```

2. **Add alt text**:
   ```
   [img[Historic courthouse in 1920 showing horse carriages and brick facade|images/courthouse-1920.jpg]]
   ```

3. **Compress images**:
   - Use tools like TinyPNG or ImageOptim
   - Aim for < 200KB per image
   - Use appropriate formats (JPG for photos, PNG for graphics)

4. **Use responsive images**:
   - Provide multiple sizes if possible
   - Let browser choose appropriate size

### 6. Internal Linking

Link related content together:

**Example**:
```
For more information, see our [[Guide to Archive Research]] and [[Historical Photography Tips]].

Related posts:
* [[Understanding Historical Deeds]]
* [[Local History Resources]]
* [[Genealogy Research Guide]]
```

**Benefits**:
- Helps search engines understand site structure
- Keeps visitors on site longer
- Distributes page authority
- Improves crawlability

**Best practices**:
- Use descriptive anchor text (not "click here")
- Link to related content naturally
- Don't overdo it (3-5 links per post is fine)
- Create topic clusters (hub and spoke model)

### 7. External Linking

Link to authoritative sources:

**Example**:
```
According to the [National Archives](https://www.archives.gov/), proper document preservation requires...

Learn more about this topic at the [Library of Congress](https://www.loc.gov/).
```

**Benefits**:
- Shows you've done research
- Provides value to readers
- Builds trust
- May get reciprocal links

### 8. Use Categories and Tags

Organize content with tags:

```
title: Victorian Architecture in Our Town
tags: Post Architecture History Victorian Featured
```

**Benefits**:
- Creates topical organization
- Enables category pages
- Helps users find related content
- May appear in search results

**Best practices**:
- Use 3-5 tags per post
- Be consistent with tag names
- Create category pages for major topics
- Don't over-tag

### 9. Keep Content Fresh

Update existing content:

**Why update**:
- Search engines favor fresh content
- Outdated information hurts credibility
- Shows site is active and maintained

**What to update**:
- Add new information
- Update statistics and dates
- Fix broken links
- Improve formatting
- Add new images
- Expand sections

**How to show updates**:
```
''Last updated: December 7, 2025'' - Added information about recent courthouse restoration.
```

### 10. Page Load Speed

**Optimization tips**:
- Compress images before uploading
- Use external image hosting for many images
- Keep total wiki size reasonable (< 10MB ideal)
- Minimize embedded videos (link instead)
- Use lazy loading for images

**Tools to test**:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## Technical SEO Setup

### 1. Submit Sitemap to Search Engines

**Google Search Console**:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (your website URL)
3. Verify ownership (via HTML file upload or meta tag)
4. Submit sitemap: `https://yoursite.com/sitemap.xml`

**Bing Webmaster Tools**:
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site and verify
3. Submit sitemap

### 2. Set Up robots.txt

Create a `robots.txt` file in your site root:

```
User-agent: *
Allow: /
Sitemap: https://your-site.pages.dev/sitemap.xml

# Optional: Disallow archiving of system pages
Disallow: /#$:/
```

### 3. Configure Canonical URLs

The social meta tags tiddler includes canonical URLs automatically:

```html
<link rel="canonical" href="https://yoursite.pages.dev" />
```

This prevents duplicate content issues.

### 4. Set Up Analytics

Track SEO performance with analytics:

1. Set up analytics in Control Panel → Settings → Analytics
2. Choose privacy-friendly option (Plausible or Simple Analytics)
3. Monitor:
   - Organic search traffic
   - Top landing pages
   - Bounce rate
   - Time on page
   - Conversions

### 5. Structured Data (Schema.org)

Add structured data for rich search results:

**Blog post schema** (create as new tiddler):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{!!title}}",
  "datePublished": "{{!!date}}",
  "dateModified": "{{!!modified}}",
  "author": {
    "@type": "Person",
    "name": "{{!!author}}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{$:/SiteTitle}}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{$:/config/collaborative-blog/og-image}}"
    }
  },
  "description": "{{!!excerpt}}"
}
</script>
```

Test with [Google's Rich Results Test](https://search.google.com/test/rich-results).

## Content Strategy

### Keyword Research

**Tools**:
- [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/)
- [Google Trends](https://trends.google.com/)
- [Answer the Public](https://answerthepublic.com/)
- [Ubersuggest](https://neilpatel.com/ubersuggest/)

**Process**:
1. Brainstorm topics relevant to your audience
2. Research search volume and competition
3. Find long-tail keywords (3-4+ words)
4. Target low competition, relevant keywords
5. Create content around those keywords

**Example for historical society**:
- Primary: "local history" (high competition)
- Long-tail: "Victorian architecture walking tour [city name]" (low competition, more specific)

### Content Calendar

Plan content in advance:

```
| Date | Topic | Keyword | Status |
| 2025-01-15 | Victorian Architecture Tour | victorian architecture [city] | Draft |
| 2025-01-22 | Courthouse Restoration Update | historic courthouse restoration | Scheduled |
| 2025-01-29 | Archive Research Guide | how to research local history | In Progress |
```

### Topic Clusters

Create hub and spoke model:

**Hub (pillar content)**:
- "Complete Guide to Local History Research" (comprehensive, 2000+ words)

**Spokes (supporting content)**:
- "How to Use Our Archives"
- "Reading Historical Deeds"
- "Genealogy Resources"
- "Historical Maps Guide"
- "Oral History Interview Tips"

Each spoke links to hub, hub links to all spokes.

## Monitoring and Improvement

### Track Rankings

**Tools**:
- Google Search Console (free, essential)
- Bing Webmaster Tools (free)
- [Moz](https://moz.com/) (paid)
- [Ahrefs](https://ahrefs.com/) (paid)
- [SEMrush](https://www.semrush.com/) (paid)

**What to track**:
- Keyword rankings
- Organic traffic
- Click-through rate (CTR)
- Average position
- Impressions

### Analyze Performance

**Google Search Console metrics**:
1. **Total clicks**: How many people visited from search
2. **Total impressions**: How many times your site appeared in search
3. **Average CTR**: Clicks ÷ impressions (aim for > 2%)
4. **Average position**: Where you rank (aim for top 10)

**Improvement actions**:
- Low impressions → Target better keywords
- Low CTR → Improve titles and descriptions
- Low average position → Create better content, build links
- High bounce rate → Improve content quality

### Build Backlinks

**Strategies for historical societies**:
1. **Local organizations**: Partner with city, chamber of commerce
2. **Press releases**: For events and discoveries
3. **Guest blogging**: Write for related blogs
4. **Resource pages**: Get listed on "local history resources" pages
5. **Social media**: Share content on Facebook, Twitter
6. **Community events**: Get mentioned on event calendars
7. **Academic partnerships**: Work with local universities

**Quality over quantity**:
- One link from a relevant, authoritative site > 100 spam links
- Focus on earning links through quality content
- Avoid buying links or link schemes

## Common SEO Mistakes to Avoid

### 1. Keyword Stuffing

**Bad**:
```
!! Best historical society history museum local history historic sites

Our historical society offers the best local history resources for learning about local history in our historic town with historic sites and historical documents and local history research and history museum exhibits about local history.
```

**Good**:
```
!! Welcome to Our Historical Society

Discover the rich heritage of our town through our museum exhibits, archival research resources, and historic site tours.
```

### 2. Duplicate Content

**Avoid**:
- Copying content from other sites
- Creating multiple tiddlers with same content
- Thin content (< 150 words)

**Instead**:
- Write original content
- Provide unique perspectives
- Expand and improve upon existing topics

### 3. Missing Meta Descriptions

Always add excerpts (they become meta descriptions):

```
title: My Great Post
tags: Post History
author: Jane Doe
date: 20251207
excerpt: A compelling description of what this post is about (150-160 characters).
```

### 4. Ignoring Mobile

- Test on mobile devices
- Ensure responsive design (TiddlySite is mobile-friendly)
- Check mobile PageSpeed score
- Mobile-first indexing means Google uses mobile version for ranking

### 5. Slow Page Speed

- Optimize images
- Minimize file size
- Use external hosting for large media
- Enable compression
- Test with PageSpeed Insights

## SEO Checklist

Use this checklist for each new post:

- [ ] **Title**: Includes keyword, < 60 characters, compelling
- [ ] **Excerpt**: 150-160 characters, includes keyword, compelling
- [ ] **Content**: 500+ words, original, valuable
- [ ] **Headings**: Proper hierarchy (h2 → h3 → h4)
- [ ] **Images**: Optimized, descriptive alt text, < 200KB
- [ ] **Links**: 3-5 internal links, 1-2 external authoritative links
- [ ] **Tags**: 3-5 relevant tags
- [ ] **Date**: Proper format (YYYYMMDD)
- [ ] **Author**: Attributed correctly
- [ ] **Proofreading**: No spelling/grammar errors
- [ ] **Mobile**: Tested on mobile device
- [ ] **Analytics**: Tracking configured

## Additional Resources

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs Blog](https://ahrefs.com/blog/)
- [Search Engine Journal](https://www.searchenginejournal.com/)
- [Google Search Central Blog](https://developers.google.com/search/blog)

---

Last Updated: 2025-12-07
