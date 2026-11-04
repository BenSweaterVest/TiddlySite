# Editing guide

This guide is for the people who write and update the site. No technical knowledge is needed.

## The basics

1. Open the website.
2. Choose **Admin** at the bottom of the left-hand sidebar (on a phone, open **Menu** first). The admin panel appears at the top of the page, and a pencil icon appears on each post and page.
3. Make your changes.
4. Choose **Save changes** in the admin panel, enter the site password and, if you like, your name. Your changes are published and appear on the live site within about a minute.

The admin tools are only visible to you, on your screen. Choosing **Close admin** hides them again.

Until you save, your changes exist only in your browser tab. If you close the tab they are lost. When there are unsaved changes the admin panel says so and the save button shows a dot.

## Writing a post

1. In the admin panel under **Create**, choose the kind of post:
   - **Post**: an ordinary article
   - **Event**: adds a date, time, location and RSVP link
   - **Gallery**: shows a grid of images
   - **Video**: embeds a YouTube or Vimeo video
   - **Quote**: displays a quotation in large type
2. Replace *New post* with your title.
3. Fill in the **Post details** form:
   - **Author**: your name
   - **Publish date**: filled in with today's date. Posts are ordered by this date.
   - **Excerpt**: one or two sentences shown on the home page. If you leave it empty, the first paragraph is used.
   - **Draft**: hides the post from the site while you work on it (see the warning below)
   - **Featured**: shows the post at the top of the home page. Only the newest featured post is shown there.
   - **Favorite**: lists the post in the sidebar
   - **Table of contents**: adds a list of the post's headings at the top
4. Write the post in the large text box. The toolbar above it has buttons for headings, bold, lists, links and so on.
5. Choose the ✓ (tick) button at the top right of the editor to finish editing.
6. Choose **Save changes** to publish.

To change an existing post, open it, choose the pencil icon, edit, then ✓ and **Save changes**.

To delete a post, open it in the editor and choose the bin icon, then save.

### Categories

Categories are tags. In the tags box under the title, type a category such as `History` and choose **add**. A post can have several categories. Readers can click a category to see all posts in it, and the **Categories** page lists them all.

Some tags have special meanings and are not shown as categories: `Post`, `Page`, `Featured`, `Favorite`, `Draft`, `Event`, `Gallery`, `Video` and `Quote`. Do not remove the `Post` tag from a post, or it will disappear from the lists.

Try to reuse existing categories with the same spelling and capitals, so posts end up together.

### Drafts are not private

A draft is hidden from lists, search and the feed, but it is still saved inside the website file, which anyone can download. Never put anything confidential in the site, even in a draft.

## Formatting text

The editor uses TiddlyWiki's formatting. The most useful pieces:

| Write this | To get |
|---|---|
| `!! Heading` | A section heading (`!!! Smaller heading` for a sub-section) |
| `''bold''` | **bold** (two single quotes on each side) |
| `//italic//` | *italic* |
| `* item` | A bulleted list (one item per line) |
| `# item` | A numbered list |
| `[[About]]` | A link to the About page |
| `[[our programme|Events 2025]]` | A link with different wording |
| `[[Plausible|https://plausible.io]]` | A link to another website |
| `<<<` on lines before and after | A quoted block |

The toolbar buttons insert these for you. The **preview** button (an eye icon) shows the result next to the text.

## Events

Fill in **Event date** (use the calendar picker), **Time**, **Location** and optionally an **RSVP link**. The post shows *Upcoming event* until the date passes, then *This event has ended* and hides the RSVP button. Tick **Cancelled** if an event is called off. Upcoming events are listed on the home page.

## Galleries

There are two ways to add images:

- **Image URLs**: paste the address of each image, one per line. This keeps the site small and fast, so it is usually the better choice. Images can be hosted on your organization's website, a photo service or in the GitHub repository.
- **Imported images**: drag image files onto the site to import them, then give each image a tag with the exact title of the gallery post. Add a `caption` field to show a caption and an `alt` field to describe the image for screen readers. Imported images are stored inside the site file and make it bigger, so resize them first (1600 pixels wide is plenty).

## Videos

Paste a YouTube or Vimeo link into **YouTube or Vimeo URL**. Most link formats work, including `youtube.com/watch?v=...`, `youtu.be/...` and `vimeo.com/...`. Add a transcript if you have one; it helps people who cannot listen and is good for accessibility.

## Pages

Pages are for content that is not a dated post, such as About, Contact or Membership. Choose **Page** under **Create** in the admin panel.

To show a page in the sidebar menu: **Blog settings > Menu**, choose the page in the list and choose **Add**. Use the arrows to change the order. To give a page a shorter menu label, add a field called `caption` with the label.

## Saving and other editors

Saving sends the whole site, so if someone else saved since you opened the page, you will see a message saying another editor has saved changes. You can:

- choose **Cancel**, copy anything you need from your edits, reload the page, make your change again and save; or
- choose **OK** to replace their version with yours. Only do this if you know their changes do not matter. Nothing is permanently lost, because every version is kept in GitHub and can be restored.

To avoid this, reload the site before you start editing and save as soon as you finish each change.

If "Remember the password until I close this page" is ticked in the save dialog, you will not be asked again until you close or reload the page. Only use it on your own device.

## Blog settings

Choose **Blog settings** in the admin panel:

- **General**: site title, tagline, site address, default author, number of posts on the home page, date format
- **Theme**: the colour scheme and fonts
- **Menu**: the pages in the sidebar menu
- **Publishing**: the connection to GitHub, and the connection test
- **Sharing & SEO**: the description and picture used when the site is shared on social media
- **Analytics**: visitor statistics
- **Maintenance**: tidying up after an upgrade

Remember to choose **Save changes** after changing settings too.
