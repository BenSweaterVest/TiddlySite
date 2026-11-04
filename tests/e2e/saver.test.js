import {after, before, beforeEach, test} from 'node:test';
import assert from 'node:assert/strict';
import {launch, openSite, PASSWORD, startServer} from './helpers.js';

let browser;
let server;

before(async () => {
  browser = await launch();
});

beforeEach(async () => {
  if (server) {
    await server.close();
  }
  server = await startServer();
});

after(async () => {
  await server.close();
  await browser.close();
});

async function edit(page, text) {
  await page.evaluate((t) => $tw.wiki.addTiddler({title: 'Edited', tags: 'Post', date: '20250101', text: t}), text);
  await page.waitForFunction(() => document.body.classList.contains('tc-dirty'));
}

async function startSave(page) {
  await page.evaluate(() => $tw.rootWidget.dispatchEvent({type: 'tm-save-wiki'}));
  await page.locator('.cb-dialog').waitFor();
}

test('publishes through the save function with a masked password prompt', async () => {
  const page = await openSite(browser, {url: server.url});
  const alerts = [];
  page.on('dialog', (dialog) => {
    alerts.push(dialog.message());
    dialog.dismiss();
  });
  await edit(page, 'first version');
  await startSave(page);
  assert.equal(await page.locator('.cb-dialog input[type="password"]').count(), 1);

  // Wrong password: the dialog comes back with an error
  await page.locator('.cb-dialog-password').fill('wrong');
  await page.locator('.cb-dialog-editor').fill('Ada');
  await page.locator('.cb-dialog-primary').click();
  await page.locator('.cb-dialog-error', {hasText: 'not accepted'}).waitFor();

  await page.locator('.cb-dialog-password').fill(PASSWORD);
  await page.locator('.cb-dialog-primary').click();
  await page.waitForFunction(() => !document.body.classList.contains('tc-dirty'));

  assert.equal(server.github.state.puts.length, 1);
  const put = server.github.state.puts[0];
  assert.match(put.message, /edited by Ada/);
  const html = Buffer.from(put.content, 'base64').toString('utf8');
  assert.match(html, /first version/);
  const revision = await page.evaluate(() => $tw.wiki.getTiddlerText('$:/state/cloudflare-saver/revision'));
  assert.match(put.message, new RegExp(`TiddlySite-Revision: ${revision}`));
  assert.ok(html.includes(revision), 'saved file carries its own revision');
  assert.deepEqual(alerts, []);
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('cancelling the prompt leaves the changes unsaved and does not download', async () => {
  const page = await openSite(browser, {url: server.url});
  let downloaded = false;
  page.on('download', () => {
    downloaded = true;
  });
  await edit(page, 'cancel me');
  await startSave(page);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.cb-dialog').count(), 0);
  assert.ok(await page.evaluate(() => document.body.classList.contains('tc-dirty')));
  assert.equal(server.github.state.puts.length, 0);
  assert.equal(downloaded, false);
  await page.close();
});

test('a second editor with an old copy is warned instead of overwriting', async () => {
  const first = await openSite(browser, {url: server.url});
  const second = await openSite(browser, {url: server.url});

  await edit(first, 'from editor one');
  await startSave(first);
  await first.locator('.cb-dialog-password').fill(PASSWORD);
  await first.locator('.cb-dialog-primary').click();
  await first.waitForFunction(() => !document.body.classList.contains('tc-dirty'));

  const messages = [];
  second.on('dialog', (dialog) => {
    messages.push(dialog.type() + ': ' + dialog.message());
    dialog.dismiss();
  });
  await edit(second, 'from editor two');
  await startSave(second);
  await second.locator('.cb-dialog-password').fill(PASSWORD);
  await second.locator('.cb-dialog-primary').click();
  await second.waitForFunction(() => window.__done = true);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  assert.equal(server.github.state.puts.length, 1, 'second save was not committed');
  assert.ok(messages.some((m) => m.startsWith('confirm:') && /Someone else has saved/.test(m)));
  assert.ok(messages.some((m) => m.startsWith('alert:') && /another editor saved first/i.test(m)));
  assert.ok(await second.evaluate(() => document.body.classList.contains('tc-dirty')), 'changes stay unsaved');

  // Choosing to overwrite works and is marked in the history
  second.removeAllListeners('dialog');
  second.on('dialog', (dialog) => (dialog.type() === 'confirm' ? dialog.accept() : dialog.dismiss()));
  await second.evaluate(() => $tw.rootWidget.dispatchEvent({type: 'tm-save-wiki'}));
  await second.locator('.cb-dialog').waitFor();
  await second.locator('.cb-dialog-password').fill(PASSWORD);
  await second.locator('.cb-dialog-primary').click();
  await second.waitForFunction(() => !document.body.classList.contains('tc-dirty'));
  assert.equal(server.github.state.puts.length, 2);
  assert.match(server.github.state.puts[1].message, /\[overwrite\]/);
  await first.close();
  await second.close();
});

test('remembered password is reused and test connection commits nothing', async () => {
  const page = await openSite(browser, {url: server.url});
  await edit(page, 'remember');
  await startSave(page);
  await page.locator('.cb-dialog-password').fill(PASSWORD);
  await page.locator('.cb-dialog-remember').check();
  await page.locator('.cb-dialog-primary').click();
  await page.waitForFunction(() => !document.body.classList.contains('tc-dirty'));

  await edit(page, 'remember again');
  await page.evaluate(() => $tw.rootWidget.dispatchEvent({type: 'tm-save-wiki'}));
  await page.waitForFunction(() => !document.body.classList.contains('tc-dirty'));
  assert.equal(await page.locator('.cb-dialog').count(), 0, 'no prompt the second time');
  assert.equal(server.github.state.puts.length, 2);

  await page.evaluate(() => {
    $tw.wiki.addTiddler({title: '$:/temp/cb/admin', text: 'yes'});
    $tw.rootWidget.dispatchEvent({type: 'tm-modal', param: '$:/plugins/collaborative-blog/settings'});
  });
  const modal = page.locator('.tc-modal');
  await modal.locator('.tc-tab-buttons button', {hasText: 'Publishing'}).click();
  await modal.locator('button', {hasText: 'Test connection'}).click();
  await modal.locator('.cb-status-success').waitFor();
  assert.match(await modal.locator('.cb-status-success').innerText(), /Connected/);
  assert.equal(server.github.state.puts.length, 2, 'test connection did not commit');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('opening the file locally falls back to TiddlyWiki download saving', async () => {
  const page = await openSite(browser);
  await edit(page, 'offline');
  const download = page.waitForEvent('download', {timeout: 5000});
  await page.evaluate(() => $tw.rootWidget.dispatchEvent({type: 'tm-save-wiki'}));
  await download;
  assert.equal(await page.locator('.cb-dialog').count(), 0);
  await page.close();
});
