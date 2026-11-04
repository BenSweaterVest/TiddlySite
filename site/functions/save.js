/*
  TiddlySite save function for Cloudflare Pages (route: /save)

  GET  /save                      health check: is the function configured?
  POST /save {action:"verify"}    checks the password and GitHub access, saves nothing
  POST /save {content, ...}       commits the wiki to GitHub

  Settings (Cloudflare Pages > Settings > Variables and Secrets):
    GITHUB_TOKEN      required, secret. Fine-grained token with Contents: read and write
    GITHUB_REPO       required. owner/repository
    SAVE_PASSWORD     required, secret. Shared by everyone who edits the site
    FILE_PATH         optional. Path of the wiki in the repository (default index.html)
    GITHUB_BRANCH     optional. Branch to commit to (default: the repository's default branch)
    MAX_CONTENT_SIZE  optional. Maximum upload in bytes (default 26214400 = 25 MB)
    ALLOWED_ORIGINS   optional. Extra origins allowed to save, comma separated

  Conflict protection: the wiki sends the revision id it was loaded with
  (baseRevision) and a new one (revision). The new id is written as a trailer in
  the commit message. If the latest commit carries a different id, someone else
  saved in between and the save is refused with HTTP 409 unless force is true.
*/
import {checkOrigin, corsHeaders, json, secretsMatch, utf8ToBase64} from './_lib/http.js';
import {createGitHub, GitHubError} from './_lib/github.js';

const VERSION = '3.0.0';
const TRAILER = 'TiddlySite-Revision';
const DEFAULT_MAX_SIZE = 25 * 1024 * 1024;
const REVISION_PATTERN = /^[A-Za-z0-9-]{1,64}$/;

function missingSettings(env) {
  return ['GITHUB_TOKEN', 'GITHUB_REPO', 'SAVE_PASSWORD'].filter((name) => !String(env[name] || '').trim());
}

export function readRevision(message) {
  const match = String(message || '').match(new RegExp(`^${TRAILER}:\\s*([A-Za-z0-9-]+)\\s*$`, 'm'));
  return match ? match[1] : null;
}

function cleanEditor(name) {
  return String(name || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, 60);
}

function looksLikeTiddlyWiki(content) {
  return content.length > 1000 &&
    /<html[\s>]/i.test(content.slice(0, 2000)) &&
    (content.includes('tiddlywiki-tiddler-store') || content.includes('id="storeArea"'));
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function onRequest(context) {
  const {request, env} = context;
  const cors = corsHeaders(request, env);
  const fetchImpl = context.fetch || fetch;

  if (request.method === 'OPTIONS') {
    return new Response(null, {status: 204, headers: cors});
  }

  const origin = checkOrigin(request, env);
  if (!origin.ok) {
    return json({success: false, error: origin.error}, 403, cors);
  }

  const missing = missingSettings(env);

  if (request.method === 'GET') {
    return json({service: 'tiddlysite-save', version: VERSION, configured: missing.length === 0, missing}, 200, cors);
  }

  if (request.method !== 'POST') {
    return json({success: false, error: 'Method not allowed'}, 405, {...cors, Allow: 'GET, POST, OPTIONS'});
  }

  if (missing.length) {
    return json({success: false, error: `The save function is missing settings: ${missing.join(', ')}`}, 500, cors);
  }

  const maxSize = parseInt(env.MAX_CONTENT_SIZE, 10) || DEFAULT_MAX_SIZE;
  const declaredSize = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (declaredSize > maxSize) {
    return json({success: false, error: `Upload is larger than ${maxSize} bytes`}, 413, cors);
  }
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) {
    return json({success: false, error: 'Expected a JSON request'}, 415, cors);
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > maxSize) {
      return json({success: false, error: `Upload is larger than ${maxSize} bytes`}, 413, cors);
    }
    body = JSON.parse(raw);
  } catch {
    return json({success: false, error: 'Invalid JSON'}, 400, cors);
  }

  if (!(await secretsMatch(body.password, env.SAVE_PASSWORD))) {
    await pause(750); // slow down guessing
    return json({success: false, error: 'Incorrect password'}, 401, cors);
  }

  const github = createGitHub(env, fetchImpl);

  try {
    if (body.action === 'verify') {
      const repository = await github.getRepository();
      const canPush = !repository.permissions || repository.permissions.push !== false;
      if (!canPush) {
        return json({success: false, error: `The token cannot write to ${github.repo}`}, 403, cors);
      }
      return json({success: true, repo: github.repo, branch: github.branch || repository.default_branch, file: github.path}, 200, cors);
    }

    const {content, baseRevision = '', revision, force = false} = body;
    if (typeof content !== 'string' || !content) {
      return json({success: false, error: 'Missing content'}, 400, cors);
    }
    if (!looksLikeTiddlyWiki(content)) {
      return json({success: false, error: 'The content does not look like a TiddlyWiki file'}, 422, cors);
    }
    if (typeof revision !== 'string' || !REVISION_PATTERN.test(revision)) {
      return json({success: false, error: 'Missing or invalid revision'}, 400, cors);
    }
    if (baseRevision && !REVISION_PATTERN.test(String(baseRevision))) {
      return json({success: false, error: 'Invalid base revision'}, 400, cors);
    }

    if (!force) {
      const latest = await github.getLatestCommit();
      const latestRevision = latest ? readRevision(latest.commit && latest.commit.message) : null;
      if (latestRevision && latestRevision !== baseRevision) {
        return json({
          success: false,
          conflict: true,
          error: 'Someone else saved changes after this page was loaded',
          latestCommit: latest.sha,
          latestDate: latest.commit && latest.commit.committer && latest.commit.committer.date
        }, 409, cors);
      }
    }

    const sha = await github.getFileSha();
    const editor = cleanEditor(body.editor);
    const message = `Update site${editor ? ` (edited by ${editor})` : ''}${force ? ' [overwrite]' : ''}\n\n${TRAILER}: ${revision}`;
    const result = await github.putFile({contentBase64: utf8ToBase64(content), sha, message});

    return json({
      success: true,
      commit: result.commit && result.commit.sha,
      revision
    }, 200, cors);
  } catch (error) {
    if (error instanceof GitHubError) {
      if (error.detail === 'conflict') {
        return json({success: false, conflict: true, error: error.message}, 409, cors);
      }
      const status = error.status === 401 || error.status === 403 || error.status === 404 ? 502 : 500;
      console.error('GitHub error', error.status, error.message);
      return json({success: false, error: error.message}, status, cors);
    }
    console.error('Save error', error);
    return json({success: false, error: 'Unexpected error while saving'}, 500, cors);
  }
}
