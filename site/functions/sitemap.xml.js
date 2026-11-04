// Sitemap (route: /sitemap.xml). The site is a single page, so search engines
// index the home page; posts are linked with #fragments, which crawlers ignore.
import {xmlEscape} from './_lib/http.js';
import {loadSite, parseDate, publishedPages, publishedPosts, siteInfo} from './_lib/wiki.js';

export function buildSitemap(tiddlers, requestUrl) {
  const site = siteInfo(tiddlers, requestUrl);
  let newest = null;
  for (const fields of [...publishedPosts(tiddlers), ...publishedPages(tiddlers)]) {
    const date = parseDate(fields.modified || fields.date || fields.created);
    if (date && (!newest || date > newest)) {
      newest = date;
    }
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${xmlEscape(site.url + '/')}</loc>`,
    newest ? `    <lastmod>${newest.toISOString().slice(0, 10)}</lastmod>` : '',
    '  </url>',
    '</urlset>',
    ''
  ].filter((line) => line !== '').join('\n');
}

export async function onRequestGet(context) {
  const tiddlers = await loadSite(context);
  if (!tiddlers) {
    return new Response('Site file not found', {status: 404});
  }
  return new Response(buildSitemap(tiddlers, context.request.url), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
