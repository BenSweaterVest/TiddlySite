// Minimal GitHub REST client for the save function.

const API = 'https://api.github.com';

export class GitHubError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export function createGitHub(env, fetchImpl = fetch) {
  const repo = String(env.GITHUB_REPO || '').trim();
  const branch = String(env.GITHUB_BRANCH || '').trim();
  const path = String(env.FILE_PATH || 'index.html').trim().replace(/^\/+/, '');
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');

  async function request(method, url, body) {
    const response = await fetchImpl(API + url, {
      method,
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'TiddlySite-Saver',
        ...(body ? {'Content-Type': 'application/json'} : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = {message: text.slice(0, 200)};
    }
    return {status: response.status, ok: response.ok, data};
  }

  const ref = branch ? `?ref=${encodeURIComponent(branch)}` : '';

  return {
    repo,
    branch,
    path,

    async getRepository() {
      const result = await request('GET', `/repos/${repo}`);
      if (!result.ok) {
        throw new GitHubError(`GitHub could not open ${repo}: ${result.data && result.data.message || result.status}`, result.status);
      }
      return result.data;
    },

    // Latest commit that touched the site file (null for a brand new file)
    async getLatestCommit() {
      const params = new URLSearchParams({path, per_page: '1'});
      if (branch) {
        params.set('sha', branch);
      }
      const result = await request('GET', `/repos/${repo}/commits?${params}`);
      if (result.status === 404 || result.status === 409) {
        return null;
      }
      if (!result.ok) {
        throw new GitHubError(`GitHub commit lookup failed: ${result.data && result.data.message || result.status}`, result.status);
      }
      return Array.isArray(result.data) && result.data.length ? result.data[0] : null;
    },

    async getFileSha() {
      const result = await request('GET', `/repos/${repo}/contents/${encodedPath}${ref}`);
      if (result.status === 404) {
        return null;
      }
      if (!result.ok) {
        throw new GitHubError(`GitHub file lookup failed: ${result.data && result.data.message || result.status}`, result.status);
      }
      return result.data.sha;
    },

    async putFile({contentBase64, sha, message}) {
      const body = {message, content: contentBase64};
      if (sha) {
        body.sha = sha;
      }
      if (branch) {
        body.branch = branch;
      }
      const result = await request('PUT', `/repos/${repo}/contents/${encodedPath}`, body);
      if (result.status === 409 || (result.status === 422 && /sha/i.test(result.data && result.data.message || ''))) {
        throw new GitHubError('The file changed on GitHub while saving', 409, 'conflict');
      }
      if (!result.ok) {
        throw new GitHubError(`GitHub rejected the save: ${result.data && result.data.message || result.status}`, result.status);
      }
      return result.data;
    }
  };
}
