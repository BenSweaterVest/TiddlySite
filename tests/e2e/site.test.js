import {after, before, describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {filter, launch, navigate, openSite, renderSaveFile, setTiddler} from './helpers.js';

let browser;
let page;

before(async () => {
  browser = await launch();
  page = await openSite(browser);
});

after(async () => {
  assert.deepEqual(page.errors, [], 'no page errors');
  await browser.close();
});

describe('home page', () => {
  test('shows the featured post, upcoming events and latest posts', async () => {
    const home = await navigate(page, 'Home');
    const featured = home.locator('.cb-post-card-featured');
    assert.equal(await featured.count(), 1);
    assert.match(await featured.locator('.cb-post-card-title').innerText(), /Welcome to Our New Website/);
    assert.match(await home.locator('.cb-section-heading').first().innerText(), /Upcoming events/i);
    const latest = await home.locator('.cb-post-card:not(.cb-post-card-featured) .cb-post-card-title').allInnerTexts();
    assert.ok(latest.length >= 4);
    assert.ok(!latest.some((title) => /Welcome to Our New Website/.test(title)), 'featured post is not repeated');
    assert.ok(!latest.some((title) => /draft/i.test(title)), 'drafts are hidden');
  });

  test('renders no raw wikitext and no stray paragraphs around cards', async () => {
    const text = await page.locator('.tc-story-river').innerText();
    assert.doesNotMatch(text, /<\$|\$:\/|\\(whitespace|procedure|function)/);
    assert.equal(await page.locator('.tc-story-river p > article, .tc-story-river p > div.cb-post-card').count(), 0);
  });
});

describe('posts', () => {
  test('show one title, meta, categories without reserved tags', async () => {
    const post = await navigate(page, 'Welcome to Our New Website');
    assert.equal(await post.locator('h1:visible, h2.tc-title:visible').count(), 1);
    assert.equal(await post.locator('.tc-tags-wrapper:visible').count(), 0);
    const meta = await post.locator('.cb-post-header .cb-post-meta').innerText();
    assert.match(meta, /By\s+Sarah Johnson/);
    assert.match(meta, /8 November 2025/);
    assert.match(meta, /\d+ min read/);
    const categories = await post.locator('.cb-post-header .cb-category-tag').allInnerTexts();
    assert.deepEqual(categories, ['News']);
  });

  test('multi-word categories link to a category archive', async () => {
    const post = await navigate(page, 'Community Voices: An Interview with Mary Thompson');
    await post.locator('.cb-post-header .cb-category-tag', {hasText: 'Oral History'}).click();
    const category = await navigate(page, 'Oral History');
    assert.match(await category.locator('.cb-post-title').innerText(), /Oral History/);
    assert.equal(await category.locator('.cb-post-card').count(), 1);
  });

  test('event posts show details and an RSVP link while upcoming', async () => {
    const post = await navigate(page, 'Annual Heritage Walking Tour');
    const details = post.locator('.cb-event-details');
    assert.match(await details.innerText(), /Upcoming event/);
    assert.match(await details.innerText(), /18 May 2030/);
    assert.equal(await details.locator('a.cb-button').count(), 1);

    await setTiddler(page, {title: 'Past Event', tags: 'Post Event', date: '20200101', 'event-date': '2020-02-02', 'event-rsvp-link': 'https://example.org', text: 'Done'});
    const past = await navigate(page, 'Past Event');
    assert.match(await past.locator('.cb-event-details').innerText(), /This event has ended/);
    assert.equal(await past.locator('.cb-event-details a.cb-button').count(), 0);
  });

  test('table of contents lists clean headings and scrolls to them', async () => {
    const post = await navigate(page, 'Annual Heritage Walking Tour');
    const items = await post.locator('.cb-toc-link').allInnerTexts();
    assert.deepEqual(items, ['What to expect', 'What to bring', 'Accessibility']);
    await post.locator('.cb-toc-link', {hasText: 'Accessibility'}).click();
    await page.waitForFunction(() => document.activeElement && document.activeElement.textContent.trim() === 'Accessibility');
  });

  test('gallery shows tagged images with captions', async () => {
    const post = await navigate(page, 'Main Street Through the Years');
    assert.equal(await post.locator('.cb-gallery-item img').count(), 3);
    assert.deepEqual(await post.locator('.cb-gallery-item figcaption').allInnerTexts(), ['Main Street, 1910', 'Main Street, 1955', 'Main Street, 2020']);
  });

  test('video posts embed YouTube and Vimeo links privately', async () => {
    await setTiddler(page, {title: 'Video A', tags: 'Post Video', date: '20250101', 'video-url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s'});
    let post = await navigate(page, 'Video A');
    assert.equal(await post.locator('iframe').getAttribute('src'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    await setTiddler(page, {title: 'Video B', tags: 'Post Video', date: '20250101', 'video-url': 'https://youtu.be/dQw4w9WgXcQ'});
    post = await navigate(page, 'Video B');
    assert.equal(await post.locator('iframe').getAttribute('src'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    await setTiddler(page, {title: 'Video C', tags: 'Post Video', date: '20250101', 'video-url': 'https://vimeo.com/76979871'});
    post = await navigate(page, 'Video C');
    assert.equal(await post.locator('iframe').getAttribute('src'), 'https://player.vimeo.com/video/76979871');
    await setTiddler(page, {title: 'Video D', tags: 'Post Video', date: '20250101', 'video-url': 'https://example.org/clip.mp4'});
    post = await navigate(page, 'Video D');
    assert.equal(await post.locator('iframe').count(), 0);
    assert.match(await post.locator('.cb-notice').innerText(), /can't be embedded/);
  });

  test('quote posts show the quotation and attribution', async () => {
    const post = await navigate(page, 'Words from Our Founder');
    assert.match(await post.locator('.cb-quote-text').innerText(), /A community that remembers its past/);
    assert.match(await post.locator('.cb-quote-attribution').innerText(), /Eleanor Hartley.*Opening address, 1962/);
  });

  test('older and newer links follow the post date order', async () => {
    const post = await navigate(page, 'Preserving Local History in the Digital Age');
    assert.match(await post.locator('.cb-post-nav-newer').innerText(), /Welcome to Our New Website/);
    assert.match(await post.locator('.cb-post-nav-older').innerText(), /Community Voices/);
  });
});

describe('archive, categories and search', () => {
  test('archive groups posts by year without repeats', async () => {
    const archive = await navigate(page, 'All Posts');
    const years = await archive.locator('.cb-archive-year').allInnerTexts();
    assert.deepEqual(years, [...new Set(years)]);
    const titles = await archive.locator('.cb-archive-list a').allInnerTexts();
    assert.equal(titles.length, new Set(titles).size);
  });

  test('categories exclude reserved tags', async () => {
    const categories = await filter(page, '[cb.categories[]]');
    for (const reserved of ['Post', 'Page', 'Featured', 'Favorite', 'Draft', 'Event', 'Gallery', 'Video', 'Quote']) {
      assert.ok(!categories.includes(reserved), `${reserved} is not a category`);
    }
    assert.ok(categories.includes('Oral History'));
  });

  test('search filters by text, category, type and author', async () => {
    const search = await navigate(page, 'Search');
    const count = async () => parseInt(await search.locator('.cb-search-summary span').first().innerText(), 10);
    await search.locator('.cb-search-main input').fill('history');
    await page.waitForTimeout(300);
    const all = await count();
    assert.ok(all >= 3);
    await search.locator('select').nth(1).selectOption('Research');
    await page.waitForTimeout(200);
    assert.equal(await count(), 1);
    await search.locator('.cb-search-summary button').click();
    await search.locator('select').nth(0).selectOption('Gallery');
    await page.waitForTimeout(200);
    assert.deepEqual(await search.locator('.cb-post-card-title').allInnerTexts(), ['Main Street Through the Years']);
    await search.locator('.cb-search-summary button').click();
    await search.locator('select').nth(2).selectOption('Michael Chen');
    await page.waitForTimeout(200);
    const authors = await search.locator('.cb-post-author').allInnerTexts();
    assert.ok(authors.length >= 1 && authors.every((a) => /Michael Chen/.test(a)));
    await search.locator('.cb-search-summary button').click();
  });

  test('sidebar search shows quick results', async () => {
    await page.locator('.cb-quick-search input').fill('mary');
    await page.waitForSelector('.cb-quick-results li a');
    assert.match(await page.locator('.cb-quick-results').innerText(), /Community Voices/);
    await page.locator('.cb-quick-search input').fill('');
  });
});

describe('themes and layout', () => {
  test('switching theme updates the colours immediately', async () => {
    const accent = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cb-accent').trim());
    assert.equal(await accent(), '#8b3a2b');
    await setTiddler(page, {title: '$:/config/collaborative-blog/theme', text: '$:/plugins/collaborative-blog/themes/dark'});
    await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--cb-accent').trim() === '#8ab4f8');
    // Short theme names from older versions still work
    await setTiddler(page, {title: '$:/config/collaborative-blog/theme', text: 'modern'});
    await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--cb-accent').trim() === '#0055d4');
    await page.evaluate(() => $tw.wiki.deleteTiddler('$:/config/collaborative-blog/theme'));
    await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--cb-accent').trim() === '#8b3a2b');
  });

  test('mobile layout collapses the menu and does not scroll sideways', async () => {
    const mobile = await openSite(browser, {viewport: {width: 375, height: 800}});
    assert.equal(await mobile.locator('.cb-nav-menu').isVisible(), false);
    await mobile.locator('.cb-nav-toggle').click();
    await mobile.locator('.cb-nav-menu').waitFor({state: 'visible'});
    assert.equal(await mobile.locator('.cb-nav-toggle').getAttribute('aria-expanded'), 'true');
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `no horizontal overflow (${overflow}px)`);
    assert.deepEqual(mobile.errors, []);
    await mobile.close();
  });
});

describe('saved file', () => {
  test('head contains escaped metadata and opt-in analytics', async () => {
    await setTiddler(page, {title: '$:/config/collaborative-blog/site-url', text: 'https://history.example.org/'});
    await setTiddler(page, {title: '$:/config/collaborative-blog/site-description', text: 'Say "hello" <b>'});
    let html = await renderSaveFile(page);
    let head = html.slice(0, html.indexOf('</head>'));
    assert.match(head, /<meta name="description" content="Say &quot;hello&quot; &lt;b&gt;" \/>/);
    assert.match(head, /<link rel="canonical" href="https:\/\/history\.example\.org\/" \/>/);
    assert.match(head, /<link rel="alternate" type="application\/rss\+xml"/);
    assert.doesNotMatch(head, /<\$|plausible/);

    await setTiddler(page, {title: '$:/config/collaborative-blog/analytics/enabled', text: 'yes'});
    await setTiddler(page, {title: '$:/config/collaborative-blog/analytics/domain', text: 'history.example.org'});
    html = await renderSaveFile(page);
    head = html.slice(0, html.indexOf('</head>'));
    assert.match(head, /<script defer data-domain="history\.example\.org" src="https:\/\/plausible\.io\/js\/script\.js"><\/script>/);
  });

  test('admin and search state is not saved into the file', async () => {
    await setTiddler(page, {title: '$:/temp/cb/admin', text: 'yes'});
    await setTiddler(page, {title: '$:/temp/cb/search', text: 'secret query'});
    const html = await renderSaveFile(page);
    assert.doesNotMatch(html, /secret query/);
    assert.doesNotMatch(html, /"title":"\$:\/temp\/cb\/admin"/);
    await setTiddler(page, {title: '$:/temp/cb/admin', text: 'no'});
  });
});
