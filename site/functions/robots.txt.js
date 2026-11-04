// robots.txt (route: /robots.txt), honouring the site's search engine setting
import {loadSite, siteInfo} from './_lib/wiki.js';

export function buildRobots(site) {
  const blocked = /noindex/i.test(site.robots);
  return [
    'User-agent: *',
    blocked ? 'Disallow: /' : 'Allow: /',
    'Disallow: /save',
    '',
    `Sitemap: ${site.url}/sitemap.xml`,
    ''
  ].join('\n');
}

export async function onRequestGet(context) {
  const tiddlers = await loadSite(context) || new Map();
  return new Response(buildRobots(siteInfo(tiddlers, context.request.url)), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
