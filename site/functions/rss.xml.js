// RSS feed for the site, generated from the deployed wiki file (route: /rss.xml)
import {xmlEscape} from './_lib/http.js';
import {loadSite, parseDate, parseList, permalink, publishedPosts, siteInfo, summarize} from './_lib/wiki.js';

const RESERVED = ['Post', 'Page', 'Featured', 'Favorite', 'Draft', 'Event', 'Gallery', 'Video', 'Quote'];

export function buildFeed(tiddlers, requestUrl, limit = 20) {
  const site = siteInfo(tiddlers, requestUrl);
  const reserved = new Set(parseList(tiddlers.get('$:/config/collaborative-blog/reserved-tags')?.text).concat(RESERVED));
  const posts = publishedPosts(tiddlers).slice(0, limit);
  const latest = posts.length ? parseDate(posts[0].modified || posts[0].date || posts[0].created) : null;
  const items = posts.map((post) => {
    const date = parseDate(post.date || post.created);
    const categories = post.tagList.filter((tag) => !reserved.has(tag) && !tag.startsWith('$:/'));
    return [
      '    <item>',
      `      <title>${xmlEscape(post.title)}</title>`,
      `      <link>${xmlEscape(permalink(site.url, post.title))}</link>`,
      `      <guid isPermaLink="true">${xmlEscape(permalink(site.url, post.title))}</guid>`,
      date ? `      <pubDate>${date.toUTCString()}</pubDate>` : '',
      post.author ? `      <dc:creator>${xmlEscape(post.author)}</dc:creator>` : '',
      `      <description>${xmlEscape(summarize(post))}</description>`,
      ...categories.map((tag) => `      <category>${xmlEscape(tag)}</category>`),
      '    </item>'
    ].filter(Boolean).join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${xmlEscape(site.title)}</title>`,
    `    <link>${xmlEscape(site.url + '/')}</link>`,
    `    <description>${xmlEscape(site.description || site.title)}</description>`,
    `    <atom:link href="${xmlEscape(site.url + '/rss.xml')}" rel="self" type="application/rss+xml" />`,
    latest ? `    <lastBuildDate>${latest.toUTCString()}</lastBuildDate>` : '',
    '    <generator>TiddlySite</generator>',
    ...items,
    '  </channel>',
    '</rss>',
    ''
  ].filter((line) => line !== '').join('\n');
}

export async function onRequestGet(context) {
  const tiddlers = await loadSite(context);
  if (!tiddlers) {
    return new Response('Site file not found', {status: 404});
  }
  if (!siteInfo(tiddlers, context.request.url).rssEnabled) {
    return new Response('The RSS feed is turned off', {status: 404});
  }
  return new Response(buildFeed(tiddlers, context.request.url), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
