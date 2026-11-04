import {after, before, test} from 'node:test';
import assert from 'node:assert/strict';
import {launch, navigate, openSite} from './helpers.js';

let browser;
let page;

before(async () => {
  browser = await launch();
  page = await openSite(browser);
});

after(async () => {
  assert.deepEqual(page.errors, []);
  await browser.close();
});

test('edit controls are hidden until admin mode is on', async () => {
  const post = await navigate(page, 'Welcome to Our New Website');
  assert.equal(await post.locator('.tc-tiddler-controls').isVisible(), false);
  assert.equal(await page.locator('.cb-admin-panel').count(), 0);
  await page.locator('.cb-admin-toggle').click();
  await page.locator('.cb-admin-panel').waitFor();
  assert.equal(await post.locator('.tc-tiddler-controls').isVisible(), true);
  assert.match(await page.locator('.cb-admin-panel').innerText(), /Volunteer Spotlight \(draft\)/);
});

test('creating an event pre-fills tags, date and shows the event form', async () => {
  await page.locator('.cb-admin-panel button', {hasText: 'Event'}).click();
  const editor = page.locator('.tc-tiddler-edit-frame');
  await editor.waitFor();
  const draft = await page.evaluate(() => {
    const title = $tw.wiki.filterTiddlers('[is[draft]]')[0];
    return $tw.wiki.getTiddler(title).fields;
  });
  assert.deepEqual([...draft.tags].sort(), ['Event', 'Post']);
  assert.match(draft.date, /^\d{8}$/);
  assert.equal(await editor.locator('.cb-edit-panel legend').innerText(), 'Post details');
  assert.equal(await editor.locator('.cb-edit-subtitle', {hasText: 'Event'}).count(), 1);

  await editor.locator('.cb-edit-field', {hasText: 'Author'}).locator('input').fill('Grace Hopper');
  await editor.locator('.cb-edit-field', {hasText: 'Location'}).locator('input').fill('Town Hall');
  await editor.locator('.cb-edit-field', {hasText: 'Event date'}).locator('input').fill('2031-01-02');
  await editor.locator('.cb-edit-check', {hasText: 'Featured'}).locator('input').check();
  // The ✓ (confirm changes) button in the editor toolbar
  await editor.locator('button[class*="Buttons%2Fsave"]').click();
  await page.waitForFunction(() => $tw.wiki.filterTiddlers('[is[draft]]').length === 0);
  const saved = await page.evaluate(() => $tw.wiki.getTiddler('New post').fields);
  assert.equal(saved.author, 'Grace Hopper');
  assert.equal(saved['event-location'], 'Town Hall');
  assert.ok(saved.tags.includes('Featured'));

  const home = await navigate(page, 'Home');
  assert.match(await home.locator('.cb-post-card-featured .cb-post-card-title').innerText(), /New post/);
  assert.match(await home.locator('.cb-archive-list').first().innerText(), /New post/);
});

test('the menu editor reorders and removes items', async () => {
  const list = () => page.evaluate(() => $tw.wiki.getTiddlerList('$:/config/collaborative-blog/menu'));
  const before = await list();
  await page.locator('.cb-admin-panel button', {hasText: 'Blog settings'}).click();
  const modal = page.locator('.tc-modal');
  await modal.locator('.tc-tab-buttons button', {hasText: 'Menu'}).click();
  await modal.locator('.cb-menu-editor li', {hasText: 'About'}).locator('button[title="Move down"]').click();
  let after = await list();
  assert.equal(after.indexOf('About'), before.indexOf('About') + 1);
  await modal.locator('.cb-menu-editor li', {hasText: 'Contact'}).locator('button[title="Remove from menu"]').click();
  after = await list();
  assert.ok(!after.includes('Contact'));
  await page.waitForFunction(() => ![...document.querySelectorAll('.cb-nav-menu a')].some((a) => a.textContent === 'Contact'));
  await modal.locator('select').selectOption('Contact');
  await modal.locator('button', {hasText: 'Add'}).click();
  assert.ok((await list()).includes('Contact'));
  await page.locator('.tc-modal-footer button').last().click();
  await page.waitForFunction(() => !document.querySelector('.tc-modal'));
});

test('turning admin off hides the panel again', async () => {
  await page.locator('.cb-admin-toggle').click();
  await page.waitForFunction(() => !document.querySelector('.cb-admin-panel'));
});

test('maintenance removes version 2 leftovers and resets edited built-in pages', async () => {
  await page.evaluate(() => {
    $tw.wiki.addTiddler({title: '$:/plugins/collaborative-blog/Navigation', tags: '$:/tags/PageTemplate', text: '<div class="old-nav">old</div>'});
    $tw.wiki.addTiddler({title: '$:/config/cloudflare-saver/stats/successful-saves', text: '3'});
    $tw.wiki.addTiddler({title: '$:/config/collaborative-blog/theme', text: 'dark'});
    $tw.wiki.addTiddler({title: 'Categories', tags: 'Page', text: 'my old copy'});
    $tw.rootWidget.dispatchEvent({type: 'tm-modal', param: '$:/plugins/collaborative-blog/settings'});
  });
  const modal = page.locator('.tc-modal');
  await modal.locator('.tc-tab-buttons button', {hasText: 'Maintenance'}).click();
  await modal.locator('button', {hasText: 'Remove 2 leftover tiddlers'}).click();
  await modal.locator('button', {hasText: 'Update theme setting'}).click();
  await modal.locator('.cb-setting', {hasText: 'Categories'}).locator('button').click();
  const state = await page.evaluate(() => ({
    nav: $tw.wiki.tiddlerExists('$:/plugins/collaborative-blog/Navigation'),
    stats: $tw.wiki.tiddlerExists('$:/config/cloudflare-saver/stats/successful-saves'),
    theme: $tw.wiki.getTiddlerText('$:/config/collaborative-blog/theme'),
    categoriesOverridden: $tw.wiki.tiddlerExists('Categories'),
    // Regression guard: cleanup must never touch anything else
    untouched: ['About', 'Welcome to Our New Website', '$:/SiteTitle', '$:/plugins/collaborative-blog', '$:/config/cloudflare-saver/enabled'].every((t) => $tw.wiki.tiddlerExists(t))
  }));
  assert.deepEqual(state, {nav: false, stats: false, theme: '$:/plugins/collaborative-blog/themes/dark', categoriesOverridden: false, untouched: true});
  assert.match(await modal.innerText(), /No leftover version 2 tiddlers found/);
  await page.locator('.tc-modal-footer button').last().click();
  await page.evaluate(() => $tw.wiki.deleteTiddler('$:/config/collaborative-blog/theme'));
});
