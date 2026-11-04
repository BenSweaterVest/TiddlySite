// Reads tiddlers out of a saved TiddlyWiki file (TiddlyWiki 5.2 and later).

const STORE_PATTERN = /<script class="tiddlywiki-tiddler-store" type="application\/json">([\s\S]*?)<\/script>/g;

export function readTiddlers(html) {
  const tiddlers = new Map();
  for (const match of html.matchAll(STORE_PATTERN)) {
    let list;
    try {
      list = JSON.parse(match[1]);
    } catch {
      continue;
    }
    if (Array.isArray(list)) {
      for (const fields of list) {
        if (fields && typeof fields.title === 'string') {
          tiddlers.set(fields.title, fields);
        }
      }
    }
  }
  return tiddlers;
}

// Parses a TiddlyWiki title list such as: Post News [[Oral History]]
export function parseList(value) {
  const results = [];
  const pattern = /(?:^|\s)(?:\[\[(.*?)\]\])(?=\s|$)|([^\s]+)/g;
  for (const match of String(value || '').matchAll(pattern)) {
    const item = match[1] !== undefined ? match[1] : match[2];
    if (item) {
      results.push(item);
    }
  }
  return results;
}

export function getText(tiddlers, title, fallback = '') {
  const tiddler = tiddlers.get(title);
  const text = tiddler && typeof tiddler.text === 'string' ? tiddler.text.trim() : '';
  return text || fallback;
}

// YYYYMMDD sort key from the date field (YYYYMMDD or YYYY-MM-DD) or created
export function sortKey(fields) {
  const raw = String(fields.date || fields.created || '').replace(/-/g, '');
  const match = raw.match(/^(\d{8})/);
  return match ? match[1] : '00000000';
}

// TiddlyWiki date string (YYYYMMDD[HHMMSSmmm]) to a JavaScript Date (UTC)
export function parseDate(value) {
  const raw = String(value || '').replace(/-/g, '');
  const match = raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);
  if (!match) {
    return null;
  }
  const [, y, m, d, hh = '12', mm = '00', ss = '00'] = match;
  const date = new Date(Date.UTC(+y, +m - 1, +d, +hh, +mm, +ss));
  return isNaN(date.getTime()) ? null : date;
}

export function publishedPosts(tiddlers) {
  const posts = [];
  for (const fields of tiddlers.values()) {
    if (fields.title.startsWith('$:/') || fields['draft.of']) {
      continue;
    }
    const tags = parseList(fields.tags);
    if (tags.includes('Post') && !tags.includes('Draft')) {
      posts.push({...fields, tagList: tags});
    }
  }
  return posts.sort((a, b) => sortKey(b).localeCompare(sortKey(a)) || a.title.localeCompare(b.title));
}

export function publishedPages(tiddlers) {
  const pages = [];
  for (const fields of tiddlers.values()) {
    if (fields.title.startsWith('$:/') || fields['draft.of']) {
      continue;
    }
    const tags = parseList(fields.tags);
    if (tags.includes('Page') && !tags.includes('Draft')) {
      pages.push(fields);
    }
  }
  return pages;
}

// Rough plain-text summary of wikitext for feeds
export function summarize(fields, maxLength = 300) {
  if (fields.excerpt) {
    return String(fields.excerpt).trim();
  }
  const paragraphs = String(fields.text || '').split(/\n\s*\n/).map((p) => p.trim());
  const first = paragraphs.find((p) => p && !/^[!<|\\*#{]/.test(p)) || '';
  const plain = first
    .replace(/\[\[([^|\]]*\|)?([^\]]*)\]\]/g, '$2')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/<<[^>]*>>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/''|\/\/|__|~~|\^\^|,,|`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLength ? plain.slice(0, maxLength - 1).replace(/\s+\S*$/, '') + '…' : plain;
}

export function siteInfo(tiddlers, requestUrl) {
  const configured = getText(tiddlers, '$:/config/collaborative-blog/site-url').replace(/\/+$/, '');
  return {
    url: configured || new URL(requestUrl).origin,
    title: getText(tiddlers, '$:/SiteTitle', 'TiddlySite'),
    description: getText(tiddlers, '$:/config/collaborative-blog/site-description') || getText(tiddlers, '$:/SiteSubtitle'),
    rssEnabled: getText(tiddlers, '$:/config/collaborative-blog/rss-enabled', 'yes') !== 'no',
    robots: getText(tiddlers, '$:/config/collaborative-blog/robots', 'index, follow')
  };
}

export function permalink(siteUrl, title) {
  return `${siteUrl}/#${encodeURIComponent(title)}`;
}

// Loads the deployed site file through the Pages static asset binding
export async function loadSite(context) {
  const {request, env} = context;
  const path = String(env.FILE_PATH || 'index.html').replace(/^\/+/, '');
  const assetUrl = new URL(path === 'index.html' ? '/' : `/${path}`, request.url);
  const response = await env.ASSETS.fetch(new Request(assetUrl.toString(), {method: 'GET'}));
  if (!response.ok) {
    return null;
  }
  return readTiddlers(await response.text());
}
