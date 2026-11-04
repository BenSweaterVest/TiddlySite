import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildFeed, onRequestGet as rss} from '../../site/functions/rss.xml.js';
import {buildSitemap} from '../../site/functions/sitemap.xml.js';
import {onRequestGet as robots} from '../../site/functions/robots.txt.js';
import {parseList, readTiddlers, sortKey, summarize} from '../../site/functions/_lib/wiki.js';
import {fakeWikiHtml} from '../fixtures/mock-github.js';

const tiddlers = [
  {title: '$:/SiteTitle', text: 'Riverside <History> Society'},
  {title: '$:/SiteSubtitle', text: 'Stories & photos'},
  {title: 'Older post', tags: 'Post History', date: '20240101', text: 'Old news.'},
  {title: 'Newer post', tags: 'Post [[Oral History]] Featured', date: '2025-03-04', author: 'Ada', excerpt: 'Fresh & new'},
  {title: 'Secret draft', tags: 'Post Draft', date: '20991231', text: 'hidden'},
  {title: 'About', tags: 'Page', text: 'About us', modified: '20250401120000000'},
  {title: '$:/plugins/x', tags: 'Post', text: '{}'}
];

function context(html, url = 'https://riverside.example/rss.xml') {
  return {
    request: new Request(url),
    env: {ASSETS: {fetch: async () => new Response(html, {status: 200})}}
  };
}

test('parses title lists and stores', () => {
  assert.deepEqual(parseList('Post [[Oral History]] News'), ['Post', 'Oral History', 'News']);
  const map = readTiddlers(fakeWikiHtml(tiddlers));
  assert.equal(map.get('Newer post').author, 'Ada');
  assert.equal(sortKey({date: '2025-03-04'}), '20250304');
  assert.equal(sortKey({created: '20240102030405000'}), '20240102');
});

test('summaries strip wikitext', () => {
  assert.equal(summarize({text: "!! Heading\n\nSome ''bold'' text with a [[Link|Target]].\n\nMore"}), 'Some bold text with a Target.');
});

test('RSS lists published posts newest first with escaping', () => {
  const xml = buildFeed(readTiddlers(fakeWikiHtml(tiddlers)), 'https://riverside.example/rss.xml');
  assert.match(xml, /<title>Riverside &lt;History&gt; Society<\/title>/);
  assert.ok(xml.indexOf('Newer post') < xml.indexOf('Older post'));
  assert.doesNotMatch(xml, /Secret draft/);
  assert.doesNotMatch(xml, /\$:\/plugins/);
  assert.match(xml, /<link>https:\/\/riverside\.example\/#Newer%20post<\/link>/);
  assert.match(xml, /<category>Oral History<\/category>/);
  assert.doesNotMatch(xml, /<category>Featured<\/category>/);
  assert.match(xml, /<description>Fresh &amp; new<\/description>/);
  assert.match(xml, /<dc:creator>Ada<\/dc:creator>/);
});

test('RSS uses the configured site address and can be switched off', async () => {
  const withUrl = fakeWikiHtml([...tiddlers, {title: '$:/config/collaborative-blog/site-url', text: 'https://history.example.org/'}]);
  const response = await rss(context(withUrl));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /https:\/\/history\.example\.org\/#Older%20post/);

  const off = fakeWikiHtml([...tiddlers, {title: '$:/config/collaborative-blog/rss-enabled', text: 'no'}]);
  assert.equal((await rss(context(off))).status, 404);
});

test('sitemap and robots', async () => {
  const xml = buildSitemap(readTiddlers(fakeWikiHtml(tiddlers)), 'https://riverside.example/sitemap.xml');
  assert.match(xml, /<loc>https:\/\/riverside\.example\/<\/loc>/);
  assert.match(xml, /<lastmod>2025-04-01<\/lastmod>/);

  const allow = await (await robots(context(fakeWikiHtml(tiddlers), 'https://riverside.example/robots.txt'))).text();
  assert.match(allow, /Allow: \//);
  assert.match(allow, /Sitemap: https:\/\/riverside\.example\/sitemap\.xml/);

  const blocked = fakeWikiHtml([...tiddlers, {title: '$:/config/collaborative-blog/robots', text: 'noindex, nofollow'}]);
  assert.match(await (await robots(context(blocked, 'https://riverside.example/robots.txt'))).text(), /Disallow: \/\n/);
});
