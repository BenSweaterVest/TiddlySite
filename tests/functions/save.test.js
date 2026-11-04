import {test} from 'node:test';
import assert from 'node:assert/strict';
import {onRequest, readRevision} from '../../site/functions/save.js';
import {createMockGitHub, fakeWikiHtml} from '../fixtures/mock-github.js';

const ENV = {GITHUB_TOKEN: 'token', GITHUB_REPO: 'org/site', SAVE_PASSWORD: 'correct horse'};
const SITE = 'https://blog.example.org';

function call(github, {method = 'POST', body, headers = {}, env = ENV} = {}) {
  const init = {method, headers: {'Content-Type': 'application/json', Origin: SITE, ...headers}};
  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  return onRequest({request: new Request(`${SITE}/save`, init), env, fetch: github.fetch});
}

const wiki = fakeWikiHtml([{title: 'Hello', text: 'World'}]);

test('GET reports configuration without secrets', async () => {
  const github = createMockGitHub();
  const response = await call(github, {method: 'GET'});
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.configured, true);
  assert.deepEqual(data.missing, []);

  const partial = await call(github, {method: 'GET', env: {GITHUB_REPO: 'org/site'}});
  const partialData = await partial.json();
  assert.equal(partialData.configured, false);
  assert.deepEqual(partialData.missing, ['GITHUB_TOKEN', 'SAVE_PASSWORD']);
});

test('rejects a wrong password', async () => {
  const github = createMockGitHub();
  const response = await call(github, {body: {password: 'nope', content: wiki, revision: 'r1'}});
  assert.equal(response.status, 401);
  assert.equal(github.state.puts.length, 0);
});

test('rejects other origins unless allowed', async () => {
  const github = createMockGitHub();
  const blocked = await call(github, {headers: {Origin: 'https://evil.example'}, body: {password: ENV.SAVE_PASSWORD, content: wiki, revision: 'r1'}});
  assert.equal(blocked.status, 403);

  const allowed = await call(github, {
    headers: {Origin: 'https://editor.example'},
    env: {...ENV, ALLOWED_ORIGINS: 'https://editor.example'},
    body: {password: ENV.SAVE_PASSWORD, content: wiki, revision: 'r1'}
  });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), 'https://editor.example');
});

test('verify checks the password and GitHub access without committing', async () => {
  const github = createMockGitHub();
  const response = await call(github, {body: {action: 'verify', password: ENV.SAVE_PASSWORD}});
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.repo, 'org/site');
  assert.equal(data.branch, 'main');
  assert.equal(github.state.puts.length, 0);
});

test('saves a new file and records the revision and editor in the commit', async () => {
  const github = createMockGitHub();
  const response = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: wiki, revision: 'rev-1', editor: 'Ada\nLovelace'}});
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.success, true);
  assert.equal(github.state.puts.length, 1);
  const put = github.state.puts[0];
  assert.equal(readRevision(put.message), 'rev-1');
  assert.match(put.message, /edited by Ada Lovelace/);
  assert.equal(Buffer.from(put.content, 'base64').toString('utf8'), wiki);
});

test('round-trips non-ASCII content', async () => {
  const github = createMockGitHub();
  const content = fakeWikiHtml([{title: 'Café', text: 'naïve résumé 日本語 🎉'}]);
  await call(github, {body: {password: ENV.SAVE_PASSWORD, content, revision: 'rev-u'}});
  assert.equal(Buffer.from(github.state.puts[0].content, 'base64').toString('utf8'), content);
});

test('detects a conflicting save and allows an explicit overwrite', async () => {
  const github = createMockGitHub({initialMessage: 'Update site\n\nTiddlySite-Revision: rev-a'});

  const ok = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: wiki, baseRevision: 'rev-a', revision: 'rev-b'}});
  assert.equal(ok.status, 200);

  // A second editor still has rev-a loaded
  const conflict = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: wiki, baseRevision: 'rev-a', revision: 'rev-c'}});
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json()).conflict, true);
  assert.equal(github.state.puts.length, 1);

  const forced = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: wiki, baseRevision: 'rev-a', revision: 'rev-c', force: true}});
  assert.equal(forced.status, 200);
  assert.match(github.state.puts[1].message, /\[overwrite\]/);
});

test('a commit without a revision trailer does not block saving', async () => {
  const github = createMockGitHub({initialMessage: 'Initial upload'});
  const response = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: wiki, baseRevision: '', revision: 'rev-1'}});
  assert.equal(response.status, 200);
});

test('reports a GitHub sha race as a conflict', async () => {
  const github = createMockGitHub();
  github.state.failNextPutWith = 409;
  const response = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: wiki, revision: 'rev-1'}});
  assert.equal(response.status, 409);
});

test('validates the request', async () => {
  const github = createMockGitHub();
  const notWiki = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: 'hello', revision: 'r1'}});
  assert.equal(notWiki.status, 422);
  const badRevision = await call(github, {body: {password: ENV.SAVE_PASSWORD, content: wiki, revision: 'bad revision!'}});
  assert.equal(badRevision.status, 400);
  const badJson = await call(github, {body: '{not json'});
  assert.equal(badJson.status, 400);
  const tooBig = await call(github, {env: {...ENV, MAX_CONTENT_SIZE: '100'}, body: {password: ENV.SAVE_PASSWORD, content: wiki, revision: 'r1'}});
  assert.equal(tooBig.status, 413);
  const wrongType = await call(github, {headers: {'Content-Type': 'text/plain'}, body: {password: 'x'}});
  assert.equal(wrongType.status, 415);
  assert.equal(github.state.puts.length, 0);
});

test('missing settings fail clearly', async () => {
  const github = createMockGitHub();
  const response = await call(github, {env: {GITHUB_REPO: 'org/site'}, body: {password: 'x', content: wiki, revision: 'r1'}});
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /GITHUB_TOKEN/);
});

test('uses the configured branch and file path', async () => {
  const github = createMockGitHub({file: 'site/wiki.html'});
  const env = {...ENV, FILE_PATH: 'site/wiki.html', GITHUB_BRANCH: 'live'};
  const response = await call(github, {env, body: {password: ENV.SAVE_PASSWORD, content: wiki, revision: 'r1'}});
  assert.equal(response.status, 200);
  assert.equal(github.state.puts[0].branch, 'live');
});
