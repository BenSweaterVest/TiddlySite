#!/usr/bin/env node
/*
  Builds the release files into dist/ using TiddlyWiki's own Node.js tooling.

    dist/collaborative-blog-plugin.json   plugin only (drag onto any TiddlyWiki)
    dist/collaborative-blog-plugin.tid    plugin only, .tid format
    dist/collaborative-blog-starter.json  plugin plus example content
    dist/index.html                       complete starter site
    dist/tiddlysite-starter.zip           index.html, Cloudflare functions and headers, ready to upload to GitHub

  Usage: node scripts/build.mjs [--skip-zip]
*/
import {execFileSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const require = createRequire(import.meta.url);
const tiddlywikiBin = require.resolve('tiddlywiki/tiddlywiki.js');

const pluginInfo = JSON.parse(readFileSync(join(root, 'plugins/collaborative-blog/plugin.info'), 'utf8'));
const packageInfo = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (pluginInfo.version !== packageInfo.version) {
  console.error(`Version mismatch: plugin.info is ${pluginInfo.version} but package.json is ${packageInfo.version}`);
  process.exit(1);
}

function tiddlywiki(args) {
  execFileSync(process.execPath, [tiddlywikiBin, join(root, 'editions/starter'), '--output', dist, ...args], {
    cwd: root,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: {...process.env, TIDDLYWIKI_PLUGIN_PATH: join(root, 'plugins')}
  });
}

rmSync(dist, {recursive: true, force: true});
mkdirSync(dist, {recursive: true});

const PLUGIN = '$:/plugins/collaborative-blog';
const STARTER_FILTER = `[[${PLUGIN}]] [all[tiddlers]!is[system]] [[$:/SiteTitle]] [[$:/SiteSubtitle]] [prefix[$:/config/cloudflare-saver/]]`;

tiddlywiki([
  '--render', '.', 'index.html', 'text/plain', '$:/core/save/all',
  '--render', '.', 'collaborative-blog-plugin.json', 'text/plain', '$:/core/templates/exporters/JsonFile', 'exportFilter', `[[${PLUGIN}]]`,
  '--render', PLUGIN, 'collaborative-blog-plugin.tid', 'text/plain', '$:/core/templates/tid-tiddler',
  '--render', '.', 'collaborative-blog-starter.json', 'text/plain', '$:/core/templates/exporters/JsonFile', 'exportFilter', STARTER_FILTER
]);

// Sanity checks on the output
const plugin = JSON.parse(readFileSync(join(dist, 'collaborative-blog-plugin.json'), 'utf8'));
if (plugin.length !== 1 || plugin[0].title !== PLUGIN || plugin[0].version !== pluginInfo.version) {
  console.error('collaborative-blog-plugin.json does not contain the expected plugin');
  process.exit(1);
}
const shadowCount = Object.keys(JSON.parse(plugin[0].text).tiddlers).length;
const html = readFileSync(join(dist, 'index.html'), 'utf8');
if (!html.includes('Collaborative Blog: page metadata')) {
  console.error('index.html is missing the generated head markup');
  process.exit(1);
}

if (!process.argv.includes('--skip-zip')) {
  const staging = join(dist, 'starter');
  mkdirSync(staging, {recursive: true});
  cpSync(join(dist, 'index.html'), join(staging, 'index.html'));
  cpSync(join(root, 'site/functions'), join(staging, 'functions'), {recursive: true});
  cpSync(join(root, 'site/README.md'), join(staging, 'README.md'));
  cpSync(join(root, 'site/_headers'), join(staging, '_headers'));
  const zipPath = join(dist, 'tiddlysite-starter.zip');
  execFileSync('python3', ['-m', 'zipfile', '-c', zipPath, 'index.html', 'functions', '_headers', 'README.md'], {cwd: staging, stdio: 'inherit'});
  rmSync(staging, {recursive: true, force: true});
  if (!existsSync(zipPath)) {
    console.error('Failed to create the starter zip');
    process.exit(1);
  }
}

writeFileSync(join(dist, 'BUILD_INFO.txt'), `Collaborative Blog ${pluginInfo.version}\nPlugin tiddlers: ${shadowCount}\nBuilt: ${new Date().toISOString()}\n`);
console.log(`Built Collaborative Blog ${pluginInfo.version} (${shadowCount} plugin tiddlers) into dist/`);
