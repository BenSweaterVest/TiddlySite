# TiddlySite starter kit

This folder is a complete website. Put it in a GitHub repository, connect the
repository to Cloudflare Pages, and your editors can publish changes straight
from the browser.

| File | Purpose |
|------|---------|
| `index.html` | The whole website, including the editing tools |
| `functions/save.js` | Receives saves from the site and commits them to GitHub |
| `functions/rss.xml.js`, `sitemap.xml.js`, `robots.txt.js` | Feed and search engine files, generated from `index.html` |
| `_headers` | Security headers for Cloudflare Pages |

## Setup in short

1. Create a GitHub repository and upload these files to it.
2. Create a fine-grained GitHub token for that repository with **Contents: Read and write**.
3. In Cloudflare, go to **Workers & Pages**, create a **Pages** project with **Connect to Git**, and pick the repository. Leave the build command empty and set the output directory to `/`.
4. In the Pages project under **Settings > Variables and Secrets**, add:
   - `GITHUB_TOKEN` (secret): the token from step 2
   - `GITHUB_REPO`: `your-name/your-repository`
   - `SAVE_PASSWORD` (secret): a long password for your editors
5. Redeploy, open your `*.pages.dev` address, choose **Admin** in the sidebar, then **Blog settings > Publishing > Test connection**.

Full guide: https://github.com/BenSweaterVest/TiddlySite/blob/main/docs/DEPLOYMENT.md
