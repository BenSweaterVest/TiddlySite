// Shared helpers for the browser tests. Run `npm run build:quick` first.
import {createServer} from 'node:http';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {chromium} from 'playwright';
import {onRequest as saveHandler} from '../../site/functions/save.js';
import {onRequestGet as rssHandler} from '../../site/functions/rss.xml.js';
import {createMockGitHub} from '../fixtures/mock-github.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const SITE_FILE = join(root, 'dist/index.html');

if (!existsSync(SITE_FILE)) {
  throw new Error('dist/index.html is missing. Run `npm run build:quick` first.');
}

export const PASSWORD = 'test-password';

export async function launch() {
  return chromium.launch(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {});
}

/*
  Serves the built site and runs the real Cloudflare functions locally, with
  GitHub replaced by an in-memory mock.
*/
export async function startServer() {
  const html = readFileSync(SITE_FILE, 'utf8');
  const github = createMockGitHub({initialMessage: null});
  const env = {GITHUB_TOKEN: 'token', GITHUB_REPO: 'org/site', SAVE_PASSWORD: PASSWORD};
  const server = createServer(async (req, res) => {
    const url = `http://127.0.0.1:${server.address().port}${req.url}`;
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const request = new Request(url, {method: req.method, headers: req.headers, body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body});
    let response;
    const path = new URL(url).pathname;
    if (path === '/save') {
      response = await saveHandler({request, env, fetch: github.fetch});
    } else if (path === '/rss.xml') {
      response = await rssHandler({request, env: {ASSETS: {fetch: async () => new Response(html)}}});
    } else if (path === '/' || path === '/index.html') {
      response = new Response(html, {headers: {'Content-Type': 'text/html; charset=utf-8'}});
    } else {
      response = new Response('Not found', {status: 404});
    }
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}/`,
    github,
    close: () => new Promise((resolve) => server.close(resolve))
  };
}

export async function openSite(browser, {url = 'file://' + SITE_FILE, viewport = {width: 1280, height: 900}} = {}) {
  const page = await browser.newPage({viewport});
  page.errors = [];
  page.on('pageerror', (error) => page.errors.push(error.message));
  await page.goto(url);
  await page.waitForSelector('.cb-sidebar');
  return page;
}

export async function navigate(page, title) {
  await page.evaluate((target) => {
    $tw.wiki.addTiddler({title: '$:/StoryList', list: $tw.utils.stringifyList([target])});
  }, title);
  // The zoomin story view keeps the outgoing copy briefly; wait until only one remains
  await page.waitForFunction((target) => {
    const frames = [...document.querySelectorAll('.tc-story-river > .tc-tiddler-frame, .tc-story-river .tc-storyview-zoomin-tiddler')]
      .filter((frame) => frame.getAttribute('data-tiddler-title') === target);
    const all = document.querySelectorAll('.tc-story-river [data-tiddler-title]');
    return frames.length === 1 && [...all].filter((f) => f.classList.contains('tc-tiddler-frame')).length === 1;
  }, title);
  return page.locator('.tc-story-river .tc-tiddler-frame').first();
}

export async function setTiddler(page, fields) {
  await page.evaluate((f) => $tw.wiki.addTiddler(new $tw.Tiddler(f)), fields);
}

// Evaluates a filter with the plugin's global functions available
export async function filter(page, expression) {
  return page.evaluate((f) => {
    const wikitext = '\\import [all[shadows+tiddlers]tag[$:/tags/Global]]\n<$text text={{{ [subfilter<f>format:titlelist[]join[ ]] }}}/>';
    const text = $tw.wiki.renderText('text/plain', 'text/vnd.tiddlywiki', wikitext, {variables: {f}});
    return $tw.utils.parseStringArray(text);
  }, expression);
}

export async function renderSaveFile(page) {
  return page.evaluate(() => $tw.wiki.renderTiddler('text/plain', '$:/core/save/all'));
}
