#!/usr/bin/env node
/*
  Local preview server for trying out editing and saving without Cloudflare.

    npm run build:quick && npm run serve

  Opens http://localhost:8080 with the starter site. The real save function
  runs locally (password: "local", or set SAVE_PASSWORD) and saved changes are
  written back to dist/index.html instead of GitHub.
*/
import {createServer} from 'node:http';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {onRequest as save} from '../site/functions/save.js';
import {onRequestGet as rss} from '../site/functions/rss.xml.js';
import {onRequestGet as sitemap} from '../site/functions/sitemap.xml.js';
import {onRequestGet as robots} from '../site/functions/robots.txt.js';
import {createMockGitHub} from '../tests/fixtures/mock-github.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'dist/index.html');
const port = parseInt(process.env.PORT || '8080', 10);
const password = process.env.SAVE_PASSWORD || 'local';

if (!existsSync(file)) {
  console.error('dist/index.html not found. Run `npm run build:quick` first.');
  process.exit(1);
}

const github = createMockGitHub();
const githubFetch = async (url, init) => {
  const response = await github.fetch(url, init);
  if (init && init.method === 'PUT' && response.ok) {
    const {content} = JSON.parse(init.body);
    writeFileSync(file, Buffer.from(content, 'base64'));
    console.log(`Saved ${file} (${github.state.commits.at(-1).commit.message.split('\n')[0]})`);
  }
  return response;
};
const env = {GITHUB_TOKEN: 'local', GITHUB_REPO: 'org/site', SAVE_PASSWORD: password};
const assets = {fetch: async () => new Response(readFileSync(file))};

const routes = {
  '/save': (request) => save({request, env, fetch: githubFetch}),
  '/rss.xml': (request) => rss({request, env: {ASSETS: assets}}),
  '/sitemap.xml': (request) => sitemap({request, env: {ASSETS: assets}}),
  '/robots.txt': (request) => robots({request, env: {ASSETS: assets}})
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks)
  });
  let response;
  if (routes[url.pathname]) {
    response = await routes[url.pathname](request);
  } else if (url.pathname === '/' || url.pathname === '/index.html') {
    response = new Response(readFileSync(file), {headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'}});
  } else {
    response = new Response('Not found', {status: 404});
  }
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(port, () => {
  console.log(`TiddlySite preview: http://localhost:${port}  (save password: ${password})`);
});
