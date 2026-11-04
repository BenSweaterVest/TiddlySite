// In-memory stand-in for the GitHub REST endpoints the save function uses.
export function createMockGitHub({repo = 'org/site', file = 'index.html', initialMessage = null} = {}) {
  const state = {
    commits: initialMessage ? [{sha: 'c0', commit: {message: initialMessage, committer: {date: '2025-01-01T00:00:00Z'}}}] : [],
    fileSha: initialMessage ? 'blob0' : null,
    puts: [],
    failNextPutWith: null
  };
  let counter = 1;
  const fetch = async (url, init = {}) => {
    const {pathname, searchParams} = new URL(url);
    const method = init.method || 'GET';
    const respond = (status, body) => new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json'}});
    if (!String(init.headers && init.headers.Authorization).startsWith('Bearer ')) {
      return respond(401, {message: 'Bad credentials'});
    }
    if (method === 'GET' && pathname === `/repos/${repo}`) {
      return respond(200, {full_name: repo, default_branch: 'main', permissions: {push: true}});
    }
    if (method === 'GET' && pathname === `/repos/${repo}/commits`) {
      if (searchParams.get('path') !== file) {
        return respond(200, []);
      }
      return respond(200, state.commits.slice(-1).reverse());
    }
    if (pathname === `/repos/${repo}/contents/${file}`) {
      if (method === 'GET') {
        return state.fileSha ? respond(200, {sha: state.fileSha}) : respond(404, {message: 'Not Found'});
      }
      if (method === 'PUT') {
        const body = JSON.parse(init.body);
        if (state.failNextPutWith) {
          const status = state.failNextPutWith;
          state.failNextPutWith = null;
          return respond(status, {message: status === 409 ? 'sha does not match' : 'Server error'});
        }
        if ((body.sha || null) !== state.fileSha) {
          return respond(409, {message: 'sha does not match'});
        }
        const sha = `c${counter++}`;
        state.fileSha = `blob${counter}`;
        state.commits.push({sha, commit: {message: body.message, committer: {date: new Date().toISOString()}}});
        state.puts.push(body);
        return respond(200, {commit: {sha}, content: {sha: state.fileSha}});
      }
    }
    return respond(404, {message: `No mock for ${method} ${pathname}`});
  };
  return {fetch, state};
}

export function fakeWikiHtml(tiddlers = [], extra = '') {
  const store = JSON.stringify(tiddlers).replace(/</g, '\\u003C');
  return `<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>Test</title></head>\n<body class="tc-body">\n${'<!-- padding -->\n'.repeat(80)}<script class="tiddlywiki-tiddler-store" type="application/json">${store}</script>\n${extra}</body>\n</html>\n`;
}
