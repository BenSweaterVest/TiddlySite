# Deploying a TiddlySite

This guide sets up a site where editors publish from the browser:

```
Editor's browser  --(Save changes + password)-->  Cloudflare Pages Function /save
                                                         |
                                                         v
                                              GitHub repository (index.html)
                                                         |
                                                         v
                                        Cloudflare Pages rebuilds the public site
```

You need a GitHub account and a Cloudflare account. Both free plans are enough. Allow about 15 minutes.

## 1. Create the repository

1. Download `tiddlysite-starter.zip` from the [releases page](https://github.com/BenSweaterVest/TiddlySite/releases) and unzip it. It contains `index.html`, a `functions` folder, `_headers` and a short README.
2. Create a repository at <https://github.com/new>. Private repositories work.
3. Upload the unzipped files (keep the `functions` folder structure) and commit.

Already have a TiddlyWiki? Install the plugin into it (drag `collaborative-blog-plugin.json` onto it, import, save), name the file `index.html`, and upload it together with the `functions` folder and `_headers` from the starter kit.

## 2. Create a GitHub token

Use a fine-grained personal access token so the token can only touch this one repository:

1. Open <https://github.com/settings/personal-access-tokens/new>.
2. Give it a name such as `TiddlySite saves` and an expiry date. Put a reminder in your calendar to renew it.
3. **Repository access**: *Only select repositories*, then pick your site repository.
4. **Permissions > Repository permissions > Contents**: *Read and write*. Nothing else is needed.
5. Generate the token and copy it.

If your organization does not allow fine-grained tokens, a classic token with the `repo` scope also works, but it can reach every repository you can.

## 3. Create the Cloudflare Pages project

1. In the Cloudflare dashboard open **Workers & Pages**, choose **Create**, then the **Pages** tab and **Connect to Git**.
2. Authorize GitHub and select your repository.
3. Build settings: **Framework preset** *None*, **Build command** empty, **Build output directory** `/`.
4. Save and deploy. Your site appears at `https://<project>.pages.dev`.

## 4. Add the settings

In the Pages project open **Settings > Variables and Secrets** and add these for the **Production** environment:

| Name | Type | Required | Value |
|------|------|----------|-------|
| `GITHUB_TOKEN` | Secret | Yes | The token from step 2 |
| `GITHUB_REPO` | Text | Yes | `owner/repository`, for example `riverside-history/website` |
| `SAVE_PASSWORD` | Secret | Yes | A long password (four or more random words) shared with your editors |
| `FILE_PATH` | Text | No | Path of the wiki in the repository. Default `index.html` |
| `GITHUB_BRANCH` | Text | No | Branch to commit to. Default: the repository's default branch |
| `MAX_CONTENT_SIZE` | Text | No | Largest accepted upload in bytes. Default `26214400` (25 MB) |
| `ALLOWED_ORIGINS` | Text | No | Other sites allowed to save, comma separated (only needed if the editing copy lives on a different domain) |

Then go to **Deployments** and choose **Retry deployment** on the latest one so the function picks up the settings.

## 5. Test and publish

1. Open your site, choose **Admin** at the bottom of the sidebar, then **Blog settings > Publishing**.
2. Check that **Save through Cloudflare** is ticked and the endpoint is `/save`.
3. Choose **Test connection**. It checks the function and your password without saving anything.
4. Make a change and choose **Save changes**. The commit appears in GitHub immediately and the site updates when Cloudflare finishes deploying (usually under a minute).

Before going live, open **Blog settings > General** and set the site title, tagline and site address, and delete or rewrite the example posts.

## Custom domain

In the Pages project open **Custom domains** and follow the steps. Then update **Blog settings > General > Site address** so share links, feeds and preview tags use your domain.

## Several editors

Everyone uses the same `SAVE_PASSWORD`. Each editor can enter their name in the save dialog; it is recorded in the GitHub commit message, so the repository history shows who changed what.

Each save sends the whole site. To stop editors overwriting each other, every saved file carries a revision id and the function refuses a save made from an out-of-date copy. The editor sees a warning and can either cancel (then reload to get the latest version and redo their change) or deliberately overwrite. Overwrites are marked `[overwrite]` in the commit history, and any version can be restored from GitHub.

Good habits: reload the site before starting an editing session, and save after each finished change rather than at the end of a long session.

## Security notes

- The save password is checked on the server with a constant-time comparison and a short delay after each wrong attempt. It is never written into the site file. If "remember password" is ticked it is kept in memory only until the page is closed.
- The GitHub token lives only in Cloudflare. Use a fine-grained token limited to one repository with Contents access only, and give it an expiry date.
- Saves from other websites are refused unless listed in `ALLOWED_ORIGINS`.
- The function only accepts content that looks like a TiddlyWiki file and below `MAX_CONTENT_SIZE`.
- For extra protection against password guessing, add a Cloudflare **Rate limiting rule** (Security > WAF) for `POST` requests to `/save`, for example 10 requests per minute per IP.
- Everything in `index.html` is public, including drafts and settings. Never put passwords or private notes in the wiki.
- To rotate the password, change `SAVE_PASSWORD` and redeploy. To revoke access quickly, delete the GitHub token.

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| Test connection: "Could not reach /save" | The site is opened from a file or another host. Open the `pages.dev` or custom domain address. |
| "The save service was not found" (404) | The `functions` folder is missing or not at the repository root. Check that `functions/save.js` exists, then redeploy. |
| "missing settings: ..." | Add the listed variables (step 4) and redeploy. |
| "The password was not accepted" | Passwords are case-sensitive. Check `SAVE_PASSWORD` in Cloudflare. |
| GitHub errors (502) such as "Bad credentials" or "Resource not accessible" | The token expired or lacks Contents read and write on this repository. Create a new token and update `GITHUB_TOKEN`. |
| "Another editor saved first" | See [Several editors](#several-editors). Reload, redo your change, save. |
| "larger than the save service allows" (413) | Raise `MAX_CONTENT_SIZE`, or reduce the file size by linking to images instead of importing them. |
| Saved but the site has not changed | Cloudflare is still deploying (see Deployments in the dashboard). Then hard-refresh (Ctrl+Shift+R or Cmd+Shift+R). |
| Saving downloads a file instead | The page was opened from a local file, or publishing is switched off in Blog settings. |

Function logs are in the Cloudflare dashboard under the Pages project, **Functions > Real-time logs**.

## Running without Cloudflare

The plugin works with any TiddlyWiki saving method. If publishing is switched off, TiddlyWiki falls back to its usual savers (for example downloading a copy, or a browser extension). You can host the resulting `index.html` on any static host; the RSS, sitemap and robots functions are Cloudflare-specific and will be missing elsewhere.
